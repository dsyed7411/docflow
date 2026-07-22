export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface Document {
  id: number;
  title: string;
  content: string;
  owner: User;
  sharedWith: User[];
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
  ownedDocumentsCount: number;
  sharedDocumentsCount: number;
  createdAt: string;
}

export type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';
