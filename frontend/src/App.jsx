import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MeetingsList from './pages/MeetingsList';
import MeetingUpload from './pages/MeetingUpload';
import CreateMeeting from './pages/CreateMeeting';
import MeetingDetail from './pages/MeetingDetail';
import MeetingSummary from './pages/MeetingSummary';
import MeetingSummaryEnhanced from './pages/MeetingSummaryEnhanced';
import Analytics from './pages/Analytics';
import MeetingTemplates from './pages/MeetingTemplates';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings"
        element={
          <ProtectedRoute>
            <MeetingsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/upload"
        element={
          <ProtectedRoute>
            <MeetingUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/create"
        element={
          <ProtectedRoute>
            <CreateMeeting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/:id"
        element={
          <ProtectedRoute>
            <MeetingDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/:id/summary"
        element={
          <ProtectedRoute>
            <MeetingSummaryEnhanced />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <MeetingTemplates />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
