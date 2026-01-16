import React, { useEffect } from 'react';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';
import Header from '../components/header';
import Footer from '../components/footer';
import LiquidChrome from '../components/background';
import TextPressure from '../components/text_pressure';
import fotoStore from '../assets/Store_Example.jpg';

const demoItems = [
  { link: '/store', text: 'Store Example', image: fotoStore },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];

const Home = () => {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://juantarrio.app.n8n.cloud/webhook/b8f494fd-48bc-4b0f-8a68-3b91794cd012/chat',
      mode: 'window',
      initialMessages: [
        '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte?',
      ],
    });
  }, []);

  return (
    <div style={{ 
      width: '100%',
      backgroundColor: '#000',
    }}>
      {/* seccion HERO */}
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
          <LiquidChrome
            baseColor={[0, 0.2, 0.2]}
            speed={0.28}
            amplitude={0.3}
            interactive={false}
          />
        </div>

        {/* 1. HEADER (Arriba) */}
        <div style={{ position: 'relative', zIndex: 10}}>
          <Header />
        </div>

        {/* 2. ZONA PARA NUEVO COMPONENTE (Medio) */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', height: '300px', width: '100%' }}>
            <TextPressure
              text="LA GUARDIA IMPERIAL"
              textColor="#FFFFFF"
              strokeColor="#FFFFFF"
              stroke={true}
            />
          </div>
        </div>
      </div>

      {/* 3. FOOTER (DEBAJO DEL PLIEGUE) */}
      <div style={{ flexShrink: 0, minHeight: '100vh' }}>
        <Footer items={demoItems} />
      </div>
    </div>
  );
};

export default Home;