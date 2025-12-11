import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Flame, Trophy, TrendingUp, Target, Award, 
  CheckCircle, Clock, XCircle, Upload, RefreshCw,
  Activity, Zap
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {
  syncLeetCodeProfile,
  getLeetCodeProfiles,
  submitProfileForReview
} from '../../services/scd';
import './SCD.css';

export const SCD = () => {
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profiles = await getLeetCodeProfiles();
      if (profiles && profiles.length > 0) {
        const latest = profiles[0];
        setProfileData(latest);
        setLeetcodeUsername(latest.leetcode_username || '');
        setScreenshotUrl(latest.screenshot_url || '');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const handleSync = async () => {
    if (!leetcodeUsername.trim()) {
      setError('Please enter your LeetCode username');
      return;
    }

    setSyncing(true);
    setError('');
    setSuccess('');

    try {
      const response = await syncLeetCodeProfile(leetcodeUsername.trim());
      setProfileData(response.profile);
      setSuccess('Profile synced successfully! Your stats have been updated.');
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please logout and login again.');
      } else {
        const errorMsg = err.response?.data?.error || 'Failed to sync profile. Please check your username.';
        setError(errorMsg);
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async () => {
    if (!profileData || !profileData.id) {
      setError('Please sync your profile first');
      return;
    }

    if (!screenshotUrl.trim()) {
      setError('Please provide a screenshot URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await submitProfileForReview(profileData.id, screenshotUrl.trim());
      setProfileData(response.profile);
      setSuccess('Profile submitted for review successfully!');
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please logout and login again.');
      } else {
        const errorMsg = err.response?.data?.error || 'Failed to submit profile';
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate fire height percentage
  const getFireHeight = () => {
    if (!profileData) return 0;
    // Scale based on total solved (max 500 for full flame)
    return Math.min((profileData.total_solved / 500) * 100, 100);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy':
        return '#4ade80';
      case 'medium':
        return '#fbbf24';
      case 'hard':
        return '#f87171';
      default:
        return '#6b7280';
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { icon: Clock, text: 'Under Review', className: 'scd-status-pending' },
      approved: { icon: CheckCircle, text: 'Approved', className: 'scd-status-approved' },
      rejected: { icon: XCircle, text: 'Rejected', className: 'scd-status-rejected' }
    };

    const config = statusConfig[status];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <motion.div
        className={`scd-status-badge ${config.className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <Icon size={18} />
        <span>{config.text}</span>
      </motion.div>
    );
  };

  return (
    <div className="scd-container">
      {/* Header */}
      <motion.div
        className="scd-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="scd-title">Skill and Career Development</h1>
        <p className="scd-subtitle">
          Track your coding journey with LeetCode integration
        </p>
      </motion.div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="scd-alert scd-alert-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <XCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            className="scd-alert scd-alert-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CheckCircle size={20} />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scd-layout">
        {/* Main Content */}
        <div className="scd-main">
          {/* Profile Sync Section */}
          <GlassCard variant="heavy" className="scd-sync-card">
            <h2 className="scd-section-title">
              <Code size={24} />
              LeetCode Profile Connection
            </h2>

            <div className="scd-sync-form">
              <Input
                label="LeetCode Username"
                placeholder="Enter your username"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                icon={<Code size={20} />}
                floatingLabel
                disabled={syncing}
              />

              <Button
                variant="primary"
                withGlow
                onClick={handleSync}
                disabled={syncing || !leetcodeUsername.trim()}
              >
                {syncing ? (
                  <>
                    <RefreshCw size={18} className="scd-spinning" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    Sync Profile
                  </>
                )}
              </Button>
            </div>

            {profileData && (
              <motion.div
                className="scd-last-sync"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Activity size={16} />
                <span>Last synced: {new Date(profileData.last_synced).toLocaleString()}</span>
              </motion.div>
            )}
          </GlassCard>

          {/* Circular Progress Stats */}
          {profileData && (
            <GlassCard variant="heavy" className="scd-stats-card">
              <div className="scd-stats-header">
                <Trophy size={32} className="scd-trophy-icon" />
                <h2 className="scd-section-title">Problem Solving Statistics</h2>
              </div>

              <div className="scd-circular-container">
                {/* Main Circular Progress */}
                <div className="scd-circular-progress">
                  <svg className="scd-progress-ring" width="320" height="320" viewBox="0 0 320 320">
                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F7C948" />
                        <stop offset="50%" stopColor="#FFD966" />
                        <stop offset="100%" stopColor="#FFA726" />
                      </linearGradient>
                    </defs>
                    
                    {/* Background Circle */}
                    <circle
                      className="scd-progress-ring-bg"
                      cx="160"
                      cy="160"
                      r="140"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="20"
                    />
                    
                    {/* Progress Circle */}
                    <motion.circle
                      className="scd-progress-ring-progress"
                      cx="160"
                      cy="160"
                      r="140"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray="879.6"
                      initial={{ strokeDashoffset: 879.6 }}
                      animate={{ 
                        strokeDashoffset: 879.6 - (879.6 * Math.min(profileData.total_solved / 3773, 1))
                      }}
                      transition={{ 
                        duration: 2.5, 
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0.3
                      }}
                    />
                  </svg>
                  
                  {/* Center Content */}
                  <div className="scd-progress-center">
                    <motion.div
                      className="scd-total-problems"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: 0.8,
                        type: 'spring',
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      {profileData.total_solved}
                    </motion.div>
                    <motion.div 
                      className="scd-problems-label"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      Problems Solved
                    </motion.div>
                    <motion.div 
                      className="scd-problems-progress"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 }}
                    >
                      {Math.round((profileData.total_solved / 3773) * 100)}% Complete
                    </motion.div>
                  </div>
                </div>

                {/* Difficulty Stats Grid */}
                <div className="scd-difficulty-stats">
                  <motion.div
                    className="scd-difficulty-card scd-easy"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="scd-fire-stat-icon scd-fire-stat-easy">
                      <Target size={24} />
                    </div>
                    <div className="scd-fire-stat-content">
                      <div className="scd-fire-stat-value">{profileData.easy_solved}</div>
                      <div className="scd-fire-stat-label">Easy</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="scd-difficulty-card scd-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="scd-difficulty-icon scd-icon-medium">
                      <Zap size={28} />
                    </div>
                    <div className="scd-difficulty-content">
                      <div className="scd-difficulty-value">{profileData.medium_solved}</div>
                      <div className="scd-difficulty-label">Medium</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="scd-difficulty-card scd-hard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="scd-difficulty-icon scd-icon-hard">
                      <Flame size={28} />
                    </div>
                    <div className="scd-difficulty-content">
                      <div className="scd-difficulty-value">{profileData.hard_solved}</div>
                      <div className="scd-difficulty-label">Hard</div>
                    </div>
                  </motion.div>

                  {profileData.ranking && (
                    <motion.div
                      className="scd-difficulty-card scd-ranking"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="scd-difficulty-icon scd-icon-ranking">
                        <TrendingUp size={28} />
                      </div>
                      <div className="scd-difficulty-content">
                        <div className="scd-difficulty-value">#{profileData.ranking.toLocaleString()}</div>
                        <div className="scd-difficulty-label">Ranking</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Submission Section */}
          {profileData && (
            <GlassCard variant="medium" className="scd-submission-card">
              <h2 className="scd-section-title">
                <Upload size={24} />
                Submit for Review
              </h2>

              {(!profileData.status || profileData.status === 'draft') ? (
                <>
                  <Input
                    label="Screenshot URL (Google Drive)"
                    placeholder="https://drive.google.com/..."
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    icon={<Upload size={20} />}
                    floatingLabel
                  />

                  <Button
                    variant="primary"
                    withGlow
                    onClick={handleSubmit}
                    disabled={loading || !screenshotUrl.trim()}
                  >
                    {loading ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                </>
              ) : (
                <div className="scd-submission-status">
                  <StatusBadge status={profileData.status} />
                  
                  {profileData.review_comments && (
                    <div className="scd-review-comments">
                      <h4>Mentor Comments:</h4>
                      <p>{profileData.review_comments}</p>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="scd-sidebar">
          {/* Recent Submissions */}
          {profileData && profileData.submissions && profileData.submissions.length > 0 && (
            <GlassCard variant="medium" className="scd-recent-card">
              <h3 className="scd-card-title">Recent Submissions</h3>

              <div className="scd-submissions-list">
                {profileData.submissions.slice(0, 10).map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    className="scd-submission-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className="scd-submission-header">
                      <span className="scd-submission-problem">{submission.problem_title}</span>
                      <span 
                        className="scd-submission-difficulty"
                        style={{ color: getDifficultyColor(submission.difficulty) }}
                      >
                        {submission.difficulty}
                      </span>
                    </div>
                    <div className="scd-submission-footer">
                      <span className="scd-submission-status">{submission.status}</span>
                      <span className="scd-submission-date">
                        {new Date(submission.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Achievement Badge */}
          {profileData && profileData.total_solved > 0 && (
            <motion.div
              className="scd-achievement-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Award size={48} />
              <h4>
                {profileData.total_solved > 300 ? 'Coding Master' : 
                 profileData.total_solved > 100 ? 'Problem Solver' : 
                 'Rising Star'}
              </h4>
              <p>Keep pushing forward!</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SCD;
