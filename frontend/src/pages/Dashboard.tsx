import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../types';
import { documentService } from '../services/documentService';
import { DocumentCard } from '../components/DocumentCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { UploadModal } from '../components/UploadModal';
import toast from 'react-hot-toast';
import { Plus, Upload, Folder, Users, FileText } from 'lucide-react';

interface DashboardProps {
  searchQuery?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ searchQuery = '' }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'owned' | 'shared'>('all');
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentService.getDocuments(searchQuery);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [searchQuery]);

  const handleCreateNew = async () => {
    try {
      const newDoc = await documentService.createDocument({
        title: 'Untitled Document',
        content: '{"type":"doc","content":[{"type":"paragraph","content":[]}]}',
      });
      toast.success('Document created');
      navigate(`/document/${newDoc.id}`);
    } catch (error: any) {
      toast.error('Failed to create document');
    }
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      await documentService.deleteDocument(id);
      toast.success('Document deleted');
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    }
  };

  const safeDocs = Array.isArray(documents) ? documents : [];

  const filteredDocuments = safeDocs.filter((doc) => {
    if (!doc) return false;
    if (activeTab === 'owned') return Boolean(doc.isOwner);
    if (activeTab === 'shared') return !doc.isOwner;
    return true;
  });

  const ownedCount = safeDocs.filter((d) => Boolean(d?.isOwner)).length;
  const sharedCount = safeDocs.filter((d) => !d?.isOwner).length;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Workspaces</h1>
          <p className="text-sm text-slate-500">
            Create, edit, and collaborate on your documents in real-time
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 font-medium rounded-xl text-sm transition"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-medium rounded-xl text-sm transition shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
        </div>
      </div>

      {/* Tabs & Stats Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All Documents ({safeDocs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('owned')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'owned'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>My Documents ({ownedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shared')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'shared'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Shared With Me ({sharedCount})</span>
          </button>
        </div>
      </div>

      {/* Main Document Grid */}
      <section className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onDelete={handleDeleteDocument} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? 'No matching documents found' : 'No documents yet'}
            description={
              searchQuery
                ? `No documents match "${searchQuery}". Try a different keyword.`
                : 'Get started by creating a new document or uploading a .txt, .md, or .docx file.'
            }
            onCreateNew={handleCreateNew}
            onUpload={() => setIsUploadOpen(true)}
          />
        )}
      </section>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => fetchDocuments()}
      />
    </div>
  );
};
