import React from 'react';
import { Section } from '../types';

import HeroSlider from './HeroSlider';
import Services from './Services';
import Products from './Products';
import About from './About';
import Map from './Map';
import Contact from './Contact';
import TextComponent from './TextSection';
import ImageComponent from './ImageSection';
import HtmlComponent from './HtmlSection';

interface SectionRendererProps {
  section: Section;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const sectionProps = section.content;
  
  // A wrapper is not needed as each component handles its own padding and background.
  // This simplifies logic and gives components more control.

  switch (section.type) {
    case 'hero':
      return <HeroSlider {...sectionProps} />;
    case 'services':
      return <Services {...sectionProps} />;
    case 'products':
      return <Products {...sectionProps} />;
    case 'about':
      return <About {...sectionProps} />;
    case 'map':
        return <Map {...sectionProps} />;
    case 'contact':
        return <Contact {...sectionProps} />;
    case 'text':
        return <TextComponent {...sectionProps} />;
    case 'image':
        return <ImageComponent {...sectionProps} />;
    case 'html':
        return <HtmlComponent {...sectionProps} />;
    default:
      return (
        <div className="container mx-auto py-10 px-6">
          <p>Sección desconocida: {section.type}</p>
        </div>
      );
  }
};

export default SectionRenderer;