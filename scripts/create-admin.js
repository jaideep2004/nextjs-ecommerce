// Script to create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI||'mongodb+srv://jai2004bgmi:jai2004nextjs@nextjs-ecommerce.rkuzuet.mongodb.net/?retryWrites=true&w=majority&appName=nextjs-ecommerce';

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}
  
// User schema definition
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    phone: { type: String },
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

// Create User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Admin user data
const adminData = {
  name: 'Admin User',
  email: 'admin@gmail.com',
  password: 'admin@321',  // This will be hashed before saving
  isAdmin: true,
  phone: '1234567890'
};

// Function to hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Function to create admin user
async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists with this email');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await hashPassword(adminData.password);

    // Create new admin user
    const adminUser = new User({
      ...adminData,
      password: hashedPassword
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('Please change this password after first login for security reasons.');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the function
createAdminUser();