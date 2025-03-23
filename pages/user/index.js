import { useEffect, useState } from 'react';

export default function UserHome() {
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome, {userEmail || "User"}!</h1>
      <p>This is your dashboard.</p>
    </div>
  );
}
