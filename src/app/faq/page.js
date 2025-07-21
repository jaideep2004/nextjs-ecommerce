'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  AssignmentReturn as ReturnIcon,
  ShoppingCart as CartIcon,
  AccountCircle as AccountIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // FAQ categories
  const categories = [
    { label: 'All', icon: <HelpIcon /> },
    { label: 'Orders', icon: <ShoppingCart /> },
    { label: 'Shipping', icon: <ShippingIcon /> },
    { label: 'Returns', icon: <ReturnIcon /> },
    { label: 'Payment', icon: <PaymentIcon /> },
    { label: 'Account', icon: <AccountIcon /> },
  ];

  // FAQ data
  const faqData = [
    {
      category: 'Orders',
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, select the items you want, add them to your cart, and proceed to checkout. Follow the steps to provide shipping and payment information, then confirm your order.'
    },
    {
      category: 'Orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it by contacting our customer service team. After this time, your order may have already been processed for shipping and cannot be modified or canceled.'
    },
    {
      category: 'Orders',
      question: 'How can I check the status of my order?',
      answer: 'You can check the status of your order by logging into your account and visiting the "My Orders" section. There, you\'ll find information about your order status, tracking number, and estimated delivery date.'
    },
    {
      category: 'Shipping',
      question: 'What shipping methods do you offer?',
      answer: 'We offer several shipping methods including Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Next Day Delivery (1 business day, order must be placed before 12 PM).'
    },
    {
      category: 'Shipping',
      question: 'How much does shipping cost?',
      answer: 'Shipping costs vary based on the shipping method, destination, and order value. Standard Shipping is free for orders over $50. You can see the exact shipping cost during checkout before completing your purchase.'
    },
    {
      category: 'Shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.'
    },
    {
      category: 'Returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be unused, in their original packaging, and in the same condition you received them. Some products, such as personalized items or intimate apparel, may not be eligible for return.'
    },
    {
      category: 'Returns',
      question: 'How do I return an item?',
      answer: 'To return an item, log into your account, go to "My Orders," select the order containing the item you wish to return, and follow the return instructions. You\'ll receive a return shipping label and instructions on how to package and send your return.'
    },
    {
      category: 'Returns',
      question: 'How long does it take to process a refund?',
      answer: 'Once we receive your return, it takes 1-2 business days to inspect the item and process your refund. After processing, it may take an additional 3-5 business days for the refund to appear in your account, depending on your payment method.'
    },
    {
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payment information is encrypted and securely processed.'
    },
    {
      category: 'Payment',
      question: 'Is it safe to use my credit card on your website?',
      answer: 'Yes, our website uses industry-standard SSL encryption to protect your personal and payment information. We are PCI DSS compliant and never store your full credit card details on our servers.'
    },
    {
      category: 'Payment',
      question: 'Do you offer any financing options?',
      answer: 'Yes, we offer financing options through Affirm and Klarna for eligible purchases. You can select these payment options during checkout to see if you qualify and view the available payment plans.'
    },
    {
      category: 'Account',
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking the "Sign Up" or "Register" button in the top right corner of our website. You\'ll need to provide your email address, create a password, and fill in some basic information.'
    },
    {
      category: 'Account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'To reset your password, click on the "Login" button, then select "Forgot Password." Enter the email address associated with your account, and we\'ll send you instructions to reset your password.'
    },
    {
      category: 'Account',
      question: 'How do I update my account information?',
      answer: 'You can update your account information by logging into your account and navigating to the "Account Settings" or "Profile" section. There, you can edit your personal information, change your password, and update your shipping and billing addresses.'
    },
  ];

  // Filter FAQs based on search query and active tab
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 0 || faq.category === categories[activeTab].label;
    return matchesSearch && matchesCategory;
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Home
          </MuiLink>
        </Link>
        <Typography color="text.primary">Frequently Asked Questions</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Frequently Asked Questions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Find answers to common questions about our products, orders, shipping, returns, and more.
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 5 }}>
          <TextField
            fullWidth
            placeholder="Search for answers..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Category Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 4 }}
        >
          {categories.map((category, index) => (
            <Tab 
              key={index} 
              label={category.label} 
              icon={category.icon} 
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Divider sx={{ mb: 4 }} />

        {/* FAQ Accordions */}
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter to find what you're looking for.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Contact Section */}
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h5" gutterBottom align="center">
          Couldn't Find Your Answer?
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Our customer support team is here to help you with any questions you may have.
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                component={Link}
                href="/contact"
                size="large"
                sx={{ py: 1.5 }}
              >
                Contact Us
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                fullWidth
                component="a"
                href="mailto:support@yourdomain.com"
                size="large"
                sx={{ py: 1.5 }}
              >
                Email Support
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Our support team is available Monday through Friday, 9 AM to 6 PM EST.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We typically respond to inquiries within 24 hours.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}