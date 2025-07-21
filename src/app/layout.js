import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import theme from "@/theme";

const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Punjabi Attire - Traditional Punjabi Suits & Turbans",
  description: "Shop authentic Punjabi suits and turbans crafted with premium fabrics and traditional designs. Free shipping on orders over $50.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <CartProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flex: '1 0 auto' }}>{children}</main>
                <Footer />
              </div>
              <ToastContainer position="bottom-right" autoClose={3000} />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>       
      </body>
    </html>
  );
}
