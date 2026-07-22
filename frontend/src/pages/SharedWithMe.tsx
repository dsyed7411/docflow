import React, { useEffect, useState } from 'react';
import { Document } from '../types';
import { documentService } from '../services/documentService';
import { DocumentCard } from '../components/DocumentCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import toast from 'react-hot-toast';
import { Users } from 'lucide-react';

export const SharedWithMe: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShared = async () => {
      setIsLoading(true);
      try {
        const data = await documentService.getSharedDocuments();
        setDocuments(data);
      } catch (error: any) {
        toast.error('Failed to load shared documents');
      } finally {
        setIsLoading(false);
      }
    };
    fetchShared();
  }, []);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shared With Me</h1>
          <p className="text-sm text-slate-500">Documents shared with your account by teammates</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No shared documents yet"
          description="When teammates share documents with your email address, they will appear here."
        />
      )}
    </div>
  );
};
