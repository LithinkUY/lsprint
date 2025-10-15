

import React from 'react';
import { GlobalStyles, HeaderFooterStyles, HeaderMenuFooterStyles, Section } from '../types';

interface DynamicStyleProps {
  globalStyles: GlobalStyles;
  headerStyles: HeaderFooterStyles;
  footerStyles: HeaderFooterStyles;
  headerMenuFooterStyles?: HeaderMenuFooterStyles;
}

function getEstilosSection(): any {
  try {
    const storedData = localStorage.getItem('dynamic-site-data');
    if (!storedData) return {};
    const parsed = JSON.parse(storedData);
    // Buscar la primera sección de tipo 'estilos' en cualquier página
    const estilosSection = parsed.pages?.flatMap((p: any) => p.sections || [])?.find((s: Section) => s.type === 'estilos');
    return estilosSection?.content || {};
  } catch {
    return {};
  }
}

const DynamicStyle: React.FC<DynamicStyleProps> = ({ globalStyles, headerStyles, footerStyles, headerMenuFooterStyles }) => {
  const estilos = getEstilosSection();
  const css = `
    :root {
      --primary-color: ${globalStyles.primaryColor};
      --background-color: ${globalStyles.backgroundColor};
      --text-color: ${globalStyles.textColor};
      --heading-font: "${estilos.titleFont || globalStyles.headingFont}", sans-serif;
      --body-font: "${estilos.textFont || globalStyles.bodyFont}", sans-serif;
      --heading-color: ${estilos.titleColor || globalStyles.textColor};
      --body-color: ${estilos.textColor || globalStyles.textColor};

      --header-bg-color: ${headerStyles.backgroundColor};
      --header-text-color: ${headerStyles.textColor};
      --header-font: ${headerMenuFooterStyles?.headerFont || 'inherit'};
      --header-title-color: ${headerMenuFooterStyles?.headerColor || 'inherit'};

      --menu-font: ${headerMenuFooterStyles?.menuFont || 'inherit'};
      --menu-color: ${headerMenuFooterStyles?.menuColor || 'inherit'};

      --footer-bg-color: ${footerStyles.backgroundColor};
      --footer-text-color: ${footerStyles.textColor};
      --footer-font: ${headerMenuFooterStyles?.footerFont || 'inherit'};
      --footer-title-color: ${headerMenuFooterStyles?.footerColor || 'inherit'};
    }
  `;
  return <style>{css}</style>;
};

export default DynamicStyle;
