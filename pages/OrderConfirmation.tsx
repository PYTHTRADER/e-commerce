
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, email } = location.state || { orderId: 'UNKNOWN', email: 'you' };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 animate-in slide-in-from-bottom duration-500">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] rounded-full" />
        </div>
        
        <h1 className="text-3xl font-bold text-white">Order Confirmed!</h1>
        <p className="text-stone-400 text-lg">
          Thank you for your purchase. Your order <span className="text-orange-500 font-mono font-bold">#{orderId}</span> has been placed successfully.
        </p>
        
        <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
          <p className="text-sm text-stone-300">
            We have sent a confirmation email to <br/>
            <span className="text-white font-bold">{email}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-6">
          <Link to="/products" className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2">
            Continue Shopping <ShoppingBag className="w-4 h-4" />
          </Link>
          <Link to="/" className="w-full text-stone-500 hover:text-white py-2 text-sm transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
