"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Divider,
	Breadcrumbs,
	Link as MuiLink,
	Button,
	Card,
	CardContent,
	CardMedia,
	Avatar,
	Chip,
	Rating,
	LinearProgress,
	IconButton,
	useTheme,
	alpha,
} from "@mui/material";
import {
	ShoppingBag as ShoppingBagIcon,
	LocalShipping as ShippingIcon,
	Support as SupportIcon,
	Security as SecurityIcon,
	Facebook as FacebookIcon,
	Twitter as TwitterIcon,
	Instagram as InstagramIcon,
	LinkedIn as LinkedInIcon,
	Star as StarIcon,
	TrendingUp as TrendingUpIcon,
	People as PeopleIcon,
	Inventory as InventoryIcon,
	Public as PublicIcon,
	ArrowForward as ArrowForwardIcon,
	CheckCircle as CheckCircleIcon,
	FormatQuote as FormatQuoteIcon,
	NavigateNext as NavigateNextIcon,
	NavigateBefore as NavigateBeforeIcon,
} from "@mui/icons-material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function AboutPage() {
	const theme = useTheme();
	const [currentTestimonial, setCurrentTestimonial] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Animated counter hook
	const useCounter = (end, duration = 2000) => {
		const [count, setCount] = useState(0);

		useEffect(() => {
			let startTime;
			const animate = (timestamp) => {
				if (!startTime) startTime = timestamp;
				const progress = Math.min((timestamp - startTime) / duration, 1);
				setCount(Math.floor(progress * end));
				if (progress < 1) {
					requestAnimationFrame(animate);
				}
			};
			requestAnimationFrame(animate);
		}, [end, duration]);

		return count;
	};

	// Statistics data
	const stats = [
		{
			label: "Happy Customers",
			value: 50000,
			icon: <PeopleIcon />,
			suffix: "+",
		},
		{
			label: "Products Sold",
			value: 250000,
			icon: <InventoryIcon />,
			suffix: "+",
		},
		{ label: "Countries Served", value: 30, icon: <PublicIcon />, suffix: "+" },
		{
			label: "Years Experience",
			value: 8,
			icon: <TrendingUpIcon />,
			suffix: "",
		},
	];

	// Testimonials data
	const testimonials = [
		{
			name: "Rhodes Jhon",
			role: "Marketing Director",
			image: "/images/testimonials/rhodes.jpg",
			rating: 5,
			text: "This inflatable dragon costume seemed perfect for Halloween! But upon inflating, it became clear the wings were uneven, causing me to spin uncontrollably like a rogue pool float.",
		},
		{
			name: "Rhodes Jhon",
			role: "Marketing Director",
			image: "/images/testimonials/rhodes2.jpg",
			rating: 5,
			text: "This inflatable dragon costume seemed perfect for Halloween! But upon inflating, it became clear the wings were uneven, causing me to spin uncontrollably like a rogue pool float.",
		},
		{
			name: "Sarah Mitchell",
			role: "Small Business Owner",
			image: "/images/testimonials/sarah.jpg",
			rating: 5,
			text: "Outstanding quality and service! The team went above and beyond to ensure our order was perfect. Will definitely be ordering again.",
		},
		{
			name: "Sarah",
			role: "Small Business Owner",
			image: "/images/testimonials/sarah.jpg",
			rating: 5,
			text: "Outstanding quality and service! The team went above and beyond to ensure our order was perfect. Will definitely be ordering again.",
		},
	];

	// Handle testimonial navigation with smooth transition
	const handleTestimonialChange = (direction) => {
		if (isTransitioning) return;

		setIsTransitioning(true);
		setTimeout(() => {
			if (direction === "next") {
				// Mobile: Navigate through 4 individual cards (0, 1, 2, 3)
				// Desktop: Navigate through 2 slides (0, 1)
				const maxSlides = window.innerWidth < 960 ? 3 : 1; // md breakpoint is 960px
				setCurrentTestimonial((prev) => (prev < maxSlides ? prev + 1 : 0));
			} else {
				const maxSlides = window.innerWidth < 960 ? 3 : 1;
				setCurrentTestimonial((prev) => (prev > 0 ? prev - 1 : maxSlides));
			}
			setIsTransitioning(false);
		}, 150);
	};

	// Auto-slide testimonials
	useEffect(() => {
		const interval = setInterval(() => {
			handleTestimonialChange("next");
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	// Process steps
	const processSteps = [
		{
			step: "01",
			title: "Browsing & Choosing",
			description:
				"This is where customers visit your online store, browse your products.",
			icon: <ShoppingBagIcon />,
		},
		{
			step: "02",
			title: "Checkout & Payment",
			description:
				"Once they have picked their items, customers proceed to checkout.",
			icon: <SecurityIcon />,
		},
		{
			step: "03",
			title: "Order Fulfillment",
			description:
				"After the order is placed, it's sent to your fulfillment team.",
			icon: <InventoryIcon />,
		},
		{
			step: "04",
			title: "Delivery to Customer",
			description: "The packed order is then sent off with a shipping carrier",
			icon: <LocalShippingIcon />,
		},
	];

	// Team members data
	const teamMembers = [
		{
			name: "Sarah Johnson",
			position: "CEO & Founder",
			bio: "With over 10 years of experience in e-commerce, Sarah leads our vision for customer-centric innovation.",
			image: "/images/team/sarah.jpg",
			experience: "10+ Years Experience",
		},
		{
			name: "Michael Chen",
			position: "CTO",
			bio: "Michael brings technical excellence and scalable solutions to power our platform's growth.",
			image: "/images/team/michael.jpg",
			experience: "8+ Years Experience",
		},
		{
			name: "Emily Rodriguez",
			position: "Head of Design",
			bio: "Emily crafts beautiful, intuitive experiences that delight our customers every day.",
			image: "/images/team/emily.jpg",
			experience: "7+ Years Experience",
		},
	];

	// Company values
	const companyValues = [
		{
			title: "We provide 100% best products",
			icon: <CheckCircleIcon sx={{ fontSize: 24, color: "success.main" }} />,
			description:
				"All products are imported and thoroughly tested to meet our strict quality standards.",
		},
		{
			title: "Flexible and affordable price",
			icon: <CheckCircleIcon sx={{ fontSize: 24, color: "success.main" }} />,
			description:
				"Competitive pricing with flexible payment options to suit every budget.",
		},
		{
			title: "All products are imported",
			icon: <CheckCircleIcon sx={{ fontSize: 24, color: "success.main" }} />,
			description:
				"Premium international products sourced from trusted global suppliers.",
		},
	];

	return (
		<Container sx={{ py: 4 }} style={{ maxWidth: "1300px" }}>
			{/* Hero Section - Mobile Responsive */}
			<Box sx={{ mb: 10, overflow: "hidden", position: "relative" }}>
				{/* Light Background Elements */}
				<Box sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					pointerEvents: "none",
					zIndex: 0,
				}}>
					{/* Geometric shapes */}
					<Box sx={{
						position: "absolute",
						top: "10%",
						right: "10%",
						width: { xs: 100, md: 150 },
						height: { xs: 100, md: 150 },
						borderRadius: "50%",
						background: "linear-gradient(135deg, rgba(162, 146, 120, 0.1), rgba(139, 125, 101, 0.08))",
						filter: "blur(20px)",
					}} />
					<Box sx={{
						position: "absolute",
						bottom: "20%",
						left: "15%",
						width: { xs: 80, md: 120 },
						height: { xs: 80, md: 120 },
						borderRadius: "20px",
						background: "linear-gradient(45deg, rgba(44, 62, 80, 0.08), rgba(52, 73, 94, 0.06))",
						filter: "blur(15px)",
						transform: "rotate(45deg)",
					}} />
					<Box sx={{
						position: "absolute",
						top: "50%",
						right: "25%",
						width: { xs: 60, md: 90 },
						height: { xs: 60, md: 90 },
						borderRadius: "15px",
						background: "rgba(255, 193, 7, 0.1)",
						filter: "blur(10px)",
						transform: "rotate(-30deg)",
					}} />
				</Box>
				<Grid
					container
					spacing={{ xs: 2, md: 4 }}
					alignItems='center'
					sx={{
						flexWrap: { xs: "wrap", md: "nowrap" },
						flexDirection: { xs: "column-reverse", md: "row" },
						position: "relative",
						zIndex: 1,
					}}
					style={{ padding: { xs: "30px 0px", md: "30px 0px" }}}>
					{/* Left Side - Images Section */}
					<Grid item xs={12} md={6} sx={{ minWidth: { md: "550px" } }} style={{paddingBottom: { xs: "20px", md: "0px" }}}>
						<Box
							sx={{
								position: "relative",
								height: { xs: "400px", sm: "450px", md: "600px" },
								mx: { xs: "auto", md: 0 },
								maxWidth: { xs: "350px", sm: "400px", md: "none" },
							}}>
							{/* Main Large Image - Left */}
							<Box
								sx={{
									position: "absolute",
									left: { xs: "5%", md: 0 },
									top: 0,
									width: { xs: "75%", md: "80%" },
									height: { xs: "80%", md: "85%" },
									minWidth: { xs: "200px", md: "auto" },
									borderRadius: { xs: 2, md: 3 },
									overflow: "hidden",
									boxShadow: {
										xs: "0 10px 20px rgba(0,0,0,0.1)",
										md: "0 20px 40px rgba(0,0,0,0.15)",
									},
									zIndex: 1,
								}}>
								<Image
									src='/images/gh2.png'
									alt='Fashion Model 1'
									fill
									style={{ objectFit: "cover" }}
								/>
							</Box>

							{/* Overlapping Image - Center Right */}
							<Box
								sx={{
									position: "absolute",
									right: { xs: "5%", md: "0%" },
									top: { xs: "30%", md: "34%" },
									width: { xs: "48%", md: "52%" },
									height: { xs: "55%", md: "60%" },
									minWidth: { xs: "230px", md: "auto" },
									borderRadius: { xs: 2, md: 3 },
									overflow: "hidden",
									boxShadow: {
										xs: "0 10px 20px rgba(0,0,0,0.1)",
										md: "0 20px 40px rgba(0,0,0,0.15)",
									},
									zIndex: 2,
									border: { xs: "3px solid white", md: "4px solid white" },
								}}>
								<Image
									src='/images/abt2.png'
									alt='Fashion Model 2'
									fill
									style={{ objectFit: "cover" }}
								/>
							</Box>

							

							{/* Experience Badge */}
							<Paper
								sx={{
									position: "absolute",
									bottom: { xs: -5, md: 0 },
									right: { xs: 5, md: 0 },
									p: { xs: 1.5, sm: 2, md: 2.5 },
									borderRadius: { xs: 2, md: 3 },
									boxShadow: {
										xs: "0 10px 20px rgba(0,0,0,0.1)",
										md: "0 20px 40px rgba(0,0,0,0.15)",
									},
									bgcolor: "background.paper",
									display: "flex",
									alignItems: "center",
									gap: { xs: 1, md: 2 },
									zIndex: 3,
									minWidth: { xs: "100px", sm: 200, md: 140 },
								}}>
								<Typography
									variant='h2'
									sx={{
										fontWeight: 800,
										color: "primary.main",
										lineHeight: 1,
										fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
									}}>
									25
								</Typography>
								<Box>
									<Typography
										variant='body2'
										sx={{
											fontWeight: 600,
											color: "text.primary",
											lineHeight: 1.2,
											fontSize: { xs: "0.75rem", sm: "0.875rem" },
										}}>
										Years Industry
										<br />
										Experience
									</Typography>
								</Box>
							</Paper>
						</Box>
					</Grid>

					{/* Right Side - Content Section */}
					<Grid item xs={12} md={6}>
						<Box
							sx={{
								pl: { md: 3 },
								mt: { xs: 3, md: 0 },
								textAlign: { xs: "center", md: "left" },
							}}>
							<Chip
								label='About us'
								sx={{
									mb: 3,
									bgcolor: alpha(theme.palette.primary.main, 0.1),
									color: "primary.main",
									fontWeight: 500,
									fontSize: { xs: "0.8rem", md: "0.9rem" },
									"&::before": {
										content: '"★"',
										marginRight: 1,
									},
								}}
							/>

							<Typography
								variant='h2'
								component='h1'
								sx={{
									fontWeight: 700,
									fontSize: {
										xs: "1.8rem",
										sm: "2.2rem",
										md: "2.5rem",
										lg: "3rem",
									},
									lineHeight: { xs: 1.3, md: 1.2 },
									mb: 3,
									color: "text.primary",
									px: { xs: 1, md: 0 },
								}}>
								Our Story
							</Typography>

							<Typography
								variant='body1'
								sx={{
									fontSize: { xs: "0.95rem", md: "1rem" },
									color: "text.secondary",
									mb: 4,
									lineHeight: 1.7,
									maxWidth: { xs: "100%", md: "90%" },
									px: { xs: 1, md: 0 },
								}}>
								For us, fashion is more than just clothing—it's a bridge to culture, identity, and community. Our platform helps Indians worldwide rediscover their roots, express their individuality, and participate in India's unfolding fashion revolution, wherever their journey takes them.
								<br /><br />
								Join us as we connect hearts and wardrobes—bringing the spirit of India to your doorstep, and making every Indian around the globe part of the country's ever-evolving story of fashion innovation.
							</Typography>

							{/* Key Points with Images */}
							<Box
								sx={{
									display: "flex",
									flexDirection: { xs: "column", md: "row" },
									gap: { xs: 3, md: 4 },
									mb: 4,
									alignItems: { xs: "center", md: "flex-start" },
								}}>
								{/* Key Points */}
								<Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
									{companyValues.map((value, index) => (
										<Box
											key={index}
											sx={{ display: "flex", alignItems: "center", mb: 2 }}>
											{value.icon}
											<Typography
												sx={{ ml: 2, fontWeight: 500, color: "text.primary" }}>
												{value.title}
											</Typography>
										</Box>
									))}
								</Box>

								{/* Right Side Images */}
								<Box
									sx={{
										display: { xs: "none", sm: "flex" },
										gap: 2,
										flexShrink: 0,
										justifyContent: "center",
									}}>
									<Box
										sx={{
											width: { xs: 100, sm: 110, md: 120 },
											height: { xs: 95, sm: 105, md: 115 },
											borderRadius: 2,
											overflow: "hidden",
											boxShadow: 2,
										}}>
										<Image
											src='/images/abt3.png'
											alt='Team Image'
											width={100}
											height={100}
											style={{
												objectFit: "cover",
												width: "100%",
												height: "100%",
											}}
										/>
									</Box>
									<Box
										sx={{
											width: { xs: 100, sm: 110, md: 120 },
											height: { xs: 95, sm: 105, md: 115 },
											borderRadius: 2,
											overflow: "hidden",
											boxShadow: 2,
										}}>
										<Image
											src='/images/abt3.png'
											alt='Team Image'
											width={100}
											height={100}
											style={{
												objectFit: "cover",
												width: "100%",
												height: "100%",
											}}
										/>
									</Box>
								</Box>
							</Box>

							{/* CEO Testimonial Card */}
							{/* <Paper
								sx={{
									mt: 4,
									p: { xs: 2, md: 3 },
									borderRadius: 3,
									boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
									border: "1px solid",
									borderColor: "divider",
									maxWidth: { xs: "100%", md: 500 },
									mx: { xs: "auto", md: 0 },
								}}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: { xs: 1.5, md: 2 },
										flexWrap: { xs: "wrap", sm: "nowrap" },
									}}>
									<Avatar
										sx={{
											width: { xs: 40, md: 50 },
											height: { xs: 40, md: 50 },
											bgcolor: "primary.main",
										}}>
										T
									</Avatar>
									<Box sx={{ flex: 1 }}>
										<Typography
											variant='h6'
											sx={{
												fontWeight: 600,
												color: "text.primary",
												fontSize: { xs: "1rem", md: "1.25rem" },
											}}>
											India Inspired
										</Typography>
										<Typography
											variant='body2'
											color='text.secondary'
											sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" }}}>
											CEO
										</Typography>
									</Box>
									<Box
										sx={{
											textAlign: "right",
											display: { xs: "none", sm: "block" },
										}}>
										<Typography
											variant='h4'
											sx={{
												fontWeight: 300,
												fontStyle: "italic",
												color: "text.secondary",
												fontSize: { xs: "1.5rem", md: "2.125rem" },
											}}>
											India Inspired
										</Typography>
									</Box>
								</Box>
							</Paper> */}
						</Box>
					</Grid>
				</Grid>
			</Box>

			{/* Our Achievements Section */}
			{/* <Box sx={{ mb: 10 }}>
				<Typography
					variant='h4'
					align='center'
					sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
					Our Achievements
				</Typography>
				<Typography
					variant='body1'
					align='center'
					sx={{ mb: 6, color: "text.secondary", maxWidth: 600, mx: "auto" }}>
					We're proud of what we've accomplished together with our amazing
					community
				</Typography>

				<Paper
					sx={{
						p: { xs: 4, md: 6 },
						borderRadius: 4,
						bgcolor: "background.paper",
						boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
						border: "1px solid",
						borderColor: "divider",
						position: "relative",
						overflow: "hidden",
					}}>
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0.03,
							backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.main} 2px, transparent 2px)`,
							backgroundSize: "50px 50px",
							zIndex: 0,
						}}
					/>

					<Grid
						container
						spacing={{ xs: 2, md: 4 }}
						sx={{
							position: "relative",
							zIndex: 1,
							justifyContent: "center",
							gap: { xs: "20px !important", md: "60px !important" },
						}}>
						{stats.map((stat, index) => {
							const count = useCounter(stat.value);
							return (
								<Grid item xs={6} md={3} key={index}>
									<Box
										sx={{
											textAlign: "center",
											p: { xs: 2, md: 3 },
											borderRadius: 3,
											transition: "all 0.3s ease",
											"&:hover": {
												transform: "translateY(-8px)",
												boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
											},
										}}>
										<Box
											sx={{
												width: { xs: 60, md: 80 },
												height: { xs: 60, md: 80 },
												borderRadius: "50%",
												bgcolor: alpha(theme.palette.primary.main, 0.1),
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												mx: "auto",
												mb: { xs: 2, md: 3 },
												color: "primary.main",
											}}>
											{React.cloneElement(stat.icon, { sx: { fontSize: { xs: 28, md: 36 } } })}
										</Box>

										<Typography
											variant='h3'
											sx={{
												fontWeight: 800,
												mb: { xs: 0.5, md: 1 },
												color: "primary.main",
												fontSize: { xs: "1.75rem", md: "2.5rem" },
											}}>
											{count.toLocaleString()}
											{stat.suffix}
										</Typography>

										<Typography
											variant='body1'
											sx={{
												color: "text.secondary",
												fontWeight: 500,
												fontSize: { xs: "0.9rem", md: "1rem" },
											}}>
											{stat.label}
										</Typography>
									</Box>
								</Grid>
							);
						})}
					</Grid>
				</Paper>
			</Box> */}

			{/* Testimonials Section */}
			{/* <Box sx={{ mb: 10, position: "relative" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						alignItems: { xs: "center", md: "center" },
						justifyContent: { xs: "center", md: "space-between" },
						mb: { xs: 4, md: 6 },
						textAlign: { xs: "center", md: "left" },
						gap: { xs: 2, md: 0 },
					}}>
					<Typography
						variant='h4'
						sx={{
							fontWeight: 600,
							color: "text.primary",
							fontSize: { xs: "1.75rem", md: "2.125rem" },
						}}>
						What Our Clients Say About Us
					</Typography>

					<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
						<IconButton
							onClick={() => handleTestimonialChange("prev")}
							disabled={isTransitioning}
							sx={{
								width: 40,
								height: 40,
								border: "1px solid",
								borderColor: "divider",
								color: "text.secondary",
								"&:hover": {
									bgcolor: "primary.main",
									color: "white",
									borderColor: "primary.main",
								},
								"&:disabled": {
									opacity: 0.5,
								},
							}}>
							<NavigateBeforeIcon fontSize='small' />
						</IconButton>
						<IconButton
							onClick={() => handleTestimonialChange("next")}
							disabled={isTransitioning}
							sx={{
								width: 40,
								height: 40,
								border: "1px solid",
								borderColor: "divider",
								color: "text.secondary",
								"&:hover": {
									bgcolor: "primary.main",
									color: "white",
									borderColor: "primary.main",
								},
								"&:disabled": {
									opacity: 0.5,
								},
							}}>
							<NavigateNextIcon fontSize='small' />
						</IconButton>
					</Box>
				</Box>

				<Box
					sx={{
						position: "relative",
						overflow: "hidden",
						height: { xs: "auto", md: 280 },
						borderRadius: 3,
						padding: { xs: "10px 0px", md: "20px 0px" },
					}}>
					<Box
						sx={{
							display: { xs: "block", md: "flex" },
							transform: { xs: "none", md: `translateX(-${currentTestimonial * 50}%)` },
							transition: isTransitioning
								? "none"
								: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
							width: { xs: "100%", md: "200%" },
							height: "100%",
						}}>
						<Box
							sx={{
								width: { xs: "100%", md: "50%" },
								px: 1,
								display: { xs: "block", md: "flex" },
								flexDirection: { xs: "column", md: "row" },
								gap: { xs: 2, md: 3 },
							}}>
							<Paper
								sx={{
									flex: 1,
									display: { xs: currentTestimonial === 0 ? "block" : "none", md: "block" },
									p: { xs: 3, md: 4 },
									borderRadius: 3,
									position: "relative",
									border: "1px solid",
									borderColor: "divider",
									bgcolor: "background.paper",
									boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
									transition: "all 0.3s ease",
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
									},
								}}>
								<Box
									sx={{
										position: "absolute",
										top: { xs: 15, md: 20 },
										right: { xs: 15, md: 20 },
										width: { xs: 35, md: 40 },
										height: { xs: 35, md: 40 },
										borderRadius: "50%",
										bgcolor: alpha(theme.palette.warning.main, 0.1),
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<FormatQuoteIcon
										sx={{
											fontSize: { xs: 16, md: 20 },
											color: "warning.main",
											transform: "rotate(180deg)",
										}}
									/>
								</Box>

								<Typography
									variant='body1'
									sx={{
										mb: { xs: 3, md: 4 },
										lineHeight: 1.7,
										color: "text.primary",
										fontSize: { xs: "0.9rem", md: "0.95rem" },
										pr: { xs: 4, md: 6 },
									}}>
									{testimonials[0].text}
								</Typography>

								<Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 } }}>
									<Avatar
										src={testimonials[0].image}
										alt={testimonials[0].name}
										sx={{
											width: { xs: 45, md: 50 },
											height: { xs: 45, md: 50 },
											bgcolor: "primary.main",
											border: "2px solid white",
											boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
										}}>
										{testimonials[0].name.charAt(0)}
									</Avatar>
									<Box sx={{ flex: 1 }}>
										<Typography
											variant='h6'
											sx={{
												fontWeight: 600,
												color: "text.primary",
												fontSize: { xs: "0.9rem", md: "1rem" },
												mb: 0.5,
											}}>
											{testimonials[0].name}
										</Typography>
										<Rating
											value={testimonials[0].rating}
											readOnly
											size='small'
											sx={{
												"& .MuiRating-iconFilled": {
													color: "warning.main",
												},
											}}
										/>
									</Box>
								</Box>
							</Paper>

							<Paper
								sx={{
									flex: 1,
									display: { xs: currentTestimonial === 1 ? "block" : "none", md: "block" },
									p: { xs: 3, md: 4 },
									borderRadius: 3,
									position: "relative",
									border: "1px solid",
									borderColor: "divider",
									bgcolor: "background.paper",
									boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
									transition: "all 0.3s ease",
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
									},
								}}>
								<Box
									sx={{
										position: "absolute",
										top: { xs: 15, md: 20 },
										right: { xs: 15, md: 20 },
										width: { xs: 35, md: 40 },
										height: { xs: 35, md: 40 },
										borderRadius: "50%",
										bgcolor: alpha(theme.palette.warning.main, 0.1),
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<FormatQuoteIcon
										sx={{
											fontSize: { xs: 16, md: 20 },
											color: "warning.main",
											transform: "rotate(180deg)",
										}}
									/>
								</Box>

								<Typography
									variant='body1'
									sx={{
										mb: { xs: 3, md: 4 },
										lineHeight: 1.7,
										color: "text.primary",
										fontSize: { xs: "0.9rem", md: "0.95rem" },
										pr: { xs: 4, md: 6 },
									}}>
									{testimonials[1].text}
								</Typography>

								<Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 } }}>
									<Avatar
										src={testimonials[1].image}
										alt={testimonials[1].name}
										sx={{
											width: { xs: 45, md: 50 },
											height: { xs: 45, md: 50 },
											bgcolor: "primary.main",
											border: "2px solid white",
											boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
										}}>
										{testimonials[1].name.charAt(0)}
									</Avatar>
									<Box sx={{ flex: 1 }}>
										<Typography
											variant='h6'
											sx={{
												fontWeight: 600,
												color: "text.primary",
												fontSize: { xs: "0.9rem", md: "1rem" },
												mb: 0.5,
											}}>
											{testimonials[1].name}
										</Typography>
										<Rating
											value={testimonials[1].rating}
											readOnly
											size='small'
											sx={{
												"& .MuiRating-iconFilled": {
													color: "warning.main",
												},
											}}
										/>
									</Box>
								</Box>
							</Paper>
						</Box>

						<Box
							sx={{
								width: { xs: "100%", md: "50%" },
								px: 1,
								display: { xs: currentTestimonial === 1 ? "flex" : "none", md: "flex" },
								justifyContent: "center",
								gap: { xs: 2, md: 3 },
							}}>
							<Paper
								sx={{
									width: { xs: "100%", md: "50%" },
									display: { xs: currentTestimonial === 2 ? "block" : "none", md: "block" },
									p: { xs: 3, md: 4 },
									borderRadius: 3,
									position: "relative",
									border: "1px solid",
									borderColor: "divider",
									bgcolor: "background.paper",
									boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
									transition: "all 0.3s ease",
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
									},
								}}>
								<Box
									sx={{
										position: "absolute",
										top: { xs: 15, md: 20 },
										right: { xs: 15, md: 20 },
										width: { xs: 35, md: 40 },
										height: { xs: 35, md: 40 },
										borderRadius: "50%",
										bgcolor: alpha(theme.palette.warning.main, 0.1),
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<FormatQuoteIcon
										sx={{
											fontSize: { xs: 16, md: 20 },
											color: "warning.main",
											transform: "rotate(180deg)",
										}}
									/>
								</Box>

								<Typography
									variant='body1'
									sx={{
										mb: { xs: 3, md: 4 },
										lineHeight: 1.7,
										color: "text.primary",
										fontSize: { xs: "0.9rem", md: "0.95rem" },
										pr: { xs: 4, md: 6 },
									}}>
									{testimonials[2].text}
								</Typography>

								<Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 } }}>
									<Avatar
										src={testimonials[2].image}
										alt={testimonials[2].name}
										sx={{
											width: { xs: 45, md: 50 },
											height: { xs: 45, md: 50 },
											bgcolor: "primary.main",
											border: "2px solid white",
											boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
										}}>
										{testimonials[2].name.charAt(0)}
									</Avatar>
									<Box sx={{ flex: 1 }}>
										<Typography
											variant='h6'
											sx={{
												fontWeight: 600,
												color: "text.primary",
												fontSize: { xs: "0.9rem", md: "1rem" },
												mb: 0.5,
											}}>
											{testimonials[2].name}
										</Typography>
										<Rating
											value={testimonials[2].rating}
											readOnly
											size='small'
											sx={{
												"& .MuiRating-iconFilled": {
													color: "warning.main",
												},
											}}
										/>
									</Box>
								</Box>
							</Paper>
						</Box>
					
						<Box
							sx={{
								display: { xs: currentTestimonial === 3 ? "block" : "none", md: "none" },
								width: "100%",
								px: 1,
							}}>
							<Paper
								sx={{
									p: 3,
									borderRadius: 3,
									position: "relative",
									border: "1px solid",
									borderColor: "divider",
									bgcolor: "background.paper",
									boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
									transition: "all 0.3s ease",
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
									},
								}}>
								<Box
									sx={{
										position: "absolute",
										top: 15,
										right: 15,
										width: 35,
										height: 35,
										borderRadius: "50%",
										bgcolor: alpha(theme.palette.warning.main, 0.1),
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<FormatQuoteIcon
										sx={{
											fontSize: 16,
											color: "warning.main",
											transform: "rotate(180deg)",
										}}
									/>
								</Box>
					
								<Typography
									variant='body1'
									sx={{
										mb: 3,
										lineHeight: 1.7,
										color: "text.primary",
										fontSize: "0.9rem",
										pr: 4,
									}}>
									{testimonials[3].text}
								</Typography>
					
								<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
									<Avatar
										src={testimonials[3].image}
										alt={testimonials[3].name}
										sx={{
											width: 45,
											height: 45,
											bgcolor: "primary.main",
											border: "2px solid white",
											boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
										}}>
										{testimonials[3].name.charAt(0)}
									</Avatar>
									<Box sx={{ flex: 1 }}>
										<Typography
											variant='h6'
											sx={{
												fontWeight: 600,
												color: "text.primary",
												fontSize: "0.9rem",
												mb: 0.5,
											}}>
											{testimonials[3].name}
										</Typography>
										<Rating
											value={testimonials[3].rating}
											readOnly
											size='small'
											sx={{
												"& .MuiRating-iconFilled": {
													color: "warning.main",
												},
											}}
										/>
									</Box>
								</Box>
							</Paper>
						</Box>
					</Box>
				</Box>

				<Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, md: 4 }, gap: 1 }}>
					<Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
						{[0, 1, 2, 3].map((slideIndex) => (
							<Box
								key={slideIndex}
								onClick={() => {
									if (!isTransitioning) {
										setIsTransitioning(true);
										setTimeout(() => {
											setCurrentTestimonial(slideIndex);
											setIsTransitioning(false);
										}, 150);
									}
								}}
								sx={{
									width: currentTestimonial === slideIndex ? 24 : 8,
									height: 8,
									borderRadius: 4,
									bgcolor:
										currentTestimonial === slideIndex
											? "primary.main"
											: "divider",
									cursor: "pointer",
									transition: "all 0.3s ease",
									"&:hover": {
										bgcolor:
											currentTestimonial === slideIndex
												? "primary.main"
												: "text.secondary",
									},
								}}
							/>
						))}
					</Box>
					
					<Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
						{[0, 1].map((slideIndex) => (
							<Box
								key={slideIndex}
								onClick={() => {
									if (!isTransitioning) {
										setIsTransitioning(true);
										setTimeout(() => {
											setCurrentTestimonial(slideIndex);
											setIsTransitioning(false);
										}, 150);
									}
								}}
								sx={{
									width: currentTestimonial === slideIndex ? 24 : 8,
									height: 8,
									borderRadius: 4,
									bgcolor:
										currentTestimonial === slideIndex
											? "primary.main"
											: "divider",
									cursor: "pointer",
									transition: "all 0.3s ease",
									"&:hover": {
										bgcolor:
											currentTestimonial === slideIndex
												? "primary.main"
												: "text.secondary",
									},
								}}
							/>
						))}
					</Box>
				</Box>
			</Box> */}

			{/* Hero Section */}
			{/* <Box sx={{ mb: 10, position: "relative", overflow: "hidden" }}>
				<Box sx={{ textAlign: "center", mb: 8 }}>
					<Chip
						label='Work Processing'
						sx={{
							mb: 3,
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							color: "primary.main",
							fontWeight: 500,
							fontSize: { xs: "0.8rem", md: "0.9rem" },
							px: 2,
							py: 0.5,
							"&::before": {
								content: '"★"',
								marginRight: 1,
							},
						}}
					/>
					<Typography
						variant='h4'
						sx={{
							fontWeight: 700,
							color: "text.primary",
							fontSize: { xs: "1.75rem", md: "2.125rem" },
							mb: 2,
						}}>
						How It Works
					</Typography>
					<Typography
						variant='body1'
						sx={{
							color: "text.secondary",
							maxWidth: 600,
							mx: "auto",
							fontSize: "1.1rem",
						}}>
						Our streamlined process ensures a smooth shopping experience from
						start to finish
					</Typography>
				</Box>

				<Box sx={{ position: "relative", maxWidth: 1200, mx: "auto", px: { xs: 2, md: 0 } }}>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "12.5%",
							right: "12.5%",
							height: 2,
							bgcolor: "divider",
							transform: "translateY(-50%)",
							zIndex: 0,
							display: { xs: "none", md: "block" },
						}}
					/>

					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "12.5%",
							width: "75%",
							height: 2,
							transform: "translateY(-50%)",
							zIndex: 1,
							display: { xs: "none", md: "block" },
							"&::before": {
								content: '""',
								position: "absolute",
								top: 0,
								left: 0,
								height: "100%",
								width: "0%",
								bgcolor: "primary.main",
								animation: "progressLine 3s ease-in-out infinite",
								"@keyframes progressLine": {
									"0%": { width: "0%" },
									"100%": { width: "100%" },
								},
							},
						}}
					/>

					<Grid container spacing={{ xs: 3, md: 4 }} sx={{ flexWrap: { xs: "wrap", lg: "nowrap" } }}>
						{processSteps.map((step, index) => (
							<Grid item xs={12} sm={6} lg={3} key={index}>
								<Box
									sx={{
										zIndex: 2,
										textAlign: "center",
										position: "relative",
										p: { xs: 2, md: 3 },
										height: "100%",
										transition: "all 0.3s ease",
										"&:hover": {
											transform: { xs: "none", md: "translateY(-8px)" },
											"& .step-card": {
												boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
												bgcolor: "primary.main",
												color: "white",
												"& .step-icon": {
													bgcolor: "rgba(255,255,255,0.2)",
													color: "white",
													transform: "scale(1.1)",
												},
												"& .step-number": {
													bgcolor: "white",
													color: "primary.main",
												},
											},
										},
									}}>
									<Paper
										className='step-card'
										sx={{
											p: { xs: 3, md: 4 },
											borderRadius: 4,
											height: "100%",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											position: "relative",
											border: "1px solid",
											borderColor: "divider",
											bgcolor: "background.paper",
											boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
											transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
											overflow: "hidden",
											"&::before": {
												content: '""',
												position: "absolute",
												top: 0,
												left: 0,
												right: 0,
												height: 4,
												bgcolor: "primary.main",
												transform: "scaleX(0)",
												transformOrigin: "left",
												transition: "transform 0.4s ease",
											},
											"&:hover::before": {
												transform: "scaleX(1)",
											},
										}}>
										<Box
											className='step-number'
											sx={{
												position: "absolute",
												top: { xs: 10, md: 15 },
												left: { xs: 15, md: 20 },
												width: { xs: 35, md: 40 },
												height: { xs: 25, md: 30 },
												bgcolor: "primary.main",
												color: "white",
												borderRadius: 2,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontWeight: 700,
												fontSize: { xs: "0.8rem", md: "0.9rem" },
												boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
												transition: "all 0.3s ease",
												zIndex: 2,
											}}>
											{step.step}
										</Box>

										<Box
											className='step-icon'
											sx={{
												mb: { xs: 2, md: 3 },
												mt: 2,
												width: { xs: 70, md: 80 },
												height: { xs: 70, md: 80 },
												borderRadius: "50%",
												bgcolor: alpha(theme.palette.primary.main, 0.1),
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "primary.main",
												transition: "all 0.4s ease",
												position: "relative",
												"&::before": {
													content: '""',
													position: "absolute",
													inset: -4,
													borderRadius: "50%",
													background: `conic-gradient(from 0deg, ${theme.palette.primary.main}, transparent, ${theme.palette.primary.main})`,
													opacity: 0,
													transition: "opacity 0.4s ease",
													animation: "rotate 2s linear infinite",
													"@keyframes rotate": {
														"0%": { transform: "rotate(0deg)" },
														"100%": { transform: "rotate(360deg)" },
													},
												},
											}}>
											{React.cloneElement(step.icon, {
												sx: { fontSize: { xs: 30, md: 36 }, zIndex: 1, position: "relative" },
											})}
										</Box>

										<Box
											sx={{
												flex: 1,
												display: "flex",
												flexDirection: "column",
												justifyContent: "center",
											}}>
											<Typography
												variant='h6'
												sx={{
													mb: { xs: 1.5, md: 2 },
													fontWeight: 700,
													color: "inherit",
													fontSize: { xs: "1rem", md: "1.1rem" },
												}}>
												{step.title}
											</Typography>
											<Typography
												variant='body2'
												sx={{
													lineHeight: 1.6,
													color: "inherit",
													opacity: 0.8,
													fontSize: { xs: "0.85rem", md: "0.95rem" },
												}}>
												{step.description}
											</Typography>
										</Box>

										<Box
											sx={{
												position: "absolute",
												top: -10,
												right: -10,
												width: 20,
												height: 20,
												borderRadius: "50%",
												bgcolor: alpha(theme.palette.secondary.main, 0.3),
												animation: "float 3s ease-in-out infinite",
												animationDelay: `${index * 0.5}s`,
												"@keyframes float": {
													"0%, 100%": { transform: "translateY(0px)" },
													"50%": { transform: "translateY(-10px)" },
												},
											}}
										/>
									</Paper>

									{index < processSteps.length - 1 && (
										<Box
											sx={{
												display: { xs: "block", md: "none" },
												width: 2,
												height: 40,
												bgcolor: "divider",
												mx: "auto",
												mt: 2,
												position: "relative",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: -5,
													left: "50%",
													transform: "translateX(-50%)",
													width: 0,
													height: 0,
													borderLeft: "5px solid transparent",
													borderRight: "5px solid transparent",
													borderTop: "8px solid",
													borderTopColor: "primary.main",
												},
											}}
										/>
									)}
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
			</Box> */}

			{/* Our Achievements */}
			{/* <Box sx={{ mb: 10, position: "relative" }}>
				<Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
					<Chip
						label='Our Team'
						sx={{
							mb: 3,
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							color: "primary.main",
							fontWeight: 500,
							fontSize: { xs: "0.8rem", md: "0.9rem" },
							px: 2,
							py: 0.5,
							"&::before": {
								content: '"★"',
								marginRight: 1,
							},
						}}
					/>
					<Typography
						variant='h4'
						sx={{
							fontWeight: 700,
							color: "text.primary",
							fontSize: { xs: "1.75rem", md: "2.125rem" },
							mb: 2,
						}}>
						Meet Our Team
					</Typography>
					<Typography
						variant='body1'
						sx={{
							color: "text.secondary",
							maxWidth: 600,
							mx: "auto",
							fontSize: { xs: "1rem", md: "1.1rem" },
							lineHeight: 1.6,
							px: { xs: 2, md: 0 },
						}}>
						The passionate individuals behind our success
					</Typography>
				</Box>

				<Grid
					container
					spacing={{ xs: 3, sm: 4, md: 6 }}
					justifyContent='center'
					sx={{ 
						flexWrap: { xs: "wrap", lg: "nowrap" },
						px: { xs: 2, md: 0 }
					}}>
					{teamMembers.slice(0, 3).map((member, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<Paper
								sx={{
									p: { xs: 3, md: 4 },
									borderRadius: { xs: 3, md: 4 },
									height: "100%",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									textAlign: "center",
									border: "1px solid",
									borderColor: "divider",
									bgcolor: "background.paper",
									boxShadow: { xs: "0 4px 16px rgba(0,0,0,0.08)", md: "0 8px 32px rgba(0,0,0,0.08)" },
									position: "relative",
									overflow: "hidden",
									transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
									"&:hover": {
										transform: { xs: "translateY(-4px)", md: "translateY(-8px)" },
										boxShadow: { xs: "0 8px 24px rgba(0,0,0,0.12)", md: "0 20px 48px rgba(0,0,0,0.15)" },
										"& .team-avatar": {
											transform: { xs: "scale(1.05)", md: "scale(1.1)" },
											boxShadow: { xs: "0 8px 20px rgba(0,0,0,0.15)", md: "0 12px 32px rgba(0,0,0,0.2)" },
										},
										"& .team-name": {
											color: "primary.main",
										},
										"& .team-role": {
											bgcolor: "primary.main",
											color: "white",
										},
									},
									"&::before": {
										content: '""',
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										height: 4,
										bgcolor: "primary.main",
										transform: "scaleX(0)",
										transformOrigin: "left",
										transition: "transform 0.4s ease",
									},
									"&:hover::before": {
										transform: "scaleX(1)",
									},
								}}>
								<Box
									sx={{
										position: "absolute",
										top: { xs: -10, md: -20 },
										right: { xs: -10, md: -20 },
										width: { xs: 60, md: 80 },
										height: { xs: 60, md: 80 },
										borderRadius: "50%",
										bgcolor: alpha(theme.palette.primary.main, 0.03),
										zIndex: 0,
									}}
								/>

								<Avatar
									className='team-avatar'
									sx={{
										width: { xs: 100, sm: 110, md: 120 },
										height: { xs: 100, sm: 110, md: 120 },
										mb: { xs: 2, md: 3 },
										bgcolor: "primary.main",
										fontSize: { xs: "2rem", sm: "2.2rem", md: "2.5rem" },
										fontWeight: 600,
										border: { xs: "3px solid white", md: "4px solid white" },
										boxShadow: { xs: "0 4px 16px rgba(0,0,0,0.15)", md: "0 8px 24px rgba(0,0,0,0.15)" },
										transition: "all 0.4s ease",
										zIndex: 1,
									}}
									alt={member.name}
									src={member.image}>
									{member.name.charAt(0)}
								</Avatar>

								<Box sx={{ flex: 1, zIndex: 1 }}>
									<Typography
										className='team-name'
										variant='h5'
										sx={{
											fontWeight: 700,
											color: "text.primary",
											mb: 1,
											fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.25rem" },
											transition: "color 0.3s ease",
										}}>
										{member.name}
									</Typography>

									<Chip
										className='team-role'
										label={member.position}
										sx={{
											mb: { xs: 2, md: 3 },
											bgcolor: alpha(theme.palette.primary.main, 0.1),
											color: "primary.main",
											fontWeight: 600,
											fontSize: { xs: "0.8rem", md: "0.85rem" },
											transition: "all 0.3s ease",
											borderRadius: 2,
										}}
									/>

									<Typography
										variant='body2'
										sx={{
											color: "text.secondary",
											lineHeight: 1.7,
											fontSize: { xs: "0.875rem", md: "0.95rem" },
											mb: { xs: 2, md: 3 },
											px: { xs: 1, md: 0 },
										}}>
										{member.bio}
									</Typography>

									<Box
										sx={{
											mt: "auto",
											p: { xs: 1.5, md: 2 },
											borderRadius: 2,
											bgcolor: alpha(theme.palette.success.main, 0.08),
											border: "1px solid",
											borderColor: alpha(theme.palette.success.main, 0.2),
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											gap: 1,
										}}>
										<Box
											sx={{
												width: { xs: 6, md: 8 },
												height: { xs: 6, md: 8 },
												borderRadius: "50%",
												bgcolor: "success.main",
											}}
										/>
										<Typography
											variant='body2'
											sx={{
												color: "success.main",
												fontWeight: 600,
												fontSize: { xs: "0.75rem", md: "0.9rem" },
											}}>
											{member.experience}
										</Typography>
									</Box>
								</Box>

								<Box
									sx={{
										position: "absolute",
										bottom: { xs: 15, md: 20 },
										left: { xs: 15, md: 20 },
										width: { xs: 8, md: 12 },
										height: { xs: 8, md: 12 },
										borderRadius: "50%",
										bgcolor: alpha(theme.palette.secondary.main, 0.3),
										animation: "float 4s ease-in-out infinite",
										animationDelay: `${index * 0.8}s`,
										"@keyframes float": {
											"0%, 100%": { transform: "translateY(0px)" },
											"50%": { transform: "translateY(-8px)" },
										},
									}}
								/>
							</Paper>
						</Grid>
					))}
				</Grid>

			</Box> */}

			{/* Animated CTA Section */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: 4,
					background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
					color: "white",
					mb: 0,
				}}>
				{/* Animated Background Elements */}
				<Box
					sx={{
						position: "absolute",
						top: -50,
						right: -50,
						width: 200,
						height: 200,
						borderRadius: "50%",
						bgcolor: alpha(theme.palette.secondary.main, 0.1),
						animation: "pulse 4s ease-in-out infinite",
						"@keyframes pulse": {
							"0%, 100%": { transform: "scale(1)", opacity: 0.7 },
							"50%": { transform: "scale(1.1)", opacity: 0.3 },
						},
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						bottom: -30,
						left: -30,
						width: 150,
						height: 150,
						borderRadius: "50%",
						bgcolor: alpha(theme.palette.secondary.main, 0.08),
						animation: "float 6s ease-in-out infinite",
						"@keyframes float": {
							"0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
							"50%": { transform: "translateY(-20px) rotate(180deg)" },
						},
					}}
				/>

				{/* Floating Particles */}
				{[...Array(6)].map((_, index) => (
					<Box
						key={index}
						sx={{
							position: "absolute",
							width: 8,
							height: 8,
							borderRadius: "50%",
							bgcolor: alpha(theme.palette.secondary.main, 0.4),
							top: `${20 + index * 15}%`,
							left: `${10 + index * 12}%`,
							animation: `sparkle 3s ease-in-out infinite ${index * 0.5}s`,
							"@keyframes sparkle": {
								"0%, 100%": { opacity: 0, transform: "scale(0)" },
								"50%": { opacity: 1, transform: "scale(1)" },
							},
						}}
					/>
				))}

				{/* Content */}
				<Container maxWidth='lg' sx={{ position: "relative", zIndex: 2 }}>
					<Box sx={{ py: 8 }}>
						{/* Main Content in Flex Layout */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 4,
								flexDirection: { xs: "column", md: "row" },
							}}>
							{/* Left Content - 70% */}
							<Box
								sx={{
									flex: "0 0 70%",
									textAlign: { xs: "center", md: "left" },
									width: { xs: "100%", md: "70%" },
								}}>
								{/* Header Badge */}
								<Chip
									label='Ready to Start Shopping?'
									sx={{
										mb: { xs: 3, md: 4 },
										bgcolor: alpha(theme.palette.secondary.main, 0.2),
										color: "white",
										fontWeight: 600,
										fontSize: "1rem",
										px: 3,
										py: 1,
										border: "2px solid",
										borderColor: alpha(theme.palette.secondary.main, 0.3),
										"&::before": {
											content: '"🛍️"',
											marginRight: 1,
										},
									}}
								/>

								{/* Main Heading */}
								<Typography
									variant='h3'
									sx={{
										fontWeight: 800,
										mb: 3,
										fontSize: { xs: "2rem", md: "3rem" },
										background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
										backgroundClip: "text",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										textShadow: "0 2px 4px rgba(0,0,0,0.1)",
									}}>
									Join Thousands of Happy Customers
								</Typography>

								{/* Subtitle */}
								<Typography
									variant='h6'
									sx={{
										mb: 6,
										opacity: 0.9,
										maxWidth: { xs: "100%", md: 600 },
										lineHeight: 1.6,
										fontSize: { xs: "1.1rem", md: "1.25rem" },
									}}>
									Discover premium quality products, exceptional service, and
									unbeatable prices. Your perfect shopping experience awaits!
								</Typography>

								{/* Action Buttons */}
								<Box
									sx={{
										display: "flex",
										gap: 3,
										justifyContent: { xs: "center", md: "flex-start" },
										flexWrap: "wrap",
									}}>
									<Link href="/products" passHref>
										<Button
											variant='contained'
											size='large'
											component="a"
											sx={{
												bgcolor: "white",
												color: "primary.main",
												fontWeight: 700,
												fontSize: "1.1rem",
												px: 4,
												py: 1.5,
												borderRadius: 3,
												boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
												transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
												"&:hover": {
													bgcolor: "white",
													transform: "translateY(-4px)",
													boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
												},
											}}>
											Shop Now
										</Button>
									</Link>
									<Link href="/products" passHref>
										<Button
											variant='outlined'
											size='large'
											component="a"
											sx={{
												color: "white",
												borderColor: "white",
												fontWeight: 600,
												fontSize: "1.1rem",
												px: 4,
												py: 1.5,
												borderRadius: 3,
												borderWidth: 2,
												transition: "all 0.3s ease",
												"&:hover": {
													bgcolor: alpha(theme.palette.common.white, 0.1),
													borderColor: "white",
													transform: "translateY(-2px)",
												},
											}}>
											View Catalog
										</Button>
									</Link>
								</Box>
							</Box>

							{/* Right Content - 30% - Social Links */}
							<Box
								sx={{
									flex: "0 0 30%",
									display: "flex",
									flexDirection: "column",
									alignItems: { xs: "center", md: "center" },
									justifyContent: "center",
									width: { xs: "100%", md: "30%" },
									mt: { xs: 4, md: 0 },
								}}>
								<Typography
									variant='body1'
									sx={{
										opacity: 0.9,
										mb: 3,
										fontSize: "1.1rem",
										fontWeight: 500,
										textAlign: { xs: "center", md: "center" },
									}}>
									Follow us for updates &<br /> exclusive offers
								</Typography>
								<Box
									sx={{
										display: "flex",
										gap: 2,
										flexWrap: "wrap",
										justifyContent: { xs: "center", md: "flex-end" },
									}}>
									{[
										{ icon: <FacebookIcon />, label: "Facebook" },
										{ icon: <TwitterIcon />, label: "Twitter" },
										{ icon: <InstagramIcon />, label: "Instagram" },
										{ icon: <LinkedInIcon />, label: "LinkedIn" },
									].map((social, index) => (
										<Button
											key={social.label}
											variant='outlined'
											sx={{
												color: "white",
												borderColor: alpha(theme.palette.common.white, 0.3),
												minWidth: 48,
												width: 48,
												height: 48,
												borderRadius: "50%",
												p: 0,
												transition: "all 0.3s ease",
												animation: `fadeInUp 0.8s ease-out ${
													index * 0.1
												}s both`,
												"&:hover": {
													bgcolor: alpha(theme.palette.secondary.main, 0.2),
													borderColor: "secondary.main",
													transform: "translateY(-2px) scale(1.1)",
												},
												"@keyframes fadeInUp": {
													from: { opacity: 0, transform: "translateY(20px)" },
													to: { opacity: 1, transform: "translateY(0)" },
												},
											}}>
											{social.icon}
										</Button>
									))}
								</Box>
							</Box>
						</Box>
					</Box>
				</Container>
			</Box>
		</Container>
	);
}
