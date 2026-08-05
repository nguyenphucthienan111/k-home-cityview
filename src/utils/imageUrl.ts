const CLOUD_NAME = "dthv0nsq";
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

function localPathToPublicId(path: string): string {
  return path
    .replace(/^\//, "")
    .replace(/(\.(jpg|jpeg|png|webp))+$/i, "")
    .replace(/ /g, "-");
}

/**
 * Trả về Cloudinary URL với transform tối ưu.
 * - thumbnail: w_600,h_400,c_fill — card images (mặc định)
 * - card:      w_800,h_600,c_fill — medium cards, location images
 * - mobile:    w_400,h_300,c_fill — mobile thumbnails
 * - full:      w_1200 — lightbox/detail
 * - original:  q_auto,f_auto — không transform
 */
export function imgUrl(
  path: string,
  mode: "thumbnail" | "card" | "mobile" | "full" | "original" = "thumbnail"
): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const publicId = localPathToPublicId(path);

  const transforms: Record<string, string> = {
    thumbnail: "w_600,h_400,c_fill,q_auto:good,f_auto",
    card:      "w_800,h_600,c_fill,q_auto:good,f_auto",
    mobile:    "w_400,h_300,c_fill,q_auto:good,f_auto",
    full:      "w_1200,q_auto:good,f_auto",
    original:  "q_auto,f_auto",
  };

  return `${CLOUDINARY_BASE}/${transforms[mode]}/${publicId}`;
}
