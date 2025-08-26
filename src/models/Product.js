import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String },
    image: { type: String, required: true },
    images: [String],
    price: { type: Number, required: true },
    brand: { type: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    colors: [String],
    sizes: [String],
    fabric: { type: String },
    occasion: { type: String },
    style: { type: String },
  },
  {
    timestamps: true,
  }
);

// Performance indexes for common filters and sorts
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ discount: -1 });
productSchema.index({ createdAt: -1 });
// Text index to speed up search on name/description
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;