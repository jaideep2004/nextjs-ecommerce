import { Geist, Geist_Mono } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

import { ThemeContextProvider } from "@/theme";
import AppContent from "@/components/AppContent";
import { SessionProvider, SettingsProvider, AuthProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "India Inspired - Traditional Punjabi Suits & Turbans",
  description: "Shop authentic Punjabi suits and turbans crafted with premium fabrics and traditional designs. Free shipping on orders over $50.",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <SettingsProvider>
            <AuthProvider>
              <ThemeContextProvider>
                <AppContent>{children}</AppContent>
              </ThemeContextProvider>
            </AuthProvider>
          </SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}