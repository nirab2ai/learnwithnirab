import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ClothingSize, DeliveryZone, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: ClothingSize, color?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: ClothingSize, color?: string) => void;
  updateQuantity: (productId: string, size: ClothingSize, color: string | undefined, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  deliveryZone: 'inside_dhaka',
  setDeliveryZone: () => {},
  subtotal: 0,
  deliveryFee: 70,
  total: 70,
  itemCount: 0,
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('classy_nirab_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('classy_nirab_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');

  useEffect(() => {
    try {
      localStorage.setItem('classy_nirab_cart', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('classy_nirab_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore storage errors
    }
  }, [wishlist]);

  const addToCart = (product: Product, size: ClothingSize, color?: string, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size && (item.color || '') === (color || '')
      );

      const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(next[existingIndex].quantity + quantity, product.stock || 99);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: effectivePrice,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
            size,
            color: color || (product.colors?.[0] ?? ''),
            quantity: Math.min(quantity, product.stock || 99),
            stock: product.stock,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: ClothingSize, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size && (item.color || '') === (color || ''))
      )
    );
  };

  const updateQuantity = (productId: string, size: ClothingSize, color: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.size === size && (item.color || '') === (color || '')) {
          return { ...item, quantity: Math.min(qty, item.stock || 99) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Free shipping promo over ৳2,500
  const deliveryFee = subtotal >= 2500 ? 0 : deliveryZone === 'inside_dhaka' ? 70 : 130;
  const total = subtotal + deliveryFee;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        deliveryZone,
        setDeliveryZone,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
