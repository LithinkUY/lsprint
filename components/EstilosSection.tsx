import React from 'react';
import { EstilosSection } from '../types';

interface EstilosSectionProps {
  section: EstilosSection;
  onChange?: (field: keyof EstilosSection, value: string) => void;
  editable?: boolean;
}

const fonts = [
  'Montserrat',
  'Open Sans',
  'Roboto',
  'Lato',
  'Oswald',
  'Raleway',
  'Poppins',
  'Arial',
  'Georgia',
  'Times New Roman',
];

const EstilosSectionComponent: React.FC<EstilosSectionProps> = ({ section, onChange, editable }) => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-6 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Estilos de Título y Texto</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Fuente del Título</label>
            <select
              className="w-full border rounded p-2"
              value={section.titleFont || ''}
              onChange={e => onChange && onChange('titleFont', e.target.value)}
              disabled={!editable}
            >
              <option value="">(Por defecto)</option>
              {fonts.map(font => <option key={font} value={font}>{font}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Color del Título</label>
            <input
              type="color"
              className="w-16 h-10 border rounded"
              value={section.titleColor || '#000000'}
              onChange={e => onChange && onChange('titleColor', e.target.value)}
              disabled={!editable}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Fuente del Texto</label>
            <select
              className="w-full border rounded p-2"
              value={section.textFont || ''}
              onChange={e => onChange && onChange('textFont', e.target.value)}
              disabled={!editable}
            >
              <option value="">(Por defecto)</option>
              {fonts.map(font => <option key={font} value={font}>{font}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Color del Texto</label>
            <input
              type="color"
              className="w-16 h-10 border rounded"
              value={section.textColor || '#000000'}
              onChange={e => onChange && onChange('textColor', e.target.value)}
              disabled={!editable}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstilosSectionComponent;
