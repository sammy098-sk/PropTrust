import React, { useState } from 'react';
import { UserRole, ViewState, User } from '../types';
import { LayoutDashboard, Shield, Key, Home, X } from 'lucide-react';

interface Props {
  onSwitch: (view: ViewState, mockUser: User) => void;
}

const DashboardSwitcher: React.FC<Props> = ({ onSwitch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (role: UserRole, view: ViewState) => {
    const mockUser: User = {
      id: `mock-${role}`,
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `${role}@demo.com`,
      phone: '08000000000',
      role: role,
      isVerified: true,
      status: 'active'
    };
    onSwitch(view, mockUser);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end space-y-2">
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-2 flex flex-col space-y-1 animate-in slide-in-from-bottom-5 mb-2 w-48">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Switch Dashboard
          </div>
          <button 
            onClick={() => handleSwitch('admin', ViewState.ADMIN_DASHBOARD)}
            className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 w-full text-left transition-colors"
          >
            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md"><Shield size={14} /></div>
            <span>Admin</span>
          </button>
          <button 
            onClick={() => handleSwitch('landlord', ViewState.LANDLORD_DASHBOARD)}
            className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 w-full text-left transition-colors"
          >
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md"><Key size={14} /></div>
            <span>Landlord</span>
          </button>
          <button 
            onClick={() => handleSwitch('tenant', ViewState.TENANT_DASHBOARD)}
            className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 w-full text-left transition-colors"
          >
            <div className="p-1.5 bg-green-100 text-green-600 rounded-md"><Home size={14} /></div>
            <span>Buyer / Tenant</span>
          </button>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg transition-all flex items-center justify-center ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-slate-900 hover:scale-105'}`}
        title="Switch Dashboard"
      >
        {isOpen ? <X size={24} className="text-white" /> : <LayoutDashboard size={24} className="text-white" />}
      </button>
    </div>
  );
};

export default DashboardSwitcher;