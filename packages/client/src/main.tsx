import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TrpcProvider } from './lib/trpc';
import { ToastProvider, ToastContextProvider, Toaster } from './components/obra/Toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TrpcProvider>
      <ToastContextProvider>
        <ToastProvider duration={4000}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster />
        </ToastProvider>
      </ToastContextProvider>
    </TrpcProvider>
  </React.StrictMode>
);
