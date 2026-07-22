import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastNotifications: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1e293b',
          color: '#ffffff',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          padding: '0.75rem 1rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};
