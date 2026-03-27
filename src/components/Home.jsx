import React from 'react';
import { ChevronRight, Phone, MessageCircle, Globe, Users } from 'lucide-react';
import FarmerTips from './FarmerTips';

const Home = ({ t, changePage }) => (
    
    <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center">
                    <div className="animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                            {t.hero.title.split('   ').map((word, index) => (
                                <span
                                    key={index}
                                    className="inline-block"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {word}{' '}
                                </span>
                            ))}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up-delay">
                            {t.hero.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up-slow">
                        <button
                            onClick={() => changePage('recommendation')}
                            className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 animate-pulse-gentle"
                        >
                            <span>{t.hero.cta}</span>
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <a
                            href="tel:1800XXXXXX"
                            className="group bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl border-2 border-green-200 hover:border-green-300 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                        >
                            <Phone className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            <span>{t.hero.phone}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-elements">
                <div className="floating-circle floating-1"></div>
                <div className="floating-circle floating-2"></div>
                <div className="floating-circle floating-3"></div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">{t.features.title}</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="feature-card group bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-green-100 animate-slide-up">
                        <div className="feature-icon w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                            <MessageCircle className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{t.features.ai.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{t.features.ai.desc}</p>
                    </div>

                    <div className="feature-card group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-blue-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="feature-icon w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                            <Globe className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{t.features.multilang.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{t.features.multilang.desc}</p>
                    </div>

                    <div className="feature-card group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-purple-100 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="feature-icon w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{t.features.expert.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{t.features.expert.desc}</p>
                    </div>
                </div>
            </div>
        </section>

        {/* FarmerTips */}
        <section className='bg-green-50 px-10 py-5 '>
            <FarmerTips />
        </section>

        <section className="bg-green-50 py-16 px-6 md:px-20">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
                    Contact Us
                </h2>
                <p className="text-gray-600 mb-8">
                    Have any questions? Feel free to reach out to us. We’d love to hear from you!
                </p>

                <form className="bg-white shadow-lg rounded-2xl p-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Your Name"
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <textarea
                        placeholder="Your Message"
                        rows="4"
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </section>

        <footer className="bg-green-600 text-white py-8 pt-16">
            <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                {/* Left Section */}
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-semibold mb-2">CropSense</h3>
                    <p className="text-sm text-green-100">
                        A smart farming solution powered by AI & IoT.
                    </p>
                    <p className="text-sm text-green-100 mt-2">
                        © {new Date().getFullYear()}. All Rights Reserved.
                    </p>
                </div>

                {/* Center Section */}
                <div className="flex space-x-6">
                    <a href="#home" className="hover:text-yellow-300 transition">Home</a>
                    <a href="#recommendation" className="hover:text-yellow-300 transition">Recommendation</a>
                    <a href="#contact" className="hover:text-yellow-300 transition">Contact</a>
                </div>

                {/* Right Section */}
                <div className="flex space-x-4">
                    <a href="mailto:example@email.com" className="hover:text-yellow-300 transition">
                        📧 Mail
                    </a>
                    <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noreferrer" className="hover:text-yellow-300 transition">
                        🔗 LinkedIn
                    </a>
                    <a href="https://github.com/your-profile" target="_blank" rel="noreferrer" className="hover:text-yellow-300 transition">
                        💻 GitHub
                    </a>
                </div>
            </div>
        </footer>

    </div>
);

export default Home;