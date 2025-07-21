'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link as MuiLink,
  FormControlLabel,
  Switch,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    storeLogo: '',
    storeFavicon: '',
    maintenanceMode: false,
    allowGuestCheckout: true,
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    itemsPerPage: 12,
  });
  
  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    enableCashOnDelivery: true,
    enablePaypal: false,
    enableStripe: false,
    paypalClientId: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    taxRate: 5,
  });
  
  // Shipping settings
  const [shippingSettings, setShippingSettings] = useState({
    enableFreeShipping: true,
    freeShippingThreshold: 100,
    flatRateShipping: 10,
    shippingOptions: [
      { name: 'Standard Shipping', price: 10, estimatedDays: '3-5' },
      { name: 'Express Shipping', price: 25, estimatedDays: '1-2' },
    ],
    newShippingOption: { name: '', price: 0, estimatedDays: '' },
  });
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    smtpFromEmail: '',
    smtpFromName: '',
    enableOrderConfirmation: true,
    enableShippingNotification: true,
    enableDeliveryNotification: true,
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    notifyLowStock: true,
    lowStockThreshold: 5,
    notifyOutOfStock: true,
    notifyNewOrder: true,
    notifyNewCustomer: true,
    notifyNewReview: true,
  });

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push('/login?redirect=/admin/settings');
      return;
    }

    if (user && user.isAdmin) {
      fetchSettings();
    }
  }, [user, authLoading, router]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch all settings
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      
      // Update state with fetched settings
      if (data.general) setGeneralSettings(prev => ({ ...prev, ...data.general }));
      if (data.payment) setPaymentSettings(prev => ({ ...prev, ...data.payment }));
      if (data.shipping) setShippingSettings(prev => ({ ...prev, ...data.shipping }));
      if (data.email) setEmailSettings(prev => ({ ...prev, ...data.email }));
      if (data.notification) setNotificationSettings(prev => ({ ...prev, ...data.notification }));
      
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message || 'Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGeneralChange = (e) => {
    const { name, value, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, checked } = e.target;
    setPaymentSettings(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value, checked } = e.target;
    setShippingSettings(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleNewShippingOptionChange = (e) => {
    const { name, value } = e.target;
    setShippingSettings(prev => ({
      ...prev,
      newShippingOption: {
        ...prev.newShippingOption,
        [name]: value
      }
    }));
  };

  const handleAddShippingOption = () => {
    const { newShippingOption, shippingOptions } = shippingSettings;
    
    if (!newShippingOption.name || !newShippingOption.estimatedDays) {
      setSnackbar({
        open: true,
        message: 'Please fill in all shipping option fields',
        severity: 'error',
      });
      return;
    }
    
    setShippingSettings(prev => ({
      ...prev,
      shippingOptions: [...prev.shippingOptions, { ...prev.newShippingOption }],
      newShippingOption: { name: '', price: 0, estimatedDays: '' }
    }));
  };

  const handleRemoveShippingOption = (index) => {
    setShippingSettings(prev => ({
      ...prev,
      shippingOptions: prev.shippingOptions.filter((_, i) => i !== index)
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value, checked } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, value, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // Prepare settings data
      const settingsData = {
        general: generalSettings,
        payment: paymentSettings,
        shipping: {
          ...shippingSettings,
          // Remove the newShippingOption field as it's just for UI
          newShippingOption: undefined
        },
        email: emailSettings,
        notification: notificationSettings
      };
      
      // Save settings
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }
      
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success',
      });
      
    } catch (err) {
      console.error('Error saving settings:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to save settings',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (authLoading || loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <MuiLink 
                component={Link} 
                href="/admin/dashboard" 
                underline="hover" 
                color="inherit"
              >
                Dashboard
              </MuiLink>
              <Typography color="text.primary">Settings</Typography>
            </Breadcrumbs>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h1">
                Store Settings
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="settings tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<SettingsIcon />} iconPosition="start" label="General" />
                <Tab icon={<PaymentIcon />} iconPosition="start" label="Payment" />
                <Tab icon={<ShippingIcon />} iconPosition="start" label="Shipping" />
                <Tab icon={<EmailIcon />} iconPosition="start" label="Email" />
                <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
              </Tabs>
            </Box>

            {/* General Settings */}
            {tabValue === 0 && (
              <Box sx={{ py: 3 }}>
                <Typography variant="h6" gutterBottom>
                  General Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Store Name"
                      name="storeName"
                      value={generalSettings.storeName}
                      onChange={handleGeneralChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Store Email"
                      name="storeEmail"
                      type="email"
                      value={generalSettings.storeEmail}
                      onChange={handleGeneralChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Store Phone"
                      name="storePhone"
                      value={generalSettings.storePhone}
                      onChange={handleGeneralChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Store Address"
                      name="storeAddress"
                      value={generalSettings.storeAddress}
                      onChange={handleGeneralChange}
                      margin="normal"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Store Logo URL"
                      name="storeLogo"
                      value={generalSettings.storeLogo}
                      onChange={handleGeneralChange}
                      margin="normal"
                      helperText="Enter the URL of your store logo"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Store Favicon URL"
                      name="storeFavicon"
                      value={generalSettings.storeFavicon}
                      onChange={handleGeneralChange}
                      margin="normal"
                      helperText="Enter the URL of your store favicon"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="default-currency-label">Default Currency</InputLabel>
                      <Select
                        labelId="default-currency-label"
                        name="defaultCurrency"
                        value={generalSettings.defaultCurrency}
                        onChange={handleGeneralChange}
                        label="Default Currency"
                      >
                        <MenuItem value="USD">USD - US Dollar</MenuItem>
                        <MenuItem value="EUR">EUR - Euro</MenuItem>
                        <MenuItem value="GBP">GBP - British Pound</MenuItem>
                        <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                        <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                        <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="default-language-label">Default Language</InputLabel>
                      <Select
                        labelId="default-language-label"
                        name="defaultLanguage"
                        value={generalSettings.defaultLanguage}
                        onChange={handleGeneralChange}
                        label="Default Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                        <MenuItem value="it">Italian</MenuItem>
                        <MenuItem value="ja">Japanese</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Items Per Page"
                      name="itemsPerPage"
                      type="number"
                      value={generalSettings.itemsPerPage}
                      onChange={handleGeneralChange}
                      margin="normal"
                      InputProps={{ inputProps: { min: 1, max: 100 } }}
                      helperText="Number of products to display per page"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={generalSettings.allowGuestCheckout}
                          onChange={handleGeneralChange}
                          name="allowGuestCheckout"
                          color="primary"
                        />
                      }
                      label="Allow Guest Checkout"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={generalSettings.maintenanceMode}
                          onChange={handleGeneralChange}
                          name="maintenanceMode"
                          color="warning"
                        />
                      }
                      label="Maintenance Mode"
                    />
                    {generalSettings.maintenanceMode && (
                      <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 1 }}>
                        Warning: Enabling maintenance mode will make your store inaccessible to customers.
                        Only administrators will be able to access the site.
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Payment Settings */}
            {tabValue === 1 && (
              <Box sx={{ py: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Payment Methods
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={paymentSettings.enableCashOnDelivery}
                                  onChange={handlePaymentChange}
                                  name="enableCashOnDelivery"
                                  color="primary"
                                />
                              }
                              label="Cash on Delivery"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={paymentSettings.enablePaypal}
                                  onChange={handlePaymentChange}
                                  name="enablePaypal"
                                  color="primary"
                                />
                              }
                              label="PayPal"
                            />
                            {paymentSettings.enablePaypal && (
                              <TextField
                                fullWidth
                                label="PayPal Client ID"
                                name="paypalClientId"
                                value={paymentSettings.paypalClientId}
                                onChange={handlePaymentChange}
                                margin="normal"
                                sx={{ mt: 2 }}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={paymentSettings.enableStripe}
                                  onChange={handlePaymentChange}
                                  name="enableStripe"
                                  color="primary"
                                />
                              }
                              label="Stripe"
                            />
                            {paymentSettings.enableStripe && (
                              <>
                                <TextField
                                  fullWidth
                                  label="Stripe Publishable Key"
                                  name="stripePublishableKey"
                                  value={paymentSettings.stripePublishableKey}
                                  onChange={handlePaymentChange}
                                  margin="normal"
                                  sx={{ mt: 2 }}
                                />
                                <TextField
                                  fullWidth
                                  label="Stripe Secret Key"
                                  name="stripeSecretKey"
                                  value={paymentSettings.stripeSecretKey}
                                  onChange={handlePaymentChange}
                                  margin="normal"
                                  type="password"
                                />
                              </>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tax Rate (%)"
                      name="taxRate"
                      type="number"
                      value={paymentSettings.taxRate}
                      onChange={handlePaymentChange}
                      margin="normal"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        inputProps: { min: 0, max: 100, step: 0.1 }
                      }}
                      helperText="Tax rate applied to orders"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Shipping Settings */}
            {tabValue === 2 && (
              <Box sx={{ py: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={shippingSettings.enableFreeShipping}
                          onChange={handleShippingChange}
                          name="enableFreeShipping"
                          color="primary"
                        />
                      }
                      label="Enable Free Shipping"
                    />
                    {shippingSettings.enableFreeShipping && (
                      <TextField
                        fullWidth
                        label="Free Shipping Threshold"
                        name="freeShippingThreshold"
                        type="number"
                        value={shippingSettings.freeShippingThreshold}
                        onChange={handleShippingChange}
                        margin="normal"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          inputProps: { min: 0 }
                        }}
                        helperText="Minimum order amount for free shipping"
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Flat Rate Shipping"
                      name="flatRateShipping"
                      type="number"
                      value={shippingSettings.flatRateShipping}
                      onChange={handleShippingChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 }
                      }}
                      helperText="Default shipping rate if no other options apply"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Shipping Options
                    </Typography>
                    <List>
                      {shippingSettings.shippingOptions.map((option, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={option.name}
                            secondary={`$${option.price} - Estimated delivery: ${option.estimatedDays} days`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleRemoveShippingOption(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Add New Shipping Option
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Option Name"
                            name="name"
                            value={shippingSettings.newShippingOption.name}
                            onChange={handleNewShippingOptionChange}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={shippingSettings.newShippingOption.price}
                            onChange={handleNewShippingOptionChange}
                            size="small"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                              inputProps: { min: 0, step: 0.01 }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Est. Days"
                            name="estimatedDays"
                            value={shippingSettings.newShippingOption.estimatedDays}
                            onChange={handleNewShippingOptionChange}
                            size="small"
                            placeholder="e.g. 1-3"
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddShippingOption}
                            sx={{ height: '100%' }}
                          >
                            <AddIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Email Settings */}
            {tabValue === 3 && (
              <Box sx={{ py: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Email Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="SMTP Host"
                      name="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={handleEmailChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="SMTP Port"
                      name="smtpPort"
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={handleEmailChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="SMTP Username"
                      name="smtpUser"
                      value={emailSettings.smtpUser}
                      onChange={handleEmailChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="SMTP Password"
                      name="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={handleEmailChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="From Email"
                      name="smtpFromEmail"
                      type="email"
                      value={emailSettings.smtpFromEmail}
                      onChange={handleEmailChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="From Name"
                      name="smtpFromName"
                      value={emailSettings.smtpFromName}
                      onChange={handleEmailChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Email Notifications
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={emailSettings.enableOrderConfirmation}
                              onChange={handleEmailChange}
                              name="enableOrderConfirmation"
                              color="primary"
                            />
                          }
                          label="Order Confirmation"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={emailSettings.enableShippingNotification}
                              onChange={handleEmailChange}
                              name="enableShippingNotification"
                              color="primary"
                            />
                          }
                          label="Shipping Notification"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={emailSettings.enableDeliveryNotification}
                              onChange={handleEmailChange}
                              name="enableDeliveryNotification"
                              color="primary"
                            />
                          }
                          label="Delivery Notification"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Notification Settings */}
            {tabValue === 4 && (
              <Box sx={{ py: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Admin Notification Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.notifyNewOrder}
                          onChange={handleNotificationChange}
                          name="notifyNewOrder"
                          color="primary"
                        />
                      }
                      label="Notify on New Order"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.notifyNewCustomer}
                          onChange={handleNotificationChange}
                          name="notifyNewCustomer"
                          color="primary"
                        />
                      }
                      label="Notify on New Customer"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.notifyLowStock}
                          onChange={handleNotificationChange}
                          name="notifyLowStock"
                          color="primary"
                        />
                      }
                      label="Notify on Low Stock"
                    />
                    {notificationSettings.notifyLowStock && (
                      <TextField
                        fullWidth
                        label="Low Stock Threshold"
                        name="lowStockThreshold"
                        type="number"
                        value={notificationSettings.lowStockThreshold}
                        onChange={handleNotificationChange}
                        margin="normal"
                        InputProps={{ inputProps: { min: 1 } }}
                        helperText="Notify when product quantity falls below this number"
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.notifyOutOfStock}
                          onChange={handleNotificationChange}
                          name="notifyOutOfStock"
                          color="primary"
                        />
                      }
                      label="Notify on Out of Stock"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.notifyNewReview}
                          onChange={handleNotificationChange}
                          name="notifyNewReview"
                          color="primary"
                        />
                      }
                      label="Notify on New Review"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}