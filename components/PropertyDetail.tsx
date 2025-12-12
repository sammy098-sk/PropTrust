import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { analyzeListingTrust, getNeighborhoodVibe } from '../services/geminiService';
import { 
  X, MapPin, Share2, Heart, ShieldAlert, Sparkles, CheckCircle2, User, Phone, MessageCircle, AlertCircle, Calendar, Lock, Image as ImageIcon 
} from 'lucide-react';
import TrustBadge from './TrustBadge';

interface Props {
  property: Property;
  onClose: () => void;
  isBooked: boolean;
  onBookInspection: (id: string) => void;
}

const PropertyDetail: React.FC<Props> = ({ property, onClose, isBooked, onBookInspection }) => {
  const [trustAnalysis, setTrustAnalysis] = useState<{ riskScore: number; verdict: string } | null>(null);
  const [areaVibe, setAreaVibe] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    // Parallel AI calls
    analyzeListingTrust(property.description, property.price, property.location.area).then(setTrustAnalysis);
    getNeighborhoodVibe(property.location.area, property.location.city).then(setAreaVibe);
  }, [property]);

  const handleBookClick = () => {
      setBookingLoading(true);
      setTimeout(() => {
          onBookInspection(property.id);
          setBookingLoading(false);
      }, 1000); // Simulate network
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom-10">
      {/* Header Controls */}
      <div className="fixed top-0 left-0 w-full z-10 flex justify-between p-4 pointer-events-none">
        <button onClick={onClose} className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm pointer-events-auto">
          <X size={20} />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm">
            <Share2 size={20} />
          </button>
          <button className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm">
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Hero Media */}
      <div className="h-80 relative bg-slate-900">
        <img src={property.media.coverImage} className="w-full h-full object-cover opacity-90" />
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
          <h1 className="text-2xl font-bold text-white mb-1">{property.title}</h1>
          <div className="flex items-center text-slate-200 text-sm">
            <MapPin size={14} className="mr-1" />
            {isBooked ? (
                 <span>{property.location.address}, {property.location.city}</span>
            ) : (
                 <span className="flex items-center"><Lock size={12} className="mr-1"/> Location Hidden until Inspection</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pb-24 space-y-6">
        {/* Price & Primary CTA */}
        <div className="flex justify-between items-end pb-4 border-b border-slate-100">
          <div>
            {property.totalInitialPayment && property.totalInitialPayment !== property.price ? (
                <>
                  <p className="text-sm text-slate-500 mb-1">Total 1st Year Payment</p>
                  <p className="text-3xl font-bold text-slate-900">₦{property.totalInitialPayment.toLocaleString()}</p>
                  <p className="text-green-700 text-sm font-medium mt-1">Next year: ₦{property.price.toLocaleString()}</p>
                </>
            ) : (
                <>
                  <p className="text-sm text-slate-500 mb-1">Price</p>
                  <p className="text-3xl font-bold text-green-700">₦{property.price.toLocaleString()}</p>
                </>
            )}
          </div>
          <div className="text-right">
             <TrustBadge verification={property.verification} mini={false} />
          </div>
        </div>
        
        {/* Photo Gallery */}
        {property.media.images && property.media.images.length > 0 && (
           <div className="space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center">
                 <ImageIcon size={18} className="mr-2 text-slate-500" /> Gallery
              </h3>
              <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar snap-x">
                 <div className="snap-start shrink-0 w-32 h-24 rounded-lg overflow-hidden relative">
                    <img src={property.media.coverImage} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] px-1">Main</div>
                 </div>
                 {property.media.images.map((img, idx) => (
                    <div key={idx} className="snap-start shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-slate-100">
                       <img src={img} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* FEE TRANSPARENCY SECTION */}
        {property.fees && property.totalInitialPayment && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                    <AlertCircle size={16} className="mr-2 text-slate-500" />
                    Payment Breakdown
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Base Rent (Yearly)</span>
                        <span className="font-medium">₦{property.price.toLocaleString()}</span>
                    </div>
                    {property.fees.agencyFeePercentage > 0 && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">Agency Fee ({property.fees.agencyFeePercentage}%)</span>
                            <span className="text-slate-700">₦{(property.price * (property.fees.agencyFeePercentage/100)).toLocaleString()}</span>
                        </div>
                    )}
                    {property.fees.legalFeePercentage > 0 && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">Legal Fee ({property.fees.legalFeePercentage}%)</span>
                            <span className="text-slate-700">₦{(property.price * (property.fees.legalFeePercentage/100)).toLocaleString()}</span>
                        </div>
                    )}
                     {property.fees.cautionFee > 0 && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">Caution Deposit (Refundable)</span>
                            <span className="text-slate-700">₦{property.fees.cautionFee.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-900">
                        <span>Total to Pay Now</span>
                        <span>₦{property.totalInitialPayment.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        )}

        {/* AI Trust Analysis */}
        {trustAnalysis && (
          <div className={`p-4 rounded-xl border ${trustAnalysis.riskScore > 50 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
            <h3 className="text-sm font-bold flex items-center mb-2">
              {trustAnalysis.riskScore > 50 ? <ShieldAlert size={16} className="mr-2 text-red-600"/> : <CheckCircle2 size={16} className="mr-2 text-green-600"/>}
              Trust Analysis
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {trustAnalysis.verdict}
            </p>
            <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-wide">
              Risk Score: {trustAnalysis.riskScore}/100
            </div>
          </div>
        )}

        {/* Property Description */}
        <div>
          <h3 className="font-bold text-slate-900 mb-2">Description</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </div>

        {/* Neighborhood Vibe */}
        <div className="bg-slate-50 p-4 rounded-xl">
          <h3 className="font-bold text-slate-900 mb-2 flex items-center text-sm">
            <Sparkles size={16} className="mr-2 text-purple-500" />
            Neighborhood Vibe
          </h3>
          {areaVibe ? (
            <p className="text-xs text-slate-600 italic">"{areaVibe}"</p>
          ) : (
            <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mt-4">
             <div className="bg-white p-2 rounded border border-slate-100">
               <span className="text-[10px] text-slate-400 uppercase">Power</span>
               <p className="font-semibold text-sm">{property.neighborhood.electricityReliability}</p>
             </div>
             <div className="bg-white p-2 rounded border border-slate-100">
               <span className="text-[10px] text-slate-400 uppercase">Water</span>
               <p className="font-semibold text-sm">{property.neighborhood.waterAvailability}</p>
             </div>
          </div>
        </div>

        {/* Agent Profile */}
        <div className="flex items-center justify-between">
           <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User size={24} />
              </div>
              <div className="ml-3">
                 <p className="font-bold text-slate-900 text-sm">Agent Michael</p>
                 <p className="text-xs text-slate-500">Verified Partner • 4.8 ★</p>
              </div>
           </div>
           <div className="flex gap-2">
             <button className="p-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100">
               <MessageCircle size={20} />
             </button>
             <button className="p-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100">
               <Phone size={20} />
             </button>
           </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 flex gap-3">
        {isBooked ? (
             <button className="flex-1 bg-green-100 text-green-700 font-bold py-3.5 rounded-xl border border-green-200 flex items-center justify-center cursor-default">
                 <CheckCircle2 size={18} className="mr-2" /> Inspection Scheduled
             </button>
        ) : (
            <button 
                onClick={handleBookClick}
                disabled={bookingLoading}
                className="flex-1 bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center"
            >
                {bookingLoading ? (
                    "Scheduling..."
                ) : (
                    <>
                        <Calendar size={18} className="mr-2" /> Book Inspection to View
                    </>
                )}
            </button>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;