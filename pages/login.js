import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { MotionButton } from '../components/MotionButton';
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      setErrorMsg('');
      router.push('/');
    } else {
      setErrorMsg(data.error);
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Login</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      {/* Absolutely Positioned Logo in Top Left */}
      <div style={styles.adminLogo}>
        <span style={styles.logoSymbol}>🍹</span>
        <span style={styles.logoText}>Shopaholic</span>
      </div>
      
      <h1 style={styles.title}>Login</h1>
      {errorMsg && <h1 style={styles.error}>{errorMsg}</h1>}
      
      <form onSubmit={handleLogin} style={styles.form}>
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
          Login
        </MotionButton>
      </form>
      
      <p>
        Don't have an account?{' '}
        <Link href="/signup" legacyBehavior>
          <a style={styles.link}>Sign Up</a>
        </Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative', // Enables absolute positioning for the logo
    padding: '2rem',
    background: 'white',
    color: 'black',
    textAlign: 'center',
    minHeight: '100vh',
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
    marginTop: '4rem', // Ensures title is pushed below the logo
    fontFamily: "'Roboto', sans-serif",
    fontSize: '2rem',
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
    background: 'rgb(255,64,129)',
    border: 'none',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  link: {
    color: 'rgb(255,64,129)',
    textDecoration: 'underline',
  },
};
