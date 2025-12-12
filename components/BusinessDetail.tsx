import React, { useState } from 'react';
import { Business, InvestmentAnalysis } from '../types';
import { analyzeBusiness } from '../services/geminiService';
import { 
  X, MapPin, DollarSign, PieChart, Tag, 
  Sparkles, AlertTriangle, CheckCircle, BrainCircuit, Loader2
} from 'lucide-react';

interface Props {
  business: Business;
  onClose: () => void;
}

const BusinessDetail: React.FC<Props> = ({ business, onClose }) => {
  const [analysis, setAnalysis] = useState<InvestmentAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const result = await analyzeBusiness(
      business.name,
      business.shortDescription,
      business.fullPitch,
      business.fundingGoal,
      business.equityOffered
    );
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-white">
            <div className="relative h-64 sm:h-80 w-full">
              <img 
                src={business.imageUrl} 
                alt={business.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h1 className="text-4xl font-bold">{business.name}</h1>
                  <p className="text-lg opacity-90 mt-2">{business.shortDescription}</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">About the Opportunity</h3>
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                    {business.fullPitch}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {business.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                      <Tag className="w-3 h-3 mr-1" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sidebar / Stats */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Investment Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <div className="flex items-center text-slate-700">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        <span className="font-medium">Funding Goal</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">${business.fundingGoal.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <div className="flex items-center text-slate-700">
                        <PieChart className="w-5 h-5 mr-2 text-brand-600" />
                        <span className="font-medium">Equity Offered</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{business.equityOffered}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-700">
                        <MapPin className="w-5 h-5 mr-2 text-red-500" />
                        <span className="font-medium">Location</span>
                      </div>
                      <span className="text-slate-900">{business.location}</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 bg-brand-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-sm">
                    Connect with {business.ownerName}
                  </button>
                </div>

                {/* AI Analysis Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-indigo-900 flex items-center mb-2">
                      <BrainCircuit className="w-5 h-5 mr-2 text-indigo-600" /> AI Investment Analysis
                    </h3>
                    
                    {!analysis && !analyzing && (
                      <div className="mt-4">
                        <p className="text-sm text-indigo-700 mb-4">
                          Get an instant, unbiased assessment of this business opportunity powered by Gemini.
                        </p>
                        <button 
                          onClick={handleAnalyze}
                          className="w-full bg-white text-indigo-600 border border-indigo-200 py-2 px-4 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center shadow-sm"
                        >
                          <Sparkles className="w-4 h-4 mr-2" /> Analyze Opportunity
                        </button>
                      </div>
                    )}

                    {analyzing && (
                       <div className="flex flex-col items-center justify-center py-8 text-indigo-600">
                         <Loader2 className="w-8 h-8 animate-spin mb-2" />
                         <span className="text-sm font-medium">Crunching the numbers...</span>
                       </div>
                    )}

                    {analysis && (
                      <div className="mt-4 space-y-4 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg">
                           <span className="text-sm font-medium text-slate-600">Risk Level</span>
                           <span className={`px-2 py-0.5 rounded text-sm font-bold ${
                             analysis.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                             analysis.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                             'bg-red-100 text-red-700'
                           }`}>{analysis.riskLevel}</span>
                        </div>
                         
                        <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg">
                           <span className="text-sm font-medium text-slate-600">Viability Score</span>
                           <span className="text-lg font-bold text-indigo-700">{analysis.score}/100</span>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Key Strengths
                          </p>
                          <ul className="text-xs text-slate-700 list-disc list-inside">
                            {analysis.strengths.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1 flex items-center">
                             <AlertTriangle className="w-3 h-3 mr-1" /> Concerns
                          </p>
                          <ul className="text-xs text-slate-700 list-disc list-inside">
                            {analysis.concerns.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-indigo-200">
                          <p className="text-xs font-medium text-indigo-900 italic">
                            "{analysis.verdict}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Decorative */}
                  <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
