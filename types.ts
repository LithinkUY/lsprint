// types.ts
import { v4 as uuidv4 } from 'uuid';

// Tipos básicos
export type SectionType = 'hero' | 'slides' | 'services' | 'products' | 'about' | 'map' | 'contact' | 'text' | 'image' | 'images' | 'html';

// Interfaces para los datos de cada sección
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string;
  button: { text: string; link: string };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  whatsappLink?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  whatsappLink?: string;
}

export interface ImageItem {
  id: string;
  url: string;
}

// Interfaces para el contenido de cada tipo de sección
export interface HeroSection {
  slides: HeroSlide[];
}

export interface ServicesSection {
  title: string;
  services: Service[];
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
  button: { text: string; link: string };
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

export interface ImageSection {
  title: string;
  displayMode: 'grid' | 'slider';
  images: ImageItem[];
}

export interface HtmlSection {
  htmlContent: string;
}

// Interface genérica para una sección
export interface Section {
  id: string;
  type: SectionType;
  content: HeroSection | ServicesSection | ProductsSection | AboutSection | MapSection | ContactSection | TextSection | ImageSection | HtmlSection;
}

// Interface para una página
export interface Page {
  id: string;
  name: string;
  path: string;
  sections: Section[];
}

// Interfaces para los estilos y la identidad del sitio
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

// Interface principal del sitio
export interface SiteData {
  siteIdentity: SiteIdentity;
  globalStyles: GlobalStyles;
  headerStyles: HeaderFooterStyles;
  footerStyles: HeaderFooterStyles;
  pages: Page[];
}

// Funciones de creación
export const createNewSlide = (): HeroSlide => ({
  id: uuidv4(),
  title: '',
  subtitle: '',
  imageUrl: '',
  button: { text: '', link: '' },
});

export const createNewService = (): Service => ({
  id: uuidv4(),
  title: '',
  description: '',
  icon: '',
});

export const createNewProduct = (): Product => ({
  id: uuidv4(),
  name: '',
  category: '',
  imageUrl: '',
});

export const createNewPage = (name: string, path: string): Page => ({
  id: uuidv4(),
  name,
  path,
  sections: [],
});

export const createNewSectionOfType = (type: SectionType): Section => {
  switch (type) {
    case 'hero':
      return { id: uuidv4(), type, content: { slides: [createNewSlide()] } };
    case 'services':
      return { id: uuidv4(), type, content: { title: '', services: [createNewService()] } };
    case 'products':
      return { id: uuidv4(), type, content: { title: '', products: [createNewProduct()] } };
    case 'about':
      return { id: uuidv4(), type, content: { title: '', subtitle: '', content: '', imageUrl: '', button: { text: '', link: '' } } };
    case 'map':
      return { id: uuidv4(), type, content: { title: '', embedUrl: '' } };
    case 'contact':
      return { id: uuidv4(), type, content: { title: '', address: '', phone: '', email: '' } };
    case 'text':
      return { id: uuidv4(), type, content: { title: '', content: '' } };
    case 'image':
      return { id: uuidv4(), type, content: { title: '', displayMode: 'grid', images: [{ id: uuidv4(), url: 'https://via.placeholder.com/600x400' }] } };
    case 'html':
      return { id: uuidv4(), type, content: { htmlContent: '' } };
    default:
      throw new Error(`Tipo de sección no soportado: ${type}`);
  }
};