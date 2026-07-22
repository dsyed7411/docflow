import React, { useState } from 'react';
import { Document, User } from '../types';
import { documentService } from '../services/documentService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { X, UserPlus, CheckCircle2, Mail } from 'lucide-react';
import { getInitials } from '../utils/formatters';

interface ShareModalProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
  onSharedSuccess?: (updatedDoc: Document) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  document,
  isOpen,
  onClose,
  onSharedSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: loggedInUser } = useAuth();

  if (!isOpen || !document) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedDoc = await documentService.shareDocument({
        documentId: document.id,
        email: email.trim(),
      });
      toast.success(`Document shared with ${email.trim()}`);
      setEmail('');
      if (onSharedSuccess) {
        onSharedSuccess(updatedDoc);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to share document';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = Boolean(document.isOwner);
  const ownerName = document.owner?.name || (isOwner ? loggedInUser?.name : '') || 'Owner';
  const ownerEmail = document.owner?.email || (isOwner ? loggedInUser?.email : '');
  const sharedUsersList = Array.isArray(document.sharedWith) ? document.sharedWith : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated w-full max-w-md overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Share Document</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleShare} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Grant Access
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter colleague's email..."
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-xl text-sm outline-none transition"
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition shadow-sm hover:shadow flex items-center space-x-1.5 flex-shrink-0"
              >
                {isSubmitting ? (
                  <span>Sharing...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Grant</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Shared list */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
              People with access ({1 + sharedUsersList.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {/* Owner */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                    {getInitials(ownerName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{ownerName}</p>
                    {ownerEmail && <p className="text-xs text-slate-500">{ownerEmail}</p>}
                  </div>
                </div>
                <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                  Owner
                </span>
              </div>

              {/* Shared users */}
              {sharedUsersList.length > 0 ? (
                sharedUsersList.map((user: User, idx: number) => {
                  const userName = user?.name || 'User';
                  const userEmail = user?.email || '';
                  return (
                    <div
                      key={user?.id || idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {getInitials(userName)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{userName}</p>
                          {userEmail && <p className="text-xs text-slate-500">{userEmail}</p>}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Can edit</span>
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-2">
                  Not shared with anyone else yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
