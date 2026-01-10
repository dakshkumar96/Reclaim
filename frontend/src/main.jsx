import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Production-ready app initialization
try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  // Error handling for production - use DOM methods instead of innerHTML to prevent XSS
  if (import.meta.env.MODE === 'development') {
    console.error('Failed to render React app:', error);
  }
  
  // Create error display using safe DOM methods (no innerHTML)
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'padding: 20px; color: #F8F8F8; background-color: #0C0C0C; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;';
  
  const h1 = document.createElement('h1');
  h1.textContent = 'Failed to load app';
  h1.style.cssText = 'margin-bottom: 16px; font-size: 24px;';
  errorDiv.appendChild(h1);
  
  const p = document.createElement('p');
  p.textContent = error.message || 'An unexpected error occurred';
  p.style.cssText = 'margin-bottom: 16px; color: #A1A1A1;';
  errorDiv.appendChild(p);
  
  if (import.meta.env.MODE === 'development' && error.stack) {
    const pre = document.createElement('pre');
    pre.textContent = error.stack;
    pre.style.cssText = 'white-space: pre-wrap; word-break: break-word; max-width: 90%; background-color: #1a1a1a; padding: 16px; border-radius: 4px; overflow-x: auto;';
    errorDiv.appendChild(pre);
  } else {
    const helpP = document.createElement('p');
    helpP.textContent = 'Please refresh the page or contact support if the issue persists.';
    helpP.style.cssText = 'margin-top: 16px; color: #A1A1A1;';
    errorDiv.appendChild(helpP);
  }
  
  rootElement.appendChild(errorDiv);
}

