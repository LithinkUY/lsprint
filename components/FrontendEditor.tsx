import React, { useEffect, useRef, useState } from 'react';
import { SectionType } from '../types';

interface FrontendEditorProps {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  onAddSection: (type: SectionType) => void;
  onExport?: () => void;
  onImport?: (data: any) => void;
  onReset?: () => void;
}

const AVAILABLE_TYPES: SectionType[] = ['hero','services','products','about','map','contact','text','image','html','logos','columns','menuStyles'];

const FrontendEditor: React.FC<FrontendEditorProps> = ({ isAdmin, editMode, setEditMode, onAddSection, onExport, onImport, onReset }) => {
  const [open, setOpen] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!moreRef.current) return;
      if (moreRef.current.contains(e.target as Node)) return;
      setOpenMore(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  if (!isAdmin) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg border rounded-full px-4 py-2 flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={editMode} onChange={e => setEditMode(e.target.checked)} />
        Modo edición
      </label>
      <div className="relative" ref={menuRef}>
        <button
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => setOpen(v => !v)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          Añadir sección
        </button>
        {open && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border shadow rounded p-2 grid grid-cols-2 gap-2 w-64">
            {AVAILABLE_TYPES.map(t => (
              <button
                key={t}
                className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-left"
                onClick={() => { onAddSection(t); setOpen(false); }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
      {(onExport || onImport || onReset) && (
        <div className="relative" ref={moreRef}>
          <button
            className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => setOpenMore(v => !v)}
            aria-haspopup="true"
            aria-expanded={openMore}
            title="Más opciones"
          >
            Más
          </button>
          {openMore && (
            <div className="absolute bottom-full mb-2 right-0 bg-white border shadow rounded p-2 flex flex-col gap-2 w-56">
              {onExport && (
                <button className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-left" onClick={() => { onExport(); setOpenMore(false); }}>Exportar contenido (JSON)</button>
              )}
              {onImport && (
                <label className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-left cursor-pointer">
                  Importar contenido (JSON)
                  <input type="file" accept="application/json" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      try {
                        const data = JSON.parse(String(reader.result || '{}'));
                        onImport(data);
                        setOpenMore(false);
                      } catch (err) {
                        alert('Archivo JSON inválido');
                      }
                    };
                    reader.readAsText(file);
                    // reset input to allow re-importing same file
                    (e.target as HTMLInputElement).value = '';
                  }} />
                </label>
              )}
              {onReset && (
                <button className="text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded px-2 py-1 text-left" onClick={() => { onReset(); setOpenMore(false); }}>Restablecer contenido inicial</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FrontendEditor;
