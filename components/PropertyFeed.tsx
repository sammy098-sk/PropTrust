import React, { useState } from 'react';
import { Property } from '../types';
import { MapPin, PlayCircle, SlidersHorizontal, X, Sparkles, Calculator, AlertCircle, CheckCircle2, TrendingUp, MessageCircle, Loader2 } from 'lucide-react';
import TrustBadge from './TrustBadge';
import FeaturedBanner from './FeaturedCarousel';
import { generateFinancialAdvice } from '../services/geminiService';

interface Props {
  properties: Property[];
  onSelect: (p: Property) => void;
  searchQuery?: string;
}

interface FinancialData {
  jobTitle: string;
  monthlyIncome: number;
  monthlyExpenses: number; // Non-rent expenses
}

const PropertyFeed: React.FC<Props> = ({ properties, onSelect, searchQuery = '' }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAiWizard, setShowAiWizard] = useState(false);
  
  // Financial Data for AI
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [tempFinance, setTempFinance] = useState<FinancialData>({ jobTitle: '', monthlyIncome: 0, monthlyExpenses: 0 });

  // AI Explanations State
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [loadingExplanation, setLoadingExplanation] = useState<Record<string, boolean>>({});

  // Quick Filters State
  const [filterType, setFilterType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000000000);

  // Manual Filters State
  const [isManual, setIsManual] = useState(false);
  const [manualType, setManualType] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const calculateAffordability = (property: Property) => {
    if (!financialData) return null;

    const totalUpfront = property.totalInitialPayment || property.price;
    const disposableIncome = financialData.monthlyIncome - financialData.monthlyExpenses;

    if (disposableIncome <= 0) return { monthsToSave: 999, isAffordable: false, status: 'Critical', disposableIncome: 0 };

    const monthsToSave = Math.ceil(totalUpfront / disposableIncome);
    
    // Logic: 
    // - Safe: Can save in < 4 months AND rent is < 40% of annual income
    // - Stretch: Can save in 4-8 months
    // - Difficult: > 8 months
    
    const yearlyIncome = financialData.monthlyIncome * 12;
    const rentToIncomeRatio = property.price / yearlyIncome;
    
    let status = 'Safe';
    if (monthsToSave > 12 || rentToIncomeRatio > 0.5) status = 'Dangerous';
    else if (monthsToSave > 5 || rentToIncomeRatio > 0.35) status = 'Stretch';

    return { monthsToSave, status, disposableIncome };
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFinancialData(tempFinance);
    setShowAiWizard(false);
    // Clear old explanations when profile changes
    setAiExplanations({});
  };

  const handleAskAi = async (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    if (!financialData) return;
    
    setLoadingExplanation(prev => ({...prev, [property.id]: true}));
    
    const explanation = await generateFinancialAdvice(
        financialData.jobTitle,
        financialData.monthlyIncome,
        financialData.monthlyExpenses,
        property.price,
        property.totalInitialPayment || property.price
    );
    
    setAiExplanations(prev => ({...prev, [property.id]: explanation}));
    setLoadingExplanation(prev => ({...prev, [property.id]: false}));
  };

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const effectivePrice = p.totalInitialPayment || p.price;
    let matchesType = true;
    let matchesPrice = true;
    let matchesAffordability = true;

    if (financialData) {
        const affordability = calculateAffordability(p);
        // We keep all properties but sort them or badge them
    }

    if (isManual) {
        if (manualType.trim()) matchesType = p.type.toLowerCase().includes(manualType.toLowerCase().trim());
        if (manualPrice) matchesPrice = effectivePrice <= Number(manualPrice);
    } else {
        matchesType = filterType === 'All' || p.type === filterType;
        matchesPrice = effectivePrice <= maxPrice;
    }

    return matchesSearch && matchesType && matchesPrice && matchesAffordability;
  }).sort((a, b) => {
    // Sort by affordability if data exists
    if (financialData) {
       const affA = calculateAffordability(a);
       const affB = calculateAffordability(b);
       return (affA?.monthsToSave || 0) - (affB?.monthsToSave || 0);
    }
    return 0;
  });

  const activeFilterCount = isManual 
    ? (manualType ? 1 : 0) + (manualPrice ? 1 : 0)
    : (filterType !== 'All' ? 1 : 0) + (maxPrice < 1000000000 ? 1 : 0);

  const resetFilters = () => {
       setFilterType('All');
       setMaxPrice(1000000000);
       setManualType('');
       setManualPrice('');
       setIsManual(false);
       setFinancialData(null);
       setAiExplanations({});
  };

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <FeaturedBanner />

      {/* Filter Bar */}
      <div className="px-4 py-3 sticky top-16 z-30 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
             <p className="text-sm font-bold text-slate-700 whitespace-nowrap">
                {filtered.length} {filtered.length === 1 ? 'Home' : 'Homes'}
             </p>
             {financialData && (
                 <span className="flex items-center bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full border border-purple-200 whitespace-nowrap">
                    <Sparkles size={10} className="mr-1" /> Smart Matched
                    <button onClick={() => { setFinancialData(null); setAiExplanations({}); }} className="ml-2 hover:text-purple-900"><X size={10}/></button>
                 </span>
             )}
         </div>

         <div className="flex gap-2">
            <button 
                onClick={() => setShowAiWizard(true)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${financialData ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50'}`}
            >
                <Sparkles size={14} />
                <span>AI Match</span>
            </button>
            <button 
            onClick={() => setShowFilters(true)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors border ${activeFilterCount > 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
                <SlidersHorizontal size={14} />
                {activeFilterCount > 0 && (
                <span className="bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center ml-1 shadow-sm">
                    {activeFilterCount}
                </span>
                )}
            </button>
         </div>
      </div>

      {/* Feed */}
      <div className="px-4 py-2 space-y-4 mt-2">
        {filtered.length > 0 ? (
          filtered.map(property => {
            const affordability = calculateAffordability(property);
            const explanation = aiExplanations[property.id];
            const isLoading = loadingExplanation[property.id];
            
            return (
                <div 
                key={property.id} 
                onClick={() => onSelect(property)}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border active:scale-[0.98] transition-transform cursor-pointer group relative ${
                    affordability?.status === 'Safe' && financialData ? 'border-green-300 ring-1 ring-green-100' : 
                    affordability?.status === 'Stretch' && financialData ? 'border-yellow-300' : 
                    'border-slate-100'
                }`}
                >
                {/* AI Affordability Badge Overlay */}
                {affordability && (
                    <div className={`absolute top-0 left-0 right-0 z-20 p-2 flex justify-center backdrop-blur-md bg-white/30 border-b ${
                        affordability.status === 'Safe' ? 'border-green-200' : 
                        affordability.status === 'Stretch' ? 'border-yellow-200' : 'border-red-200'
                    }`}>
                        <div className={`flex items-center px-3 py-1 rounded-full shadow-lg text-xs font-bold ${
                            affordability.status === 'Safe' ? 'bg-green-600 text-white' : 
                            affordability.status === 'Stretch' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                            {affordability.status === 'Safe' && <CheckCircle2 size={12} className="mr-1.5" />}
                            {affordability.status === 'Stretch' && <TrendingUp size={12} className="mr-1.5" />}
                            {affordability.status === 'Dangerous' && <AlertCircle size={12} className="mr-1.5" />}
                            
                            {affordability.status === 'Dangerous' 
                                ? "Out of Budget" 
                                : `Save for ${affordability.monthsToSave} month${affordability.monthsToSave !== 1 ? 's' : ''}`
                            }
                        </div>
                    </div>
                )}

                <div className="relative aspect-[4/3]">
                    <img src={property.media.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt={property.title} />
                    
                    <div className="absolute top-12 left-3">
                        <TrustBadge verification={property.verification} mini />
                    </div>
                    
                    {property.media.videoUrl && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center text-xs font-bold text-slate-800 shadow-sm">
                        <PlayCircle size={14} className="mr-1 text-red-500" />
                        Video Tour
                    </div>
                    )}

                    <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-white">
                    {property.type}
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{property.title}</h3>
                    <div className="text-right">
                        {property.totalInitialPayment && property.totalInitialPayment !== property.price ? (
                        <>
                            <p className="font-bold text-slate-900 text-sm">{formatPrice(property.totalInitialPayment)} <span className="text-[10px] text-slate-400 font-normal">1st Year</span></p>
                            <p className="text-green-700 text-xs font-medium">{formatPrice(property.price)}<span className="text-[10px] text-slate-400">/yr after</span></p>
                        </>
                        ) : (
                        <>
                            <p className="font-bold text-green-700">{formatPrice(property.price)}</p>
                            <p className="text-[10px] text-slate-400">{property.period || 'Total'}</p>
                        </>
                        )}
                    </div>
                    </div>
                    
                    <div className="flex items-center text-slate-500 text-xs mb-3">
                    <MapPin size={12} className="mr-1" />
                    {property.location.area}, {property.location.city}
                    </div>

                    {/* Financial Context & Chat Explanation */}
                    {affordability && (
                        <div className="mb-3">
                            {/* Standard Calculation Text (if safe or no chat yet) */}
                            {!explanation && affordability.status === 'Safe' && (
                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] text-slate-600">
                                        With your ₦{(affordability.disposableIncome/1000).toFixed(0)}k savings/mo, you can afford this comfortably.
                                    </p>
                                </div>
                            )}

                            {/* Prompt to Ask AI if Risky/Stretch and no explanation yet */}
                            {!explanation && !isLoading && (affordability.status === 'Dangerous' || affordability.status === 'Stretch') && (
                                <button 
                                    onClick={(e) => handleAskAi(e, property)}
                                    className="w-full text-left p-2 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-100 flex items-center justify-between transition-colors group/ai"
                                >
                                    <span className="text-[10px] text-purple-700 font-bold flex items-center">
                                        <Sparkles size={10} className="mr-1.5" /> 
                                        Why is this out of my budget?
                                    </span>
                                    <MessageCircle size={12} className="text-purple-400 group-hover/ai:text-purple-600" />
                                </button>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="p-2 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <Loader2 size={14} className="animate-spin text-purple-600 mr-2" />
                                    <span className="text-[10px] text-purple-600">Thinking...</span>
                                </div>
                            )}

                            {/* The AI Chat Response */}
                            {explanation && (
                                <div className="relative p-3 bg-purple-50 rounded-lg border border-purple-100 mt-2 animate-in fade-in slide-in-from-top-1">
                                    <div className="absolute -top-1.5 left-4 w-3 h-3 bg-purple-50 border-t border-l border-purple-100 transform rotate-45"></div>
                                    <p className="text-xs text-purple-900 italic leading-relaxed">
                                        "{explanation}"
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2 border-t border-slate-100 pt-3">
                    <div className="flex-1 text-center border-r border-slate-100">
                        <p className="text-[10px] text-slate-400">Power</p>
                        <p className="text-xs font-medium text-slate-800">{property.neighborhood.electricityReliability === 'Excellent (20h+)' ? '20h+' : property.neighborhood.electricityReliability}</p>
                    </div>
                    <div className="flex-1 text-center border-r border-slate-100">
                        <p className="text-[10px] text-slate-400">Water</p>
                        <p className="text-xs font-medium text-slate-800">{property.neighborhood.waterAvailability}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p className="text-[10px] text-slate-400">Security</p>
                        <p className="text-xs font-medium text-slate-800">{property.neighborhood.securityLevel}</p>
                    </div>
                    </div>
                </div>
                </div>
            )
          })
        ) : (
           <div className="text-center py-16 px-4">
             <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="text-slate-400" size={24} />
             </div>
             <h3 className="text-slate-900 font-bold mb-1">No homes match your criteria</h3>
             <p className="text-slate-500 text-sm mb-4">Try adjusting your budget or financial settings.</p>
             <button onClick={resetFilters} className="text-green-600 font-bold text-sm hover:underline">Clear all filters</button>
           </div>
        )}
      </div>

      {/* AI Wizard Modal */}
      {showAiWizard && (
         <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
             <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-slate-900 flex items-center">
                         <Sparkles className="mr-2 text-purple-600" /> AI Smart Match
                     </h3>
                     <button onClick={() => setShowAiWizard(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20}/></button>
                 </div>
                 
                 <div className="mb-6 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-sm text-purple-800 leading-relaxed">
                        Our AI calculates exactly how long you need to save to afford the initial payment (Rent + Agency + Legal + Caution) without affecting your daily needs.
                    </p>
                 </div>

                 <form onSubmit={handleAiSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Graphic Designer"
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          value={tempFinance.jobTitle}
                          onChange={e => setTempFinance({...tempFinance, jobTitle: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Monthly Income (₦)</label>
                        <input 
                          required
                          type="number" 
                          placeholder="e.g. 500000"
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          value={tempFinance.monthlyIncome || ''}
                          onChange={e => setTempFinance({...tempFinance, monthlyIncome: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Monthly Expenses (₦)</label>
                        <p className="text-xs text-slate-400 mb-2">Transport, Food, Data, etc. (Exclude Rent)</p>
                        <input 
                          required
                          type="number" 
                          placeholder="e.g. 200000"
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          value={tempFinance.monthlyExpenses || ''}
                          onChange={e => setTempFinance({...tempFinance, monthlyExpenses: Number(e.target.value)})}
                        />
                    </div>
                    
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center justify-center">
                            <Calculator className="mr-2" size={20} /> Calculate Affordability
                        </button>
                    </div>
                 </form>
             </div>
         </div>
      )}

      {/* Standard Filter Modal (existing code) */}
      {showFilters && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 animate-in slide-in-from-bottom-10 duration-300">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-slate-900">Filter Properties</h3>
                 <button onClick={() => setShowFilters(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                    <X size={20} className="text-slate-600"/>
                 </button>
              </div>

              {/* Toggle Filter Mode */}
              <div className="flex justify-center mb-6">
                  <div className="bg-slate-100 p-1 rounded-xl flex w-full">
                      <button 
                        onClick={() => setIsManual(false)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isManual ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                      >
                        Quick Select
                      </button>
                      <button 
                        onClick={() => setIsManual(true)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isManual ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                      >
                         Manual Input
                      </button>
                  </div>
              </div>

              {!isManual ? (
                <>
                    {/* Standard Type Filter */}
                    <div className="mb-8">
                        <p className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Property Type</p>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Flat', 'Duplex', 'Self-Con', 'Bungalow', 'Land'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all active:scale-95 ${filterType === t ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-green-200 hover:bg-white'}`}
                            >
                                {t}
                            </button>
                            ))}
                        </div>
                    </div>

                    {/* Standard Price Filter */}
                    <div className="mb-10">
                        <div className="flex justify-between mb-4">
                            <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Max First Year Budget</p>
                            <p className="text-base font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                                {maxPrice >= 1000000000 ? 'Any Price' : formatPrice(maxPrice)}
                            </p>
                        </div>
                        <div className="relative h-6 flex items-center">
                            <input 
                            type="range" 
                            min="500000" 
                            max="500000000" 
                            step="500000"
                            value={maxPrice >= 1000000000 ? 500000000 : maxPrice}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setMaxPrice(val >= 480000000 ? 1000000000 : val);
                            }}
                            className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600 z-20"
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                            <span>₦500k</span>
                            <span>₦500M+</span>
                        </div>
                    </div>
                </>
              ) : (
                /* Manual Input Mode */
                <div className="space-y-6 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Type of House</label>
                        <input 
                            type="text"
                            placeholder="e.g. Penthouse, Office Space"
                            value={manualType}
                            onChange={(e) => setManualType(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none bg-slate-50 font-medium"
                        />
                        <p className="text-xs text-slate-400 mt-1">Type exactly what you are looking for.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Max First Year Budget (₦)</label>
                        <input 
                            type="number"
                            placeholder="e.g. 5000000"
                            value={manualPrice}
                            onChange={(e) => setManualPrice(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none bg-slate-50 font-medium"
                        />
                         <p className="text-xs text-slate-400 mt-1">Enter the total amount you want to pay upfront.</p>
                    </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 border-t border-slate-100 pt-6">
                 <button 
                   onClick={resetFilters}
                   className="flex-1 py-3.5 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                 >
                   Reset
                 </button>
                 <button 
                   onClick={() => setShowFilters(false)}
                   className="flex-[2] py-3.5 font-bold text-white bg-green-600 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95"
                 >
                   Show {filtered.length} Homes
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFeed;