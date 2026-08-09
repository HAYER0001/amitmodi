/*
 * app/tools/_params.ts — Next 15 passes `searchParams` as a Promise of a
 * plain record; the parseXQuery functions in lib/calc expect a query string.
 * This normalises the two so every /tools page can delegate URL parsing to
 * the same tested pure functions the tests exercise.
 */

export function queryStringFromParams(
  params: Record<string, string | string[] | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") sp.set(key, value);
  }
  return sp.toString();
}
