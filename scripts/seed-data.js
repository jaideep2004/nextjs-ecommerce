const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jai2004bgmi:jai2004nextjs@nextjs-ecommerce.rkuzuet.mongodb.net/?retryWrites=true&w=majority&appName=nextjs-ecommerce';

// Define schemas
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

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        color: { type: String },
        size: { type: String },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: false },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    orderStatus: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
    trackingNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Seed data
async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if we already have users
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} existing users`);

    if (userCount === 0) {
      console.log('Seeding users...');
      // Create admin user
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
      });
      await adminUser.save();
      console.log('Admin user created');

      // Create regular users
      const regularUsers = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: hashedPassword,
          phone: '555-1234',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            postalCode: '12345',
            country: 'USA',
          },
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: hashedPassword,
          phone: '555-5678',
          address: {
            street: '456 Oak Ave',
            city: 'Somewhere',
            state: 'NY',
            postalCode: '67890',
            country: 'USA',
          },
        },
        {
          name: 'Jaideep',
          email: 'jaisidhu2004@gmail.com',
          password: hashedPassword,
          phone: '1233333333',
          address: {
            street: '5747',
            city: 'abc',
            state: 'CA',
            postalCode: '',
            country: 'United States',
          },
        },
      ];

      await User.insertMany(regularUsers);
      console.log('Regular users created');
    }

    // Check if we already have orders
    const orderCount = await Order.countDocuments();
    console.log(`Found ${orderCount} existing orders`);

    if (orderCount === 0) {
      console.log('Seeding orders...');
      // Get all non-admin users
      const users = await User.find({ isAdmin: false });
      
      if (users.length === 0) {
        console.log('No non-admin users found. Cannot create orders.');
        return;
      }

      // Create orders for each user
      for (const user of users) {
        const order = new Order({
          user: user._id,
          orderItems: [
            {
              name: 'Sample Product',
              quantity: 2,
              image: '/images/sample.jpg',
              price: 99.99,
              product: new mongoose.Types.ObjectId(),
            },
          ],
          shippingAddress: {
            fullName: user.name,
            address: user.address?.street || '123 Street',
            city: user.address?.city || 'City',
            postalCode: user.address?.postalCode || '12345',
            country: user.address?.country || 'Country',
            phone: user.phone || '555-1234',
          },
          paymentMethod: 'PayPal',
          itemsPrice: 199.98,
          shippingPrice: 10,
          taxPrice: 20,
          totalPrice: 229.98,
          isPaid: false,
          isDelivered: false,
          orderStatus: 'Pending',
        });
        
        await order.save();
        console.log(`Order created for user: ${user.name}`);
      }

      console.log('Orders created');
    }

    console.log('Seed data completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedData(); 