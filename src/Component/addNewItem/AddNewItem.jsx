import React, { useEffect, useState } from "react";
import "./addNewItem.css";
import CloseIcon from "@mui/icons-material/Close";

export const AddNewItem = ({
  products,
  setProducts,
  setIsAddNewProductMode,
}) => {
  // Store Data Of New Item
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imgSrc: null,
    desc: "",
    category: "",
  });

  const [errors, setErrors] = useState({}); // State to store error messages

  // Function Make Validation RealTime
  const validateField = (name, value) => {
    let tempErrors = { ...errors };

    switch (name) {
      case "name":
        tempErrors.name = value ? "" : "Product name is required";
        break;
      case "price":
        tempErrors.price = value > 0 ? "" : "Product price is required";
        break;
      case "desc":
        tempErrors.desc = value ? "" : "Product description is required";
        break;
      case "category":
        tempErrors.category = value ? "" : "Product category is required";
        break;
      default:
        break;
    }

    setErrors(tempErrors);
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    // Real-time validation
    validateField(name, value);
  };

  // Function to convert image to Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Function To Ensure Inputs Are Empty And Close Form Of Add New Item
  const handleCloseForm = () => {
    setIsAddNewProductMode(false);
    setNewProduct({
      name: "",
      price: "",
      imgSrc: null,
      desc: "",
      category: "",
    });
    setErrors({});
  };

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64Image = await convertImageToBase64(file);
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        imgSrc: base64Image,
      }));
    }
  };

  // Validation function To Ensure Sent data Is Not Empty
  const validateProduct = () => {
    let tempErrors = {};

    if (!newProduct.name) tempErrors.name = "Product name is required";
    if (!newProduct.price || newProduct.price <= 0)
      tempErrors.price = " product price is required";
    if (!newProduct.imgSrc) tempErrors.imgSrc = "Product image is required";
    if (!newProduct.desc) tempErrors.desc = "Product description is required";
    if (!newProduct.category)
      tempErrors.category = "Product category is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // If no errors, return true
  };

  // Function to add product and Send It To LocalStorage
  const addProduct = () => {
    if (validateProduct()) {
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setIsAddNewProductMode(false);

      // Clear the form after adding the product
      setNewProduct({
        name: "",
        price: "",
        imgSrc: null,
        desc: "",
        category: "",
      });
    }
  };

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  return (
    <div className="m-auto pt-7 containerForm">
      <form
        className="rounded m-auto py-3 flex flex-col justify-center bg-white px-2 pb-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <button onClick={handleCloseForm} className="closeIcone">
          <CloseIcon />
        </button>

        {/* Image Upload */}
        <label className="text-left mt-2" htmlFor="uploadedImage">
          Upload Image
        </label>
        <div className="border-slate-400 border rounded mt-1 p-14 gap-5 flex flex-col">
          <input
            id="uploadedImage"
            type="file"
            onChange={handleImageUpload}
            className="mb-4 "
          />
        </div>
        {errors.imgSrc && (
          <p className=" text-red-500  text-xl mb-2">{errors.imgSrc}</p>
        )}

        {/* Title */}
        <div className="w-full mt-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="name"
            id="title"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
          />
          {errors.name && (
            <p className=" text-red-500  text-xl mb-2">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="w-full mt-4">
          <label htmlFor="desc">Descripe Your Item </label>
          <textarea
            type="text"
            name="desc"
            id="desc"
            placeholder="Product Description"
            value={newProduct.desc}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
          />
          {errors.desc && (
            <p className=" text-red-500  text-xl mb-2">{errors.desc}</p>
          )}
        </div>

        {/* Category */}
        <div className="w-full mt-4">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            placeholder="Product Category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
          />
          {errors.category && (
            <p className=" text-red-500  text-xl mb-2">{errors.category}</p>
          )}
        </div>

        {/* Price */}
        <div className="w-full mt-4">
          <label htmlFor="price">Item Price</label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="00.00"
            value={newProduct.price}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
          />
          {errors.price && (
            <p className=" text-red-500  text-xl mb-2">{errors.price}</p>
          )}
        </div>

        <button
          className="px-6 py-2 bg-[#d9f99d] rounded-lg"
          onClick={addProduct}
        >
          Add Product
        </button>
      </form>
    </div>
  );
};
