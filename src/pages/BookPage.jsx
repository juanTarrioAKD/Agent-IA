import React, { useState, useMemo } from 'react';
import ChromaGrid from '../components/croma_grid'; // Asegúrate que la ruta sea correcta
import { SearchBar } from '../components/search_bar'; // Asegúrate que la ruta sea correcta

// 1. MOCK DATA: Simula lo que vendrá de tu Base de Datos (Prisma)
// Fíjate que uso campos de libro reales (title, author, price)
const MOCK_BOOKS = [
  {
    id: 1,
    title: "El Señor de los Anillos",
    author: "J.R.R. Tolkien",
    price: 25000,
    image: "https://images.unsplash.com/photo-1629196911514-cfd8d63f034f?q=80&w=600&auto=format&fit=crop",
    category: "Fantasía"
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 45000,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop",
    category: "Programación"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    price: 15500,
    image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=600&auto=format&fit=crop",
    category: "Ciencia Ficción"
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    price: 52000,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    category: "Programación"
  },
  {
    id: 5,
    title: "Harry Potter",
    author: "J.K. Rowling",
    price: 22000,
    image: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=600&auto=format&fit=crop",
    category: "Fantasía"
  },
  {
    id: 6,
    title: "Dune",
    author: "Frank Herbert",
    price: 28000,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop",
    category: "Ciencia Ficción"
  }
];

// Función auxiliar para colores (para que quede lindo visualmente)
const getGenreColor = (category) => {
  switch(category) {
    case 'Programación': return { border: '#3B82F6', gradient: 'linear-gradient(145deg, #3B82F6, #000)' };
    case 'Fantasía': return { border: '#F59E0B', gradient: 'linear-gradient(145deg, #F59E0B, #000)' };
    default: return { border: '#10B981', gradient: 'linear-gradient(180deg, #10B981, #000)' };
  }
};

const BooksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // 2. LOGICA DE FILTRADO Y MAPEO
  // Usamos useMemo para que no recalcule todo cada vez que tocas algo que no sea la búsqueda
  const gridItems = useMemo(() => {
    // A. Primero filtramos por el buscador
    const filtered = MOCK_BOOKS.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // B. Transformamos el objeto "Libro" al objeto "ChromaGrid Item"
    return filtered.map(book => {
      const style = getGenreColor(book.category);
      return {
        image: book.image,
        title: book.title,            // Título del libro
        subtitle: book.author,        // Autor como subtítulo
        handle: `$${book.price}`,     // Precio como "handle" (el texto pequeño tipo tag)
        borderColor: style.border,
        gradient: style.gradient,
        url: `/book/${book.id}`       // URL interna simulada
      };
    });
  }, [searchTerm]); // Solo se recalcula cuando cambia searchTerm

  // Calculamos filas dinámicas para que el grid no se vea vacío o muy estirado
  // ChromaGrid usa columnas fijas (3 por defecto), así que calculamos las filas necesarias
  const calculatedRows = Math.ceil(gridItems.length / 3) || 2; 

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111', padding: '40px 20px', color: '#fff' }}>
      
      {/* HEADER CON BUSCADOR */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 50px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
          Nuestra Colección
        </h1>
        
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <SearchBar 
            placeholder="Search by title or author..." 
            value={searchTerm}
            onSearch={setSearchTerm}
          />
        </div>
      </div>

      {/* CONTENEDOR DE LA LISTA (Exactamente como pide la doc oficial) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {gridItems.length > 0 ? (
          /* El div wrapper obligatorio según la doc */
          <div style={{ height: '800px', position: 'relative', width: '100%' }}>
            <ChromaGrid 
              items={gridItems}
              radius={300}
              columns={3}           // Mantiene 3 columnas
              rows={calculatedRows} // Se adapta a la cantidad de libros
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              className="my-chroma-grid" // Clase opcional por si quieres ajustar CSS extra
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', opacity: 0.5 }}>
            <h3>No se encontraron libros con esa búsqueda.</h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default BooksPage;