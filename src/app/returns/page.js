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
  Alert,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UndoIcon from '@mui/icons-material/Undo';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

export default function ReturnsPage() {
  const theme = useTheme();
  // Last updated date
  const lastUpdated = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  const returnSteps = [
    {
      label: 'Contact Us',
      description: 'Email us at returns@indiainspired.com within 30 days of delivery with your order number and reason for return.',
    },
    {
      label: 'Receive Return Authorization',
      description: 'We\'ll provide you with a return authorization number and return shipping label (free for UK returns).',
    },
    {
      label: 'Package Your Items',
      description: 'Pack items securely in original packaging with all tags attached. Include the return form.',
    },
    {
      label: 'Ship Your Return',
      description: 'Use our prepaid return label or arrange your own shipping. We recommend using tracked services.',
    },
    {
      label: 'Processing & Refund',
      description: 'Once received, we\'ll inspect items and process your refund within 5-7 business days.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Home
          </MuiLink>
        </Link>
        <Typography color="text.primary">Returns & Refunds</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <UndoIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Returns & Refunds Policy
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last Updated: {lastUpdated}
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Alert severity="info" sx={{ mb: 4 }}>
          This returns policy complies with UK Consumer Rights Act 2015, Consumer Contracts Regulations 2013, 
          and UK GDPR requirements for data protection.
        </Alert>

        <Typography paragraph>
          We want you to be completely satisfied with your purchase. If you're not happy with your order, 
          we offer easy returns and exchanges in accordance with UK consumer rights legislation.
        </Typography>

        {/* Your Rights */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Consumer Rights
          </Typography>
          <Typography paragraph>
            Under UK law, you have specific rights when shopping online:
          </Typography>
          <Grid container spacing={3} style={{flexWrap: 'nowrap'}}>
            <Grid item xs={12} md={4} >
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <VerifiedUserIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    14-Day Cooling Off Period
                  </Typography>
                  <Typography variant="body2">
                    Right to cancel and return items within 14 days of delivery for any reason
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <UndoIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    30-Day Return Window
                  </Typography>
                  <Typography variant="body2">
                    Our extended 30-day return policy for your convenience (beyond legal requirements)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MoneyOffIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Full Refund Guarantee
                  </Typography>
                  <Typography variant="body2">
                    Full refund including original shipping costs (return shipping may apply)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Return Process */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            How to Return Items
          </Typography>
          <Stepper orientation="vertical">
            {returnSteps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Return Conditions */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Return Conditions
          </Typography>
          <Typography paragraph>
            To be eligible for a return, items must meet the following criteria:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Items must be returned within 30 days of delivery
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Items must be unworn, unwashed, and in original condition
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                All original tags and labels must be attached
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Items must be returned in original packaging where possible
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Custom or personalized items cannot be returned unless faulty
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Underwear and intimate apparel cannot be returned for hygiene reasons
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        {/* Refund Information */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Refunds & Processing Times
          </Typography>
          <Typography paragraph>
            Once we receive and inspect your returned items, we'll process your refund:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                <strong>Inspection:</strong> We'll inspect returned items within 2-3 business days of receipt
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Refund Processing:</strong> Approved refunds are processed within 5-7 business days
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Bank Processing:</strong> Your bank may take 3-5 additional business days to show the refund
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Original Payment Method:</strong> Refunds are issued to the original payment method used
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        {/* Exchanges */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Exchanges
          </Typography>
          <Typography paragraph>
            We're happy to exchange items for different sizes or colors, subject to availability. 
            To request an exchange:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Contact us to check availability of your preferred size/color
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Follow the same return process but specify "exchange" in your return request
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                We'll send your replacement item once we receive your return
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        {/* Data Protection */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Data During Returns
          </Typography>
          <Typography paragraph>
            In compliance with UK GDPR and Data Protection Act 2018, we handle your personal data during 
            the returns process as follows:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                We collect only necessary information to process your return (order details, return reason, contact information)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Return communications are retained for 7 years for accounting and tax purposes
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Your data is never shared with third parties except our shipping partners for return processing
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                You can request deletion of your return data after the statutory retention period
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        {/* Faulty Items */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Faulty or Damaged Items
          </Typography>
          <Typography paragraph>
            If you receive a faulty or damaged item, you have additional rights under UK consumer law:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                <strong>Short-term right to reject:</strong> Full refund within 30 days if item is faulty
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Right to repair or replacement:</strong> We'll repair or replace faulty items free of charge
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Right to price reduction or final refund:</strong> If repair/replacement isn't possible
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            For faulty items, please contact us immediately with photos of the issue. We'll arrange 
            collection and replacement at no cost to you.
          </Typography>
        </Box>

        {/* FAQs */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Returns FAQs
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Do I have to pay for return shipping?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                For UK returns, we provide free return shipping labels. For international returns, 
                you're responsible for return shipping costs unless the item is faulty or we sent 
                the wrong item.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Can I return sale items?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes, sale items can be returned within 30 days following the same conditions as 
                regular-priced items. Your consumer rights under UK law apply to all purchases.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What if I've lost my receipt or order confirmation?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                No problem! We can look up your order using your email address or phone number. 
                This doesn't affect your right to return items.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How long do I have to return items?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You have 30 days from delivery to return items, which exceeds the 14-day cooling-off 
                period required by UK law. For faulty items, you have up to 6 months to report issues.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Can I return items to a physical store?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Currently, we operate online only. All returns must be shipped back to us using 
                our returns process. We provide free return shipping labels for UK customers.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Contact Information */}
        <Box sx={{ my: 4, p: 3, bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'grey.50', borderRadius: 2, border: theme.palette.mode === 'dark' ? '1px solid rgba(162, 146, 120, 0.3)' : 'none' }}>
          <Typography variant="h6" gutterBottom>
            Returns Contact Information
          </Typography>
          <Typography paragraph>
            For returns, refunds, or any questions about our returns policy:
          </Typography>
          <Typography paragraph>
            <strong>Returns Email:</strong> returns@indiainspired.com<br />
            <strong>Customer Service:</strong> info@indiainspired.com<br />
            <strong>Phone:</strong> +44 (0) 20 1234 5678<br />
            <strong>Hours:</strong> Monday to Friday, 9:00 AM - 5:00 PM GMT
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please include your order number and detailed description of the issue when contacting us.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}