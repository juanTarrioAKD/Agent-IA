// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus páginas
import Home from './pages/home';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import PostDetail from './pages/PostDetail';
import Store from './pages/Store';
import BooksPage from './pages/BookPage';
import CreateBookPage from './pages/CreateBookPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA 1: La página principal */}
        <Route path="/" element={<Home />} />

        {/* RUTA 2: Store (El Carrusel) */}
        <Route path="/store" element={<Store />} />

        {/* RUTA 3: About Page */}
        <Route path="/about" element={<AboutPage />} />

        {/* RUTA 4: Auth (Login/Registro) */}
        <Route path="/auth" element={<AuthPage />} />

        {/* RUTA 5: Books Page */}
        <Route path="/books" element={<BooksPage />} />

        {/* RUTA 6: El detalle (La Tilted Card) */}
        {/* :id es un comodín, aceptará cualquier número */}
        <Route path="/post/:id" element={<PostDetail />} />

        {/* RUTA 7: Create Book Page */}
        <Route path="/create-book" element={<CreateBookPage />} />
      </Routes>
    </Router>
  );
}

export default App;
