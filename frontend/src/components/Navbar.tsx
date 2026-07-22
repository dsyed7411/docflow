import React from 'react';
import { Menu, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../utils/formatters';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg md:hidden transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900">DocFlow</span>
        </div>

        <h1 className="hidden md:block text-lg font-semibold text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5 bg-slate-100/70 py-1.5 px-3 rounded-full border border-slate-200/60">
          <div className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-[10px] flex items-center justify-center">
            {getInitials(user?.name)}
          </div>
          <span className="text-xs font-medium text-slate-700 hidden sm:inline">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};
