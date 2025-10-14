

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SectionRenderer from './components/SectionRenderer';
import { SiteData } from './types';
import { INITIAL_SITE_DATA } from './constants';
import DynamicStyle from './components/DynamicStyle';

const LOCAL_STORAGE_KEY = 'dynamic-site-data';

const App: React.FC = () => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = storedData ? JSON.parse(storedData) : INITIAL_SITE_DATA;
      // Si no hay páginas, forzar datos válidos
      if (!parsed.pages || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
        return INITIAL_SITE_DATA;
      }
      return parsed;
    } catch (error) {
      console.error("Error loading data from localStorage", error);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
      return INITIAL_SITE_DATA;
    }
  });


  const [currentPath, setCurrentPath] = useState(window.location.pathname);


  // Admin panel y login ahora son páginas independientes (ruteadas)

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


  // Admin panel y login ahora son páginas independientes (ruteadas)
  

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
        />
        <main>
          {currentPage?.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          )) || <div className="container mx-auto py-20 text-center">404 - Página no encontrada</div>}
        </main>
        <Footer siteIdentity={siteData.siteIdentity} /> 
      </div>
    </>
  );
};

export default App;