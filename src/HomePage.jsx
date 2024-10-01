import React, { useState } from "react";
import ProductList from "./Component/productList/ProductList";
import { AddNewItem } from "./Component/addNewItem/AddNewItem";

export const HomePage = () => {
  const [products, setProducts] = useState([]);

  return (
    <div className="  ">
      <ProductList products={products} setProducts={setProducts} />
    </div>
  );
};
