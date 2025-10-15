import React from 'react';
import { SiteData } from '../types';

interface FooterProps {
  siteIdentity: SiteData['siteIdentity'];
  headerMenuFooterStyles?: import('../types').HeaderMenuFooterStyles;
}

const Footer: React.FC<FooterProps> = ({ siteIdentity, headerMenuFooterStyles }) => {
  return (
    <footer style={{ backgroundColor: 'var(--footer-bg-color)', color: 'var(--footer-text-color)', fontFamily: headerMenuFooterStyles?.footerFont || undefined }}>
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: headerMenuFooterStyles?.footerColor || undefined, fontFamily: headerMenuFooterStyles?.footerFont || undefined }}>{siteIdentity.logoTextPart1}<span className="text-gray-400">{siteIdentity.logoTextPart2}</span></h3>
            <p className="text-gray-400">Soluciones gráficas integrales para tu negocio. Calidad y compromiso en cada trabajo.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-white">Servicios</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-white">Productos</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white">Nosotros</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Términos y Condiciones</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Política de Privacidad</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM12 14a2 2 0 110-4 2 2 0 010 4zm6.406-7.125a.75.75 0 000-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {siteIdentity.logoTextPart1}{siteIdentity.logoTextPart2}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
