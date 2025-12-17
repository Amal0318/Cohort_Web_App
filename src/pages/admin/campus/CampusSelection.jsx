import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, GraduationCap } from 'lucide-react';
import GlassCard from '../../../components/GlassCard';
import './CampusSelection.css';

function CampusSelection() {
    const navigate = useNavigate();

    const campuses = [
        {
            id: 'TECH',
            name: 'SNS College of Technology',
            icon: Building2,
            color: '#2196F3',
            floors: 4,
            description: 'Engineering and Technology Campus',
            path: '/admin/campus/TECH'
        },
        {
            id: 'ARTS',
            name: 'SNS College of Arts & Science',
            icon: GraduationCap,
            color: '#9C27B0',
            floors: 3,
            description: 'Arts and Science Campus',
            path: '/admin/campus/ARTS'
        }
    ];

    return (
        <div className="campus-selection-container">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="campus-selection-header"
            >
                <h1 className="campus-selection-title">Select Campus</h1>
                <p className="campus-selection-subtitle">
                    Choose a campus to manage floors, mentors, and students
                </p>
            </motion.div>

            <div className="campus-cards-grid">
                {campuses.map((campus, index) => (
                    <motion.div
                        key={campus.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <GlassCard
                            hoverable
                            onClick={() => navigate(campus.path)}
                            style={{ cursor: 'pointer', height: '100%' }}
                        >
                            <div className="campus-card">
                                <div 
                                    className="campus-icon"
                                    style={{ 
                                        backgroundColor: `${campus.color}15`,
                                        border: `2px solid ${campus.color}30`
                                    }}
                                >
                                    <campus.icon size={64} color={campus.color} />
                                </div>
                                <h2 className="campus-name">{campus.name}</h2>
                                <p className="campus-description">{campus.description}</p>
                                <div className="campus-stats">
                                    <div className="stat-item">
                                        <span className="stat-value">{campus.floors}</span>
                                        <span className="stat-label">Floors</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default CampusSelection;
