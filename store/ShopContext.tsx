
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Coupon, Product, Variant, User, Order, Address } from '../types';
import { COUPONS, ORDERS as INITIAL_ORDERS } from '../services/mockData';
import { createOrder } from '../services/api';

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: Variant, qty: number) => void;
  removeFromCart: (productId: string, variantWeight: string) => void;
  updateQuantity: (productId: string, variantWeight: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  finalTotal: number;
  isVideoPlaying: boolean;
  setVideoPlaying: (playing: boolean) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  orders: Order[];
  placeOrder: (customerDetails: any, paymentMethod: string) => Promise<string>;
  saveUserAddress: (address: Omit<Address, 'id'>) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Initialize orders from LocalStorage to persist data across reloads
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedOrders = localStorage.getItem('br_orders');
      return savedOrders ? JSON.parse(savedOrders) : INITIAL_ORDERS;
    } catch (e) {
      console.error("Failed to load orders from storage", e);
      return INITIAL_ORDERS;
    }
  });

  // Persist orders whenever they change
  useEffect(() => {
    localStorage.setItem('br_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart Calculation
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discountType === 'PERCENTAGE' 
        ? (cartTotal * appliedCoupon.value) / 100 
        : appliedCoupon.value)
    : 0;

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const addToCart = (product: Product, variant: Variant, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && item.variantWeight === variant.weight);
      if (existing) {
        return prev.map(item => 
          (item.productId === product.id && item.variantWeight === variant.weight)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        variantWeight: variant.weight,
        quantity: qty,
        name: product.name,
        price: variant.price,
        image: product.image
      }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: string, variantWeight: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variantWeight === variantWeight)));
  };

  const updateQuantity = (productId: string, variantWeight: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.variantWeight === variantWeight) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const coupon = COUPONS.find(c => c.code === code);
    if (!coupon) return { success: false, message: 'Invalid coupon code' };
    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return { success: false, message: `Minimum order value ₹${coupon.minOrderValue} required` };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const login = (email: string) => {
    // Determine name from email
    const name = email.split('@')[0];
    
    // Simulate finding a user with saved addresses
    setUser({
      id: `u-${Date.now()}`,
      name: name,
      email: email,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      savedAddresses: [
        // Mock saved address for demonstration
        {
          id: 'addr-default',
          firstName: name,
          lastName: '',
          email: email,
          phone: '9876543210',
          address: '123, Palm Grove Heights, Sector 45',
          city: 'Gurugram',
          pincode: '122003'
        }
      ]
    });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const saveUserAddress = (address: Omit<Address, 'id'>) => {
    if (!user) return;
    
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };

    setUser(prev => prev ? ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, newAddress]
    }) : null);
  };

  const placeOrder = async (customerDetails: any, paymentMethod: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      // Delegate to Backend API Service
      const newOrder = await createOrder(
        user,
        cart,
        customerDetails,
        paymentMethod,
        finalTotal
      );

      // Update Local State with the persisted order from backend
      setOrders(prev => [newOrder, ...prev]);

      // Clear Cart on success
      clearCart();

      return newOrder.id;
    } catch (error) {
      console.error("Failed to place order:", error);
      throw error;
    }
  };

  return (
    <ShopContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount, finalTotal,
      isVideoPlaying, setVideoPlaying, isCartOpen, setCartOpen,
      user, login, logout,
      orders, placeOrder, saveUserAddress
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
};