import React, { useState, useEffect } from 'react';
import { ViewState, NavProps } from '../types';
import { Briefcase, Home, Menu, X, Layout, MessageSquare, Shield, LogOut, User as UserIcon, Search } from 'lucide-react';

const Navbar: React.FC<NavProps> = ({ currentView, onNavigate, currentUser, onLogout, onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const phrases = [
    "Find Your Dream Home in Nigeria",
    "Rent Apartments with Ease",
    "Buy Verified Properties Securely",
    "No Agency Drama, Just Keys",
    "Short Lets & Long Leases",
    "Discover Luxury Real Estate"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFade(true);
      }, 500); // Wait for fade out
    }, 4000); // Show for 4 seconds
    return () => clearInterval(interval);
  }, [phrases.length]);

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsSearchOpen(false);
  };

  const renderNavLinks = () => {
    if (!currentUser) {
      return (
        <button
          onClick={() => handleNav(ViewState.AUTH)}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors whitespace-nowrap"
        >
          Sign In
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-2 md:space-x-4">
        {currentUser.role === 'admin' && (
          <button onClick={() => handleNav(ViewState.ADMIN_DASHBOARD)} className="nav-btn">
            <Shield size={18} className="mr-2" /> Admin
          </button>
        )}
        
        {currentUser.role === 'investor' && (
           <button onClick={() => handleNav(ViewState.INVESTOR_DASHBOARD)} className="nav-btn">
            <Layout size={18} className="mr-2" /> Dashboard
          </button>
        )}

        {currentUser.role === 'business' && (
           <button onClick={() => handleNav(ViewState.BUSINESS_DASHBOARD)} className="nav-btn">
            <Briefcase size={18} className="mr-2" /> My Business
          </button>
        )}

        <button onClick={() => handleNav(ViewState.CHAT)} className="nav-btn relative">
          <MessageSquare size={18} className="mr-2" /> 
          <span className="hidden md:inline">Messages</span>
          <span className="absolute top-0 right-0 md:top-1 md:right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-slate-300 mx-2 hidden md:block"></div>

        <div className="flex items-center space-x-3 ml-2">
          <div className="flex flex-col items-end hidden md:flex">
             <span className="text-sm font-semibold text-slate-700">{currentUser.name}</span>
             <span className="text-xs text-slate-500 capitalize">{currentUser.role}</span>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-500 hover:text-red-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => onNavigate(ViewState.FEED)}>
            <div className="mr-2">
              <Home className="text-brand-600 h-7 w-7" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500 hidden sm:block">
              NaijaPropTrust
            </span>
          </div>

          {/* Rotating Description (Visible on all screens now) */}
          <div className="flex flex-1 justify-center items-center px-2 overflow-hidden mx-2">
             <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-100 rounded-full px-3 py-1.5 flex items-center shadow-sm max-w-full justify-center transition-all duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2 shrink-0"></span>
                <p className={`text-[10px] sm:text-xs font-medium text-slate-600 transition-opacity duration-500 truncate ${fade ? 'opacity-100' : 'opacity-0'}`}>
                   {phrases[currentPhraseIndex]}
                </p>
             </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            {renderNavLinks()}
          </div>

          {/* Mobile Search Button (Replcaed Burger) */}
          <div className="md:hidden flex items-center shrink-0">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {isSearchOpen ? <X size={24} /> : <Search size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Area */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 shadow-lg absolute w-full z-50 animate-in slide-in-from-top-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search properties, locations..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                autoFocus
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
           </div>
        </div>
      )}
      <style>{`
        .nav-btn {
          @apply flex items-center px-3 py-2 text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-all text-sm font-medium;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;