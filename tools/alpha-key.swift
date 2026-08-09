#!/usr/bin/env swift
//
// alpha-key.swift — adds an alpha channel to an opaque generated PNG.
//
// Gemini cannot output transparency, so images are generated on a flat, keyable
// background and the background is removed here.
//
//   luminance mode — black ink line art on pure white
//     swift tools/alpha-key.swift in.png out.png --mode luminance [--threshold 240] [--band 60]
//
//   chroma mode — photographic objects on flat magenta
//     swift tools/alpha-key.swift in.png out.png --mode chroma [--key FF00FF] [--tolerance 60]
//
// No packages. CoreGraphics + ImageIO only, both in the macOS SDK.
//

import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

// ── argument parsing ─────────────────────────────────────────────────────────

let args = CommandLine.arguments

func usage() -> Never {
    print("""
    alpha-key — remove a flat background and write a transparent PNG

    USAGE
      swift tools/alpha-key.swift <in.png> <out.png> --mode luminance [--threshold 240] [--band 60]
      swift tools/alpha-key.swift <in.png> <out.png> --mode chroma [--key FF00FF] [--tolerance 60]

    MODES
      luminance   black line art on pure white. Pixels brighter than --threshold
                  become transparent, ramped over --band for clean anti-aliasing.
      chroma      objects on a flat colour. Pixels within --tolerance of --key
                  become transparent, with magenta de-fringing applied after.
    """)
    exit(args.count <= 1 ? 0 : 1)
}

guard args.count >= 4 else { usage() }

let inPath = args[1]
let outPath = args[2]

func flag(_ name: String) -> String? {
    guard let i = args.firstIndex(of: "--\(name)"), i + 1 < args.count else { return nil }
    return args[i + 1]
}

let mode = flag("mode") ?? "luminance"
guard mode == "luminance" || mode == "chroma" else {
    FileHandle.standardError.write("error: --mode must be 'luminance' or 'chroma'\n".data(using: .utf8)!)
    exit(1)
}

let threshold = Double(flag("threshold") ?? "240") ?? 240
let band      = max(1.0, Double(flag("band") ?? "60") ?? 60)
let tolerance = max(1.0, Double(flag("tolerance") ?? "70") ?? 70)

// --key is a HINT, not the truth. A generated "#FF00FF" background is almost never
// exactly FF00FF once it has been through the model's renderer, a colour profile and
// PNG/JPEG encoding — in testing it arrived as (255, 64, 255). So the actual background
// is sampled from the image corners below, and this value is only the fallback.
let keyHex = (flag("key") ?? "FF00FF").replacingOccurrences(of: "#", with: "")
guard keyHex.count == 6, let keyInt = Int(keyHex, radix: 16) else {
    FileHandle.standardError.write("error: --key must be six hex digits, e.g. FF00FF\n".data(using: .utf8)!)
    exit(1)
}
var keyR = Double((keyInt >> 16) & 0xFF)
var keyG = Double((keyInt >> 8) & 0xFF)
var keyB = Double(keyInt & 0xFF)
let keyWasExplicit = flag("key") != nil && args.contains("--no-autodetect")

// ── load ─────────────────────────────────────────────────────────────────────

let inURL = URL(fileURLWithPath: inPath)
guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
    FileHandle.standardError.write("error: could not read \(inPath)\n".data(using: .utf8)!)
    exit(1)
}

let w = image.width, h = image.height
let bytesPerRow = w * 4
var buf = [UInt8](repeating: 0, count: bytesPerRow * h)

