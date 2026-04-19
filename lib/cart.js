export const getCart = () => {
  if (typeof window === "undefined") return { products: [], count: 0 };

  const cart = JSON.parse(localStorage.getItem("cart")) || {
    products: [],
    count: 0,
  };

  return cart;
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product) => {
  const cart = getCart();

  const existing = cart.products.find(
    (p) => p.variantId === product.variantId
  );

  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.products.push(product);
  }

  cart.count = cart.products.length;

  saveCart(cart);
  return cart;
};