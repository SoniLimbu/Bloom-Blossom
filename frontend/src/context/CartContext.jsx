import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const GIFT_HAMPER_THRESHOLD = 10000;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        toast.success(`${product.name} quantity updated!`);
        return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      }
      toast.success(`${product.name} added to cart! 🌸`);
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCartItems([]);

  // Buy 2 Get 1 logic: for every 2 qty of same item, 1 is free
  const getItemFreeQty = (item) => Math.floor(item.qty / 2);

  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.qty, 0);
  const freeDiscount = cartItems.reduce((acc, item) => acc + (item.discountPrice || item.price) * getItemFreeQty(item), 0);
  const buy2get1Applied = cartItems.some(item => getItemFreeQty(item) > 0);
  const giftHamperUnlocked = itemsPrice >= GIFT_HAMPER_THRESHOLD;
  const shippingPrice = itemsPrice > 2000 ? 0 : 150;
  const totalPrice = itemsPrice - freeDiscount + shippingPrice;
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty, clearCart,
      itemsPrice, freeDiscount, buy2get1Applied, giftHamperUnlocked,
      shippingPrice, totalPrice, cartCount,
      getItemFreeQty, GIFT_HAMPER_THRESHOLD
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
