import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SectionRenderer from './components/SectionRenderer';
import WhatsAppButton from './components/WhatsAppButton';
import { SiteData } from './types';
import { INITIAL_SITE_DATA } from './constants';
import DynamicStyle from './components/DynamicStyle';
import FrontendEditor from './components/FrontendEditor';
import { createNewSectionOfType, SectionType } from './types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const LOCAL_STORAGE_KEY = 'dynamic-site-data';
const BUILD_KEY = 'app-build-id';

const App: React.FC = () => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      // Migración desde clave antigua 'siteData' si existe
      const legacyDataRaw = localStorage.getItem('siteData');
      let parsed = storedData ? JSON.parse(storedData) : (legacyDataRaw ? JSON.parse(legacyDataRaw) : INITIAL_SITE_DATA);
      // Si hay datos legacy y no había dynamic, persistirlos a la nueva clave
      if (!storedData && legacyDataRaw) {
        localStorage.setItem(LOCAL_STORAGE_KEY, legacyDataRaw);
      }
      // Asegurar objeto whatsapp y migrar si falta/está vacío pero legacy lo tiene
      if (!parsed.whatsapp) {
        parsed.whatsapp = { phone: '', message: '¡Hola! Quiero más información.', enabled: true } as any;
      }
      if (legacyDataRaw) {
        try {
          const legacy = JSON.parse(legacyDataRaw);
          if (legacy?.whatsapp) {
            if (!parsed.whatsapp) parsed.whatsapp = legacy.whatsapp;
            else {
              parsed.whatsapp.phone = parsed.whatsapp.phone || legacy.whatsapp.phone || '';
              parsed.whatsapp.message = parsed.whatsapp.message || legacy.whatsapp.message || '¡Hola! Quiero más información.';
              parsed.whatsapp.enabled = typeof parsed.whatsapp.enabled === 'boolean' ? parsed.whatsapp.enabled : (legacy.whatsapp.enabled ?? true);
            }
          }
        } catch {}
      }
      // Si no hay páginas, forzar datos válidos
      if (!parsed.pages || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
        return INITIAL_SITE_DATA;
      }
      // MIGRACIÓN: asegurar que todos los productos y servicios tengan 'icon'
      parsed.pages.forEach((page: any) => {
        page.sections?.forEach((section: any) => {
          if (section.type === 'products' && Array.isArray(section.content.products)) {
            section.content.products.forEach((product: any) => {
              if (typeof product.icon === 'undefined') product.icon = '';
            });
          }
          if (section.type === 'services' && Array.isArray(section.content.services)) {
            section.content.services.forEach((service: any) => {
              if (typeof service.icon === 'undefined') service.icon = '';
            });
          }
          if (section.type === 'contact' && Array.isArray(section.content.fields)) {
            section.content.fields.forEach((field: any) => {
              if (typeof field.icon === 'undefined') field.icon = '';
            });
          }
        });
      });
      // MIGRACIÓN: asegurar alto de logo por defecto si falta
      if (!parsed.siteIdentity) parsed.siteIdentity = INITIAL_SITE_DATA.siteIdentity as any;
      if (typeof parsed.siteIdentity.logoHeightPx !== 'number') {
        parsed.siteIdentity.logoHeightPx = 40;
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    } catch (error) {
      console.error("Error loading data from localStorage", error);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
      return INITIAL_SITE_DATA;
    }
  });


  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [editMode, setEditMode] = useState<boolean>(false);
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('adminToken') === 'logged-in';


  // Admin panel y login ahora son páginas independientes (ruteadas)

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(siteData));
    } catch (error) {
      console.error("Error saving data to localStorage", error);
    }
  }, [siteData]);

  // Detectar despliegue nuevo y ofrecer limpiar datos locales
  useEffect(() => {
    try {
      const currentBuild = (globalThis as any).__APP_BUILD__ || 'dev';
      const storedBuild = localStorage.getItem(BUILD_KEY);
      if (storedBuild && storedBuild !== currentBuild) {
        // Si NO es admin, limpiar automáticamente sin preguntar
        if (!isAdmin) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.setItem(BUILD_KEY, String(currentBuild));
          window.location.reload();
          return;
        } else {
          // Admin: ofrecer mantener sus cambios locales
          const shouldClear = confirm('Hay una actualización del sitio disponible. ¿Deseas cargar el contenido publicado más reciente y limpiar tus datos locales?');
          if (shouldClear) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            localStorage.setItem(BUILD_KEY, String(currentBuild));
            window.location.reload();
            return;
          }
        }
      }
      if (!storedBuild) {
        localStorage.setItem(BUILD_KEY, String(currentBuild));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);


  // Admin panel y login ahora son páginas independientes (ruteadas)
  

  const currentPage = siteData.pages.find(p => p.path === currentPath) || siteData.pages[0];
  const waPhone = (siteData.whatsapp?.phone || '').replace(/[^0-9]/g, '');

  // Export/Import/Reset helpers for frontend editor
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(siteData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
      a.download = `site-data-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('No se pudo exportar el contenido');
    }
  };

  const handleImport = (data: any) => {
    try {
      if (!data || !Array.isArray(data.pages)) throw new Error('Formato inválido: falta pages');
      // Migraciones mínimas como en el init
      if (!data.whatsapp) data.whatsapp = { phone: '', message: '¡Hola! Quiero más información.', enabled: true } as any;
      data.pages.forEach((page: any) => {
        page.sections?.forEach((section: any) => {
          if (section.type === 'products' && Array.isArray(section.content.products)) {
            section.content.products.forEach((product: any) => {
              if (typeof product.icon === 'undefined') product.icon = '';
            });
          }
          if (section.type === 'services' && Array.isArray(section.content.services)) {
            section.content.services.forEach((service: any) => {
              if (typeof service.icon === 'undefined') service.icon = '';
            });
          }
          if (section.type === 'contact' && Array.isArray(section.content.fields)) {
            section.content.fields.forEach((field: any) => {
              if (typeof field.icon === 'undefined') field.icon = '';
            });
          }
        });
      });
      setSiteData(data as SiteData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      alert('El JSON importado no es válido.');
    }
  };

  const handleReset = () => {
    if (!confirm('Esto restablecerá todo el contenido a los valores iniciales. ¿Continuar?')) return;
    setSiteData(INITIAL_SITE_DATA);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITE_DATA));
  };

  const onDragEnd = (result: DropResult) => {
    if (!isAdmin || !editMode) return;
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const pageIndex = siteData.pages.findIndex(p => p.id === currentPage.id);
    if (pageIndex === -1) return;
    const sections = siteData.pages[pageIndex].sections;

    // Reordenar solo secciones visibles (no 'estilos') y reconstruir arreglo completo
    const visibles = sections.filter(s => s.type !== 'estilos');
    const [moved] = visibles.splice(source.index, 1);
    visibles.splice(destination.index, 0, moved);
    let vIdx = 0;
    const newSections = sections.map(s => (s.type !== 'estilos' ? visibles[vIdx++] : s));

    const newPages = siteData.pages.map((p, i) => (i === pageIndex ? { ...p, sections: newSections } : p));
    const updated = { ...siteData, pages: newPages };
    setSiteData(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <>
      <DynamicStyle 
        globalStyles={siteData.globalStyles} 
        headerStyles={siteData.headerStyles}
        footerStyles={siteData.footerStyles}
        headerMenuFooterStyles={siteData.headerMenuFooterStyles}
      />
  <div className="relative" style={{fontFamily: 'var(--body-font)', color: 'var(--body-color)', backgroundColor: 'var(--background-color)'}}>
        <Header 
          siteIdentity={siteData.siteIdentity} 
          pages={siteData.pages} 
          headerMenuFooterStyles={siteData.headerMenuFooterStyles}
        />
        <main>
          {!isAdmin || !editMode ? (
            currentPage?.sections
              .filter(section => section.type !== 'estilos' && section.type !== 'menuStyles')
              .map((section, idx) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                  contactInfo={siteData.contactInfo}
                  headerMenuFooterStyles={siteData.headerMenuFooterStyles}
                  pages={siteData.pages}
                  onUpdateHeaderMenuFooterStyles={(patch) => {
                    const updated = { ...siteData, headerMenuFooterStyles: { ...(siteData.headerMenuFooterStyles || {}), ...patch } };
                    setSiteData(updated);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                  }}
                  onUpdatePageMenuStyle={(pageId, patch) => {
                    const newPages = siteData.pages.map(p => p.id === pageId ? { ...p, menuStyle: { ...(p.menuStyle || {}), ...patch } } : p);
                    const updated = { ...siteData, pages: newPages };
                    setSiteData(updated);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                  }}
                  onUpdateContactInfo={(field, value) => {
                    const updated = { ...siteData, contactInfo: { ...(siteData.contactInfo || {}), [field]: value } };
                    setSiteData(updated);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                  }}
                />
              )) || <div className="container mx-auto py-20 text-center">404 - Página no encontrada</div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections-droppable">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {currentPage?.sections
                      .filter(section => section.type !== 'estilos' && section.type !== 'menuStyles')
                      .map((section, idx) => (
                        <>
                          {/* React key en el fragmento para evitar error de tipos en Draggable */}
                          <Draggable draggableId={section.id} index={idx}>
                            {(dragProvided) => (
                              <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                                <SectionRenderer
                                section={section}
                                contactInfo={siteData.contactInfo}
                                headerMenuFooterStyles={siteData.headerMenuFooterStyles}
                                pages={siteData.pages}
                                onUpdateHeaderMenuFooterStyles={(patch) => {
                                  const updated = { ...siteData, headerMenuFooterStyles: { ...(siteData.headerMenuFooterStyles || {}), ...patch } };
                                  setSiteData(updated);
                                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                                }}
                                onUpdatePageMenuStyle={(pageId, patch) => {
                                  const newPages = siteData.pages.map(p => p.id === pageId ? { ...p, menuStyle: { ...(p.menuStyle || {}), ...patch } } : p);
                                  const updated = { ...siteData, pages: newPages };
                                  setSiteData(updated);
                                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                                }}
                                editMode
                                onUpdateContactInfo={(field, value) => {
                                  const updated = { ...siteData, contactInfo: { ...(siteData.contactInfo || {}), [field]: value } };
                                  setSiteData(updated);
                                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                                }}
                                // Acciones siguen disponibles además del drag
                                onMoveUp={idx > 0 ? () => {
                                  const visible = currentPage.sections.filter(s => s.type !== 'estilos');
                                  const targetId = visible[idx].id;
                                  const prevId = visible[idx - 1].id;
                                  const newSections = [...currentPage.sections];
                                  const a = newSections.findIndex(s => s.id === prevId);
                                  const b = newSections.findIndex(s => s.id === targetId);
                                  if (a >= 0 && b >= 0) {
                                    [newSections[a], newSections[b]] = [newSections[b], newSections[a]];
                                    const newPages = siteData.pages.map(p => p.id === currentPage.id ? { ...p, sections: newSections } : p);
                                    setSiteData({ ...siteData, pages: newPages });
                                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...siteData, pages: newPages }));
                                  }
                                } : undefined}
                                onMoveDown={idx < currentPage.sections.filter(s=>s.type!=='estilos' && s.type!=='menuStyles').length - 1 ? () => {
                                  const visible = currentPage.sections.filter(s => s.type !== 'estilos' && s.type !== 'menuStyles');
                                  const targetId = visible[idx].id;
                                  const nextId = visible[idx + 1].id;
                                  const newSections = [...currentPage.sections];
                                  const a = newSections.findIndex(s => s.id === targetId);
                                  const b = newSections.findIndex(s => s.id === nextId);
                                  if (a >= 0 && b >= 0) {
                                    [newSections[a], newSections[b]] = [newSections[b], newSections[a]];
                                    const newPages = siteData.pages.map(p => p.id === currentPage.id ? { ...p, sections: newSections } : p);
                                    setSiteData({ ...siteData, pages: newPages });
                                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...siteData, pages: newPages }));
                                  }
                                } : undefined}
                                onDelete={() => {
                                  if (!confirm('¿Eliminar esta sección?')) return;
                                  const visible = currentPage.sections.filter(s=>s.type!=='estilos' && s.type!=='menuStyles');
                                  const delId = visible[idx].id;
                                  const newSections = currentPage.sections.filter(s => s.id !== delId);
                                  const newPages = siteData.pages.map(p => p.id === currentPage.id ? { ...p, sections: newSections } : p);
                                  setSiteData({ ...siteData, pages: newPages });
                                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...siteData, pages: newPages }));
                                }}
                                onUpdateField={(field, value) => {
                                  const visible = currentPage.sections.filter(s=>s.type!=='estilos' && s.type!=='menuStyles');
                                  const targetId = visible[idx].id;
                                  const newSections = currentPage.sections.map(s => s.id === targetId ? ({ ...s, content: { ...(s.content as any), [field]: value } }) : s);
                                  const newPages = siteData.pages.map(p => p.id === currentPage.id ? { ...p, sections: newSections } : p);
                                  setSiteData({ ...siteData, pages: newPages });
                                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...siteData, pages: newPages }));
                                }}
                                onAddBefore={(type) => {
                                  const visible = currentPage.sections.filter(s=>s.type!=='estilos' && s.type!=='menuStyles');
                                  const targetId = visible[idx].id;
                                  const realIndex = currentPage.sections.findIndex(s => s.id === targetId);
                                  const newSection = createNewSectionOfType(type);
                                  const newSections = [
                                    ...currentPage.sections.slice(0, realIndex),
                                    newSection,
                                    ...currentPage.sections.slice(realIndex),
                                  ];
                                  const newPages = siteData.pages.map(p => p.id === currentPage.id ? { ...p, sections: newSections } : p);
                                  setSiteData({ ...siteData, pages: newPages });
                                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...siteData, pages: newPages }));
                                }}
                                onAddAfter={(type) => {
                                  const visible = currentPage.sections.filter(s=>s.type!=='estilos' && s.type!=='menuStyles');
                                  const targetId = visible[idx].id;
                                  const realIndex = currentPage.sections.findIndex(s => s.id === targetId);
                                  const newSection = createNewSectionOfType(type);
                                  const newSections = [
                                    ...currentPage.sections.slice(0, realIndex + 1),
                                    newSection,
                                    ...currentPage.sections.slice(realIndex + 1),
                                  ];
                                  const newPages = siteData.pages.map(p => p.id === currentPage.id ? { ...p, sections: newSections } : p);
                                  setSiteData({ ...siteData, pages: newPages });
                                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...siteData, pages: newPages }));
                                }}
                                onDuplicate={() => {
                                  const visible = currentPage.sections.filter(s=>s.type!=='estilos' && s.type!=='menuStyles');
                                  const targetId = visible[idx].id;
                                  const realIndex = currentPage.sections.findIndex(s => s.id === targetId);
                                  const clone = JSON.parse(JSON.stringify(currentPage.sections[realIndex]));
                                  clone.id = Math.random().toString(36).slice(2);
                                  const newSections = [
                                    ...currentPage.sections.slice(0, realIndex + 1),
                                    clone,
                                    ...currentPage.sections.slice(realIndex + 1),
                                  ];
                                  const newPages = siteData.pages.map(p => p.id === currentPage.id ? { ...p, sections: newSections } : p);
                                  setSiteData({ ...siteData, pages: newPages });
                                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...siteData, pages: newPages }));
                                }}
                                />
                              </div>
                            )}
                          </Draggable>
                        </>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </main>
        <FrontendEditor
          isAdmin={isAdmin}
          editMode={editMode}
          setEditMode={setEditMode}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
          onAddSection={(type: SectionType) => {
            if (!isAdmin) return;
            const newSection = createNewSectionOfType(type);
            const newPages = siteData.pages.map(p => p.id === currentPage.id ? { ...p, sections: [...p.sections, newSection] } : p);
            setSiteData({ ...siteData, pages: newPages });
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...siteData, pages: newPages }));
          }}
        />
        <Footer siteIdentity={siteData.siteIdentity} headerMenuFooterStyles={siteData.headerMenuFooterStyles} />
        {siteData.whatsapp?.enabled && waPhone && (
          <WhatsAppButton phone={waPhone} message={siteData.whatsapp?.message} />
        )}
      </div>
    </>
  );
};

export default App;