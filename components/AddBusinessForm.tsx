import React, { useState } from 'react';
import { Business, ViewState } from '../types';
import { generatePitch } from '../services/geminiService';
import { Sparkles, Loader2, DollarSign, MapPin, Building2, User } from 'lucide-react';

interface Props {
  onAddBusiness: (business: Business) => void;
  onCancel: () => void;
}

const AddBusinessForm: React.FC<Props> = ({ onAddBusiness, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    category: 'Technology',
    shortDescription: '',
    fundingGoal: '',
    equityOffered: '',
    location: '',
    fullPitch: ''
  });

  const handleGeneratePitch = async () => {
    if (!formData.name || !formData.shortDescription) {
      alert("Please provide a business name and short description first.");
      return;
    }
    setLoading(true);
    const pitch = await generatePitch(formData.name, formData.shortDescription, formData.category);
    setFormData(prev => ({ ...prev, fullPitch: pitch }));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBusiness: Business = {
      id: Date.now().toString(),
      ownerId: 'temp-owner-id', // Placeholder, in real app this comes from auth
      name: formData.name,
      ownerName: formData.ownerName,
      category: formData.category,
      shortDescription: formData.shortDescription,
      fundingGoal: Number(formData.fundingGoal),
      equityOffered: Number(formData.equityOffered),
      location: formData.location,
      fullPitch: formData.fullPitch || formData.shortDescription,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
      tags: [formData.category, 'Startup', 'Growth'],
      status: 'pending'
    };
    onAddBusiness(newBusiness);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-brand-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Building2 className="mr-2" /> List Your Business
          </h2>
          <p className="text-brand-100 text-sm mt-1">Connect with investors looking for opportunities like yours.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <input
                required
                type="text"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. EcoBox Solutions"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  className="w-full pl-10 rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Technology</option>
                <option>Retail</option>
                <option>Food & Beverage</option>
                <option>Health & Wellness</option>
                <option>Service</option>
                <option>Green Energy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  className="w-full pl-10 rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Austin, TX"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Funding Goal ($)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-slate-400" />
              </div>
              <input
                required
                type="number"
                className="w-full pl-10 rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
                value={formData.fundingGoal}
                onChange={e => setFormData({ ...formData, fundingGoal: e.target.value })}
                placeholder="50000"
              />
            </div>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Equity Offered (%)</label>
            <input
              required
              type="number"
              max="100"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
              value={formData.equityOffered}
              onChange={e => setFormData({ ...formData, equityOffered: e.target.value })}
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Description (Core Concept)</label>
            <textarea
              required
              rows={3}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
              value={formData.shortDescription}
              onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Briefly describe what your business does..."
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Business Pitch</label>
                <button
                  type="button"
                  onClick={handleGeneratePitch}
                  disabled={loading}
                  className="flex items-center text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full hover:shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin h-3 w-3 mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                  {loading ? 'Generating...' : 'Auto-Generate with AI'}
                </button>
             </div>
             <p className="text-xs text-slate-500 mb-3">
               Can't find the right words? Enter your name and short description above, and let our AI draft a professional pitch for you.
             </p>
             <textarea
                required
                rows={8}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border text-sm"
                value={formData.fullPitch}
                onChange={e => setFormData({ ...formData, fullPitch: e.target.value })}
                placeholder="Your full elevator pitch to investors..."
             />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Post Business
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusinessForm;