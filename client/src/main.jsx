import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import ErrorBoundary from "./components/ErrorBoundary";
<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </BrowserRouter>
</QueryClientProvider>

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // don't hammer a failing endpoint repeatedly by default
      refetchOnWindowFocus: false, // avoid surprising refetches while demoing/testing
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);