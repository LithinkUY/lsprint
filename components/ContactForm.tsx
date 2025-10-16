import React, { useState } from 'react';
import { ContactSection, ContactInfo } from '../types';

interface ContactFormProps {
  section: ContactSection;
  contactInfo?: ContactInfo;
  editMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
  onUpdateContactInfo?: (field: keyof ContactInfo, value: string) => void;
  compact?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ section, contactInfo, editMode, onUpdateField, onUpdateContactInfo, compact }) => {
  const fields = Array.isArray(section.fields) ? section.fields : [];
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.id, ''])));
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const contact = contactInfo;
  const hasSide = Boolean(contact?.address || contact?.phone || contact?.email);
  const formWidth = Math.min(0.8, Math.max(0.3, section.formWidth ?? 0.6));

  const handleChange = (id: string, value: string) => {
    setForm(f => ({ ...f, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí deberías integrar con un backend o servicio de email
    setStatus('success');
  };

  if (status === 'success') return <div className="p-6 bg-green-100 text-green-700 rounded">{section.successMessage || '¡Mensaje enviado!'}</div>;
  if (status === 'error') return <div className="p-6 bg-red-100 text-red-700 rounded">{section.errorMessage || 'Hubo un error. Intenta de nuevo.'}</div>;

  if (!Array.isArray(section.fields) || fields.length === 0) {
    return <div className="p-6 bg-yellow-100 text-yellow-700 rounded">No hay campos configurados para el formulario de contacto.</div>;
  }
  return (
    <div className={compact ? 'py-6' : 'container mx-auto px-6 py-16'}>
      {/* Título de la sección */}
      {(section.showTitle || section.showDescription || editMode) && (
  <div className={compact ? 'text-center mb-4' : 'text-center mb-10'}>
          {section.showTitle && (
            <h2
              className="text-4xl font-bold"
              style={{ fontFamily: section.titleFont || 'var(--heading-font)', color: section.titleColor || undefined }}
              contentEditable={!!editMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateField?.('title', e.currentTarget.innerText)}
            >
              {section.title}
            </h2>
          )}
          {section.showUnderline && <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>}
          {section.showDescription && (
            <p
              className="mt-4 max-w-2xl mx-auto"
              style={{ fontFamily: section.textFont || 'var(--body-font)', color: section.textColor || '#6b7280' }}
              contentEditable={!!editMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateField?.('description', e.currentTarget.innerText)}
            >
              {section.description || 'Escribe aquí una breve descripción de contacto...'}
            </p>
          )}
        </div>
      )}
  <div className={compact ? 'grid grid-cols-1 md:grid-cols-12 gap-4 items-start' : 'max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start'}>
        {/* Columna del formulario */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-12" style={{ gridColumn: `span ${hasSide ? Math.round(formWidth * 12) : 12} / span ${hasSide ? Math.round(formWidth * 12) : 12}` }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.id}>
                <label className="block mb-1 font-medium">{field.label}{field.required && ' *'}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full border rounded p-2"
                    required={field.required}
                    value={form[field.id]}
                    onChange={e => handleChange(field.id, e.target.value)}
                  />
                ) : (
                  <input
                    className="w-full border rounded p-2"
                    type={field.type}
                    required={field.required}
                    value={form[field.id]}
                    onChange={e => handleChange(field.id, e.target.value)}
                  />
                )}
              </div>
            ))}
            <button type="submit" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hover:bg-opacity-90">
              <span
                contentEditable={!!editMode}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateField?.('submitText', e.currentTarget.innerText)}
              >
                {section.submitText || 'Enviar'}
              </span>
            </button>
          </form>
        </div>

        {/* Columna lateral con info de contacto (solo si existe contenido) */}
        {hasSide && (
          <div className="md:col-span-12" style={{ gridColumn: `span ${12 - Math.round(formWidth * 12)} / span ${12 - Math.round(formWidth * 12)}` }}>
            <div className="grid grid-cols-1 gap-6">
              {contact?.address && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-semibold mb-1">Dirección</h4>
                  <p
                    className="text-gray-600"
                    contentEditable={!!editMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateContactInfo?.('address', e.currentTarget.innerText)}
                  >
                    {contact.address}
                  </p>
                </div>
              )}
              {contact?.phone && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-semibold mb-1">Teléfono</h4>
                  <p
                    className="text-gray-600"
                    contentEditable={!!editMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateContactInfo?.('phone', e.currentTarget.innerText)}
                  >
                    {contact.phone}
                  </p>
                </div>
              )}
              {contact?.email && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p
                    className="text-gray-600"
                    contentEditable={!!editMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateContactInfo?.('email', e.currentTarget.innerText)}
                  >
                    {contact.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
