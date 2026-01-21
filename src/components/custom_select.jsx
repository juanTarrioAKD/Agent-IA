import React, { useState, useRef, useEffect } from 'react';
import '../compCSS/custom_select.css'; // El CSS que crearemos abajo

export const CustomSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Seleccionar...", 
  icon 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Lógica para cerrar el menú si haces clic afuera (Click Outside)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div 
        className={`select-container ${isOpen ? 'active' : ''}`} 
        ref={selectRef}
    >
      {/* Parte visible principal */}
      <div className="select-trigger" onClick={() => setIsOpen(!isOpen)}>
        
        {/* Icono Opcional (Izquierda) */}
        {icon ? (
          <div className="select-icon-left">{icon}</div>
        ) : (
          /* Icono por defecto (Filtro) */
          <svg 
            className="select-icon-left" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
        )}

        <span className={`select-value ${!value ? 'placeholder' : ''}`}>
          {value || placeholder}
        </span>

        {/* Icono Flecha (Derecha) - Rota al abrir */}
        <svg 
            className={`select-arrow ${isOpen ? 'open' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            width="16"
            height="16"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="select-dropdown">
          {options.map((option, index) => (
            <div 
              key={index} 
              className={`select-option ${value === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;