guard let ctx = CGContext(data: &buf, width: w, height: h,
                          bitsPerComponent: 8, bytesPerRow: bytesPerRow,
                          space: CGColorSpaceCreateDeviceRGB(),
                          bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else {
    FileHandle.standardError.write("error: could not create bitmap context\n".data(using: .utf8)!)
    exit(1)
}
ctx.draw(image, in: CGRect(x: 0, y: 0, width: w, height: h))

// ── detect the actual background colour from the corners ─────────────────────
//
// Sample an 8x8 patch at each corner, then take the per-channel MEDIAN across the
// four. Median rather than mean, so one corner containing part of the subject does
// not drag the key off target.

func cornerPatchAverage(_ x0: Int, _ y0: Int) -> (Double, Double, Double) {
    var r = 0.0, g = 0.0, b = 0.0, n = 0.0
    for y in y0..<min(y0 + 8, h) {
        for x in x0..<min(x0 + 8, w) {
            let i = (y * w + x) * 4
            r += Double(buf[i]); g += Double(buf[i + 1]); b += Double(buf[i + 2]); n += 1
        }
    }
    return n == 0 ? (0, 0, 0) : (r / n, g / n, b / n)
}

var detectedKey: (Double, Double, Double)? = nil

if mode == "chroma" && !keyWasExplicit {
    let corners = [
        cornerPatchAverage(0, 0),
        cornerPatchAverage(max(0, w - 8), 0),
        cornerPatchAverage(0, max(0, h - 8)),
        cornerPatchAverage(max(0, w - 8), max(0, h - 8)),
    ]
    func median(_ vals: [Double]) -> Double {
        let s = vals.sorted()
        return (s[1] + s[2]) / 2
    }
    let dr = median(corners.map { $0.0 })
    let dg = median(corners.map { $0.1 })
    let db = median(corners.map { $0.2 })

    // Only trust it if it actually looks like the key hue — otherwise the image
    // probably wasn't generated on the expected background and we should say so
    // rather than silently keying out something arbitrary.
    let driftFromNominal = ((dr - keyR) * (dr - keyR) + (dg - keyG) * (dg - keyG) + (db - keyB) * (db - keyB)).squareRoot()
    if driftFromNominal < 120 {
        keyR = dr; keyG = dg; keyB = db
        detectedKey = (dr, dg, db)
    }
}

// ── key ──────────────────────────────────────────────────────────────────────

var clearedPixels = 0

for i in stride(from: 0, to: buf.count, by: 4) {
    var r = Double(buf[i]), g = Double(buf[i + 1]), b = Double(buf[i + 2])
    var alpha: Double

    if mode == "luminance" {
        // Perceptual luminance. Bright = background.
        let lum = 0.299 * r + 0.587 * g + 0.114 * b
        // Fully transparent at >= threshold, fully opaque at <= threshold - band,
        // ramped in between so the linework keeps its anti-aliasing. A hard binary
        // cut here is what makes keyed line art look jagged.
        alpha = min(1.0, max(0.0, (threshold - lum) / band))
    } else {
        let dr = r - keyR, dg = g - keyG, db = b - keyB
        let dist = (dr * dr + dg * dg + db * db).squareRoot()
        // Fully transparent within tolerance, ramping to opaque at 2x tolerance.
        alpha = min(1.0, max(0.0, (dist - tolerance) / tolerance))

        // De-fringe: pixels that survived but carry key spill get pulled back
        // toward neutral. Without this every cut-out ships with a pink halo.
        // On a near-greyscale subject r≈g≈b, so this is a no-op where it should be.
        if alpha > 0 {
            let m = (r + b) / 2
            if m > g {
                let spill = m - g
                r = max(0, r - spill)
                b = max(0, b - spill)
            }
        }
    }

    if alpha <= 0.001 { clearedPixels += 1 }

    // Context is premultipliedLast, so scale colour by alpha.
    buf[i]     = UInt8(max(0, min(255, r * alpha)))
    buf[i + 1] = UInt8(max(0, min(255, g * alpha)))
    buf[i + 2] = UInt8(max(0, min(255, b * alpha)))
    buf[i + 3] = UInt8(max(0, min(255, alpha * 255)))
}

// ── write ────────────────────────────────────────────────────────────────────

guard let outImage = ctx.makeImage() else {
    FileHandle.standardError.write("error: could not build output image\n".data(using: .utf8)!)
    exit(1)
}

let outURL = URL(fileURLWithPath: outPath)
guard let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil) else {
    FileHandle.standardError.write("error: could not create \(outPath)\n".data(using: .utf8)!)
    exit(1)
}
CGImageDestinationAddImage(dest, outImage, nil)
guard CGImageDestinationFinalize(dest) else {
    FileHandle.standardError.write("error: could not write \(outPath)\n".data(using: .utf8)!)
    exit(1)
}

// ── report ───────────────────────────────────────────────────────────────────

func kb(_ url: URL) -> String {
    let attrs = try? FileManager.default.attributesOfItem(atPath: url.path)
    let n = (attrs?[.size] as? Int) ?? 0
    return String(format: "%.0f KB", Double(n) / 1024)
}

let pct = Double(clearedPixels) / Double(w * h) * 100

var line = String(format: "%@  %dx%d  %@ → %@  |  %.1f%% transparent",
                  (inPath as NSString).lastPathComponent, w, h, kb(inURL), kb(outURL), pct)
if let k = detectedKey {
    line += String(format: "  (bg detected #%02X%02X%02X)", Int(k.0), Int(k.1), Int(k.2))
}
print(line)

// Sane ranges differ by mode. Line art is mostly empty paper, so 85-99% transparent
// is correct and healthy — flagging that as an error would cry wolf on every figure.
// A cut-out object fills much more of its frame.
if mode == "luminance" {
    if pct < 40 {
        print("  ⚠️  Only \(Int(pct))% cleared. The background may not be white —")
        print("     check the generation, or raise --threshold (default 240).")
    } else if pct > 99.6 {
        print("  ⚠️  Nearly everything cleared. The linework was keyed out too —")
        print("     lower --threshold, or the drawing is too light/grey to key this way.")
    }
} else {
    if pct < 5 {
        print("  ⚠️  Almost nothing cleared. The background isn't close to the key colour.")
        print("     Run with --tolerance 100, or check what the background actually is.")
    } else if pct > 95 {
        print("  ⚠️  Almost everything cleared — the subject was keyed out too.")
        print("     Lower --tolerance (default 70).")
    }
}
