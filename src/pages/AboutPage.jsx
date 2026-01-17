import React, { useEffect } from 'react';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';
import Header from '../components/header';
import Footer from '../components/footer';
import BackgroundAboutPage from '../components/background_aboutPage';
import TextPressure from '../components/text_pressure';
import ASCIIText from '../components/ascii_text';
import CardSwap, { Card } from '../components/card_swap';



const AboutPage = () => {   
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
          <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100vh', 
            minHeight: '100vh',
            zIndex: 0,
            pointerEvents: 'none'
          }}>
            <BackgroundAboutPage
            tint="#36dcf2"/>
          </div>
          {/* 1. HEADER (Arriba) */}
          <div style={{ position: 'relative', zIndex: 10}}>
            <Header />
          </div>
  
          {/* 2. ZONA PARA NUEVO COMPONENTE (Medio) */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 1 }}>
            <div style={{ position: 'relative', height: '100%', width: '100%', zIndex: 1 }}>
              <ASCIIText
                text='What is this?'
                enableWaves={true}
                asciiFontSize={12}
                textFontSize={30}
              />
            </div>
          </div>
        </div>
        
        {/* 3. SECCION CON CARD_SWAP (DEBAJO DEL PLIEGUE) */}
        <div style={{ height: '500px', position: 'relative', zIndex: 1, width: '100%', overflow: 'visible' }}>
          <CardSwap
            cardDistance={60}
            verticalDistance={70}
            delay={5000}
            pauseOnHover={false}
          >
            <Card style={{ padding: '40px', color: '#fff' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>Store Example</h3>
              <p style={{ margin: 0, color: '#fff' }}>Your content here</p>
            </Card>
            <Card style={{ padding: '40px', color: '#fff' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>Card 2</h3>
              <p style={{ margin: 0, color: '#fff' }}>Your content here</p>
            </Card>
            <Card style={{ padding: '40px', color: '#fff' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>Card 3</h3>
              <p style={{ margin: 0, color: '#fff' }}>Your content here</p>
            </Card>
          </CardSwap>
        </div>
      </div>
    );
  };
  
  export default AboutPage;