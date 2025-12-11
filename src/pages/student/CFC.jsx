import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Video, Briefcase, Brain, Upload, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import Input from '../../components/Input';
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

  // Hackathon state
  const [hackathonName, setHackathonName] = useState('');
  const [hackathonMode, setHackathonMode] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [participationDate, setParticipationDate] = useState('');
  const [certificateLink, setCertificateLink] = useState('');

  // BMC Video state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

    // Extract YouTube video ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(youtubeRegex);
    if (match) {
      setVideoId(match[1]);
      setVideoPreview(`https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`);
    } else {
      setVideoId(null);
      setVideoPreview(null);
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

    setLoading(true);
    setError(null);
    try {
      const data = {
        hackathon_name: hackathonName,
        mode: hackathonMode,
        registration_date: registrationDate,
        participation_date: participationDate,
        certificate_link: certificateLink,
      };
      
      await cfcService.createHackathonSubmission(data);
      setSuccess('Hackathon submission created successfully!');
      
      // Reset form
      setHackathonName('');
      setHackathonMode('');
      setRegistrationDate('');
      setParticipationDate('');
      setCertificateLink('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit hackathon');
      console.error('Hackathon submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBMCVideoSubmit = async () => {
    if (!videoUrl) {
      setError('Please enter a video URL');
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

  const handleGenAISubmit = async () => {
    if (!genAIData.problemStatement || !genAIData.solutionType || 
        !genAIData.innovationTechnology || !genAIData.innovationIndustry || 
        !genAIData.githubRepo) {
      setError('Please fill in all required fields');
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
                onChange={(e) => setGenAIData({ ...genAIData, githubRepo: e.target.value })}
                icon={<ExternalLink size={20} />}
                floatingLabel
              />

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
    </div>
  );
};

export default CFC;
