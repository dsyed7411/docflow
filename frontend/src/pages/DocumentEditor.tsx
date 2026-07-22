import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document } from '../types';
import { documentService } from '../services/documentService';
import { RichTextEditor } from '../components/RichTextEditor';
import { ShareModal } from '../components/ShareModal';
import { UploadModal } from '../components/UploadModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAutosave } from '../hooks/useAutosave';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Share2,
  Upload,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Users,
} from 'lucide-react';

export const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();

  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDoc = async () => {
      setIsLoading(true);
      try {
        const doc = await documentService.getDocumentById(id);
        setDocument(doc);
        setTitle(doc.title || 'Untitled Document');
        setContent(doc.content || '{"type":"doc","content":[{"type":"paragraph","content":[]}]}');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Document not found');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoc();
  }, [id, navigate]);

  // Save callback
  const handleSave = useCallback(
    async (data: { title: string; content: string }) => {
      if (!id || !document) return;
      const updated = await documentService.updateDocument(id, {
        title: data.title,
        content: data.content,
      });
      setDocument(updated);
    },
    [id, document]
  );

  const { saveStatus, saveImmediately } = useAutosave({
    data: { title, content },
    onSave: handleSave,
    delayMs: 2000,
    enabled: !isLoading && !!document,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Opening document..." />
      </div>
    );
  }

  if (!document) return null;

  const isOwner = Boolean(document.isOwner);
  const ownerName = document.owner?.name || (isOwner ? loggedInUser?.name : '') || 'Owner';
  const ownerEmail = document.owner?.email || (isOwner ? loggedInUser?.email : '');
  const sharedWithList = Array.isArray(document.sharedWith) ? document.sharedWith : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center space-x-3 flex-1 min-w-0 pr-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition flex-shrink-0"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Editable Document Title */}
          <div className="min-w-0 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled document"
              className="font-bold text-slate-900 text-lg w-full bg-transparent hover:bg-slate-100/70 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-lg px-2 py-1 outline-none transition truncate"
            />
          </div>

          {/* Autosave Status Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100/80 text-slate-600 flex-shrink-0">
            {saveStatus === 'saving' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-brand-600 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-rose-600">Save Failed</span>
              </>
            )}
            {saveStatus === 'idle' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Ready</span>
              </>
            )}
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Manual Save Trigger */}
          <button
            type="button"
            onClick={saveImmediately}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-medium rounded-xl text-xs transition flex items-center space-x-1.5"
            title="Manual save"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-medium rounded-xl text-xs transition flex items-center space-x-1.5"
            title="Upload file into document"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl text-xs transition shadow-sm hover:shadow flex items-center space-x-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
            {sharedWithList.length > 0 && (
              <span className="bg-brand-700 px-1.5 py-0.5 rounded-full text-[10px] ml-1">
                {sharedWithList.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Editor Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {/* Ownership Banner */}
        {!isOwner && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center space-x-2 text-xs text-emerald-800">
            <Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              This document is owned by <strong>{ownerName}</strong> {ownerEmail ? `(${ownerEmail})` : ''}. You have collaborative access to edit.
            </span>
          </div>
        )}

        <RichTextEditor content={content} onChange={(newJson) => setContent(newJson)} />
      </main>

      {/* Modals */}
      <ShareModal
        document={document}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onSharedSuccess={(updatedDoc) => setDocument(updatedDoc)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(newDoc) => navigate(`/document/${newDoc.id}`)}
      />
    </div>
  );
};
