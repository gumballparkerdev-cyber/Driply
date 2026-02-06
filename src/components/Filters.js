import React, { useState } from 'react';
import '../CSS/Filters.css';

function Filters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    gender: [],
    category: [],
    season: [],
    priceRange: [0, 200],
    inStock: false
  });

  const handleCheckboxChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      const newFilters = { ...prev, [filterType]: newValues };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters(prev => {
      const newFilters = { ...prev, priceRange: [0, value] };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleStockChange = (e) => {
    setFilters(prev => {
      const newFilters = { ...prev, inStock: e.target.checked };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const clearedFilters = {
      gender: [],
      category: [],
      season: [],
      priceRange: [0, 200],
      inStock: false
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2 className="filters-title">FILTERS</h2>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      {/* Gender Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">GENDER</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.gender.includes('men')}
              onChange={() => handleCheckboxChange('gender', 'men')}
            />
            <span className="filter-label">Men</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.gender.includes('women')}
              onChange={() => handleCheckboxChange('gender', 'women')}
            />
            <span className="filter-label">Women</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.gender.includes('unisex')}
              onChange={() => handleCheckboxChange('gender', 'unisex')}
            />
            <span className="filter-label">Unisex</span>
          </label>
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">CATEGORY</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.category.includes('upper-wear')}
              onChange={() => handleCheckboxChange('category', 'upper-wear')}
            />
            <span className="filter-label">Upper Wear</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.category.includes('lower-wear')}
              onChange={() => handleCheckboxChange('category', 'lower-wear')}
            />
            <span className="filter-label">Lower Wear</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.category.includes('dresses')}
              onChange={() => handleCheckboxChange('category', 'dresses')}
            />
            <span className="filter-label">Dresses</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.category.includes('outerwear')}
              onChange={() => handleCheckboxChange('category', 'outerwear')}
            />
            <span className="filter-label">Outerwear</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.category.includes('accessories')}
              onChange={() => handleCheckboxChange('category', 'accessories')}
            />
            <span className="filter-label">Accessories</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.category.includes('footwear')}
              onChange={() => handleCheckboxChange('category', 'footwear')}
            />
            <span className="filter-label">Footwear</span>
          </label>
        </div>
      </div>

      {/* Season Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">SEASON</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.season.includes('spring')}
              onChange={() => handleCheckboxChange('season', 'spring')}
            />
            <span className="filter-label">Spring</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.season.includes('summer')}
              onChange={() => handleCheckboxChange('season', 'summer')}
            />
            <span className="filter-label">Summer</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.season.includes('fall')}
              onChange={() => handleCheckboxChange('season', 'fall')}
            />
            <span className="filter-label">Fall</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.season.includes('winter')}
              onChange={() => handleCheckboxChange('season', 'winter')}
            />
            <span className="filter-label">Winter</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.season.includes('all')}
              onChange={() => handleCheckboxChange('season', 'all')}
            />
            <span className="filter-label">All Seasons</span>
          </label>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">PRICE RANGE</h3>
        <div className="price-filter">
          <div className="price-display">
            <span className="price-value">$0</span>
            <span className="price-separator">-</span>
            <span className="price-value">${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[1]}
            onChange={handlePriceChange}
            className="price-slider"
          />
        </div>
      </div>

      {/* Stock Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">AVAILABILITY</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={handleStockChange}
            />
            <span className="filter-label">In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Filters;