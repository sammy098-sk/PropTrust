import React, { useState } from 'react';
import { User } from '../types';
import { Check, X, UserCheck, ShieldAlert, FileText, Home } from 'lucide-react';

const MOCK_USERS: User[] = [
  { id: '101', name: 'Lekki Gardens Ltd', email: 'sales@lekkigardens.com', phone: '0800 123 4567', role: 'landlord', isVerified: true, status: 'active', verificationLevel: 'advanced' },
  { id: '102', name: 'Chinedu Agent', email: 'chinedu@remax.ng', phone: '0812 345 6789', role: 'agent', isVerified: false, status: 'pending', verificationLevel: 'basic' },
  { id: '103', name: 'Sarah Tenant', email: 'sarah@gmail.com', phone: '0703 333 4444', role: 'tenant', isVerified: true, status: 'active', verificationLevel: 'basic' },
  { id: '104', name: 'Scammy Realtors', email: 'cheap@scam.com', phone: '0909 999 9999', role: 'agent', isVerified: false, status: 'suspended', verificationLevel: 'none' },
];

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [filter, setFilter] = useState<'all' | 'pending'>('all');

  const handleStatusChange = (id: string, status: 'active' | 'suspended') => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };

  const handleVerify = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isVerified: true, status: 'active' } : u));
  };

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.status === 'pending');

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-slate-900 px-6 py-8 text-white">
        <h1 className="text-2xl font-bold">Admin Control Center</h1>
        <p className="text-slate-400 text-sm">Monitor verification queues and platform safety.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Users</p>
                   <p className="text-2xl font-bold text-slate-900">2,405</p>
                </div>
                <UserCheck className="text-blue-500" size={20} />
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Pending</p>
                   <p className="text-2xl font-bold text-orange-500">{users.filter(u => u.status === 'pending').length}</p>
                </div>
                <FileText className="text-orange-500" size={20} />
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Listings</p>
                   <p className="text-2xl font-bold text-green-600">854</p>
                </div>
                <Home className="text-green-500" size={20} />
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Reports</p>
                   <p className="text-2xl font-bold text-red-600">3</p>
                </div>
                <ShieldAlert className="text-red-500" size={20} />
             </div>
          </div>
        </div>

        {/* Verification Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-900 flex items-center">
              <ShieldAlert size={18} className="mr-2 text-slate-500"/> 
              Verification Queue
            </h2>
            <div className="flex space-x-2 bg-slate-200 p-1 rounded-lg">
               <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs font-bold rounded-md ${filter === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>All</button>
               <button onClick={() => setFilter('pending')} className={`px-3 py-1 text-xs font-bold rounded-md ${filter === 'pending' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Pending</button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                 <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-3 ${
                      user.role === 'landlord' ? 'bg-blue-500' : 
                      user.role === 'agent' ? 'bg-purple-500' : 'bg-slate-400'
                    }`}>
                       {user.name.charAt(0)}
                    </div>
                    <div>
                       <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                       <p className="text-xs text-slate-500">{user.email} • <span className="capitalize text-slate-700 font-medium">{user.role}</span></p>
                    </div>
                 </div>

                 <div className="flex items-center space-x-2">
                    {user.status === 'pending' ? (
                      <>
                        <button onClick={() => handleVerify(user.id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Verify Docs">
                          <Check size={18} />
                        </button>
                        <button onClick={() => handleStatusChange(user.id, 'suspended')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Reject">
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    )}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;