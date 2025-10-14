import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SectionRenderer from './components/SectionRenderer';
import { AdminPanel } from './components/AdminPanel';
import DynamicStyle from './components/DynamicStyle';
import { SiteData } from './types';
import { INITIAL_SITE_DATA } from './constants';
import Login from './components/Login';

const LOCAL_STORAGE_KEY = 'dynamic-site-data';

const App: React.FC = () => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : INITIAL_SITE_DATA;
    } catch (error) {
      console.error("Error loading data from localStorage", error);
      return INITIAL_SITE_DATA;
    }
  });

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(siteData));
    } catch (error) {
      console.error("Error saving data to localStorage", error);
    }
  }, [siteData]);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const handleToggleAdminPanel = () => {
    if (isAuthenticated) {
      setIsAdminPanelOpen(!isAdminPanelOpen);
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setIsAdminPanelOpen(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminPanelOpen(false);
  };
  
  const currentPage = siteData.pages.find(p => p.path === currentPath) || siteData.pages[0];

  return (
    <>
      <DynamicStyle 
        globalStyles={siteData.globalStyles} 
        headerStyles={siteData.headerStyles}
        footerStyles={siteData.footerStyles}
      />
      <div className="relative" style={{fontFamily: 'var(--body-font)', color: 'var(--text-color)', backgroundColor: 'var(--background-color)'}}>
        <Header 
          siteIdentity={siteData.siteIdentity} 
          pages={siteData.pages} 
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
        <main>
          {currentPage?.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          )) || <div className="container mx-auto py-20 text-center">404 - Página no encontrada</div>}
        </main>
        <Footer siteIdentity={siteData.siteIdentity} />

        {/* Admin Panel Toggle */}
        <button
          onClick={handleToggleAdminPanel}
          className="fixed bottom-4 right-4 bg-[var(--primary-color)] text-white p-4 rounded-full shadow-lg z-50 hover:bg-opacity-90 transition-transform transform hover:scale-110"
          aria-label="Toggle Admin Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {showLogin && <Login onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />}

        {isAdminPanelOpen && isAuthenticated && (
          <AdminPanel 
            initialData={siteData}
            setSiteData={setSiteData}
            onClose={() => setIsAdminPanelOpen(false)} 
          />
        )}
      </div>
    </>
  );
};

export default App;