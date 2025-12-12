import React, { useState, useEffect } from 'react';
import { Property, VerificationDocs } from '../types';
import { Camera, MapPin, FileText, Check, Loader2, Video, AlertCircle } from 'lucide-react';

interface Props {
  onSubmit: (p: any) => void;
  onCancel: () => void;
}

const ListingWizard: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Basic Form Data
  const [data, setData] = useState<Partial<Property>>({
    title: '',
    price: 0,
    type: 'Flat',
    location: { city: 'Lagos', area: '', address: '', state: 'Lagos' },
    fees: {
        agencyFeePercentage: 10,
        legalFeePercentage: 10,
        cautionFee: 0
    },
    verification: {
        idVerified: false,
        ownershipVerified: false,
        videoVerified: false,
        agentLicenseVerified: false
    }
  });

  const [totalFirstYear, setTotalFirstYear] = useState(0);

  // Auto-calculate Total when price or fees change
  useEffect(() => {
     if (data.price && data.fees) {
         const agencyAmt = data.price * (data.fees.agencyFeePercentage / 100);
         const legalAmt = data.price * (data.fees.legalFeePercentage / 100);
         setTotalFirstYear(data.price + agencyAmt + legalAmt + data.fees.cautionFee);
     }
  }, [data.price, data.fees]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate upload
    await new Promise(r => setTimeout(r, 1500));
    const finalProp: any = {
      ...data,
      id: Date.now().toString(),
      totalInitialPayment: totalFirstYear, // Save the calculated total
      media: {
        coverImage: 'https://images.unsplash.com/photo-1600596542815-60c37c65b567?auto=format&fit=crop&w=800&q=80',
        images: [],
        videoUrl: data.verification?.videoVerified ? 'mock-video-url' : undefined
      },
      neighborhood: {
        electricityReliability: 'Fair',
        waterAvailability: 'Borehole',
        securityLevel: 'Gated',
        floodRisk: 'Low',
        noiseLevel: 'Moderate'
      },
      postedAt: new Date(),
      trustScore: 85
    };
    onSubmit(finalProp);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {/* Progress */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">List Property</h2>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 w-8 rounded-full ${i <= step ? 'bg-green-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-xl font-bold text-slate-900">Basic Details & Pricing</h3>
          <div className="space-y-4">
            <input 
              className="w-full p-4 rounded-xl border border-slate-200" 
              placeholder="Property Title (e.g. 2 Bed Flat in Lekki)" 
              value={data.title}
              onChange={e => setData({...data, title: e.target.value})}
            />
            <div className="flex gap-4">
                <select 
                    className="flex-1 p-4 rounded-xl border border-slate-200 bg-white"
                    onChange={e => setData({...data, type: e.target.value as any})}
                >
                    <option>Flat</option>
                    <option>Duplex</option>
                    <option>Self-Con</option>
                    <option>Bungalow</option>
                </select>
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                    <input 
                        type="number" 
                        className="w-full p-4 pl-8 rounded-xl border border-slate-200" 
                        placeholder="Yearly Rent" 
                        onChange={e => setData({...data, price: Number(e.target.value)})}
                    />
                </div>
            </div>
            
            {/* Fee Transparency Section */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-3 text-sm">Commission & Fees Breakdown</h4>
                <div className="grid grid-cols-3 gap-3">
                     <div>
                         <label className="text-[10px] text-slate-500 uppercase font-bold">Agency (%)</label>
                         <input 
                            type="number" 
                            className="w-full p-2 border border-slate-200 rounded-lg"
                            value={data.fees?.agencyFeePercentage}
                            onChange={(e) => setData({...data, fees: {...data.fees!, agencyFeePercentage: Number(e.target.value)}})}
                         />
                     </div>
                     <div>
                         <label className="text-[10px] text-slate-500 uppercase font-bold">Legal (%)</label>
                         <input 
                            type="number" 
                            className="w-full p-2 border border-slate-200 rounded-lg"
                            value={data.fees?.legalFeePercentage}
                            onChange={(e) => setData({...data, fees: {...data.fees!, legalFeePercentage: Number(e.target.value)}})}
                         />
                     </div>
                     <div>
                         <label className="text-[10px] text-slate-500 uppercase font-bold">Caution (₦)</label>
                         <input 
                            type="number" 
                            className="w-full p-2 border border-slate-200 rounded-lg"
                            value={data.fees?.cautionFee}
                            onChange={(e) => setData({...data, fees: {...data.fees!, cautionFee: Number(e.target.value)}})}
                         />
                     </div>
                </div>
                
                {/* Total Calc Preview */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-green-800 font-bold">Total 1st Year Payment (Tenant View):</span>
                        <span className="text-lg font-bold text-green-700">₦{totalFirstYear.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
               <div className="flex items-center text-slate-500 mb-2">
                 <MapPin size={18} className="mr-2" />
                 Location
               </div>
               <input 
                  className="w-full mb-3 p-2 border-b border-slate-100 focus:outline-none" 
                  placeholder="Address" 
                  onChange={e => setData({...data, location: {...data.location!, address: e.target.value}})}
                />
               <div className="flex gap-2">
                 <input 
                    className="flex-1 p-2 border-b border-slate-100 focus:outline-none" 
                    placeholder="Area (e.g. Yaba)" 
                    onChange={e => setData({...data, location: {...data.location!, area: e.target.value}})}
                />
                 <input 
                    className="flex-1 p-2 border-b border-slate-100 focus:outline-none" 
                    placeholder="City" 
                    value="Lagos"
                    readOnly
                />
               </div>
            </div>
          </div>
          <button onClick={handleNext} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-4">Continue</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-xl font-bold text-slate-900">Verification (Trust Protocol)</h3>
          <p className="text-sm text-slate-500">Listings with verified documents get 5x more leads.</p>

          <div className="space-y-3">
             <label className="flex items-center p-4 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-green-500">
                <input type="checkbox" className="w-5 h-5 accent-green-600 mr-3" onChange={e => setData(prev => ({...prev, verification: {...prev.verification!, ownershipVerified: e.target.checked}}))} />
                <div>
                   <span className="font-bold text-slate-800">Proof of Ownership</span>
                   <p className="text-xs text-slate-500">Deed of Assignment, C of O, or Governor's Consent</p>
                </div>
             </label>

             <label className="flex items-center p-4 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-green-500">
                <input type="checkbox" className="w-5 h-5 accent-green-600 mr-3" onChange={e => setData(prev => ({...prev, verification: {...prev.verification!, idVerified: e.target.checked}}))} />
                <div>
                   <span className="font-bold text-slate-800">Identity Verification</span>
                   <p className="text-xs text-slate-500">NIN, Voter's Card, or Passport</p>
                </div>
             </label>

             <label className="flex items-center p-4 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-green-500">
                <input type="checkbox" className="w-5 h-5 accent-green-600 mr-3" onChange={e => setData(prev => ({...prev, verification: {...prev.verification!, agentLicenseVerified: e.target.checked}}))} />
                <div>
                   <span className="font-bold text-slate-800">Agent License (Optional)</span>
                   <p className="text-xs text-slate-500">CAC Registration or LASRETRAD</p>
                </div>
             </label>
          </div>
          
          <div className="flex gap-4 mt-6">
              <button onClick={handleBack} className="flex-1 text-slate-600 font-bold">Back</button>
              <button onClick={handleNext} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <h3 className="text-xl font-bold text-slate-900">Media & Video</h3>
          
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start">
             <Video className="text-orange-600 mr-3 shrink-0" size={24} />
             <div>
                <h4 className="font-bold text-orange-800 text-sm">Video-First Policy</h4>
                <p className="text-xs text-orange-700 mt-1">
                   To prevent "catfishing", NaijaPropTrust requires a 30s walkthrough video for verified badges.
                </p>
             </div>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-white cursor-pointer hover:bg-slate-50">
             <Camera className="mx-auto text-slate-300 mb-2" size={40} />
             <p className="font-bold text-slate-600">Upload Photos</p>
             <p className="text-xs text-slate-400">Min 5 photos</p>
          </div>

          <div 
             className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${data.verification?.videoVerified ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white'}`}
             onClick={() => setData(prev => ({...prev, verification: {...prev.verification!, videoVerified: !prev.verification?.videoVerified}}))}
          >
             {data.verification?.videoVerified ? (
                 <>
                    <Check className="mx-auto text-green-600 mb-2" size={40} />
                    <p className="font-bold text-green-700">Video Added!</p>
                 </>
             ) : (
                 <>
                    <Video className="mx-auto text-slate-300 mb-2" size={40} />
                    <p className="font-bold text-slate-600">Upload Walkthrough Video</p>
                    <p className="text-xs text-slate-400">Required for Verified Badge</p>
                 </>
             )}
          </div>

          <div className="flex gap-4 mt-6">
              <button onClick={handleBack} className="flex-1 text-slate-600 font-bold">Back</button>
              <button 
                onClick={handleSubmit} 
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold flex justify-center items-center"
              >
                 {loading ? <Loader2 className="animate-spin" /> : 'Publish Listing'}
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingWizard;