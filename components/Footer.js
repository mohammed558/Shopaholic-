import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { MotionLink } from "./MotionButton";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Logo / Branding */}
        <motion.div
          style={styles.logo}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          🍹Shopaholic
        </motion.div>

        {/* Information Links */}
        <div style={styles.info}>
          <p style={styles.infoText}>
            © {new Date().getFullYear()} Shopaholic. All rights reserved.
          </p>
          <p style={styles.infoLinks}>
            <a href="/privacy" style={styles.link}>Privacy Policy</a>
            {" | "}
            <a href="/terms" style={styles.link}>Terms of Service</a>
          </p>
          <p style={styles.infoText}>
            Contact:{" "}
            <a href="mailto:info@shopaholic.com" style={styles.link}>
              info@shopaholic.com
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div style={styles.social}>
          <MotionLink href="https://facebook.com" style={styles.socialLink} target="_blank" rel="noreferrer">
            <FaFacebookF />
          </MotionLink>
          <MotionLink href="https://twitter.com" style={styles.socialLink} target="_blank" rel="noreferrer">
            <span style={styles.twitterIcon}>X</span>
          </MotionLink>
          <MotionLink href="https://instagram.com" style={styles.socialLink} target="_blank" rel="noreferrer">
            <FaInstagram />
          </MotionLink>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#fff",
    borderTop: "3px solid #ff4081", // Reddish-pink accent
    padding: "2rem 1rem",
    color: "#333",
    fontFamily: "'Roboto', sans-serif",
    marginTop: "2rem",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    textAlign: "center",
  },
  logo: {
    fontFamily: "'Pacifico', cursive",
    color: "#ff4081",
    fontSize: "2.5rem",
  },
  info: {
    fontSize: "0.9rem",
    lineHeight: "1.5rem",
  },
  infoText: {
    margin: "0.3rem 0",
  },
  infoLinks: {
    margin: "0.3rem 0",
  },
  link: {
    color: "#ff4081",
    textDecoration: "none",
    fontWeight: "500",
  },
  social: {
    display: "flex",
    gap: "1.5rem",
    marginTop: "1rem",
    fontSize: "2rem", // Icon size
  },
  socialLink: {
    color: "#ff4081",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  twitterIcon: {
    fontWeight: "bold",
    // You can adjust styling further (e.g., add a border or background) 
    // to mimic an official look if desired.
  },
};

export default Footer;
