import React from 'react';

const ShimmerRequestCard = () => {
  return (
    <div className="p-4 sm:p-6 flex flex-row items-center gap-3 sm:gap-4 w-full animate-pulse border-b border-slate-100 last:border-0 overflow-hidden">
      {/* Avatar Placeholder */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 rounded-2xl shrink-0" />

      {/* Text Content Placeholder */}
      <div className="flex-1 flex flex-col items-start space-y-2 min-w-0">
        {/* Name Line */}
        <div className="h-4 sm:h-5 w-24 sm:w-32 bg-slate-100 rounded-lg" />
        {/* Role Line */}
        <div className="h-2.5 sm:h-3 w-16 sm:w-24 bg-slate-100 rounded-lg" />
        
        {/* Match Info Badge Group */}
        <div className="flex items-center justify-start gap-2 sm:gap-3 mt-1 w-full">
             <div className="h-4 sm:h-5 w-16 sm:w-24 bg-slate-100 rounded-md shrink-0" />
             <div className="h-4 sm:h-5 w-12 sm:w-16 bg-slate-100 rounded-md shrink-0" />
        </div>
      </div>

      {/* Action Buttons Placeholder */}
      <div className="flex gap-2 w-auto shrink-0 mt-0">
        {/* Reject Button (Square-ish) */}
        <div className="h-10 w-10 sm:h-[46px] sm:w-[46px] bg-slate-100 rounded-xl shrink-0" />
        {/* Accept Button (Wide) */}
        <div className="h-10 w-20 sm:h-[46px] sm:w-[120px] bg-slate-100 rounded-xl shrink-0" />
      </div>
    </div>
  );
};

export default ShimmerRequestCard;