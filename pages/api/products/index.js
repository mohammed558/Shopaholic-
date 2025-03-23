import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
  // pages/api/products/index.js
case "GET":
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving products' });
  }
  break;

// pages/api/products/index.js
case 'POST':
  try {
    console.log('Request Body:', req.body);
    const product = await Product.create(req.body);
    console.log('Created Product:', product);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ success: false, error: error.message });
  }
  break;


    default:
      res.status(405).json({ error: 'Method not allowed' });
      break;
  }
}
