import React from 'react';
import { TextSection as TextSectionType } from '../types';

type Props = TextSectionType & {
  editMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
  compact?: boolean;
};

const TextSection: React.FC<Props> = ({ title, content, titleFont, titleColor, textFont, textColor, editMode, onUpdateField, showTitle = true, showUnderline = true, compact }) => {
  return (
    <section className={compact ? 'py-4' : 'py-20'}>
      <div className={compact ? '' : 'container mx-auto px-6 max-w-4xl'}>
        {(showTitle || editMode) && (
          <div className={compact ? 'text-center mb-4' : 'text-center mb-10'}>
            {showTitle && (
              <h2
                className="text-4xl font-bold"
                style={{fontFamily: titleFont || 'var(--heading-font)', color: titleColor || undefined}}
                contentEditable={!!editMode}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateField?.('title', e.currentTarget.innerText)}
              >{title}</h2>
            )}
            {showUnderline && <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>}
          </div>
        )}
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