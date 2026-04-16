import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './Auth.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={(import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || "dummy_client_id"}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
