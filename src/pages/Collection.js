import { useEffect, useState } from "react";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api";
import "../CSS/Collection.css";
import { useSearch } from "../context/SearchContext";
import { useLocation } from "react-router-dom";

function Collection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sort, setSort] = useState("relevant");

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  const handleFilterChange = (filters) => {
    let result = [...products];

    if (filters.gender.length > 0) {
      result = result.filter(p =>
        filters.gender.includes(p.gender)
      );
    }

    if (filters.category.length > 0) {
      result = result.filter(p =>
        filters.category.includes(p.category)
      );
    }

    if (filters.season.length > 0) {
      result = result.filter(
        p => filters.season.includes(p.season) || p.season === "all"
      );
    }

    result = result.filter(
      p =>
        p.price >= filters.priceRange[0] &&
        p.price <= filters.priceRange[1]
    );

    if (filters.inStock) {
      result = result.filter(p => p.stock > 0);
    }

    applySort(result);
  };

  const applySort = (list) => {
    let sorted = [...list];

    if (sort === "low-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sorted);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);

    let sorted = [...filteredProducts];

    if (value === "price-low-high") {
      sorted.sort((a, b) => a.price - b.price);
    }

    if (value === "price-high-low") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sorted);
  };

  // search from context
  const { searchQuery } = useSearch();
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setFilteredProducts(products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  // search from URL
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("search") || "";
  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [searchTerm, products]);

  return (
    <div className="collection-page">
      <aside className="collection-filters">
        <Filters onFilterChange={handleFilterChange} />
      </aside>

      <section className="collection-content">
        <div className="collection-header">
          <h2 className="collection-title">ALL COLLECTIONS</h2>

          <select className="sort-select" onChange={handleSortChange}>
            <option value="relevant">Sort by: Relevant</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))
          ) : (
            <p className="no-products">No products found</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Collection;