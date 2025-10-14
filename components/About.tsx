import React from 'react';
import { AboutSection } from '../types';

const About: React.FC<AboutSection> = ({ title, subtitle, content, imageUrl, button }) => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-2" style={{fontFamily: 'var(--heading-font)'}}>{title}</h2>
            <h3 className="text-xl text-[var(--primary-color)] font-semibold mb-4" style={{fontFamily: 'var(--heading-font)'}}>{subtitle}</h3>
            <div className="w-24 h-1 bg-[var(--primary-color)] mb-6"></div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {content}
            </p>
            <a href={button.link} className="bg-[var(--primary-color)] text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
              {button.text}
            </a>
          </div>
          <div className="lg:w-1/2">
            <img src={imageUrl} alt="Sobre Nosotros" className="rounded-lg shadow-2xl w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
