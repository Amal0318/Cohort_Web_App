import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Lightbulb, Heart, Trophy, Linkedin, Code, Menu, X, LogOut } from 'lucide-react';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ThemeToggle from './components/ThemeToggle';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/student/Home';
import CLT from './pages/student/CLT';
import SRI from './pages/student/SRI';
import CFC from './pages/student/CFC';
import IIPC from './pages/student/IIPC';
import SCD from './pages/student/SCD';
import ProfileSettings from './pages/student/ProfileSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import FloorWingDashboard from './pages/floorwing/FloorWingDashboard';
import Login from './pages/Login';
import './App.css';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/clt', label: 'CLT', icon: Lightbulb },
  { path: '/sri', label: 'SRI', icon: Heart },
  { path: '/cfc', label: 'CFC', icon: Trophy },
  { path: '/iipc', label: 'IIPC', icon: Linkedin },
  { path: '/scd', label: 'SCD', icon: Code },
];

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  // Determine home path based on user role
  const getHomePath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/';
      case 'mentor':
        return '/mentor-dashboard';
      case 'floorwing':
        return '/floorwing-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  // Only show navigation items for students
  const showNavItems = user && user.role === 'student';

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* Logo */}
        <Link to={getHomePath()} className="nav-logo">
          <motion.div
            className="nav-logo-icon"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Lightbulb size={32} />
          </motion.div>
          <span className="nav-logo-text">Cohort Web</span>
        </Link>

        {/* Desktop Navigation */}
        {showNavItems && (
          <div className="nav-links">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="nav-link-indicator"
                      layoutId="activeLink"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Theme Toggle & Mobile Menu */}
        <div className="nav-actions">
          {user && (
            <div className="nav-user-info">
              <span className="nav-user-role">{user.role}</span>
            </div>
          )}
          <ThemeToggle />
          {user && (
            <button
              className="nav-logout-button"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
          <button
            className="nav-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && showNavItems && (
          <motion.div
            className="nav-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-mobile-link ${isActive ? 'nav-mobile-link--active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const isLoginPage = location.pathname === '/login';

  // If not logged in and not on login page, redirect
  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app">
      {user && !isLoginPage && <Navigation />}

      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/clt" element={<ProtectedRoute><CLT /></ProtectedRoute>} />
          <Route path="/sri" element={<ProtectedRoute><SRI /></ProtectedRoute>} />
          <Route path="/cfc" element={<ProtectedRoute><CFC /></ProtectedRoute>} />
          <Route path="/iipc" element={<ProtectedRoute><IIPC /></ProtectedRoute>} />
          <Route path="/scd" element={<ProtectedRoute><SCD /></ProtectedRoute>} />
          <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
          <Route path="/floorwing-dashboard" element={<ProtectedRoute><FloorWingDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
