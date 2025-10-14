import React, { useState, useEffect } from 'react';
import { SiteData, Page, Section, SectionType, GlobalStyles, HeaderFooterStyles, SiteIdentity, HeroSection, ServicesSection, ProductsSection, AboutSection, MapSection, ContactSection, TextSection, ImageSection, HtmlSection, createNewSlide, createNewService, createNewProduct, createNewPage, createNewSectionOfType, HeroSlide, Service, Product, ImageItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
    setSiteData(draftData);
    localStorage.setItem('siteData', JSON.stringify(draftData));
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
                <FormField id={`p-wa-${p.id}`} label="Enlace WhatsApp (Opcional)" value={p.whatsappLink || ''} onChange={createListItemChangeHandler<Product, 'whatsappLink'>('products', i, 'whatsappLink')} />
              </CollapsibleCard>
            ))}
            <button onClick={() => updateList('products', [...productsContent.products, createNewProduct()])} className="mt-2 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              Añadir Producto
            </button>
          </div>
        );
      }
      case 'about':
        return (
          <div>
            <FormField id="ab-t" label="Título" value={(content as AboutSection).title} onChange={e => updateField('title', e.target.value)} />
            <FormField id="ab-st" label="Subtítulo" value={(content as AboutSection).subtitle} onChange={e => updateField('subtitle', e.target.value)} />
            <FormField id="ab-c" as="textarea" label="Contenido" value={(content as AboutSection).content} onChange={e => updateField('content', e.target.value)} />
            <FormField id="ab-i" label="URL Imagen" value={(content as AboutSection).imageUrl} onChange={e => updateField('imageUrl', e.target.value)} />
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
              {(content as AboutSection).imageUrl && (content as AboutSection).imageUrl.startsWith('data:image') && (
                <img src={(content as AboutSection).imageUrl} alt="preview" className="mt-1 h-16 object-contain" />
              )}
            </div>
            <FormField id="ab-bt" label="Texto del Botón" value={(content as AboutSection).button.text} onChange={e => updateButtonField('text', e.target.value)} />
            <FormField id="ab-bl" label="Enlace del Botón" value={(content as AboutSection).button.link} onChange={e => updateButtonField('link', e.target.value)} />
          </div>
        );
      case 'map':
        return (
          <div>
            <FormField id="map-t" label="Título de la Sección" value={(content as MapSection).title} onChange={e => updateField('title', e.target.value)} />
            <FormField id="map-url" label="URL de Google Maps Embed" as="textarea" value={(content as MapSection).embedUrl} onChange={e => updateField('embedUrl', e.target.value)} />
          </div>
        );
      case 'contact':
        return (
          <div>
            <FormField id="c-t" label="Título" value={(content as ContactSection).title} onChange={e => updateField('title', e.target.value)} />
            <FormField id="c-a" label="Dirección" value={(content as ContactSection).address} onChange={e => updateField('address', e.target.value)} />
            <FormField id="c-p" label="Teléfono" value={(content as ContactSection).phone} onChange={e => updateField('phone', e.target.value)} />
            <FormField id="c-e" label="Email" value={(content as ContactSection).email} onChange={e => updateField('email', e.target.value)} />
          </div>
        );
      case 'text':
        return (
          <div>
            <FormField id="txt-t" label="Título" value={(content as TextSection).title} onChange={e => updateField('title', e.target.value)} />
            <FormField id="txt-c" as="textarea" label="Contenido" value={(content as TextSection).content} onChange={e => updateField('content', e.target.value)} />
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
      default:
        return <p>Editor no disponible para el tipo de sección: {section.type}</p>;
    }
  };

  const selectedPage = draftData.pages.find(p => p.id === selectedPageId);
  const selectedPageIndex = draftData.pages.findIndex(p => p.id === selectedPageId);
  const sectionTypes: SectionType[] = ['hero', 'services', 'products', 'about', 'map', 'contact', 'text', 'image', 'html'];

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
          </div>
        )}
        {activeTab === 'estilos' && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Estilos Globales</h3>
            <FormField id="global-bg" label="Color de Fondo" value={draftData.globalStyles.backgroundColor} onChange={e => handleGlobalStylesChange('backgroundColor', e.target.value)} />
            <FormField id="header-bg" label="Color Fondo Header" value={draftData.headerStyles.backgroundColor} onChange={e => handleHeaderStylesChange('backgroundColor', e.target.value)} />
            <FormField id="footer-bg" label="Color Fondo Footer" value={draftData.footerStyles.backgroundColor} onChange={e => handleFooterStylesChange('backgroundColor', e.target.value)} />
          </div>
        )}
        <footer className="mt-6 p-4 bg-white border-t border-gray-200 flex justify-end gap-2">
          <button onClick={handleDiscard} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Descartar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={!hasChanges}>Guardar</button>
        </footer>
      </main>
    </div>
  );
};