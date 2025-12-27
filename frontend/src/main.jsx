import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Starting React app...');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Failed to render React app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: #F8F8F8; background-color: #0C0C0C; min-height: 100vh;">
      <h1>Failed to load app</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `;
}

