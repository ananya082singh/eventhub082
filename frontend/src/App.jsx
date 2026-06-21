import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface-950 text-white flex flex-col font-sans">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="border-t border-surface-800/40 py-6 text-center text-sm text-surface-500 bg-surface-900/20 backdrop-blur">
            <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
          </footer>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#121318',
              color: '#f4f4f7',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}
