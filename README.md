# Next.js E-commerce Application

A modern e-commerce application built with Next.js, Material-UI, and MongoDB.

## Features

- Responsive design with Material-UI
- User authentication and authorization
- Product catalog with filtering and search
- Shopping cart functionality
- Admin dashboard for managing products, orders, and customers
- Order management and checkout process

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

### User Registration and Login

- Users can register at `/register`
- Users can log in at `/login`
- After login, regular users are redirected to the homepage
- Admin users are redirected to the admin dashboard at `/admin/dashboard`

### Creating an Admin User

To create an admin user, run the following command:

```bash
node scripts/create-admin.js
```

This script will create an admin user with the following credentials:
- Email: admin@example.com
- Password: admin123

**Note:** Please change the password after the first login for security reasons.

## Admin Dashboard

The admin dashboard is accessible at `/admin/dashboard` for users with admin privileges. From here, you can:

- View sales statistics
- Manage products
- Process orders
- Manage customer accounts
- Configure store settings

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable UI components
- `/src/contexts` - React context providers
- `/src/models` - MongoDB schema models
- `/src/utils` - Utility functions
- `/src/lib` - Library code
- `/public` - Static assets

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
