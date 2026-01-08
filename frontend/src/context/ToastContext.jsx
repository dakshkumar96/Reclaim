import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../Components/ToastContainer';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  // #region agent log
  const log_path = '.cursor/debug.log';
  try {
    const logData = {
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A',
      location: 'ToastContext.jsx:9',
      message: 'ToastProvider initializing',
      data: {},
      timestamp: Date.now()
    };
    fetch('http://127.0.0.1:7242/ingest/6c94317b-78aa-4ebc-9196-bd2f0cc47f34', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {});
  } catch (e) {}
  // #endregion
  const toast = useToast();

  // #region agent log
  try {
    const logData = {
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A',
      location: 'ToastContext.jsx:25',
      message: 'ToastProvider render',
      data: { toastsCount: toast.toasts?.length || 0 },
      timestamp: Date.now()
    };
    fetch('http://127.0.0.1:7242/ingest/6c94317b-78aa-4ebc-9196-bd2f0cc47f34', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {});
  } catch (e) {}
  // #endregion

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  // #region agent log
  try {
    const logData = {
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A',
      location: 'ToastContext.jsx:35',
      message: 'useToastContext called',
      data: {},
      timestamp: Date.now()
    };
    fetch('http://127.0.0.1:7242/ingest/6c94317b-78aa-4ebc-9196-bd2f0cc47f34', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {});
  } catch (e) {}
  // #endregion
  const context = useContext(ToastContext);
  // #region agent log
  try {
    const logData = {
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A',
      location: 'ToastContext.jsx:48',
      message: 'useToastContext context check',
      data: { hasContext: !!context, contextKeys: context ? Object.keys(context) : [] },
      timestamp: Date.now()
    };
    fetch('http://127.0.0.1:7242/ingest/6c94317b-78aa-4ebc-9196-bd2f0cc47f34', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {});
  } catch (e) {}
  // #endregion
  if (!context) {
    // #region agent log
    try {
      const logData = {
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A',
        location: 'ToastContext.jsx:62',
        message: 'ERROR: useToastContext called outside ToastProvider',
        data: { error: 'Context is null' },
        timestamp: Date.now()
      };
      fetch('http://127.0.0.1:7242/ingest/6c94317b-78aa-4ebc-9196-bd2f0cc47f34', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      }).catch(() => {});
    } catch (e) {}
    // #endregion
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

