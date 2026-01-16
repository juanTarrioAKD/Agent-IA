import React from 'react';
import CircularGallery from '../components/circular_galerry'; 
import Header from '../components/header';
import Footer from '../components/footer';

const misPublicaciones = [
  { id: 1, text: 'Proyecto React', image: 'https://picsum.photos/id/10/600/600' },
  { id: 2, text: 'Diseño UX', image: 'https://picsum.photos/id/20/600/600' },
  { id: 3, text: 'Inteligencia Art', image: 'https://picsum.photos/id/30/600/600' },
  { id: 4, text: 'Fotografía', image: 'https://picsum.photos/id/40/600/600' },
];

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];

const Store = () => {
  return (
    <div style={{ 
      width: '100%',
      backgroundColor: '#000',
    }}>
      
      {/* seccion HERO */}
      {/* Este div agrupa Header + Carrusel y forzamos que mida 100vh (toda la pantalla) */}
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* 1. HEADER (Arriba) */}
        <Header />

        {/* 2. ZONA DEL CARRUSEL (Medio) */}
        {/* flex: 1 hace que este div crezca para ocupar TODO el espacio libre disponible */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <CircularGallery 
            items={misPublicaciones} 
            bend={0} 
            textColor="#ffffff" 
            borderRadius={0.05} 
          />
        </div>
        
      </div>

      {/* 3. FOOTER (DEBAJO DEL PLIEGUE) */}
      {/* Al estar fuera del div '100vh', aparecerá solo cuando hagas scroll hacia abajo */}
      <div style={{ flexShrink: 0, minHeight: '100vh' }}>
        <Footer items={demoItems} />
      </div>
    </div>
  );
};

export default Store;
