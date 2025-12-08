import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Flame, Trophy, Upload, TrendingUp, Target, Award } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Input from '../components/Input';
import './SCD.css';

export const SCD = () => {
  const { theme } = useTheme();
  const [leetcodeUrl, setLeetcodeUrl] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Mock data for coding progress
  const codingStats = {
    totalSolved: 387,
    easy: 156,
    medium: 187,
    hard: 44,
    skillLevel: 85,
    rank: '12,345',
    streak: 45,
  };

  const recentSubmissions = [
    { problem: 'Two Sum', difficulty: 'Easy', status: 'Accepted', date: '2025-12-07' },
    { problem: 'Add Two Numbers', difficulty: 'Medium', status: 'Accepted', date: '2025-12-06' },
    { problem: 'Median of Two Sorted Arrays', difficulty: 'Hard', status: 'Accepted', date: '2025-12-05' },
  ];

  const skillMeterPercentage = (codingStats.skillLevel / 100) * 100;

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
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
        <h1 className="scd-title">Skill & Career Development</h1>
        <p className="scd-subtitle">
          Track your coding skills and competitive programming journey
        </p>
      </motion.div>

      <div className="scd-layout">
        {/* Main Content */}
        <div className="scd-main">
          {/* Skill Meter Card */}
          <GlassCard variant="heavy" className="scd-skill-meter-card">
            <div className="scd-skill-header">
              <Flame size={32} className="scd-flame-icon" />
              <h2 className="scd-skill-title">Coding Skill Level</h2>
            </div>

            <div className="scd-skill-meter">
              {/* Skill Level Fill */}
              <div className="scd-flame-container">
                <motion.div
                  className="scd-flame-fill"
                  initial={{ height: 0 }}
                  animate={{ height: `${skillMeterPercentage}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />

                <motion.div
                  className="scd-skill-score"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                >
                  <motion.span
                    className="scd-score-number"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {codingStats.skillLevel}
                  </motion.span>
                  <span className="scd-score-label">/100</span>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="scd-stats-grid">
                <motion.div
                  className="scd-stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Target size={20} />
                  <div>
                    <div className="scd-stat-value">{codingStats.totalSolved}</div>
                    <div className="scd-stat-label">Problems Solved</div>
                  </div>
                </motion.div>

                <motion.div
                  className="scd-stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Trophy size={20} />
                  <div>
                    <div className="scd-stat-value">#{codingStats.rank}</div>
                    <div className="scd-stat-label">Global Rank</div>
                  </div>
                </motion.div>

                <motion.div
                  className="scd-stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Flame size={20} />
                  <div>
                    <div className="scd-stat-value">{codingStats.streak} days</div>
                    <div className="scd-stat-label">Current Streak</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </GlassCard>

          {/* LeetCode Submission */}
          <GlassCard variant="medium" className="scd-submission-card">
            <h2 className="scd-section-title">Submit LeetCode Progress</h2>

            <Input
              label="LeetCode Profile URL"
              placeholder="https://leetcode.com/username"
              value={leetcodeUrl}
              onChange={(e) => setLeetcodeUrl(e.target.value)}
              icon={<Code size={20} />}
              floatingLabel
            />

            {/* Screenshot Upload */}
            <div className="scd-upload-section">
              <label className="scd-upload-label">Progress Screenshot</label>

              {!screenshotPreview ? (
                <label className="scd-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="scd-file-input"
                  />
                  <Upload size={48} />
                  <h3>Upload Screenshot</h3>
                  <p>Show your LeetCode progress</p>
                </label>
              ) : (
                <motion.div
                  className="scd-preview-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                >
                  <img src={screenshotPreview} alt="Screenshot" className="scd-preview-image" />
                  <div className="scd-preview-overlay">
                    <button
                      className="scd-preview-change"
                      onClick={() => {
                        setScreenshot(null);
                        setScreenshotPreview(null);
                      }}
                    >
                      Change
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="scd-actions">
              <Button
                variant="primary"
                withGlow
                disabled={!leetcodeUrl || !screenshot}
              >
                Submit Progress
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="scd-sidebar">
          {/* Category Breakdown */}
          <GlassCard variant="medium" className="scd-category-card">
            <h3 className="scd-card-title">Problem Categories</h3>

            <div className="scd-category-list">
              <motion.div
                className="scd-category-item scd-category-item--easy"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="scd-category-header">
                  <span className="scd-category-label">Easy</span>
                  <span className="scd-category-count">{codingStats.easy}</span>
                </div>
                <div className="scd-category-bar">
                  <motion.div
                    className="scd-category-fill scd-category-fill--easy"
                    initial={{ width: 0 }}
                    animate={{ width: `${(codingStats.easy / codingStats.totalSolved) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="scd-category-item scd-category-item--medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="scd-category-header">
                  <span className="scd-category-label">Medium</span>
                  <span className="scd-category-count">{codingStats.medium}</span>
                </div>
                <div className="scd-category-bar">
                  <motion.div
                    className="scd-category-fill scd-category-fill--medium"
                    initial={{ width: 0 }}
                    animate={{ width: `${(codingStats.medium / codingStats.totalSolved) * 100}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="scd-category-item scd-category-item--hard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="scd-category-header">
                  <span className="scd-category-label">Hard</span>
                  <span className="scd-category-count">{codingStats.hard}</span>
                </div>
                <div className="scd-category-bar">
                  <motion.div
                    className="scd-category-fill scd-category-fill--hard"
                    initial={{ width: 0 }}
                    animate={{ width: `${(codingStats.hard / codingStats.totalSolved) * 100}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </motion.div>
            </div>
          </GlassCard>

          {/* Recent Submissions */}
          <GlassCard variant="medium" className="scd-recent-card">
            <h3 className="scd-card-title">Recent Submissions</h3>

            <div className="scd-submissions-list">
              {recentSubmissions.map((submission, index) => (
                <motion.div
                  key={index}
                  className="scd-submission-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="scd-submission-header">
                    <span className="scd-submission-problem">{submission.problem}</span>
                    <span className={`scd-submission-difficulty scd-submission-difficulty--${submission.difficulty.toLowerCase()}`}>
                      {submission.difficulty}
                    </span>
                  </div>
                  <div className="scd-submission-footer">
                    <span className="scd-submission-status">{submission.status}</span>
                    <span className="scd-submission-date">{submission.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Achievement Badge */}
          <motion.div
            className="scd-achievement-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Award size={48} />
            <h4>Code Master</h4>
            <p>Keep up the great work!</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SCD;
