import Head from "next/head";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import {MotionButton} from "../components/MotionButton";

export default function Admin() {
  // --------------------
  // PRODUCTS STATE
  // --------------------
  const [products, setProducts] = useState([]);

  // --------------------
  // CATEGORIES & BRANDS (Persistent via localStorage)
  // --------------------
  const [categories, setCategories] = useState([
    "Cool Drinks",
    "Alcohol",
    "Wine",
    "Fruit Juice",
  ]);
  const [brandOptions, setBrandOptions] = useState({
    "Cool Drinks": ["Coca Cola", "Pepsi", "Sprite"],
    Alcohol: ["Heineken", "Budweiser", "Corona"],
    Wine: ["Merlot", "Chardonnay", "Cabernet Sauvignon"],
    "Fruit Juice": ["Tropicana", "Minute Maid", "Real"],
  });

  const [newCategory, setNewCategory] = useState("");
  const [newBrandCategory, setNewBrandCategory] = useState("");
  const [newBrandName, setNewBrandName] = useState("");

  // --------------------
  // PRODUCT FORM STATE
  // --------------------
  const [newProduct, setNewProduct] = useState({
    category: "",
    brand: "",
    price: "",
    images: [""],
    description: "",
    newArrival: false,
    bestSeller: false,
  });
  const [editProduct, setEditProduct] = useState(null);
  const [brands, setBrands] = useState([]);

  // currentProduct is used to decide which data to show in the form.
  const currentProduct = editProduct ? editProduct : newProduct;

  // --------------------
  // Load persistent data from localStorage.
  // --------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCategories = localStorage.getItem("categories");
      const storedBrandOptions = localStorage.getItem("brandOptions");
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      if (storedBrandOptions) setBrandOptions(JSON.parse(storedBrandOptions));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandOptions", JSON.stringify(brandOptions));
    }
  }, [brandOptions]);

  // --------------------
  // Fetch products from the API.
  // --------------------
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // --------------------
  // Update brands list based on the selected category in currentProduct.
  // --------------------
  useEffect(() => {
    if (currentProduct.category) {
      setBrands(brandOptions[currentProduct.category] || []);
    } else {
      setBrands([]);
    }
  }, [currentProduct.category, brandOptions]);

  // --------------------
  // PRODUCT FORM HANDLERS
  // --------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    if (editProduct) {
      setEditProduct({ ...editProduct, [name]: inputValue });
    } else {
      setNewProduct({ ...newProduct, [name]: inputValue });
    }
  };

  const addImage = () => {
    if (editProduct) {
      setEditProduct({
        ...editProduct,
        images: [...(editProduct.images || []), ""],
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: [...(newProduct.images || []), ""],
      });
    }
  };

  const removeImage = (index) => {
    if (editProduct) {
      const updatedImages = editProduct.images.filter((_, idx) => idx !== index);
      setEditProduct({ ...editProduct, images: updatedImages });
    } else {
      const updatedImages = newProduct.images.filter((_, idx) => idx !== index);
      setNewProduct({ ...newProduct, images: updatedImages });
    }
  };

  const addProduct = () => {
    const productData = {
      ...newProduct,
      // Remove any empty URL strings so only valid URLs remain.
      images: newProduct.images.filter((url) => url.trim() !== ""),
    };
  
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setProducts([...products, data.data]);
          setNewProduct({
            category: "",
            brand: "",
            price: "",
            // If you want the field to exist, you can reinitialize as an empty array.
            images: [""],
            description: "",
            newArrival: false,
            bestSeller: false,
          });
        } else {
          console.error("Failed to add product:", data);
        }
      })
      .catch((err) => console.error("Error adding product:", err));
  };
  
  

  const updateProduct = (id) => {
    fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setProducts(products.map((p) => (p._id === id ? data.data : p)));
          setEditProduct(null);
        } else {
          console.error("Failed to update product:", data);
        }
      })
      .catch((err) => console.error("Error updating product:", err));
  };

  const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setProducts(products.filter((p) => p._id !== id));
        } else {
          console.error("Failed to delete product:", data);
        }
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  // --------------------
  // CATEGORY MANAGEMENT
  // --------------------
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setBrandOptions((prev) => ({ ...prev, [trimmed]: [] }));
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(categories.filter((cat) => cat !== categoryToDelete));
    setBrandOptions((prev) => {
      const newOpts = { ...prev };
      delete newOpts[categoryToDelete];
      return newOpts;
    });
    if (newProduct.category === categoryToDelete) {
      setNewProduct({ ...newProduct, category: "" });
    }
    if (newBrandCategory === categoryToDelete) setNewBrandCategory("");
  };

  // --------------------
  // BRAND MANAGEMENT
  // --------------------
  const handleAddBrand = () => {
    if (newBrandCategory && newBrandName.trim()) {
      setBrandOptions((prev) => {
        const currentBrands = prev[newBrandCategory] || [];
        if (!currentBrands.includes(newBrandName.trim())) {
          return {
            ...prev,
            [newBrandCategory]: [...currentBrands, newBrandName.trim()],
          };
        }
        return prev;
      });
      setNewBrandName("");
    }
  };

  const handleDeleteBrand = (category, brandToDelete) => {
    setBrandOptions((prev) => {
      const currentBrands = prev[category] || [];
      return {
        ...prev,
        [category]: currentBrands.filter((b) => b !== brandToDelete),
      };
    });
  };

  return (
    <div style={styles.pageContainer}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
        <title>Shopaholic Admin</title>
      </Head>

      {/* Logo */}
      <div style={styles.adminLogo}>
        <span style={styles.logoSymbol}>🍹</span>
        <span style={styles.logoText}>Shopaholic</span>
      </div>

      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <p style={styles.subHeader}>Manage Your Products</p>
      </header>

      {/* Product Form */}
      <section style={styles.formSection}>
        <form
          style={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div style={styles.inputGroup}>
            <label style={styles.label}>Category:</label>
            <select
              name="category"
              style={styles.select}
              value={currentProduct.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Brand:</label>
            <select
              name="brand"
              style={styles.select}
              value={currentProduct.brand}
              onChange={handleInputChange}
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Price:</label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              style={styles.input}
              value={currentProduct.price}
              onChange={handleInputChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              name="description"
              placeholder="Product Description"
              style={styles.textarea}
              value={currentProduct.description}
              onChange={handleInputChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Images:</label>
            {((editProduct ? editProduct.images : newProduct.images) || []).map((img, index) => (
              <div key={index} style={styles.imageInputContainer}>
                <input
                  type="text"
                  name={`image-${index}`}
                  placeholder={`Image URL ${index + 1}`}
                  style={styles.input}
                  value={img}
                  onChange={(e) => {
                    if (editProduct) {
                      const updatedImages = [...editProduct.images || []];
                      updatedImages[index] = e.target.value;
                      setEditProduct({ ...editProduct, images: updatedImages });
                    } else {
                      const updatedImages = [...newProduct.images || []];
                      updatedImages[index] = e.target.value;
                      setNewProduct({ ...newProduct, images: updatedImages });
                    }
                  }}
                />
                {((editProduct ? editProduct.images : newProduct.images) || []).length > 1 && (
                  <MotionButton
                    type="button"
                    style={styles.imageDeleteButton}
                    onClick={() => removeImage(index)}
                  >
                    Delete
                  </MotionButton>
                )}
              </div>
            ))}
            <MotionButton type="button" style={styles.addButton} onClick={addImage}>
              + Add Image
            </MotionButton>
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              New Arrival:
              <input
                type="checkbox"
                name="newArrival"
                style={styles.checkbox}
                checked={currentProduct.newArrival}
                onChange={handleInputChange}
              />
            </label>
            <label style={styles.checkboxLabel}>
              Best Seller:
              <input
                type="checkbox"
                name="bestSeller"
                style={styles.checkbox}
                checked={currentProduct.bestSeller}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div style={styles.buttonGroup}>
            {editProduct ? (
              <MotionButton
                type="button"
                style={styles.button}
                onClick={() => updateProduct(editProduct._id)}
              >
                Update Product
              </MotionButton>
            ) : (
              <MotionButton type="button" style={styles.button} onClick={addProduct}>
                Add Product
              </MotionButton>
            )}
          </div>
        </form>
      </section>

     {/* Existing Products List */}
<section style={styles.listSection}>
  <h2 style={styles.listTitle}>Existing Products</h2>
  {products && products.length > 0 ? (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.tableHeader}>Category</th>
          <th style={styles.tableHeader}>Brand</th>
          <th style={styles.tableHeader}>Description</th>
          <th style={styles.tableHeader}>Image</th>
          <th style={styles.tableHeader}>Price</th>
          <th style={styles.tableHeader}>New Arrival</th>
          <th style={styles.tableHeader}>Best Seller</th>
          <th style={styles.tableHeader}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td style={styles.tableCell}>
              {product.category || "Unknown Category"}
            </td>
            <td style={styles.tableCell}>
              {product.brand || "Unknown Brand"}
            </td>
            <td style={styles.tableCell}>
              {product.description
                ? product.description.length > 60
                  ? product.description.substring(0, 60) + "..."
                  : product.description
                : "N/A"}
            </td>
            <td style={styles.tableCell}>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.brand}
                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                />
              ) : (
                "No Image"
              )}
            </td>
            <td style={styles.tableCell}>
              Rs.{product.price || "N/A"}
            </td>
            <td style={styles.tableCell}>
              {product.newArrival ? "Yes" : "No"}
            </td>
            <td style={styles.tableCell}>
              {product.bestSeller ? "Yes" : "No"}
            </td>
            <td style={styles.tableCell}>
              <MotionButton
                type="button"
                style={styles.editButton}
                onClick={() => setEditProduct(product)}
              >
                Edit
              </MotionButton>
              <MotionButton
                type="button"
                style={styles.deleteButton}
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </MotionButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No products available</p>
  )}
</section>


      {/* Manage Categories Section */}
<section style={styles.manageSection}>
  <h2 style={styles.listTitle}>Manage Categories</h2>
  <div style={styles.inputGroup}>
    <label style={styles.label}>New Category:</label>
    <input
      type="text"
      placeholder="Enter new category"
      style={styles.input}
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
    />
    <MotionButton
      type="button"
      style={styles.addButton}
      onClick={handleAddCategory}
    >
      Add Category
    </MotionButton>
  </div>
  <ul>
    {categories.map((cat) => (
      <li key={cat} style={styles.manageListItem}>
        <span>{cat}</span>
        <MotionButton
          type="button"
          style={styles.deleteButton}
          onClick={() => handleDeleteCategory(cat)}
        >
          Delete
        </MotionButton>
      </li>
    ))}
  </ul>
</section>

{/* Manage Brands Section */}
<section style={styles.manageSection}>
  <h2 style={styles.listTitle}>Manage Brands</h2>
  <div style={styles.inputGroup}>
    <label style={styles.label}>Select Category:</label>
    <select
      style={styles.select}
      value={newBrandCategory}
      onChange={(e) => setNewBrandCategory(e.target.value)}
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>
  <div style={styles.inputGroup}>
    <label style={styles.label}>New Brand:</label>
    <input
      type="text"
      placeholder="Enter new brand"
      style={styles.input}
      value={newBrandName}
      onChange={(e) => setNewBrandName(e.target.value)}
    />
    <MotionButton
      type="button"
      style={styles.addButton}
      onClick={handleAddBrand}
    >
      Add Brand
    </MotionButton>
  </div>
  {newBrandCategory && (
    <ul>
      {(brandOptions[newBrandCategory] || []).map((brand) => (
        <li key={brand} style={styles.manageListItem}>
          <span>{brand}</span>
          <MotionButton
            type="button"
            style={styles.deleteButton}
            onClick={() => handleDeleteBrand(newBrandCategory, brand)}
          >
            Delete
          </MotionButton>
        </li>
      ))}
    </ul>
  )}
</section>
  <Footer />
    </div>
    
  );
}


