
import React, { useState } from 'react';
import { useShop } from '../store/ShopContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Loader2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const validateEmail = (email: string) => {
    // Strict email regex: non-whitespace + @ + non-whitespace + . + non-whitespace
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validate Email Format
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address (e.g., name@domain.com).');
      return;
    }

    // 2. Validate Password Length
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // 3. Proceed with Login
    setIsLoading(true);
    // Simulate secure network request
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Delay redirect to show success state
      setTimeout(() => {
          login(email);
          navigate(from, { replace: true });
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px]" />

        <div className="w-full max-w-md bg-stone-900/50 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center border border-stone-700 shadow-inner">
                        <User className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 neon-text">Welcome Back to Body Revival BR</h1>
                <p className="text-stone-400">Enter the elite circle.</p>
            </div>

            {isSuccess ? (
                <div className="py-12 flex flex-col items-center animate-in fade-in zoom-in">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                    <h2 className="text-xl font-bold text-white">Authenticated</h2>
                    <p className="text-stone-500">Redirecting...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-orange-500 transition" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if(error) setError('');
                                }}
                                className="w-full bg-stone-950 border border-stone-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all"
                                placeholder="athlete@example.com"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-orange-500 transition" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if(error) setError('');
                                }}
                                className="w-full bg-stone-950 border border-stone-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] text-stone-600 uppercase tracking-widest mt-6">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>256-Bit SSL Encrypted Connection</span>
                    </div>
                </form>
            )}

            {!isSuccess && (
                <div className="mt-8 text-center">
                    <p className="text-stone-500 text-sm">
                        Don't have an account? <a href="#" className="text-orange-500 font-bold hover:underline">Join the Revolution</a>
                    </p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Login;
