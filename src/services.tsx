import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MainServicesApp from './MainServicesApp.tsx';
import { AuthProvider } from './Auth.tsx';
import { CMSProvider } from './context/CMSContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={(import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || "dummy_client_id"}>
      <AuthProvider>
        <CMSProvider>
          <MainServicesApp />
        </CMSProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