const styles = {
  pageContainer: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
    position: "relative",
  },
  adminLogo: {
    position: "absolute",
    top: "1rem",
    left: "-3.5rem",
    display: "flex",
    alignItems: "center",

  },
  logoSymbol: {
    fontSize: "2rem",
    marginRight: "0.5rem",
  },
  logoText: {
    fontFamily: "'Pacifico', cursive",
    fontSize: "2rem",
    color: "red",
    textAlign: "left",
  },
  header: {
    paddingTop: "3rem",
    textAlign: "center",
    color: "red",
  },
  headerTitle: {
    fontSize: "2rem",
    margin: "0.5rem 0",
  },
  subHeader: {
    fontSize: "1rem",
    color: "#555",
  },
  formSection: {
    margin: "2rem 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  label: {
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  select: {
    padding: "0.5rem",
    fontSize: "1rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    resize: "vertical",
    minHeight: "80px",
  },
  imageInputContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  addButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    backgroundColor: "rgb(255,64,129)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "0.5rem",
    width: "fit-content",
  },
  checkboxGroup: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "1rem",
  },
  checkbox: {
    marginLeft: "0.5rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "rgb(255,64,129)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  listSection: {
    marginTop: "2rem",
  },
  listTitle: {
    fontSize: "1.8rem", // increased font size for title
    marginBottom: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "1.1rem", // increased overall table font size
  },
  tableHeader: {
    border: "1px solid #ddd",
    padding: "0.75rem", // increased padding for header cells
    background: "#f2f2f2",
    textAlign: "left",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "0.75rem", // increased padding for regular cells
  },
  editButton: {
    marginRight: "1rem", // increased space between edit & delete buttons
    padding: "0.5rem 1rem",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    marginTop:"1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  imageDeleteButton: {
    padding: "0.25rem 0.5rem",
    fontSize: "0.8rem",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "0.5rem",
  },
  manageSection: {
    marginTop: "2rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  // New style for the list items in Manage Categories / Brands.
  manageListItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
};
