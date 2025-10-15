// Información de contacto editable
export interface ContactInfo {
  phone: string;
  address: string;
  email: string;
  socialIcons?: SocialIcon[];
}
// Menú editable
export interface MenuItem {
  id: string;
  label: string;
  path: string;
}

// Iconos sociales editables
export interface SocialIcon {
  id: string;
  name: string;
  url: string;
  iconSvg: string; // SVG string
}
export interface HeaderMenuFooterStyles {
  headerFont?: string;
  headerColor?: string;
  menuFont?: string;
  menuColor?: string;
  footerFont?: string;
  footerColor?: string;
}
// types.ts
import { v4 as uuidv4 } from 'uuid';

// Tipos básicos
export type SectionType = 'hero' | 'slides' | 'services' | 'products' | 'about' | 'map' | 'contact' | 'text' | 'image' | 'images' | 'html' | 'estilos';
export interface EstilosSection {
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
}

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
  icon?: string; // SVG o imagen base64
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
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
}

export interface ProductsSection {
  title: string;
  products: Product[];
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
}

export interface AboutSection {
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  button: { text: string; link: string };
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
}

export interface MapSection {
  title: string;
  embedUrl: string;
  titleFont?: string;
  titleColor?: string;
}

export interface ContactFormField {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  icon?: string; // SVG o imagen base64
}

export interface ContactSection {
  title: string;
  fields: ContactFormField[];
  submitText?: string;
  successMessage?: string;
  errorMessage?: string;
  recipientEmail?: string;
  // Porcentaje del ancho del formulario en desktop (0.3 - 0.8)
  formWidth?: number;
}

export interface TextSection {
  title: string;
  content: string;
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
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
  content: HeroSection | ServicesSection | ProductsSection | AboutSection | MapSection | ContactSection | TextSection | ImageSection | HtmlSection | EstilosSection;
}

// Interface para una página
export interface Page {
  id: string;
  name: string;
  path: string;
  sections: Section[];
}

// Interfaces para los estilos y la identidad del sitio

export interface HeaderMenuFooterStyles {
  headerFont?: string;
  headerColor?: string;
  menuFont?: string;
  menuColor?: string;
  footerFont?: string;
  footerColor?: string;
}
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

// Configuración global de WhatsApp
export interface WhatsAppConfig {
  phone: string;
  message: string;
  enabled: boolean;
}

// Interface principal del sitio
export interface SiteData {
  siteIdentity: SiteIdentity;
  globalStyles: GlobalStyles;
  headerStyles: HeaderFooterStyles;
  footerStyles: HeaderFooterStyles;
  headerMenuFooterStyles?: HeaderMenuFooterStyles;
  menuItems?: MenuItem[];
  socialIcons?: SocialIcon[];
  socialIconsHeader?: SocialIcon[];
  contactInfo?: ContactInfo;
  pages: Page[];
  whatsapp?: WhatsAppConfig;
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
      return {
        id: uuidv4(),
        type,
        content: {
          title: 'Contacto',
          fields: [
            { id: uuidv4(), label: 'Nombre', name: 'nombre', type: 'text', required: true },
            { id: uuidv4(), label: 'Email', name: 'email', type: 'email', required: true },
            { id: uuidv4(), label: 'Mensaje', name: 'mensaje', type: 'textarea', required: true },
          ],
          submitText: 'Enviar',
          successMessage: '¡Mensaje enviado!',
          errorMessage: 'Hubo un error. Intenta de nuevo.',
          recipientEmail: '',
          formWidth: 0.6,
        }
      };
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