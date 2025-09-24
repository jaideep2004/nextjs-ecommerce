"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useThemeContext } from "@/theme";
import {
	Box,
	Container,
	Grid,
	Typography,
	TextField,
	Button,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	InputAdornment,
	Paper,
	useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	Facebook,
	Twitter,
	Instagram,
	YouTube,
	LinkedIn,
	Phone,
	Email,
	LocationOn,
	KeyboardArrowRight,
	Send,
	ArrowForward,
} from "@mui/icons-material";

// Styled components
const FooterSection = styled(Box)(({ theme }) => ({
	backgroundColor: "#000000",
	color: theme.palette.common.white,
	paddingTop: theme.spacing(6),
	paddingBottom: 0,
	position: "relative",
	overflow: "hidden",
	[theme.breakpoints.up("md")]: {
		paddingTop: theme.spacing(8),
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: `
      radial-gradient(circle at 20% 20%, rgba(162, 146, 120, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(212, 192, 158, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 50% 100%, rgba(162, 146, 120, 0.04) 0%, transparent 50%)
    `,
		zIndex: 1,
	},
}));

const ContactInfo = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	marginBottom: theme.spacing(1.5),
	transition: "all 0.3s ease",
	"&:hover": {
		color: "#d4c09e",
		transform: "translateX(5px)",
	},
}));

const CopyrightSection = styled(Box)(({ theme }) => ({
	backgroundColor: "rgba(0, 0, 0, 0.5)",
	borderTop: "1px solid rgba(162, 146, 120, 0.2)",
	padding: theme.spacing(3, 0),
	marginTop: theme.spacing(6),
	position: "relative",
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "1px",
		background:
			"linear-gradient(90deg, transparent, rgba(162, 146, 120, 0.5), transparent)",
	},
}));

const PaymentIconBox = styled(Box)(({ theme }) => ({
	width: 40,
	height: 26,
	backgroundColor: "rgba(255, 255, 255, 1)",
	borderRadius: theme.spacing(0.5),
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	margin: theme.spacing(0, 0.25),
	transition: "all 0.3s ease",
	[theme.breakpoints.up("md")]: {
		width: 45,
		height: 30,
		margin: theme.spacing(0, 0.5),
	},
	"&:hover": {
		transform: "translateY(-3px)",
		boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
	},
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
	fontSize: "1.1rem",
	fontWeight: "bold",
	marginBottom: theme.spacing(2),
	position: "relative",
	display: "inline-block",
	[theme.breakpoints.up("md")]: {
		fontSize: "1.25rem",
		marginBottom: theme.spacing(3),
	},
	"&::after": {
		content: '""',
		position: "absolute",
		left: 0,
		bottom: -8,
		width: 40,
		height: 3,
		backgroundColor: theme.palette.secondary.main,
	},
}));

const FooterLink = styled(ListItem)(({ theme }) => ({
	padding: theme.spacing(0.5, 0),
	transition: "transform 0.2s ease-in-out",
	"&:hover": {
		transform: "translateX(5px)",
		color: theme.palette.secondary.main,
	},
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
	minWidth: 30,
	color:
		theme.palette.mode === "light"
			? "rgba(255, 255, 255, 1)"
			: "rgba(255, 255, 255, 0.5)",
}));

const NewsletterBox = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	background:
		theme.palette.mode === "light"
			? "rgba(255, 255, 255, 0.1)"
			: "rgba(0, 0, 0, 0.2)",
	borderRadius: theme.shape.borderRadius,
	marginBottom: theme.spacing(3),
	backdropFilter: "blur(10px)",
	border: "1px solid rgba(255, 255, 255, 0.1)",
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === "light"
			? "rgba(255, 255, 255, 0.1)"
			: "rgba(255, 255, 255, 0.05)",
	color: theme.palette.common.white,
	margin: theme.spacing(0, 0.5),
	transition: "all 0.2s ease",
	"&:hover": {
		backgroundColor: theme.palette.secondary.main,
		transform: "translateY(-3px)",
	},
}));

const PaymentIcon = styled(Image)(({ theme }) => ({
	filter: theme.palette.mode === "dark" ? "brightness(0.8)" : "none",
}));

