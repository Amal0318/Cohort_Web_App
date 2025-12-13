import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle, Clock, XCircle, Lightbulb, Heart, Trophy, Linkedin, Code, Search, MessageCircle, Send, X as CloseIcon } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import messageService from '../../services/messageService';
import SubmissionReview from './SubmissionReview';
import './MentorDashboard.css';

function MentorDashboard() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showChatModal, setShowChatModal] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('general');

    // Mock data for students assigned to this mentor
    const students = [
        {
            id: 1,
            name: 'Amal R',
            email: 'amal@student.com',
            rollNo: 'CS101',
            submissions: {
                clt: { status: 'completed', count: 5, lastSubmission: '2 days ago' },
                sri: { status: 'pending', count: 2, lastSubmission: '5 hours ago' },
                cfc: { status: 'completed', count: 3, lastSubmission: '1 week ago' },
                iipc: { status: 'completed', count: 1, lastSubmission: '3 days ago' },
                scd: { status: 'not-started', count: 0, lastSubmission: 'Never' },
            }
        },
        {
            id: 2,
            name: 'Priya S',
            email: 'priya@student.com',
            rollNo: 'CS102',
            submissions: {
                clt: { status: 'completed', count: 4, lastSubmission: '1 day ago' },
                sri: { status: 'completed', count: 3, lastSubmission: '2 days ago' },
                cfc: { status: 'pending', count: 2, lastSubmission: '3 hours ago' },
                iipc: { status: 'not-started', count: 0, lastSubmission: 'Never' },
                scd: { status: 'completed', count: 2, lastSubmission: '4 days ago' },
            }
        },
        {
            id: 3,
            name: 'Raj K',
            email: 'raj@student.com',
            rollNo: 'CS103',
            submissions: {
                clt: { status: 'pending', count: 3, lastSubmission: '1 hour ago' },
                sri: { status: 'completed', count: 4, lastSubmission: '1 week ago' },
                cfc: { status: 'completed', count: 5, lastSubmission: '2 days ago' },
                iipc: { status: 'pending', count: 1, lastSubmission: '6 hours ago' },
                scd: { status: 'completed', count: 3, lastSubmission: '5 days ago' },
            }
        },
        {
            id: 4,
            name: 'Meera L',
            email: 'meera@student.com',
            rollNo: 'CS104',
            submissions: {
                clt: { status: 'completed', count: 6, lastSubmission: '3 days ago' },
                sri: { status: 'not-started', count: 0, lastSubmission: 'Never' },
                cfc: { status: 'pending', count: 1, lastSubmission: '2 hours ago' },
                iipc: { status: 'completed', count: 2, lastSubmission: '1 week ago' },
                scd: { status: 'completed', count: 4, lastSubmission: '6 days ago' },
            }
        },
        {
            id: 5,
            name: 'Karthik M',
            email: 'karthik@student.com',
            rollNo: 'CS105',
            submissions: {
                clt: { status: 'completed', count: 3, lastSubmission: '4 days ago' },
                sri: { status: 'completed', count: 2, lastSubmission: '1 day ago' },
                cfc: { status: 'completed', count: 4, lastSubmission: '3 days ago' },
                iipc: { status: 'completed', count: 3, lastSubmission: '2 days ago' },
                scd: { status: 'pending', count: 1, lastSubmission: '8 hours ago' },
            }
        },
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mentor-dashboard">
            {/* Header */}
            <motion.div
                className="mentor-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="mentor-title">Student List</h1>
                <p className="mentor-subtitle">Monitor and review your assigned students</p>
            </motion.div>

            {/* Two Column Layout */}
            <div className="mentor-content">
                {/* Left Side - Student List */}
                <motion.div
                    className="students-panel"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <GlassCard>
                        <div className="students-section">
                            <div className="students-header">
                                <h2 className="section-title">
                                    <Users size={24} />
                                    Assigned Students ({students.length})
                                </h2>
                                <div className="search-box">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>
                            <div className="students-list">
                                {filteredStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className={`student-card ${selectedStudent?.id === student.id ? 'active' : ''}`}
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <div className="student-avatar">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="student-info">
                                            <h3 className="student-name">{student.name}</h3>
                                            <p className="student-roll">{student.rollNo}</p>
                                            <p className="student-email">{student.email}</p>
                                        </div>
                                        <div className="student-status-summary">
                                            {Object.values(student.submissions).filter(s => s.status === 'pending').length > 0 && (
                                                <span className="pending-badge">
                                                    {Object.values(student.submissions).filter(s => s.status === 'pending').length} Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Right Side - Student Details */}
                <motion.div
                    className="details-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {selectedStudent ? (
                        <SubmissionReview selectedStudent={selectedStudent} />
                    ) : (
                        <GlassCard>
                            <div className="no-selection">
                                <Users size={64} opacity={0.3} />
                                <h3>Select a Student</h3>
                                <p>Click on a student from the list to view their submission details</p>
                            </div>
                        </GlassCard>
                    )}
                </motion.div>
            </div>

            {/* Chat Modal */}
            <AnimatePresence>
                {showChatModal && selectedStudent && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowChatModal(false)}
                    >
                        <motion.div
                            className="chat-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="chat-modal-header">
                                <div>
                                    <h3>Send Message</h3>
                                    <p>To: {selectedStudent.name}</p>
                                </div>
                                <button
                                    className="close-button"
                                    onClick={() => setShowChatModal(false)}
                                >
                                    <CloseIcon size={20} />
                                </button>
                            </div>

                            <div className="chat-modal-body">
                                <div className="message-type-selector">
                                    <label className="type-label">Message Type:</label>
                                    <div className="type-options">
                                        <label className={`type-option ${messageType === 'general' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="messageType"
                                                value="general"
                                                checked={messageType === 'general'}
                                                onChange={(e) => setMessageType(e.target.value)}
                                            />
                                            <span>General</span>
                                        </label>
                                        <label className={`type-option ${messageType === 'completion' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="messageType"
                                                value="completion"
                                                checked={messageType === 'completion'}
                                                onChange={(e) => setMessageType(e.target.value)}
                                            />
                                            <span>Completion</span>
                                        </label>
                                        <label className={`type-option ${messageType === 'pending' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="messageType"
                                                value="pending"
                                                checked={messageType === 'pending'}
                                                onChange={(e) => setMessageType(e.target.value)}
                                            />
                                            <span>Pending Review</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="message-input-container">
                                    <label className="input-label">Message:</label>
                                    <textarea
                                        className="message-textarea"
                                        placeholder="Type your message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={6}
                                    />
                                </div>
                            </div>

                            <div className="chat-modal-footer">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowChatModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={async () => {
                                        if (message.trim()) {
                                            try {
                                                await messageService.sendMessage(
                                                    selectedStudent.id,
                                                    message,
                                                    messageType
                                                );
                                                // Show success feedback
                                                alert('Message sent successfully!');
                                                setMessage('');
                                                setMessageType('general');
                                                setShowChatModal(false);
                                            } catch (error) {
                                                console.error('Failed to send message:', error);
                                                alert('Failed to send message. Please try again.');
                                            }
                                        }
                                    }}
                                    disabled={!message.trim()}
                                >
                                    <Send size={16} />
                                    <span>Send</span>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default MentorDashboard;
