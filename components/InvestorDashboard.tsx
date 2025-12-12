import React, { useState } from 'react';
import { Business } from '../types';
import { Search, Filter, Briefcase, TrendingUp, SlidersHorizontal } from 'lucide-react';
import BusinessDetail from './BusinessDetail';

interface Props {
  businesses: Business[];
  onViewDetails: (b: Business) => void;
}

const InvestorDashboard: React.FC<Props> = ({ businesses, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minEquity, setMinEquity] = useState(0);
  const [maxFunding, setMaxFunding] = useState(1000000);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesEquity = b.equityOffered >= minEquity;
    const matchesFunding = b.fundingGoal <= maxFunding;
    
    return matchesSearch && matchesCategory && matchesEquity && matchesFunding;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
         <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
               <input 
                 type="text" 
                 placeholder="Search businesses, keywords..." 
                 className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
               <select 
                 className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-brand-500"
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
               >
                 <option value="All">All Sectors</option>
                 <option value="Technology">Technology</option>
                 <option value="Retail">Retail</option>
                 <option value="Food & Beverage">Food & Beverage</option>
                 <option value="Service">Service</option>
                 <option value="Green Energy">Green Energy</option>
               </select>

               <div className="flex items-center space-x-2 border border-slate-300 rounded-lg px-4 py-2 bg-white min-w-[200px]">
                  <span className="text-sm text-slate-500">Max Funding:</span>
                  <input 
                    type="range" 
                    min="10000" 
                    max="500000" 
                    step="10000"
                    className="w-24 accent-brand-600"
                    value={maxFunding}
                    onChange={(e) => setMaxFunding(Number(e.target.value))}
                  />
                  <span className="text-sm font-bold text-slate-700">${(maxFunding/1000).toFixed(0)}k</span>
               </div>
            </div>
         </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center">
          <TrendingUp className="mr-2 text-brand-600" /> 
          {searchTerm || selectedCategory !== 'All' ? 'Search Results' : 'Recommended for You'}
        </h2>
        <p className="text-slate-500">Based on your investment history and preferences.</p>
      </div>

      {filteredBusinesses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-2 text-sm font-semibold text-slate-900">No matches found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map(business => (
            <div key={business.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
              <div className="h-48 overflow-hidden relative">
                <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                  {business.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{business.name}</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                  {business.shortDescription}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {business.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wide px-2 py-1 bg-slate-100 text-slate-600 rounded font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Goal</p>
                    <p className="text-sm font-bold text-slate-900">${business.fundingGoal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Equity</p>
                    <p className="text-sm font-bold text-slate-900">{business.equityOffered}%</p>
                  </div>
                </div>

                <button
                  onClick={() => onViewDetails(business)}
                  className="w-full mt-auto bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold py-3 rounded-lg border border-brand-200 transition-colors flex items-center justify-center group"
                >
                  View Opportunity <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestorDashboard;