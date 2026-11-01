import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import { store } from './store/store';
import App from './App';
import './index.css';

if (import.meta.env.PROD) {
  ['log', 'info', 'warn', 'error', 'debug'].forEach((m) => {
    console[m] = () => {};
  });
}


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <App />
            {/* <Toaster
              position="top-center"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#263826',
                  boxShadow: '0 8px 32px rgba(63, 91, 62, 0.12)',
                },
                success: { iconTheme: { primary: '#3F5B3E', secondary: '#fff' } },
              }}
            /> */}
             <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F2937',
            color: '#fff',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration is a progressive enhancement; failures are non-fatal.
    });
  });
}
