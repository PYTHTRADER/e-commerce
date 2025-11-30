
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Coupon, Product, Variant, User, Order } from '../types';
import { COUPONS, ORDERS as INITIAL_ORDERS } from '../services/mockData';
import { sendOrderConfirmationEmail } from '../services/api';

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
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

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
    setUser({
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const placeOrder = async (customerDetails: any, paymentMethod: string) => {
    if (!user) throw new Error("User not authenticated");

    const newOrder: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        total: finalTotal,
        status: 'Processing',
        date: new Date().toISOString().split('T')[0],
        items: [...cart]
    };

    // 1. Save to state (Simulate DB)
    setOrders(prev => [newOrder, ...prev]);

    // 2. Trigger Backend Email Service
    await sendOrderConfirmationEmail(user.email, newOrder);

    // 3. Clear Cart
    clearCart();

    return newOrder.id;
  };

  return (
    <ShopContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount, finalTotal,
      isVideoPlaying, setVideoPlaying, isCartOpen, setCartOpen,
      user, login, logout,
      orders, placeOrder
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
