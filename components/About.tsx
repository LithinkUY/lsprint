import React from 'react';
import { AboutSection } from '../types';

type Props = AboutSection & { editMode?: boolean; onUpdateField?: (field: string, value: any) => void; compact?: boolean };

const About: React.FC<Props> = ({ title, subtitle, content, imageUrl, button, titleFont, titleColor, textFont, textColor, editMode, onUpdateField, showTitle = true, showUnderline = true, showSubtitle = true, compact }) => {
  return (
    <section id="about" className={compact ? 'py-6' : 'py-20'}>
      <div className={compact ? '' : 'container mx-auto px-6'}>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            {(showTitle || showSubtitle || editMode) && (
              <div className="mb-6">
                {showTitle && (
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{fontFamily: titleFont || 'var(--heading-font)', color: titleColor || undefined}}
                    contentEditable={!!editMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateField?.('title', e.currentTarget.innerText)}
                  >{title}</h2>
                )}
                {showSubtitle && (
                  <h3
                    className="text-xl text-[var(--primary-color)] font-semibold mb-4"
                    style={{fontFamily: titleFont || 'var(--heading-font)', color: titleColor || undefined}}
                    contentEditable={!!editMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateField?.('subtitle', e.currentTarget.innerText)}
                  >{subtitle}</h3>
                )}
                {showUnderline && <div className="w-24 h-1 bg-[var(--primary-color)]"></div>}
              </div>
            )}
            <p
              className="text-gray-600 mb-8 leading-relaxed"
              style={{fontFamily: textFont || 'var(--body-font)', color: textColor || undefined}}
              contentEditable={!!editMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateField?.('content', e.currentTarget.innerText)}
            >{content}</p>
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
