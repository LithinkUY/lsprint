import React from 'react';
import { HtmlSection as HtmlSectionType } from '../types';

type Props = HtmlSectionType & { editMode?: boolean; onUpdateField?: (field: string, value: any) => void };

const HtmlSection: React.FC<Props> = ({ htmlContent, editMode, onUpdateField, textFont, textColor }) => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        {!editMode ? (
          <div style={{ fontFamily: textFont || 'var(--body-font)', color: textColor || undefined }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : (
          <div
            className="border rounded p-3"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateField?.('htmlContent', e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{ fontFamily: textFont || 'var(--body-font)', color: textColor || undefined }}
          />
        )}
      </div>
    </section>
  );
};

export default HtmlSection;