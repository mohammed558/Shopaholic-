import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MotionButton,MotionDiv } from '../components/MotionButton';
import Footer from '../components/Footer';
export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    // Fetch all products from the API and filter for new arrivals.
    fetch(`/api/products?cb=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((product) => product.newArrival === true);
        setNewArrivals(filtered);
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  return (
    <div style={styles.container}>
      <Head>
        <title>New Arrivals - Shopaholic</title>
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
      
      {/* Header content with extra top padding so content is not hidden behind the absolute logo */}
      <header style={styles.header}>
        <h1 style={styles.title}>New Arrivals</h1>
      </header>
      
      <ul style={styles.list}>
        {newArrivals.map((item) => (
          <li key={item._id} style={styles.listItem}>
            <Link href={`/product/${item._id}`} legacyBehavior>
              <a style={{ textDecoration: 'none', color: 'inherit' }}>
              <MotionDiv style={styles.itemContainer}>
                  <img 
                    src={
                      item.images && item.images.length 
                        ? item.images[0] 
                        : '/placeholder.jpg'
                    }
                    alt={item.brand}
                    style={{
                      ...styles.itemImage,
                      objectFit: 'contain',
                    }}
                  />
                  <div style={styles.itemInfo}>
                    <h2 style={styles.itemName}>{item.name}</h2>
                    <p style={styles.itemDetails}>Category: {item.category}</p>
                    <p style={styles.itemDetails}>Brand: {item.brand}</p>
                    <p style={styles.itemDetails}>Price: ₹{item.price}</p>
                    {item.newArrival && <p style={styles.tagNew}>New Arrival</p>}
                  </div>
                </MotionDiv>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      
      <Link href="/" legacyBehavior>
        <a style={styles.backLink}>← Back to Home</a>
      </Link>
      <Footer />
    </div>
  );
}

const styles = {
  container: { 
    position: 'relative', // Enable absolute positioning for the logo
    background: 'linear-gradient(to bottom right, rgba(208, 148, 160, 0), white)',
    color: 'black', 
    padding: '1rem', 
    minHeight: '100vh',
    fontFamily: "'Roboto', sans-serif",
  },
  adminLogo: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  logoSymbol: { 
    fontSize: '2rem', 
    marginRight: '0.5rem' 
  },
  logoText: { 
    fontFamily: "'Pacifico', cursive", 
    fontSize: '2rem', 
    color: 'red' 
  },
  header: { 
    textAlign: 'center', 
    paddingTop: '4rem', // extra padding to prevent overlap with the logo
    marginBottom: '1rem',
  },
  title: {
    color: '#f50057',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    margin: '2rem 0',
  },
  list: { 
    listStyle: 'none', 
    padding: 0, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem'
  },
  listItem: { 
    background: 'white', 
    borderRadius: '10px', 
    padding: '1rem', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1rem', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  itemContainer: { 
    display: 'flex', 
    alignItems: 'center',
    gap: '1rem',  // <-- Added extra space here.
  },
  itemImage: { 
    width: '120px', 
    height: '120px', 
    // changed objectFit to 'contain' here as well
    objectFit: 'contain', 
    borderRadius: '10px', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  itemName: { 
    margin: 0, 
    fontSize: '1.5rem',
    color: '#212121',
    fontWeight: 'bold'
  },
  itemDetails: { 
    margin: 0, 
    color: '#757575' 
  },
  tagNew: { 
    color: '#4caf50', 
    fontWeight: 'bold', 
    padding: '0.2rem 0.5rem', 
    borderRadius: '5px', 
    background: 'rgba(76,175,80,0.1)',
    alignSelf: 'flex-start'
  },
  backLink: { 
    marginTop: '2rem', 
    display: 'block', 
    textDecoration: 'none', 
    color: 'rgb(255,77,136)', 
    textAlign: 'center',
    fontSize: '1.1rem', 
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  },
};
