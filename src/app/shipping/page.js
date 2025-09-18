'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';

export default function ShippingPage() {
  const theme = useTheme();
  // Last updated date
  const lastUpdated = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  const shippingOptions = [
    {
      name: 'Standard Delivery',
      time: '5-7 business days',
      cost: 'Free over £50, otherwise £4.99',
      icon: <LocalShippingIcon />
    },
    {
      name: 'Express Delivery',
      time: '2-3 business days',
      cost: '£9.99',
      icon: <AccessTimeIcon />
    },
    {
      name: 'International Shipping',
      time: '7-14 business days',
      cost: 'Varies by destination',
      icon: <PublicIcon />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Home
          </MuiLink>
        </Link>
        <Typography color="text.primary">Shipping Information</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocalShippingIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Shipping Information
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last Updated: {lastUpdated}
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Typography paragraph>
          We strive to deliver your orders quickly and safely. Please review our shipping policies and delivery options below.
        </Typography>

        {/* Shipping Options */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Delivery Options
          </Typography>
          <Grid container spacing={3}>
            {shippingOptions.map((option, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {option.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {option.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {option.time}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {option.cost}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Delivery Information */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Delivery Information
          </Typography>
          <Typography paragraph>
            All orders are processed within 1-2 business days (Monday to Friday, excluding bank holidays). 
            Orders placed on weekends will be processed on the next business day.
          </Typography>
          <Typography paragraph>
            We use trusted courier services including Royal Mail, DPD, and Hermes for UK deliveries. 
            For international orders, we work with DHL and FedEx to ensure reliable delivery.
          </Typography>
        </Box>

        {/* Geographic Coverage */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Geographic Coverage
          </Typography>
          <Typography paragraph>
            <strong>United Kingdom:</strong> We deliver to all UK addresses including Northern Ireland. 
            Some remote Scottish islands may require additional delivery time.
          </Typography>
          <Typography paragraph>
            <strong>International:</strong> We ship to most countries worldwide. Please note that international 
            customers are responsible for any customs duties, taxes, or fees imposed by their country.
          </Typography>
        </Box>

        {/* Privacy and Data Protection */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Privacy and Your Data
          </Typography>
          <Typography paragraph>
            In accordance with UK GDPR and Data Protection Act 2018, we collect and process your shipping 
            information solely for the purpose of fulfilling your order. This includes:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Your name and delivery address for shipping purposes
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Phone number for delivery notifications and courier contact
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Email address for tracking updates and delivery confirmations
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            We share this information only with our delivery partners and only to the extent necessary 
            for delivery. We do not retain shipping data longer than necessary for order fulfillment and 
            customer service purposes (typically 7 years for tax and accounting requirements).
          </Typography>
        </Box>

        {/* Frequently Asked Questions */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Shipping FAQs
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Do you offer free shipping?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes, we offer free standard shipping on all UK orders over £50. For orders under £50, 
                standard shipping costs £4.99.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Can I track my order?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes, once your order ships, you'll receive a tracking number via email. You can track 
                your package on our website or directly with the courier service.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What if I'm not home for delivery?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Most couriers will attempt delivery 2-3 times and may leave packages with neighbors 
                or at a local collection point. You'll receive notifications about delivery attempts 
                and collection options.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Do you ship internationally?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by 
                destination. International customers are responsible for any customs duties or taxes.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What about damaged or lost packages?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                All our shipments are insured. If your package is damaged or lost in transit, please 
                contact us immediately. We'll work with the courier to resolve the issue and ensure 
                you receive your order.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Contact Information */}
        <Box sx={{ my: 4, p: 3, bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'grey.50', borderRadius: 2, border: theme.palette.mode === 'dark' ? '1px solid rgba(162, 146, 120, 0.3)' : 'none' }}>
          <Typography variant="h6" gutterBottom>
            Need Help with Your Delivery?
          </Typography>
          <Typography paragraph>
            If you have questions about shipping or need to make special delivery arrangements, 
            please contact our customer service team:
          </Typography>
          <Typography paragraph>
            <strong>Email:</strong> info@indiainspired.com<br />
            <strong>Phone:</strong> +44 (0) 20 1234 5678<br />
            <strong>Hours:</strong> Monday to Friday, 9:00 AM - 5:00 PM GMT
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}