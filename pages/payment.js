import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Payment() {
  // Payment method state: card, upi, or cod (cash on delivery)
  const [selectedMethod, setSelectedMethod] = useState('card');

  // Card payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
  });

  // UPI Payment state
  const [upiId, setUpiId] = useState('');

  // Coupon Code state
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Simulate coupon code application
  const handleApplyCoupon = () => {
    // For demonstration, "SAVE10" applies a 10% discount.
    if (coupon.trim().toUpperCase() === 'SAVE10') {
      setCouponApplied(true);
      setDiscount(10);
      alert("Coupon applied: 10% discount!");
    } else {
      setCouponApplied(false);
      setDiscount(0);
      alert("Invalid coupon code!");
    }
  };

  // When payment is submitted, we build the payload including the account details.
  const initiatePayment = async (e) => {
    e.preventDefault();

    // Base payload for the order
    let payload = {
      method: selectedMethod,
      coupon: couponApplied ? coupon.trim().toUpperCase() : null,
      discount,
      // The backend should verify the details, store the order/payment info,
      // and credit the funds using the account details.
    };

    // Include account details based on the payment method
    if (selectedMethod === 'card') {
      payload = {
        ...payload,
        accountDetails: { ...cardDetails }, // Caution: in production, handle sensitive info securely!
      };
    } else if (selectedMethod === 'upi') {
      payload = {
        ...payload,
        accountDetails: { upiId },
      };
    }
    // For Cash on Delivery, no extra account details are needed.

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        // The backend should store the order details along with the account details provided.
        // It will also manage the crediting process to the admin's account using the provided info.
        alert(`Payment processed successfully using ${selectedMethod.toUpperCase()}!`);
      } else {
        alert(`Payment failed: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing your payment. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Payment - Shopaholic</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>

      <h1 style={styles.header}>Checkout Payment</h1>
      <p style={styles.subHeader}>
        Please choose your preferred payment method, apply any coupon codes, and enter your payment details.
      </p>

      {/* Payment Method Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={selectedMethod === 'card' ? { ...styles.tabBtn, ...styles.activeTab } : styles.tabBtn}
          onClick={() => setSelectedMethod('card')}
        >
          Credit/Debit Card
        </button>
        <button
          style={selectedMethod === 'upi' ? { ...styles.tabBtn, ...styles.activeTab } : styles.tabBtn}
          onClick={() => setSelectedMethod('upi')}
        >
          UPI Payment
        </button>
        <button
          style={selectedMethod === 'cod' ? { ...styles.tabBtn, ...styles.activeTab } : styles.tabBtn}
          onClick={() => setSelectedMethod('cod')}
        >
          Cash on Delivery
        </button>
      </div>

      {/* Coupon Code Section */}
      <div style={styles.couponContainer}>
        <input
          type="text"
          placeholder="Enter Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          style={styles.couponInput}
        />
        <button onClick={handleApplyCoupon} style={styles.couponButton}>
          Apply Coupon
        </button>
        {couponApplied && (
          <span style={styles.couponSuccess}>
            Coupon applied! {discount}% off
          </span>
        )}
      </div>

      {/* Payment Form Section Based on Selected Method */}
      {selectedMethod === 'card' && (
        <form onSubmit={initiatePayment} style={styles.form}>
          <input
            type="text"
            placeholder="Card Number"
            value={cardDetails.cardNumber}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cardNumber: e.target.value })
            }
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Expiry (MM/YY)"
            value={cardDetails.expiry}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, expiry: e.target.value })
            }
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="CVV"
            value={cardDetails.cvv}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cvv: e.target.value })
            }
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Card Holder Name"
            value={cardDetails.cardHolder}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cardHolder: e.target.value })
            }
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Pay Now
          </button>
        </form>
      )}

      {selectedMethod === 'upi' && (
        <form onSubmit={initiatePayment} style={styles.form}>
          <input
            type="text"
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Pay via UPI
          </button>
        </form>
      )}

      {selectedMethod === 'cod' && (
        <div style={styles.codContainer}>
          <p style={styles.infoText}>
            You have chosen Cash on Delivery. Your order will be delivered and payment will be collected at your doorstep.
          </p>
          <button onClick={initiatePayment} style={styles.button}>
            Confirm Order
          </button>
        </div>
      )}

      <Link href="/" style={styles.backLink}>
        ← Back to Home
      </Link>
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    color: 'black',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subHeader: {
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  tabContainer: {
    display: 'flex',
    marginBottom: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    overflow: 'hidden',
    width: '320px',
  },
  tabBtn: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: 'none',
    background: '#f7f7f7',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeTab: {
    background: 'white',
    borderBottom: '2px solid rgb(255,77,136)',
    fontWeight: 'bold',
  },
  couponContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    width: '320px',
  },
  couponInput: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  couponButton: {
    padding: '0.5rem 1rem',
    background: 'rgb(255,77,136)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  couponSuccess: {
    color: 'green',
    fontSize: '0.9rem',
    marginLeft: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '320px',
    marginBottom: '1.5rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: 'rgb(255,77,136)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  codContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '320px',
    marginBottom: '1.5rem',
  },
  infoText: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  backLink: {
    marginTop: '1rem',
    textDecoration: 'none',
    color: 'rgb(255,77,136)',
    fontSize: '1rem',
  },
};
