import React from 'react';
import { HtmlSection as HtmlSectionType } from '../types';

const HtmlSection: React.FC<HtmlSectionType> = ({ htmlContent }) => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </section>
  );
};

export default HtmlSection;