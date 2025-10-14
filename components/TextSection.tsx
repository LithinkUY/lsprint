import React from 'react';
import { TextSection as TextSectionType } from '../types';

const TextSection: React.FC<TextSectionType> = ({ title, content }) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-bold" style={{fontFamily: 'var(--heading-font)'}}>{title}</h2>
            <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>
        </div>
        <div className="prose lg:prose-xl mx-auto" style={{color: 'var(--text-color)'}}>
            <p>{content}</p>
        </div>
      </div>
    </section>
  );
};

export default TextSection;