const BlogPost = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "flex-start",
	marginBottom: theme.spacing(2),
	transition: "transform 0.2s ease",
	"&:hover": {
		transform: "translateY(-3px)",
	},
}));

const BlogImage = styled(Box)(({ theme }) => ({
	width: 60,
	height: 60,
	marginRight: theme.spacing(2),
	position: "relative",
	flexShrink: 0,
	borderRadius: theme.shape.borderRadius,
	overflow: "hidden",
}));

export default function Footer() {
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);
	const theme = useTheme();
	const { mode } = useThemeContext();

	const handleSubscribe = (e) => {
		e.preventDefault();
		if (email && email.includes("@")) {
			// In a real app, you would send this to your API
			console.log("Subscribing email:", email);
			setSubscribed(true);
			setEmail("");
			// Reset the subscribed state after 3 seconds
			setTimeout(() => setSubscribed(false), 3000);
		}
	};

	const currentYear = new Date().getFullYear();

	// Sample recent blog posts data
	const recentPosts = [
		{
			id: 1,
			title: "Tips on Finding Affordable Fashion Gems Online",
			date: "July 11, 2023",
			image: "/images/blog/blog-1.jpg",
			slug: "tips-affordable-fashion",
		},
		{
			id: 2,
			title: "Mastering the Art of Fashion E-commerce Marketing",
			date: "July 11, 2024",
			image: "/images/blog/blog-2.jpg",
			slug: "mastering-fashion-ecommerce",
		},
		{
			id: 3,
			title: "Must-Have Trends You Can Shop Online Now",
			date: "July 11, 2024",
			image: "/images/blog/blog-3.jpg",
			slug: "trends-shop-online",
		},
	];

	return (
		<FooterSection>
			<Container maxWidth='xl' sx={{ position: "relative", zIndex: 2 }}>
				<Grid container spacing={{ xs: 3, md: 4 }} justifyContent='center'>
					{/* Company Info */}
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						lg={2.4}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: { xs: "center", md: "start" },
							minWidth: { xs: "auto", md: "250px" },
							textAlign: { xs: "center", md: "left" },
						}}>
						<div style={{ display: "flex", alignItems: "center" , gap:"10px"}}>
							<img
								src='/images/indidark.png'
								alt='India Inspired'
								style={{ width: "72px" }}
							/>
							<FooterTitle variant='h6'>India Inspired</FooterTitle>
						</div>
						<Typography
							variant='body2'
							sx={{
								mb: 4,
								lineHeight: 1.8,
								color: "rgba(255, 255, 255, 1)",
								fontSize: { xs: "0.875rem", md: "0.875rem" },
							}}>
							Discover authentic traditional Punjabi suits and turbans with
							<br /> premium quality and timeless designs from the UK.
						</Typography>

						<Box sx={{ mb: 4 }}>
							<ContactInfo>
								<Email sx={{ mr: 2, color: "#a29278", fontSize: 20 }} />
								<Typography
									variant='body2'
									sx={{ color: "rgba(255, 255, 255, 1)" }}>
									info@indiainspired.com
								</Typography>
							</ContactInfo>
							{/* <ContactInfo>
                <Phone sx={{ mr: 2, color: '#a29278', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 1)' }}>
                  +44 123 456 7890
                </Typography>
              </ContactInfo> */}
							<ContactInfo>
								<LocationOn sx={{ mr: 2, color: "#a29278", fontSize: 20 }} />
								<Typography
									variant='body2'
									sx={{ color: "rgba(255, 255, 255, 1)" }}>
									Patiala, Punjab - 147001
								</Typography>
							</ContactInfo>
						</Box>

						<Box>
							<Typography
								variant='subtitle1'
								sx={{ mb: 2, fontWeight: 700, color: "#ffffff" }}>
								Follow Us
							</Typography>
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
								<SocialIconButton aria-label='facebook'>
									<Facebook />
								</SocialIconButton>
								<SocialIconButton aria-label='twitter'>
									<Twitter />
								</SocialIconButton>
								<SocialIconButton aria-label='instagram'>
									<Instagram />
								</SocialIconButton>
								<SocialIconButton aria-label='youtube'>
									<YouTube />
								</SocialIconButton>
								<SocialIconButton aria-label='linkedin'>
									<LinkedIn />
								</SocialIconButton>
							</Box>
						</Box>
					</Grid>

					{/* Customer Services */}
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						lg={2.4}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: { xs: "center", md: "center" },
							minWidth: { xs: "auto", md: "250px" },
						}}>
						<FooterTitle variant='h6'>Customer Services</FooterTitle>
						<List dense disablePadding>
							<FooterLink
								disableGutters
								component={Link}
								href='/customer/orders'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='My Orders'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/customer/wishlist'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='Wishlist'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/terms'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='Terms & Conditions'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/privacy'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='Privacy Policy'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/shipping'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='Shipping Information'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/returns'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='Returns & Refunds'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
						</List>
					</Grid>

					{/* Quick Links */}
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						lg={2.4}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: { xs: "center", md: "center" },
							minWidth: { xs: "auto", md: "250px" },
						}}>
						<FooterTitle variant='h6'>Quick Links</FooterTitle>
						<List dense disablePadding>
							<FooterLink
								disableGutters
								component={Link}
								href='/'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='Home'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/products'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='Shop'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/about'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='About Us'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/contact'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='Contact'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
							<FooterLink
								disableGutters
								component={Link}
								href='/faq'
								sx={{ color: "inherit", textDecoration: "none" }}>
								<ListItemIcon
									sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
									<KeyboardArrowRight fontSize='small' />
								</ListItemIcon>
								<ListItemText
									primary='FAQ'
									primaryTypographyProps={{
										sx: {
											color: "rgba(255, 255, 255, 1)",
											fontSize: "0.95rem",
											fontWeight: 500,
										},
									}}
								/>
							</FooterLink>
						</List>
					</Grid>

					{/* Categories */}
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						lg={2.4}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: { xs: "center", md: "center" },
							minWidth: { xs: "auto", md: "250px" },
						}}>
						<FooterTitle variant='h6'>Categories</FooterTitle>
						<Box
							sx={{
								display: { xs: "grid", md: "block" },
								gridTemplateColumns: {
									xs: "repeat(2, 1fr)",
									sm: "repeat(3, 1fr)",
								},
								gap: { xs: 1, sm: 2 },
								width: "100%",
								justifyItems: "center",
							}}>
							<List dense disablePadding sx={{ display: "contents" }}>
								<FooterLink
									disableGutters
									component={Link}
									href='/products?category=suits'
									sx={{ color: "inherit", textDecoration: "none" }}>
									<ListItemIcon
										sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
										<KeyboardArrowRight fontSize='small' />
									</ListItemIcon>
									<ListItemText
										primary='Punjabi Suits'
										primaryTypographyProps={{
											sx: {
												color: "rgba(255, 255, 255, 1)",
												fontSize: "0.95rem",
												fontWeight: 500,
											},
										}}
									/>
								</FooterLink>
								<FooterLink
									disableGutters
									component={Link}
									href='/products?category=turbans'
									sx={{ color: "inherit", textDecoration: "none" }}>
									<ListItemIcon
										sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
										<KeyboardArrowRight fontSize='small' />
									</ListItemIcon>
									<ListItemText
										primary='Turbans'
										primaryTypographyProps={{
											sx: {
												color: "rgba(255, 255, 255, 1)",
												fontSize: "0.95rem",
												fontWeight: 500,
											},
										}}
									/>
								</FooterLink>
								<FooterLink
									disableGutters
									component={Link}
									href='/products?category=dupattas'
									sx={{ color: "inherit", textDecoration: "none" }}>
									<ListItemIcon
										sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
										<KeyboardArrowRight fontSize='small' />
									</ListItemIcon>
									<ListItemText
										primary='Dupattas'
										primaryTypographyProps={{
											sx: {
												color: "rgba(255, 255, 255, 1)",
												fontSize: "0.95rem",
												fontWeight: 500,
											},
										}}
									/>
								</FooterLink>
								<FooterLink
									disableGutters
									component={Link}
									href='/products?category=kurtas'
									sx={{ color: "inherit", textDecoration: "none" }}>
									<ListItemIcon
										sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
										<KeyboardArrowRight fontSize='small' />
									</ListItemIcon>
									<ListItemText
										primary='Kurtas'
										primaryTypographyProps={{
											sx: {
												color: "rgba(255, 255, 255, 1)",
												fontSize: "0.95rem",
												fontWeight: 500,
											},
										}}
									/>
								</FooterLink>
								<FooterLink
									disableGutters
									component={Link}
									href='/products?category=accessories'
									sx={{ color: "inherit", textDecoration: "none" }}>
									<ListItemIcon
										sx={{ minWidth: 30, color: "rgba(255, 255, 255, 1)" }}>
										<KeyboardArrowRight fontSize='small' />
									</ListItemIcon>
									<ListItemText
										primary='Accessories'
										primaryTypographyProps={{
											sx: {
												color: "rgba(255, 255, 255, 1)",
												fontSize: "0.95rem",
												fontWeight: 500,
											},
										}}
									/>
								</FooterLink>
							</List>
						</Box>
					</Grid>
				</Grid>
			</Container>

			{/* Copyright Section */}
			<CopyrightSection>
				<Container maxWidth='xl'>
					<Grid
						container
						spacing={{ xs: 3, md: 6 }}
						alignItems='center'
						justifyContent='space-around'>
						<Grid
							item
							xs={12}
							md={6}
							sx={{ textAlign: { xs: "center", md: "left" } }}>
							<Typography
								variant='body2'
								sx={{
									color: "rgba(255, 255, 255, 1)",
									fontSize: { xs: "0.875rem", md: "0.95rem" },
									fontWeight: 500,
								}}>
								© {currentYear} India Inspired. All rights reserved.
							</Typography>
							<Typography
								variant='caption'
								sx={{
									color: "rgba(255, 255, 255, 1)",
									display: "block",
									mt: 0.5,
									fontSize: { xs: "0.75rem", md: "0.75rem" },
								}}>
								Crafted with ❤️ for authentic fashion
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							sx={{
								display: "flex",
								justifyContent: { xs: "flex-start", md: "flex-end" },
								alignItems: "center",
								flexDirection: { xs: "column", sm: "row" },
								gap: 2,
							}}>
							<Typography
								variant='body2'
								sx={{
									color: "rgba(255, 255, 255, 1)",
									fontWeight: 600,
									mr: { xs: 0, sm: 2 },
									fontSize: { xs: "0.875rem", md: "0.875rem" },
									mb: { xs: 1, sm: 0 },
								}}>
								Secure Payments:
							</Typography>
							<Box
								sx={{
									display: "flex",
									gap: { xs: 0.5, md: 1 },
									flexWrap: "wrap",
									justifyContent: { xs: "center", md: "flex-start" },
								}}>
								<PaymentIconBox>
									<Typography
										variant='caption'
										sx={{
											color: "#1976d2",
											fontWeight: "bold",
											fontSize: "10px",
										}}>
										VISA
									</Typography>
								</PaymentIconBox>
								<PaymentIconBox>
									<Typography
										variant='caption'
										sx={{
											color: "#eb001b",
											fontWeight: "bold",
											fontSize: "9px",
										}}>
										MC
									</Typography>
								</PaymentIconBox>
								<PaymentIconBox>
									<Typography
										variant='caption'
										sx={{
											color: "#0070ba",
											fontWeight: "bold",
											fontSize: "8px",
										}}>
										PayPal
									</Typography>
								</PaymentIconBox>
								<PaymentIconBox>
									<Typography
										variant='caption'
										sx={{ color: "#000", fontWeight: "bold", fontSize: "8px" }}>
										AMEX
									</Typography>
								</PaymentIconBox>
								<PaymentIconBox>
									<Typography
										variant='caption'
										sx={{ color: "#000", fontWeight: "bold", fontSize: "7px" }}>
										Apple Pay
									</Typography>
								</PaymentIconBox>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</CopyrightSection>
		</FooterSection>
	);
}
