"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import NextLink from "next/link";

import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ProductForm from "@/components/admin/ProductForm";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProductPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const theme = useTheme();

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push(`/login?redirect=/admin/products/edit/${productId}`);
      return;
    }

    // Fetch product and categories
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching product details for ID:", productId);

        // Fetch product details
        const { data: productData } = await axios.get(
          `/api/admin/products/${productId}`
        );
        console.log("Product data received:", productData);

        // Fetch categories
        const { data: categoriesData } = await axios.get("/api/categories");
        console.log("Categories data received:", categoriesData);

        setProduct(productData);
        setCategories(categoriesData.categories || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin && productId) {
      fetchData();
    }
  }, [user, authLoading, router, productId]);

  if (authLoading || loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#2196f3" }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Product not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2c3e50",
            mb: 1,
          }}
        >
          Edit Product: {product.name}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            component={NextLink}
            href="/admin/dashboard"
            underline="hover"
            color="inherit"
          >
            Dashboard
          </MuiLink>
          <MuiLink
            component={NextLink}
            href="/admin/products"
            underline="hover"
            color="inherit"
          >
            Products
          </MuiLink>
          <Typography color="text.primary">Edit Product</Typography>
        </Breadcrumbs>
      </Box>

      {/* Product Form */}
      <Paper
        sx={{ p: 3, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      >
        <ProductForm product={product} categories={categories} isEdit={true} />
      </Paper>
    </Container>
  );
}
