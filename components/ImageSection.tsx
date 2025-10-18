import React, { useEffect, useMemo, useState } from 'react';
import { ImageSection as ImageSectionType } from '../types';

type Props = ImageSectionType & { editMode?: boolean; onUpdateField?: (field: string, value: any) => void; titleFont?: string; titleColor?: string; textFont?: string; textColor?: string; compact?: boolean };

const ImageSection: React.FC<Props> = ({ title, images, displayMode, sliderColumns = 3, sliderAutoplay = false, sliderSpeedMs = 5000, sliderStep = '1', sliderPauseOnHover = true, sliderResponsive = true, editMode, onUpdateField, titleFont, titleColor, showTitle = true, showUnderline = true, compact }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const stepSize = sliderStep === 'columns' ? Math.max(1, Math.min(images.length, sliderColumns)) : 1;
  const goToNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + stepSize) % images.length);
  };

  const goToPrevious = () => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - stepSize + images.length) % images.length);
  };

  // Autoplay con pausa opcional en hover
  useEffect(() => {
    if (displayMode !== 'slider' || !sliderAutoplay || images.length <= 1) return;
    if (sliderPauseOnHover && isHovered) return; // pausar mientras se mantiene hover
    const interval = setInterval(() => {
      goToNext();
    }, Math.max(1000, sliderSpeedMs || 5000));
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayMode, sliderAutoplay, sliderSpeedMs, images.length, stepSize, isHovered, sliderPauseOnHover]);


  // Columnas efectivas: si responsive, reducir según ancho
  const effectiveCols = useMemo(() => {
    const base = Math.max(1, Math.min(6, Math.floor(sliderColumns || 1)));
    if (!sliderResponsive) return base;
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    if (w < 640) return Math.min(1, base);
    if (w < 768) return Math.min(2, base);
    if (w < 1024) return Math.min(3, base);
    return base;
  }, [sliderColumns, sliderResponsive]);
  const visibleItems = useMemo(() => {
    if (images.length === 0) return [] as typeof images;
    const items: typeof images = [] as any;
    for (let i = 0; i < Math.min(effectiveCols, images.length); i++) {
      items.push(images[(currentIndex + i) % images.length]);
    }
    return items;
  }, [images, currentIndex, effectiveCols]);

  const renderSlider = () => (
    <div className="relative w-full max-w-6xl mx-auto" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {images.length > 0 && (
        <div className="relative overflow-hidden rounded-lg">
          <div className="grid gap-4"
               style={{
                 gridTemplateColumns: `repeat(${effectiveCols}, minmax(0, 1fr))`,
               }}
          >
            {visibleItems.map((img, idx) => (
              <div key={img.id + '-' + idx} className="h-72 md:h-80 lg:h-96 overflow-hidden rounded-lg">
                <img src={img.url} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
      {images.length > effectiveCols && (
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