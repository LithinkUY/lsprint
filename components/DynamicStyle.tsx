import React from 'react';
import { GlobalStyles, HeaderFooterStyles } from '../types';

interface DynamicStyleProps {
  globalStyles: GlobalStyles;
  headerStyles: HeaderFooterStyles;
  footerStyles: HeaderFooterStyles;
}

const DynamicStyle: React.FC<DynamicStyleProps> = ({ globalStyles, headerStyles, footerStyles }) => {
  const css = `
    :root {
      --primary-color: ${globalStyles.primaryColor};
      --background-color: ${globalStyles.backgroundColor};
      --text-color: ${globalStyles.textColor};
      --heading-font: "${globalStyles.headingFont}", sans-serif;
      --body-font: "${globalStyles.bodyFont}", sans-serif;
      
      --header-bg-color: ${headerStyles.backgroundColor};
      --header-text-color: ${headerStyles.textColor};

      --footer-bg-color: ${footerStyles.backgroundColor};
      --footer-text-color: ${footerStyles.textColor};
    }
  `;
  return <style>{css}</style>;
};

export default DynamicStyle;
