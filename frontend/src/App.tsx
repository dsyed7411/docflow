import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ToastNotifications } from './components/ToastNotifications';
import { LoadingSpinner } from './components/LoadingSpinner';
import { UploadModal } from './components/UploadModal';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SharedWithMe } from './pages/SharedWithMe';
import { DocumentEditor } from './pages/DocumentEditor';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

import { documentService } from './services/documentService';
import toast from 'react-hot-toast';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-elevated max-w-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl mx-auto">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
            <p className="text-xs text-slate-500">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/dashboard';
              }}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading DocFlow workspace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isGlobalUploadOpen, setIsGlobalUploadOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'My Workspace';
      case '/shared':
        return 'Shared With Me';
      case '/profile':
        return 'Profile Settings';
      default:
        return 'DocFlow Workspace';
    }
  };

  const handleNewDocument = async () => {
    try {
      const newDoc = await documentService.createDocument({
        title: 'Untitled Document',
        content: '{"type":"doc","content":[{"type":"paragraph","content":[]}]}',
      });
      toast.success('New document created');
      window.location.href = `/document/${newDoc.id}`;
    } catch (error: any) {
      toast.error('Failed to create document');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewDocument={handleNewDocument}
        onUploadDocument={() => setIsGlobalUploadOpen(true)}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <Navbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          title={getPageTitle()}
        />

        <main className="flex-1 pb-12">
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<any>, { searchQuery })
            : children}
        </main>
      </div>

      <UploadModal
        isOpen={isGlobalUploadOpen}
        onClose={() => setIsGlobalUploadOpen(false)}
      />
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastNotifications />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Editor Route */}
        <Route
          path="/document/:id"
          element={
            <ProtectedRoute>
              <DocumentEditor />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard & App Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard searchQuery="" />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SharedWithMe />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect Root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
