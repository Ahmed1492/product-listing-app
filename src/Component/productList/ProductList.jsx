import React, { useEffect, useMemo, useState } from "react";
import "./productList.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import SearchIcon from "@mui/icons-material/Search";
import { AddNewItem } from "../addNewItem/AddNewItem";

const ProductList = ({ products, setProducts }) => {
  const [searchByName, setSearchByName] = useState("");
  const [sortBy, setSortBy] = useState("A - Z");
  const [category, setCategory] = useState("All"); // New state for category filtering
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isAddNewProductMode, setIsAddNewProductMode] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    }
  }, [products, setProducts]);

  // Handle search
  const handleSearch = (e) => {
    setSearchByName(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  // Filter products by name and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(searchByName);
      const matchesCategory =
        category === "All" || product.category === category;
      return matchesName && matchesCategory;
    });
  }, [products, searchByName, category]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "A - Z") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Z - A") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "Price: Low to High") {
        return a.price - b.price;
      } else if (sortBy === "Price: High to Low") {
        return b.price - a.price;
      }
      return 0;
    });
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Extract all unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  );
  console.log(categories);

  return (
    <div className="spaceX p-3">
      {isAddNewProductMode && (
        <AddNewItem
          products={products}
          setProducts={setProducts}
          setIsAddNewProductMode={setIsAddNewProductMode}
        />
      )}
      {/* Searching, Filters, and Category Dropdown */}
      <div className=" flex justify-between items-center mb-8 flex-wrap">
        <div className="searchInput relative">
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search"
            className="border w-full border-gray-300 rounded-lg px-4 py-2"
          />
          <SearchIcon className="searchIcone" />
        </div>
        {/* Sorting */}
        <div className="flex flex-wrap items-center">
          <label className="me-2" htmlFor="">
            Sorted By
          </label>
          <select
            className="border selectedInput me-5 border-gray-300 rounded-lg px-5 py-2"
            onChange={handleSortChange}
            value={sortBy}
          >
            <option value="A - Z">A - Z</option>
            <option value="Z - A">Z - A</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>

          {/*Sorting By Category */}
          <div className="sortCategory">
            <label className="me-2" htmlFor="">
              Category
            </label>
            <select
              className="border selectedInput me-5 border-gray-300 rounded-lg px-5 py-2"
              onChange={handleCategoryChange}
              value={category}
            >
              <option value="All">All</option>
              {categories?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}

              {/* Add more categories as needed */}
            </select>
          </div>
          <button
            onClick={() => setIsAddNewProductMode(true)}
            className="sellItemBtn px-6 py-2 rounded-lg"
          >
            + Sell Item
          </button>
        </div>
      </div>

      {/* All Products */}
      <div className="flex  justify-between flex-wrap">
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product, index) => (
            <div key={index} className="singleProduct  m-auto mb-2">
              <img
                src={product.imgSrc}
                alt={product.name}
                className="w-full h-40 border object-cover mb-1 productImage"
              />
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl">{product.name}</h2>
                  <p className="font-semibold mb-5"> ${product.price}.00</p>
                </div>
                <div className="text-xl	 border divide-slate-500 rounded px-2 py-1">
                  <FavoriteBorderIcon />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-16">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          <WestIcon className="me-4" />
          Previous
        </button>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
          <EastIcon className="ms-4" />
        </button>
      </div>

      {/* Page Numbers */}
      <div className="pagination gap-5 flex justify-center items-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`page-number ${
              currentPage === index + 1 ? "border px-4 py-2" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
