import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem('teoCart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('teoCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, orderType = 'standard') => {
    setCartItems((items) => {
      const existingIndex = items.findIndex(
        (item) => item.id === product.id && item.orderType === orderType
      );

      if (existingIndex >= 0) {
        return items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...items,
        {
          ...product,
          orderType,
          quantity: 1,
          dateAdded: new Date().toISOString()
        }
      ];
    });
  };

  const removeFromCart = (id, orderType) => {
    setCartItems((items) =>
      items.filter((item) => !(item.id === id && item.orderType === orderType))
    );
  };

  const updateQuantity = (id, orderType, quantity) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id && item.orderType === orderType
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
