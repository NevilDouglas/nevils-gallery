// frontend-react/src/main.jsx
// Startpunt van de React-applicatie.
// Koppelt de React-app aan het DOM-element met id="root" in index.html.
// BrowserRouter zorgt voor client-side routering via React Router.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css'; // Globale stijlen voor de gehele applicatie

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode activeert extra waarschuwingen tijdens ontwikkeling
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
