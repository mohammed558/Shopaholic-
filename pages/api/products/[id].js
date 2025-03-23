// pages/api/products/[id].js
import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  // Connect to MongoDB
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json(product);
      } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

    case 'DELETE':
      try {
        const deleted = await Product.deleteOne({ _id: id });
        if (deleted.deletedCount === 0) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        return res.status(200).json({ success: true, message: 'Product deleted successfully' });
      } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
      }

    // Optionally, include PUT handling for updating a product.
    case 'PUT':
      try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        return res.status(200).json({ success: true, data: updatedProduct });
      } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
