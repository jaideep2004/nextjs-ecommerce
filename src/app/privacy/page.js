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
  Button,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';

export default function PrivacyPolicyPage() {
  // Last updated date
  const lastUpdated = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Home
          </MuiLink>
        </Link>
        <Typography color="text.primary">Privacy Policy</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Privacy Policy
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last Updated: {lastUpdated}
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Alert severity="info" sx={{ mb: 3 }}>
          This Privacy Policy complies with UK GDPR, Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR).
        </Alert>

        <Typography paragraph>
          India Inspired ("we", "our", "us") is committed to protecting and respecting your privacy. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data 
          when you visit our website or make a purchase. We are the data controller for the purposes 
          of UK data protection law.
        </Typography>

        <Typography paragraph>
          <strong>Data Controller Contact Information:</strong><br />
          India Inspired<br />
          123 High Street, London, UK<br />
          Email: privacy@indiainspired.com<br />
          Data Protection Officer: dpo@indiainspired.com<br />
          Phone: +44 (0) 20 1234 5678
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. What Personal Data We Collect
          </Typography>
          <Typography paragraph>
            We collect and process the following personal data about you:
          </Typography>
          <Typography variant="h6" gutterBottom>
            Identity Data
          </Typography>
          <Typography paragraph>
            Name, title, date of birth, and other personal identifiers.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Contact Data
          </Typography>
          <Typography paragraph>
            Email address, telephone numbers, billing and delivery addresses.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Financial Data
          </Typography>
          <Typography paragraph>
            Payment card details (processed by our secure payment providers - we don't store full card details).
          </Typography>
          <Typography variant="h6" gutterBottom>
            Transaction Data
          </Typography>
          <Typography paragraph>
            Details about payments to and from you, and other details of products and services you've purchased.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Technical Data
          </Typography>
          <Typography paragraph>
            IP address, browser type and version, device information, operating system, and other technology on devices used to access our website.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Usage Data
          </Typography>
          <Typography paragraph>
            Information about how you use our website, products and services.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Marketing and Communications Data
          </Typography>
          <Typography paragraph>
            Your preferences in receiving marketing from us and your communication preferences.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. How We Collect Your Personal Data
          </Typography>
          <Typography paragraph>
            We collect personal data through:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                <strong>Direct interactions:</strong> When you create an account, make a purchase, subscribe to our newsletter, or contact us.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Automated technologies:</strong> As you interact with our website, we may automatically collect technical data about your equipment and browsing actions using cookies and similar technologies.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Third parties:</strong> We may receive personal data from payment providers, delivery companies, and analytics providers.
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. Lawful Basis for Processing
          </Typography>
          <Typography paragraph>
            Under UK GDPR, we must have a lawful basis to process your personal data. We rely on:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                <strong>Contract:</strong> To perform our contract with you (processing orders, delivery, customer service)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Legitimate interests:</strong> For our business purposes like improving our services, fraud prevention, and direct marketing
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Consent:</strong> For marketing communications and cookies (where required)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Legal obligation:</strong> To comply with legal requirements (e.g., accounting records)
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            4. Your Rights Under UK GDPR
          </Typography>
          <Typography paragraph>
            Under UK data protection law, you have the following rights:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                <strong>Right of Access:</strong> You can request copies of your personal data and information about how we process it.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Right to Rectification:</strong> You can request correction of inaccurate or incomplete personal data.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Right to Erasure:</strong> You can request deletion of your personal data in certain circumstances.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Right to Restrict Processing:</strong> You can request that we limit how we use your personal data.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Right to Data Portability:</strong> You can request to receive your personal data in a machine-readable format.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Right to Object:</strong> You can object to processing based on legitimate interests or for direct marketing.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Right to Withdraw Consent:</strong> Where we rely on consent, you can withdraw it at any time.
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            To exercise any of these rights, please contact us at privacy@indiainspired.com. 
            We will respond to your request within one month. If you're not satisfied with our response, 
            you have the right to complain to the Information Commissioner's Office (ICO).
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            5. How Long We Keep Your Data
          </Typography>
          <Typography paragraph>
            We will only retain your personal data for as long as necessary to fulfil the purposes for which it was collected:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                <strong>Account data:</strong> Until you delete your account, plus 30 days for backup deletion
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Order data:</strong> 7 years for tax and accounting purposes as required by law
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Marketing data:</strong> Until you unsubscribe or object to marketing
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Website analytics:</strong> 26 months for Google Analytics data
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            6. International Transfers
          </Typography>
          <Typography paragraph>
            Some of our service providers are located outside the UK/EEA. When we transfer your personal data 
            to these countries, we ensure appropriate safeguards are in place, such as:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Standard Contractual Clauses approved by the European Commission
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Adequacy decisions by the UK government or European Commission
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Certification schemes or codes of conduct
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            7. Cookies and Tracking
          </Typography>
          <Typography paragraph>
            We use cookies and similar technologies in accordance with the Privacy and Electronic Communications Regulations (PECR). 
            Our cookies fall into these categories:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                <strong>Strictly Necessary:</strong> Essential for website operation (no consent required)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Functional:</strong> Remember your preferences and enhance functionality
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Analytics:</strong> Help us understand how visitors use our website
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>Marketing:</strong> Used to deliver relevant advertisements (consent required)
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            You can manage your cookie preferences through our cookie banner or your browser settings. 
            Withdrawing consent for cookies may affect website functionality.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            8. Data Security
          </Typography>
          <Typography paragraph>
            We have implemented appropriate technical and organisational security measures to protect your personal data against:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Accidental or unlawful destruction, loss, alteration, unauthorised disclosure or access
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Data breaches and cyber attacks
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Unauthorised or unlawful processing
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            Our security measures include encryption, access controls, regular security assessments, and staff training. 
            However, no electronic transmission or storage is 100% secure. If we detect a personal data breach that 
            is likely to result in a high risk to your rights and freedoms, we will notify you within 72 hours 
            as required by UK GDPR.
          </Typography>
        </Box>
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            9. How We Share Your Personal Data
          </Typography>
          <Typography paragraph>
            We may share your personal data with third parties in the following circumstances:
          </Typography>
          <Typography variant="h6" gutterBottom>
            Service Providers
          </Typography>
          <Typography paragraph>
            We work with trusted third-party service providers who process personal data on our behalf, including:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Payment processors (to handle transactions securely)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Delivery companies (to fulfill orders)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Email service providers (for marketing communications)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Analytics providers (to improve our website)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Customer service platforms (to provide support)
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            All service providers are bound by Data Processing Agreements that ensure they handle your data securely 
            and in accordance with UK GDPR requirements.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Legal Requirements
          </Typography>
          <Typography paragraph>
            We may disclose your personal data if required by law, regulation, legal process, or to protect our 
            rights, property, or safety, or that of others.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Business Transfers
          </Typography>
          <Typography paragraph>
            In the event of a merger, acquisition, or sale of assets, your personal data may be transferred to the 
            new entity. We will notify you of any such change and ensure your rights remain protected.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            10. Children's Privacy
          </Typography>
          <Typography paragraph>
            We do not knowingly collect, use, or disclose personal data from children under 13 years of age. 
            If we become aware that we have collected personal data from a child under 13, we will take steps 
            to delete such information as quickly as possible.
          </Typography>
          <Typography paragraph>
            If you are a parent or guardian and believe your child has provided us with personal data, 
            please contact us immediately at privacy@indiainspired.com.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            11. Changes to This Privacy Policy
          </Typography>
          <Typography paragraph>
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            technology, legal requirements, or other factors. We will notify you of any material changes 
            by posting the updated policy on our website and updating the "Last Updated" date.
          </Typography>
          <Typography paragraph>
            For significant changes that affect your rights, we may provide additional notice such as 
            email notification or prominent website notices. Your continued use of our services after 
            the changes take effect constitutes acceptance of the updated Privacy Policy.
          </Typography>
        </Box>
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            12. Contact Us
          </Typography>
          <Typography paragraph>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </Typography>
          <Typography paragraph>
            India Inspired<br />
            123 High Street, London, UK<br />
            Email: privacy@indiainspired.com<br />
            Data Protection Officer: dpo@indiainspired.com<br />
            Phone: +44 (0) 20 1234 5678
          </Typography>
          <Typography paragraph>
            <strong>Information Commissioner's Office (ICO):</strong><br />
            If you believe we have not handled your personal data in accordance with UK data protection law, 
            you have the right to lodge a complaint with the ICO at ico.org.uk or by calling 0303 123 1113.
          </Typography>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I access or update my personal information?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You can access and update your personal information by logging into your account and visiting your account profile page. If you need assistance, please contact our customer support team.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I opt out of marketing communications?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You can opt out of marketing communications by clicking the "unsubscribe" link in any marketing email we send you. You can also update your communication preferences in your account settings or contact our customer support team for assistance.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Do you sell my personal information to third parties?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                No, we do not sell your personal information to third parties. We may share your information with service providers who help us operate our business, but these providers are bound by contractual obligations to keep your information confidential and use it only for the purposes for which we disclose it to them.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do you protect my payment information?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We use industry-standard encryption and security measures to protect your payment information. We do not store your full credit card details on our servers. All payment transactions are processed through secure payment processors that comply with PCI DSS standards.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How long do you keep my personal information?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the data, the potential risk of harm from unauthorized use or disclosure, the purposes for which we process the data, and applicable legal requirements.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            component={Link}
            href="/contact"
          >
            Contact Us With Privacy Questions
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}