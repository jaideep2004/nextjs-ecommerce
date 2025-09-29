"use client";

import { useState, useEffect } from "react";
import {
	Box,
	Container,
	Paper,
	Typography,
	Breadcrumbs,
	Link as MuiLink,
	CircularProgress,
  Alert,
  useTheme
} from "@mui/material";
import NextLink from "next/link";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateProductPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();

	useEffect(() => {
		// Redirect if not admin
		if (!authLoading && (!user || !user.isAdmin)) {
			router.push("/login?redirect=/admin/products/create");
			return;
		}

		// Fetch categories
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/categories");
				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						errorData.message || `HTTP error! status: ${response.status}`
					);
				}
				const data = await response.json();
				// Correctly access categories from the API response structure
				const categoriesData = data.data?.categories || [];
				setCategories(categoriesData);

				// Log if no categories found
				if (!categoriesData.length) {
					console.warn("No categories found in the database");
				}
			} catch (err) {
				console.error("Error fetching categories:", err);
				setError(
					`Failed to load categories: ${err.message}. Please try again.`
				);
			} finally {
				setLoading(false);
			}
		};

		if (user && user.isAdmin) {
			fetchCategories();
		}
	}, [user, authLoading, router]);

	if (authLoading || loading) {
		return (
			<Container maxWidth='xl' sx={{ py: 3 }}>
				<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
					<CircularProgress sx={{ color: "#2196f3" }} />
				</Box>
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxWidth='xl' sx={{ py: 3 }}>
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth='xl' sx={{ py: 3 }}>
			{/* Page Header */}
			<Box sx={{ mb: 4 }}>
				<Typography
					variant='h4'
					sx={{
						fontWeight: 700,
						color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2c3e50",
					}}>
					Create New Product
				</Typography>
				<Breadcrumbs aria-label='breadcrumb'>
					<MuiLink
						component={NextLink}
						href='/admin/dashboard'
						underline='hover'
						color='inherit'>
						Dashboard
					</MuiLink>
					<MuiLink
						component={NextLink}
						href='/admin/products'
						underline='hover'
						color='inherit'>
						Products
					</MuiLink>
					<Typography color='text.primary'>Create New Product</Typography>
				</Breadcrumbs>
			</Box>

			{/* Product Form */}
			<Paper
				sx={{ p: 3, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
				<ProductForm categories={categories} isEdit={false} />
			</Paper>
		</Container>
	);
}
