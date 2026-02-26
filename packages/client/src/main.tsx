import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TrpcProvider } from './lib/trpc';
import '@progress/kendo-theme-default/dist/all.css';
import './index.css';
import './kendo-icons.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TrpcProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TrpcProvider>
  </React.StrictMode>
);
