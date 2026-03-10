import React, { createContext, useContext } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastOptions: ToastOptions = {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#fff',
      color: '#0f172a',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      fontSize: '14px',
      fontWeight: '500',
    },
  };

  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...toastOptions,
      ...options,
      icon: '✓',
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
      style: {
        ...toastOptions.style,
        borderLeft: '4px solid #10b981',
      },
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...toastOptions,
      ...options,
      duration: 5000,
      icon: '✕',
      iconTheme: {
        primary: '#f43f5e',
        secondary: '#fff',
      },
      style: {
        ...toastOptions.style,
        borderLeft: '4px solid #f43f5e',
      },
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    toast(message, {
      ...toastOptions,
      ...options,
      icon: 'ℹ',
      iconTheme: {
        primary: '#0ea5e9',
        secondary: '#fff',
      },
      style: {
        ...toastOptions.style,
        borderLeft: '4px solid #0ea5e9',
      },
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    toast(message, {
      ...toastOptions,
      ...options,
      icon: '⚠',
      iconTheme: {
        primary: '#f59e0b',
        secondary: '#fff',
      },
      style: {
        ...toastOptions.style,
        borderLeft: '4px solid #f59e0b',
      },
    });
  };

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      ...toastOptions,
      ...options,
      style: {
        ...toastOptions.style,
        borderLeft: '4px solid #14b8a6',
      },
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning, loading, dismiss }}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: '',
          style: toastOptions.style,
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
