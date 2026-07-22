import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-card animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-200 rounded-lg" />
        <div className="w-6 h-6 bg-slate-200 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
  );
};
