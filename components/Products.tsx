import React, { useState, useMemo } from 'react';
import { Product } from '../types';

interface ProductsProps {
  title: string;
  products: Product[];
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
  editMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

const WhatsappIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
)

const Products: React.FC<ProductsProps> = ({ title, products, titleFont, titleColor, textFont, textColor, editMode, onUpdateField }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-bold"
            style={{fontFamily: titleFont || 'var(--heading-font)', color: titleColor || undefined}}
            contentEditable={!!editMode}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateField?.('title', e.currentTarget.innerText)}
          >{title}</h2>
          <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-4"></div>
        </div>
        <div className="flex justify-center mb-8 space-x-2 md:space-x-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm md:text-base font-medium rounded-full transition-colors duration-300 ${
                selectedCategory === category
                  ? 'bg-[var(--primary-color)] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="rounded-lg shadow-lg overflow-hidden group relative">
              <div className="relative overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                {/* Overlay con el nombre centrado al hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-white text-center px-3" style={{fontFamily: textFont || 'var(--body-font)', color: textColor || undefined}}>
                    {product.name}
                  </h3>
                </div>
                {/* Icono personalizado del producto (opcional) */}
                {product.icon && (
                  product.icon.startsWith('<svg') ? (
                    <div className="absolute top-4 left-4 bg-white/80 rounded-full p-2" dangerouslySetInnerHTML={{ __html: product.icon }} style={{ width: 40, height: 40 }} />
                  ) : (
                    <img src={product.icon} alt="icono" className="absolute top-4 left-4 w-10 h-10 object-contain bg-white/80 rounded-full p-1" />
                  )
                )}
                {/* Botón WhatsApp aparece en hover */}
                {product.whatsappLink && (
                  <a href={product.whatsappLink} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors opacity-0 group-hover:opacity-100 duration-300">
                    <WhatsappIcon />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
