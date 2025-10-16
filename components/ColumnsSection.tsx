import React from 'react';
import { ColumnsSection as ColumnsSectionType, Section, SectionType, createNewSectionOfType } from '../types';
import SectionRenderer from './SectionRenderer';

interface Props extends ColumnsSectionType {
  editMode?: boolean;
  onChangeColumns?: (columns: ColumnsSectionType['columns']) => void;
  contactInfo?: any;
}

const ColumnsSection: React.FC<Props> = ({ columns, editMode, contactInfo, onChangeColumns }) => {
  const total = columns.reduce((acc, c) => acc + (c.width || 1), 0);

  const shouldCompact = (sec: Section): boolean => {
    const c: any = sec.content as any;
    switch (sec.type) {
      case 'text':
      case 'services':
      case 'products':
      case 'image':
      case 'map':
        return c?.showTitle === false;
      case 'about':
        return (c?.showTitle === false) && (c?.showSubtitle === false);
      case 'contact':
        return (c?.showTitle === false) && (c?.showDescription === false);
      default:
        return false;
    }
  };

  const updateWidth = (colId: string, percent: number) => {
    if (!onChangeColumns) return;
    const newCols = columns.map(c => c.id === colId ? { ...c, width: Math.max(0.2, Math.min(0.8, percent)) } : c);
    onChangeColumns(newCols);
  };

  const addSectionToCol = (colId: string, type: SectionType) => {
    if (!onChangeColumns) return;
    const newCols = columns.map(c => c.id === colId ? { ...c, sections: [...c.sections, createNewSectionOfType(type)] } : c);
    onChangeColumns(newCols);
  };

  const deleteSectionInCol = (colId: string, sectionId: string) => {
    if (!onChangeColumns) return;
    const newCols = columns.map(c => c.id === colId ? { ...c, sections: c.sections.filter(s => s.id !== sectionId) } : c);
    onChangeColumns(newCols);
  };

  const moveSectionInCol = (colId: string, fromIdx: number, toIdx: number) => {
    if (!onChangeColumns) return;
    const newCols = columns.map(c => {
      if (c.id !== colId) return c;
      const list = [...c.sections];
      const [m] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, m);
      return { ...c, sections: list };
    });
    onChangeColumns(newCols);
  };
  return (
    <section className="py-10">
      <div className="container mx-auto px-6 flex gap-6 items-start">
        {columns.map(col => {
          const percent = ((col.width || 1) / total) * 100;
          return (
          <div
            key={col.id}
            className={`${editMode ? 'min-h-[50px] border-dashed border-2 border-gray-200 p-2' : 'p-0'} rounded relative`}
            style={{ flex: `0 0 ${percent}%`, maxWidth: `${percent}%` }}
          >
            {editMode && (
              <div className="absolute -top-8 left-0 flex items-center gap-2">
                <label className="text-xs text-gray-600">Ancho</label>
                <input type="range" min={20} max={80} value={Math.round((col.width ?? 0.5) * 100)} onChange={e => updateWidth(col.id, Number(e.target.value)/100)} />
                <span className="text-xs text-gray-500">{Math.round((col.width ?? 0.5) * 100)}%</span>
                <div className="relative">
                  <details>
                    <summary className="text-xs bg-blue-500 text-white px-2 py-1 rounded cursor-pointer select-none">+ Sección</summary>
                    <div className="absolute z-50 mt-1 bg-white border shadow rounded p-2 grid grid-cols-2 gap-2 w-56">
                      {(['text','image','html','about','services','products','map','contact','logos'] as SectionType[]).map(t => (
                        <button key={t} className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-left" onClick={() => addSectionToCol(col.id, t)}>{t}</button>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            )}
            {col.sections.length === 0 && editMode && (
              <div className="text-gray-400 text-sm">Columna vacía</div>
            )}
            {col.sections.map((sec, idx) => (
              <div key={sec.id} className="relative group">
                {editMode && (
                  <div className="absolute right-1 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-40">
                    <button className="text-[10px] bg-white border rounded px-1 py-0.5 shadow" disabled={idx===0} onClick={() => moveSectionInCol(col.id, idx, Math.max(0, idx-1))}>↑</button>
                    <button className="text-[10px] bg-white border rounded px-1 py-0.5 shadow" disabled={idx===col.sections.length-1} onClick={() => moveSectionInCol(col.id, idx, Math.min(col.sections.length-1, idx+1))}>↓</button>
                    <button className="text-[10px] bg-red-500 text-white rounded px-1 py-0.5 shadow" onClick={() => deleteSectionInCol(col.id, sec.id)}>✕</button>
                  </div>
                )}
                <SectionRenderer
                  section={sec}
                  contactInfo={contactInfo}
                  editMode={editMode}
                  compact={shouldCompact(sec)}
                  onUpdateField={(field, value) => {
                    if (!onChangeColumns) return;
                    const newCols = columns.map(c => {
                      if (c.id !== col.id) return c;
                      const newSecs = c.sections.map((s, sIdx) => sIdx === idx ? ({ ...s, content: { ...(s.content as any), [field]: value } }) : s);
                      return { ...c, sections: newSecs };
                    });
                    onChangeColumns(newCols);
                  }}
                />
              </div>
            ))}
          </div>
        )})}
      </div>
    </section>
  );
}

export default ColumnsSection;
