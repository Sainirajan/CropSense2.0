import React from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Header = ({
    t,
    currentLang,
    setCurrentLang,
    isMenuOpen,
    setIsMenuOpen,
    currentPage,
    changePage
}) => (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-green-100 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-3 animate-fade-in-left">
                    <div className="w-12 h-12 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 animate-bounce-gentle">
                        <img src='/logoimg.png' className="h-12 w-12 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {t.title}
                        </h1>
                        <p className="text-sm text-green-600 font-medium">{t.tagline}</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center space-x-8 animate-fade-in-right">
                    {Object.entries(t.nav).map(([key, label], index) => (
                        <button
                            key={key}
                            onClick={() => changePage(key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 animate-fade-in ${currentPage === key
                                ? 'bg-green-100 text-green-700 shadow-md scale-105'
                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                                }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {label}
                        </button>
                    ))}
                    <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <LanguageSelector
                            currentLang={currentLang}
                            setCurrentLang={setCurrentLang}
                        />
                    </div>
                </nav>

                <button
                    className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-110"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ?
                        <X className="h-6 w-6 text-gray-600 animate-spin-once" /> :
                        <Menu className="h-6 w-6 text-gray-600" />
                    }
                </button>
            </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-white border-t border-green-100 transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
            <div className="px-4 py-4 space-y-2">
                {Object.entries(t.nav).map(([key, label], index) => (
                    <button
                        key={key}
                        onClick={() => changePage(key)}
                        className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-102 ${currentPage === key
                                ? 'bg-green-100 text-green-700 scale-102'
                                : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                            }`}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: isMenuOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none'
                        }}
                    >
                        {label}
                    </button>
                ))}
                <div className="pt-2">
                    <LanguageSelector
                        currentLang={currentLang}
                        setCurrentLang={setCurrentLang}
                    />
                </div>
            </div>
        </div>
    </header>
);

export default Header;