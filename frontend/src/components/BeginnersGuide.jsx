import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Sprout,
    Droplets,
    Sun,
    Bug,
    TrendingUp,
    Users,
    Shield,
    Lightbulb,
    CheckCircle,
    ArrowRight,
    Play,
    Pause,
    RotateCcw,
    Target,
    DollarSign,
    Calendar,
    MapPin,
    Thermometer,
    Zap,
    Award,
    Clock,
    AlertTriangle,
    Leaf
} from 'lucide-react';

const BeginnersGuide = () => {
    const [activeSection, setActiveSection] = useState('basics');
    const [completedSteps, setCompletedSteps] = useState([])
    const [selectedCrop, setSelectedCrop] = useState(0);
    const [activeProblem, setActiveProblem] = useState(0);

    const sections = [
        { id: 'basics', title: 'Agriculture Basics', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
        { id: 'crops', title: 'Crop Selection', icon: Sprout, color: 'from-blue-500 to-cyan-500' },
        { id: 'soil', title: 'Soil Management', icon: Droplets, color: 'from-orange-500 to-red-500' },
        { id: 'problems', title: 'Problem Solving', icon: Shield, color: 'from-purple-500 to-pink-500' },
        { id: 'resources', title: 'Essential Resources', icon: Target, color: 'from-indigo-500 to-blue-500' },
        { id: 'business', title: 'Farm Business', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
    ];

    const basicsConcepts = [
        {
            title: 'What is Agriculture?',
            description: 'Agriculture is the practice of cultivating plants and livestock for food, fiber, and other products.',
            icon: '🌾',
            details: [
                'Primary source of food production worldwide',
                'Includes crop cultivation and animal husbandry',
                'Foundation of human civilization and economy',
                'Sustainable practices ensure long-term productivity'
            ]
        },
        {
            title: 'Types of Farming',
            description: 'Different approaches to agricultural production based on scale, methods, and objectives.',
            icon: '🚜',
            details: [
                'Subsistence farming - for family consumption',
                'Commercial farming - for market sales',
                'Organic farming - without synthetic chemicals',
                'Intensive vs Extensive farming methods'
            ]
        },
        {
            title: 'Agricultural Seasons',
            description: 'Understanding seasonal patterns for optimal crop planning and management.',
            icon: '📅',
            details: [
                'Kharif (Monsoon): June to October',
                'Rabi (Winter): November to April',
                'Summer crops: April to June',
                'Year-round greenhouse cultivation'
            ]
        }
    ];

    const cropGuide = [
        {
            name: 'Rice',
            difficulty: 'Beginner',
            season: 'Kharif',
            waterNeed: 'High',
            soilType: 'Clay/Loamy',
            duration: '120-150 days',
            investment: '₹25,000-35,000/acre',
            returns: '₹45,000-65,000/acre',
            tips: [
                'Requires consistent water supply',
                'Plant during monsoon season',
                'Regular weeding is essential',
                'Monitor for pest attacks'
            ],
            icon: '🌾'
        },
        {
            name: 'Wheat',
            difficulty: 'Beginner',
            season: 'Rabi',
            waterNeed: 'Medium',
            soilType: 'Loamy',
            duration: '120-130 days',
            investment: '₹20,000-30,000/acre',
            returns: '₹40,000-55,000/acre',
            tips: [
                'Sow after monsoon ends',
                'Requires well-drained soil',
                'Apply fertilizers in stages',
                'Harvest when grains are golden'
            ],
            icon: '🌾'
        },
        {
            name: 'Tomato',
            difficulty: 'Intermediate',
            season: 'Year-round',
            waterNeed: 'Medium',
            soilType: 'Well-drained',
            duration: '90-120 days',
            investment: '₹40,000-60,000/acre',
            returns: '₹80,000-150,000/acre',
            tips: [
                'Requires support structures',
                'Regular pruning needed',
                'Protect from diseases',
                'Harvest when fruits turn red'
            ],
            icon: '🍅'
        },
        {
            name: 'Onion',
            difficulty: 'Intermediate',
            season: 'Rabi',
            waterNeed: 'Low-Medium',
            soilType: 'Sandy Loam',
            duration: '120-150 days',
            investment: '₹30,000-45,000/acre',
            returns: '₹60,000-100,000/acre',
            tips: [
                'Requires well-drained soil',
                'Plant in raised beds',
                'Avoid overwatering',
                'Cure properly after harvest'
            ],
            icon: '🧅'
        }
    ];

    const soilTypes = [
        {
            type: 'Clay Soil',
            characteristics: 'Heavy, retains water well, rich in nutrients',
            bestFor: 'Rice, wheat, sugarcane',
            challenges: 'Poor drainage, hard when dry',
            improvements: 'Add organic matter, create drainage',
            color: 'bg-amber-100 border-amber-300',
            icon: '🟤'
        },
        {
            type: 'Sandy Soil',
            characteristics: 'Light, drains quickly, easy to work',
            bestFor: 'Root vegetables, melons, herbs',
            challenges: 'Low water retention, nutrient loss',
            improvements: 'Add compost, mulching',
            color: 'bg-yellow-100 border-yellow-300',
            icon: '🟡'
        },
        {
            type: 'Loamy Soil',
            characteristics: 'Balanced, ideal for most crops',
            bestFor: 'Most vegetables, fruits, grains',
            challenges: 'Requires maintenance',
            improvements: 'Regular organic matter addition',
            color: 'bg-green-100 border-green-300',
            icon: '🟢'
        },
        {
            type: 'Silty Soil',
            characteristics: 'Fertile, retains nutrients well',
            bestFor: 'Corn, soybeans, vegetables',
            challenges: 'Can become compacted',
            improvements: 'Avoid working when wet',
            color: 'bg-blue-100 border-blue-300',
            icon: '🔵'
        }
    ];

    const commonProblems = [
        {
            problem: 'Pest Attacks',
            symptoms: 'Damaged leaves, holes in fruits, stunted growth',
            solutions: [
                'Use neem oil spray',
                'Introduce beneficial insects',
                'Crop rotation practices',
                'Regular field monitoring'
            ],
            prevention: 'Maintain field hygiene, use resistant varieties',
            icon: '🐛',
            severity: 'High',
            color: 'bg-red-100 border-red-300'
        },
        {
            problem: 'Plant Diseases',
            symptoms: 'Yellow leaves, spots, wilting, fungal growth',
            solutions: [
                'Apply fungicides as needed',
                'Remove infected plants',
                'Improve air circulation',
                'Use disease-resistant seeds'
            ],
            prevention: 'Proper spacing, avoid overwatering',
            icon: '🦠',
            severity: 'High',
            color: 'bg-orange-100 border-orange-300'
        },
        {
            problem: 'Water Stress',
            symptoms: 'Wilting, leaf drop, poor fruit development',
            solutions: [
                'Install drip irrigation',
                'Mulch around plants',
                'Water early morning/evening',
                'Check soil moisture regularly'
            ],
            prevention: 'Plan irrigation schedule, rainwater harvesting',
            icon: '💧',
            severity: 'Medium',
            color: 'bg-blue-100 border-blue-300'
        },
        {
            problem: 'Nutrient Deficiency',
            symptoms: 'Yellow leaves, poor growth, low yield',
            solutions: [
                'Soil testing and analysis',
                'Apply balanced fertilizers',
                'Use organic compost',
                'Foliar feeding for quick results'
            ],
            prevention: 'Regular soil testing, crop rotation',
            icon: '🧪',
            severity: 'Medium',
            color: 'bg-yellow-100 border-yellow-300'
        }
    ];

    const essentialResources = [
        {
            category: 'Basic Tools',
            items: [
                { name: 'Spade/Shovel', cost: '₹200-500', importance: 'Essential' },
                { name: 'Hoe', cost: '₹150-300', importance: 'Essential' },
                { name: 'Watering Can', cost: '₹100-250', importance: 'Essential' },
                { name: 'Pruning Shears', cost: '₹200-400', importance: 'Important' }
            ],
            icon: '🛠️',
            totalCost: '₹650-1,450',
            color: 'from-gray-500 to-gray-600'
        },
        {
            category: 'Seeds & Inputs',
            items: [
                { name: 'Quality Seeds', cost: '₹500-2,000/acre', importance: 'Essential' },
                { name: 'Organic Fertilizer', cost: '₹1,000-3,000/acre', importance: 'Essential' },
                { name: 'Pesticides', cost: '₹500-1,500/acre', importance: 'Important' },
                { name: 'Mulch Material', cost: '₹300-800/acre', importance: 'Beneficial' }
            ],
            icon: '🌱',
            totalCost: '₹2,300-7,300/acre',
            color: 'from-green-500 to-green-600'
        },
        {
            category: 'Infrastructure',
            items: [
                { name: 'Water Source', cost: '₹5,000-50,000', importance: 'Essential' },
                { name: 'Storage Shed', cost: '₹10,000-30,000', importance: 'Important' },
                { name: 'Fencing', cost: '₹2,000-8,000/acre', importance: 'Important' },
                { name: 'Irrigation System', cost: '₹15,000-40,000/acre', importance: 'Beneficial' }
            ],
            icon: '🏗️',
            totalCost: '₹32,000-1,28,000',
            color: 'from-blue-500 to-blue-600'
        }
    ];

    const businessTips = [
        {
            title: 'Market Research',
            description: 'Understand demand, pricing, and competition in your area',
            steps: [
                'Visit local markets and talk to vendors',
                'Research online price trends',
                'Connect with other farmers',
                'Identify high-demand crops'
            ],
            icon: '📊'
        },
        {
            title: 'Financial Planning',
            description: 'Plan your investments, expenses, and expected returns',
            steps: [
                'Calculate initial investment needs',
                'Plan for seasonal cash flows',
                'Keep detailed expense records',
                'Set aside emergency funds'
            ],
            icon: '💰'
        },
        {
            title: 'Risk Management',
            description: 'Protect your farm from various risks and uncertainties',
            steps: [
                'Get crop insurance coverage',
                'Diversify your crop portfolio',
                'Build relationships with buyers',
                'Stay updated on weather forecasts'
            ],
            icon: '🛡️'
        }
    ];

    const toggleStep = stepId => {
        setCompletedSteps(prev =>
            prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
        )
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'basics':
                return (
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Agriculture Fundamentals</h2>
                            <p className="text-lg text-gray-600">Master the basics before diving into farming</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {basicsConcepts.map((concept, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="text-4xl mb-4 text-center">{concept.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{concept.title}</h3>
                                    <p className="text-gray-600 mb-4">{concept.description}</p>

                                    <div className="space-y-2">
                                        {concept.details.map((detail, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                                                className="flex items-center space-x-2"
                                            >
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{detail}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );

            case 'crops':
                return (
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beginner-Friendly Crops</h2>
                            <p className="text-lg text-gray-600">Start with these crops to build your farming experience</p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Crop Selection */}
                            <div className="space-y-4">
                                {cropGuide.map((crop, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setSelectedCrop(index)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedCrop === index
                                                ? 'border-green-500 bg-green-50 shadow-lg'
                                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="text-3xl">{crop.icon}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-bold text-gray-900">{crop.name}</h3>
                                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${crop.difficulty === 'Beginner'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {crop.difficulty}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                    <span>🌧️ {crop.waterNeed}</span>
                                                    <span>📅 {crop.season}</span>
                                                    <span>⏱️ {crop.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Crop Details */}
                            <motion.div
                                key={selectedCrop}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                            >
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4">{cropGuide[selectedCrop].icon}</div>
                                    <h3 className="text-2xl font-bold text-gray-900">{cropGuide[selectedCrop].name}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-blue-600 font-medium">Investment</p>
                                        <p className="text-lg font-bold text-blue-800">{cropGuide[selectedCrop].investment}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-sm text-green-600 font-medium">Expected Returns</p>
                                        <p className="text-lg font-bold text-green-800">{cropGuide[selectedCrop].returns}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Growing Tips:</h4>
                                        <div className="space-y-2">
                                            {cropGuide[selectedCrop].tips.map((tip, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{tip}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                );

            case 'soil':
                return (
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Soil Management Guide</h2>
                            <p className="text-lg text-gray-600">Understanding and improving your soil for better yields</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {soilTypes.map((soil, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${soil.color} rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="text-3xl">{soil.icon}</div>
                                        <h3 className="text-xl font-bold text-gray-900">{soil.type}</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Characteristics:</h4>
                                            <p className="text-sm text-gray-700">{soil.characteristics}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Best For:</h4>
                                            <p className="text-sm text-gray-700">{soil.bestFor}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Challenges:</h4>
                                            <p className="text-sm text-gray-700">{soil.challenges}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Improvements:</h4>
                                            <p className="text-sm text-gray-700">{soil.improvements}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Soil Testing Guide */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white"
                        >
                            <h3 className="text-2xl font-bold mb-4">Soil Testing Importance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="bg-white/20 p-4 rounded-xl mb-3">
                                        <Zap className="h-8 w-8 mx-auto" />
                                    </div>
                                    <h4 className="font-semibold mb-2">pH Level</h4>
                                    <p className="text-sm text-green-100">Determines nutrient availability</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white/20 p-4 rounded-xl mb-3">
                                        <Leaf className="h-8 w-8 mx-auto" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Nutrients</h4>
                                    <p className="text-sm text-green-100">NPK and micronutrient levels</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white/20 p-4 rounded-xl mb-3">
                                        <Droplets className="h-8 w-8 mx-auto" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Organic Matter</h4>
                                    <p className="text-sm text-green-100">Soil health indicator</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                );

            case 'problems':
                return (
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Farming Problems</h2>
                            <p className="text-lg text-gray-600">Learn to identify and solve agricultural challenges</p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Problem List */}
                            <div className="space-y-4">
                                {commonProblems.map((problem, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setActiveProblem(index)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${activeProblem === index
                                                ? 'border-red-500 bg-red-50 shadow-lg'
                                                : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="text-3xl">{problem.icon}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-bold text-gray-900">{problem.problem}</h3>
                                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${problem.severity === 'High'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {problem.severity}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{problem.symptoms}</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Problem Details */}
                            <motion.div
                                key={activeProblem}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`${commonProblems[activeProblem].color} rounded-2xl p-6 border-2 shadow-lg`}
                            >
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4">{commonProblems[activeProblem].icon}</div>
                                    <h3 className="text-2xl font-bold text-gray-900">{commonProblems[activeProblem].problem}</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                                            Symptoms:
                                        </h4>
                                        <p className="text-gray-700 bg-white/50 p-3 rounded-lg">{commonProblems[activeProblem].symptoms}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Shield className="h-5 w-5 mr-2 text-green-500" />
                                            Solutions:
                                        </h4>
                                        <div className="space-y-2">
                                            {commonProblems[activeProblem].solutions.map((solution, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-center space-x-2 bg-white/50 p-2 rounded-lg"
                                                >
                                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{solution}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                                            Prevention:
                                        </h4>
                                        <p className="text-gray-700 bg-white/50 p-3 rounded-lg">{commonProblems[activeProblem].prevention}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                );

            case 'resources':
                return (
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Essential Resources</h2>
                            <p className="text-lg text-gray-600">Everything you need to start your farming journey</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {essentialResources.map((resource, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className={`bg-gradient-to-r ${resource.color} p-4 rounded-xl mb-4 text-center`}>
                                        <div className="text-4xl mb-2">{resource.icon}</div>
                                        <h3 className="text-xl font-bold text-white">{resource.category}</h3>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {resource.items.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-600">{item.cost}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.importance === 'Essential'
                                                        ? 'bg-red-100 text-red-700'
                                                        : item.importance === 'Important'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {item.importance}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-900">Total Cost:</span>
                                            <span className="font-bold text-green-600">{resource.totalCost}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );

            case 'business':
                return (
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Farm Business Basics</h2>
                            <p className="text-lg text-gray-600">Turn your farming into a profitable business</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {businessTips.map((tip, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="text-center mb-6">
                                        <div className="text-4xl mb-4">{tip.icon}</div>
                                        <h3 className="text-xl font-bold text-gray-900">{tip.title}</h3>
                                        <p className="text-gray-600 mt-2">{tip.description}</p>
                                    </div>

                                    <div className="space-y-3">
                                        {tip.steps.map((step, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                                                className="flex items-start space-x-3"
                                            >
                                                <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                                                    <CheckCircle className="h-3 w-3" />
                                                </div>
                                                <span className="text-sm text-gray-700">{step}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Success Metrics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white"
                        >
                            <h3 className="text-2xl font-bold mb-6 text-center">Key Success Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="bg-white/20 p-4 rounded-xl mb-3">
                                        <TrendingUp className="h-8 w-8 mx-auto" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Yield per Acre</h4>
                                    <p className="text-sm text-purple-100">Measure productivity</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white/20 p-4 rounded-xl mb-3">
                                        <DollarSign className="h-8 w-8 mx-auto" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Profit Margin</h4>
                                    <p className="text-sm text-purple-100">Track profitability</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white/20 p-4 rounded-xl mb-3">
                                        <Clock className="h-8 w-8 mx-auto" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Time to Market</h4>
                                    <p className="text-sm text-purple-100">Optimize timing</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white/20 p-4 rounded-xl mb-3">
                                        <Award className="h-8 w-8 mx-auto" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Quality Grade</h4>
                                    <p className="text-sm text-purple-100">Ensure standards</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Beginner's Guide to Agriculture
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Start your agricultural journey with comprehensive guidance on crops, soil, problem-solving, and business planning
                    </p>
                </motion.div>

                {/* Section Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {sections.map((section, index) => (
                            <motion.button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`p-4 rounded-xl transition-all duration-300 text-center ${activeSection === section.id
                                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <section.icon className="h-6 w-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">{section.title}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Content Area */}
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                    {renderContent()}
                </motion.div>

                {/* Progress Tracker
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Your Learning Progress</h3>
                            <p className="text-green-100">Complete sections to track your agricultural knowledge</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{Math.round((completedSteps.length / 20) * 100)}%</div>
                            <div className="text-green-200 text-sm">Completed</div>
                        </div>
                    </div>

                    <div className="mt-4 bg-white/20 rounded-full h-2">
                        <motion.div
                            className="bg-white rounded-full h-2"
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedSteps.length / 20) * 100}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                </motion.div> */}
            </div>
        </div>
    );
};

export default BeginnersGuide;