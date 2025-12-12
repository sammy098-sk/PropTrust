import React, { useState } from 'react';
import { Property, ViewState, User } from '../types';
import { PlusSquare, Eye, MessageCircle, MoreVertical, MapPin, TrendingUp, Wallet, CheckCircle, Shield, Camera, FileText, Loader2, X } from 'lucide-react';
import TrustBadge from './TrustBadge';

interface Props {
  currentUser: User;
  properties: Property[];
  onNavigate: (view: ViewState) => void;
  onEditProperty: (p: Property) => void;
  onUpdateUser?: (u: User) => void;
}

const LandlordDashboard: React.FC<Props> = ({ currentUser, properties, onNavigate, onEditProperty, onUpdateUser }) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Filter properties owned by this user
  const myProperties = properties.filter(p => p.ownerId === currentUser.id);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const handleCreateClick = () => {
      if (currentUser.isVerified) {
          onNavigate(ViewState.CREATE_LISTING);
      } else {
          setShowVerificationModal(true);
      }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setVerifying(true);
      // Mock API call
      await new Promise(r => setTimeout(r, 2000));
      
      if (onUpdateUser) {
          onUpdateUser({ ...currentUser, isVerified: true, verificationLevel: 'basic' });
      }
      setVerifying(false);
      setShowVerificationModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 relative">
       <div className="bg-green-700 px-6 py-8 text-white relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {currentUser.name}</h1>
                    <p className="text-green-100 text-sm mt-1">Manage your portfolio and track performance.</p>
                </div>
                {currentUser.isVerified ? (
                    <span className="bg-green-600/50 backdrop-blur border border-green-500 text-xs px-2 py-1 rounded flex items-center">
                        <Shield size={12} className="mr-1" /> Verified Agent
                    </span>
                ) : (
                    <button onClick={() => setShowVerificationModal(true)} className="bg-white text-green-700 text-xs px-2 py-1 rounded font-bold shadow-sm animate-pulse">
                        Verify Now
                    </button>
                )}
             </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
       </div>

       <div className="px-4 -mt-6 relative z-20">
          <div className="grid grid-cols-3 gap-3 mb-6">
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Listings</p>
                <p className="text-2xl font-bold text-slate-900">{myProperties.length}</p>
             </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Views</p>
                <p className="text-2xl font-bold text-slate-900">1.2k</p>
             </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Leads</p>
                <p className="text-2xl font-bold text-green-600">48</p>
             </div>
          </div>

          <div className="flex justify-between items-center mb-4">
             <h2 className="font-bold text-slate-900">Your Properties</h2>
             <button 
               onClick={handleCreateClick}
               className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-md active:scale-95 transition-transform"
             >
                <PlusSquare size={16} className="mr-2" /> Add New
             </button>
          </div>

          <div className="space-y-4">
             {myProperties.length > 0 ? (
               myProperties.map(property => (
                  <div key={property.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-3">
                     <div className="w-24 h-24 rounded-lg bg-slate-200 shrink-0 overflow-hidden relative">
                        <img src={property.media.coverImage} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1">
                          <TrustBadge verification={property.verification} mini />
                        </div>
                     </div>
                     <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between items-start">
                           <h3 className="font-bold text-slate-900 text-sm truncate pr-2">{property.title}</h3>
                           <button onClick={() => onEditProperty(property)} className="text-slate-400 hover:text-slate-900"><MoreVertical size={16}/></button>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                           <MapPin size={12} className="mr-1" /> {property.location.area}
                        </p>
                        
                        {/* Transparency Badge for Landlord */}
                        {property.fees && (
                             <div className="flex items-center mt-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded w-fit">
                                <CheckCircle size={10} className="mr-1" /> Fee Transparency Active
                             </div>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-2">
                           <div>
                                <p className="font-bold text-slate-900 text-sm">{formatPrice(property.price)}/yr</p>
                                {property.totalInitialPayment && (
                                   <p className="text-[10px] text-slate-400">Total Move-in: {formatPrice(property.totalInitialPayment)}</p>
                                )}
                           </div>
                           <div className="flex space-x-3 text-slate-400">
                              <span className="flex items-center text-xs"><Eye size={12} className="mr-1"/> 124</span>
                              <span className="flex items-center text-xs text-green-600 font-medium"><MessageCircle size={12} className="mr-1"/> 3</span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
             ) : (
                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                   <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Wallet className="text-slate-300" size={32} />
                   </div>
                   <h3 className="font-bold text-slate-900">No active listings</h3>
                   <p className="text-sm text-slate-500 mb-4">Start earning by listing your first property.</p>
                   <button 
                     onClick={handleCreateClick}
                     className="text-green-600 font-bold text-sm hover:underline"
                   >
                     Create Listing Now
                   </button>
                </div>
             )}
          </div>
       </div>

       {/* Verification Modal */}
       {showVerificationModal && (
           <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
               <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                   <button onClick={() => setShowVerificationModal(false)} className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full hover:bg-slate-100">
                       <X size={20} />
                   </button>

                   <div className="text-center mb-6">
                       <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Shield className="text-blue-600" size={32} />
                       </div>
                       <h2 className="text-xl font-bold text-slate-900">Verify Agent Identity</h2>
                       <p className="text-slate-500 text-sm mt-2">To prevent fraud, only verified agents can post properties on NaijaPropTrust.</p>
                   </div>

                   <form onSubmit={handleVerificationSubmit} className="space-y-4">
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 cursor-pointer transition-colors">
                           <div className="bg-white p-2 rounded-lg border border-slate-200">
                               <FileText size={24} className="text-slate-400" />
                           </div>
                           <div>
                               <p className="font-bold text-slate-900 text-sm">NIN or Passport</p>
                               <p className="text-xs text-slate-500">Upload government issued ID</p>
                           </div>
                       </div>

                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 cursor-pointer transition-colors">
                           <div className="bg-white p-2 rounded-lg border border-slate-200">
                               <Camera size={24} className="text-slate-400" />
                           </div>
                           <div>
                               <p className="font-bold text-slate-900 text-sm">Take a Selfie</p>
                               <p className="text-xs text-slate-500">To match with your ID</p>
                           </div>
                       </div>
                       
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 cursor-pointer transition-colors">
                           <div className="bg-white p-2 rounded-lg border border-slate-200">
                               <FileText size={24} className="text-slate-400" />
                           </div>
                           <div>
                               <p className="font-bold text-slate-900 text-sm">Proof of Authorization</p>
                               <p className="text-xs text-slate-500">Letter from landlord or Company ID</p>
                           </div>
                       </div>

                       <button 
                            type="submit" 
                            disabled={verifying}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-4 flex items-center justify-center disabled:opacity-70"
                        >
                            {verifying ? <Loader2 className="animate-spin" /> : 'Submit Verification'}
                       </button>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};

export default LandlordDashboard;