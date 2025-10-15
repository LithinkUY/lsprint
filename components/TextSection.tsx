import React from 'react';
import { TextSection as TextSectionType } from '../types';

type Props = TextSectionType & {
  editMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
};

const TextSection: React.FC<Props> = ({ title, content, titleFont, titleColor, textFont, textColor, editMode, onUpdateField }) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10">
            <h2
              className="text-4xl font-bold"
              style={{fontFamily: titleFont || 'var(--heading-font)', color: titleColor || undefined}}
              contentEditable={!!editMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateField?.('title', e.currentTarget.innerText)}
            >{title}</h2>
            <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>
        </div>
        <div className="prose lg:prose-xl mx-auto" style={{fontFamily: textFont || 'var(--body-font)', color: textColor || undefined}}>
            <p
              contentEditable={!!editMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateField?.('content', e.currentTarget.innerText)}
            >{content}</p>
        </div>
      </div>
    </section>
  );
};

export default TextSection;