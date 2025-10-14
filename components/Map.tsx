import React from 'react';

interface MapProps {
  title: string;
  embedUrl: string;
}

const Map: React.FC<MapProps> = ({ title, embedUrl }) => {
  if (!embedUrl) {
    return null;
  }

  return (
    <section id="map" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold" style={{fontFamily: 'var(--heading-font)'}}>{title}</h2>
          <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>
        </div>
        <div className="relative w-full h-96 rounded-lg shadow-xl overflow-hidden">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Map;
