import React, { useState } from 'react';
import { SiteData, Page } from '../types';

interface HeaderProps {
  siteIdentity: SiteData['siteIdentity'];
  pages: Page[];
  isAuthenticated?: boolean;
  onLogout?: () => void;
  headerMenuFooterStyles?: import('../types').HeaderMenuFooterStyles;
}

const Header: React.FC<HeaderProps> = ({ siteIdentity, pages, isAuthenticated, onLogout, headerMenuFooterStyles }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Custom navigation handler for client-side routing
  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
    setIsMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: 'var(--header-bg-color)', color: 'var(--header-text-color)', fontFamily: headerMenuFooterStyles?.headerFont || undefined }}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" onClick={(e) => navigate(e, '/')} className="flex items-center">
          <div className="text-2xl font-bold" style={{ color: headerMenuFooterStyles?.headerColor || undefined, fontFamily: headerMenuFooterStyles?.headerFont || undefined }}>
            {siteIdentity.logoImageUrl ? (
              <img src={siteIdentity.logoImageUrl} alt={`${siteIdentity.logoTextPart1}${siteIdentity.logoTextPart2}`} className="h-10 w-auto" />
            ) : (
              <>
                {siteIdentity.logoTextPart1}
                <span style={{ color: 'var(--primary-color)' }}>{siteIdentity.logoTextPart2}</span>
              </>
            )}
          </div>
        </a>
        <nav className="hidden md:flex items-center space-x-6" style={{ fontFamily: headerMenuFooterStyles?.menuFont || undefined, color: headerMenuFooterStyles?.menuColor || undefined }}>
          {pages.map(page => (
            <a key={page.id} href={page.path} onClick={(e) => navigate(e, page.path)} className="hover:text-[var(--primary-color)] transition-colors duration-300 capitalize">{page.name}</a>
          ))}
          {isAuthenticated && onLogout && (
            <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
              Salir
            </button>
          )}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden" style={{ backgroundColor: 'var(--header-bg-color)', color: 'var(--header-text-color)', fontFamily: headerMenuFooterStyles?.menuFont || undefined }}>
          {pages.map(page => (
              <a key={page.id} href={page.path} onClick={(e) => navigate(e, page.path)} className="block py-2 px-4 text-sm hover:bg-[var(--primary-color)] hover:text-white capitalize">{page.name}</a>
          ))}
          {isAuthenticated && onLogout && (
            <button onClick={onLogout} className="w-full text-left bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-colors">
              Salir
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;