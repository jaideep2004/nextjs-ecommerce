import nodemailer from 'nodemailer';

// Create a transporter object
const createTransporter = () => {
  // For development, use a test account
  // In production, you would use real SMTP credentials
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version of email
 * @param {string} options.html - HTML version of email
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendEmail = async (options) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'NextEcommerce <noreply@nextecommerce.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Send an order confirmation email
 * @param {Object} options - Email options
 * @param {Object} options.user - User object with email and name
 * @param {Object} options.order - Order details
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendOrderConfirmation = async ({ user, order }) => {
  const subject = `Order Confirmation - Order #${order._id}`;
  
  // Format order items for email
  const itemsList = order.orderItems.map(item => {
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `;
  }).join('');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you for your order, ${user.name}!</h2>
      <p>We've received your order and are working on it right away.</p>
      
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> ${order.orderStatus}</p>
      
      <h3>Items:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>
      
      <div style="margin-top: 20px; text-align: right;">
        <p><strong>Subtotal:</strong> $${order.itemsPrice.toFixed(2)}</p>
        <p><strong>Shipping:</strong> $${order.shippingPrice.toFixed(2)}</p>
        <p><strong>Tax:</strong> $${order.taxPrice.toFixed(2)}</p>
        <p style="font-size: 18px;"><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>If you have any questions about your order, please contact our customer service team.</p>
        <p>Thank you for shopping with us!</p>
      </div>
    </div>
  `;
  
  const text = `
    Thank you for your order, ${user.name}!
    
    Order Details:
    Order ID: ${order._id}
    Date: ${new Date(order.createdAt).toLocaleString()}
    Status: ${order.orderStatus}
    
    Total: $${order.totalPrice.toFixed(2)}
    
    Thank you for shopping with us!
  `;
  
  return await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Send an order status update email
 * @param {Object} options - Email options
 * @param {Object} options.user - User object with email and name
 * @param {Object} options.order - Order details
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendOrderStatusUpdate = async ({ user, order }) => {
  const subject = `Order Status Update - Order #${order._id}`;
  
  let statusMessage = '';
  switch (order.orderStatus) {
    case 'Processing':
      statusMessage = 'We are currently processing your order.';
      break;
    case 'Shipped':
      statusMessage = `Your order has been shipped! ${order.trackingNumber ? `Tracking number: ${order.trackingNumber}` : ''} ${order.trackingUrl ? `Track your package here: ${order.trackingUrl}` : ''}`;
      break;
    case 'Delivered':
      statusMessage = 'Your order has been delivered. We hope you enjoy your purchase!';
      break;
    case 'Cancelled':
      statusMessage = 'Your order has been cancelled. If you have any questions, please contact our customer service.';
      break;
    default:
      statusMessage = `Your order status has been updated to: ${order.orderStatus}`;
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Status Update</h2>
      <p>Hello ${user.name},</p>
      <p>${statusMessage}</p>
      
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> ${order.orderStatus}</p>
      ${order.statusNote ? `<p><strong>Note:</strong> ${order.statusNote}</p>` : ''}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>If you have any questions about your order, please contact our customer service team.</p>
        <p>Thank you for shopping with us!</p>
      </div>
    </div>
  `;
  
  const text = `
    Order Status Update
    
    Hello ${user.name},
    ${statusMessage}
    
    Order Details:
    Order ID: ${order._id}
    Date: ${new Date(order.createdAt).toLocaleString()}
    Status: ${order.orderStatus}
    ${order.statusNote ? `Note: ${order.statusNote}` : ''}
    
    Thank you for shopping with us!
  `;
  
  return await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};