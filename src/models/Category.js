import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a category slug'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  { timestamps: true }
);

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

// Set virtuals to true in toJSON
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

// Create the model only if it doesn't exist already
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;