
import { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "../components/ToastContainer.jsx";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  // List of active toasts
  const [toasts, setToasts] = useState([]);

  // Remove a toast by its unique ID
  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  // Add a toast and automatically dismiss it
  const showToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = crypto.randomUUID();

      setToasts((current) => [
        ...current,
        { id, message, type, duration },
      ]);

      setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

// Access toast functions from any component inside ToastProvider
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }

  return context;
}
