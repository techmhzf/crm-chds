import { Routes, Route, Navigate } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext.jsx';
import { AlertProvider } from './context/AlertContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Templates from './pages/Templates.jsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AlertProvider>
                <LeadProvider>
                  <Dashboard />
                </LeadProvider>
              </AlertProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <AlertProvider>
                <Templates />
              </AlertProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <InstallPrompt />
    </>
  );
}
