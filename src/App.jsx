// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus páginas
import Home from './pages/home';         
import PostDetail from './pages/post_detail';
import Store from './pages/Store';

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA 1: La página principal */}
        <Route path="/" element={<Home />} />

        {/* RUTA 2: Store (El Carrusel) */}
        <Route path="/store" element={<Store />} />

        {/* RUTA 3: El detalle (La Tilted Card) */}
        {/* :id es un comodín, aceptará cualquier número */}
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
