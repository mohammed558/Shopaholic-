import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SliderDashboard from "../components/SliderDashboard"; // Ensure this component exists
import { MotionButton, MotionDiv } from "../components/MotionButton";
import Footer from "../components/Footer";

export default function Home() {
  // Price points and filter state (now filtering only by brand and price)
  const pricePoints = [100, 1000, 3000, 5000, 7000, 10000];
  const [filter, setFilter] = useState({
    brand: [],
    price: pricePoints[pricePoints.length - 1],
  });
  const [sliderIndex, setSliderIndex] = useState(pricePoints.length - 1);

  // Products, Categories & Brands
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState({});

  // Track which categories are expanded (e.g. { "Cool Drink": true })
  const [openCategories, setOpenCategories] = useState({});

  // User & Cart State
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // UI States: Filter Slider, Dashboard, Account Dropdown
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Responsive columns state for product grid
  const [columns, setColumns] = useState(5);

  // Listen to window resize and update columns accordingly
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let newColumns;
      if (width < 600) {
        newColumns = 1;
      } else if (width < 900) {
        newColumns = 2;
      } else if (width < 1200) {
        newColumns = 3;
      } else if (width < 1500) {
        newColumns = 4;
      } else {
        newColumns = 5;
      }
      setColumns(newColumns);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const toggleFilter = () => setIsFilterOpen((prev) => !prev);
  const toggleCategory = (category) =>
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));

  // Fetch products data and set up categories/brands
  useEffect(() => {
    fetch(`/api/products?cb=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        // Build the list of unique categories
        const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));
        setCategories(uniqueCategories);
        // Build an object mapping each category to its unique brands
        const brandsByCategory = uniqueCategories.reduce((acc, category) => {
          acc[category] = data
            .filter((p) => p.category === category)
            .map((p) => p.brand)
            .filter((b, i, arr) => arr.indexOf(b) === i);
          return acc;
        }, {});
        setBrands(brandsByCategory);
      })
      .catch((err) => console.error(err));

    // Check for stored user and cart information
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    if (storedUser) {
      const storedCart =
        JSON.parse(localStorage.getItem(`cart_${storedUser.email}`)) || [];
      setCart(storedCart);
    } else {
      setCart([]);
    }
  }, []);

  // Listen for changes to cart from storage events
  useEffect(() => {
    const updateCart = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      let storedCart;
      if (storedUser) {
        storedCart =
          JSON.parse(localStorage.getItem(`cart_${storedUser.email}`)) || [];
      } else {
        storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      }
      setCart(storedCart);
    };

    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  // Filter products based on selected brand(s) and price
  const filteredProducts = products.filter((product) => {
    const brandMatch = filter.brand.length
      ? filter.brand.includes(product.brand)
      : true;
    return brandMatch && product.price <= filter.price;
  });

  // Price slider handler
  const handlePriceChange = (e) => {
    const index = Number(e.target.value);
    setSliderIndex(index);
    setFilter((prev) => ({ ...prev, price: pricePoints[index] }));
  };

  // Logout routine
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
    localStorage.removeItem("cart");
    setAccountMenuOpen(false);
  };

  return (
    <>
      <Head>
        <title>Shopaholic - Your Drink Store</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
{/* Filter Slider */}
<div>
  {!isFilterOpen && (
    <div style={styles.sliderToggle} onClick={toggleFilter}>
      <span style={styles.sliderToggleIcon}>☰</span>
    </div>
  )}
  <div
    style={{
      ...styles.filterSlider,
      transform: isFilterOpen ? "translateX(0)" : "translateX(-100%)",
    }}
  >
    <div style={styles.closeButton} onClick={() => setIsFilterOpen(false)}>
      &#10005;
    </div>
    <div style={styles.filterContent}>
      {/* Shop Section */}
      <div style={styles.categoryContainer}>
        <div
          style={styles.categoryHeader}
          onClick={() =>
            setOpenCategories((prev) => ({
              ...prev,
              shop: !prev.shop,
            }))
          }
        >
          <span style={styles.categoryTitle}>Shop</span>
          <button
            style={{
              ...styles.toggleButton,
              ...(openCategories.shop ? styles.toggleButtonActive : {}),
            }}
          >
            +
          </button>
        </div>
        <div
          style={{
            ...styles.categoryContent,
            display: openCategories.shop ? "flex" : "none",
          }}
        >
          <Link href="/best-sellers">
            <MotionButton style={styles.navButton}>Best Sellers</MotionButton>
          </Link>
          <Link href="/new-arrivals">
            <MotionButton style={styles.navButton}>New Arrivals</MotionButton>
          </Link>
          <Link href="/cart">
            <MotionButton style={styles.navButton}>Cart</MotionButton>
          </Link>
        </div>
      </div>

      {/* Account Section */}
      <div style={styles.categoryContainer}>
        <div
          style={styles.categoryHeader}
          onClick={() =>
            setOpenCategories((prev) => ({
              ...prev,
              account: !prev.account,
            }))
          }
        >
          <span style={styles.categoryTitle}>Account</span>
          <button
            style={{
              ...styles.toggleButton,
              ...(openCategories.account ? styles.toggleButtonActive : {}),
            }}
          >
            +
          </button>
        </div>
        <div
          style={{
            ...styles.categoryContent,
            display: openCategories.account ? "flex" : "none",
          }}
        >
          <Link href="/login">
            <MotionButton style={styles.navButton}>Login</MotionButton>
          </Link>
          <Link href="/profile">
            <MotionButton style={styles.navButton}>Profile</MotionButton>
          </Link>
        </div>
      </div>

      {/* Render a block for each category */}
      {categories.map((category) => (
        <div key={category} style={styles.categoryContainer}>
          <div
            style={styles.categoryHeader}
            onClick={() => toggleCategory(category)}
          >
            <span style={styles.categoryTitle}>{category}</span>
            <button
              style={{
                ...styles.toggleButton,
                ...(openCategories[category] ? styles.toggleButtonActive : {}),
              }}
            >
              +
            </button>
          </div>
          <div
            style={{
              ...styles.categoryContent,
              display: openCategories[category] ? "flex" : "none",
              flexWrap: "wrap",
            }}
          >
            {brands[category] &&
              brands[category].map((brand) => (
                <MotionButton
                  key={brand}
                  style={{
                    ...styles.brandButton,
                    ...(filter.brand.includes(brand)
                      ? { backgroundColor: "#333", color: "#fff" }
                      : {}),
                  }}
                  onClick={() => {
                    if (filter.brand.includes(brand)) {
                      setFilter((prev) => ({
                        ...prev,
                        brand: prev.brand.filter((b) => b !== brand),
                      }));
                    } else {
                      setFilter((prev) => ({
                        ...prev,
                        brand: [...prev.brand, brand],
                      }));
                    }
                  }}
                >
                  {brand}
                </MotionButton>
              ))}
          </div>
        </div>
      ))}

      {/* Price Filter */}
      <div style={styles.filterCategory}>
        <label>
          Price: <strong>₹{filter.price}</strong>
          <div>
            <input
              type="range"
              min="0"
              max={pricePoints.length - 1}
              step="1"
              value={sliderIndex}
              onChange={handlePriceChange}
              style={styles.priceSlider}
            />
          </div>
        </label>
      </div>
    </div>
    <div style={styles.clearFilterContainer}>
      <motion.button
        style={styles.clearFiltersButton}
        onClick={() =>
          setFilter({
            brand: [],
            price: pricePoints[pricePoints.length - 1],
          })
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Clear All Filters
      </motion.button>
    </div>
  </div>
</div>

{/* MAIN CONTENT SECTION - shifts based on filter state */}
<div
  style={{
    ...styles.container,
    transform: isFilterOpen ? "translateX(300px)" : "translateX(0)",
    transition: "transform 0.3s ease-in-out",
  }}
>
  <div style={styles.adminLogo}>
    <span style={styles.logoSymbol}>🍹</span>
    <span style={styles.logoText}>Shopaholic</span>
  </div>
  <header style={styles.header}>
    <div style={styles.headerRight}>
      <span style={styles.profileName}>
        {user
          ? `Welcome, ${user.name.split("@")[0]}!`
          : "Please Login to Access Shopaholic!"}
      </span>
      <MotionDiv
        style={styles.accountContainer}
        onClick={() => setAccountMenuOpen((prev) => !prev)}
      >
        👤
      </MotionDiv>
      {accountMenuOpen && (
        <div style={styles.accountDropdown}>
          {user ? (
            <MotionButton
              style={styles.dropdownButton}
              onClick={handleLogout}
            >
              Logout
            </MotionButton>
          ) : (
            <Link href="/login">
              <button style={styles.dropdownButton}>Login</button>
            </Link>
          )}
        </div>
      )}
    </div>
    <div style={styles.menuIcons}>
     
      <Link href="/cart" style={{ textDecoration: "none" }}>
        <MotionDiv style={styles.cartIcon}>
          🛒 <span style={styles.cartCount}>{cart.length}</span>
        </MotionDiv>
      </Link>
    </div>
  </header>
  {/* Dynamic grid layout for product cards */}
  <section
    style={{
      ...styles.productsSection,
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
    }}
  >
    {filteredProducts.map((product) => (
      <motion.div
        key={product._id}
        style={styles.productCard}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {product.newArrival && (
          <div style={styles.newArrivalTag}>New Arrival</div>
        )}
        {product.bestSeller && (
          <div style={styles.bestSellerTag}>Best Seller</div>
        )}
        <Link href={`/product/${product._id}`}>
          <img
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "/placeholder.jpg"
            }
            alt={product.brand}
            style={{
              ...styles.productImage,
              width: "200px",
              height: "200px",
              objectFit: "contain",
            }}
          />
        </Link>
        <h4 style={styles.productDetails}>{product.brand}</h4>
        <div style={styles.priceTag}>₹{product.price}</div>
      </motion.div>
    ))}
  </section>
</div>

      {/* DASHBOARD */}
      <AnimatePresence>
        {dashboardOpen && (
          <SliderDashboard toggleDashboard={() => setDashboardOpen(false)} />
        )}
      </AnimatePresence>

      {/* Page Content */}
      <Footer />
    </>
  );
}

const styles = {
  sliderToggle: {
    position: "fixed",
    top: "15%",
    left: 0,
    transform: "translateY(-50%)",
    width: "50px",
    height: "50px",
    background: "#333",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: "0 8px 8px 0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1100,
  },
  sliderToggleIcon: {
    fontSize: "1.5rem",
  },
  filterSlider: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "300px",
    background: "linear-gradient(to bottom, #fff, #f8f8f8)",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out",
    zIndex: 1050,
  },
  closeButton: {
    alignSelf: "flex-end",
    cursor: "pointer",
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#333",
  },
  filterContent: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: "60px",
  },
  clearFilterContainer: {
    position: "sticky",
    bottom: "4rem", // Adjusted to move the button upwards
    background: "inherit",
    paddingTop: "1rem",
    zIndex: 1100,
    animation: "fadeInUp 0.5s ease-out",
  },
  clearFiltersButton: {
    width: "100%",
    padding: "0.7rem 1.2rem",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, background 0.3s",
  },
  categoryContainer: {
    padding: "1rem",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "1rem",
  },
  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  categoryTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
  },
  toggleButton: {
    width: "30px",
    height: "30px",
    border: "none",
    background: "transparent",
    color: "#333",
    fontSize: "1.5rem",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.3s ease",
  },
  toggleButtonActive: {
    transform: "rotate(45deg)",
  },
  categoryContent: {
    marginTop: "0.75rem",
    display: "none",
    flexDirection: "column",
    gap: "0.5rem",
  },
  brandButton: {
    width: "100%",
    padding: "0.5rem 1rem",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  accountContainer: {
    position: "relative",
    cursor: "pointer",
    padding: "0.5rem",
    marginLeft: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
    background: "#fff",
  },
  accountDropdown: {
    position: "absolute",
    top: "100%",
    left: "88%",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    padding: "0.5rem",
    borderRadius: "5px",
    zIndex: 1200,
  },
  dropdownButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    width: "100%",
    textAlign: "left",
  },
  container: {
    position: "relative",
    background:
      "linear-gradient(to bottom right, rgba(208, 148, 160, 0), white)",
    color: "black",
    padding: "1rem",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    zIndex: 1,
  },
  adminLogo: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
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
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    paddingBottom: "1rem",
    marginBottom: "1rem",
    paddingTop: "4rem",
    position: "relative",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginRight: "2rem",
  },
  profileName: {
    fontWeight: "bold",
  },
  menuIcons: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  menuButton: {
    background: "rgb(255,64,129)",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
  cartIcon: {
    position: "relative",
    fontSize: "1.5rem",
    cursor: "pointer",
    right:"1rem",
  },
  cartCount: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    background: "rgb(255,64,129)",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "0.8rem",
  },
  productDetails: {
    fontSize: "1rem",
    color: "#333",
    margin: "0.5rem 0",
    fontWeight: "bold",
    textAlign: "center",
  },
  priceTag: {
    fontSize: "0.9rem",
    color: "#ff4081",
    margin: "0.3rem 0",
    fontWeight: "bold",
  },
  productsSection: {
    display: "grid",
    gap: "1rem",
    justifyItems: "center",
    marginTop: "1rem",
  },
  productCard: {
    position: "relative",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "0.5rem",
    width: "220px",
    height: "300px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  productImage: {
    width: "70%",
    height: "70%",
    objectFit: "cover",
    borderRadius: "5px",
  },
  newArrivalTag: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "green",
    color: "white",
    padding: "2px 5px",
    fontSize: "0.7rem",
    borderRadius: "3px",
    zIndex: 1200,
  },
  bestSellerTag: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    padding: "2px 5px",
    fontSize: "0.7rem",
    borderRadius: "3px",
    zIndex: 1200,
  },
  categoryContainer: {
    padding: '1rem',
    background: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  categoryTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
  },
  categoryContent: {
    marginTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navButton: {
    width: '100%',
    padding: '0.5rem 1rem',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
};
