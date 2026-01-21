import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ChromaGrid from '../components/croma_grid';
import { SearchBar } from '../components/search_bar';
import { MagicButton } from '../components/magic_button';

const getGenreColor = () => {
  const variants = [
    { border: '#3B82F6', gradient: 'linear-gradient(145deg, #3B82F6, #000)' },
    { border: '#F59E0B', gradient: 'linear-gradient(145deg, #F59E0B, #000)' },
    { border: '#10B981', gradient: 'linear-gradient(180deg, #10B981, #000)' },
  ];
  return variants[Math.floor(Math.random() * variants.length)];
};

const getBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return raw.replace(/\/api\/v1\/?$/, '') || raw;
};

const BooksPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/libros`);
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || 'Error al cargar');

        setBooks(result.data ?? []);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los libros', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const gridItems = useMemo(() => {
    if (!books.length) return [];

    const filtered = books.filter((book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.map((book) => {
      const style = getGenreColor();
      return {
        image: book.image || 'https://via.placeholder.com/300x400?text=Sin+Imagen',
        title: book.title,
        subtitle: book.description ? `${book.description.substring(0, 40)}...` : 'Sin descripción',
        handle: `$${book.price ?? 0}`,
        borderColor: style.border,
        gradient: style.gradient,
        url: `/book/${book.id}`,
      };
    });
  }, [searchTerm, books]);

  const calculatedRows = Math.ceil(gridItems.length / 3) || 2;

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#111',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <h2>Cargando biblioteca...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111', padding: '40px 20px', color: '#fff' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto 50px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
          Nuestra Colección
        </h1>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <SearchBar
            placeholder="Buscar por título..."
            value={searchTerm}
            onSearch={setSearchTerm}
          />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '1rem' }}>
          <MagicButton
            text="Create Book"
            onClick={() => navigate('/create-book')}
            className="create-book-button"
            style={{ marginTop: '20px', width: '180px', height: '50px', fontSize: '1.1rem', fontWeight: 'bold' }}
          />
        </div>

        {gridItems.length > 0 ? (
          <div style={{ minHeight: '800px', position: 'relative', width: '100%', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#111' }}>
            <ChromaGrid
              items={gridItems}
              radius={300}
              columns={3}
              rows={calculatedRows}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              className="my-chroma-grid"
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', opacity: 0.5 }}>
            <h3>
              {books.length === 0
                ? 'Aún no hay libros en la colección.'
                : 'No se encontraron resultados para tu búsqueda.'}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
