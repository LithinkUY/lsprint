import React, { useState, useEffect, useCallback } from 'react';
import { HeroSection } from '../types';

const HeroSlider: React.FC<HeroSection> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      const slideInterval = setInterval(goToNext, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [slides.length, goToNext]);

  if (!slides || slides.length === 0) {
    return <section className="h-screen bg-gray-200 flex items-center justify-center"><p>No slides available.</p></section>;
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.videoUrl ? (
             <video 
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={slide.videoUrl} 
                autoPlay 
                loop 
                muted 
                playsInline
             />
          ) : (
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center">
            <div className="text-white p-6 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{fontFamily: 'var(--heading-font)'}}>{slide.title}</h1>
              <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
              <a
                href={slide.button.link}
                className="bg-[var(--primary-color)] text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
              >
                {slide.button.text}
              </a>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? 'bg-[var(--primary-color)]' : 'bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
