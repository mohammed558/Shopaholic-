import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false, // Optional field for product description
    },
    images: {
      type: [String],
      default: [],
      required: false,
    },
    
    
    newArrival: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Export the model if it doesn't exist, else reuse the existing model.
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
