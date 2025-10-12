import { v4 as uuidv4 } from 'uuid';

// Base types
export type SectionType = 'hero' | 'services' | 'products' | 'about' | 'map' | 'contact' | 'text' | 'image' | 'html';

export interface SiteIdentity {
  logoTextPart1: string;
  logoTextPart2: string;
  logoImageUrl: string;
}

export interface GlobalStyles {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
}

export interface HeaderFooterStyles {
  backgroundColor: string;
  textColor: string;
}

export interface Page {
  id: string;
  name: string;
  path: string;
  sections: Section[];
}

export interface SiteData {
  siteIdentity: SiteIdentity;
  globalStyles: GlobalStyles;
  headerStyles: HeaderFooterStyles;
  footerStyles: HeaderFooterStyles;
  pages: Page[];
}

// Section-specific content types
export interface HeroSlide {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  title: string;
  subtitle: string;
  button: {
    text: string;
    link: string;
  };
}

export interface HeroSection {
  slides: HeroSlide[];
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  whatsappLink?: string;
}

export interface ServicesSection {
  title: string;
  services: Service[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  whatsappLink?: string;
}

export interface ProductsSection {
  title: string;
  products: Product[];
}

export interface AboutSection {
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  button: {
    text: string;
    link: string;
  };
}

export interface MapSection {
  title: string;
  embedUrl: string;
}

export interface ContactSection {
  title: string;
  address: string;
  phone: string;
  email: string;
}

export interface TextSection {
  title: string;
  content: string;
}

export interface ImageItem {
    id: string;
    url: string;
}

export interface ImageSection {
    title: string;
    images: ImageItem[];
    displayMode: 'grid' | 'slider';
}

export interface HtmlSection {
    htmlContent: string;
}


// Generic Section type
export interface Section {
  id: string;
  type: SectionType;
  content: HeroSection | ServicesSection | ProductsSection | AboutSection | MapSection | ContactSection | TextSection | ImageSection | HtmlSection;
}

// Factory functions
export const createNewSlide = (): HeroSlide => ({
    id: uuidv4(),
    imageUrl: 'https://via.placeholder.com/1920x1080',
    title: 'Nuevo Título',
    subtitle: 'Nuevo subtítulo para la diapositiva.',
    button: { text: 'Botón', link: '#' },
});

export const createNewService = (): Service => ({
    id: uuidv4(),
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
    title: 'Nuevo Servicio',
    description: 'Descripción del nuevo servicio.',
});

export const createNewProduct = (): Product => ({
    id: uuidv4(),
    name: 'Nuevo Producto',
    category: 'Nueva Categoría',
    imageUrl: 'https://via.placeholder.com/600x400',
});

export const createNewPage = (name: string, path: string): Page => ({
    id: uuidv4(),
    name,
    path,
    sections: [],
});

export const createNewSectionOfType = (type: SectionType): Section => {
    const id = uuidv4();
    switch (type) {
        case 'hero':
            return { id, type, content: { slides: [createNewSlide()] } };
        case 'services':
            return { id, type, content: { title: 'Nuevos Servicios', services: [createNewService()] } };
        case 'products':
            return { id, type, content: { title: 'Nuevos Productos', products: [createNewProduct()] } };
        case 'about':
            return { id, type, content: { title: 'Sobre Nosotros', subtitle: 'Subtítulo', content: 'Contenido...', imageUrl: 'https://via.placeholder.com/1200x800', button: { text: 'Botón', link: '#' } } };
        case 'map':
            return { id, type, content: { title: 'Ubicación', embedUrl: '' } };
        case 'contact':
            return { id, type, content: { title: 'Contacto', address: 'Dirección', phone: 'Teléfono', email: 'email@example.com' } };
        case 'text':
            return { id, type, content: { title: 'Título de Texto', content: 'Contenido de texto...' } };
        case 'image':
            return { id, type, content: { title: 'Galería de Imágenes', displayMode: 'grid', images: [{id: uuidv4(), url: 'https://via.placeholder.com/600x400'}] } };
        case 'html':
            return { id, type, content: { htmlContent: '<div>Tu código HTML aquí</div>' } };
        default:
            // This should not happen with TypeScript checking SectionType
            throw new Error(`Unknown section type: ${type}`);
    }
};
