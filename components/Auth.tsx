import React, { useState } from 'react';
import { User, UserRole, ViewState } from '../types';
import { Mail, Lock, User as UserIcon, Building2, Briefcase, ArrowRight, Loader2, Phone } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  onNavigate: (view: ViewState) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'creds' | 'role' | 'verify'>('creds');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('investor');
  const [verifyCode, setVerifyCode] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLogin) {
      // Mock Login Logic
      if (email === 'admin@bizbridge.com') {
        onLogin({ id: '99', name: 'Admin User', email, role: 'admin', isVerified: true, status: 'active' });
      } else {
        onLogin({ id: '1', name: 'John Doe', email, role: 'investor', isVerified: true, status: 'active' });
      }
    } else {
      if (step === 'creds') {
        setStep('role');
      } else if (step === 'role') {
        setStep('verify');
      } else if (step === 'verify') {
         // Finalize Signup
         onLogin({ id: Date.now().toString(), name, email, role, isVerified: true, status: 'active' });
      }
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (step === 'role' && !isLogin) {
      return (
        <div className="space-y-4">
           <h3 className="text-xl font-bold text-center mb-6">How will you use BizBridge?</h3>
           <button
             type="button"
             onClick={() => setRole('business')}
             className={`w-full p-4 border-2 rounded-xl flex items-center transition-all ${role === 'business' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}
           >
             <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
               <Building2 size={24} />
             </div>
             <div className="text-left">
               <p className="font-bold text-slate-900">I own a Business</p>
               <p className="text-sm text-slate-500">I need funding to grow my company.</p>
             </div>
           </button>

           <button
             type="button"
             onClick={() => setRole('investor')}
             className={`w-full p-4 border-2 rounded-xl flex items-center transition-all ${role === 'investor' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}
           >
             <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
               <Briefcase size={24} />
             </div>
             <div className="text-left">
               <p className="font-bold text-slate-900">I am an Investor</p>
               <p className="text-sm text-slate-500">I want to find vetted opportunities.</p>
             </div>
           </button>

           <button 
             onClick={handleAuth}
             className="w-full mt-6 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={18} className="ml-2" /></>}
           </button>
        </div>
      );
    }

    if (step === 'verify' && !isLogin) {
      return (
        <div className="text-center">
          <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-brand-600 h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Check your inbox</h3>
          <p className="text-slate-500 mb-6">We sent a verification code to {email}</p>
          
          <input 
            type="text" 
            className="w-full text-center text-2xl tracking-widest font-mono border-2 border-slate-200 rounded-lg p-3 focus:border-brand-500 focus:outline-none mb-6"
            placeholder="000000"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
          />

          <button 
             onClick={handleAuth}
             className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Launch'}
           </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  required
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  required
                  type="tel"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              required
              type="email"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            {isLogin && <a href="#" className="text-xs text-brand-600 hover:underline">Forgot password?</a>}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              required
              type="password"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition-colors flex justify-center items-center shadow-md"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isLogin ? 'Welcome back' : 'Join BizBridge'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setStep('creds');
              }}
              className="font-medium text-brand-600 hover:text-brand-500"
            >
              {isLogin ? 'Sign up for free' : 'Sign in'}
            </button>
          </p>
        </div>

        {renderContent()}
        
      </div>
    </div>
  );
};

export default Auth;