/**
 * Encode a public image path so Vercel serves it correctly.
 * Encodes each path segment individually (preserving slashes).
 *
 * Example:
 *   "/k-home cityview/Can 1 PN + A/file.jpg"
 *   → "/k-home%20cityview/C%C4%83n%201%20PN%20%2B%20A/file.jpg"
 */
export function imgUrl(path: string): string {
  if (!path) return path;
  // External URLs — return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Split on "/" and encode each segment, then rejoin
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}
