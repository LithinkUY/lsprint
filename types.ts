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
// Estilo por item de menú/página
export interface MenuItemStyle {
  color?: string;
  underline?: boolean;
  hoverUnderline?: boolean;
  underlineColor?: string;
  underlineThickness?: number; // px
  underlineStyle?: 'solid' | 'dashed' | 'dotted';
}
export interface HeaderMenuFooterStyles {
  headerFont?: string;
  headerColor?: string;
  menuFont?: string;
  menuColor?: string;
  // Subrayado del menú
  menuUnderline?: boolean;
  menuHoverUnderline?: boolean;
  // Ajustes avanzados del subrayado del menú
  menuUnderlineColor?: string;
  menuUnderlineThickness?: number; // en px
  menuUnderlineStyle?: 'solid' | 'dashed' | 'dotted';
  footerFont?: string;
  footerColor?: string;
}
// types.ts
import { v4 as uuidv4 } from 'uuid';

// Tipos básicos
export type SectionType = 'hero' | 'slides' | 'services' | 'products' | 'about' | 'map' | 'contact' | 'text' | 'image' | 'images' | 'html' | 'logos' | 'estilos' | 'columns' | 'menuStyles';
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

// Logos de clientes
export interface ClientLogo {
  id: string;
  url: string;
  link?: string;
  alt?: string;
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
  // Visibilidad
  showTitle?: boolean;
  showUnderline?: boolean;
}

export interface ProductsSection {
  title: string;
  products: Product[];
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
  // Visibilidad
  showTitle?: boolean;
  showUnderline?: boolean;
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
  // Visibilidad
  showTitle?: boolean;
  showUnderline?: boolean;
  showSubtitle?: boolean;
}

export interface MapSection {
  title: string;
  embedUrl: string;
  titleFont?: string;
  titleColor?: string;
  // Visibilidad
  showTitle?: boolean;
  showUnderline?: boolean;
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
  // Texto opcional que aparece arriba del formulario
  description?: string;
  fields: ContactFormField[];
  submitText?: string;
  successMessage?: string;
  errorMessage?: string;
  recipientEmail?: string;
  // Porcentaje del ancho del formulario en desktop (0.3 - 0.8)
  formWidth?: number;
  // Estilos opcionales para título y texto (descripción)
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
  // Visibilidad
  showTitle?: boolean;
  showUnderline?: boolean;
  showDescription?: boolean;
}

export interface TextSection {
  title: string;
  content: string;
  titleFont?: string;
  titleColor?: string;
  textFont?: string;
  textColor?: string;
  // Visibilidad
  showTitle?: boolean;
  showUnderline?: boolean;
}

export interface ImageSection {
  title: string;
  displayMode: 'grid' | 'slider';
  images: ImageItem[];
  // Cantidad de columnas visibles en modo slider (desktop)
  sliderColumns?: number;
  // Autoplay y velocidad (ms)
  sliderAutoplay?: boolean;
  sliderSpeedMs?: number;
  // Tamaño del paso de avance: 1 en 1 o por columnas visibles
  sliderStep?: '1' | 'columns';
  // Pausar autoplay al pasar el mouse
  sliderPauseOnHover?: boolean;
  // Reducir columnas automáticamente en móvil/tablet
  sliderResponsive?: boolean;
  // Estilos opcionales para el título de la galería
  titleFont?: string;
  titleColor?: string;
  // Visibilidad
  showTitle?: boolean;
  showUnderline?: boolean;
}

export interface ClientLogosSection {
  title?: string;
  logos: ClientLogo[];
  autoplay?: boolean;
  speedMs?: number; // intervalo de auto-scroll
  // Estilos/toggles de cabecera
  titleFont?: string;
  titleColor?: string;
  showTitle?: boolean;
  showUnderline?: boolean;
}

export interface HtmlSection {
  htmlContent: string;
  // Estilos opcionales aplicados al bloque HTML
  textFont?: string;
  textColor?: string;
}

