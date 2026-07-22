import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from './SearchBar';
import {
  FileText,
  Plus,
  Folder,
  Users,
  User as UserIcon,
  LogOut,
  X,
  Upload,
} from 'lucide-react';
import { getInitials } from '../utils/formatters';

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewDocument: () => void;
  onUploadDocument: () => void;
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  onSearchChange,
  onNewDocument,
  onUploadDocument,
  isOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'My Documents', path: '/dashboard', icon: Folder },
    { label: 'Shared With Me', path: '/shared', icon: Users },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className="p-4 space-y-5 flex-1 overflow-y-auto">
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight">DocFlow</span>
                <span className="block text-[10px] text-slate-400 font-medium -mt-1">Workspace</span>
              </div>
            </div>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onNewDocument();
                onCloseMobile?.();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-medium rounded-xl text-sm transition shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>New Document</span>
            </button>

            <button
              onClick={() => {
                onUploadDocument();
                onCloseMobile?.();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 font-medium rounded-xl text-xs transition"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-1">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
