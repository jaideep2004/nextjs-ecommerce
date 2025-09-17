import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Not required for OAuth users
    isAdmin: { type: Boolean, required: true, default: false },
    phone: { type: String },
    image: { type: String }, // Profile image from OAuth or uploaded
    provider: { type: String }, // 'local', 'google', etc.
    providerId: { type: String }, // OAuth provider ID
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;