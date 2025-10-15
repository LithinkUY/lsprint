import React, { useState, useEffect } from 'react';
import { SiteData, Page, Section, SectionType, GlobalStyles, HeaderFooterStyles, SiteIdentity, HeroSection, ServicesSection, ProductsSection, AboutSection, MapSection, ContactSection, TextSection, ImageSection, HtmlSection, createNewSlide, createNewService, createNewProduct, createNewPage, createNewSectionOfType, HeroSlide, Service, Product, ImageItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import EstilosSection from './EstilosSection';

// Props Interface
interface AdminPanelProps {
  initialData: SiteData;
  setSiteData: (data: SiteData) => void;
  onClose: () => void;
}

// Reusable UI Components
const FormField = ({ id, label, value, onChange, type = 'text', placeholder = '', as = 'input', children }: { id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; type?: string; placeholder?: string; as?: 'input' | 'textarea' | 'select'; children?: React.ReactNode }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {as === 'textarea' ? (
      <textarea id={id} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" rows={5}></textarea>
    ) : as === 'select' ? (
      <select id={id} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
        {children}
      </select>
    ) : (
      <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    )}
  </div>
);

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  onDelete?: () => void;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title, children, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-300 rounded-md mb-2 bg-white">
      <div className="bg-gray-50 p-2 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h4 className="font-semibold text-gray-700 truncate">{title}</h4>
        <div className="flex items-center">
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-500 hover:text-red-700 mr-2 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};

