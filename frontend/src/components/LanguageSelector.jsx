import React from 'react';
import { Globe } from 'lucide-react';

const LanguageSelector = ({ currentLang, setCurrentLang }) => (
    <div className="relative group">
        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-300 border border-green-200 transform hover:scale-105">
            <Globe className="h-4 w-4 text-green-600" />
            <span className="text-green-700 font-medium">
                {currentLang === 'en' ? 'EN' : currentLang === 'ml' ? 'മ' : 'த'}
            </span>
        </button>
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-green-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 animate-slide-down">
            <button
                onClick={() => setCurrentLang('en')}
                className="block w-full px-4 py-2 text-left hover:bg-green-50 text-gray-700 first:rounded-t-lg transition-all duration-200 hover:scale-102"
            >
                English
            </button>
            <button
                onClick={() => setCurrentLang('ml')}
                className="block w-full px-4 py-2 text-left hover:bg-green-50 text-gray-700 transition-all duration-200 hover:scale-102"
            >
                മലയാളം
            </button>
            <button
                onClick={() => setCurrentLang('ta')}
                className="block w-full px-4 py-2 text-left hover:bg-green-50 text-gray-700 last:rounded-b-lg transition-all duration-200 hover:scale-102"
            >
                தமிழ்
            </button>
        </div>
    </div>
);

export default LanguageSelector;