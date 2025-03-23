import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { MotionButton, MotionDiv, MotionImage } from "../components/MotionButton";
import Footer from "../components/Footer";
export default function Cart() {
  const [cartItems, setCartItems] = useState([]); // aggregated objects with quantity
  const [totals, setTotals] = useState({ subtotal: 0, gst: 0, total: 0 });
  const [user, setUser] = useState(null);

  // Function to calculate totals based on quantity
  const calculateTotals = (items) => {
    // Use price * quantity for each product
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    setTotals({ subtotal, gst, total });
  };

  // On mount, load user and their cart from localStorage using a user-specific key if available.
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    let storedCart;
    if (storedUser) {
      storedCart =
        JSON.parse(localStorage.getItem(`cart_${storedUser.email}`)) || [];
    } else {
      storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    }

    setCartItems(storedCart);
    calculateTotals(storedCart);
  }, []);

  // Update cart based on correct key when storage changes.
  const updateCart = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    let updatedCart;
    if (storedUser) {
      updatedCart =
        JSON.parse(localStorage.getItem(`cart_${storedUser.email}`)) || [];
    } else {
      updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
    }
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  useEffect(() => {
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  // Increase quantity of item with the given product ID.
  const increaseQuantity = (itemId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const cartKey = storedUser ? `cart_${storedUser.email}` : "cart";
    const updatedCart = cartItems.map((item) => {
      if (item._id === itemId) {
        return { ...item, quantity: (item.quantity || 1) + 1 };
      }
      return item;
    });
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
    window.dispatchEvent(new Event("storage"));
  };

  // Decrease quantity of item with given product ID. Remove if quantity becomes zero.
  const decreaseQuantity = (itemId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const cartKey = storedUser ? `cart_${storedUser.email}` : "cart";
    const updatedCart = cartItems
      .map((item) => {
        if (item._id === itemId) {
          // If decrementing below 1, we filter it out later.
          return { ...item, quantity: (item.quantity || 1) - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
    window.dispatchEvent(new Event("storage"));
  };

  // Remove an item completely from the cart.
  const deleteItem = (itemId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const cartKey = storedUser ? `cart_${storedUser.email}` : "cart";
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = () => {
    alert("Initiating payment via real-time payment gateway...");
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Your Cart</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Absolutely Positioned Logo on Top Left */}
      <div style={styles.adminLogo}>
        <span style={styles.logoSymbol}>🍹</span>
        <span style={styles.logoText}>Shopaholic</span>
      </div>

      <header style={styles.header}>
        <h1 style={styles.title}>🛒 Your Cart</h1>
      </header>

      {cartItems.length === 0 ? (
        <p style={styles.emptyCart}>Your cart is empty.</p>
      ) : (
        <div>
          <div style={styles.itemsList}>
            {cartItems.map((item) => (
              <div key={item._id} style={styles.item}>
                <Link href={`/product/${item._id}`} legacyBehavior>
                  <a style={{ textDecoration: "none" }}>
                 
                    <MotionImage
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : "/placeholder.jpg"
                      }
                      alt={item.name || item.brand}
                      style={{
                        ...styles.itemImage,
                        objectFit: "contain",
                      }}
                    />
                    
                 
                  </a>
                </Link>
                <div style={styles.itemDetails}>
                  <p style={styles.itemName}>{item.name || item.brand}</p>
                  <p style={styles.itemPrice}>₹{item.price}</p>
                  <div>
                    <MotionButton
                      style={styles.quantityButton}
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      –
                    </MotionButton>
                    <span style={styles.quantityText}>
                      {item.quantity || 1}
                    </span>
                    <MotionButton
                      style={styles.quantityButton}
                      onClick={() => increaseQuantity(item._id)}
                    >
                      +
                    </MotionButton>
                  </div>
                  <MotionButton
                    style={styles.deleteButton}
                    onClick={() => deleteItem(item._id)}
                  >
                    Remove
                  </MotionButton>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.summary}>
            <p>Subtotal: ₹{totals.subtotal.toFixed(2)}</p>
            <p>GST (18%): ₹{totals.gst.toFixed(2)}</p>
            <p style={styles.total}>Total: ₹{totals.total.toFixed(2)}</p>
          </div>
          <Link href="/payment" legacyBehavior>
            <a style={{ textDecoration: "none" }}>
              <MotionButton style={styles.checkoutButton}>
                Proceed to Checkout
              </MotionButton>
            </a>
          </Link>
        </div>
      )}
      <Link href="/" legacyBehavior>
        <a style={styles.backLink}>← Continue Shopping</a>
      </Link>
      <Footer/>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    padding: "2rem",
    background:
      "linear-gradient(to bottom right, rgba(208, 148, 160, 0), white)",
    color: "black",
    fontFamily: "'Roboto', sans-serif",
    minHeight: "100vh",
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
    textAlign: "center",
    padding: "1rem",
    marginBottom: "1.5rem",
    marginTop: "4rem",
  },
  title: {
    fontSize: "2rem",
    margin: 0,
    color: "#f50057",
  },
  emptyCart: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#555",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  item: {
    display: "flex",
    alignItems: "center",
    background: "white",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    gap: "1rem",
  },
  itemImage: {
    width: "100px",
    height: "100px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  itemPrice: {
    fontSize: "1rem",
    color: "#757575",
    marginBottom: "0.5rem",
  },
  quantityButton: {
    background: "rgb(255,64,129)",
    border: "none",
    color: "white",
    padding: "0.2rem 0.5rem",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "0 0.5rem",
  },
  quantityText: {
    fontSize: "1rem",
    margin: "0 0.5rem",
  },
  deleteButton: {
    background: "rgb(255,64,129)",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
  summary: {
    textAlign: "left",
    background: "white",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  total: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "rgb(255,64,129)",
    marginTop: "0.5rem",
  },
  checkoutButton: {
    display: "block",
    margin: "1.5rem auto 0",
    padding: "0.75rem 2rem",
    background: "rgb(255,64,129)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textDecoration: "none",
  },
  backLink: {
    marginTop: "2rem",
    display: "block",
    textDecoration: "none",
    color: "rgb(255,64,129)",
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  },
};
