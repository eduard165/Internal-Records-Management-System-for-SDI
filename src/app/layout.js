//src/app/layout.js

"use client";

import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { msalConfig } from '@/services/authConfig';
import 'flowbite/dist/flowbite.css';
import './globals.css';
import Navbar from '@/componentes/Navbar';
import Footer from '@/componentes/Footer';

const msalInstance = new PublicClientApplication(msalConfig);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MsalProvider instance={msalInstance}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ToastContainer 
            position="bottom-right" 
            autoClose={1000} 
            hideProgressBar 
            newestOnTop 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover
          />
        </MsalProvider>
      </body>
    </html>
  );
}