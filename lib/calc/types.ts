/*
 * lib/calc/types.ts — shared shapes for the calculator library.
 *
 * Every calculator returns a `breakdown`: a list of labelled steps showing
 * how the answer was reached. Showing the arithmetic is the product — a tax
 * practice that reveals its working is demonstrating competence, not giving
 * it away.
 */

/** One line of the "how we got here" working. */
export type BreakdownLine = {
  label: string;
  value: string;
  /** Optional smaller caption under the value (formula, footnote). */
  detail?: string;
};
