import React, { useState, useRef } from 'react';
import { parseUploadedFile } from '../utils/fileParsers';
import { documentService } from '../services/documentService';
import { Document } from '../types';
import toast from 'react-hot-toast';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (doc: Document) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleFileSelection = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'txt' && ext !== 'md' && ext !== 'docx') {
      toast.error('Unsupported file format. Please select a .txt, .md, or .docx file.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    try {
      const parsed = await parseUploadedFile(selectedFile);
      const newDoc = await documentService.uploadDocument({
        title: parsed.title,
        content: parsed.content,
        fileName: parsed.fileName,
      });

      toast.success(`Successfully uploaded "${parsed.fileName}"`);
      setSelectedFile(null);
      onClose();
      if (onUploadSuccess) {
        onUploadSuccess(newDoc);
      } else {
        navigate(`/document/${newDoc.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error processing file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated w-full max-w-md overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Upload Document</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-brand-500 bg-brand-50/50'
                : selectedFile
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-slate-300 hover:border-brand-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.docx"
              onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-900 truncate max-w-xs mx-auto">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB — Ready to import
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-medium text-slate-700">
                  Drag & drop your file here, or <span className="text-brand-600 font-semibold">browse</span>
                </p>
                <p className="text-xs text-slate-400">Supports .txt, .md, and .docx files</p>
              </div>
            )}
          </div>

          <div className="flex items-start space-x-2 text-xs text-slate-500 bg-slate-100/70 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              Uploaded content will be parsed into a new editable document inside your workspace.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadSubmit}
            disabled={!selectedFile || isUploading}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-sm transition flex items-center space-x-2"
          >
            {isUploading ? (
              <span>Importing...</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Import File</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
