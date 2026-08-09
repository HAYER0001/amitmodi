// EMPTY BY DESIGN. Do not add clients here.
// Every entry requires: (1) the client's written consent to be named as a
// client, and (2) confirmation that publishing client names/logos is permitted
// under the advertising rules applicable to this practice — see BRAND-FACTS.md.
// Components render nothing while this array is empty. That is correct behaviour.

export type Client = {
  id: string;
  name: string;
  consentObtained: boolean;
};

export const CLIENTS: Client[] = [];
