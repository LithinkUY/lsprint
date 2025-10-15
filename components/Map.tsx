import React from 'react';

interface MapProps {
  title: string;
  embedUrl: string;
  titleFont?: string;
  titleColor?: string;
  editMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

const Map: React.FC<MapProps> = ({ title, embedUrl, titleFont, titleColor, editMode, onUpdateField }) => {

  return (
    <section id="map" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-bold"
            style={{fontFamily: titleFont || 'var(--heading-font)', color: titleColor || undefined}}
            contentEditable={!!editMode}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateField?.('title', e.currentTarget.innerText)}
          >
            {title}
          </h2>
          <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>
        </div>
        <div className="relative w-full h-96 rounded-lg shadow-xl overflow-hidden">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
              {editMode ? 'Agrega la URL de Google Maps en el panel o aquí en Editar.' : 'Mapa no configurado.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Map;
