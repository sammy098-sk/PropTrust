import React from 'react';
import { Property, ViewState, User } from '../types';
import { Heart, Clock, MessageSquare, Search, ChevronRight } from 'lucide-react';

interface Props {
  currentUser: User;
  onNavigate: (view: ViewState) => void;
  // Mocking saved properties for now
  savedProperties?: Property[]; 
}

const TenantDashboard: React.FC<Props> = ({ currentUser, onNavigate, savedProperties = [] }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
       <div className="bg-white px-6 py-8 border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
             <h1 className="text-2xl font-bold text-slate-900">My Home</h1>
             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                {currentUser.name.charAt(0)}
             </div>
          </div>
          <p className="text-slate-500 text-sm">Track your saved homes and applications.</p>
       </div>

       <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => onNavigate(ViewState.FEED)} className="bg-green-600 text-white p-4 rounded-xl shadow-md active:scale-95 transition-transform flex flex-col items-center justify-center">
                <Search size={24} className="mb-2" />
                <span className="font-bold text-sm">Find Home</span>
             </button>
             <button onClick={() => onNavigate(ViewState.MESSAGES)} className="bg-white text-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 active:scale-95 transition-transform flex flex-col items-center justify-center">
                <MessageSquare size={24} className="mb-2 text-green-600" />
                <span className="font-bold text-sm">My Chats</span>
             </button>
          </div>

          {/* Recent History */}
          <div>
             <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-slate-900 flex items-center">
                   <Clock size={18} className="mr-2 text-slate-400" /> Recently Viewed
                </h2>
                <button className="text-xs text-green-600 font-bold">Clear</button>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {/* Mock recent items */}
                {[1, 2, 3].map(i => (
                   <div key={i} className="min-w-[140px] bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                      <div className="h-24 bg-slate-200 relative">
                         <img src={`https://images.unsplash.com/photo-${i === 1 ? '1600596542815-60c37c65b567' : i === 2 ? '1502672260266-1c1ef2d93688' : '1522708323590-d24dbb6b0267'}?auto=format&fit=crop&w=400&q=80`} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                         <p className="font-bold text-xs truncate">Luxury Flat in Lekki</p>
                         <p className="text-[10px] text-green-700 font-bold">₦3.5M/yr</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Saved Homes (Mock) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-900 flex items-center">
                   <Heart size={18} className="mr-2 text-red-500" /> Saved Homes
                </h2>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">0</span>
             </div>
             
             <div className="text-center py-8">
                <p className="text-slate-400 text-sm mb-4">You haven't saved any homes yet.</p>
                <button onClick={() => onNavigate(ViewState.FEED)} className="text-green-600 font-bold text-sm flex items-center justify-center">
                   Start Browsing <ChevronRight size={16} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default TenantDashboard;