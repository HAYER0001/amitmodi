// User-agent tokens matched by the Phase 16 middleware.
// AI crawlers are explicitly allowed here — see data/robots-reference.txt

export const AI_CRAWLER_UAS = [
  'gptbot',
  'chatgpt-user',
  'oai-searchbot',
  'claudebot',
  'claude-user',
  'claude-searchbot',
  'perplexitybot',
  'perplexity-user',
  'google-extended',
  'applebot-extended',
  'ccbot',
  'bytespider',
  'meta-externalagent',
  'cohere-ai',
] as const;

export const SEARCH_CRAWLER_UAS = [
  'googlebot',
  'bingbot',
  'duckduckbot',
  'slurp',
  'applebot',
  'yandexbot',
  'baiduspider',
] as const;

/**
  Returns true if the user-agent string belongs to an AI crawler.
  Returns false for null or empty input.
*/
export function isAICrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return AI_CRAWLER_UAS.some((token) => ua.includes(token));
}

/**
  Returns true if the user-agent string belongs to a traditional search crawler.
  Returns false for null or empty input.
*/
export function isSearchCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return SEARCH_CRAWLER_UAS.some((token) => ua.includes(token));
}
