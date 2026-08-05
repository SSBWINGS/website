import { SUPABASE_MEDIA_BUCKET, SUPABASE_URL } from "./env";

/** Build a public URL for a media path.
 *  - Full URLs and local "/images/…" fallback paths are returned unchanged.
 *  - Storage-relative paths (e.g. "students/tanishq.png") become public bucket URLs. */
export function mediaUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http") || pathOrUrl.startsWith("/")) return pathOrUrl;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_MEDIA_BUCKET}/${pathOrUrl}`;
}
