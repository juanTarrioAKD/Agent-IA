import React from 'react';
import { useAuth } from '../context/authContext';
import CircularGallery from '../components/circular_galerry'; 
import Header from '../components/header';
import Footer from '../components/footer';
import BackgroundStore from '../components/background_store';


const misPublicaciones = [
  { id: 1, text: 'Dead Poets Society', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
  { id: 2, text: 'Pride and Prejudice', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
  { id: 3, text: 'Romeo and Juliet', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 4, text: 'The Notebook', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' },
];


const Store = () => {
  const { user } = useAuth()

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
        {/* FONDO */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 0,
          pointerEvents: 'none'
        }}>
          <BackgroundStore
            speed={5}
            scale={1}
            color="#7B7481"
            noiseIntensity={1.5}
            rotation={0}
            tint="#36dcf2"
          />
        </div>
        {/* 1. HEADER (Arriba) */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Header />
        </div>

        {/* 2. ZONA DEL CARRUSEL (Medio) */}
        {/* flex: 1 hace que este div crezca para ocupar TODO el espacio libre disponible */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 1 }}>
          <CircularGallery 
            items={misPublicaciones} 
            bend={0} 
            textColor="#ffffff" 
            borderRadius={0.05} 
          />
        </div>
      </div>
    </div>
  );
};

export default Store;
