export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://chatakh-creations.onrender.com");
  return `${apiUrl}${imagePath}`;
};

export const getProductImage = (product) => {
  if (product?.images?.length > 0) return getImageUrl(product.images[0]);
  return "/COVER_.png";
};
