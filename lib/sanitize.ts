/** Lightweight, dependency-free HTML sanitizer for admin-authored rich text.
 *
 *  The CMS rich-text editor emits a constrained set of formatting tags. This
 *  strips anything that could execute script if a rendered page trusts the
 *  stored HTML: <script>/<style>/<iframe> etc., inline event handlers
 *  (on*=...), and javascript:/vbscript:/data: URLs. Defense-in-depth against a
 *  compromised or malicious admin injecting stored XSS against site visitors.
 *
 *  Works on both server and client (pure string ops, no DOM needed).
 */

const BLOCK_TAGS =
  /<\s*\/?\s*(script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|svg|math)\b[^>]*>/gi;
// Content of script/style must go too, not just the tags.
const BLOCK_TAG_CONTENT =
  /<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const EVENT_HANDLERS = /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_URLS =
  /\s(href|src|xlink:href)\s*=\s*("|')?\s*(javascript|vbscript|data)\s*:[^"'>\s]*("|')?/gi;

export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";
  let html = String(input);
  html = html.replace(BLOCK_TAG_CONTENT, "");
  html = html.replace(BLOCK_TAGS, "");
  html = html.replace(EVENT_HANDLERS, "");
  html = html.replace(DANGEROUS_URLS, "");
  return html;
}
