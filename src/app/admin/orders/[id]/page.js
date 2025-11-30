"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format currency
const formatCurrency = (amount) => {
  if (!amount) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Status steps mapping
const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

// Status colors
const statusColors = {
  pending: { bg: "#FFF8E1", color: "#F57F17" },
  processing: { bg: "#E3F2FD", color: "#1565C0" },
  shipped: { bg: "#E8F5E9", color: "#2E7D32" },
  delivered: { bg: "#E0F2F1", color: "#00695C" },
  cancelled: { bg: "#FFEBEE", color: "#C62828" },
};

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;
  const theme = useTheme();

  console.log("OrderDetailPage render:", { user, authLoading, orderId });

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching order details for ID:", orderId);

      const { data } = await axios.get(`/api/admin/orders/${orderId}`);
      console.log("Order data received:", data);

      // Handle the API response structure - data might be nested under 'data' property
      const orderData = data.data || data;
      setOrder(orderData);

      // Initialize dialog fields with current values
      if (orderData) {
        setNewStatus(orderData.orderStatus || "Pending");
        setTrackingNumber(orderData.trackingNumber || "");
        setTrackingUrl(orderData.trackingUrl || "");
        setStatusNote(orderData.statusNote || "");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    console.log("OrderDetailPage useEffect:", { user, authLoading, orderId });

    // Redirect if not admin
    if (!authLoading && (!user || !user.isAdmin)) {
      console.log("Redirecting to login because user is not admin");
      router.push(`/login?redirect=/admin/orders/${orderId}`);
      return;
    }

    if (user && user.isAdmin && orderId) {
      console.log("Fetching order because user is admin and orderId exists");
      fetchOrder();
    }
  }, [user, authLoading, router, orderId, fetchOrder]);

  const handleOpenStatusDialog = () => {
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);

      const updateData = {
        orderStatus: newStatus,
        trackingNumber: trackingNumber.trim() || undefined,
        trackingUrl: trackingUrl.trim() || undefined,
        statusNote: statusNote.trim() || undefined,
      };

      console.log(
        "Updating order status for ID:",
        orderId,
        "with data:",
        updateData
      );

      await axios.put(`/api/admin/orders/${orderId}`, updateData);
      console.log("Order status updated successfully");

      await fetchOrder(); // Refresh order data
      handleCloseStatusDialog();
      setSnackbar({
        open: true,
        message: "Order status updated successfully",
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating order status:", err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to update order status",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getActiveStep = () => {
    if (order?.orderStatus === "Cancelled") return -1;
    const stepIndex = statusSteps.indexOf(order?.orderStatus);
    return stepIndex === -1 ? 0 : stepIndex;
  };

  // Helper function to parse full name
  const parseFullName = (fullName) => {
    if (!fullName) return { firstName: "", lastName: "" };
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    return { firstName, lastName };
  };

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

  if (!order) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Order not found
        </Alert>
      </Container>
    );
  }

  const { firstName, lastName } = parseFullName(
    order.shippingAddress?.fullName
  );
  const customerEmail =
    order.user?.email || order.shippingAddress?.email || "No email available";

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
          Order Details #
          {order._id
            ? order._id
                .toString()
                .substring(order._id.toString().length - 8)
                .toUpperCase()
            : "N/A"}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/admin/dashboard" passHref>
            <MuiLink underline="hover" color="inherit">
              Dashboard
            </MuiLink>
          </Link>
          <Link href="/admin/orders" passHref>
            <MuiLink underline="hover" color="inherit">
              Orders
            </MuiLink>
          </Link>
          <Typography color="text.primary">Order Details</Typography>
        </Breadcrumbs>
      </Box>

      {/* Order Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" component="h2">
              Order #
              {order._id
                ? order._id
                    .toString()
                    .substring(order._id.toString().length - 8)
                    .toUpperCase()
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* <Button
              variant="outlined"
              size="small"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Print
            </Button> */}
            <Button
              variant="outlined"
              size="small"
              startIcon={<EmailIcon />}
              onClick={() => (window.location.href = `mailto:${customerEmail}`)}
            >
              Email Customer
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleOpenStatusDialog}
              sx={{
                bgcolor: "#8D6E63",
                "&:hover": { bgcolor: "#6D4C41" },
              }}
            >
              Update Status
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Order Status */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Status:
            </Typography>
            <Chip
              label={
                order.orderStatus
                  ? order.orderStatus.charAt(0).toUpperCase() +
                    order.orderStatus.slice(1)
                  : "Pending"
              }
              sx={{
                bgcolor:
                  statusColors[order.orderStatus?.toLowerCase()]?.bg ||
                  statusColors["pending"].bg,
                color:
                  statusColors[order.orderStatus?.toLowerCase()]?.color ||
                  statusColors["pending"].color,
                fontWeight: "medium",
              }}
            />
          </Box>

          {order.orderStatus !== "Cancelled" && (
            <Stepper
              activeStep={getActiveStep()}
              alternativeLabel
              sx={{ mt: 3 }}
            >
              <Step>
                <StepLabel>Order Placed</StepLabel>
              </Step>
              <Step>
                <StepLabel>Processing</StepLabel>
              </Step>
              <Step>
                <StepLabel>Shipped</StepLabel>
              </Step>
              <Step>
                <StepLabel>Delivered</StepLabel>
              </Step>
            </Stepper>
          )}

          {order.trackingNumber && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Tracking Number:{" "}
                {order.trackingUrl ? (
                  <MuiLink
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {order.trackingNumber}
                  </MuiLink>
                ) : (
                  order.trackingNumber
                )}
              </Typography>
            </Box>
          )}

          {order.statusNote && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Note: {order.statusNote}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Order Items */}
        <Grid item xs={12} md={8} sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Order Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems?.map((item, index) => (
                    <TableRow key={item._id || index}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              position: "relative",
                              width: 60,
                              height: 60,
                              mr: 2,
                            }}
                          >
                            <Image
                              src={item.image || "/images/placeholder.png"}
                              alt={item.name || "Product"}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2">
                              {item.name || "Product Name"}
                            </Typography>
                            {item.color && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                Color: {item.color}
                              </Typography>
                            )}
                            {item.size && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                Size: {item.size}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell align="center">{item.quantity || 1}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          (item.price || 0) * (item.quantity || 1)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4} sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">
                {formatCurrency(order.itemsPrice)}
              </Typography>
            </Box>
            {order.discount && order.discount > 0 && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Discount</Typography>
                <Typography variant="body2" color="error">
                  -{formatCurrency(order.discount)}
                </Typography>
              </Box>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Shipping</Typography>
              <Typography variant="body2">
                {formatCurrency(order.shippingPrice)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Tax</Typography>
              <Typography variant="body2">
                {formatCurrency(order.taxPrice)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {formatCurrency(order.totalPrice)}
              </Typography>
            </Box>
            {order.couponCode && (
              <Box sx={{ mt: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2">
                  Coupon Applied: <strong>{order.couponCode}</strong>
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Payment Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PaymentIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h3">
                Payment Information
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1">
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : order.paymentMethod || "Not specified"}
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Payment Status
              </Typography>
              <Chip
                label={order.isPaid ? "Paid" : "Unpaid"}
                size="small"
                sx={{
                  bgcolor: order.isPaid ? "#E8F5E9" : "#FFEBEE",
                  color: order.isPaid ? "#2E7D32" : "#C62828",
                }}
              />
            </Box>
            {order.isPaid && order.paidAt && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Paid On
                </Typography>
                <Typography variant="body1">
                  {formatDate(order.paidAt)}
                </Typography>
              </Box>
            )}
            {order.transactionId && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Transaction ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                  {order.transactionId}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Shipping Information */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ShippingIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h3">
                Shipping Information
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Customer
              </Typography>
              <Typography variant="body1">
                {firstName} {lastName}
              </Typography>
              <Typography variant="body2">{customerEmail}</Typography>
              {order.shippingAddress?.phone && (
                <Typography variant="body2">
                  {order.shippingAddress.phone}
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress?.address}
              </Typography>
              {order.shippingAddress?.address2 && (
                <Typography variant="body1">
                  {order.shippingAddress?.address2}
                </Typography>
              )}
              <Typography variant="body1">
                {order.shippingAddress?.city}
                {order.shippingAddress?.state &&
                  `, ${order.shippingAddress.state}`}{" "}
                {order.shippingAddress?.postalCode ||
                  order.shippingAddress?.zipCode}
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress?.country}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the status and tracking information for this order.
          </DialogContentText>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Tracking Number (Optional)"
            fullWidth
            variant="outlined"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Tracking URL (Optional)"
            fullWidth
            variant="outlined"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Status Note (Optional)"
            fullWidth
            variant="outlined"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#8D6E63",
              "&:hover": { bgcolor: "#6D4C41" },
            }}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
