// pages/Signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { MotionButton } from '../components/MotionButton';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    // Send all signup fields to your API endpoint
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, dateOfBirth, phone, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setErrorMsg('');
      router.push('/login');
    } else {
      setErrorMsg(data.error);
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Sign Up</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      {/* Absolutely positioned logo at top left */}
      <div style={styles.adminLogo}>
        <span style={styles.logoSymbol}>🍹</span>
        <span style={styles.logoText}>Shopaholic</span>
      </div>
      
      <h1 style={styles.title}>Sign Up</h1>
      {errorMsg && <h1 style={styles.error}>{errorMsg}</h1>}
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={e => setDateOfBirth(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <MotionButton type="submit" style={styles.button}>
          Sign Up
        </MotionButton>
      </form>
      <p>
        Already have an account?{' '}
        <Link href="/login" legacyBehavior>
          <a style={styles.link}>Login</a>
        </Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    padding: '2rem',
    background: 'white',
    color: 'black',
    textAlign: 'center',
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
    marginRight: '0.5rem',
  },
  logoText: {
    fontFamily: "'Pacifico', cursive",
    fontSize: '2rem',
    color: 'red',
  },
  title: {
    marginTop: '4rem',
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  input: {
    padding: '0.75rem',
    width: '300px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  button: {
    background: 'rgb(255, 64, 129)',
    border: 'none',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  link: {
    color: 'rgb(255, 64, 129)',
    textDecoration: 'underline',
  },
};