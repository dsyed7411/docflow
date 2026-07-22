import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../types';
import { formatRelativeTime, getInitials } from '../utils/formatters';
import { FileText, Users, Trash2, MoreVertical } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  onDelete?: (id: number) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    if (document?.id) {
      navigate(`/document/${document.id}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (document?.id && onDelete && window.confirm(`Are you sure you want to delete "${document.title || 'Untitled Document'}"?`)) {
      onDelete(document.id);
    }
  };

  const ownerName = document?.owner?.name || 'Unknown User';
  const isOwner = Boolean(document?.isOwner);
  const sharedWithList = Array.isArray(document?.sharedWith) ? document.sharedWith : [];
  const hasSharedWithOthers = isOwner && sharedWithList.length > 0;
  const isSharedWithMe = !isOwner;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-xl border border-slate-200/80 p-5 shadow-card hover:shadow-elevated hover:border-brand-200 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>

          <div className="flex items-center space-x-2">
            {isSharedWithMe && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Users className="w-3 h-3" />
                <span>Shared with you</span>
              </span>
            )}

            {hasSharedWithOthers && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                <Users className="w-3 h-3" />
                <span>Shared ({sharedWithList.length})</span>
              </span>
            )}

            {isOwner && onDelete && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full text-left px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-slate-900 text-base line-clamp-2 group-hover:text-brand-600 transition-colors mb-1">
          {document?.title || 'Untitled Document'}
        </h3>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
            {getInitials(ownerName)}
          </div>
          <span className="truncate">{isOwner ? 'You' : ownerName}</span>
        </div>

        <span className="text-slate-400 flex-shrink-0">
          {formatRelativeTime(document?.updatedAt)}
        </span>
      </div>
    </div>
  );
};
