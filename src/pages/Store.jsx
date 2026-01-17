import React from 'react';
import CircularGallery from '../components/circular_galerry'; 
import Header from '../components/header';
import Footer from '../components/footer';
import BackgroundStore from '../components/background_store';
import foto_deadPoetsSociety from '../assets/Dead_Poets_Society.jpg';
import foto_prideAndPrejudice from '../assets/Pride_Prejudice.jpg';
import foto_romeoAndJuliet from '../assets/Romeo_Juliet.jpg';
import foto_theNotebook from '../assets/The_Notebook.jpg';


const misPublicaciones = [
  { id: 1, text: 'Dead Poets Society', image: foto_deadPoetsSociety },
  { id: 2, text: 'Pride and Prejudice', image: foto_prideAndPrejudice },
  { id: 3, text: 'Romeo and Juliet', image: foto_romeoAndJuliet },
  { id: 4, text: 'The Notebook', image: foto_theNotebook },
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
