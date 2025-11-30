
import React, { useState, useEffect } from 'react';
import { useShop } from '../store/ShopContext';
import { Check, CreditCard, Wallet, AlertCircle, Shield, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount, finalTotal, user, placeOrder } = useShop();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  // Auth Guard
  useEffect(() => {
    if (!user) {
      // Redirect to login preserving the return path
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.placeholder.toLowerCase().replace(' ', '')]: e.target.value });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(couponInput.toUpperCase());
    setCouponMsg(result.message);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
        const orderId = await placeOrder(formData, paymentMethod);
        navigate('/order-confirmation', { state: { orderId, email: user?.email } });
    } catch (error) {
        alert("Failed to place order. Please try again.");
    } finally {
        setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Your cart is empty</h2>
        <Link to="/products" className="text-orange-500 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  if (!user) return null; // Prevent flicker before redirect

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 neon-text">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs shadow-[0_0_10px_rgba(249,115,22,0.4)]">1</span>
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="p-3 bg-stone-950 border border-stone-800 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              <input type="text" placeholder="Last Name" onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="p-3 bg-stone-950 border border-stone-800 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              <input type="text" placeholder="Address" onChange={(e) => setFormData({...formData, address: e.target.value})} className="md:col-span-2 p-3 bg-stone-950 border border-stone-800 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              <input type="text" placeholder="City" onChange={(e) => setFormData({...formData, city: e.target.value})} className="p-3 bg-stone-950 border border-stone-800 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              <input type="text" placeholder="Pincode" onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="p-3 bg-stone-950 border border-stone-800 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              <input type="tel" placeholder="Phone Number" onChange={(e) => setFormData({...formData, phone: e.target.value})} className="md:col-span-2 p-3 bg-stone-950 border border-stone-800 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs shadow-[0_0_10px_rgba(249,115,22,0.4)]">2</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-900/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-stone-800 hover:border-stone-700'}`}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="text-orange-600 focus:ring-orange-500" />
                <div className="flex-1">
                  <span className="font-semibold block text-white">UPI / GPay / PhonePe</span>
                  <span className="text-xs text-stone-500">Instant payment, zero fees</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-stone-800 rounded"></div>
                  <div className="w-8 h-8 bg-stone-800 rounded"></div>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-900/10' : 'border-stone-800 hover:border-stone-700'}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <div className="flex-1">
                  <span className="font-semibold block text-white">Credit / Debit Card</span>
                  <span className="text-xs text-stone-500">Secure via Razorpay</span>
                </div>
                <CreditCard className="w-5 h-5 text-stone-400" />
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-900/10' : 'border-stone-800 hover:border-stone-700'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <div className="flex-1">
                  <span className="font-semibold block text-white">Cash on Delivery</span>
                  <span className="text-xs text-stone-500">+₹50 handling fee</span>
                </div>
                <Wallet className="w-5 h-5 text-stone-400" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-stone-900 p-6 rounded-2xl shadow-lg border border-stone-800 sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-white">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.variantWeight}`} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-stone-800" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-200 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.variantWeight} x {item.quantity}</p>
                    <p className="text-sm font-bold mt-1 text-orange-400">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-6">
              {appliedCoupon ? (
                <div className="bg-green-900/20 text-green-400 border border-green-900/30 p-3 rounded-lg flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Code: {appliedCoupon.code}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs underline hover:text-green-300">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="relative">
                  <input 
                    type="text" 
                    placeholder="Coupon Code" 
                    className="w-full p-3 pr-20 bg-stone-950 border border-stone-800 text-white rounded-lg text-sm uppercase focus:border-orange-500 outline-none"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 bg-stone-800 text-white text-xs font-bold rounded hover:bg-stone-700 border border-stone-700">
                    APPLY
                  </button>
                </form>
              )}
              {couponMsg && !appliedCoupon && (
                 <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> {couponMsg}
                 </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-sm text-stone-400 pb-4 border-b border-stone-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-white neon-text">₹{finalTotal}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-[0_0_20px_rgba(234,88,12,0.4)] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : 'Place Order'}
            </button>
            
            <p className="text-xs text-center text-stone-500 mt-4 flex justify-center items-center gap-1">
               <Shield className="w-3 h-3" /> SSL Encrypted Transaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
