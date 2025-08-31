'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching customers with params:', { page, rowsPerPage, statusFilter, sortBy, sortOrder, searchQuery });
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1, // API uses 1-indexed pages
        limit: rowsPerPage,
        sortBy,
        sortOrder,
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      const url = `/api/admin/customers?${params.toString()}`;
      console.log('Fetching customers from URL:', url);
      
      const response = await axios.get(url);
      console.log('Full API response:', response.data);
      
      // The API is now consistently returning { status, data, message, timestamp }
      // where data contains { customers, totalCustomers }
      if (response.data && response.data.data) {
        const apiData = response.data.data;
        console.log('API data object:', apiData);
        
        // Log customers object type and structure
        console.log('Customers data type:', Array.isArray(apiData.customers) ? 'Array' : typeof apiData.customers);
        console.log('Customers data length:', Array.isArray(apiData.customers) ? apiData.customers.length : 'N/A');
        
        if (Array.isArray(apiData.customers)) {
          console.log('Found customers array with length:', apiData.customers.length);
          // Sample the first customer if available
          if (apiData.customers.length > 0) {
            console.log('Sample customer data:', apiData.customers[0]);
          }
          setCustomers(apiData.customers);
          setTotalCustomers(apiData.totalCustomers || 0);
        } else {
          console.error('API data does not contain customers array:', apiData);
          setCustomers([]);
          setTotalCustomers(0);
        }
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('Received unexpected data format from server');
        setCustomers([]);
        setTotalCustomers(0);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0); // Reset to first page when filtering
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0); // Reset to first page when sorting
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(0); // Reset to first page when changing sort order
  };

  const handleOpenDialog = (customer, action) => {
    setSelectedCustomer(customer);
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);
      console.log('Performing action:', dialogAction, 'on customer:', selectedCustomer._id);
      
      let endpoint = '';
      let method = 'PUT';
      let successMessage = '';
      
      switch (dialogAction) {
        case 'block':
          endpoint = `/api/admin/customers/${selectedCustomer._id}/block`;
          successMessage = `${selectedCustomer.name} has been blocked`;
          break;
        case 'unblock':
          endpoint = `/api/admin/customers/${selectedCustomer._id}/unblock`;
          successMessage = `${selectedCustomer.name} has been unblocked`;
          break;
        case 'delete':
          endpoint = `/api/admin/customers/${selectedCustomer._id}`;
          method = 'DELETE';
          successMessage = `${selectedCustomer.name} has been deleted`;
          break;
        default:
          throw new Error('Invalid action');
      }
      
      console.log('Sending request to:', endpoint, 'with method:', method);
      
      if (method === 'DELETE') {
        await axios.delete(endpoint);
      } else {
        await axios.put(endpoint);
      }
      
      console.log('Action completed successfully');
      
      // Refresh customer list
      await fetchCustomers();
      
      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success',
      });
    } catch (err) {
      console.error(`Error performing ${dialogAction} action:`, err);
      setSnackbar({
        open: true,
        message: err.message || `Failed to ${dialogAction} customer`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#2c3e50',
            mb: 1,
          }}
        >
          Customers Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage customer accounts, orders, and support requests
        </Typography>
      </Box>

  const handleConfirmAction = async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);
      console.log('Performing action:', dialogAction, 'on customer:', selectedCustomer._id);
      
      let endpoint = '';
      let method = 'PUT';
      let successMessage = '';
      
      switch (dialogAction) {
        case 'block':
          endpoint = `/api/admin/customers/${selectedCustomer._id}/block`;
          successMessage = `${selectedCustomer.name} has been blocked`;
          break;
        case 'unblock':
          endpoint = `/api/admin/customers/${selectedCustomer._id}/unblock`;
          successMessage = `${selectedCustomer.name} has been unblocked`;
          break;
        case 'delete':
          endpoint = `/api/admin/customers/${selectedCustomer._id}`;
          method = 'DELETE';
          successMessage = `${selectedCustomer.name} has been deleted`;
          break;
        default:
          throw new Error('Invalid action');
      }
      
      console.log('Sending request to:', endpoint, 'with method:', method);
      
      if (method === 'DELETE') {
        await axios.delete(endpoint);
      } else {
        await axios.put(endpoint);
      }
      
      console.log('Action completed successfully');
      
      // Refresh customer list
      await fetchCustomers();
      
      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success',
      });
    } catch (err) {
      console.error(`Error performing ${dialogAction} action:`, err);
      setSnackbar({
        open: true,
        message: err.message || `Failed to ${dialogAction} customer`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
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
              <Typography color="text.primary">Customers</Typography>
            </Breadcrumbs>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
              Customers Management
            </Typography>

            {/* Filters and Search */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', flexGrow: 1 }}>
                <TextField
                  label="Search Customers"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, Email, Phone"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: { xs: '100%', sm: 300 } }}
                />
              </form>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  <MenuItem value="createdAt">Registration Date</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="orderCount">Order Count</MenuItem>
                  <MenuItem value="totalSpent">Total Spent</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="sort-order-label">Order</InputLabel>
                <Select
                  labelId="sort-order-label"
                  value={sortOrder}
                  label="Order"
                  onChange={handleSortOrderChange}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>

            {loading && !error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Registered</TableCell>
                        <TableCell>Orders</TableCell>
                        <TableCell>Total Spent</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customers && customers.length > 0 ? (
                        customers.map((customer) => {
                          console.log('Rendering customer:', customer);
                          return (
                            <TableRow key={customer._id || Math.random()}>
                              <TableCell>{customer.name || 'Unknown'}</TableCell>
                              <TableCell>{customer.email || 'No Email'}</TableCell>
                              <TableCell>{customer.createdAt ? formatDate(customer.createdAt) : 'N/A'}</TableCell>
                            <TableCell>
                              <Chip 
                                label={customer.orderCount || 0} 
                                size="small" 
                                sx={{ bgcolor: '#EFEBE9' }}
                              />
                            </TableCell>
                            <TableCell>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(customer.totalSpent || 0)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={customer.isBlocked ? 'Blocked' : 'Active'}
                                size="small"
                                sx={{
                                  bgcolor: customer.isBlocked ? '#FFEBEE' : '#E8F5E9',
                                  color: customer.isBlocked ? '#C62828' : '#2E7D32',
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                color="primary"
                                onClick={() => router.push(`/admin/customers/${customer._id}`)}
                                size="small"
                                title="View Details"
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                              {customer.isBlocked ? (
                                <IconButton
                                  color="success"
                                  onClick={() => handleOpenDialog(customer, 'unblock')}
                                  size="small"
                                  title="Unblock Customer"
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                <IconButton
                                  color="warning"
                                  onClick={() => handleOpenDialog(customer, 'block')}
                                  size="small"
                                  title="Block Customer"
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                color="error"
                                onClick={() => handleOpenDialog(customer, 'delete')}
                                size="small"
                                title="Delete Customer"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No customers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={totalCustomers}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === 'block' && 'Block Customer'}
          {dialogAction === 'unblock' && 'Unblock Customer'}
          {dialogAction === 'delete' && 'Delete Customer'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'block' && (
              <>Are you sure you want to block <strong>{selectedCustomer?.name}</strong>? They will not be able to log in or place orders.</>  
            )}
            {dialogAction === 'unblock' && (
              <>Are you sure you want to unblock <strong>{selectedCustomer?.name}</strong>? They will regain full access to their account.</>  
            )}
            {dialogAction === 'delete' && (
              <>
                Are you sure you want to delete <strong>{selectedCustomer?.name}</strong>? This action cannot be undone.
                {selectedCustomer?.orderCount > 0 && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    Warning: This customer has {selectedCustomer.orderCount} orders. Deleting this customer may affect order history.
                  </Typography>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            color={dialogAction === 'delete' ? 'error' : dialogAction === 'unblock' ? 'success' : 'warning'} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              dialogAction === 'block' ? 'Block' : 
              dialogAction === 'unblock' ? 'Unblock' : 'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>

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