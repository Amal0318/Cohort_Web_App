import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Lightbulb, Heart, Trophy, Linkedin, Code,
  User, Mail, Phone, Users, Bell, Clock,
  CheckCircle, XCircle, AlertCircle, FileText, Settings, Loader2, Calendar
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboard';
import { getUpcomingHackathons } from '../../services/cfc';
import './Home.css';

const PILLARS = [
  {
    id: 'clt',
    title: 'Center for Learning and Teaching',
    description: 'Document your creative projects and showcase your learning journey',
    icon: Lightbulb,
    color: '#F7C948',
    path: '/clt',
  },
  {
    id: 'sri',
    title: 'Social Responsibility Initiatives',
    description: 'Track your community service and social impact activities',
    icon: Heart,
    color: '#E53935',
    path: '/sri',
  },
  {
    id: 'cfc',
    title: 'Center for Creativity',
    description: 'Build your professional portfolio and track career development',
    icon: Trophy,
    color: '#FFC107',
    path: '/cfc',
  },
  {
    id: 'iipc',
    title: 'Industry Institute Partnership Cell',
    description: 'Verify your LinkedIn activity and professional network',
    icon: Linkedin,
    color: '#0A66C2',
    path: '/iipc',
  },
  {
    id: 'scd',
    title: 'Skill and Career Development',
    description: 'Track your coding skills and competitive programming journey',
    icon: Code,
    color: '#FF5722',
    path: '/scd',
  },
];

