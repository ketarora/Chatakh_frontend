import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const lineKey = (p) => `${p._id}__${p.size || "OS"}`;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // persist cart
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch { /* storage full / private mode */ }
  }, [cart]);

  const addToCart = (product) => {
    const qty = Math.min(10, Math.max(1, product.qty || 1));
    setCart((prevCart) => {
      const key = lineKey(product);
      const exists = prevCart.find((p) => lineKey(p) === key);

      if (exists) {
        return prevCart.map((p) =>
          lineKey(p) === key
            ? { ...p, qty: Math.min(10, (p.qty || 1) + qty) }
            : p
        );
      }

      return [...prevCart, { ...product, qty }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter((p) => (size ? lineKey(p) !== `${id}__${size}` : p._id !== id))
    );
  };

  const clearCart = () => {
    setCart([]);
    try { localStorage.removeItem("cart"); } catch { /* ignore */ }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
