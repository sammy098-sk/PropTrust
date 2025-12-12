import React, { useState, useEffect } from 'react';
import { User, ViewState } from '../types';
import { User as UserIcon, Shield, Briefcase, CheckCircle2, Upload, Edit3, MapPin, FileText, Phone, Mail, Save, X } from 'lucide-react';

interface Props {
  user: User;
  onNavigate: (view: ViewState) => void;
  onUpdate?: (user: User) => void;
}

const TenantProfile: React.FC<Props> = ({ user, onNavigate, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState<User>(user);
  
  // Initialize with default values if not present
  const [employmentData, setEmploymentData] = useState(user.employment || {
      employer: 'Paystack',
      jobTitle: 'Software Engineer',
      duration: '2 years',
      incomeRange: '₦650k - ₦800k',
      contractType: 'Full-Time'
  });
  
  const [address, setAddress] = useState(user.address || '12B Alara Street, Yaba, Lagos');

  // Update local state when user prop changes
  useEffect(() => {
    setFormData(user);
    if (user.address) setAddress(user.address);
    if (user.employment) setEmploymentData(user.employment);
  }, [user]);

  const handleSave = () => {
    const updatedUser: User = {
        ...formData,
        address: address,
        employment: employmentData
    };
    
    if (onUpdate) {
        onUpdate(updatedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    if (user.address) setAddress(user.address);
    if (user.employment) setEmploymentData(user.employment);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-200">
        <div className="flex items-start justify-between mb-4">
           <div className="flex items-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden border-2 border-white shadow-sm shrink-0">
                 {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <UserIcon size={32}/>}
              </div>
              <div className="ml-4">
                 {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-xl font-bold text-slate-900 border-b border-slate-300 focus:border-green-600 focus:outline-none bg-transparent w-full"
                    />
                 ) : (
                    <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                 )}
                 <p className="text-sm text-slate-500">{user.email}</p>
                 <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                       <Shield size={10} className="mr-1" /> Verified Tenant
                    </span>
                 </div>
              </div>
           </div>
           
           {!isEditing ? (
             <button 
               onClick={() => setIsEditing(true)}
               className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
               title="Edit Profile"
             >
                <Edit3 size={20} />
             </button>
           ) : (
             <div className="flex space-x-2">
                <button 
                  onClick={handleCancel}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Cancel"
                >
                   <X size={20} />
                </button>
                <button 
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                  title="Save Changes"
                >
                   <Save size={20} />
                </button>
             </div>
           )}
        </div>
        
        {/* Profile Completion Meter */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
           <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-700">Renter Score: Excellent</span>
              <span className="text-xs font-bold text-green-600">850/1000</span>
           </div>
           <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
           </div>
           <p className="text-[10px] text-slate-500 mt-1">Complete your employment details to boost your score.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-200 px-6 sticky top-0 z-10">
         <button 
           onClick={() => setActiveTab('overview')}
           className={`pb-3 pt-2 text-sm font-medium mr-6 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500'}`}
         >
            Overview
         </button>
         <button 
           onClick={() => setActiveTab('documents')}
           className={`pb-3 pt-2 text-sm font-medium mr-6 border-b-2 transition-colors ${activeTab === 'documents' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500'}`}
         >
            Documents
         </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
         {activeTab === 'overview' ? (
            <>
               {/* Personal Info Card */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                     <UserIcon size={18} className="mr-2 text-slate-400"/> Personal Info
                  </h3>
                  <div className="space-y-4">
                     <div className="flex items-start">
                        <Phone size={16} className="text-slate-400 mr-3 mt-0.5" />
                        <div className="flex-1">
                           <p className="text-xs text-slate-500">Phone Number</p>
                           {isEditing ? (
                              <input 
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="text-sm font-medium text-slate-900 w-full border-b border-slate-200 focus:border-green-500 focus:outline-none py-1"
                              />
                           ) : (
                              <p className="text-sm font-medium text-slate-900">{formData.phone || '+234 800 000 0000'}</p>
                           )}
                        </div>
                     </div>
                     <div className="flex items-start">
                        <Mail size={16} className="text-slate-400 mr-3 mt-0.5" />
                        <div className="flex-1">
                           <p className="text-xs text-slate-500">Email Address</p>
                           <p className="text-sm font-medium text-slate-900">{formData.email}</p>
                           {isEditing && <p className="text-[10px] text-slate-400">Email cannot be changed.</p>}
                        </div>
                     </div>
                     <div className="flex items-start">
                        <MapPin size={16} className="text-slate-400 mr-3 mt-0.5" />
                        <div className="flex-1">
                           <p className="text-xs text-slate-500">Current Address</p>
                           {isEditing ? (
                              <input 
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="text-sm font-medium text-slate-900 w-full border-b border-slate-200 focus:border-green-500 focus:outline-none py-1"
                              />
                           ) : (
                              <p className="text-sm font-medium text-slate-900">{address}</p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Employment Card */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                     <Briefcase size={18} className="mr-2 text-slate-400"/> Employment
                  </h3>
                  <div className="flex items-center mb-4">
                     <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold mr-3 border border-blue-100 shrink-0">
                       {employmentData.employer.charAt(0)}
                     </div>
                     <div className="flex-1">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input 
                                    type="text" 
                                    placeholder="Employer"
                                    value={employmentData.employer}
                                    onChange={(e) => setEmploymentData({...employmentData, employer: e.target.value})}
                                    className="block w-full text-sm font-bold text-slate-900 border-b border-slate-200 focus:border-blue-500 focus:outline-none"
                                />
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Job Title"
                                        value={employmentData.jobTitle}
                                        onChange={(e) => setEmploymentData({...employmentData, jobTitle: e.target.value})}
                                        className="block w-1/2 text-xs text-slate-500 border-b border-slate-200 focus:border-blue-500 focus:outline-none"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Duration"
                                        value={employmentData.duration}
                                        onChange={(e) => setEmploymentData({...employmentData, duration: e.target.value})}
                                        className="block w-1/2 text-xs text-slate-500 border-b border-slate-200 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-slate-900">{employmentData.employer}</p>
                                <p className="text-xs text-slate-500">{employmentData.jobTitle} • {employmentData.duration}</p>
                            </>
                        )}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-500 mb-1 uppercase">Monthly Income</p>
                        {isEditing ? (
                            <input 
                                type="text"
                                value={employmentData.incomeRange}
                                onChange={(e) => setEmploymentData({...employmentData, incomeRange: e.target.value})}
                                className="text-sm font-bold text-green-700 w-full bg-transparent border-b border-slate-300 focus:outline-none focus:border-green-500"
                            />
                        ) : (
                            <p className="text-sm font-bold text-green-700">{employmentData.incomeRange}</p>
                        )}
                     </div>
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-500 mb-1 uppercase">Contract Type</p>
                        {isEditing ? (
                            <select
                                value={employmentData.contractType}
                                onChange={(e) => setEmploymentData({...employmentData, contractType: e.target.value})}
                                className="text-sm font-bold text-slate-700 w-full bg-transparent border-b border-slate-300 focus:outline-none focus:border-blue-500"
                            >
                                <option>Full-Time</option>
                                <option>Part-Time</option>
                                <option>Contract</option>
                                <option>Freelance</option>
                            </select>
                        ) : (
                            <p className="text-sm font-bold text-slate-700">{employmentData.contractType}</p>
                        )}
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <div className="space-y-3">
               <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center">
                     <div className="p-2 bg-green-50 text-green-600 rounded-lg mr-3"><CheckCircle2 size={20}/></div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">Government ID</p>
                        <p className="text-xs text-slate-500">Verified • NIN / Passport</p>
                     </div>
                  </div>
                  <button className="text-xs font-bold text-slate-400 hover:text-green-600 px-3 py-1 bg-slate-50 rounded-md">View</button>
               </div>
               
               <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center">
                     <div className="p-2 bg-green-50 text-green-600 rounded-lg mr-3"><CheckCircle2 size={20}/></div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">Bank Statement</p>
                        <p className="text-xs text-slate-500">Verified • Last 6 months</p>
                     </div>
                  </div>
                  <button className="text-xs font-bold text-slate-400 hover:text-green-600 px-3 py-1 bg-slate-50 rounded-md">View</button>
               </div>

               <button className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 flex flex-col items-center justify-center hover:bg-white hover:border-green-500 hover:text-green-600 transition-all bg-slate-50">
                  <Upload size={24} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">Upload Employment Letter</span>
                  <span className="text-[10px] text-slate-400 mt-1">PDF or JPG up to 5MB</span>
               </button>
            </div>
         )}
         
         <div className="mt-8 pt-4">
            <button 
               onClick={() => onNavigate(ViewState.AUTH)}
               className="w-full bg-white border border-red-100 text-red-600 py-3 rounded-xl font-medium text-sm hover:bg-red-50 transition-colors shadow-sm"
            >
               Log Out
            </button>
         </div>
      </div>
    </div>
  );
};

export default TenantProfile;