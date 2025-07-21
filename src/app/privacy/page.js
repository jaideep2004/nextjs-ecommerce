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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';

export default function PrivacyPolicyPage() {
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

        <Typography paragraph>
          At our company, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Collection of Your Information
          </Typography>
          <Typography paragraph>
            We may collect information about you in a variety of ways. The information we may collect via the website includes:
          </Typography>
          <Typography variant="h6" gutterBottom>
            Personal Data
          </Typography>
          <Typography paragraph>
            Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the website or when you choose to participate in various activities related to the website. You are under no obligation to provide us with personal information of any kind, however your refusal to do so may prevent you from using certain features of the website.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Derivative Data
          </Typography>
          <Typography paragraph>
            Information our servers automatically collect when you access the website, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the website.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Financial Data
          </Typography>
          <Typography paragraph>
            Financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the website. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor and you are encouraged to review their privacy policy and contact them directly for responses to your questions.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Mobile Device Data
          </Typography>
          <Typography paragraph>
            Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the website from a mobile device.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Data From Contests, Giveaways, and Surveys
          </Typography>
          <Typography paragraph>
            Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. Use of Your Information
          </Typography>
          <Typography paragraph>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the website to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Create and manage your account.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Process your orders and manage your transactions.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Email you regarding your account or order.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Fulfill and manage purchases, orders, payments, and other transactions related to the website.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Send you a newsletter with product updates, special offers, and related information.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the website to you.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Administer sweepstakes, promotions, and contests.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Compile anonymous statistical data and analysis for use internally or with third parties.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Increase the efficiency and operation of the website.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Monitor and analyze usage and trends to improve your experience with the website.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Notify you of updates to the website.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Request feedback and contact you about your use of the website.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Resolve disputes and troubleshoot problems.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Respond to product and customer service requests.
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. Disclosure of Your Information
          </Typography>
          <Typography paragraph>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </Typography>
          <Typography variant="h6" gutterBottom>
            By Law or to Protect Rights
          </Typography>
          <Typography paragraph>
            If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection and credit risk reduction.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Third-Party Service Providers
          </Typography>
          <Typography paragraph>
            We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Marketing Communications
          </Typography>
          <Typography paragraph>
            With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Interactions with Other Users
          </Typography>
          <Typography paragraph>
            If you interact with other users of the website, those users may see your name, profile photo, and descriptions of your activity, including sending invitations to other users, chatting with other users, liking posts, following blogs.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Online Postings
          </Typography>
          <Typography paragraph>
            When you post comments, contributions or other content to the website, your posts may be viewed by all users and may be publicly distributed outside the website in perpetuity.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Business Transfers
          </Typography>
          <Typography paragraph>
            We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            4. Tracking Technologies
          </Typography>
          <Typography variant="h6" gutterBottom>
            Cookies and Web Beacons
          </Typography>
          <Typography paragraph>
            We may use cookies, web beacons, tracking pixels, and other tracking technologies on the website to help customize the website and improve your experience. When you access the website, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the website. You may not decline web beacons. However, they can be rendered ineffective by declining all cookies or by modifying your web browser's settings to notify you each time a cookie is tendered, permitting you to accept or decline cookies on an individual basis.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Internet-Based Advertising
          </Typography>
          <Typography paragraph>
            Additionally, we may use third-party software to serve ads on the website, implement email marketing campaigns, and manage other interactive marketing initiatives. This third-party software may use cookies or similar tracking technology to help manage and optimize your online experience with us. For more information about opting-out of interest-based ads, visit the Network Advertising Initiative Opt-Out Tool or Digital Advertising Alliance Opt-Out Tool.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            5. Third-Party Websites
          </Typography>
          <Typography paragraph>
            The website may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the website, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information. We are not responsible for the content or privacy and security practices and policies of any third parties, including other sites, services or applications that may be linked to or from the website.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            6. Security of Your Information
          </Typography>
          <Typography paragraph>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            7. Policy for Children
          </Typography>
          <Typography paragraph>
            We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            8. Controls for Do-Not-Track Features
          </Typography>
          <Typography paragraph>
            Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Policy.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            9. Options Regarding Your Information
          </Typography>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Typography paragraph>
            You may at any time review or change the information in your account or terminate your account by:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Logging into your account settings and updating your account
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Contacting us using the contact information provided below
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Emails and Communications
          </Typography>
          <Typography paragraph>
            If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:
          </Typography>
          <List>
            <ListItem>
              <ListItemText>
                Noting your preferences at the time you register your account with the website
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Logging into your account settings and updating your preferences
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Contacting us using the contact information provided below
              </ListItemText>
            </ListItem>
          </List>
          <Typography paragraph>
            If you no longer wish to receive correspondence, emails, or other communications from third parties, you are responsible for contacting the third party directly.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            10. California Privacy Rights
          </Typography>
          <Typography paragraph>
            California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
          </Typography>
          <Typography paragraph>
            If you are under 18 years of age, reside in California, and have a registered account with the website, you have the right to request removal of unwanted data that you publicly post on the website. To request removal of such data, please contact us using the contact information provided below, and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the website, but please be aware that the data may not be completely or comprehensively removed from our systems.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            11. Contact Us
          </Typography>
          <Typography paragraph>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </Typography>
          <Typography paragraph>
            Our Company<br />
            123 Main Street<br />
            Anytown, ST 12345<br />
            Email: privacy@yourdomain.com<br />
            Phone: (123) 456-7890
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