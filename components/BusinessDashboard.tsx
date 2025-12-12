import React, { useState } from 'react';
import { Business } from '../types';
import { Upload, FileText, DollarSign, Edit3, Save, Eye, TrendingUp, Download } from 'lucide-react';
import AddBusinessForm from './AddBusinessForm';

interface Props {
  userBusiness?: Business | null;
  onUpdateBusiness: (b: Business) => void;
}

const BusinessDashboard: React.FC<Props> = ({ userBusiness, onUpdateBusiness }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!userBusiness && !isEditing) {
     return (
       <div className="max-w-4xl mx-auto py-12 px-4 text-center">
         <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200">
           <div className="bg-brand-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="text-brand-600 h-10 w-10" />
           </div>
           <h2 className="text-3xl font-bold text-slate-900 mb-4">Create your Business Profile</h2>
           <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
             Get discovered by hundreds of accredited investors. Upload your pitch deck, set your funding goals, and leverage our AI tools to stand out.
           </p>
           <button 
             onClick={() => setIsEditing(true)}
             className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
             Get Started
           </button>
         </div>
       </div>
     );
  }

  if (isEditing) {
    return (
      <AddBusinessForm 
        onAddBusiness={(b) => { onUpdateBusiness(b); setIsEditing(false); }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-brand-100 text-sm font-medium mb-1">Funding Goal</p>
            <h3 className="text-3xl font-bold">${userBusiness?.fundingGoal.toLocaleString()}</h3>
            <div className="mt-4 flex items-center text-sm">
               <div className="bg-white/20 px-2 py-1 rounded text-white mr-2">
                 {userBusiness?.equityOffered}% Equity
               </div>
               <span>offered</span>
            </div>
         </div>
         
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-1">Profile Views</p>
            <h3 className="text-3xl font-bold text-slate-900">1,245</h3>
            <p className="text-green-600 text-sm mt-2 flex items-center"><TrendingUp size={14} className="mr-1"/> +12% this week</p>
         </div>

         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-1">Investor Interest</p>
            <h3 className="text-3xl font-bold text-slate-900">18</h3>
            <p className="text-brand-600 text-sm mt-2 cursor-pointer hover:underline">View messages</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-48 overflow-hidden relative">
                 <img src={userBusiness?.imageUrl} className="w-full h-full object-cover" />
                 <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg text-slate-700 hover:text-brand-600 font-medium shadow-sm flex items-center text-sm">
                    <Edit3 size={16} className="mr-2" /> Edit Profile
                 </button>
              </div>
              <div className="p-8">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h1 className="text-2xl font-bold text-slate-900">{userBusiness?.name}</h1>
                       <p className="text-slate-500">{userBusiness?.location} • {userBusiness?.category}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                      Approved
                    </span>
                 </div>
                 
                 <h3 className="text-lg font-bold text-slate-900 mb-2">The Pitch</h3>
                 <p className="text-slate-600 whitespace-pre-line leading-relaxed mb-6">
                    {userBusiness?.fullPitch}
                 </p>

                 <div className="flex flex-wrap gap-2">
                    {userBusiness?.tags.map(tag => (
                       <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                          {tag}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Documents Sidebar */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                 <FileText className="mr-2 text-brand-600" /> Documents
              </h3>
              
              <div className="space-y-3 mb-6">
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center overflow-hidden">
                       <div className="bg-red-100 p-2 rounded text-red-600 mr-3"><FileText size={18}/></div>
                       <div className="truncate">
                          <p className="text-sm font-medium text-slate-700">Pitch_Deck_v2.pdf</p>
                          <p className="text-xs text-slate-400">2.4 MB • Uploaded 2d ago</p>
                       </div>
                    </div>
                    <button className="text-slate-400 hover:text-brand-600"><Download size={18}/></button>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center overflow-hidden">
                       <div className="bg-blue-100 p-2 rounded text-blue-600 mr-3"><FileText size={18}/></div>
                       <div className="truncate">
                          <p className="text-sm font-medium text-slate-700">Financials_2023.xlsx</p>
                          <p className="text-xs text-slate-400">1.1 MB • Uploaded 5d ago</p>
                       </div>
                    </div>
                    <button className="text-slate-400 hover:text-brand-600"><Download size={18}/></button>
                 </div>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                 <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                    <Upload size={24} className="text-slate-400 group-hover:text-brand-600" />
                 </div>
                 <p className="text-sm font-medium text-slate-900">Upload new document</p>
                 <p className="text-xs text-slate-500 mt-1">PDF, DOCX, XLSX up to 10MB</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;