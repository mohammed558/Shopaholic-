import { useState, useEffect } from 'react';

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        console.log('Products received:', data);
        // Our API returns an array of products
        setProducts(data);
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Product Listing</h1>
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Price:</strong> Rs.{product.price}
            </p>
            {product.image && (
              <img
                src={product.image}
                alt={`${product.brand} product`}
                style={{ width: '100px', marginTop: '0.5rem' }}
              />
            )}
            <p>
              <strong>New Arrival:</strong>{' '}
              {product.newArrival ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Best Seller:</strong>{' '}
              {product.bestSeller ? 'Yes' : 'No'}
            </p>
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
