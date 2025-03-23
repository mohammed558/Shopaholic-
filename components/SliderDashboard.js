import { motion } from 'framer-motion';
import Link from 'next/link';
import { MotionButton } from './MotionButton';

export default function SliderDashboard({ toggleDashboard }) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.5 }}
      style={styles.dashboard}
    >
      <MotionButton onClick={toggleDashboard} style={styles.closeButton}>✖</MotionButton>
      <h2 style={styles.title}>Menu</h2>
      <div style={styles.filterContent}>
        {/* Menu Links */}
        <div style={styles.categoryContainer}>
          <div style={styles.categoryHeader}>
            <span style={styles.categoryTitle}>Shop</span>
          </div>
          <div style={styles.categoryContent}>
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
          <div style={styles.categoryHeader}>
            <span style={styles.categoryTitle}>Account</span>
          </div>
          <div style={styles.categoryContent}>
            <Link href="/login">
              <MotionButton style={styles.navButton}>Login</MotionButton>
            </Link>
            <Link href="/profile">
              <MotionButton style={styles.navButton}>Profile</MotionButton>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  dashboard: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '300px',
    height: '100%',
    background: 'linear-gradient(to bottom, #fff, #f8f8f8)',
    color: '#333',
    padding: '1rem',
    boxShadow: '-4px 0 8px rgba(0,0,0,0.2)',
    zIndex: 1000,
    fontFamily: "'Roboto', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    background: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    position: 'absolute',
    top: '15px',
    right: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  filterContent: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '1rem',
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
