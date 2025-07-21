'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ general: { allowGuestCheckout: true } });

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch store settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.data || { general: { allowGuestCheckout: true } });
        }
      } catch (error) {
        console.error('Failed to fetch store settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const addToCart = (product, quantity = 1, color = '', size = '', user = null) => {
    // Check if guest checkout is allowed or user is logged in
    if (!settings.general.allowGuestCheckout && !user) {
      toast.error('Please login to add items to cart');
      return false;
    }
    
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item._id === product._id && 
          item.color === color && 
          item.size === size
      );

      let newItems;

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        
        if (newItems[existingItemIndex].quantity > product.countInStock) {
          newItems[existingItemIndex].quantity = product.countInStock;
          toast.info('Maximum available quantity added to cart');
        } else {
          toast.success('Item quantity updated in cart');
        }
      } else {
        // Add new item to cart
        newItems = [
          ...prevItems,
          {
            ...product,
            quantity,
            color,
            size,
          },
        ];
        toast.success('Item added to cart');
      }

      return newItems;
    });
    
    return true;
  };

  const updateCartItemQuantity = (itemId, quantity, color = '', size = '') => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item._id === itemId && (color === '' || item.color === color) && (size === '' || item.size === size)) {
          return { ...item, quantity };
        }
        return item;
      });
      toast.info('Cart updated');
      return updatedItems;
    });
  };

  const removeFromCart = (itemId, color = '', size = '') => {
    setCartItems((prevItems) => {
      const filteredItems = prevItems.filter(
        (item) => 
          !(item._id === itemId && (color === '' || item.color === color) && (size === '' || item.size === size))
      );
      toast.info('Item removed from cart');
      return filteredItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  // Calculate cart totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const itemsCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cart: cartItems, // Add cart alias for cartItems to match usage in cart page
        loading,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        itemsCount,
        settings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}