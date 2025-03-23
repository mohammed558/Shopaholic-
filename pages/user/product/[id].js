import { useRouter } from 'next/router';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Product Detail</h1>
      <p>Viewing product with ID: {id}</p>
      {/* Display product details here */}
    </div>
  );
}
