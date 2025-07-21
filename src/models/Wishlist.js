import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only add a product to their wishlist once
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;