'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
        // If localStorage fails due to quota, we'll keep the cart in memory
        // but won't persist it until items are removed
        if (error.name === 'QuotaExceededError') {
          toast.error('Cart is too large. Please remove some items.');
        }
      }
    }
  }, [cartItems, loading]);

  const addToCart = useCallback((product, quantity = 1, color = '', size = '', user = null) => {
    // Check if guest checkout is allowed or user is logged in
    if (!settings.general.allowGuestCheckout && !user) {
      toast.error('Please login to add items to cart');
      return false;
    }
    
    setCartItems((prevItems) => {
      // Create a minimal product object to store in cart
      const minimalProduct = {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        discount: product.discount,
        // Only include colors and sizes if they exist
        ...(product.colors && { colors: product.colors }),
        ...(product.sizes && { sizes: product.sizes }),
      };
      
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
        // Add new item to cart with minimal product data
        newItems = [
          ...prevItems,
          {
            ...minimalProduct,
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
  }, [settings.general.allowGuestCheckout]);

  const updateCartItemQuantity = useCallback((itemId, quantity, color = '', size = '') => {
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
  }, []);

  const removeFromCart = useCallback((itemId, color = '', size = '') => {
    setCartItems((prevItems) => {
      const filteredItems = prevItems.filter(
        (item) => 
          !(item._id === itemId && (color === '' || item.color === color) && (size === '' || item.size === size))
      );
      toast.info('Item removed from cart');
      return filteredItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info('Cart cleared');
  }, []);

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