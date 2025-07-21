"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
	Container,
	Grid,
	Box,
	Typography,
	Breadcrumbs,
	Paper,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Slider,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Button,
	Divider,
	Pagination,
	CircularProgress,
	Alert,
	IconButton,
	InputAdornment,
} from "@mui/material";
import { NavigateNext, FilterList, Search, Clear } from "@mui/icons-material";
import ProductGrid from "@/components/products/ProductGrid";

export default function ProductsPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { addToCart } = useCart();
	const { user } = useAuth();

	// State for products and loading
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [wishlistItems, setWishlistItems] = useState([]);

	// State for pagination
	const [pagination, setPagination] = useState({
		page: 1,
		pages: 1,
		total: 0,
	});

	// State for filters
	const [filters, setFilters] = useState({
		category: "",
		subcategory: "",
		minPrice: 0,
		maxPrice: 1000,
		search: "",
		sort: "createdAt:desc",
	});

	// State for mobile filter drawer
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	// Categories and subcategories (would typically come from an API)
	const categories = ["Punjabi Suits", "Turbans", "Accessories"];
	const subcategories = {
		"Punjabi Suits": ["Wedding", "Casual", "Formal", "Party Wear"],
		Turbans: ["Pagri", "Patiala Shahi", "Amritsar", "Morni"],
		Accessories: ["Jutti", "Kara", "Patka", "Cufflinks"],
	};

	// Sort options
	const sortOptions = [
		{ value: "price:asc", label: "Price: Low to High" },
		{ value: "price:desc", label: "Price: High to Low" },
		{ value: "createdAt:desc", label: "Newest First" },
		{ value: "rating:desc", label: "Top Rated" },
	];

	// Initialize filters from URL params
	useEffect(() => {
		const category = searchParams.get("category") || "";
		const subcategory = searchParams.get("subcategory") || "";
		const minPrice = Number(searchParams.get("minPrice") || 0);
		const maxPrice = Number(searchParams.get("maxPrice") || 1000);
		const search = searchParams.get("search") || "";
		const sort = searchParams.get("sort") || "createdAt:desc";
		const page = Number(searchParams.get("page") || 1);

		setFilters({
			category,
			subcategory,
			minPrice,
			maxPrice,
			search,
			sort,
		});

		setPagination((prev) => ({ ...prev, page }));
	}, [searchParams]);

	// Fetch products when filters or pagination change
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);

				// Build query string from filters
				const queryParams = new URLSearchParams();
				if (filters.category) queryParams.append("category", filters.category);
				if (filters.subcategory)
					queryParams.append("subcategory", filters.subcategory);
				if (filters.minPrice > 0)
					queryParams.append("minPrice", filters.minPrice);
				if (filters.maxPrice < 1000)
					queryParams.append("maxPrice", filters.maxPrice);
				if (filters.search) queryParams.append("search", filters.search);
				if (filters.sort) queryParams.append("sort", filters.sort);
				queryParams.append("page", pagination.page);
				queryParams.append("limit", 12); // Products per page

				const res = await axios.get(`/api/products?${queryParams.toString()}`);
				console.log('Products API response:', res.data);

				// Handle different response structures
				const productsData = res.data.products || res.data.data?.products || [];
				const paginationData = res.data.pagination || res.data.data?.pagination || {
					page: 1,
					pages: 1,
					total: productsData.length,
				};

				setProducts(productsData);
				setPagination({
					page: paginationData.page,
					pages: paginationData.pages,
					total: paginationData.total,
				});
			} catch (err) {
				console.error("Error fetching products:", err);
				setError(err.response?.data?.message || "Failed to load products");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [filters, pagination.page]);
	
	// Fetch wishlist items if user is logged in
	useEffect(() => {
		const fetchWishlist = async () => {
			if (user) {
				try {
					const res = await axios.get('/api/wishlist');
					const items = res.data.wishlist || [];
					setWishlistItems(items.map(item => item.product || { _id: item.productId }));
				} catch (error) {
					console.error('Error fetching wishlist:', error);
				}
			}
		};
		
		fetchWishlist();
	}, [user]);

	// Handle filter changes
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({
			...prev,
			[name]: value,
			// Reset page when filters change
			...(name !== "page" && { page: 1 }),
		}));

		// Reset subcategory when category changes
		if (name === "category") {
			setFilters((prev) => ({ ...prev, subcategory: "" }));
		}
	};

	// Handle price range change
	const handlePriceChange = (event, newValue) => {
		setFilters((prev) => ({
			...prev,
			minPrice: newValue[0],
			maxPrice: newValue[1],
		}));
	};

	// Handle search
	const handleSearch = (e) => {
		e.preventDefault();
		// Update filters with current search input
		handleFilterChange("search", filters.search);
	};

	// Handle page change
	const handlePageChange = (event, value) => {
		setPagination((prev) => ({ ...prev, page: value }));
	};

	// Clear all filters
	const clearFilters = () => {
		setFilters({
			category: "",
			subcategory: "",
			minPrice: 0,
			maxPrice: 1000,
			search: "",
			sort: "createdAt:desc",
		});
		setPagination((prev) => ({ ...prev, page: 1 }));
	};
	
	// Cart and wishlist handlers
	const handleAddToCart = (product) => {
		addToCart(product, 1, '', '', user);
	};
	
	const handleAddToWishlist = async (product) => {
		if (!user) {
			// Redirect to login if not authenticated
			router.push('/login?redirect=/products');
			return;
		}
		
		try {
			await axios.post('/api/wishlist', { productId: product._id });
			setWishlistItems(prev => [...prev, product]);
		} catch (error) {
			console.error('Add to wishlist failed:', error);
		}
	};
	
	const handleRemoveFromWishlist = async (productId) => {
		try {
			await axios.delete(`/api/wishlist/${productId}`);
			setWishlistItems(prev => prev.filter(item => item._id !== productId));
		} catch (error) {
			console.error('Remove from wishlist failed:', error);
		}
	};

	return (
		<Container maxWidth='lg' sx={{ py: 4 }}>
			{/* Breadcrumbs */}
			<Breadcrumbs
				separator={<NavigateNext fontSize='small' />}
				aria-label='breadcrumb'
				sx={{ mb: 3 }}>
				<Link href='/' passHref>
					<Typography
						color='inherit'
						sx={{ "&:hover": { textDecoration: "underline" } }}>
						Home
					</Typography>
				</Link>
				<Typography color='text.primary'>Products</Typography>
			</Breadcrumbs>

			<Grid container spacing={3}>
				{/* Filters Sidebar */}
				<Grid item xs={12} md={3}>
					<Paper sx={{ p: 2, mb: { xs: 2, md: 0 } }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 2,
							}}>
							<Typography
								variant='h6'
								component='h2'
								sx={{ fontWeight: "bold" }}>
								Filters
							</Typography>
							<Button size='small' onClick={clearFilters} startIcon={<Clear />}>
								Clear All
							</Button>
						</Box>

						<Divider sx={{ mb: 2 }} />

						{/* Category Filter */}
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel id='category-select-label'>Category</InputLabel>
							<Select
								labelId='category-select-label'
								value={filters.category}
								label='Category'
								onChange={(e) =>
									handleFilterChange("category", e.target.value)
								}>
								<MenuItem value=''>All Categories</MenuItem>
								{categories.map((category) => (
									<MenuItem key={category} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{/* Subcategory Filter (only show if category is selected) */}
						{filters.category && (
							<FormControl fullWidth sx={{ mb: 2 }}>
								<InputLabel id='subcategory-select-label'>
									Subcategory
								</InputLabel>
								<Select
									labelId='subcategory-select-label'
									value={filters.subcategory}
									label='Subcategory'
									onChange={(e) =>
										handleFilterChange("subcategory", e.target.value)
									}>
									<MenuItem value=''>All Subcategories</MenuItem>
									{subcategories[filters.category]?.map((subcategory) => (
										<MenuItem key={subcategory} value={subcategory}>
											{subcategory}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						)}

						{/* Price Range Filter */}
						<Box sx={{ mb: 2 }}>
							<Typography variant='subtitle1' gutterBottom>
								Price Range
							</Typography>
							<Slider
								value={[filters.minPrice, filters.maxPrice]}
								onChange={handlePriceChange}
								valueLabelDisplay='auto'
								min={0}
								max={1000}
								sx={{
									color: "#8D6E63",
									"& .MuiSlider-thumb": {
										"&:hover, &.Mui-focusVisible": {
											boxShadow: "0px 0px 0px 8px rgba(141, 110, 99, 0.16)",
										},
									},
								}}
							/>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant='body2'>${filters.minPrice}</Typography>
								<Typography variant='body2'>${filters.maxPrice}</Typography>
							</Box>
						</Box>

						{/* Additional filters could be added here */}
					</Paper>
				</Grid>

				{/* Products Grid */}
				<Grid item xs={12} md={9}>
					{/* Search and Sort Bar */}
					<Paper sx={{ p: 2, mb: 3 }}>
						<Grid container spacing={2} alignItems='center'>
							<Grid item xs={12} md={6}>
								<form onSubmit={handleSearch}>
									<TextField
										fullWidth
										placeholder='Search products...'
										value={filters.search}
										onChange={(e) =>
											setFilters((prev) => ({
												...prev,
												search: e.target.value,
											}))
										}
										InputProps={{
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton type='submit' edge='end'>
														<Search />
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</form>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel id='sort-select-label'>Sort By</InputLabel>
									<Select
										labelId='sort-select-label'
										value={filters.sort}
										label='Sort By'
										onChange={(e) =>
											handleFilterChange("sort", e.target.value)
										}>
										{sortOptions.map((option) => (
											<MenuItem key={option.value} value={option.value}>
												{option.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Paper>

					{/* Results Count */}
					{!loading && !error && (
						<Typography variant='body2' sx={{ mb: 2 }}>
							Showing {products.length} of {pagination.total} products
						</Typography>
					)}

					{/* Products Grid */}
					<ProductGrid
						products={products}
						loading={loading}
						error={error}
						wishlistItems={wishlistItems}
						onAddToCart={handleAddToCart}
						onAddToWishlist={handleAddToWishlist}
						onRemoveFromWishlist={handleRemoveFromWishlist}
					/>
					
					{/* Pagination */}
					{!loading && !error && pagination.pages > 1 && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
							<Pagination
								count={pagination.pages}
								page={pagination.page}
								onChange={handlePageChange}
								color="primary"
								size="large"
								sx={{
									'& .MuiPaginationItem-root': {
										color: '#5D4037',
									},
									'& .Mui-selected': {
										backgroundColor: '#8D6E63 !important',
										color: 'white',
									},
								}}
							/>
						</Box>
					)}
				</Grid>
			</Grid>
		</Container>
	);
}
