export interface LinkedInPost {
  url: string;
  caption?: string;
}

/**
 * To add a post:
 *   1. Open the post on LinkedIn.
 *   2. Click the "..." menu on the post → "Embed this post".
 *   3. Copy the URL from inside src="..." of the iframe.
 *   4. Paste it as a new entry below. `caption` is optional.
 */
export const LINKEDIN_POSTS: LinkedInPost[] = [
  { url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7463366561613918208?collapsed=1' },
  { url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7460547859545845765?collapsed=1' },
  { url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7423261493195988992' },
  { url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7419510991677378560' },
  
];
