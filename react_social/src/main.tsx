import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { DarkModeContextProvider } from './context/darkModeContext.tsx';
import { AuthContextProvider } from './context/AuthContext.tsx';
import NiceModal from '@ebay/nice-modal-react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {' '}
    <DarkModeContextProvider>
      <NiceModal.Provider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </NiceModal.Provider>
    </DarkModeContextProvider>
  </React.StrictMode>,
);
