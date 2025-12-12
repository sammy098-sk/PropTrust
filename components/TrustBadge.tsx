import React from 'react';
import { VerificationDocs } from '../types';
import { ShieldCheck, Video, FileCheck, UserCheck, BadgeCheck } from 'lucide-react';

interface Props {
  verification: VerificationDocs;
  mini?: boolean;
}

const TrustBadge: React.FC<Props> = ({ verification, mini = false }) => {
  const score = Object.values(verification).filter(Boolean).length;
  
  // If property is Admin Verified, show the Blue Tick
  if (verification.adminVerified) {
    if (mini) {
       return (
         <div className="flex items-center space-x-1 bg-blue-600 px-2 py-0.5 rounded-full shadow-sm">
           <BadgeCheck size={12} className="text-white" />
           <span className="text-[10px] font-bold text-white">Verified</span>
         </div>
       );
    }
    
    return (
        <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                <BadgeCheck size={14} className="mr-1.5" /> NaijaPropTrust Verified
            </span>
            {/* Show specific badges next to it */}
            {verification.videoVerified && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                <Video size={12} className="mr-1" /> Video Tour
                </span>
            )}
        </div>
    );
  }

  // Standard Verification Badges
  if (mini) {
    if (score === 0) return null;
    return (
      <div className="flex items-center space-x-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
        <ShieldCheck size={12} className="text-green-600" />
        <span className="text-[10px] font-bold text-green-700">{score}/4 Checks</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {verification.idVerified && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          <UserCheck size={12} className="mr-1" /> ID Verified
        </span>
      )}
      {verification.ownershipVerified && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
          <FileCheck size={12} className="mr-1" /> Deed Verified
        </span>
      )}
      {verification.videoVerified && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
          <Video size={12} className="mr-1" /> Video Tour
        </span>
      )}
      {verification.agentLicenseVerified && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
          <ShieldCheck size={12} className="mr-1" /> Licensed Agent
        </span>
      )}
    </div>
  );
};

export default TrustBadge;