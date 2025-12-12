import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Home, Map, MapPin, MessageCircle, User } from 'lucide-react';

interface Props {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  userRole?: string;
}

const MobileNav: React.FC<Props> = ({ currentView, onNavigate, userRole }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Reset visibility when view changes
  useEffect(() => {
    setIsVisible(true);
  }, [currentView]);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Always show if at top of page (or bouncing at top)
        if (currentScrollY < 10) {
             setIsVisible(true);
             setLastScrollY(currentScrollY);
             return;
        }

        // Show if scrolling UP
        if (currentScrollY < lastScrollY) {
            setIsVisible(true);
        } 
        // Hide if scrolling DOWN and moved at least 10px
        else if (currentScrollY > lastScrollY && Math.abs(currentScrollY - lastScrollY) > 10) {
            setIsVisible(false);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const navItemClass = (view: ViewState) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      currentView === view ? 'text-green-700' : 'text-slate-400 hover:text-slate-600'
    }`;

  return (
    <div 
        className={`fixed bottom-0 left-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-t border-slate-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out will-change-transform ${
            isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
      <div className="grid grid-cols-5 h-full max-w-lg mx-auto">
        <button onClick={() => onNavigate(ViewState.FEED)} className={navItemClass(ViewState.FEED)}>
          <Home size={24} strokeWidth={currentView === ViewState.FEED ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        
        <button onClick={() => onNavigate(ViewState.MAP_VIEW)} className={navItemClass(ViewState.MAP_VIEW)}>
          <Map size={24} strokeWidth={currentView === ViewState.MAP_VIEW ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Map</span>
        </button>

        <button onClick={() => onNavigate(ViewState.LOCATION_SELECTION)} className="flex flex-col items-center justify-center w-full h-full -mt-6 group relative">
          <div className="bg-green-600 rounded-full p-3.5 shadow-lg text-white group-hover:bg-green-700 transition-all border-4 border-slate-50">
            <MapPin size={24} />
          </div>
          <span className="text-[10px] font-medium text-slate-600 mt-1">Location</span>
        </button>

        <button onClick={() => onNavigate(ViewState.MESSAGES)} className={navItemClass(ViewState.MESSAGES)}>
          <MessageCircle size={24} strokeWidth={currentView === ViewState.MESSAGES ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Chats</span>
        </button>

        <button onClick={() => onNavigate(ViewState.PROFILE)} className={navItemClass(ViewState.PROFILE)}>
          <User size={24} strokeWidth={currentView === ViewState.PROFILE ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;