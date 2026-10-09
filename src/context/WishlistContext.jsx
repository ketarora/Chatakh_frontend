import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chatakh-wishlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("chatakh-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) =>
      prev.some((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
    );
  }, []);

  const isWished = useCallback((id) => wishlist.some((p) => p._id === id), [wishlist]);

  const value = useMemo(
    () => ({ wishlist, toggleWishlist, isWished, count: wishlist.length }),
    [wishlist, toggleWishlist, isWished]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
