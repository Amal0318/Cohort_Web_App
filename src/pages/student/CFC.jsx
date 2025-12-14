import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Video, Briefcase, Brain, Upload, CheckCircle, ExternalLink, Loader2, AlertCircle, Plus } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import Input from '../../components/Input';
import HackathonRegistrationModal from '../../components/HackathonRegistrationModal';
import * as cfcService from '../../services/cfc';
import './CFC.css';

const TABS = [
  { id: 'hackathon', label: 'Hackathon', icon: Trophy },
  { id: 'bmc', label: 'BMC Video', icon: Video },
  { id: 'internship', label: 'Internship', icon: Briefcase },
  { id: 'genai', label: 'GenAI Project', icon: Brain },
];

export const CFC = () => {
  const [activeTab, setActiveTab] = useState('hackathon');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registeredHackathons, setRegisteredHackathons] = useState([]);

  // Hackathon state
  const [hackathonName, setHackathonName] = useState('');
  const [hackathonMode, setHackathonMode] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [participationDate, setParticipationDate] = useState('');
  const [hackathonGithubRepo, setHackathonGithubRepo] = useState('');
  const [certificateLink, setCertificateLink] = useState('');
  const [hackathonRepoValidation, setHackathonRepoValidation] = useState(null);
  const [checkingHackathonRepo, setCheckingHackathonRepo] = useState(false);

  // BMC Video state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const [checkingDuration, setCheckingDuration] = useState(false);

  // Internship state
  const [internshipData, setInternshipData] = useState({
    company: '',
    mode: '',
    role: '',
    duration: '',
    internshipStatus: 1,
    completionCertificateLink: '',
    lorLink: '',
  });

  // GenAI state
  const [genAIData, setGenAIData] = useState({
    problemStatement: '',
    solutionType: '',
    innovationTechnology: '',
    innovationIndustry: '',
    githubRepo: '',
    demoLink: '',
  });
  const [repoValidation, setRepoValidation] = useState(null);
  const [checkingRepo, setCheckingRepo] = useState(false);

  // Load registered hackathons on mount
  useEffect(() => {
    fetchRegisteredHackathons();
  }, []);

  const fetchRegisteredHackathons = async () => {
    try {
      const data = await cfcService.getHackathonRegistrations();
      setRegisteredHackathons(data);
    } catch (err) {
      console.error('Failed to fetch registered hackathons:', err);
    }
  };

  const handleRegisterHackathon = async (formData) => {
    try {
      await cfcService.createHackathonRegistration(formData);
      setSuccess('Hackathon registered successfully! We\'ll remind you on your home page.');
      setShowRegistrationModal(false);
      fetchRegisteredHackathons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register hackathon');
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    setIsVideoPlaying(false);
    setVideoDuration(null);

    // Extract YouTube video ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(youtubeRegex);
    if (match) {
      const extractedVideoId = match[1];
      setVideoId(extractedVideoId);
      setVideoPreview(`https://img.youtube.com/vi/${extractedVideoId}/mqdefault.jpg`);
      
      // Check video duration
      checkVideoDuration(extractedVideoId);
    } else {
      setVideoId(null);
      setVideoPreview(null);
    }
  };

  const checkVideoDuration = async (videoId) => {
    setCheckingDuration(true);
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const result = await cfcService.checkVideoDuration(videoUrl);
      
      if (result.duration_minutes !== undefined) {
        setVideoDuration(result.duration_minutes);
      } else {
        setVideoDuration(null);
      }
    } catch (err) {
      console.error('Error checking video duration:', err);
      setVideoDuration(null);
    } finally {
      setCheckingDuration(false);
    }
  };

  const handlePlayVideo = () => {
    if (videoId) {
      setIsVideoPlaying(true);
    }
  };

  // ==================== SUBMISSION HANDLERS ====================

  const handleHackathonSubmit = async () => {
    if (!hackathonName || !hackathonMode || !registrationDate || !participationDate || !certificateLink) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if repository validation passed (if repo URL was provided)
    if (hackathonGithubRepo && (!hackathonRepoValidation || !hackathonRepoValidation.valid)) {
      setError('Please provide a valid GitHub repository URL or leave it empty');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = {
        hackathon_name: hackathonName,
        mode: hackathonMode,
        registration_date: registrationDate,
        participation_date: participationDate,
        github_repo: hackathonGithubRepo || '',
        certificate_link: certificateLink,
      };
      
      await cfcService.createHackathonSubmission(data);
      setSuccess('Hackathon submission created successfully!');
      
      // Reset form
      setHackathonName('');
      setHackathonMode('');
      setRegistrationDate('');
      setParticipationDate('');
      setHackathonGithubRepo('');
      setCertificateLink('');
      setHackathonRepoValidation(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit hackathon');
      console.error('Hackathon submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHackathonGithubUrlChange = async (e) => {
    const url = e.target.value;
    setHackathonGithubRepo(url);
    setHackathonRepoValidation(null);
    
    // Auto-validate if URL looks like a GitHub repo
    if (url && url.includes('github.com') && url.split('/').length >= 5) {
      await validateHackathonGithubRepo(url);
    }
  };

  const validateHackathonGithubRepo = async (url) => {
    if (!url) {
      setHackathonRepoValidation(null);
      return;
    }

    setCheckingHackathonRepo(true);
    try {
      const result = await cfcService.validateHackathonRepo(url);
      setHackathonRepoValidation(result);
    } catch (err) {
      setHackathonRepoValidation({
        valid: false,
        error: err.response?.data?.error || 'Failed to validate repository'
      });
    } finally {
      setCheckingHackathonRepo(false);
    }
  };

  const handleBMCVideoSubmit = async () => {
    if (!videoUrl) {
      setError('Please enter a video URL');
      return;
    }

    // Check if video duration is available and valid
    if (videoDuration !== null && videoDuration < 5) {
      setError('Video must be at least 5 minutes long. Current video duration is ' + videoDuration + ' minutes.');
      return;
    }

    if (checkingDuration) {
      setError('Please wait while we check the video duration...');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = {
        video_url: videoUrl,
        description: videoDescription || '',
      };
      
      await cfcService.createBMCVideoSubmission(data);
      setSuccess('BMC Video submitted successfully!');
      
      // Reset form
      setVideoUrl('');
      setVideoDescription('');
      setVideoPreview(null);
      setVideoDuration(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit BMC video');
      console.error('BMC Video submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInternshipSubmit = async () => {
    if (!internshipData.company || !internshipData.mode || !internshipData.role || !internshipData.duration) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = {
        company: internshipData.company,
        mode: internshipData.mode,
        role: internshipData.role,
        duration: internshipData.duration,
        internship_status: internshipData.internshipStatus,
        completion_certificate_link: internshipData.completionCertificateLink || '',
        lor_link: internshipData.lorLink || '',
      };
      
      await cfcService.createInternshipSubmission(data);
      setSuccess('Internship details submitted successfully!');
      
      // Reset form
      setInternshipData({
        company: '',
        mode: '',
        role: '',
        duration: '',
        internshipStatus: 1,
        completionCertificateLink: '',
        lorLink: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit internship');
      console.error('Internship submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubUrlChange = async (e) => {
    const url = e.target.value;
    setGenAIData({ ...genAIData, githubRepo: url });
    setRepoValidation(null);
    
    // Auto-validate if URL looks like a GitHub repo
    if (url && url.includes('github.com') && url.split('/').length >= 5) {
      await validateGithubRepo(url);
    }
  };

  const validateGithubRepo = async (url) => {
    if (!url) {
      setRepoValidation(null);
      return;
    }

    setCheckingRepo(true);
    try {
      const result = await cfcService.validateGithubRepo(url);
      setRepoValidation(result);
    } catch (err) {
      setRepoValidation({
        valid: false,
        error: err.response?.data?.error || 'Failed to validate repository'
      });
    } finally {
      setCheckingRepo(false);
    }
  };

  const handleGenAISubmit = async () => {
    if (!genAIData.problemStatement || !genAIData.solutionType || 
        !genAIData.innovationTechnology || !genAIData.innovationIndustry || 
        !genAIData.githubRepo) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if repository validation passed
    if (!repoValidation || !repoValidation.valid) {
      setError('Please provide a valid GitHub repository URL');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = {
        problem_statement: genAIData.problemStatement,
        solution_type: genAIData.solutionType,
        innovation_technology: genAIData.innovationTechnology,
        innovation_industry: genAIData.innovationIndustry,
        github_repo: genAIData.githubRepo,
        demo_link: genAIData.demoLink || '',
      };
      
      await cfcService.createGenAIProjectSubmission(data);
      setSuccess('GenAI Project submitted successfully!');
      
      // Reset form
      setGenAIData({
        problemStatement: '',
        solutionType: '',
        innovationTechnology: '',
        innovationIndustry: '',
        githubRepo: '',
        demoLink: '',
      });
      setRepoValidation(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit GenAI project');
      console.error('GenAI submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cfc-container">
      {/* Success/Error Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="cfc-notification cfc-notification--success"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <CheckCircle size={20} />
            <span>{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            className="cfc-notification cfc-notification--error"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <ExternalLink size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        className="cfc-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="cfc-title">Center for Creativity</h1>
        <p className="cfc-subtitle">
          Build your professional portfolio and track your career development
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="cfc-tabs">
        <div className="cfc-tabs-list">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                className={`cfc-tab ${isActive ? 'cfc-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabIcon size={20} />
                <span>{tab.label}</span>

                {isActive && (
                  <motion.div
                    className="cfc-tab-indicator"
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'hackathon' && (
          <motion.div
            key="hackathon"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Register Hackathon Button */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => setShowRegistrationModal(true)}
              >
                <Plus size={20} />
                Register New Hackathon
              </Button>
            </div>

            {/* Show Registered Hackathons */}
            {registeredHackathons.length > 0 && (
              <GlassCard variant="medium" className="cfc-content-card" style={{ marginBottom: '1.5rem' }}>
                <div className="cfc-section-header">
                  <Trophy size={24} className="cfc-section-icon" />
                  <div>
                    <h3 className="cfc-section-title">Your Registered Hackathons</h3>
                    <p className="cfc-section-subtitle">
                      {registeredHackathons.filter(h => h.is_upcoming).length} upcoming
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {registeredHackathons.slice(0, 3).map((hackathon) => (
                    <div 
                      key={hackathon.id} 
                      style={{
                        padding: '1rem',
                        background: 'var(--background)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                            {hackathon.hackathon_name}
                          </h4>
                          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {new Date(hackathon.participation_date).toLocaleDateString()} • {hackathon.mode}
                          </p>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: hackathon.days_until_event <= 3 ? 'rgba(255, 71, 87, 0.1)' : 'rgba(26, 188, 156, 0.1)',
                          color: hackathon.days_until_event <= 3 ? '#ff4757' : '#16a085',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {hackathon.days_until_event === 0 ? 'Today!' : 
                           hackathon.days_until_event === 1 ? 'Tomorrow' : 
                           `${hackathon.days_until_event} days`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            <GlassCard variant="medium" className="cfc-content-card">
              <div className="cfc-section-header">
                <Trophy size={32} className="cfc-section-icon" />
                <div>
                  <h2 className="cfc-section-title">Hackathon Participation</h2>
                  <p className="cfc-section-subtitle">
                    Upload your hackathon certificates and achievements
                  </p>
                </div>
              </div>

              <Input
                label="Hackathon Name"
                placeholder="e.g., Smart India Hackathon 2025"
                value={hackathonName}
                onChange={(e) => setHackathonName(e.target.value)}
                floatingLabel
              />

              <div className="cfc-input-group">
                <label className="cfc-label">Mode of Participation</label>
                <div className="cfc-radio-group">
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="hackathonMode"
                      value="online"
                      checked={hackathonMode === 'online'}
                      onChange={(e) => setHackathonMode(e.target.value)}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">Online</span>
                  </label>
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="hackathonMode"
                      value="offline"
                      checked={hackathonMode === 'offline'}
                      onChange={(e) => setHackathonMode(e.target.value)}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">Offline</span>
                  </label>
                </div>
              </div>

              <Input
                label="Date of Registration"
                type="date"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                floatingLabel
              />

              <Input
                label="Date of Participation"
                type="date"
                value={participationDate}
                onChange={(e) => setParticipationDate(e.target.value)}
                floatingLabel
              />

              <Input
                label="GitHub Repository (Optional)"
                placeholder="https://github.com/username/repository"
                value={hackathonGithubRepo}
                onChange={handleHackathonGithubUrlChange}
                icon={<ExternalLink size={20} />}
                floatingLabel
              />

              {/* Repository Validation Status */}
              {checkingHackathonRepo && (
                <div className="repo-validation-info repo-checking">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Validating repository...</span>
                </div>
              )}

              {hackathonRepoValidation && !checkingHackathonRepo && (
                <>
                  {hackathonRepoValidation.valid ? (
                    <div className="repo-preview">
                      <div className="repo-preview-header">
                        <CheckCircle size={20} className="repo-valid-icon" />
                        <h4>Repository Validated</h4>
                      </div>
                      <div className="repo-preview-content">
                        <div className="repo-info-item">
                          <strong>{hackathonRepoValidation.full_name}</strong>
                        </div>
                        {hackathonRepoValidation.description && (
                          <div className="repo-info-item">
                            <p className="repo-description">{hackathonRepoValidation.description}</p>
                          </div>
                        )}
                        <div className="repo-stats">
                          <div className="repo-stat">
                            <span className="repo-stat-label">Language:</span>
                            <span className="repo-stat-value">{hackathonRepoValidation.language}</span>
                          </div>
                          <div className="repo-stat">
                            <span className="repo-stat-label">Stars:</span>
                            <span className="repo-stat-value">{hackathonRepoValidation.stars}</span>
                          </div>
                          <div className="repo-stat">
                            <span className="repo-stat-label">Forks:</span>
                            <span className="repo-stat-value">{hackathonRepoValidation.forks}</span>
                          </div>
                          <div className="repo-stat">
                            <span className="repo-stat-label">Commits:</span>
                            <span className="repo-stat-value">{hackathonRepoValidation.commit_count || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="repo-features">
                          {hackathonRepoValidation.has_readme ? (
                            <div className="repo-feature repo-feature-good">
                              <CheckCircle size={16} />
                              <span>README.md found</span>
                            </div>
                          ) : (
                            <div className="repo-feature repo-feature-warning">
                              <AlertCircle size={16} />
                              <span>README.md not found</span>
                            </div>
                          )}
                          {!hackathonRepoValidation.is_private ? (
                            <div className="repo-feature repo-feature-good">
                              <CheckCircle size={16} />
                              <span>Public repository</span>
                            </div>
                          ) : (
                            <div className="repo-feature repo-feature-warning">
                              <AlertCircle size={16} />
                              <span>Private repository</span>
                            </div>
                          )}
                        </div>
                        <a 
                          href={hackathonRepoValidation.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="repo-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(hackathonRepoValidation.html_url, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          View on GitHub <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="repo-validation-info repo-invalid">
                      <AlertCircle size={16} />
                      <span>{hackathonRepoValidation.error}</span>
                    </div>
                  )}
                </>
              )}

              <Input
                label="Certificate Link (Google Drive)"
                placeholder="https://drive.google.com/file/d/..."
                value={certificateLink}
                onChange={(e) => setCertificateLink(e.target.value)}
                icon={<ExternalLink size={20} />}
                floatingLabel
              />

              <div className="cfc-actions">
                <Button
                  variant="primary"
                  onClick={handleHackathonSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'bmc' && (
          <motion.div
            key="bmc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="medium" className="cfc-content-card">
              <div className="cfc-section-header">
                <Video size={32} className="cfc-section-icon" />
                <div>
                  <h2 className="cfc-section-title">BMC Video Submission</h2>
                  <p className="cfc-section-subtitle">
                    Share your Business Model Canvas presentation
                  </p>
                </div>
              </div>

              <Input
                label="YouTube Video URL"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={handleVideoUrlChange}
                icon={<ExternalLink size={20} />}
                floatingLabel
              />

              <Input
                label="Description (Optional)"
                placeholder="Describe your Business Model Canvas..."
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                floatingLabel
              />

              {videoId && (
                <div className="video-duration-info">
                  {checkingDuration ? (
                    <p className="duration-checking">
                      <Loader2 size={16} className="animate-spin" />
                      Checking video duration...
                    </p>
                  ) : videoDuration !== null ? (
                    <p className={`duration-display ${videoDuration >= 5 ? 'duration-valid' : 'duration-invalid'}`}>
                      {videoDuration >= 5 ? (
                        <>
                          <CheckCircle size={16} />
                          Video Duration: {videoDuration} minutes (Valid)
                        </>
                      ) : (
                        <>
                          <ExternalLink size={16} />
                          Video Duration: {videoDuration} minutes (Minimum 5 minutes required)
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="duration-unknown">
                      Unable to determine video duration. Please ensure video is at least 5 minutes long.
                    </p>
                  )}
                </div>
              )}

              {videoPreview && (
                <motion.div
                  className="cfc-video-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {!isVideoPlaying ? (
                    <>
                      <img src={videoPreview} alt="Video thumbnail" className="cfc-video-thumbnail" />
                      <motion.button
                        className="cfc-watch-button"
                        onClick={handlePlayVideo}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(247, 201, 72, 0.4)',
                            '0 0 40px rgba(247, 201, 72, 0.8)',
                            '0 0 20px rgba(247, 201, 72, 0.4)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Video size={32} />
                      </motion.button>
                    </>
                  ) : (
                    <iframe
                      className="cfc-video-iframe"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
                </motion.div>
              )}

              <div className="cfc-actions">
                <Button
                  variant="primary"
                  onClick={handleBMCVideoSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Video'
                  )}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'internship' && (
          <motion.div
            key="internship"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="medium" className="cfc-content-card">
              <div className="cfc-section-header">
                <Briefcase size={32} className="cfc-section-icon" />
                <div>
                  <h2 className="cfc-section-title">Internship Tracker</h2>
                  <p className="cfc-section-subtitle">
                    Log and track your internship journey
                  </p>
                </div>
              </div>

              <Input
                label="Company Name"
                placeholder="Enter company name"
                value={internshipData.company}
                onChange={(e) => setInternshipData({ ...internshipData, company: e.target.value })}
                floatingLabel
              />

              <div className="cfc-input-group">
                <label className="cfc-label">Mode of Internship</label>
                <div className="cfc-radio-group">
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="internshipMode"
                      value="remote"
                      checked={internshipData.mode === 'remote'}
                      onChange={(e) => setInternshipData({ ...internshipData, mode: e.target.value })}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">Remote</span>
                  </label>
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="internshipMode"
                      value="onsite"
                      checked={internshipData.mode === 'onsite'}
                      onChange={(e) => setInternshipData({ ...internshipData, mode: e.target.value })}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">On-site</span>
                  </label>
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="internshipMode"
                      value="hybrid"
                      checked={internshipData.mode === 'hybrid'}
                      onChange={(e) => setInternshipData({ ...internshipData, mode: e.target.value })}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">Hybrid</span>
                  </label>
                </div>
              </div>

              <Input
                label="Role"
                placeholder="e.g., Software Development Intern"
                value={internshipData.role}
                onChange={(e) => setInternshipData({ ...internshipData, role: e.target.value })}
                floatingLabel
              />

              <Input
                label="Duration of Internship"
                placeholder="e.g., 3 months or 01/2025 - 04/2025"
                value={internshipData.duration}
                onChange={(e) => setInternshipData({ ...internshipData, duration: e.target.value })}
                floatingLabel
              />

              <div className="cfc-input-group">
                <label className="cfc-label">Internship Status</label>
                <div className="cfc-radio-group">
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="internshipStatus"
                      value="1"
                      checked={internshipData.internshipStatus === 1}
                      onChange={(e) => setInternshipData({ ...internshipData, internshipStatus: Number(e.target.value) })}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">Application</span>
                  </label>
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="internshipStatus"
                      value="2"
                      checked={internshipData.internshipStatus === 2}
                      onChange={(e) => setInternshipData({ ...internshipData, internshipStatus: Number(e.target.value) })}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">Interview</span>
                  </label>
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="internshipStatus"
                      value="3"
                      checked={internshipData.internshipStatus === 3}
                      onChange={(e) => setInternshipData({ ...internshipData, internshipStatus: Number(e.target.value) })}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">Offer</span>
                  </label>
                  <label className="cfc-radio-label">
                    <input
                      type="radio"
                      name="internshipStatus"
                      value="4"
                      checked={internshipData.internshipStatus === 4}
                      onChange={(e) => setInternshipData({ ...internshipData, internshipStatus: Number(e.target.value) })}
                      className="cfc-radio-input"
                    />
                    <span className="cfc-radio-custom"></span>
                    <span className="cfc-radio-text">Completion</span>
                  </label>
                </div>
              </div>

              <Input
                label="Completion Certificate Link (Google Drive - Optional)"
                placeholder="https://drive.google.com/file/d/..."
                value={internshipData.completionCertificateLink}
                onChange={(e) => setInternshipData({ ...internshipData, completionCertificateLink: e.target.value })}
                icon={<ExternalLink size={20} />}
                floatingLabel
              />

              <Input
                label="Letter of Recommendation Link (Google Drive - Optional)"
                placeholder="https://drive.google.com/file/d/..."
                value={internshipData.lorLink}
                onChange={(e) => setInternshipData({ ...internshipData, lorLink: e.target.value })}
                icon={<ExternalLink size={20} />}
                floatingLabel
              />

              <div className="cfc-actions">
                <Button
                  variant="primary"
                  onClick={handleInternshipSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Internship'
                  )}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'genai' && (
          <motion.div
            key="genai"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="medium" className="cfc-content-card">
              <div className="cfc-section-header">
                <Brain size={32} className="cfc-section-icon" />
                <div>
                  <h2 className="cfc-section-title">GenAI Project Completion</h2>
                  <p className="cfc-section-subtitle">
                    Track your AI/ML project progress and certifications
                  </p>
                </div>
              </div>

              <div className="cfc-textarea-group">
                <label className="cfc-label">Problem Statement</label>
                <textarea
                  className="cfc-textarea"
                  rows="4"
                  placeholder="Describe the problem your GenAI project addresses..."
                  value={genAIData.problemStatement}
                  onChange={(e) => setGenAIData({ ...genAIData, problemStatement: e.target.value })}
                />
              </div>

              <Input
                label="Solution Type"
                placeholder="e.g., Website, Web App, Mobile App, Desktop App"
                value={genAIData.solutionType}
                onChange={(e) => setGenAIData({ ...genAIData, solutionType: e.target.value })}
                floatingLabel
              />

              <Input
                label="Innovation Technology"
                placeholder="e.g., Machine Learning, NLP, Computer Vision"
                value={genAIData.innovationTechnology}
                onChange={(e) => setGenAIData({ ...genAIData, innovationTechnology: e.target.value })}
                floatingLabel
              />

              <Input
                label="Innovation Industry"
                placeholder="e.g., Healthcare, Finance, Education, E-commerce"
                value={genAIData.innovationIndustry}
                onChange={(e) => setGenAIData({ ...genAIData, innovationIndustry: e.target.value })}
                floatingLabel
              />

              <Input
                label="GitHub Repository"
                placeholder="https://github.com/username/repository"
                value={genAIData.githubRepo}
                onChange={handleGithubUrlChange}
                icon={<ExternalLink size={20} />}
                floatingLabel
              />

              {/* Repository Validation Status */}
              {checkingRepo && (
                <div className="repo-validation-info repo-checking">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Validating repository...</span>
                </div>
              )}

              {repoValidation && !checkingRepo && (
                <>
                  {repoValidation.valid ? (
                    <div className="repo-preview">
                      <div className="repo-preview-header">
                        <CheckCircle size={20} className="repo-valid-icon" />
                        <h4>Repository Validated</h4>
                      </div>
                      <div className="repo-preview-content">
                        <div className="repo-info-item">
                          <strong>{repoValidation.full_name}</strong>
                        </div>
                        {repoValidation.description && (
                          <div className="repo-info-item">
                            <p className="repo-description">{repoValidation.description}</p>
                          </div>
                        )}
                        <div className="repo-stats">
                          <div className="repo-stat">
                            <span className="repo-stat-label">Language:</span>
                            <span className="repo-stat-value">{repoValidation.language}</span>
                          </div>
                          <div className="repo-stat">
                            <span className="repo-stat-label">Stars:</span>
                            <span className="repo-stat-value">{repoValidation.stars}</span>
                          </div>
                          <div className="repo-stat">
                            <span className="repo-stat-label">Forks:</span>
                            <span className="repo-stat-value">{repoValidation.forks}</span>
                          </div>
                          <div className="repo-stat">
                            <span className="repo-stat-label">Commits:</span>
                            <span className="repo-stat-value">{repoValidation.commit_count || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="repo-features">
                          {repoValidation.has_readme ? (
                            <div className="repo-feature repo-feature-good">
                              <CheckCircle size={16} />
                              <span>README.md found</span>
                            </div>
                          ) : (
                            <div className="repo-feature repo-feature-warning">
                              <AlertCircle size={16} />
                              <span>README.md not found</span>
                            </div>
                          )}
                          {!repoValidation.is_private ? (
                            <div className="repo-feature repo-feature-good">
                              <CheckCircle size={16} />
                              <span>Public repository</span>
                            </div>
                          ) : (
                            <div className="repo-feature repo-feature-warning">
                              <AlertCircle size={16} />
                              <span>Private repository</span>
                            </div>
                          )}
                        </div>
                        <a 
                          href={repoValidation.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="repo-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(repoValidation.html_url, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          View on GitHub <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="repo-validation-info repo-invalid">
                      <AlertCircle size={16} />
                      <span>{repoValidation.error}</span>
                    </div>
                  )}
                </>
              )}

              <Input
                label="Demo Link (Optional)"
                placeholder="https://your-demo-link.com"
                value={genAIData.demoLink}
                onChange={(e) => setGenAIData({ ...genAIData, demoLink: e.target.value })}
                icon={<ExternalLink size={20} />}
                floatingLabel
              />

              <div className="cfc-actions">
                <Button
                  variant="primary"
                  onClick={handleGenAISubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Project'
                  )}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hackathon Registration Modal */}
      <HackathonRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onRegister={handleRegisterHackathon}
      />
    </div>
  );
};

export default CFC;
