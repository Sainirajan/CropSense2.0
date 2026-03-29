import React from 'react';

const LoadingScreen = ({ t }) => (
    <div className="fixed inset-0 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center z-50 animate-fade-in">
        <div className="text-center text-white">
            <div className="loading-spinner mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold animate-pulse">{t.title}</h3>
        </div>
    </div>
);

export default LoadingScreen;