export const MARGINALIA: readonly string[] = [
  "Sec 44AB",
  "GSTR-1",
  "GSTR-3B",
  "GSTR-9",
  "GSTR-9C",
  "Form 26AS",
  "AIS",
  "TIS",
  "u/s 139(1)",
  "u/s 139(4)",
  "u/s 143(1)",
  "u/s 148",
  "Rule 46",
  "Rule 36(4)",
  "ITC-04",
  "CMP-08",
  "Form 16",
  "Form 16A",
  "Form 26Q",
  "Form 24Q",
  "Form 27Q",
  "PAN 49A",
  "PAN 49AA",
  "REG-01",
  "REG-06",
  "DRC-01",
  "DRC-03",
  "APL-01",
  "IEC",
  "RCMC",
  "LUT",
  "Sec 80G",
  "Sec 12A",
  "Sec 194C",
  "Sec 194J",
  "Sec 194Q",
  "Sec 206AB",
  "TAN",
  "e-Way Bill",
  "e-Invoice",
];

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickMarginalia(count: number, seed: number): string[] {
  const rand = mulberry32(seed);
  const pool = [...MARGINALIA];
  const result: string[] = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rand() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}
