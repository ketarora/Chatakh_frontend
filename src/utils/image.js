export const PLACEHOLDER = "/img1.jpeg";

// Robust image URL resolver — fixes backend photos not loading.
// Handles: Cloudinary full URLs, Windows backslashes, leading/trailing
// whitespace, spaces in filenames, missing leading slash.
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return PLACEHOLDER;
  let p = imagePath.trim();
  if (!p) return PLACEHOLDER;
  if (p.startsWith("http://") || p.startsWith("https://") || p.startsWith("data:") || p.startsWith("blob:")) {
    // Cloudinary assets: let the CDN serve auto format + quality at a
    // sensible width so phone-sized originals never slow the store down.
    if (p.includes("res.cloudinary.com") && p.includes("/upload/") && !p.includes("/upload/f_")) {
      return p.replace("/upload/", "/upload/f_auto,q_auto,w_1200/");
    }
    return p;
  }
  // normalise windows separators + collapse duplicates
  p = p.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
  // encode spaces & unicode but keep slashes
  p = p
    .split("/")
    .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
    .join("/");
  if (!p.startsWith("/")) p = `/${p}`;
  const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  return `${apiUrl}${p}`;
};

export const getProductImage = (product, index = 0) => {
  if (!product?.images?.length) return PLACEHOLDER;
  return getImageUrl(product.images[index] || product.images[0]);
};
