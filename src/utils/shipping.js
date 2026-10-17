export const FREE_SHIPPING_THRESHOLD = 999;
export const DEFAULT_SHIPPING_CHARGE = 99;

export const getCartSubtotal = (cart) =>
  cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

export const getCartShipping = (cart) => {
  const subtotal = getCartSubtotal(cart);
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;

  const configuredCharge = cart.reduce(
    (sum, item) => sum + (Number(item.shippingCharge) || 0),
    0
  );
  return configuredCharge || DEFAULT_SHIPPING_CHARGE;
};
