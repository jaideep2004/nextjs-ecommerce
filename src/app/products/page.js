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
	Chip,
	ToggleButton,
	ToggleButtonGroup,
	Drawer,
	Fab,
	Badge,
	Card,
	CardContent,
	Avatar,
	Stack,
	useMediaQuery,
} from "@mui/material";
import {
	NavigateNext,
	FilterList,
	Search,
	Clear,
	ViewModule,
	ViewList,
	Tune,
	Close,
	Star,
	LocalOffer,
	TrendingUp,
	NewReleases,
	Verified,
	ColorLens,
	AttachMoney,
	Category,
	BrandingWatermark,
	Email,
	Notifications,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { styled, keyframes } from "@mui/material/styles";
import ProductGrid from "@/components/products/ProductGrid";

// Enhanced animations for 4th dimensional feel
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(93, 64, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(93, 64, 55, 0.6), 0 0 60px rgba(255, 160, 0, 0.3); }
`;

// Styled components for enhanced UI
const StyledPaper = styled(Paper)(({ theme }) => ({
	background:
		theme.palette.mode === "dark"
			? "linear-gradient(145deg, rgba(33, 33, 33, 0.95) 0%, rgba(66, 66, 66, 0.9) 100%)"
			: "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%)",
	backdropFilter: "blur(20px)",
	border: `1px solid ${
		theme.palette.mode === "dark"
			? "rgba(255, 255, 255, 0.1)"
			: "rgba(0, 0, 0, 0.05)"
	}`,
	borderRadius: "20px",
	boxShadow:
		theme.palette.mode === "dark"
			? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
			: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
	transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
	"&:hover": {
		transform: "translateY(-2px)",
		boxShadow:
			theme.palette.mode === "dark"
				? "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
				: "0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)",
	},
}));

const FilterSidebar = styled(StyledPaper)(({ theme }) => ({
	position: "sticky",
	top: "100px",
	height: "fit-content",
	maxHeight: "calc(100vh - 120px)",
	overflowY: "auto",
	"&::-webkit-scrollbar": {
		width: "6px",
	},
	"&::-webkit-scrollbar-track": {
		background: "transparent",
	},
	"&::-webkit-scrollbar-thumb": {
		background: theme.palette.primary.main,
		borderRadius: "3px",
	},
}));

const CategoryChip = styled(Chip)(({ theme, selected }) => ({
	margin: "4px",
	borderRadius: "16px",
	transition: "all 0.3s ease",
	background: selected
		? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
		: theme.palette.mode === "dark"
		? "rgba(255, 255, 255, 0.1)"
		: "rgba(0, 0, 0, 0.05)",
	color: selected ? "white" : theme.palette.text.primary,
	border: selected ? "none" : `1px solid ${theme.palette.divider}`,
	"&:hover": {
		transform: "translateY(-2px) scale(1.05)",
		boxShadow: selected
			? "0 8px 25px rgba(93, 64, 55, 0.4)"
			: "0 4px 15px rgba(0, 0, 0, 0.1)",
	},
}));

const SearchField = styled(TextField)(({ theme }) => ({
	"& .MuiOutlinedInput-root": {
		borderRadius: "25px",
		background:
			theme.palette.mode === "dark"
				? "rgba(255, 255, 255, 0.05)"
				: "rgba(255, 255, 255, 0.8)",
		backdropFilter: "blur(10px)",
		transition: "all 0.3s ease",
		"&:hover": {
			background:
				theme.palette.mode === "dark"
					? "rgba(255, 255, 255, 0.08)"
					: "rgba(255, 255, 255, 0.95)",
			transform: "translateY(-1px)",
			boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
		},
		"&.Mui-focused": {
			background:
				theme.palette.mode === "dark"
					? "rgba(255, 255, 255, 0.1)"
					: "rgba(255, 255, 255, 1)",
			boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
		},
	},
}));

const NewsletterSection = styled(Box)(({ theme }) => ({
	background:
		theme.palette.mode === "dark"
			? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
			: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
	borderRadius: "24px",
	padding: theme.spacing(6, 4),
	margin: theme.spacing(6, 0),
	position: "relative",
	overflow: "hidden",
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: `linear-gradient(45deg, 
      ${theme.palette.primary.main}20 0%, 
      transparent 25%, 
      transparent 75%, 
      ${theme.palette.secondary.main}20 100%
    )`,
		zIndex: 1,
	},
	"& > *": {
		position: "relative",
		zIndex: 2,
	},
}));

export default function ProductsPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { addToCart } = useCart();
	const { user } = useAuth();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// State for products and loading
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [wishlistItems, setWishlistItems] = useState([]);

	// State for pagination
	const [pagination, setPagination] = useState({ page: 1 });

	// State for filters
	const [filters, setFilters] = useState({
		category: "", // send category id/slug/name to API
		brands: [], // multi-select brands
		subcategory: "",
		minPrice: 0,
		maxPrice: 1000,
		search: "",
		sort: "createdAt:desc",
	});

	// State for mobile filter drawer and view mode
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [viewMode, setViewMode] = useState("grid");
	const [newsletterEmail, setNewsletterEmail] = useState("");

	// Dynamic filters from products data
	const [dynamicFilters, setDynamicFilters] = useState({
		categories: [],
		brands: [],
		colors: [],
	});

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
		const brandParam = searchParams.get("brand") || "";

		setFilters({
			category,
			brands: brandParam ? brandParam.split(',').filter(Boolean) : [],
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
					queryParams.append("minPrice", String(filters.minPrice));
				if (filters.maxPrice < 1000)
					queryParams.append("maxPrice", String(filters.maxPrice));
				if (filters.search) queryParams.append("search", filters.search);
				if (filters.sort) queryParams.append("sort", filters.sort);
				if (filters.brands && filters.brands.length > 0)
					queryParams.append("brand", filters.brands.join(','));
				queryParams.append("page", String(pagination.page));
				queryParams.append("limit", "12"); // Products per page

				const qs = queryParams.toString();
				console.log('Fetching /api/products with query:', qs, 'filters:', filters);
				const res = await axios.get(`/api/products?${qs}`);
				console.log("Products API response:", res.data);

				// Handle different response structures
				const productsData = res.data.products || res.data.data?.products || [];
				const paginationData = res.data.pagination ||
					res.data.data?.pagination || {
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

				// Extract dynamic filters from products
				if (productsData.length > 0) {
					// Build categories from populated category objects when available
					const categoryMap = new Map();
					productsData.forEach((p) => {
						const c = p.category;
						if (!c) return;
						if (typeof c === 'object') {
							const id = c._id?.toString();
							const name = c.name || c.slug || id;
							if (!id || !name) return;
							categoryMap.set(id, {
								id,
								name,
								slug: c.slug,
								count: (categoryMap.get(id)?.count || 0) + 1,
							});
						} else if (typeof c === 'string') {
							// Fallback when not populated (name or id string)
							const key = c;
							categoryMap.set(key, {
								id: key,
								name: c,
								slug: undefined,
								count: (categoryMap.get(key)?.count || 0) + 1,
							});
						}
					});
					const categories = Array.from(categoryMap.values());

					const brands = [
						...new Set(productsData.map((p) => p.brand).filter(Boolean)),
					];
					const colors = [
						...new Set(
							productsData.flatMap((p) => p.colors || []).filter(Boolean)
						),
					];

					setDynamicFilters({
						categories,
						brands: brands.map((b) => ({
							name: b,
							count: productsData.filter((p) => p.brand === b).length,
						})),
						colors: colors.map((c) => ({ name: c, value: c })),
					});
				} else {
					setDynamicFilters({ categories: [], brands: [], colors: [] });
				}
			} catch (err) {
				console.error(err);
				setError(err?.response?.data?.message || 'Failed to load products');
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
					const res = await axios.get("/api/wishlist");
					const items = res.data.wishlist || [];
					setWishlistItems(
						items.map((item) => item.product || { _id: item.productId })
					);
				} catch (error) {
					console.error("Error fetching wishlist:", error);
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

	// Handle newsletter subscription
	const handleNewsletterSubmit = (e) => {
		e.preventDefault();
		if (newsletterEmail) {
			// Here you would typically send to your newsletter API
			console.log("Newsletter subscription:", newsletterEmail);
			setNewsletterEmail("");
			// Show success message
		}
	};

	// Handle page change
	const handlePageChange = (event, value) => {
		setPagination((prev) => ({ ...prev, page: value }));
	};

	// Clear all filters
	const clearFilters = () => {
		setFilters({
			category: "",
			brands: [],
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
		addToCart(product, 1, "", "", user);
	};

	const handleAddToWishlist = async (product) => {
		if (!user) {
			// Redirect to login if not authenticated
			router.push("/login?redirect=/products");
			return;
		}

		try {
			await axios.post("/api/wishlist", { productId: product._id });
			setWishlistItems((prev) => [...prev, product]);
		} catch (error) {
			console.error("Add to wishlist failed:", error);
		}
	};

	const handleRemoveFromWishlist = async (productId) => {
		try {
			await axios.delete(`/api/wishlist/${productId}`);
			setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
		} catch (error) {
			console.error("Remove from wishlist failed:", error);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background:
					theme.palette.mode === "dark"
						? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)"
						: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f1f3f4 100%)",
			}}>
			<Container maxWidth='xl' sx={{ py: 4 }}>
				{/* Enhanced Header Section */}
				<Box sx={{ mb: 4 }}>
					<Breadcrumbs
						separator={<NavigateNext fontSize='small' />}
						aria-label='breadcrumb'
						sx={{ mb: 2 }}>
						<Link href='/' passHref>
							<Typography
								color='inherit'
								sx={{ "&:hover": { textDecoration: "underline" } }}>
								Home
							</Typography>
						</Link>
						<Typography color='text.primary' sx={{ fontWeight: 600 }}>
							Products
						</Typography>
					</Breadcrumbs>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 3,
						}}>
						<Typography
							variant='h3'
							component='h1'
							sx={{
								fontWeight: 700,
								background:
									theme.palette.mode === "dark"
										? "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)"
										: "linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)",
								webkitBackgroundClip: "text",
								webkitTextFillColor: "transparent",
								backgroundClip: "text",
								mb: 1,
								fontSize: { xs: '2.4rem', md: '2.5rem' },
							}}>
							Discover Amazing Products
						</Typography>

						{!isMobile && (
							<ToggleButtonGroup
								value={viewMode}
								exclusive
								onChange={(e, newMode) => newMode && setViewMode(newMode)}
								size='small'
								sx={{
									background: theme.palette.background.paper,
									borderRadius: "12px",
									boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
								}}>
								<ToggleButton value='grid' sx={{ borderRadius: "12px" }}>
									<ViewModule />
								</ToggleButton>
								<ToggleButton value='list' sx={{ borderRadius: "12px" }}>
									<ViewList />
								</ToggleButton>
							</ToggleButtonGroup>
						)}
					</Box>

					<Typography
						variant='h6'
						color='text.secondary'
						sx={{ fontWeight: 400, mb: 2 }}>
						Showing{" "}
						{!loading
							? `01-${Math.min(products.length, 16)} of ${pagination.total}`
							: "..."}{" "}
						Results
					</Typography>
				</Box>

				<Grid
					container
					spacing={4}
					sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>
					{/* Enhanced Filters Sidebar (desktop only) */}
					{!isMobile && (
						<Grid
							item
							xs={12}
							md={2.5}
							sx={{ minWidth: { md: "280px" }, maxWidth: { md: "320px" } }}>
							<FilterSidebar sx={{ p: 3 }}>
							{/* Filter Header */}
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 3,
								}}>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 700,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<Tune color='primary' />
									Product Categories
								</Typography>
								<Button
									size='small'
									onClick={clearFilters}
									startIcon={<Clear />}
									sx={{
										borderRadius: "20px",
										textTransform: "none",
										fontWeight: 600,
									}}>
									Clear All
								</Button>
							</Box>

							{/* Product Categories */}
							<Box sx={{ mb: 4 }}>
								<Typography
									variant='h6'
									sx={{
										mb: 2,
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<Category fontSize='small' />
									Categories
								</Typography>
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
									{dynamicFilters.categories.map((category) => (
										<CategoryChip
											key={category.name}
											label={`${category.name} (${category.count})`}
											selected={filters.category === category.name}
											onClick={() =>
												handleFilterChange(
													"category",
													filters.category === category.name
														? ""
														: category.name
												)
											}
											size='small'
											variant={
												filters.category === category.name
													? "filled"
													: "outlined"
											}
										/>
									))}
								</Box>
							</Box>

							{/* Brands */}
							<Box sx={{ mb: 4 }}>
								<Typography
									variant='h6'
									sx={{
										mb: 2,
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<BrandingWatermark fontSize='small' />
									Brands
								</Typography>
								<FormGroup>
									{dynamicFilters.brands.map((brand) => (
										<FormControlLabel
											key={brand.name}
											control={<Checkbox size='small' />}
											label={
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														width: "100%",
													}}>
													<Typography variant='body2'>{brand.name}</Typography>
													<Typography variant='body2' color='text.secondary'>
														({brand.count})
													</Typography>
												</Box>
											}
											sx={{ m: 0, mb: 0.5, width: "100%" }}
										/>
									))}
								</FormGroup>
							</Box>

							{/* Color Filter */}
							<Box sx={{ mb: 4 }}>
								<Typography
									variant='h6'
									sx={{
										mb: 2,
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<ColorLens fontSize='small' />
									Color
								</Typography>
								{dynamicFilters.colors.length > 0 && (
									<Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
										{dynamicFilters.colors.map((color) => (
											<Chip
												key={color.name}
												label={color.name}
												size='small'
												variant='outlined'
												sx={{
													borderRadius: "16px",
													transition: "all 0.2s ease",
													"&:hover": {
														transform: "scale(1.05)",
														borderColor: theme.palette.primary.main,
													},
													mb: 1,
												}}
											/>
										))}
									</Stack>
								)}
							</Box>

							{/* Price Range Filter */}
							<Box sx={{ mb: 3 }}>
								<Typography
									variant='h6'
									sx={{
										mb: 2,
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<AttachMoney fontSize='small' />
									Price Filter
								</Typography>
								<Slider
									value={[filters.minPrice, filters.maxPrice]}
									onChange={handlePriceChange}
									valueLabelDisplay='auto'
									min={0}
									max={1000}
									sx={{
										color: theme.palette.primary.main,
										height: 8,
										"& .MuiSlider-track": {
											border: "none",
											background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
										},
										"& .MuiSlider-thumb": {
											height: 20,
											width: 20,
											backgroundColor: "#fff",
											border: `2px solid ${theme.palette.primary.main}`,
											"&:hover, &.Mui-focusVisible": {
												boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}16`,
											},
										},
									}}
								/>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										mt: 1,
									}}>
									<Typography variant='body2' sx={{ fontWeight: 600 }}>
										${filters.minPrice}
									</Typography>
									<Typography variant='body2' sx={{ fontWeight: 600 }}>
										${filters.maxPrice}
									</Typography>
								</Box>
							</Box>
						</FilterSidebar>
						</Grid>
					)}

					{/* Enhanced Products Grid */}
					<Grid item xs={12} md={9.5}>
						{/* Enhanced Search and Sort Bar */}
						<StyledPaper sx={{ p: 3, mb: 4 }}>
							<Grid container spacing={3} alignItems='center'>
								<Grid item xs={12} md={8}>
									<form onSubmit={handleSearch}>
										<SearchField
											fullWidth
											placeholder='Search for amazing products...'
											value={filters.search}
											onChange={(e) =>
												setFilters((prev) => ({
													...prev,
													search: e.target.value,
												}))
											}
											InputProps={{
												startAdornment: (
													<InputAdornment position='start'>
														<Search color='primary' />
													</InputAdornment>
												),
											}}
										/>
									</form>
								</Grid>
								<Grid item xs={12} md={4}>
									<FormControl fullWidth>
										<InputLabel id='sort-select-label'>Sort By</InputLabel>
										<Select
											labelId='sort-select-label'
											value={filters.sort}
											label='Sort By'
											onChange={(e) =>
												handleFilterChange("sort", e.target.value)
											}
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: "15px",
													background:
														theme.palette.mode === "dark"
															? "rgba(255, 255, 255, 0.05)"
															: "rgba(255, 255, 255, 0.8)",
												},
											}}>
											{sortOptions.map((option) => (
												<MenuItem key={option.value} value={option.value}>
													{option.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						</StyledPaper>

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
							gridProps={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
							itemProps={{ xs: 'auto', sm: 6, md: 4, sx: { display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } } }}
						/>

						{/* Enhanced Pagination */}
						{!loading && !error && pagination.pages > 1 && (
							<Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
								<StyledPaper sx={{ p: 2, display: "inline-flex" }}>
									<Pagination
										count={pagination.pages}
										page={pagination.page}
										onChange={handlePageChange}
										color='primary'
										size='large'
										sx={{
											"& .MuiPaginationItem-root": {
												color: theme.palette.text.primary,
												fontWeight: 600,
												borderRadius: "12px",
												margin: "0 4px",
												transition: "all 0.3s ease",
												"&:hover": {
													background: theme.palette.primary.main + "20",
													transform: "translateY(-2px)",
												},
											},
											"& .Mui-selected": {
												backgroundColor: `${theme.palette.primary.main} !important`,
												color: "white",
												boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
											},
										}}
									/>
								</StyledPaper>
							</Box>
						)}

						{/* Newsletter Subscription Section */}
						<NewsletterSection>
							<Grid
								container
								spacing={4}
								alignItems='center'
								style={{ flexWrap: "nowrap" }}>
								<Grid item xs={12} md={6}>
									<Typography variant='h4' sx={{ fontWeight: 700, mb: 2 }}>
										Get Weekly Update. Sign Up And Get Up To{" "}
										<Typography
											component='span'
											sx={{
												color: theme.palette.secondary.main,
												fontWeight: 800,
											}}>
											20% Off
										</Typography>{" "}
										Your First Purchase
									</Typography>
									<Typography
										variant='body1'
										color='text.secondary'
										sx={{ mb: 3 }}>
										Stay updated with our latest products, exclusive deals, and
										fashion trends.
									</Typography>
									<Box
										component='form'
										onSubmit={handleNewsletterSubmit}
										sx={{ display: "flex", gap: 2 }}>
										<TextField
											fullWidth
											placeholder='Write your Email Address'
											value={newsletterEmail}
											onChange={(e) => setNewsletterEmail(e.target.value)}
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: "25px",
													background: theme.palette.background.paper,
												},
											}}
										/>
										<Button
											type='submit'
											variant='contained'
											size='large'
											sx={{
												borderRadius: "25px",
												px: 4,
												fontWeight: 600,
												textTransform: "none",
												background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
												"&:hover": {
													transform: "translateY(-2px)",
													boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
												},
											}}>
											Subscribe
										</Button>
									</Box>
								</Grid>
								<Grid item xs={12} md={6} sx={{ textAlign: "center" }} style={{minWidth: '400px'}}>
									<Box
										sx={{
											width: 350,
											height: 350,
											borderRadius: "50%",
											background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											margin: "0 auto",
											animation: `${floatAnimation} 3s ease-in-out infinite`,
											background: `url("/images/abt3.png")`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}>
										{/* <Box sx={{ fontSize: '4rem' }}>👫</Box> */}
										{/* <img src="/images/abt3.png" alt="About Us" /> */}
									</Box>
								</Grid>
							</Grid>
						</NewsletterSection>
					</Grid>
				</Grid>

				{/* Mobile Filter FAB */}
				{isMobile && (
					<Fab
						color='primary'
						sx={{
							position: "fixed",
							bottom: 20,
							right: 20,
							zIndex: 1000,
							background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
							"&:hover": {
								transform: "scale(1.1)",
							},
						}}
						onClick={() => setMobileFiltersOpen(true)}>
						<FilterList />
					</Fab>
				)}

				{/* Mobile Filter Drawer */}
				<Drawer
					anchor='left'
					open={mobileFiltersOpen}
					onClose={() => setMobileFiltersOpen(false)}
					sx={{
						"& .MuiDrawer-paper": {
							width: "80%",
							maxWidth: 350,
							background: theme.palette.background.default,
						},
					}}>
					<Box sx={{ p: 2 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 2,
							}}>
							<Typography variant='h6' sx={{ fontWeight: 700 }}>
								Filters
							</Typography>
							<IconButton onClick={() => setMobileFiltersOpen(false)}>
								<Close />
							</IconButton>
						</Box>
		 				{/* Mobile filter content - reuse desktop sidebar markup */}
						<FilterSidebar sx={{ p: 2 }}>
							{/* Filter Header */}
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 3,
								}}>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 700,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<Tune color='primary' />
									Product Categories
								</Typography>
								<Button
									size='small'
									onClick={clearFilters}
									startIcon={<Clear />}
									sx={{
										borderRadius: "20px",
										textTransform: "none",
										fontWeight: 600,
									}}>
									Clear All
								</Button>
							</Box>

							{/* Product Categories */}
							<Box sx={{ mb: 4 }}>
								<Typography
									variant='h6'
									sx={{
										mb: 2,
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<Category fontSize='small' />
									Categories
								</Typography>
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
									{dynamicFilters.categories.map((category) => (
										<CategoryChip
											key={category.name}
											label={`${category.name} (${category.count})`}
											selected={filters.category === category.name}
											onClick={() =>
											handleFilterChange(
												"category",
												filters.category === category.name
													? ""
													: category.name
											)
										}
											size='small'
											variant={
												filters.category === category.name
													? "filled"
													: "outlined"
											}
										/>
									))}
								</Box>
							</Box>

							{/* Brands */}
							<Box sx={{ mb: 4 }}>
								<Typography
									variant='h6'
									sx={{
										mb: 2,
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<BrandingWatermark fontSize='small' />
									Brands
								</Typography>
								<FormGroup>
									{dynamicFilters.brands.map((brand) => (
										<FormControlLabel
											key={brand.name}
											control={<Checkbox size='small' />}
											label={
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														width: "100%",
													}}>
													<Typography variant='body2'>{brand.name}</Typography>
													<Typography variant='body2' color='text.secondary'>
														({brand.count})
													</Typography>
												</Box>
											}
											sx={{ m: 0, mb: 0.5, width: "100%" }}
										/>
									))}
								</FormGroup>
							</Box>

							{/* Color Filter */}
							<Box sx={{ mb: 4 }}>
								<Typography
									variant='h6'
									sx={{
										mb: 2,
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<ColorLens fontSize='small' />
									Color
								</Typography>
								{dynamicFilters.colors.length > 0 && (
									<Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
										{dynamicFilters.colors.map((color) => (
											<Chip
												key={color.name}
												label={color.name}
												size='small'
												variant='outlined'
												sx={{
													borderRadius: "16px",
													transition: "all 0.2s ease",
													"&:hover": {
														transform: "scale(1.05)",
														borderColor: theme.palette.primary.main,
													},
													mb: 1,
												}}
											/>
										))}
									</Stack>
								)}
							</Box>

							{/* Price Range Filter */}
							<Box sx={{ mb: 3 }}>
								<Typography
									variant='h6'
									sx={{
										mb: 2,
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<AttachMoney fontSize='small' />
									Price Filter
								</Typography>
								<Slider
									value={[filters.minPrice, filters.maxPrice]}
									onChange={handlePriceChange}
									valueLabelDisplay='auto'
									min={0}
									max={1000}
									sx={{
										color: theme.palette.primary.main,
										height: 8,
										"& .MuiSlider-track": {
											border: "none",
											background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
										},
										"& .MuiSlider-thumb": {
											height: 20,
											width: 20,
											backgroundColor: "#fff",
											border: `2px solid ${theme.palette.primary.main}`,
											"&:hover, &.Mui-focusVisible": {
												boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}16`,
											},
										},
									}}
								/>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										mt: 1,
									}}>
									<Typography variant='body2' sx={{ fontWeight: 600 }}>
										${filters.minPrice}
									</Typography>
									<Typography variant='body2' sx={{ fontWeight: 600 }}>
										${filters.maxPrice}
									</Typography>
								</Box>
							</Box>
						</FilterSidebar>
					</Box>
				</Drawer>
			</Container>
		</Box>
	);
}
