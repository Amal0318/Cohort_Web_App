import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Upload, Search, CheckCircle, TrendingUp, Hash, Calendar, Users } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Input from '../components/Input';
import './IIPC.css';

export const IIPC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('post');

  // Post Verification State
  const [postUrl, setPostUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [postData, setPostData] = useState(null);

  // Connections Verification State
  const [verificationMethod, setVerificationMethod] = useState('upload'); // 'upload' or 'profile'
  const [screenshots, setScreenshots] = useState([]);
  const [profileUrl, setProfileUrl] = useState('');
  const [connectionsData, setConnectionsData] = useState(null);

  const handleVerifyPost = () => {
    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      setPostData({
        date: '2025-12-01',
        characters: 487,
        hashtags: 5,
        engagement: 145,
        sentiment: 'Positive',
      });
      setIsVerifying(false);
    }, 2000);
  };

  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setScreenshots([...screenshots, ...imageUrls]);
  };

  const handleVerifyConnections = () => {
    // Simulate API call
    setTimeout(() => {
      setConnectionsData({
        total: 250,
        verified: [
          { name: 'John Smith', company: 'Google', verified: true },
          { name: 'Sarah Johnson', company: 'Microsoft', verified: true },
          { name: 'Mike Chen', company: 'Amazon', verified: true },
          { name: 'Emily Davis', company: 'Meta', verified: true },
        ],
      });
    }, 2000);
  };

  return (
    <div className="iipc-container">
      {/* Header */}
      <motion.div
        className="iipc-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="iipc-title">Industry Interaction & Professional Competency</h1>
        <p className="iipc-subtitle">
          Verify your LinkedIn activity and professional network
        </p>
      </motion.div>

      {/* Section Selector */}
      <div className="iipc-section-selector">
        <Button
          variant={activeSection === 'post' ? 'primary' : 'outline'}
          onClick={() => setActiveSection('post')}
        >
          Post Verification
        </Button>
        <Button
          variant={activeSection === 'connections' ? 'primary' : 'outline'}
          onClick={() => setActiveSection('connections')}
        >
          Connections Verification
        </Button>
      </div>

      {/* Post Verification Section */}
      <AnimatePresence mode="wait">
        {activeSection === 'post' && (
          <motion.div
            key="post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="medium" className="iipc-card">
              <div className="iipc-card-header">
                <TrendingUp size={32} className="iipc-card-icon" />
                <div>
                  <h2 className="iipc-card-title">LinkedIn Post Verification</h2>
                  <p className="iipc-card-subtitle">
                    Verify your LinkedIn post for engagement and quality
                  </p>
                </div>
              </div>

              <div className="iipc-input-section">
                <Input
                  label="LinkedIn Post URL"
                  placeholder="https://www.linkedin.com/posts/..."
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  icon={<Linkedin size={20} />}
                  floatingLabel
                />

                <Button
                  variant="primary"
                  onClick={handleVerifyPost}
                  disabled={!postUrl || isVerifying}
                  withGlow={postUrl && !isVerifying}
                >
                  {isVerifying ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block' }}
                    >
                      <Search size={20} />
                    </motion.span>
                  ) : (
                    'Verify Post'
                  )}
                </Button>
              </div>

              {isVerifying && (
                <motion.div
                  className="iipc-scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="iipc-scanning-bar"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <p className="iipc-scanning-text">Scanning LinkedIn post...</p>
                </motion.div>
              )}

              {postData && !isVerifying && (
                <motion.div
                  className="iipc-result-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="iipc-result-header">
                    <CheckCircle size={24} className="iipc-result-icon" />
                    <h3 className="iipc-result-title">Post Verified Successfully!</h3>
                  </div>

                  <div className="iipc-result-grid">
                    <motion.div
                      className="iipc-stat-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Calendar size={24} />
                      <div>
                        <div className="iipc-stat-label">Post Date</div>
                        <motion.div
                          className="iipc-stat-value"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {postData.date}
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="iipc-stat-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Hash size={24} />
                      <div>
                        <div className="iipc-stat-label">Character Count</div>
                        <motion.div
                          className="iipc-stat-value"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: 'spring' }}
                        >
                          {postData.characters}
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="iipc-stat-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Hash size={24} />
                      <div>
                        <div className="iipc-stat-label">Hashtags</div>
                        <motion.div
                          className="iipc-stat-value"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: 'spring' }}
                        >
                          #{postData.hashtags}
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="iipc-stat-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <TrendingUp size={24} />
                      <div>
                        <div className="iipc-stat-label">Engagement</div>
                        <motion.div
                          className="iipc-stat-value"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: 'spring' }}
                        >
                          {postData.engagement}
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="iipc-sentiment-badge"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                  >
                    <span className="iipc-sentiment-label">Sentiment Analysis:</span>
                    <span className="iipc-sentiment-value">{postData.sentiment}</span>
                  </motion.div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {activeSection === 'connections' && (
          <motion.div
            key="connections"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="medium" className="iipc-card">
              <div className="iipc-card-header">
                <Users size={32} className="iipc-card-icon" />
                <div>
                  <h2 className="iipc-card-title">LinkedIn Connections Verification</h2>
                  <p className="iipc-card-subtitle">
                    Verify your LinkedIn connections from industry professionals
                  </p>
                </div>
              </div>

              {/* Verification Method Selection */}
              <div className="iipc-method-selector">
                <motion.button
                  className={`iipc-method-button ${verificationMethod === 'upload' ? 'iipc-method-button--active' : ''}`}
                  onClick={() => setVerificationMethod('upload')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload size={24} />
                  <div>
                    <div className="iipc-method-title">Upload Screenshots</div>
                    <div className="iipc-method-subtitle">Manually upload connection screenshots</div>
                  </div>
                </motion.button>

                <motion.button
                  className={`iipc-method-button ${verificationMethod === 'profile' ? 'iipc-method-button--active' : ''}`}
                  onClick={() => setVerificationMethod('profile')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Linkedin size={24} />
                  <div>
                    <div className="iipc-method-title">Link Profile</div>
                    <div className="iipc-method-subtitle">Connect your LinkedIn profile directly</div>
                  </div>
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {verificationMethod === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="iipc-upload-area">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="iipc-file-input"
                      />
                      <Upload size={48} />
                      <h3>Upload Connection Screenshots</h3>
                      <p>Click to browse or drag & drop</p>
                    </label>

                    {screenshots.length > 0 && (
                      <div className="iipc-screenshots-grid">
                        {screenshots.map((screenshot, index) => (
                          <motion.div
                            key={index}
                            className="iipc-screenshot-card"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <img src={screenshot.url} alt={screenshot.name} />
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {screenshots.length > 0 && (
                      <Button
                        variant="primary"
                        onClick={handleVerifyConnections}
                        withGlow
                      >
                        Verify Connections
                      </Button>
                    )}
                  </motion.div>
                )}

                {verificationMethod === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="iipc-profile-section">
                      <Input
                        label="LinkedIn Profile URL"
                        placeholder="https://www.linkedin.com/in/your-profile"
                        value={profileUrl}
                        onChange={(e) => setProfileUrl(e.target.value)}
                        icon={<Linkedin size={20} />}
                        floatingLabel
                      />
                    </div>

                    <Button
                      variant="primary"
                      onClick={handleVerifyConnections}
                      disabled={!profileUrl}
                      withGlow={profileUrl}
                    >
                      Connect & Verify
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {connectionsData && (
                <motion.div
                  className="iipc-connections-result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="iipc-result-header">
                    <CheckCircle size={24} className="iipc-result-icon" />
                    <h3 className="iipc-result-title">Connections Verified!</h3>
                  </div>

                  <div className="iipc-total-connections">
                    <motion.div
                      className="iipc-connections-number"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      {connectionsData.total}
                    </motion.div>
                    <div className="iipc-connections-label">Total Connections</div>
                  </div>

                  <div className="iipc-connections-table">
                    <div className="iipc-table-header">
                      <span>Name</span>
                      <span>Company</span>
                      <span>Status</span>
                    </div>
                    {connectionsData.verified.map((connection, index) => (
                      <motion.div
                        key={index}
                        className="iipc-table-row"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <span className="iipc-connection-name">{connection.name}</span>
                        <span className="iipc-connection-company">
                          <span className="iipc-company-badge">{connection.company}</span>
                        </span>
                        <span className="iipc-connection-status">
                          <motion.div
                            className="iipc-verified-stamp"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                          >
                            <CheckCircle size={16} />
                            Verified
                          </motion.div>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IIPC;
