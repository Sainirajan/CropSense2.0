import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Recommendation from './components/Recommendation';
import Weather from './components/Weather';
import Advisory from './components/Advisory';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';
import { translations } from './data/translations';
import BeginnersGuide from './components/BeginnersGuide';
import './App.css';

const CropSenseApp = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[currentLang];

  const changePage = (page) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsMenuOpen(false);
      setIsLoading(false);
    }, 300);
  };

  const renderPage = () => {
    const pageProps = { t, changePage };

    switch (currentPage) {
      case 'home': return <Home {...pageProps} />;
      case 'recommendation': return <Recommendation {...pageProps} />;
      case 'weather': return <Weather {...pageProps} />;
      case 'advisory': return <Advisory {...pageProps} />;
      case 'beginnersGuide': return <BeginnersGuide {...pageProps} />;
      case 'contact': return <Contact {...pageProps} />;
      default: return <Home {...pageProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {isLoading && <LoadingScreen t={t} />}
      <Header
        t={t}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        currentPage={currentPage}
        changePage={changePage}
      />
      <main className="page-transition">
        {renderPage()}
      </main>
    </div>
  );
};

export default CropSenseApp;