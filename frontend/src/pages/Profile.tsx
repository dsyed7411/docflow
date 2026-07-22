import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { Profile as ProfileType } from '../types';
import { getInitials, formatDate } from '../utils/formatters';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { User, Mail, Folder, Users, LogOut, Calendar, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <LoadingSpinner size="md" label="Loading profile..." />;
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-brand-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-brand-500/20">
            {getInitials(user?.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user?.name}</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-flex items-center space-x-1 mt-1 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
              <ShieldCheck className="w-3 h-3" />
              <span>{user?.role || 'ROLE_USER'}</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium rounded-xl text-sm transition border border-rose-200/60"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Account Details & Workspace Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Workspace Activity
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center space-x-2 text-brand-600">
                <Folder className="w-4 h-4" />
                <span className="text-xs font-semibold">Owned</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {profile?.ownedDocumentsCount ?? 0}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-600">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold">Shared</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {profile?.sharedDocumentsCount ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Account Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3 text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span>
                Name: <strong className="text-slate-900">{user?.name}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-3 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>
                Email: <strong className="text-slate-900">{user?.email}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-3 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                Joined: <strong className="text-slate-900">{formatDate(user?.createdAt)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
