import React from 'react';
import { ContactSection } from '../types';

const Contact: React.FC<ContactSection> = ({ title, address, phone, email }) => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold" style={{fontFamily: 'var(--heading-font)'}}>{title}</h2>
          <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Dirección</h3>
            <p className="text-gray-600">{address}</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
            <p className="text-gray-600">{phone}</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600">{email}</p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Contact;
