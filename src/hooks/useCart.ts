import { useState, useEffect } from 'react';
import { EventPhoto } from '@/data/eventsMock';

interface CartItem extends EventPhoto {
  eventId: string;
  eventTitle: string;
}

const CART_STORAGE_KEY = 'of.cart.v1';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  };

  const addToCart = (photo: EventPhoto, eventId: string, eventTitle: string) => {
    const cartItem: CartItem = { ...photo, eventId, eventTitle };
    const existingIndex = items.findIndex(item => item.id === photo.id);
    
    if (existingIndex === -1) {
      saveCart([...items, cartItem]);
      return true;
    }
    return false; // Already in cart
  };

  const removeFromCart = (photoId: string) => {
    saveCart(items.filter(item => item.id !== photoId));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const isInCart = (photoId: string) => {
    return items.some(item => item.id === photoId);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  return {
    items,
    count: items.length,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getTotalPrice
  };
};