/**
 * Encode spaces in a public image path for browser compatibility.
 * Only encodes spaces — other characters (like +) are left as-is
 * so Vite dev server and Vercel both serve correctly.
 */
export function imgUrl(path: string): string {
  if (!path) return path;
  // External URLs — return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Only encode spaces, leave + and other chars intact
  return path.split("/").map((segment) => segment.replace(/ /g, "%20")).join("/");
}
