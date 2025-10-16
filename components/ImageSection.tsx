import React, { useState } from 'react';
import { ImageSection as ImageSectionType } from '../types';

type Props = ImageSectionType & { editMode?: boolean; onUpdateField?: (field: string, value: any) => void; titleFont?: string; titleColor?: string; textFont?: string; textColor?: string; compact?: boolean };

const ImageSection: React.FC<Props> = ({ title, images, displayMode, editMode, onUpdateField, titleFont, titleColor, showTitle = true, showUnderline = true, compact }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };


  const renderSlider = () => (
    <div className="relative w-full max-w-4xl mx-auto">
      {images.length > 0 && (
        <div className="relative h-96 overflow-hidden rounded-lg">
            <img src={images[currentIndex].url} alt={`Slide ${currentIndex}`} className="w-full h-full object-cover" />
        </div>
      )}
      {images.length > 1 && (
        <>
            <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white">&lt;</button>
            <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white">&gt;</button>
        </>
      )}
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(image => (
            <div key={image.id} className="overflow-hidden rounded-lg shadow-md">
                <img src={image.url} alt="Gallery image" className="w-full h-full object-cover aspect-square" />
            </div>
        ))}
    </div>
  );


  return (
    <section className={compact ? 'py-6' : 'py-20'}>
      <div className={compact ? '' : 'container mx-auto px-6'}>
        {(showTitle || editMode) && (
          <div className={compact ? 'text-center mb-6' : 'text-center mb-12'}>
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
        {displayMode === 'slider' ? renderSlider() : renderGrid()}
      </div>
    </section>
  );
};

export default ImageSection;