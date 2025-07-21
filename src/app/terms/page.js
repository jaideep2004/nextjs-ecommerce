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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function TermsPage() {
  // Last updated date
  const lastUpdated = 'January 15, 2023';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Home
          </MuiLink>
        </Link>
        <Typography color="text.primary">Terms & Conditions</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last Updated: {lastUpdated}
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Typography paragraph>
          Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this website.
        </Typography>
        <Typography paragraph>
          The term 'our company' or 'us' or 'we' refers to the owner of the website. The term 'you' refers to the user or viewer of our website.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Terms of Website Use
          </Typography>
          <Typography paragraph>
            The use of this website is subject to the following terms of use:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                The content of the pages of this website is for your general information and use only. It is subject to change without notice.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, personal information may be stored by us for use by third parties.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                All trademarks reproduced in this website, which are not the property of, or licensed to the operator, are acknowledged on the website.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. Product Information
          </Typography>
          <Typography paragraph>
            We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the website. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
          </Typography>
          <Typography paragraph>
            All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. Accuracy of Billing and Account Information
          </Typography>
          <Typography paragraph>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.
          </Typography>
          <Typography paragraph>
            You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            4. Optional Tools
          </Typography>
          <Typography paragraph>
            We may provide you with access to third-party tools over which we neither monitor nor have any control nor input. You acknowledge and agree that we provide access to such tools &quot;as is&quot; and "as available" without any warranties, representations, or conditions of any kind and without any endorsement.
          </Typography>
          <Typography paragraph>
            We shall have no liability whatsoever arising from or relating to your use of optional third-party tools. Any use by you of the optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            5. User Comments, Feedback, and Other Submissions
          </Typography>
          <Typography paragraph>
            If, at our request, you send certain specific submissions (for example contest entries) or without a request from us, you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
          </Typography>
          <Typography paragraph>
            We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments. We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            6. Personal Information
          </Typography>
          <Typography paragraph>
            Your submission of personal information through the store is governed by our Privacy Policy. To view our Privacy Policy, please see the link in the footer of our website.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            7. Errors, Inaccuracies, and Omissions
          </Typography>
          <Typography paragraph>
            Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies, or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times, and availability. We reserve the right to correct any errors, inaccuracies, or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order).
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            8. Prohibited Uses
          </Typography>
          <Typography paragraph>
            In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                (a) for any unlawful purpose;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (b) to solicit others to perform or participate in any unlawful acts;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (f) to submit false or misleading information;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (h) to collect or track the personal information of others;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (i) to spam, phish, pharm, pretext, spider, crawl, or scrape;
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (j) for any obscene or immoral purpose; or
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                (k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet.
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            9. Disclaimer of Warranties; Limitation of Liability
          </Typography>
          <Typography paragraph>
            We do not guarantee, represent, or warrant that your use of our service will be uninterrupted, timely, secure, or error-free. We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable. You agree that from time to time we may remove the service for indefinite periods of time or cancel the service at any time, without notice to you.
          </Typography>
          <Typography paragraph>
            You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered to you through the service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            10. Indemnification
          </Typography>
          <Typography paragraph>
            You agree to indemnify, defend and hold harmless our company and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            11. Severability
          </Typography>
          <Typography paragraph>
            In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            12. Termination
          </Typography>
          <Typography paragraph>
            The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes. These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.
          </Typography>
          <Typography paragraph>
            If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            13. Entire Agreement
          </Typography>
          <Typography paragraph>
            The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).
          </Typography>
          <Typography paragraph>
            Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            14. Governing Law
          </Typography>
          <Typography paragraph>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the country where our company is registered.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            15. Changes to Terms of Service
          </Typography>
          <Typography paragraph>
            You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            16. Contact Information
          </Typography>
          <Typography paragraph>
            Questions about the Terms of Service should be sent to us at support@yourdomain.com.
          </Typography>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I cancel an order?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You can cancel an order within 24 hours of placing it by contacting our customer service team. Once an order has been processed or shipped, it cannot be canceled, but you may return it according to our return policy.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What is your return policy?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We offer a 30-day return policy for most items. Products must be returned in their original condition and packaging. Some products, such as personalized items or intimate apparel, may not be eligible for return. Please see our Returns & Refunds page for more details.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do you protect my personal information?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We take data protection seriously and have implemented various security measures to protect your personal information. We use secure servers, encryption for payment processing, and strict access controls. For more information, please review our Privacy Policy.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Can I change or modify my order after it's placed?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Order modifications are possible within 2 hours of placing your order. After this time, our system begins processing orders for fulfillment, and changes cannot be guaranteed. Please contact customer service immediately if you need to make changes.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What payment methods do you accept?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We accept major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All payment information is encrypted and securely processed. We do not store your full credit card details on our servers.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>
    </Container>
  );
}