export const HomePage = () => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [showHackathonModal, setShowHackathonModal] = useState(false);

  useEffect(() => {
    document.title = 'Dashboard | Cohort Web';
    
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Please log in to view dashboard');
      setLoading(false);
      return;
    }
    
    fetchDashboardData();
    fetchHackathons();

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData(true); // Silent refresh
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchHackathons = async () => {
    try {
      const data = await getUpcomingHackathons();
      setUpcomingHackathons(data);
    } catch (err) {
      console.error('Failed to fetch hackathons:', err);
    }
  };

  const fetchDashboardData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const data = await dashboardService.getStats();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      if (!silent) {
        const errorMessage = err.response?.data?.detail || err.message || 'Failed to load dashboard data';
        setError(errorMessage);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Get pillar progress from API data
  const pillarProgress = dashboardData ? {
    clt: {
      completed: dashboardData.pillars.clt.completed,
      total: dashboardData.pillars.clt.monthly_target,
      percentage: dashboardData.pillars.clt.percentage
    },
    sri: {
      completed: dashboardData.pillars.sri.completed,
      total: dashboardData.pillars.sri.monthly_target,
      percentage: dashboardData.pillars.sri.percentage
    },
    cfc: {
      completed: dashboardData.pillars.cfc.completed,
      total: dashboardData.pillars.cfc.monthly_target,
      percentage: dashboardData.pillars.cfc.percentage
    },
    iipc: {
      completed: dashboardData.pillars.iipc.completed,
      total: dashboardData.pillars.iipc.monthly_target,
      percentage: dashboardData.pillars.iipc.percentage
    },
    scd: {
      completed: dashboardData.pillars.scd.completed,
      total: dashboardData.pillars.scd.monthly_target,
      percentage: dashboardData.pillars.scd.percentage
    },
  } : {
    clt: { completed: 0, total: 1, percentage: 0 },
    sri: { completed: 0, total: 0, percentage: 0 },
    cfc: { completed: 0, total: 3, percentage: 0 },
    iipc: { completed: 0, total: 2, percentage: 0 },
    scd: { completed: 0, total: 1, percentage: 0 },
  };

  const notifications = dashboardData?.notifications || [];
  const recentActivities = dashboardData?.recent_activities || [];
  const overallProgress = dashboardData?.overall?.percentage || 0;

  const getStatusIcon = (status) => {
    if (status === 'completed' || status === 'approved') return <CheckCircle size={16} color="#4CAF50" />;
    if (status === 'pending' || status === 'submitted' || status === 'under_review') return <AlertCircle size={16} color="#FF9800" />;
    return <XCircle size={16} color="#f44336" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="home-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Loader2 size={48} className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <XCircle size={48} color="#E53935" style={{ marginBottom: '1rem' }} />
          <h2>{error}</h2>
          {error.includes('log in') ? (
            <Button onClick={() => window.location.href = '/login'} style={{ marginTop: '1rem' }}>
              Go to Login
            </Button>
          ) : (
            <Button onClick={fetchDashboardData} style={{ marginTop: '1rem' }}>
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Profile Modal */}
      {showProfile && (
        <motion.div
          className="profile-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowProfile(false)}
        >
          <motion.div
            className="profile-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard>
              <div className="profile-modal-content">
                <div className="profile-avatar">
                  <User size={48} />
                </div>
                <h2>{user?.username || 'Student'}</h2>
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <Mail size={18} />
                    <span>{user?.email || 'student@test.com'}</span>
                  </div>
                  <div className="profile-detail-item">
                    <FileText size={18} />
                    <span>Roll No: CS101</span>
                  </div>
                  <div className="profile-detail-item">
                    <Phone size={18} />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="profile-detail-item">
                    <Users size={18} />
                    <span>Mentor: Dr. Priya Sharma</span>
                  </div>
                </div>
                <Link to="/profile-settings" className="profile-settings-button">
                  <Button variant="primary" icon={<Settings size={18} />}>
                    Profile Settings
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}

      {/* Hackathon Notifications Modal */}
      {showHackathonModal && (
        <motion.div
          className="profile-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowHackathonModal(false)}
        >
          <motion.div
            className="profile-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <GlassCard>
              <div className="profile-modal-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <Trophy size={32} style={{ color: '#FFC107' }} />
                  <h2 style={{ margin: 0 }}>Upcoming Hackathons</h2>
                </div>
                
                {upcomingHackathons.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {upcomingHackathons.map((hackathon) => {
                      const daysLeft = hackathon.days_until_event;
                      const isUrgent = daysLeft <= 3;
                      const motivationMsg = daysLeft === 0 ? "It's TODAY! Give it your best shot! 🚀" :
                                           daysLeft === 1 ? "Tomorrow's the day! Get ready! 🔥" :
                                           daysLeft <= 3 ? "Just a few days left! Time to shine! ✨" :
                                           "Start preparing now! You got this! 🎯";
                      
                      return (
                        <div key={hackathon.id} style={{
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          border: `2px solid ${isUrgent ? '#ff4757' : 'rgba(255, 193, 7, 0.3)'}`,
                          transition: 'all 0.3s ease'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                              {hackathon.hackathon_name}
                            </strong>
                            <span style={{
                              padding: '0.3rem 0.75rem',
                              background: isUrgent ? 'rgba(255, 71, 87, 0.15)' : 'rgba(255, 193, 7, 0.15)',
                              color: isUrgent ? '#ff4757' : '#FFC107',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              whiteSpace: 'nowrap',
                              marginLeft: '1rem'
                            }}>
                              {daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`}
                            </span>
                          </div>
                          <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                            {new Date(hackathon.participation_date).toLocaleDateString('en-US', { 
                              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                            })} • {hackathon.mode}
                          </p>
                          <p style={{ 
                            margin: '0.75rem 0 0 0', 
                            fontSize: '0.95rem', 
                            color: 'var(--text-primary)',
                            fontWeight: '500',
                            padding: '0.5rem',
                            background: isUrgent ? 'rgba(255, 71, 87, 0.05)' : 'rgba(255, 193, 7, 0.05)',
                            borderRadius: '6px'
                          }}>
                            {motivationMsg}
                          </p>
                          {hackathon.hackathon_url && (
                            <a 
                              href={hackathon.hackathon_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-block',
                                marginTop: '0.75rem',
                                color: '#FFC107',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                              }}
                            >
                              View Details →
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <Trophy size={48} style={{ color: 'var(--border-color)', marginBottom: '1rem' }} />
                    <p>No upcoming hackathons registered yet.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Go to CFC page to register for hackathons!</p>
                  </div>
                )}
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <Button onClick={() => setShowHackathonModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}

      {/* Header with Profile */}
      <div className="home-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="home-welcome"
        >
          <h1>Welcome back, <span className="home-title-gradient">{user?.first_name || user?.username || 'Student'}!</span></h1>
          <p>Track your progress and stay updated with your learning journey</p>
          {lastUpdated && (
            <p className="last-updated-home">
              <Clock size={14} /> Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </motion.div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Hackathon Notifications Button */}
          <motion.button
            className="hackathon-notif-btn"
            onClick={() => setShowHackathonModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Trophy size={20} style={{ color: '#FFC107' }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.9rem' }}>Hackathons</span>
            {upcomingHackathons.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#ff4757',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {upcomingHackathons.length}
              </span>
            )}
          </motion.button>

          <motion.button
            className="profile-icon-btn"
            onClick={() => setShowProfile(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={24} />
          </motion.button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="home-dashboard">
        {/* Left Column */}
        <div className="home-left-column">
          {/* Overall Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="overall-progress-card">
                <h2>Overall Progress</h2>
                <div className="progress-circle">
                  <svg viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F7C948" />
                        <stop offset="100%" stopColor="#E53935" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" className="progress-bg" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      className="progress-fill"
                      style={{ strokeDashoffset: 283 - (283 * overallProgress) / 100 }}
                    />
                  </svg>
                  <div className="progress-text">{overallProgress}%</div>
                </div>
                <p className="progress-label">Completed</p>
                <Link to="/monthly-report" className="monthly-report-link">
                  <Button variant="secondary" icon={<Calendar size={18} />}>
                    View Monthly Reports
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* 5 Pillars Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <div className="pillars-status-card">
                <h2>5 Pillars Status</h2>
                <div className="pillars-status-list">
                  {PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    const progress = pillarProgress[pillar.id];
                    return (
                      <Link key={pillar.id} to={pillar.path} className="pillar-status-item">
                        <div className="pillar-status-icon" style={{ backgroundColor: `${pillar.color}20` }}>
                          <Icon size={20} style={{ color: pillar.color }} />
                        </div>
                        <div className="pillar-status-info">
                          <h4>{pillar.id.toUpperCase()}</h4>
                          <div className="pillar-progress-bar">
                            <div
                              className="pillar-progress-fill"
                              style={{
                                width: `${progress.percentage}%`,
                                backgroundColor: pillar.color
                              }}
                            />
                          </div>
                          <span>{progress.completed}/{progress.total} completed</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="home-right-column">
          {/* Mentor Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="notifications-card">
                <h2><Bell size={20} /> Notifications</h2>
                <div className="notifications-list">
                  {/* Regular Notifications */}
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                        <div className="notification-dot" />
                        <div className="notification-content">
                          <p>{notif.message}</p>
                          <span><Clock size={14} /> {notif.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      <Bell size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <div className="activities-card">
                <h2>Recent Activities</h2>
                <div className="activities-list">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-status">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="activity-content">
                          <h4>{activity.title}</h4>
                          <div className="activity-meta">
                            <span className={`status-badge ${activity.status}`}>
                              {activity.status}
                            </span>
                            <span className="activity-date">
                              <Clock size={14} /> {formatDate(activity.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      <AlertCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                      <p>No recent activities</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Cohort Web</h3>
            <p>© 2025 All rights reserved</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@cohortweb.edu</p>
            <p>Phone: +91 1234567890</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/clt">CLT</Link>
              <Link to="/sri">SRI</Link>
              <Link to="/cfc">CFC</Link>
              <Link to="/iipc">IIPC</Link>
              <Link to="/scd">SCD</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
