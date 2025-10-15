import React from 'react';
import { Section, ContactInfo, SectionType } from '../types';

import HeroSlider from './HeroSlider';
import Services from './Services';
import Products from './Products';
import About from './About';
import Map from './Map';
import ContactForm from './ContactForm';
import TextComponent from './TextSection';
import ImageComponent from './ImageSection';
import HtmlComponent from './HtmlSection';
import EstilosSection from './EstilosSection';

interface SectionRendererProps {
  section: Section;
  contactInfo?: ContactInfo;
  editMode?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onUpdateField?: (field: string, value: any) => void;
  onAddBefore?: (type: SectionType) => void;
  onAddAfter?: (type: SectionType) => void;
  onDuplicate?: () => void;
  onUpdateContactInfo?: (field: keyof ContactInfo, value: string) => void;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, contactInfo, editMode, onMoveUp, onMoveDown, onDelete, onUpdateField, onAddBefore, onAddAfter, onDuplicate, onUpdateContactInfo }) => {
  const sectionProps = section.content;
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAddBefore, setOpenAddBefore] = React.useState(false);
  const [openAddAfter, setOpenAddAfter] = React.useState(false);
  const TYPES: SectionType[] = ['hero','services','products','about','map','contact','text','image','html'];
  
  const sanitizeHex = (val: string) => {
    if (!val) return '';
    let v = val.trim();
    if (v[0] !== '#') v = `#${v}`;
    if (v.length === 4 || v.length === 7) return v;
    // try to coerce 3 or 6 chars
    const hex = v.replace(/[^#0-9a-fA-F]/g, '');
    if (hex.length === 4 || hex.length === 7) return hex;
    // invalid: return original so user sees it, but browser may ignore
    return v;
  };
  
  // A wrapper is not needed as each component handles its own padding and background.
  // This simplifies logic and gives components more control.

  const inner = (() => {
    switch (section.type) {
    case 'hero':
      return <HeroSlider {...sectionProps} />;
    case 'services':
      return <Services {...sectionProps} titleFont={sectionProps.titleFont} titleColor={sectionProps.titleColor} textFont={sectionProps.textFont} textColor={sectionProps.textColor} editMode={editMode} onUpdateField={onUpdateField} />;
    case 'products':
      return <Products {...sectionProps} titleFont={sectionProps.titleFont} titleColor={sectionProps.titleColor} textFont={sectionProps.textFont} textColor={sectionProps.textColor} editMode={editMode} onUpdateField={onUpdateField} />;
    case 'about':
      return <About {...sectionProps} titleFont={sectionProps.titleFont} titleColor={sectionProps.titleColor} textFont={sectionProps.textFont} textColor={sectionProps.textColor} editMode={editMode} onUpdateField={onUpdateField} />;
  case 'map':
    return <Map {...sectionProps} editMode={editMode} onUpdateField={onUpdateField} />;
  case 'contact':
    return <ContactForm section={sectionProps as any} contactInfo={contactInfo} editMode={editMode} onUpdateField={onUpdateField} onUpdateContactInfo={onUpdateContactInfo} />;
  case 'text':
    return <TextComponent {...sectionProps} titleFont={sectionProps.titleFont} titleColor={sectionProps.titleColor} textFont={sectionProps.textFont} textColor={sectionProps.textColor} editMode={editMode} onUpdateField={onUpdateField} />;
    case 'image':
        return <ImageComponent {...sectionProps} />;
    case 'html':
        return <HtmlComponent {...sectionProps} />;
    case 'estilos':
        return <EstilosSection section={sectionProps} editable={false} />;
    default:
      return (
        <div className="container mx-auto py-10 px-6">
          <p>Sección desconocida: {section.type}</p>
        </div>
      );
  }})();

  if (!editMode) return inner;
  return (
    <div className="relative group">
      <div className="absolute right-2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity z-40 flex gap-2 items-center">
        {onMoveUp && <button onClick={onMoveUp} className="text-xs bg-white border rounded px-2 py-1 shadow hover:bg-gray-50">Arriba</button>}
        {onMoveDown && <button onClick={onMoveDown} className="text-xs bg-white border rounded px-2 py-1 shadow hover:bg-gray-50">Abajo</button>}
  {onDelete && <button onClick={onDelete} className="text-xs bg-red-500 text-white rounded px-2 py-1 shadow hover:bg-red-600">Eliminar</button>}
  {onDuplicate && <button onClick={onDuplicate} className="text-xs bg-white border rounded px-2 py-1 shadow hover:bg-gray-50">Duplicar</button>}
        {onUpdateField && (
          <button onClick={() => setOpenEdit(v => !v)} className="text-xs bg-white border rounded px-2 py-1 shadow hover:bg-gray-50">Editar</button>
        )}
        {onAddBefore && (
          <div className="relative">
            <button onClick={() => { setOpenAddBefore(v=>!v); setOpenAddAfter(false); }} className="text-xs bg-white border rounded px-2 py-1 shadow hover:bg-gray-50">+ Arriba</button>
            {openAddBefore && (
              <div className="absolute right-0 mt-1 bg-white border shadow rounded p-2 grid grid-cols-2 gap-2 z-50">
                {TYPES.map(t => (
                  <button key={`before-${t}`} className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-left" onClick={() => { onAddBefore(t); setOpenAddBefore(false); }}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {onAddAfter && (
          <div className="relative">
            <button onClick={() => { setOpenAddAfter(v=>!v); setOpenAddBefore(false); }} className="text-xs bg-white border rounded px-2 py-1 shadow hover:bg-gray-50">+ Abajo</button>
            {openAddAfter && (
              <div className="absolute right-0 mt-1 bg-white border shadow rounded p-2 grid grid-cols-2 gap-2 z-50">
                {TYPES.map(t => (
                  <button key={`after-${t}`} className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-left" onClick={() => { onAddAfter(t); setOpenAddAfter(false); }}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {inner}
      {openEdit && onUpdateField && (
        <div className="absolute left-2 -top-10 bg-white border rounded shadow p-3 z-40 min-w-[240px]">
          {/* Panel de edición básica según tipo */}
          {section.type === 'text' && (
            <div className="space-y-2">
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Título" defaultValue={(sectionProps as any).title || ''} onChange={e => onUpdateField('title', e.target.value)} />
              <textarea className="w-full border rounded px-2 py-1 text-xs" placeholder="Contenido" defaultValue={(sectionProps as any).content || ''} onChange={e => onUpdateField('content', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente título" defaultValue={(sectionProps as any).titleFont || ''} onChange={e => onUpdateField('titleFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color título" defaultValue={(sectionProps as any).titleColor || ''} onChange={e => onUpdateField('titleColor', sanitizeHex(e.target.value))} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente texto" defaultValue={(sectionProps as any).textFont || ''} onChange={e => onUpdateField('textFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color texto" defaultValue={(sectionProps as any).textColor || ''} onChange={e => onUpdateField('textColor', sanitizeHex(e.target.value))} />
              </div>
            </div>
          )}
          {section.type === 'contact' && (
            <div className="space-y-2">
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Título" defaultValue={(sectionProps as any).title || ''} onChange={e => onUpdateField('title', e.target.value)} />
              <textarea className="w-full border rounded px-2 py-1 text-xs" placeholder="Descripción" defaultValue={(sectionProps as any).description || ''} onChange={e => onUpdateField('description', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente título" defaultValue={(sectionProps as any).titleFont || ''} onChange={e => onUpdateField('titleFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color título" defaultValue={(sectionProps as any).titleColor || ''} onChange={e => onUpdateField('titleColor', sanitizeHex(e.target.value))} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente texto" defaultValue={(sectionProps as any).textFont || ''} onChange={e => onUpdateField('textFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color texto" defaultValue={(sectionProps as any).textColor || ''} onChange={e => onUpdateField('textColor', sanitizeHex(e.target.value))} />
              </div>
            </div>
          )}
          {section.type === 'about' && (
            <div className="space-y-2">
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Título" defaultValue={(sectionProps as any).title || ''} onChange={e => onUpdateField('title', e.target.value)} />
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Subtítulo" defaultValue={(sectionProps as any).subtitle || ''} onChange={e => onUpdateField('subtitle', e.target.value)} />
              <textarea className="w-full border rounded px-2 py-1 text-xs" placeholder="Contenido" defaultValue={(sectionProps as any).content || ''} onChange={e => onUpdateField('content', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente título" defaultValue={(sectionProps as any).titleFont || ''} onChange={e => onUpdateField('titleFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color título" defaultValue={(sectionProps as any).titleColor || ''} onChange={e => onUpdateField('titleColor', sanitizeHex(e.target.value))} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente texto" defaultValue={(sectionProps as any).textFont || ''} onChange={e => onUpdateField('textFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color texto" defaultValue={(sectionProps as any).textColor || ''} onChange={e => onUpdateField('textColor', sanitizeHex(e.target.value))} />
              </div>
            </div>
          )}
          {(section.type === 'services' || section.type === 'products') && (
            <div className="space-y-2">
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Título de sección" defaultValue={(sectionProps as any).title || ''} onChange={e => onUpdateField('title', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente título" defaultValue={(sectionProps as any).titleFont || ''} onChange={e => onUpdateField('titleFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color título" defaultValue={(sectionProps as any).titleColor || ''} onChange={e => onUpdateField('titleColor', sanitizeHex(e.target.value))} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente texto" defaultValue={(sectionProps as any).textFont || ''} onChange={e => onUpdateField('textFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color texto" defaultValue={(sectionProps as any).textColor || ''} onChange={e => onUpdateField('textColor', sanitizeHex(e.target.value))} />
              </div>
            </div>
          )}
          {section.type === 'map' && (
            <div className="space-y-2">
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Título de la sección" defaultValue={(sectionProps as any).title || ''} onChange={e => onUpdateField('title', e.target.value)} />
              <textarea className="w-full border rounded px-2 py-1 text-xs" placeholder="URL de Google Maps Embed" defaultValue={(sectionProps as any).embedUrl || ''} onChange={e => onUpdateField('embedUrl', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente título" defaultValue={(sectionProps as any).titleFont || ''} onChange={e => onUpdateField('titleFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color título" defaultValue={(sectionProps as any).titleColor || ''} onChange={e => onUpdateField('titleColor', sanitizeHex(e.target.value))} />
              </div>
              <div className="pt-1">
                <button className="text-[10px] px-2 py-1 bg-gray-100 border rounded hover:bg-gray-200" onClick={() => {
                  onUpdateField('titleFont', '');
                  onUpdateField('titleColor', '');
                }}>Reset estilos</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionRenderer;