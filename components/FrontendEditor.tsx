import React, { useEffect, useRef, useState } from 'react';
import { SectionType } from '../types';

interface FrontendEditorProps {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  onAddSection: (type: SectionType) => void;
}

const AVAILABLE_TYPES: SectionType[] = ['hero','services','products','about','map','contact','text','image','html','columns'];

const FrontendEditor: React.FC<FrontendEditorProps> = ({ isAdmin, editMode, setEditMode, onAddSection }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setOpen(false);
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
    </div>
  );
};

export default FrontendEditor;
