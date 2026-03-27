import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

// Farming tips data
const farmingTips = [
    {
        id: 1,
        title: "Monsoon Preparedness for Rice Cultivation",
        category: "Seasonal",
        date: "2 days ago",
        readTime: "5 min read",
        excerpt: "Essential steps to prepare your rice fields for the upcoming monsoon season...",
        image: "🌾",
        tags: ["Rice", "Monsoon", "Preparation"],
    },
    {
        id: 2,
        title: "Organic Pest Control Methods",
        category: "Pest Management",
        date: "1 week ago",
        readTime: "7 min read",
        excerpt: "Natural and effective ways to control pests without harmful chemicals...",
        image: "🐛",
        tags: ["Organic", "Pest Control", "Sustainable"],
    },
    {
        id: 3,
        title: "Soil Health Assessment Techniques",
        category: "Soil Management",
        date: "3 days ago",
        readTime: "6 min read",
        excerpt: "Learn how to evaluate and improve your soil health for better yields...",
        image: "🌱",
        tags: ["Soil Health", "Assessment", "Productivity"],
    },
    {
        id: 4,
        title: "Water Conservation in Agriculture",
        category: "Water Management",
        date: "5 days ago",
        readTime: "8 min read",
        excerpt: "Innovative techniques to conserve water while maintaining crop productivity...",
        image: "💧",
        tags: ["Water", "Conservation", "Sustainability"],
    },
];

const FarmingTips = () => {
    const categories = [
        { label: "All", value: "All" },
        { label: "Seasonal", value: "Seasonal" },
        { label: "Pest Management", value: "Pest Management" },
        { label: "Soil Management", value: "Soil Management" },
        { label: "Water Management", value: "Water Management" },
    ];

    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredTips =
        selectedCategory === "All"
            ? farmingTips
            : farmingTips.filter((tip) => tip.category === selectedCategory);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                    <Star className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Latest Farming Tips</h2>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                    <motion.button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${selectedCategory === category.value
                                ? "bg-green-500 text-white shadow-md"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                    >
                        {category.label}
                    </motion.button>
                ))}
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTips.map((tip, index) => (
                    <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    >
                        <div className="flex items-start space-x-4 mb-4">
                            <div className="text-3xl">{tip.image}</div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                                        {tip.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{tip.readTime}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                    {tip.title}
                                </h3>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{tip.excerpt}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                            {tip.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">{tip.date}</p>
                            </div>

                            <motion.div className="flex items-center text-green-600 group-hover:translate-x-2 transition-transform duration-200">
                                <span className="text-sm font-medium mr-1">Read more</span>
                                <ArrowRight className="h-4 w-4" />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default FarmingTips;