// Main Admin Panel Component
export const AdminPanel: React.FC<AdminPanelProps> = ({ initialData, setSiteData, onClose }) => {
  const [draftData, setDraftData] = useState<SiteData>(() => JSON.parse(JSON.stringify(initialData)));
  const [activeTab, setActiveTab] = useState('páginas');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(initialData.pages[0]?.id || null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => { setDraftData(JSON.parse(JSON.stringify(initialData))); }, [initialData]);
  useEffect(() => { setHasChanges(JSON.stringify(draftData) !== JSON.stringify(initialData)); }, [draftData, initialData]);

  const handleSave = () => {
    // Clonar y sanear número de WhatsApp
    const dataToSave: SiteData = JSON.parse(JSON.stringify(draftData));
    if (dataToSave.whatsapp) {
      dataToSave.whatsapp.phone = (dataToSave.whatsapp.phone || '').replace(/[^0-9]/g, '');
      if (typeof dataToSave.whatsapp.enabled !== 'boolean') dataToSave.whatsapp.enabled = true as any;
      if (!dataToSave.whatsapp.message) dataToSave.whatsapp.message = '¡Hola! Quiero más información.' as any;
    }
    setSiteData(dataToSave);
    // Persistir con la misma clave que usa App/DynamicStyle
    try {
      localStorage.setItem('dynamic-site-data', JSON.stringify(dataToSave));
    } catch {}
  };

  const handleDiscard = () => setDraftData(JSON.parse(JSON.stringify(initialData)));

  const handleUpdate = <T,>(setter: (draft: SiteData) => T, field: keyof T, value: any) => {
    setDraftData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const targetObject = setter(newData);
      targetObject[field] = value;
      return newData;
    });
  };

  const handleIdentityChange = (field: keyof SiteIdentity, value: string) => handleUpdate(d => d.siteIdentity, field, value);
  const handleGlobalStylesChange = (field: keyof GlobalStyles, value: string) => handleUpdate(d => d.globalStyles, field, value);
  const handleHeaderStylesChange = (field: keyof HeaderFooterStyles, value: string) => handleUpdate(d => d.headerStyles, field, value);
  const handleFooterStylesChange = (field: keyof HeaderFooterStyles, value: string) => handleUpdate(d => d.footerStyles, field, value);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    const pageIndex = draftData.pages.findIndex(p => p.id === selectedPageId);
    if (pageIndex === -1) return;
    const newSections = Array.from(draftData.pages[pageIndex].sections);
    const [removed] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, removed);
    const newPages = [...draftData.pages];
    newPages[pageIndex].sections = newSections;
    setDraftData({ ...draftData, pages: newPages });
  };

  const handleSectionContentChange = (pageIndex: number, sectionIndex: number, newContent: any) => {
    const newPages = [...draftData.pages];
    newPages[pageIndex].sections[sectionIndex].content = newContent;
    setDraftData({ ...draftData, pages: newPages });
  };

  const handleAddSection = (pageIndex: number, type: SectionType) => {
    const newSection = createNewSectionOfType(type);
    const newPages = [...draftData.pages];
    newPages[pageIndex].sections.push(newSection);
    setDraftData({ ...draftData, pages: newPages });
  };

  const handleDeleteSection = (pageIndex: number, sectionId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
      const newPages = [...draftData.pages];
      newPages[pageIndex].sections = newPages[pageIndex].sections.filter(s => s.id !== sectionId);
      setDraftData({ ...draftData, pages: newPages });
    }
  };

  const handleAddPage = () => {
    const newPageName = prompt("Nombre de la nueva página:", "Nueva Página");
    if (newPageName) {
      const newPagePath = `/${newPageName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`;
      const newPage = createNewPage(newPageName, newPagePath);
      setDraftData(prev => ({ ...prev, pages: [...prev.pages, newPage] }));
      setSelectedPageId(newPage.id);
    }
  };

  const handleDeletePage = (pageId: string) => {
    if (draftData.pages.length <= 1) {
      alert("No puedes eliminar la última página.");
      return;
    }
    if (window.confirm("¿Estás seguro de que quieres eliminar esta página?")) {
      const newPages = draftData.pages.filter(p => p.id !== pageId);
      setDraftData({ ...draftData, pages: newPages });
      if (selectedPageId === pageId) {
        setSelectedPageId(newPages[0]?.id || null);
      }
    }
  };

  const renderSectionEditor = (pageIndex: number, sectionIndex: number) => {
    const section = draftData.pages[pageIndex].sections[sectionIndex];
    const content = section.content;
    const updateList = (listName: string, newList: any[]) => {
      handleSectionContentChange(pageIndex, sectionIndex, { ...content, [listName]: newList });
    };
    const updateField = (fieldName: string, value: any) => {
      handleSectionContentChange(pageIndex, sectionIndex, { ...content, [fieldName]: value });
    };
    const updateButtonField = (fieldName: 'text' | 'link', value: string) => {
      const newButton = { ...(content as AboutSection).button, [fieldName]: value };
      updateField('button', newButton);
    };
    const createListItemChangeHandler = <T, K extends keyof T>(
      listName: SectionType, // Cambiado a SectionType para evitar 'never'
      index: number,
      field: K,
      nestedField?: keyof T[K]
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const list = (content as any)[listName] as T[];
      const newList = list.map((item, i) => {
        if (i === index) {
          if (nestedField) {
            return {
              ...item,
              [field]: {
                ...(item[field] as any),
                [nestedField]: e.target.value,
              },
            };
          }
          return { ...item, [field]: e.target.value };
        }
        return item;
      });
      updateList(listName, newList);
    };

    switch (section.type) {
      case 'hero': {
        const heroContent = content as HeroSection;
        return (
          <div>
            {heroContent.slides.map((slide, i) => (
              <CollapsibleCard key={slide.id} title={slide.title || 'Nueva Diapositiva'} onDelete={() => updateList('slides', heroContent.slides.filter(s => s.id !== slide.id))}>
                <FormField id={`s-t-${slide.id}`} label="Título" value={slide.title} onChange={createListItemChangeHandler<HeroSlide, 'title'>('slides', i, 'title')} />
                <FormField id={`s-st-${slide.id}`} label="Subtítulo" value={slide.subtitle} onChange={createListItemChangeHandler<HeroSlide, 'subtitle'>('slides', i, 'subtitle')} />
                <FormField id={`s-img-${slide.id}`} label="URL Imagen" value={slide.imageUrl} onChange={createListItemChangeHandler<HeroSlide, 'imageUrl'>('slides', i, 'imageUrl')} />
                <div className="mb-2">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        const newSlides = [...heroContent.slides];
                        newSlides[i].imageUrl = reader.result;
                        updateList('slides', newSlides);
                      }
                    };
                    reader.readAsDataURL(file);
                  }} />
                  {slide.imageUrl && slide.imageUrl.startsWith('data:image') && (
                    <img src={slide.imageUrl} alt="preview" className="mt-1 h-16 object-contain" />
                  )}
                </div>
                <FormField id={`s-vid-${slide.id}`} label="URL Video (Opcional)" value={slide.videoUrl || ''} onChange={createListItemChangeHandler<HeroSlide, 'videoUrl'>('slides', i, 'videoUrl')} />
                <div className="mb-2">
                  <input type="file" accept="video/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        const newSlides = [...heroContent.slides];
                        newSlides[i].videoUrl = reader.result;
                        updateList('slides', newSlides);
                      }
                    };
                    reader.readAsDataURL(file);
                  }} />
                  {slide.videoUrl && slide.videoUrl.startsWith('data:video') && (
                    <video src={slide.videoUrl} controls className="mt-1 h-16 object-contain" />
                  )}
                </div>
                <FormField id={`s-bt-${slide.id}`} label="Texto del Botón" value={slide.button.text} onChange={createListItemChangeHandler<HeroSlide, 'button'>('slides', i, 'button', 'text')} />
                <FormField id={`s-bl-${slide.id}`} label="Enlace del Botón" value={slide.button.link} onChange={createListItemChangeHandler<HeroSlide, 'button'>('slides', i, 'button', 'link')} />
              </CollapsibleCard>
            ))}
            <button onClick={() => updateList('slides', [...heroContent.slides, createNewSlide()])} className="mt-2 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              Añadir Diapositiva
            </button>
          </div>
        );
      }
      case 'services': {
        const servicesContent = content as ServicesSection;
        return (
          <div>
            <FormField id="services-title" label="Título de la Sección" value={servicesContent.title} onChange={e => updateField('title', e.target.value)} />
            <div className="flex gap-2 mb-2">
              <FormField id="services-title-font" label="Fuente Título" value={servicesContent.titleFont || ''} onChange={e => updateField('titleFont', e.target.value)} />
              <FormField id="services-title-color" label="Color Título" value={servicesContent.titleColor || ''} onChange={e => updateField('titleColor', e.target.value)} />
            </div>
            <div className="flex gap-2 mb-2">
              <FormField id="services-text-font" label="Fuente Texto" value={servicesContent.textFont || ''} onChange={e => updateField('textFont', e.target.value)} />
              <FormField id="services-text-color" label="Color Texto" value={servicesContent.textColor || ''} onChange={e => updateField('textColor', e.target.value)} />
            </div>
            {servicesContent.services.map((service, i) => (
              <CollapsibleCard key={service.id} title={service.title || 'Nuevo Servicio'} onDelete={() => updateList('services', servicesContent.services.filter(s => s.id !== service.id))}>
                <FormField id={`s-t-${service.id}`} label="Título" value={service.title} onChange={createListItemChangeHandler<Service, 'title'>('services', i, 'title')} />
                <FormField id={`s-d-${service.id}`} label="Descripción" as="textarea" value={service.description} onChange={createListItemChangeHandler<Service, 'description'>('services', i, 'description')} />
                <FormField id={`s-ico-${service.id}`} label="Icono (SVG)" as="textarea" value={service.icon} onChange={createListItemChangeHandler<Service, 'icon'>('services', i, 'icon')} />
                <FormField id={`s-wa-${service.id}`} label="Enlace WhatsApp (Opcional)" value={service.whatsappLink || ''} onChange={createListItemChangeHandler<Service, 'whatsappLink'>('services', i, 'whatsappLink')} />
              </CollapsibleCard>
            ))}
            <button onClick={() => updateList('services', [...servicesContent.services, createNewService()])} className="mt-2 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              Añadir Servicio
            </button>
          </div>
        );
      }
      case 'products': {
        const productsContent = content as ProductsSection;
        return (
          <div>
            <FormField id="products-title" label="Título de la Sección" value={productsContent.title} onChange={e => updateField('title', e.target.value)} />
            <div className="flex gap-2 mb-2">
              <FormField id="products-title-font" label="Fuente Título" value={productsContent.titleFont || ''} onChange={e => updateField('titleFont', e.target.value)} />
              <FormField id="products-title-color" label="Color Título" value={productsContent.titleColor || ''} onChange={e => updateField('titleColor', e.target.value)} />
            </div>
            <div className="flex gap-2 mb-2">
              <FormField id="products-text-font" label="Fuente Texto" value={productsContent.textFont || ''} onChange={e => updateField('textFont', e.target.value)} />
              <FormField id="products-text-color" label="Color Texto" value={productsContent.textColor || ''} onChange={e => updateField('textColor', e.target.value)} />
            </div>
            {productsContent.products.map((p, i) => (
              <CollapsibleCard key={p.id} title={p.name || 'Nuevo Producto'} onDelete={() => updateList('products', productsContent.products.filter(item => item.id !== p.id))}>
                <FormField id={`p-n-${p.id}`} label="Nombre" value={p.name} onChange={createListItemChangeHandler<Product, 'name'>('products', i, 'name')} />
                <FormField id={`p-c-${p.id}`} label="Categoría" value={p.category} onChange={createListItemChangeHandler<Product, 'category'>('products', i, 'category')} />
                <FormField id={`p-i-${p.id}`} label="URL Imagen" value={p.imageUrl} onChange={createListItemChangeHandler<Product, 'imageUrl'>('products', i, 'imageUrl')} />
                <div className="mb-2">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        const newProducts = [...productsContent.products];
                        newProducts[i].imageUrl = reader.result;
                        updateList('products', newProducts);
                      }
                    };
                    reader.readAsDataURL(file);
                  }} />
                  {p.imageUrl && p.imageUrl.startsWith('data:image') && (
                    <img src={p.imageUrl} alt="preview" className="mt-1 h-16 object-contain" />
                  )}
                </div>
                <FormField id={`p-icon-${p.id}`} label="Icono (SVG o imagen base64)" as="textarea" value={p.icon || ''} onChange={createListItemChangeHandler<Product, 'icon'>('products', i, 'icon')} />
                <div className="mb-2">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        const newProducts = [...productsContent.products];
                        newProducts[i].icon = reader.result;
                        updateList('products', newProducts);
                      }
                    };
                    reader.readAsDataURL(file);
                  }} />
                  {p.icon && p.icon.startsWith('data:image') && (
                    <img src={p.icon} alt="icon preview" className="mt-1 h-10 object-contain" />
                  )}
                </div>
                <FormField id={`p-wa-${p.id}`} label="Enlace WhatsApp (Opcional)" value={p.whatsappLink || ''} onChange={createListItemChangeHandler<Product, 'whatsappLink'>('products', i, 'whatsappLink')} />
              </CollapsibleCard>
            ))}
            <button onClick={() => updateList('products', [...productsContent.products, createNewProduct()])} className="mt-2 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              Añadir Producto
            </button>
          </div>
        );
      }
      case 'about': {
        const aboutContent = content as AboutSection;
        return (
          <div>
            <FormField id="ab-t" label="Título" value={aboutContent.title} onChange={e => updateField('title', e.target.value)} />
            <div className="flex gap-2 mb-2">
              <FormField id="about-title-font" label="Fuente Título" value={aboutContent.titleFont || ''} onChange={e => updateField('titleFont', e.target.value)} />
              <FormField id="about-title-color" label="Color Título" value={aboutContent.titleColor || ''} onChange={e => updateField('titleColor', e.target.value)} />
            </div>
            <FormField id="ab-st" label="Subtítulo" value={aboutContent.subtitle} onChange={e => updateField('subtitle', e.target.value)} />
            <FormField id="ab-c" as="textarea" label="Contenido" value={aboutContent.content} onChange={e => updateField('content', e.target.value)} />
            <div className="flex gap-2 mb-2">
              <FormField id="about-text-font" label="Fuente Texto" value={aboutContent.textFont || ''} onChange={e => updateField('textFont', e.target.value)} />
              <FormField id="about-text-color" label="Color Texto" value={aboutContent.textColor || ''} onChange={e => updateField('textColor', e.target.value)} />
            </div>
            <FormField id="ab-i" label="URL Imagen" value={aboutContent.imageUrl} onChange={e => updateField('imageUrl', e.target.value)} />
            <div className="mb-2">
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (typeof reader.result === 'string') {
                    updateField('imageUrl', reader.result);
                  }
                };
                reader.readAsDataURL(file);
              }} />
              {aboutContent.imageUrl && aboutContent.imageUrl.startsWith('data:image') && (
                <img src={aboutContent.imageUrl} alt="preview" className="mt-1 h-16 object-contain" />
              )}
            </div>
            <FormField id="ab-bt" label="Texto del Botón" value={aboutContent.button.text} onChange={e => updateButtonField('text', e.target.value)} />
            <FormField id="ab-bl" label="Enlace del Botón" value={aboutContent.button.link} onChange={e => updateButtonField('link', e.target.value)} />
          </div>
        );
      }
      case 'map':
        return (
          <div>
            <FormField id="map-t" label="Título de la Sección" value={(content as MapSection).title} onChange={e => updateField('title', e.target.value)} />
            <FormField id="map-url" label="URL de Google Maps Embed" as="textarea" value={(content as MapSection).embedUrl} onChange={e => updateField('embedUrl', e.target.value)} />
          </div>
        );
      case 'contact':
        const contactContent = content as ContactSection;
        return (
          <div>
            <FormField id="c-t" label="Título" value={contactContent.title} onChange={e => updateField('title', e.target.value)} />
            <FormField id="c-recipient" label="Email de destino (recibe mensajes)" value={contactContent.recipientEmail || ''} onChange={e => updateField('recipientEmail', e.target.value)} />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ancho del formulario (desktop)</label>
              <input
                type="range"
                min={30}
                max={80}
                value={Math.round((contactContent.formWidth ?? 0.6) * 100)}
                onChange={(e) => updateField('formWidth', Math.max(0.3, Math.min(0.8, Number(e.target.value) / 100)))}
              />
              <div className="text-sm text-gray-600 mt-1">{Math.round((contactContent.formWidth ?? 0.6) * 100)}%</div>
            </div>
            <h4 className="font-semibold mt-4 mb-2">Campos del Formulario</h4>
            {contactContent.fields && contactContent.fields.length > 0 ? contactContent.fields.map((field, i) => (
              <CollapsibleCard key={field.id} title={field.label || `Campo ${i + 1}`} onDelete={() => updateList('fields', contactContent.fields.filter(f => f.id !== field.id))}>
                <FormField id={`cf-label-${field.id}`} label="Etiqueta" value={field.label} onChange={e => {
                  const newFields = [...contactContent.fields];
                  newFields[i].label = e.target.value;
                  updateList('fields', newFields);
                }} />
                <FormField id={`cf-name-${field.id}`} label="Nombre (name)" value={field.name} onChange={e => {
                  const newFields = [...contactContent.fields];
                  newFields[i].name = e.target.value;
                  updateList('fields', newFields);
                }} />
                <FormField id={`cf-type-${field.id}`} label="Tipo" as="select" value={field.type} onChange={e => {
                  const newFields = [...contactContent.fields];
                  newFields[i].type = e.target.value as any;
                  updateList('fields', newFields);
                }}>
                  <option value="text">Texto</option>
                  <option value="email">Email</option>
                  <option value="textarea">Área de texto</option>
                  <option value="tel">Teléfono</option>
                </FormField>
                <div className="flex items-center mb-2">
                  <input id={`cf-req-${field.id}`} type="checkbox" checked={field.required} onChange={e => {
                    const newFields = [...contactContent.fields];
                    newFields[i].required = e.target.checked;
                    updateList('fields', newFields);
                  }} className="mr-2" />
                  <label htmlFor={`cf-req-${field.id}`}>Requerido</label>
                </div>
                <FormField id={`cf-icon-${field.id}`} label="Icono (SVG o imagen base64)" as="textarea" value={field.icon || ''} onChange={e => {
                  const newFields = [...contactContent.fields];
                  newFields[i].icon = e.target.value;
                  updateList('fields', newFields);
                }} />
                <div className="mb-2">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        const newFields = [...contactContent.fields];
                        newFields[i].icon = reader.result;
                        updateList('fields', newFields);
                      }
                    };
                    reader.readAsDataURL(file);
                  }} />
                  {field.icon && field.icon.startsWith('data:image') && (
                    <img src={field.icon} alt="icon preview" className="mt-1 h-8 object-contain" />
                  )}
                </div>
              </CollapsibleCard>
            )) : <p className="text-gray-500">No hay campos. Agrega uno abajo.</p>}
            <button onClick={() => updateList('fields', [...(contactContent.fields || []), { id: uuidv4(), label: 'Nuevo campo', name: `field${(contactContent.fields?.length || 0) + 1}`, type: 'text', required: false }])} className="mt-2 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              Añadir Campo
            </button>
          </div>
        );
      case 'text':
        return (
          <div>
            <FormField id="txt-t" label="Título" value={(content as TextSection).title} onChange={e => updateField('title', e.target.value)} />
            <div className="flex gap-2 mb-2">
              <FormField id="txt-title-font" label="Fuente Título" value={(content as TextSection).titleFont || ''} onChange={e => updateField('titleFont', e.target.value)} />
              <FormField id="txt-title-color" label="Color Título" value={(content as TextSection).titleColor || ''} onChange={e => updateField('titleColor', e.target.value)} />
            </div>
            <FormField id="txt-c" as="textarea" label="Contenido" value={(content as TextSection).content} onChange={e => updateField('content', e.target.value)} />
            <div className="flex gap-2 mb-2">
              <FormField id="txt-text-font" label="Fuente Texto" value={(content as TextSection).textFont || ''} onChange={e => updateField('textFont', e.target.value)} />
              <FormField id="txt-text-color" label="Color Texto" value={(content as TextSection).textColor || ''} onChange={e => updateField('textColor', e.target.value)} />
            </div>
          </div>
        );
      case 'image': {
        const imageContent = content as ImageSection;
        return (
          <div>
            <FormField id="img-t" label="Título de la Sección" value={imageContent.title} onChange={e => updateField('title', e.target.value)} />
            <FormField id="img-dm" label="Modo de Visualización" as="select" value={imageContent.displayMode} onChange={e => updateField('displayMode', e.target.value)}>
              <option value="grid">Grilla</option>
              <option value="slider">Slider</option>
            </FormField>
            {imageContent.images.map((image, i) => (
              <CollapsibleCard key={image.id} title={`Imagen ${i + 1}`} onDelete={() => updateList('images', imageContent.images.filter(img => img.id !== image.id))}>
                <FormField id={`img-u-${image.id}`} label="URL de la Imagen" value={image.url} onChange={createListItemChangeHandler<ImageItem, 'url'>('image', i, 'url')} />
                <div className="mb-2">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        const newImages = [...imageContent.images];
                        newImages[i].url = reader.result;
                        updateList('images', newImages);
                      }
                    };
                    reader.readAsDataURL(file);
                  }} />
                  {image.url && image.url.startsWith('data:image') && (
                    <img src={image.url} alt="preview" className="mt-1 h-16 object-contain" />
                  )}
                </div>
              </CollapsibleCard>
            ))}
            <button onClick={() => updateList('images', [...imageContent.images, { id: uuidv4(), url: 'https://via.placeholder.com/600x400' }])} className="mt-2 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              Añadir Imagen
            </button>
          </div>
        );
      }
      case 'html':
        return (
          <div>
            <FormField id="html-c" as="textarea" label="Contenido HTML" value={(content as HtmlSection).htmlContent} onChange={e => updateField('htmlContent', e.target.value)} />
          </div>
        );
      case 'estilos':
        // Editor para la sección de estilos de título y texto
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Estilos de Título y Texto</h3>
            <EstilosSection
              section={content}
              editable={true}
              onChange={(field, value) => updateField(field, value)}
            />
          </div>
        );
      default:
        return <p>Editor no disponible para el tipo de sección: {section.type}</p>;
    }
  };

  const selectedPage = draftData.pages.find(p => p.id === selectedPageId);
  const selectedPageIndex = draftData.pages.findIndex(p => p.id === selectedPageId);
  const sectionTypes: SectionType[] = ['hero', 'services', 'products', 'about', 'map', 'contact', 'text', 'image', 'html', 'estilos'];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Panel Admin</h2>
        <nav>
          {['páginas', 'general', 'estilos'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left py-2 px-4 mb-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button
            onClick={onClose}
            className="w-full mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </nav>
      </aside>
      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        <>
          {activeTab === 'estilos' && (
            <>{/* ...editor de estilos, iconos sociales header, datos contacto... */}</>
          )}
          {activeTab === 'páginas' && (
            draftData.pages.length === 0 ? (
              <div className="bg-white p-8 rounded shadow text-center">
                <p className="mb-4 text-lg">No hay páginas creadas. Crea la primera página para comenzar.</p>
                <button onClick={handleAddPage} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Crear Página Inicial</button>
              </div>
            ) : selectedPage && selectedPageIndex !== -1 ? (
              <div>
                <div className="mb-4 bg-white p-4 rounded-md border">
                  <h3 className="text-lg font-semibold mb-3">Administrar Páginas</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <select value={selectedPageId || ''} onChange={e => setSelectedPageId(e.target.value)} className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
                      {draftData.pages.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <button onClick={handleAddPage} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Añadir Página</button>
                    <button onClick={() => handleDeletePage(selectedPageId!)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" disabled={draftData.pages.length <= 1}>Eliminar Página</button>
                  </div>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {selectedPage.sections.map((section, index) => (
                            <React.Fragment key={section.id}>
                              <Draggable draggableId={section.id} index={index}>
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <CollapsibleCard title={section.type.charAt(0).toUpperCase() + section.type.slice(1)} onDelete={() => handleDeleteSection(selectedPageIndex, section.id)}>
                                      {renderSectionEditor(selectedPageIndex, index)}
                                    </CollapsibleCard>
                                  </div>
                                )}
                              </Draggable>
                            </React.Fragment>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <div className="mt-4">
                    {sectionTypes.map(type => (
                      <button key={type} onClick={() => handleAddSection(selectedPageIndex, type)} className="mr-2 mt-2 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                        Añadir {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null
          )}
        </>
        {activeTab === 'general' && (
          <div className="bg-white p-4 rounded-md border">
            <h3 className="text-lg font-semibold mb-3">Identidad del Sitio</h3>
            <FormField id="logo-p1" label="Logo Texto Parte 1" value={draftData.siteIdentity.logoTextPart1} onChange={e => handleIdentityChange('logoTextPart1', e.target.value)} />
            <FormField id="logo-p2" label="Logo Texto Parte 2" value={draftData.siteIdentity.logoTextPart2} onChange={e => handleIdentityChange('logoTextPart2', e.target.value)} />
            <FormField id="logo-url" label="URL del Logo (opcional)" value={draftData.siteIdentity.logoImageUrl} onChange={e => handleIdentityChange('logoImageUrl', e.target.value)} />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subir Logo (imagen, base64)</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                      handleIdentityChange('logoImageUrl', reader.result);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              {draftData.siteIdentity.logoImageUrl && draftData.siteIdentity.logoImageUrl.startsWith('data:image') && (
                <img src={draftData.siteIdentity.logoImageUrl} alt="Logo preview" className="mt-2 h-16 object-contain" />
              )}
            </div>
            <hr className="my-6" />
            <h3 className="text-lg font-semibold mb-3">WhatsApp Flotante</h3>
            <FormField id="wa-phone" label="Número de WhatsApp" value={draftData.whatsapp?.phone || ''} onChange={e => setDraftData(d => ({ ...d, whatsapp: { ...d.whatsapp, phone: e.target.value } }))} />
            <FormField id="wa-msg" label="Mensaje por defecto" value={draftData.whatsapp?.message || ''} onChange={e => setDraftData(d => ({ ...d, whatsapp: { ...d.whatsapp, message: e.target.value } }))} />
            <div className="mb-4 flex items-center gap-2">
              <input id="wa-enabled" type="checkbox" checked={draftData.whatsapp?.enabled ?? true} onChange={e => setDraftData(d => ({ ...d, whatsapp: { ...d.whatsapp, enabled: e.target.checked } }))} />
              <label htmlFor="wa-enabled" className="text-sm">Mostrar botón flotante de WhatsApp</label>
            </div>
            {(draftData.whatsapp?.enabled && !(draftData.whatsapp?.phone || '').replace(/[^0-9]/g, '')) && (
              <div className="text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 mb-2 text-sm">
                El botón está habilitado pero falta el número. Ingresa un número con código de país (ej: 59812345678).
              </div>
            )}
            <div className="mb-4">
              <button
                type="button"
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  const phone = (draftData.whatsapp?.phone || '').replace(/[^0-9]/g, '');
                  if (!phone) { alert('Ingresa un número de WhatsApp válido'); return; }
                  const msg = draftData.whatsapp?.message ? `?text=${encodeURIComponent(draftData.whatsapp.message)}` : '';
                  const url = `https://wa.me/${phone}${msg}`;
                  window.open(url, '_blank', 'noopener');
                }}
              >
                Probar WhatsApp
              </button>
              {/* Vista previa del enlace generado */}
              {(() => {
                const phonePreview = (draftData.whatsapp?.phone || '').replace(/[^0-9]/g, '');
                const previewUrl = phonePreview
                  ? `https://wa.me/${phonePreview}${draftData.whatsapp?.message ? `?text=${encodeURIComponent(draftData.whatsapp.message)}` : ''}`
                  : '';
                return (
                  <div className="mt-2 text-sm text-gray-600 break-all">
                    {phonePreview ? (
                      <>
                        Enlace generado: {' '}
                        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{previewUrl}</a>
                      </>
                    ) : (
                      <span className="text-gray-500">Ingresa un número para ver el enlace.</span>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        {activeTab === 'estilos' && (
          <>
            <div className="bg-white p-4 rounded-md border mb-6">
              <h3 className="text-lg font-semibold mb-3">Estilos Globales</h3>
              <FormField id="global-bg" label="Color de Fondo" value={draftData.globalStyles.backgroundColor} onChange={e => handleGlobalStylesChange('backgroundColor', e.target.value)} />
            </div>
            <div className="bg-white p-4 rounded-md border mb-6">
              <h3 className="text-lg font-semibold mb-3">Estilos Header</h3>
              <FormField id="header-bg" label="Color Fondo Header" value={draftData.headerStyles.backgroundColor} onChange={e => handleHeaderStylesChange('backgroundColor', e.target.value)} />
              <FormField id="header-font" label="Fuente Header" value={draftData.headerMenuFooterStyles?.headerFont || ''} onChange={e => setDraftData(d => ({ ...d, headerMenuFooterStyles: { ...d.headerMenuFooterStyles, headerFont: e.target.value } }))} />
              <FormField id="header-color" label="Color Texto Header" value={draftData.headerMenuFooterStyles?.headerColor || ''} onChange={e => setDraftData(d => ({ ...d, headerMenuFooterStyles: { ...d.headerMenuFooterStyles, headerColor: e.target.value } }))} />
            </div>
            <div className="bg-white p-4 rounded-md border mb-6">
              <h3 className="text-lg font-semibold mb-3">Iconos Sociales Header</h3>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Iconos Sociales Header</h4>
                {(draftData.socialIconsHeader || []).map((icon, idx) => (
                  <div key={icon.id} className="flex gap-2 mb-2 items-center">
                    <FormField id={`social-header-name-${icon.id}`} label="" value={icon.name} onChange={e => {
                      const newIcons = [...(draftData.socialIconsHeader || [])];
                      newIcons[idx].name = e.target.value;
                      setDraftData(d => ({ ...d, socialIconsHeader: newIcons }));
                    }} placeholder="Nombre" />
                    <FormField id={`social-header-url-${icon.id}`} label="" value={icon.url} onChange={e => {
                      const newIcons = [...(draftData.socialIconsHeader || [])];
                      newIcons[idx].url = e.target.value;
                      setDraftData(d => ({ ...d, socialIconsHeader: newIcons }));
                    }} placeholder="https://..." />
                    <FormField id={`social-header-svg-${icon.id}`} label="" as="textarea" value={icon.iconSvg} onChange={e => {
                      const newIcons = [...(draftData.socialIconsHeader || [])];
                      newIcons[idx].iconSvg = e.target.value;
                      setDraftData(d => ({ ...d, socialIconsHeader: newIcons }));
                    }} placeholder="SVG" />
                    <button onClick={() => setDraftData(d => ({ ...d, socialIconsHeader: (d.socialIconsHeader || []).filter((_, i) => i !== idx) }))} className="text-red-500">Eliminar</button>
                  </div>
                ))}
                <button onClick={() => setDraftData(d => ({ ...d, socialIconsHeader: [...(d.socialIconsHeader || []), { id: uuidv4(), name: '', url: '', iconSvg: '' }] }))} className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Añadir Icono</button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border mb-6">
              <h3 className="text-lg font-semibold mb-3">Estilos Menú</h3>
              <FormField id="menu-font" label="Fuente Menú" value={draftData.headerMenuFooterStyles?.menuFont || ''} onChange={e => setDraftData(d => ({ ...d, headerMenuFooterStyles: { ...d.headerMenuFooterStyles, menuFont: e.target.value } }))} />
              <FormField id="menu-color" label="Color Texto Menú" value={draftData.headerMenuFooterStyles?.menuColor || ''} onChange={e => setDraftData(d => ({ ...d, headerMenuFooterStyles: { ...d.headerMenuFooterStyles, menuColor: e.target.value } }))} />
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Ítems del Menú</h4>
                {(draftData.menuItems || []).map((item, idx) => (
                  <div key={item.id} className="flex gap-2 mb-2 items-center">
                    <FormField id={`menu-label-${item.id}`} label="" value={item.label} onChange={e => {
                      const newItems = [...(draftData.menuItems || [])];
                      newItems[idx].label = e.target.value;
                      setDraftData(d => ({ ...d, menuItems: newItems }));
                    }} placeholder="Nombre" />
                    <FormField id={`menu-path-${item.id}`} label="" value={item.path} onChange={e => {
                      const newItems = [...(draftData.menuItems || [])];
                      newItems[idx].path = e.target.value;
                      setDraftData(d => ({ ...d, menuItems: newItems }));
                    }} placeholder="/ruta" />
                    <button onClick={() => setDraftData(d => ({ ...d, menuItems: (d.menuItems || []).filter((_, i) => i !== idx) }))} className="text-red-500">Eliminar</button>
                  </div>
                ))}
                <button onClick={() => setDraftData(d => ({ ...d, menuItems: [...(d.menuItems || []), { id: uuidv4(), label: '', path: '/' }] }))} className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Añadir Ítem</button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border mb-6">
              <h3 className="text-lg font-semibold mb-3">Estilos Footer</h3>
              <FormField id="footer-bg" label="Color Fondo Footer" value={draftData.footerStyles.backgroundColor} onChange={e => handleFooterStylesChange('backgroundColor', e.target.value)} />
              <FormField id="footer-font" label="Fuente Footer" value={draftData.headerMenuFooterStyles?.footerFont || ''} onChange={e => setDraftData(d => ({ ...d, headerMenuFooterStyles: { ...d.headerMenuFooterStyles, footerFont: e.target.value } }))} />
              <FormField id="footer-color" label="Color Texto Footer" value={draftData.headerMenuFooterStyles?.footerColor || ''} onChange={e => setDraftData(d => ({ ...d, headerMenuFooterStyles: { ...d.headerMenuFooterStyles, footerColor: e.target.value } }))} />
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Iconos Sociales</h4>
                {(draftData.socialIcons || []).map((icon, idx) => (
                  <div key={icon.id} className="flex gap-2 mb-2 items-center">
                    <FormField id={`social-name-${icon.id}`} label="" value={icon.name} onChange={e => {
                      const newIcons = [...(draftData.socialIcons || [])];
                      newIcons[idx].name = e.target.value;
                      setDraftData(d => ({ ...d, socialIcons: newIcons }));
                    }} placeholder="Nombre" />
                    <FormField id={`social-url-${icon.id}`} label="" value={icon.url} onChange={e => {
                      const newIcons = [...(draftData.socialIcons || [])];
                      newIcons[idx].url = e.target.value;
                      setDraftData(d => ({ ...d, socialIcons: newIcons }));
                    }} placeholder="https://..." />
                    <FormField id={`social-svg-${icon.id}`} label="" as="textarea" value={icon.iconSvg} onChange={e => {
                      const newIcons = [...(draftData.socialIcons || [])];
                      newIcons[idx].iconSvg = e.target.value;
                      setDraftData(d => ({ ...d, socialIcons: newIcons }));
                    }} placeholder="SVG" />
                    <button onClick={() => setDraftData(d => ({ ...d, socialIcons: (d.socialIcons || []).filter((_, i) => i !== idx) }))} className="text-red-500">Eliminar</button>
                  </div>
                ))}
                <button onClick={() => setDraftData(d => ({ ...d, socialIcons: [...(d.socialIcons || []), { id: uuidv4(), name: '', url: '', iconSvg: '' }] }))} className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Añadir Icono</button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border mb-6">
              <h3 className="text-lg font-semibold mb-3">Datos de Contacto</h3>
              <FormField id="contact-phone" label="Teléfono" value={draftData.contactInfo?.phone || ''} onChange={e => setDraftData(d => ({ ...d, contactInfo: { ...d.contactInfo, phone: e.target.value } }))} />
              <FormField id="contact-address" label="Dirección" value={draftData.contactInfo?.address || ''} onChange={e => setDraftData(d => ({ ...d, contactInfo: { ...d.contactInfo, address: e.target.value } }))} />
              <FormField id="contact-email" label="Email" value={draftData.contactInfo?.email || ''} onChange={e => setDraftData(d => ({ ...d, contactInfo: { ...d.contactInfo, email: e.target.value } }))} />
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Iconos Sociales Contacto</h4>
                {(draftData.contactInfo?.socialIcons || []).map((icon, idx) => (
                  <div key={icon.id} className="flex gap-2 mb-2 items-center">
                    <FormField id={`contact-social-name-${icon.id}`} label="" value={icon.name} onChange={e => {
                      const newIcons = [...(draftData.contactInfo?.socialIcons || [])];
                      newIcons[idx].name = e.target.value;
                      setDraftData(d => ({ ...d, contactInfo: { ...d.contactInfo, socialIcons: newIcons } }));
                    }} placeholder="Nombre" />
                    <FormField id={`contact-social-url-${icon.id}`} label="" value={icon.url} onChange={e => {
                      const newIcons = [...(draftData.contactInfo?.socialIcons || [])];
                      newIcons[idx].url = e.target.value;
                      setDraftData(d => ({ ...d, contactInfo: { ...d.contactInfo, socialIcons: newIcons } }));
                    }} placeholder="https://..." />
                    <FormField id={`contact-social-svg-${icon.id}`} label="" as="textarea" value={icon.iconSvg} onChange={e => {
                      const newIcons = [...(draftData.contactInfo?.socialIcons || [])];
                      newIcons[idx].iconSvg = e.target.value;
                      setDraftData(d => ({ ...d, contactInfo: { ...d.contactInfo, socialIcons: newIcons } }));
                    }} placeholder="SVG" />
                    <button onClick={() => setDraftData(d => ({ ...d, contactInfo: { ...d.contactInfo, socialIcons: (d.contactInfo?.socialIcons || []).filter((_, i) => i !== idx) } }))} className="text-red-500">Eliminar</button>
                  </div>
                ))}
                <button onClick={() => setDraftData(d => ({ ...d, contactInfo: { ...d.contactInfo, socialIcons: [...(d.contactInfo?.socialIcons || []), { id: uuidv4(), name: '', url: '', iconSvg: '' }] } }))} className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Añadir Icono</button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <h3 className="text-lg font-semibold mb-3">Estilos de Título y Texto</h3>
              <EstilosSection
                section={draftData.pages[0]?.sections.find(s => s.type === 'estilos')?.content || {}}
                editable={true}
                onChange={(field, value) => {
                  // Actualizar la sección de estilos en la primera página
                  setDraftData(prev => {
                    const newPages = [...prev.pages];
                    const estilosIndex = newPages[0].sections.findIndex(s => s.type === 'estilos');
                    if (estilosIndex !== -1) {
                      newPages[0].sections[estilosIndex].content = {
                        ...newPages[0].sections[estilosIndex].content,
                        [field]: value
                      };
                    } else {
                      // Si no existe, la crea
                      newPages[0].sections.push({
                        id: 'estilos-section',
                        type: 'estilos',
                        content: { [field]: value }
                      });
                    }
                    return { ...prev, pages: newPages };
                  });
                }}
              />
            </div>
          </>
        )}
        <footer className="mt-6 p-4 bg-white border-t border-gray-200 flex justify-end gap-2">
          <button onClick={handleDiscard} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Descartar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={!hasChanges}>Guardar</button>
        </footer>
      </main>
    </div>
  );
};