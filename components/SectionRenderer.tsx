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
import ColumnsSection from './ColumnsSection';
import ClientLogos from './ClientLogos';

interface SectionRendererProps {
  section: Section;
  contactInfo?: ContactInfo;
  editMode?: boolean;
  compact?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onUpdateField?: (field: string, value: any) => void;
  onAddBefore?: (type: SectionType) => void;
  onAddAfter?: (type: SectionType) => void;
  onDuplicate?: () => void;
  onUpdateContactInfo?: (field: keyof ContactInfo, value: string) => void;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, contactInfo, editMode, compact, onMoveUp, onMoveDown, onDelete, onUpdateField, onAddBefore, onAddAfter, onDuplicate, onUpdateContactInfo }) => {
  const sectionProps = section.content;
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAddBefore, setOpenAddBefore] = React.useState(false);
  const [openAddAfter, setOpenAddAfter] = React.useState(false);
  const TYPES: SectionType[] = ['hero','services','products','about','map','contact','text','image','html','logos','columns'];
  
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
      return <Services {...sectionProps} titleFont={sectionProps.titleFont} titleColor={sectionProps.titleColor} textFont={sectionProps.textFont} textColor={sectionProps.textColor} editMode={editMode} onUpdateField={onUpdateField} compact={compact} />;
    case 'products':
      return <Products {...sectionProps} titleFont={sectionProps.titleFont} titleColor={sectionProps.titleColor} textFont={sectionProps.textFont} textColor={sectionProps.textColor} editMode={editMode} onUpdateField={onUpdateField} compact={compact} />;
    case 'about':
      return <About {...sectionProps} titleFont={sectionProps.titleFont} titleColor={sectionProps.titleColor} textFont={sectionProps.textFont} textColor={sectionProps.textColor} editMode={editMode} onUpdateField={onUpdateField} compact={compact} />;
  case 'map':
    return <Map {...sectionProps} editMode={editMode} onUpdateField={onUpdateField} compact={compact} />;
  case 'contact':
    return <ContactForm section={sectionProps as any} contactInfo={contactInfo} editMode={editMode} onUpdateField={onUpdateField} onUpdateContactInfo={onUpdateContactInfo} compact={compact} />;
  case 'text':
    return <TextComponent {...sectionProps} titleFont={sectionProps.titleFont} titleColor={sectionProps.titleColor} textFont={sectionProps.textFont} textColor={sectionProps.textColor} editMode={editMode} onUpdateField={onUpdateField} compact={compact} />;
  case 'image':
    return <ImageComponent {...sectionProps} editMode={editMode} onUpdateField={onUpdateField} compact={compact} />;
  case 'html':
    return <HtmlComponent {...sectionProps} editMode={editMode} onUpdateField={onUpdateField} />;
  case 'logos':
    return <ClientLogos {...sectionProps} editMode={editMode} onUpdateField={onUpdateField} compact={compact} />;
    case 'columns':
        return (
          <ColumnsSection
            {...sectionProps}
            editMode={editMode}
            contactInfo={contactInfo}
            onChangeColumns={(cols) => onUpdateField && onUpdateField('columns', cols)}
          />
        );
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
              <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showTitle !== false} onChange={e => onUpdateField('showTitle', e.target.checked)} /> Mostrar título</label>
              <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showUnderline !== false} onChange={e => onUpdateField('showUnderline', e.target.checked)} /> Subrayado</label>
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
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showTitle !== false} onChange={e => onUpdateField('showTitle', e.target.checked)} /> Mostrar título</label>
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showUnderline !== false} onChange={e => onUpdateField('showUnderline', e.target.checked)} /> Subrayado</label>
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showDescription !== false} onChange={e => onUpdateField('showDescription', e.target.checked)} /> Descripción</label>
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
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showTitle !== false} onChange={e => onUpdateField('showTitle', e.target.checked)} /> Mostrar título</label>
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showUnderline !== false} onChange={e => onUpdateField('showUnderline', e.target.checked)} /> Subrayado</label>
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showSubtitle !== false} onChange={e => onUpdateField('showSubtitle', e.target.checked)} /> Subtítulo</label>
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
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showTitle !== false} onChange={e => onUpdateField('showTitle', e.target.checked)} /> Mostrar título</label>
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showUnderline !== false} onChange={e => onUpdateField('showUnderline', e.target.checked)} /> Subrayado</label>
              </div>
            </div>
          )}
          {section.type === 'image' && (
            <div className="space-y-2">
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Título de sección" defaultValue={(sectionProps as any).title || ''} onChange={e => onUpdateField('title', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente título" defaultValue={(sectionProps as any).titleFont || ''} onChange={e => onUpdateField('titleFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color título" defaultValue={(sectionProps as any).titleColor || ''} onChange={e => onUpdateField('titleColor', sanitizeHex(e.target.value))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showTitle !== false} onChange={e => onUpdateField('showTitle', e.target.checked)} /> Mostrar título</label>
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showUnderline !== false} onChange={e => onUpdateField('showUnderline', e.target.checked)} /> Subrayado</label>
              </div>
            </div>
          )}
          {section.type === 'logos' && (
            <div className="space-y-2">
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Título de sección" defaultValue={(sectionProps as any).title || ''} onChange={e => onUpdateField('title', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1 text-xs" placeholder="Fuente título" defaultValue={(sectionProps as any).titleFont || ''} onChange={e => onUpdateField('titleFont', e.target.value)} />
                <input className="border rounded px-2 py-1 text-xs" placeholder="# Color título" defaultValue={(sectionProps as any).titleColor || ''} onChange={e => onUpdateField('titleColor', sanitizeHex(e.target.value))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showTitle !== false} onChange={e => onUpdateField('showTitle', e.target.checked)} /> Mostrar título</label>
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showUnderline !== false} onChange={e => onUpdateField('showUnderline', e.target.checked)} /> Subrayado</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).autoplay !== false} onChange={e => onUpdateField('autoplay', e.target.checked)} /> Autoplay</label>
                <input className="border rounded px-2 py-1 text-xs" placeholder="Velocidad (ms)" type="number" min={800} defaultValue={(sectionProps as any).speedMs || 2500} onChange={e => onUpdateField('speedMs', Number(e.target.value))} />
              </div>
              <div className="space-y-2 max-h-64 overflow-auto pr-1">
                {(Array.isArray((sectionProps as any).logos) ? (sectionProps as any).logos : []).map((logo: any, i: number) => (
                  <div key={logo.id || i} className="border rounded p-2 flex items-center gap-2 bg-gray-50">
                    <img src={logo.url} alt={logo.alt || 'logo'} className="w-16 h-10 object-contain bg-white rounded" />
                    <div className="flex-1 grid grid-cols-2 gap-1">
                      <input className="border rounded px-2 py-1 text-[10px]" placeholder="URL imagen" defaultValue={logo.url || ''} onChange={e => {
                        const arr = [ ...(sectionProps as any).logos ];
                        arr[i] = { ...arr[i], url: e.target.value };
                        onUpdateField('logos', arr);
                      }} />
                      <input className="border rounded px-2 py-1 text-[10px]" placeholder="Link (opcional)" defaultValue={logo.link || ''} onChange={e => {
                        const arr = [ ...(sectionProps as any).logos ];
                        arr[i] = { ...arr[i], link: e.target.value };
                        onUpdateField('logos', arr);
                      }} />
                      <input className="border rounded px-2 py-1 text-[10px] col-span-2" placeholder="Alt (accesibilidad)" defaultValue={logo.alt || ''} onChange={e => {
                        const arr = [ ...(sectionProps as any).logos ];
                        arr[i] = { ...arr[i], alt: e.target.value };
                        onUpdateField('logos', arr);
                      }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] px-2 py-1 bg-white border rounded cursor-pointer hover:bg-gray-50">
                        Subir
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const input = e.target as HTMLInputElement;
                          const file = input.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const dataUrl = String(reader.result || '');
                            const arr = [ ...(sectionProps as any).logos ];
                            arr[i] = { ...arr[i], url: dataUrl };
                            onUpdateField('logos', arr);
                          };
                          reader.readAsDataURL(file);
                        }} />
                      </label>
                      <button className="text-[10px] px-2 py-1 bg-white border rounded hover:bg-gray-50" disabled={i===0} onClick={() => {
                        const arr = [ ...(sectionProps as any).logos ];
                        const tmp = arr[i-1]; arr[i-1] = arr[i]; arr[i] = tmp;
                        onUpdateField('logos', arr);
                      }}>↑</button>
                      <button className="text-[10px] px-2 py-1 bg-white border rounded hover:bg-gray-50" disabled={i === ((sectionProps as any).logos.length - 1)} onClick={() => {
                        const arr = [ ...(sectionProps as any).logos ];
                        const tmp = arr[i+1]; arr[i+1] = arr[i]; arr[i] = tmp;
                        onUpdateField('logos', arr);
                      }}>↓</button>
                      <button className="text-[10px] px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => {
                        const arr = (sectionProps as any).logos.filter((_:any, j:number)=> j!==i);
                        onUpdateField('logos', arr);
                      }}>Eliminar</button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button className="text-[10px] px-2 py-1 bg-white border rounded hover:bg-gray-50" onClick={() => {
                    const arr = Array.isArray((sectionProps as any).logos) ? [ ...(sectionProps as any).logos ] : [];
                    arr.push({ id: Math.random().toString(36).slice(2), url: '' });
                    onUpdateField('logos', arr);
                  }}>+ Agregar logo</button>
                  <label className="text-[10px] px-2 py-1 bg-white border rounded cursor-pointer hover:bg-gray-50">
                    Subir varios
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      const files: File[] = input.files ? Array.from(input.files) : [];
                      if (!files.length) return;
                      const readers = files.map((f: File) => new Promise<string>((res) => {
                        const r = new FileReader();
                        r.onload = () => res(String(r.result || ''));
                        r.readAsDataURL(f);
                      }));
                      Promise.all(readers).then(dataUrls => {
                        const arr = Array.isArray((sectionProps as any).logos) ? [ ...(sectionProps as any).logos ] : [];
                        dataUrls.forEach(u => arr.push({ id: Math.random().toString(36).slice(2), url: u }));
                        onUpdateField('logos', arr);
                      });
                    }} />
                  </label>
                </div>
              </div>
            </div>
          )}
          {section.type === 'html' && (
            <div className="space-y-2">
              <textarea className="w-full border rounded px-2 py-1 text-xs" placeholder="Contenido HTML" defaultValue={(sectionProps as any).htmlContent || ''} onChange={e => onUpdateField('htmlContent', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
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
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showTitle !== false} onChange={e => onUpdateField('showTitle', e.target.checked)} /> Mostrar título</label>
                <label className="flex items-center gap-2 text-[10px]"><input type="checkbox" defaultChecked={(sectionProps as any).showUnderline !== false} onChange={e => onUpdateField('showUnderline', e.target.checked)} /> Subrayado</label>
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