const CLOUD_NAME = "dthv0nsq";
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// Map local path → Cloudinary public_id (mirror logic của upload script)
function localPathToPublicId(path: string): string {
  return path
    .replace(/^\//, "")                      // bỏ leading slash
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")  // bỏ extension
    .replace(/ /g, "-");                     // space → dash
}

/**
 * Trả về Cloudinary URL với transform tối ưu.
 * - thumbnail (mặc định): w_600, q_auto:good, f_auto — cho card images
 * - full: w_1200, q_auto:good, f_auto — cho lightbox/detail
 * - original: không transform — cho ảnh đặc biệt
 */
export function imgUrl(
  path: string,
  mode: "thumbnail" | "full" | "original" = "thumbnail"
): string {
  if (!path) return path;

  // External URLs — trả về nguyên
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const publicId = localPathToPublicId(path);

  const transforms: Record<string, string> = {
    thumbnail: "w_600,h_400,c_fill,q_auto:good,f_auto",
    full:      "w_1200,q_auto:good,f_auto",
    original:  "q_auto,f_auto",
  };

  return `${CLOUDINARY_BASE}/${transforms[mode]}/${publicId}`;
}
