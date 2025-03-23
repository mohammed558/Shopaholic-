import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MotionButton, MotionImage } from '../../components/MotionButton';
import Footer from '../../components/Footer';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch the product details and similar products from the API.
  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setCurrentImageIndex(0);
          fetch(`/api/products?category=${data.category}`)
            .then((res) => res.json())
            .then((similar) => {
              const filteredSimilar = similar.filter((p) => p._id !== id);
              setSimilarProducts(filteredSimilar);
            })
            .catch((err) => console.error("Similar products error:", err));
        })
        .catch((err) => console.error("Product fetch error:", err));
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

  // Functions to navigate the images carousel.
  const prevImage = () => {
    // Only decrement if we're not on the first image.
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextImage = () => {
    if (product.images && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <>
      <Head>
        <title>{product.brand} - Product Details</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div style={styles.container}>
        <div style={styles.adminLogo}>
          <span style={styles.logoSymbol}>🍹</span>
          <span style={styles.logoText}>Shopaholic</span>
        </div>

        {/* Main Product Details Section */}
        <div style={styles.productDetailSection}>
          <div style={styles.productImageContainer}>
            {product.images && product.images.length > 0 ? (
              <div style={styles.carouselContainer}>
                {/* Left Arrow */}
                <button style={styles.leftArrow} onClick={prevImage}>
                  {"<"}
                </button>
                {/* Slider Container */}
                <div
                  style={{
                    ...styles.imageSlider,
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                    transition: "transform 0.5s ease-in-out",
                  }}
                >
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={product.brand}
                      style={{
                        width: "100%",
                        flexShrink: 0,
                        objectFit: "contain",
                        borderRadius: "5px",
                      }}
                    />
                  ))}
                </div>
                {/* Right Arrow */}
                <button style={styles.rightArrow} onClick={nextImage}>
                  {">"}
                </button>
                {/* Image Indicators */}
                <div style={styles.indicators}>
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.circle,
                        ...(index === currentImageIndex && styles.activeCircle),
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No Image Available</p>
            )}
          </div>
          <h1 style={styles.productTitle}>{product.brand}</h1>
          <p style={styles.productDescription}>{product.description}</p>
          <p style={styles.productPrice}>
            <strong>Price: ₹{product.price}</strong>
          </p>

          <MotionButton
            style={styles.addToCartButton}
            onClick={() => {
              const storedUser = JSON.parse(localStorage.getItem("user"));
              if (storedUser) {
                const cartKey = `cart_${storedUser.email}`;
                const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
                const existingIndex = cart.findIndex((item) => item._id === product._id);
                if (existingIndex > -1) {
                  cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
                } else {
                  cart.push({ ...product, quantity: 1 });
                }
                localStorage.setItem(cartKey, JSON.stringify(cart));
                window.dispatchEvent(new Event("storage"));
              } else {
                alert("Please log in to add items to your cart.");
              }
            }}
          >
            Add to Cart
          </MotionButton>
        </div>

        {/* Similar Products Section */}
        <section style={styles.similarSection}>
          <h3>Similar Products</h3>
          <div style={styles.similarProductsContainer}>
            {similarProducts.length > 0 ? (
              similarProducts.map((p) => (
                <div key={p._id} style={styles.similarCard}>
                  {p.images && p.images.length > 0 ? (
                    <Link legacyBehavior href={`/product/${p._id}`}>
                      <a>
                        <MotionImage
                          src={p.images[0]}
                          alt={p.brand}
                          style={styles.similarImage}
                        />
                      </a>
                    </Link>
                  ) : (
                    <p>No Image Available</p>
                  )}
                  <h4 style={styles.similarTitle}>{p.brand}</h4>
                  <p style={styles.similarPrice}>
                    <strong>₹{p.price}</strong>
                  </p>
                  <Link legacyBehavior href={`/product/${p._id}`}>
                    <a style={styles.viewDetailsLink}>View Details</a>
                  </Link>
                </div>
              ))
            ) : (
              <p>No similar products found</p>
            )}
          </div>
        </section>

        <Link legacyBehavior href="/">
          <a style={styles.backLink}>← Back to Home</a>
        </Link>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  container: {
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
  productDetailSection: {
    textAlign: "left",
    marginBottom: "1rem",
  },
  productImageContainer: {
    marginTop: "3rem",
  },
  productTitle: {
    fontSize: "2rem",
    margin: "1rem 0 0.5rem 0",
  },
  productDescription: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1rem",
    whiteSpace: "pre-line",
  },
  productPrice: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
  },
  addToCartButton: {
    background: "rgb(255,64,129)",
    border: "none",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  similarSection: {
    marginTop: "2rem",
  },
  similarProductsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
  },
  similarCard: {
    border: "1px solid #ddd",
    padding: "1rem",
    borderRadius: "5px",
    textAlign: "center",
  },
  similarImage: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "5px",
    marginBottom: "0.5rem",
  },
  similarTitle: {
    fontSize: "1rem",
    margin: "0.5rem 0",
  },
  similarPrice: {
    fontSize: "0.9rem",
    margin: "0.5rem 0",
  },
  viewDetailsLink: {
    textDecoration: "none",
    color: "rgb(255,64,129)",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.5rem",
    display: "inline-block",
  },
  backLink: {
    display: "block",
    marginTop: "1rem",
    textDecoration: "none",
    color: "rgb(255,64,129)",
    textAlign: "center",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: "500px",
    overflow: "hidden",
  },
  leftArrow: {
    position: "absolute",
    top: "50%",
    left: "2%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "none",
    color: "white",
    borderRadius: "50%",
    padding: "10px",
    cursor: "pointer",
    zIndex: 2,
    transition: "transform 0.3s ease, background-color 0.3s ease",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  rightArrow: {
    position: "absolute",
    top: "50%",
    right: "2%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "none",
    color: "white",
    borderRadius: "50%",
    padding: "10px",
    cursor: "pointer",
    zIndex: 2,
    transition: "transform 0.3s ease, background-color 0.3s ease",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  imageSlider: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  indicators: {
    position: "absolute",
    bottom: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
    zIndex: 2,
  },
  circle: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  activeCircle: {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
};
