"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Paper,
	Divider,
	InputAdornment,
	IconButton,
	Alert,
	CircularProgress,
	Grid,
	Card,
	CardContent,
	useTheme,
	Breadcrumbs,
	Link as MuiLink,
} from "@mui/material";
import {
	Visibility,
	VisibilityOff,
	Google as GoogleIcon,
	PersonAdd,
	EmailOutlined,
	NavigateNext as NavigateNextIcon,
	PhoneOutlined,
	BadgeOutlined,
} from "@mui/icons-material";
import FormField from "@/components/ui/FormField";

export default function RegisterPage() {
	const { register } = useAuth();
	const router = useRouter();
	const theme = useTheme();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
	});

	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear field error when user types
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name) {
			newErrors.name = "Name is required";
		}

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (
			formData.phone &&
			!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ""))
		) {
			newErrors.phone = "Phone number is invalid";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			setLoading(true);
			setError("");

			// Remove confirmPassword before sending to API
			const { confirmPassword, ...userData } = formData;
			await register(userData);
			// Redirect is handled in the AuthContext after successful registration
		} catch (err) {
			setError(
				err.response?.data?.message || "Registration failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleToggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleGoogleSignUp = async () => {
		try {
			setGoogleLoading(true);
			setError("");

			// Use NextAuth signIn with Google provider
			const result = await signIn("google", {
				callbackUrl:
					typeof window !== "undefined"
						? new URLSearchParams(window.location.search).get("redirect") ||
						  "/customer/dashboard"
						: "/customer/dashboard",
				redirect: false,
			});

			if (result?.error) {
				setError("Google Sign-Up failed. Please try again.");
			} else if (result?.ok) {
				// Get the session to update local state
				const session = await getSession();
				if (session?.user) {
					// Update the auth context with the Google user
					window.location.href = result.url || "/customer/dashboard";
				}
			}
		} catch (err) {
			console.error("Google Sign-Up error:", err);
			setError("Google Sign-Up failed. Please try again.");
		} finally {
			setGoogleLoading(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "white",
				position: "relative",
				overflow: "hidden",
			}}>
			{/* Subtle Background Elements */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					pointerEvents: "none",
					zIndex: 0,
				}}>
				{/* Light subtle shapes using site colors */}
				<Box
					sx={{
						position: "absolute",
						top: "5%",
						right: "10%",
						width: { xs: 120, md: 180 },
						height: { xs: 120, md: 180 },
						borderRadius: "50%",
						background:
							"linear-gradient(135deg, rgba(162, 146, 120, 0.03), rgba(162, 146, 120, 0.01))",
						filter: "blur(40px)",
						animation: "float 6s ease-in-out infinite",
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						bottom: "15%",
						left: "8%",
						width: { xs: 80, md: 120 },
						height: { xs: 80, md: 120 },
						borderRadius: "20px",
						background: "rgba(162, 146, 120, 0.02)",
						filter: "blur(30px)",
						transform: "rotate(45deg)",
						animation: "float 8s ease-in-out infinite reverse",
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						top: "40%",
						right: "5%",
						width: { xs: 60, md: 100 },
						height: { xs: 60, md: 100 },
						borderRadius: "15px",
						background: "rgba(162, 146, 120, 0.015)",
						filter: "blur(25px)",
						animation: "float 10s ease-in-out infinite",
					}}
				/>
			</Box>

			{/* Floating Animation Keyframes */}
			<style jsx global>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px) rotate(0deg);
					}
					33% {
						transform: translateY(-10px) rotate(1deg);
					}
					66% {
						transform: translateY(5px) rotate(-1deg);
					}
				}
			`}</style>

			<Container maxWidth='xl' sx={{ position: "relative", zIndex: 1, py: 4 }}>
				{/* Breadcrumbs */}

				<Grid
					container
					spacing={4}
					alignItems='center'
					sx={{
						// minHeight: 'calc(100vh - 200px)',
						maxWidth: "1260px",
						flexWrap: "nowrap",
						margin: "0 auto",
						"@media (max-width: 960px)": {
							flexWrap: "wrap",
						},
					}}>
					{/* Left side - Welcome Message */}
					<Grid
						item
						xs={12}
						md={6}
						sx={{
							display: { xs: "none", md: "flex" },
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							textAlign: "center",
							px: 4,
							flex: 1,
						}}>
						<Box
							sx={{
								position: "relative",
								"&::before": {
									content: '""',
									position: "absolute",
									top: "-20px",
									left: "50%",
									transform: "translateX(-50%)",
									width: "60px",
									height: "4px",
									background: "linear-gradient(90deg, #a29278, #d4c09e)",
									borderRadius: "2px",
								},
							}}>
							<PersonAdd
								sx={{
									fontSize: { xs: 60, md: 80 },
									color: "#a29278",
									mb: 3,
									filter: "drop-shadow(0 4px 8px rgba(162, 146, 120, 0.2))",
								}}
							/>
						</Box>

						<Typography
							variant='h3'
							component='h1'
							sx={{
								fontWeight: 700,
								background: "linear-gradient(135deg, #a29278, #8a7961)",
								backgroundClip: "text",
								WebkitBackgroundClip: "text",
								color: "transparent",
								mb: 2,
								fontSize: { xs: "1.8rem", md: "2.5rem" },
							}}>
							Join India Inspired
						</Typography>

						<Typography
							variant='h6'
							sx={{
								color: "text.secondary",
								mb: 4,
								maxWidth: 400,
								lineHeight: 1.6,
							}}>
							Create your account to discover authentic Indian treasures and
							exclusive collections.
						</Typography>

						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 2,
								textAlign: "left",
								maxWidth: 350,
							}}>
							{[
								"Exclusive member-only discounts",
								"Early access to new collections",
								"Personalized product recommendations",
								"Priority customer support",
							].map((benefit, index) => (
								<Box key={index} sx={{ display: "flex", alignItems: "center" }}>
									<Box
										sx={{
											width: 8,
											height: 8,
											borderRadius: "50%",
											backgroundColor: "#a29278",
											mr: 2,
											flexShrink: 0,
										}}
									/>
									<Typography variant='body2' color='text.secondary'>
										{benefit}
									</Typography>
								</Box>
							))}
						</Box>
					</Grid>

					{/* Right side - Registration Form */}
					<Grid item xs={12} md={6} style={{ flex: 1 }}>
						<Card
							elevation={0}
							sx={{
								maxWidth: 500,
								mx: "auto",
								backgroundColor: "rgba(255, 255, 255, 0.95)",
								backdropFilter: "blur(20px)",
								border: "1px solid rgba(162, 146, 120, 0.1)",
								borderRadius: 3,
								overflow: "visible",
								position: "relative",
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "4px",
									background:
										"linear-gradient(90deg, #a29278, #d4c09e, #a29278)",
									borderRadius: "12px 12px 0 0",
								},
							}}>
							<CardContent sx={{ p: { xs: 3, md: 4 } }}>
								<Box sx={{ textAlign: "center", mb: 4 }}>
									<Typography
										variant='h4'
										component='h1'
										sx={{
											fontWeight: 700,
											color: "#a29278",
											mb: 1,
											fontSize: { xs: "1.8rem", md: "2rem" },
										}}>
										Create Account
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										Start your journey with authentic Indian products
									</Typography>
								</Box>

								{error && (
									<Alert
										severity='error'
										sx={{
											mb: 3,
											borderRadius: 2,
											"& .MuiAlert-icon": { color: "#d32f2f" },
										}}>
										{error}
									</Alert>
								)}

								{/* Google Sign-Up Button */}
								<Button
									onClick={handleGoogleSignUp}
									fullWidth
									variant='outlined'
									disabled={googleLoading}
									sx={{
										mb: 3,
										py: 1.5,
										border: "2px solid #e0e0e0",
										color: "#333",
										fontSize: "1rem",
										fontWeight: 500,
										textTransform: "none",
										borderRadius: 2,
										transition: "all 0.3s ease",
										"&:hover": {
											border: "2px solid #a29278",
											backgroundColor: "rgba(162, 146, 120, 0.04)",
											transform: "translateY(-1px)",
											boxShadow: "0 4px 12px rgba(162, 146, 120, 0.15)",
										},
										"&:disabled": {
											backgroundColor: "rgba(0, 0, 0, 0.04)",
										},
									}}>
									{googleLoading ? (
										<CircularProgress
											size={20}
											sx={{ mr: 1, color: "#a29278" }}
										/>
									) : (
										<GoogleIcon sx={{ mr: 1.5, color: "#db4437" }} />
									)}
									{googleLoading
										? "Creating Account..."
										: "Continue with Google"}
								</Button>

								<Divider
									sx={{
										my: 3,
										"&::before, &::after": {
											borderColor: "rgba(162, 146, 120, 0.2)",
										},
									}}>
									<Typography
										variant='body2'
										sx={{
											color: "text.secondary",
											backgroundColor: "white",
											px: 2,
										}}>
										Or create with email
									</Typography>
								</Divider>

								<form onSubmit={handleSubmit}>
									<Grid container spacing={2}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "10px",
											}}>
											<Grid item xs={12}>
												<TextField
													fullWidth
													label='Full Name'
													name='name'
													value={formData.name}
													onChange={handleChange}
													error={!!errors.name}
													helperText={errors.name}
													required
													InputProps={{
														startAdornment: (
															<InputAdornment position='start'>
																<BadgeOutlined sx={{ color: "#a29278" }} />
															</InputAdornment>
														),
													}}
													sx={{
														"& .MuiOutlinedInput-root": {
															borderRadius: 2,
															transition: "all 0.3s ease",
															"&:hover .MuiOutlinedInput-notchedOutline": {
																borderColor: "#a29278",
															},
															"&.Mui-focused .MuiOutlinedInput-notchedOutline":
																{
																	borderColor: "#a29278",
																},
														},
														"& .MuiInputLabel-root.Mui-focused": {
															color: "#a29278",
														},
													}}
												/>
											</Grid>

											<Grid item xs={12} md={6}>
												<TextField
													fullWidth
													label='Phone Number (optional)'
													name='phone'
													value={formData.phone}
													onChange={handleChange}
													error={!!errors.phone}
													helperText={errors.phone}
													InputProps={{
														startAdornment: (
															<InputAdornment position='start'>
																<PhoneOutlined sx={{ color: "#a29278" }} />
															</InputAdornment>
														),
													}}
													sx={{
														"& .MuiOutlinedInput-root": {
															borderRadius: 2,
															transition: "all 0.3s ease",
															"&:hover .MuiOutlinedInput-notchedOutline": {
																borderColor: "#a29278",
															},
															"&.Mui-focused .MuiOutlinedInput-notchedOutline":
																{
																	borderColor: "#a29278",
																},
														},
														"& .MuiInputLabel-root.Mui-focused": {
															color: "#a29278",
														},
													}}
												/>
											</Grid>
										</div>

										<Grid item xs={12} md={6} style={{ width: '100%' }}>
											<TextField
												fullWidth
												label='Email'
												name='email'
												type='email'
												value={formData.email}
												onChange={handleChange}
												error={!!errors.email}
												helperText={errors.email}
												required
												InputProps={{
													startAdornment: (
														<InputAdornment position='start'>
															<EmailOutlined sx={{ color: "#a29278" }} />
														</InputAdornment>
													),
												}}
												sx={{
													"& .MuiOutlinedInput-root": {
														borderRadius: 2,
														transition: "all 0.3s ease",
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: "#a29278",
														},
														"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
															borderColor: "#a29278",
														},
													},
													"& .MuiInputLabel-root.Mui-focused": {
														color: "#a29278",
													},
												}}
											/>
										</Grid>

                    
                    <div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "10px",
											}}>
										<Grid item xs={12} md={6}>
											<TextField
												fullWidth
												label='Password'
												name='password'
												type={showPassword ? "text" : "password"}
												value={formData.password}
												onChange={handleChange}
												error={!!errors.password}
												helperText={errors.password}
												required
												InputProps={{
													endAdornment: (
														<InputAdornment position='end'>
															<IconButton
																onClick={handleTogglePasswordVisibility}
																edge='end'
																sx={{ color: "#a29278" }}>
																{showPassword ? (
																	<VisibilityOff />
																) : (
																	<Visibility />
																)}
															</IconButton>
														</InputAdornment>
													),
												}}
												sx={{
													"& .MuiOutlinedInput-root": {
														borderRadius: 2,
														transition: "all 0.3s ease",
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: "#a29278",
														},
														"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
															borderColor: "#a29278",
														},
													},
													"& .MuiInputLabel-root.Mui-focused": {
														color: "#a29278",
													},
												}}
											/>
										</Grid>

										<Grid item xs={12} md={6}>
											<TextField
												fullWidth
												label='Confirm Password'
												name='confirmPassword'
												type={showConfirmPassword ? "text" : "password"}
												value={formData.confirmPassword}
												onChange={handleChange}
												error={!!errors.confirmPassword}
												helperText={errors.confirmPassword}
												required
												InputProps={{
													endAdornment: (
														<InputAdornment position='end'>
															<IconButton
																onClick={handleToggleConfirmPasswordVisibility}
																edge='end'
																sx={{ color: "#a29278" }}>
																{showConfirmPassword ? (
																	<VisibilityOff />
																) : (
																	<Visibility />
																)}
															</IconButton>
														</InputAdornment>
													),
												}}
												sx={{
													"& .MuiOutlinedInput-root": {
														borderRadius: 2,
														transition: "all 0.3s ease",
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: "#a29278",
														},
														"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
															borderColor: "#a29278",
														},
													},
													"& .MuiInputLabel-root.Mui-focused": {
														color: "#a29278",
													},
												}}
											/>
                      </Grid>
                    </div>
                    
									</Grid>

									<Button
										type='submit'
										fullWidth
										variant='contained'
										disabled={loading}
										sx={{
											mt: 3,
											py: 1.5,
											backgroundColor: "#a29278",
											fontSize: "1rem",
											fontWeight: 600,
											textTransform: "none",
											borderRadius: 2,
											boxShadow: "0 4px 12px rgba(162, 146, 120, 0.3)",
											transition: "all 0.3s ease",
											"&:hover": {
												backgroundColor: "#8a7961",
												transform: "translateY(-2px)",
												boxShadow: "0 6px 20px rgba(162, 146, 120, 0.4)",
											},
											"&:disabled": {
												backgroundColor: "rgba(162, 146, 120, 0.6)",
											},
										}}>
										{loading ? (
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<CircularProgress
													size={20}
													sx={{ mr: 1, color: "white" }}
												/>
												Creating Account...
											</Box>
										) : (
											"Create Account"
										)}
									</Button>
								</form>

								<Box sx={{ textAlign: "center", mt: 3 }}>
									<Typography variant='body2' color='text.secondary'>
										Already have an account?{" "}
										<Link href='/login' passHref>
											<MuiLink
												sx={{
													color: "#a29278",
													textDecoration: "none",
													fontWeight: 500,
													"&:hover": {
														textDecoration: "underline",
													},
												}}>
												Sign In
											</MuiLink>
										</Link>
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
