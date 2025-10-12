import React, { useState } from 'react';
import { ImageSection as ImageSectionType } from '../types';

const ImageSection: React.FC<ImageSectionType> = ({ title, images, displayMode }) => {
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
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold" style={{fontFamily: 'var(--heading-font)'}}>{title}</h2>
            <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>
        </div>
        {displayMode === 'slider' ? renderSlider() : renderGrid()}
      </div>
    </section>
  );
};

export default ImageSection;