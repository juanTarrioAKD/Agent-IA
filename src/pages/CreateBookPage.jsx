import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../compCSS/CreateBookPage.css';

const CreateBookPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getBaseUrl = () => {
    const raw = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return raw.replace(/\/api\/v1\/?$/, '') || raw;
  };

  const getErrorMessage = (data, status) => {
    if (Array.isArray(data?.errors) && data.errors.length) {
      return data.errors.map((e) => `${e.field}: ${e.message}`).join(' · ');
    }
    if (status === 500 && data?.error) return data.error;
    return data?.message || 'Error desconocido al crear el libro';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        stock: formData.stock ? parseInt(formData.stock, 10) : 0,
      };

      const response = await fetch(`${getBaseUrl()}/api/libros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: response.ok ? 'Error inesperado' : `Error ${response.status}: ${response.statusText}` };
      }

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Libro Creado!',
          text: `Se ha agregado "${data.data?.title}" a la colección.`,
          confirmButtonColor: '#10B981',
        }).then(() => navigate('/store'));
      } else {
        throw new Error(getErrorMessage(data, response.status));
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-book-container">
      <div className="form-wrapper">
        <h1 className="form-title">Publicar Nuevo Libro</h1>
        <p className="form-subtitle">Ingresa los detalles para agregar un libro al catálogo.</p>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="title">Título del Libro *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Ej: El Principito"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              placeholder="Sinopsis breve del libro..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL de la Imagen (Portada)</label>
            <input
              type="url"
              id="image"
              name="image"
              placeholder="https://ejemplo.com/portada.jpg"
              value={formData.image}
              onChange={handleChange}
            />
            {formData.image && (
              <div className="img-preview">
                <img src={formData.image} alt="Vista previa" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="0.00"
                min={0}
                step="0.01"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                placeholder="0"
                min={0}
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookPage;