export interface Column {
  id: string;
  // ancho relativo 0-1, opcional. Si no hay, se reparte equitativo
  width?: number;
  sections: Section[];
}

export interface ColumnsSection {
  columns: Column[]; // mínimo 2
}

// Interface genérica para una sección
export interface Section {
  id: string;
  type: SectionType;
  content: HeroSection | ServicesSection | ProductsSection | AboutSection | MapSection | ContactSection | TextSection | ImageSection | HtmlSection | ClientLogosSection | EstilosSection | ColumnsSection;
}

// Interface para una página
export interface Page {
  id: string;
  name: string;
  path: string;
  sections: Section[];
  // Overrides de estilo del ítem del menú (opcional)
  menuStyle?: MenuItemStyle;
}

// Interfaces para los estilos y la identidad del sitio

export interface HeaderMenuFooterStyles {
  headerFont?: string;
  headerColor?: string;
  menuFont?: string;
  menuColor?: string;
  // Subrayado del menú
  menuUnderline?: boolean;
  menuHoverUnderline?: boolean;
  // Ajustes avanzados del subrayado del menú
  menuUnderlineColor?: string;
  menuUnderlineThickness?: number; // en px
  menuUnderlineStyle?: 'solid' | 'dashed' | 'dotted';
  footerFont?: string;
  footerColor?: string;
}
export interface SiteIdentity {
  logoTextPart1: string;
  logoTextPart2: string;
  logoImageUrl: string;
  // Alto del logo en el header (px)
  logoHeightPx?: number;
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
      return { id: uuidv4(), type, content: { title: '', services: [createNewService()], showTitle: true, showUnderline: true } };
    case 'products':
      return { id: uuidv4(), type, content: { title: '', products: [createNewProduct()], showTitle: true, showUnderline: true } };
    case 'about':
      return { id: uuidv4(), type, content: { title: '', subtitle: '', content: '', imageUrl: '', button: { text: '', link: '' }, showTitle: true, showUnderline: true, showSubtitle: true } };
    case 'map':
      return { id: uuidv4(), type, content: { title: '', embedUrl: '', showTitle: true, showUnderline: true } };
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
          showTitle: true,
          showUnderline: true,
          showDescription: true,
        }
      };
    case 'text':
      return { id: uuidv4(), type, content: { title: '', content: '', showTitle: true, showUnderline: true } };
    case 'image':
      return { id: uuidv4(), type, content: { title: '', displayMode: 'grid', images: [{ id: uuidv4(), url: 'https://via.placeholder.com/600x400' }], sliderColumns: 3, sliderAutoplay: false, sliderSpeedMs: 5000, sliderStep: '1', sliderPauseOnHover: true, sliderResponsive: true, showTitle: true, showUnderline: true } };
    case 'html':
      return { id: uuidv4(), type, content: { htmlContent: '' } };
    case 'logos':
      return {
        id: uuidv4(),
        type,
        content: {
          title: 'Clientes',
          logos: [
            { id: uuidv4(), url: 'https://via.placeholder.com/160x80?text=Logo+1' },
            { id: uuidv4(), url: 'https://via.placeholder.com/160x80?text=Logo+2' },
            { id: uuidv4(), url: 'https://via.placeholder.com/160x80?text=Logo+3' },
          ],
          autoplay: true,
          speedMs: 2500,
          showTitle: true,
          showUnderline: true,
        },
      };
    case 'columns':
      return {
        id: uuidv4(),
        type,
        content: {
          columns: [
            { id: uuidv4(), width: 0.5, sections: [] },
            { id: uuidv4(), width: 0.5, sections: [] },
          ],
        },
      };
    case 'menuStyles':
      // Sección invisible para editar estilos globales del menú
      return {
        id: uuidv4(),
        type,
        content: {},
      } as unknown as Section;
    default:
      throw new Error(`Tipo de sección no soportado: ${type}`);
  }
};