#!/usr/bin/env swift
//
// trim-alpha.swift — crop a transparent PNG down to its actual content.
//
// Gemini returns everything at one fixed canvas size (2816x1536 in practice),
// so a portrait figure arrives centred in a wide landscape frame surrounded by
// empty space. Once the background is keyed out that space is transparent, and
// keeping it costs real bytes and makes the image impossible to size in CSS —
// the element's box would be mostly nothing.
//
// This finds the bounding box of everything with meaningful alpha and crops to it.
//
//   swift tools/trim-alpha.swift in.png out.png [--pad 12] [--threshold 8]
//
// --pad        pixels of transparent margin to keep around the content
// --threshold  alpha value (0-255) below which a pixel counts as empty
//

import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments

guard args.count >= 3 else {
    print("""
    trim-alpha — crop a transparent PNG to its content bounding box

    USAGE
      swift tools/trim-alpha.swift <in.png> <out.png> [--pad 12] [--threshold 8]
    """)
    exit(args.count <= 1 ? 0 : 1)
}

let inPath = args[1], outPath = args[2]

func flag(_ n: String) -> String? {
    guard let i = args.firstIndex(of: "--\(n)"), i + 1 < args.count else { return nil }
    return args[i + 1]
}
let pad = Int(flag("pad") ?? "12") ?? 12
let alphaThreshold = UInt8(min(255, max(0, Int(flag("threshold") ?? "8") ?? 8)))

guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: inPath) as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
    FileHandle.standardError.write("error: could not read \(inPath)\n".data(using: .utf8)!)
    exit(1)
}

let w = image.width, h = image.height
var buf = [UInt8](repeating: 0, count: w * h * 4)
guard let ctx = CGContext(data: &buf, width: w, height: h, bitsPerComponent: 8,
                          bytesPerRow: w * 4, space: CGColorSpaceCreateDeviceRGB(),
                          bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else {
    FileHandle.standardError.write("error: bitmap context failed\n".data(using: .utf8)!)
    exit(1)
}
ctx.draw(image, in: CGRect(x: 0, y: 0, width: w, height: h))

// ── find the content bounding box ────────────────────────────────────────────

var minX = w, minY = h, maxX = -1, maxY = -1

for y in 0..<h {
    let row = y * w * 4
    for x in 0..<w {
        if buf[row + x * 4 + 3] > alphaThreshold {
            if x < minX { minX = x }
            if x > maxX { maxX = x }
            if y < minY { minY = y }
            if y > maxY { maxY = y }
        }
    }
}

guard maxX >= minX, maxY >= minY else {
    FileHandle.standardError.write("error: \(inPath) is entirely transparent — nothing to trim\n".data(using: .utf8)!)
    exit(1)
}

minX = max(0, minX - pad); minY = max(0, minY - pad)
maxX = min(w - 1, maxX + pad); maxY = min(h - 1, maxY + pad)

let cropW = maxX - minX + 1
let cropH = maxY - minY + 1

// CGImage origin is top-left for cropping purposes here because the context was
// drawn without a flip, so the buffer row order matches cropping coordinates.
guard let cropped = image.cropping(to: CGRect(x: minX, y: minY, width: cropW, height: cropH)) else {
    FileHandle.standardError.write("error: crop failed\n".data(using: .utf8)!)
    exit(1)
}

guard let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: outPath) as CFURL,
                                                 UTType.png.identifier as CFString, 1, nil) else {
    FileHandle.standardError.write("error: could not create \(outPath)\n".data(using: .utf8)!)
    exit(1)
}
CGImageDestinationAddImage(dest, cropped, nil)
guard CGImageDestinationFinalize(dest) else {
    FileHandle.standardError.write("error: could not write \(outPath)\n".data(using: .utf8)!)
    exit(1)
}

let reduction = 100.0 - (Double(cropW * cropH) / Double(w * h) * 100.0)
print(String(format: "%@  %dx%d → %dx%d  (%.0f%% of the canvas was empty)",
             (inPath as NSString).lastPathComponent as NSString, w, h, cropW, cropH, reduction))
