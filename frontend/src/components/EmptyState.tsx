import React from 'react';
import { FileText, Plus, Upload } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  onCreateNew?: () => void;
  onUpload?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  onCreateNew,
  onUpload,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
        <FileText className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">{description}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl text-sm transition shadow-sm hover:shadow active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
        )}
        {onUpload && (
          <button
            onClick={onUpload}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition shadow-sm hover:shadow active:scale-95"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Upload File</span>
          </button>
        )}
      </div>
    </div>
  );
};
