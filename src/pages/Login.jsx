import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, Lightbulb, ArrowRight, GraduationCap, Users, Shield, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import './Login.css';

const ROLES = [
    { id: 'student', label: 'Student', icon: GraduationCap, color: '#F7C948', description: 'Access student dashboard' },
    { id: 'mentor', label: 'Mentor', icon: Users, color: '#42A5F5', description: 'Guide and support students' },
    { id: 'admin', label: 'Admin', icon: Crown, color: '#E53935', description: 'Full system access' },
];
//vishnu
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [selectedRole, setSelectedRole] = useState('student');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        console.log('Validating form with data:', formData);

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin) {
            if (!formData.name) {
                newErrors.name = 'Name is required';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        
        console.log('Validation errors:', newErrors);
        console.log('Validation result:', Object.keys(newErrors).length === 0);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                console.log('Login form - attempting login with:', formData.email);
                
                // Use email as username for login
                await login(formData.email, formData.password, selectedRole);

                // Navigate based on role
                switch (selectedRole) {
                    case 'student':
                        navigate('/');
                        break;
                    case 'mentor':
                        navigate('/mentor-dashboard');
                        break;
                    case 'admin':
                        navigate('/admin-dashboard');
                        break;
                    default:
                        navigate('/');
                }
            } catch (error) {
                console.error('Login error:', error);
                console.error('Error response:', error.response?.data);
                
                const errorMessage = error.response?.data?.detail || 
                                   error.response?.data?.message || 
                                   'Invalid email or password';
                
                setErrors({
                    email: errorMessage,
                    password: 'Please check your credentials',
                });
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        });
    };

    return (
        <div className="login-page">
            {/* Animated Background */}
            <div className="login-background">
                <motion.div
                    className="login-gradient-orb login-gradient-orb--1"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="login-gradient-orb login-gradient-orb--2"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="login-gradient-orb login-gradient-orb--3"
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -80, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            {/* Login Container */}
            <div className="login-container">
                {/* Branding Section */}
                <motion.div
                    className="login-branding"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="login-logo"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Lightbulb size={64} />
                    </motion.div>
                    <h1 className="login-title">Cohort Web</h1>
                    <p className="login-subtitle">
                        Track your academic journey, showcase your skills, and build your professional portfolio
                    </p>

                    <div className="login-features">
                        <motion.div
                            className="login-feature"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="login-feature-icon">✨</div>
                            <span>Creative Learning</span>
                        </motion.div>
                        <motion.div
                            className="login-feature"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="login-feature-icon">🚀</div>
                            <span>Career Development</span>
                        </motion.div>
                        <motion.div
                            className="login-feature"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="login-feature-icon">💼</div>
                            <span>Portfolio Building</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Login Form Card */}
                <motion.div
                    className="login-card-wrapper"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard className="login-card" hoverable={false}>
                        <div className="login-card-header">
                            <h2 className="login-card-title">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="login-card-description">
                                {isLogin
                                    ? 'Sign in to continue your learning journey'
                                    : 'Join us to start tracking your achievements'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            {/* Role Selection */}
                            <div className="role-selection">
                                <label className="role-selection-label">Select Your Role</label>
                                <div className="role-grid">
                                    {ROLES.map((role) => {
                                        const Icon = role.icon;
                                        return (
                                            <motion.button
                                                key={role.id}
                                                type="button"
                                                className={`role-card ${selectedRole === role.id ? 'role-card--active' : ''}`}
                                                onClick={() => setSelectedRole(role.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{
                                                    '--role-color': role.color,
                                                }}
                                            >
                                                <Icon size={24} />
                                                <span className="role-card-label">{role.label}</span>
                                                {selectedRole === role.id && (
                                                    <motion.div
                                                        className="role-card-checkmark"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    >
                                                        ✓
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {!isLogin && (
                                <Input
                                    label="Full Name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={errors.name}
                                    icon={<UserPlus size={20} />}
                                    placeholder="Enter your name"
                                />
                            )}

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={errors.email}
                                icon={<Mail size={20} />}
                                placeholder="Enter your email"
                            />

                            <div className="login-password-field">
                                <Input
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={errors.password}
                                    icon={<Lock size={20} />}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {!isLogin && (
                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    error={errors.confirmPassword}
                                    icon={<Lock size={20} />}
                                    placeholder="Confirm your password"
                                />
                            )}

                            {Object.keys(errors).length > 0 && (
                                <motion.div
                                    className="login-error-summary"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {Object.values(errors).map((error, index) => (
                                        <div key={index} className="login-error-item">
                                            {error}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {isLogin && (
                                <div className="login-options">
                                    <label className="login-remember">
                                        <input type="checkbox" />
                                        <span>Remember me</span>
                                    </label>
                                    <Link to="/forgot-password" className="login-forgot">
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                withGlow={true}
                                className="login-submit-button"
                            >
                                {isLogin ? (
                                    <>
                                        <LogIn size={20} />
                                        Sign In
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        Create Account
                                    </>
                                )}
                            </Button>

                            <div className="login-divider">
                                <span>or continue with</span>
                            </div>

                            <div className="login-social-buttons">
                                <button type="button" className="login-social-button">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </button>
                                <button type="button" className="login-social-button">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                    GitHub
                                </button>
                            </div>
                        </form>

                        <div className="login-card-footer">
                            <p>
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                <button
                                    type="button"
                                    className="login-toggle-mode"
                                    onClick={toggleMode}
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                    <ArrowRight size={16} />
                                </button>
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
