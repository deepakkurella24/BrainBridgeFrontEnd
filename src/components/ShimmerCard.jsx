import React from 'react'

const ShimmerCard = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
    <div className="animate-pulse">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
        <div className="relative">
            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-200"></div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-300 border-4 border-white rounded-full"></div>
        </div>
        <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
        </div>

        {/* Offers */}
        <div className="space-y-4 mb-6">
        <div>
            <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div>
            <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-slate-200 rounded-lg"></div>
            <div className="h-6 w-20 bg-slate-200 rounded-lg"></div>
            <div className="h-6 w-14 bg-slate-200 rounded-lg"></div>
            </div>
        </div>

        {/* Wants */}
        <div>
            <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div>
            <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-slate-200 rounded-lg"></div>
            <div className="h-6 w-20 bg-slate-200 rounded-lg"></div>
            <div className="h-6 w-14 bg-slate-200 rounded-lg"></div>
            </div>
        </div>
        </div>

        {/* Goal */}
        <div className="mb-6">
        <div className="h-3 w-28 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-slate-200 rounded mb-1"></div>
        <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
        </div>

        {/* Button */}
        <div className="h-14 bg-slate-200 rounded-2xl w-full"></div>

    </div>
    </div>

  )
}

export default ShimmerCard