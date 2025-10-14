import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { AdminPanel } from './components/AdminPanel';
import Login from './components/Login';
import { SiteData } from './types';
import { INITIAL_SITE_DATA } from './constants';

const LOCAL_STORAGE_KEY = 'dynamic-site-data';

const getSiteData = (): SiteData => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = storedData ? JSON.parse(storedData) : INITIAL_SITE_DATA;
    if (!parsed.pages || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
      return INITIAL_SITE_DATA;
    }
    return parsed;
  } catch {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
    return INITIAL_SITE_DATA;
  }
};

export default function AppRouter() {
  const [siteData, setSiteData] = React.useState<SiteData>(getSiteData());
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => !!localStorage.getItem('adminToken'));

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
  };
  const handleSetSiteData = (data: SiteData) => {
    setSiteData(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Login setIsAuthenticated={handleLogin} />} />
        <Route path="/admin/dashboard" element={isAuthenticated ? <AdminPanel initialData={siteData} setSiteData={handleSetSiteData} onClose={handleLogout} /> : <Navigate to="/admin/login" />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
