import React from 'react';
import '../compCSS/search_bar.css'; // Ahora creamos este CSS

export const SearchBar = ({ placeholder = "Search...", onSearch, value }) => {
  return (
    <div className="search-container">
      <svg 
        className="search-icon" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};