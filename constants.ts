import { SiteData } from './types';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_SITE_DATA: SiteData = {
  siteIdentity: {
    logoTextPart1: 'GB',
    logoTextPart2: 'PRINT',
    logoImageUrl: '',
  },
  globalStyles: {
    primaryColor: '#3b82f6',
    backgroundColor: '#f8fafc',
    textColor: '#334155',
    headingFont: 'Montserrat',
    bodyFont: 'Open Sans',
  },
  headerStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
  },
  footerStyles: {
    backgroundColor: '#111827',
    textColor: '#d1d5db',
  },
  pages: [
    {
      id: uuidv4(),
      name: 'Inicio',
      path: '/',
      sections: [
        {
          id: uuidv4(),
          type: 'hero',
          content: {
            slides: [
              {
                id: uuidv4(),
                imageUrl: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                title: 'Soluciones Gráficas Integrales',
                subtitle: 'Calidad, innovación y compromiso en cada proyecto.',
                button: { text: 'Conoce Nuestros Servicios', link: '#services' },
              },
              {
                id: uuidv4(),
                imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                title: 'Tu Marca, Nuestra Pasión',
                subtitle: 'Desde el diseño hasta la impresión, cuidamos cada detalle.',
                button: { text: 'Ver Portafolio', link: '#products' },
              },
            ],
          },
        },
        {
          id: uuidv4(),
          type: 'services',
          content: {
            title: 'Nuestros Servicios',
            services: [
              {
                id: uuidv4(),
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>',
                title: 'Diseño Gráfico',
                description: 'Creamos identidades visuales impactantes y coherentes para tu marca.',
                whatsappLink: 'https://wa.me/1234567890?text=Hola,%20quisiera%20más%20información%20sobre%20Diseño%20Gráfico'
              },
              {
                id: uuidv4(),
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>',
                title: 'Impresión Digital',
                description: 'Soluciones de impresión de alta calidad con tiempos de entrega rápidos.',
              },
              {
                id: uuidv4(),
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>',
                title: 'Gigantografías',
                description: 'Impacta a lo grande con nuestros carteles y banners de gran formato.',
                whatsappLink: 'https://wa.me/1234567890?text=Hola,%20quisiera%20más%20información%20sobre%20Gigantografías'
              },
            ],
          },
        },
        {
          id: uuidv4(),
          type: 'products',
          content: {
            title: 'Nuestros Productos',
            products: [
              { id: uuidv4(), name: 'Tarjetas de Presentación', category: 'Papelería', imageUrl: 'https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?auto=compress&cs=tinysrgb&w=600', whatsappLink: 'https://wa.me/1234567890?text=Hola,%20quisiera%20cotizar%20Tarjetas%20de%20Presentación' },
              { id: uuidv4(), name: 'Folletos y Volantes', category: 'Publicidad', imageUrl: 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { id: uuidv4(), name: 'Banners Roll-Up', category: 'Eventos', imageUrl: 'https://images.pexels.com/photos/7175483/pexels-photo-7175483.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { id: uuidv4(), name: 'Stickers Personalizados', category: 'Papelería', imageUrl: 'https://images.pexels.com/photos/11051699/pexels-photo-11051699.jpeg?auto=compress&cs=tinysrgb&w=600' },
            ],
          },
        },
        {
          id: uuidv4(),
          type: 'about',
          content: {
            title: 'Sobre Nosotros',
            subtitle: 'Comprometidos con la excelencia',
            content: 'Somos un equipo apasionado por el diseño y la impresión, dedicado a transformar tus ideas en realidades tangibles. Con años de experiencia en el sector, garantizamos resultados que superan tus expectativas.',
            imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            button: { text: 'Contáctanos', link: '#contact' },
          },
        },
        {
          id: uuidv4(),
          type: 'map',
          content: {
            title: 'Nuestra Ubicación',
            embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.968361048593!2d-77.03687008518738!3d-12.046374991470533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8b5d7a7a7a7%3A0x9ae6d5a9b7b4b4b4!2sPlaza%20Mayor%2C%20Lima!5e0!3m2!1ses!2spe!4v1622840935544!5m2!1ses!2spe',
          }
        },
        {
          id: uuidv4(),
          type: 'contact',
          content: {
            title: 'Contáctanos',
            address: 'Av. Principal 123, Miraflores, Lima, Perú',
            phone: '+51 987 654 321',
            email: 'contacto@gbprint.com'
          }
        }
      ],
    },
  ],
};
