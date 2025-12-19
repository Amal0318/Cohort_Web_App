import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Flame, X, Check, RefreshCw, Star, Zap } from 'lucide-react';
import './MemoryMatchingGame.css';

const MemoryMatchingGame = ({ onClose, pillarName }) => {
    const [gameState, setGameState] = useState(null);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [streak, setStreak] = useState(0);
    const [lastPlayed, setLastPlayed] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [bestTime, setBestTime] = useState(null);
    const [difficulty, setDifficulty] = useState('medium');

    // Timer effect
    useEffect(() => {
        let interval;
        if (isTimerRunning && !isComplete) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, isComplete]);

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Generate daily seed based on date
    const getDailySeed = () => {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-memory-${pillarName}`;
    };

    // Seeded random number generator
    const seededRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    // Get daily difficulty based on date
    const getDailyDifficulty = () => {
        const seed = getDailySeed();
        let hashCode = 0;
        for (let i = 0; i < seed.length; i++) {
            hashCode = seed.charCodeAt(i) + ((hashCode << 5) - hashCode);
        }

        const difficulties = ['easy', 'medium', 'hard'];
        const diffIndex = Math.abs(hashCode) % difficulties.length;
        return difficulties[diffIndex];
    };

    // Generate symbols and numbers for cards
    const generateCardContent = (seed, difficulty) => {
        const symbols = ['★', '♦', '♥', '♠', '♣', '●', '■', '▲', '◆', '◉', '✦', '✧', '⬟', '⬢', '⬣', '⭐'];
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

        // Mix symbols and numbers based on difficulty
        let pairCount;
        switch (difficulty) {
            case 'easy':
                pairCount = 6; // 3x4 grid
                break;
            case 'hard':
                pairCount = 12; // 4x6 grid
                break;
            default: // medium
                pairCount = 8; // 4x4 grid
        }

        const availableContent = [...symbols, ...numbers];
        const selectedContent = [];

        let hashCode = 0;
        for (let i = 0; i < seed.length; i++) {
            hashCode = seed.charCodeAt(i) + ((hashCode << 5) - hashCode);
        }

        // Select random content based on seed
        for (let i = 0; i < pairCount; i++) {
            const index = Math.floor(seededRandom(hashCode + i * 100) * availableContent.length);
            selectedContent.push(availableContent[index]);
        }

        return selectedContent;
    };

    // Shuffle array with seed
    const shuffleArray = (array, seed) => {
        const shuffled = [...array];
        let hashCode = 0;
        for (let i = 0; i < seed.length; i++) {
            hashCode = seed.charCodeAt(i) + ((hashCode << 5) - hashCode);
        }

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(hashCode + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Generate memory game
    const generateMemoryGame = () => {
        const seed = getDailySeed();
        const dailyDifficulty = getDailyDifficulty();
        const content = generateCardContent(seed, dailyDifficulty);

        // Create pairs
        const pairs = [];
        content.forEach((item, index) => {
            pairs.push({ id: index * 2, content: item, pairId: index });
            pairs.push({ id: index * 2 + 1, content: item, pairId: index });
        });

        // Shuffle cards
        const shuffledCards = shuffleArray(pairs, seed);

        return {
            cards: shuffledCards,
            difficulty: dailyDifficulty,
            seed,
            gridSize: getGridSize(dailyDifficulty)
        };
    };

    // Get grid dimensions based on difficulty
    const getGridSize = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return { rows: 3, cols: 4 };
            case 'hard':
                return { rows: 4, cols: 6 };
            default:
                return { rows: 4, cols: 4 };
        }
    };

    // Initialize game
    useEffect(() => {
        const initGame = () => {
            const savedStreak = localStorage.getItem(`memory-streak-${pillarName}`);
            const savedLastPlayed = localStorage.getItem(`memory-lastPlayed-${pillarName}`);
            const savedBestTime = localStorage.getItem(`memory-bestTime-${pillarName}`);

            if (savedStreak) setStreak(parseInt(savedStreak));
            if (savedLastPlayed) setLastPlayed(savedLastPlayed);
            if (savedBestTime) setBestTime(parseInt(savedBestTime));

            // Check if already played today
            const today = new Date().toDateString();
            if (savedLastPlayed === today) {
                // Load saved completion state
                const savedComplete = localStorage.getItem(`memory-complete-${pillarName}`);
                if (savedComplete === 'true') {
                    setIsComplete(true);
                }
            }

            const game = generateMemoryGame();
            setGameState(game);
            setDifficulty(game.difficulty);
        };

        initGame();
    }, [pillarName]);

    // Handle card flip
    const handleCardFlip = (cardIndex) => {
        if (
            flippedCards.length >= 2 ||
            flippedCards.includes(cardIndex) ||
            matchedPairs.includes(gameState.cards[cardIndex].pairId) ||
            isComplete
        ) {
            return;
        }

        if (!isTimerRunning) {
            setIsTimerRunning(true);
        }

        const newFlipped = [...flippedCards, cardIndex];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            const [first, second] = newFlipped;
            const firstCard = gameState.cards[first];
            const secondCard = gameState.cards[second];

            if (firstCard.pairId === secondCard.pairId) {
                // Match found!
                setTimeout(() => {
                    setMatchedPairs(prev => [...prev, firstCard.pairId]);
                    setFlippedCards([]);
                }, 600);
            } else {
                // No match
                setTimeout(() => {
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    // Check for completion
    useEffect(() => {
        if (gameState && matchedPairs.length === gameState.cards.length / 2 && matchedPairs.length > 0) {
            setIsComplete(true);
            setIsTimerRunning(false);

            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            let newStreak = 1;
            if (lastPlayed === yesterday) {
                newStreak = streak + 1;
            } else if (lastPlayed !== today) {
                newStreak = 1;
            } else {
                newStreak = streak;
            }

            setStreak(newStreak);
            localStorage.setItem(`memory-streak-${pillarName}`, newStreak);
            localStorage.setItem(`memory-lastPlayed-${pillarName}`, today);
            localStorage.setItem(`memory-complete-${pillarName}`, 'true');

            // Update best time
            if (!bestTime || timer < bestTime) {
                setBestTime(timer);
                localStorage.setItem(`memory-bestTime-${pillarName}`, timer);
            }
        }
    }, [matchedPairs, gameState, streak, lastPlayed, pillarName, timer, bestTime]);

    // Reset game
    const handleReset = () => {
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setTimer(0);
        setIsTimerRunning(false);
        setIsComplete(false);
        const game = generateMemoryGame();
        setGameState(game);
        setDifficulty(game.difficulty);
    };

    if (!gameState) {
        return (
            <div className="memory-game-loading">
                <div className="loading-spinner"></div>
                <p>Loading today's challenge...</p>
            </div>
        );
    }

    const { cards, gridSize } = gameState;

    return (
        <AnimatePresence>
            <motion.div
                className="memory-game-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="memory-game-modal"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="memory-game-header">
                        <div className="memory-game-header-left">
                            <h2 className="memory-game-title">Memory Matching</h2>
                            <div className="memory-difficulty-badge" data-difficulty={difficulty}>
                                <Zap size={14} />
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </div>
                        </div>
                        <button className="memory-close-btn" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="memory-stats-bar">
                        <div className="memory-stat">
                            <Flame size={18} className="memory-stat-icon flame" />
                            <div className="memory-stat-content">
                                <span className="memory-stat-label">Streak</span>
                                <span className="memory-stat-value">{streak}</span>
                            </div>
                        </div>
                        <div className="memory-stat">
                            <Calendar size={18} className="memory-stat-icon" />
                            <div className="memory-stat-content">
                                <span className="memory-stat-label">Time</span>
                                <span className="memory-stat-value">{formatTime(timer)}</span>
                            </div>
                        </div>
                        <div className="memory-stat">
                            <Trophy size={18} className="memory-stat-icon" />
                            <div className="memory-stat-content">
                                <span className="memory-stat-label">Moves</span>
                                <span className="memory-stat-value">{moves}</span>
                            </div>
                        </div>
                        {bestTime && (
                            <div className="memory-stat">
                                <Star size={18} className="memory-stat-icon" />
                                <div className="memory-stat-content">
                                    <span className="memory-stat-label">Best</span>
                                    <span className="memory-stat-value">{formatTime(bestTime)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Game Grid */}
                    <div
                        className="memory-game-grid"
                        style={{
                            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
                        }}
                    >
                        {cards.map((card, index) => {
                            const isFlipped = flippedCards.includes(index) || matchedPairs.includes(card.pairId);
                            const isMatched = matchedPairs.includes(card.pairId);

                            return (
                                <motion.div
                                    key={card.id}
                                    className={`memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                                    onClick={() => handleCardFlip(index)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="memory-card-inner">
                                        <div className="memory-card-front">
                                            <div className="memory-card-pattern"></div>
                                        </div>
                                        <div className="memory-card-back">
                                            <span className="memory-card-content">{card.content}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Completion Modal */}
                    {isComplete && (
                        <motion.div
                            className="memory-completion-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="memory-completion-card"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="memory-completion-icon">
                                    <Check size={48} />
                                </div>
                                <h3 className="memory-completion-title">Puzzle Complete!</h3>
                                <div className="memory-completion-stats">
                                    <div className="memory-completion-stat">
                                        <Trophy size={20} />
                                        <span>{moves} Moves</span>
                                    </div>
                                    <div className="memory-completion-stat">
                                        <Calendar size={20} />
                                        <span>{formatTime(timer)}</span>
                                    </div>
                                    <div className="memory-completion-stat">
                                        <Flame size={20} />
                                        <span>{streak} Day Streak</span>
                                    </div>
                                </div>
                                {timer === bestTime && (
                                    <div className="memory-new-record">
                                        <Star size={20} />
                                        <span>New Best Time!</span>
                                    </div>
                                )}
                                <button className="memory-completion-btn" onClick={onClose}>
                                    Continue
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Reset Button */}
                    <div className="memory-game-actions">
                        <button className="memory-reset-btn" onClick={handleReset}>
                            <RefreshCw size={18} />
                            New Game
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MemoryMatchingGame;
