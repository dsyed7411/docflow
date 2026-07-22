import { api } from './api';
import { Document } from '../types';

export const documentService = {
  async getDocuments(search?: string, filter?: 'owned' | 'shared'): Promise<Document[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filter) params.append('filter', filter);

    const response = await api.get<Document[]>(`/api/documents?${params.toString()}`);
    return response.data;
  },

  async getSharedDocuments(): Promise<Document[]> {
    const response = await api.get<Document[]>('/api/shared');
    return response.data;
  },

  async getDocumentById(id: number | string): Promise<Document> {
    const response = await api.get<Document>(`/api/documents/${id}`);
    return response.data;
  },

  async createDocument(data: { title: string; content?: string }): Promise<Document> {
    const response = await api.post<Document>('/api/documents', data);
    return response.data;
  },

  async updateDocument(id: number | string, data: { title: string; content?: string }): Promise<Document> {
    const response = await api.put<Document>(`/api/documents/${id}`, data);
    return response.data;
  },

  async deleteDocument(id: number | string): Promise<void> {
    await api.delete(`/api/documents/${id}`);
  },

  async uploadDocument(data: { title: string; content: string; fileName: string }): Promise<Document> {
    const response = await api.post<Document>('/api/documents/upload', data);
    return response.data;
  },

  async shareDocument(data: { documentId: number; email: string }): Promise<Document> {
    const response = await api.post<Document>('/api/documents/share', data);
    return response.data;
  },
};
