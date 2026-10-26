/**
 * Sitecore Search credentials, read at build time (NEXT_PUBLIC_* values are inlined by Next.js).
 * Set these as environment variables on the rendering host in the SitecoreAI Deploy app.
 */
export const SEARCH_CONFIG = {
  env: process.env.NEXT_PUBLIC_SEARCH_ENV,
  customerKey: process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY,
  apiKey: process.env.NEXT_PUBLIC_SEARCH_API_KEY,
};

/**
 * True only when all Search credentials are present. Without them the Search SDK throws
 * ("{discoverDomainId} has not been provided") and breaks prerendering, so search UI is skipped.
 */
export const isSearchConfigured = Boolean(
  SEARCH_CONFIG.env && SEARCH_CONFIG.customerKey && SEARCH_CONFIG.apiKey
);
