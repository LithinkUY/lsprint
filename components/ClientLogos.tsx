import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ClientLogosSection } from '../types';

type Props = ClientLogosSection & {
  editMode?: boolean;
  compact?: boolean;
  onUpdateField?: (field: string, value: any) => void;
};

const ClientLogos: React.FC<Props> = ({ title, logos, autoplay = true, speedMs = 2500, showTitle = true, showUnderline = true, titleFont, titleColor, editMode, compact, onUpdateField }) => {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<any>(null);
  const hasMany = (logos?.length || 0) > 5;

  useEffect(() => {
    if (!autoplay || !hasMany) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => i + 1);
    }, Math.max(1200, speedMs));
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [autoplay, speedMs, hasMany]);

  const items = useMemo(() => logos || [], [logos]);
  const looped = useMemo(() => items.concat(items).concat(items), [items]);

  return (
    <section className={compact ? 'py-6' : 'py-16'}>
      <div className={compact ? '' : 'container mx-auto px-6'}>
        {(showTitle || editMode) && (
          <div className={compact ? 'text-center mb-4' : 'text-center mb-10'}>
            {showTitle && (
              <h2
                className="text-2xl md:text-3xl font-semibold"
                style={{ fontFamily: titleFont || 'var(--heading-font)', color: titleColor || undefined }}
                contentEditable={!!editMode}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateField?.('title', e.currentTarget.innerText)}
              >
                {title || 'Nuestros clientes'}
              </h2>
            )}
            {showUnderline && <div className="w-16 h-1 bg-[var(--primary-color)] mx-auto mt-3" />}
          </div>
        )}

        {/* Carrusel infinito simple */}
        <div className="overflow-hidden">
          <div
            className="flex items-center gap-10 whitespace-nowrap"
            style={{ transform: `translateX(-${(idx % (items.length || 1)) * 180}px)`, transition: 'transform 600ms ease' }}
          >
            {looped.map((logo, i) => (
              <a
                key={`${logo.id}-${i}`}
                href={logo.link || '#'}
                target={logo.link ? '_blank' : undefined}
                rel={logo.link ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                style={{ width: 160, height: 80 }}
              >
                <img src={logo.url} alt={logo.alt || 'logo'} className="object-contain max-h-full max-w-full" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
