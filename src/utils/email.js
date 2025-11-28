import nodemailer from 'nodemailer';

// Create a transporter object
const createTransporter = () => {
  // Gmail SMTP configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jaisidhu2004@gmail.com',
      pass: 'ggpy nlwn izas qlrw'
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
    from: 'NextEcommerce <jaisidhu2004@gmail.com>',
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

/**
 * Send admin notification email when a new order is placed
 * @param {Object} options - Email options
 * @param {Object} options.user - Customer user object
 * @param {Object} options.order - Order details
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendAdminOrderNotification = async ({ user, order }) => {
  const subject = `🔔 New Order Received - Order #${order._id}`;
  
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
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">🔔 New Order Alert!</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">A new order has been placed on your store</p>
      </div>
      
      <div style="padding: 20px;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Order Information</h3>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order._id}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">${order.orderStatus}</span></p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p style="margin: 5px 0;"><strong>Paid:</strong> ${order.isPaid ? '✅ Yes' : '❌ No'}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Customer Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${user.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shippingAddress?.phone || 'Not provided'}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Shipping Address</h3>
          <p style="margin: 5px 0;">${order.shippingAddress?.fullName}</p>
          <p style="margin: 5px 0;">${order.shippingAddress?.address}</p>
          <p style="margin: 5px 0;">${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zipCode}</p>
          <p style="margin: 5px 0;">${order.shippingAddress?.country}</p>
        </div>
        
        <h3 style="color: #333; margin-bottom: 15px;">Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #e9ecef;">
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Product</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Price</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: right;">
          <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${order.itemsPrice.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Shipping:</strong> $${order.shippingPrice.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Tax:</strong> $${order.taxPrice.toFixed(2)}</p>
          <p style="margin: 10px 0 0 0; font-size: 20px; color: #28a745;"><strong>Total: $${order.totalPrice.toFixed(2)}</strong></p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #e7f3ff; border-left: 4px solid #007bff; border-radius: 4px;">
          <p style="margin: 0; color: #333;"><strong>Next Steps:</strong></p>
          <p style="margin: 5px 0 0 0; color: #666;">Please log in to your admin dashboard to process this order and update the customer with shipping information.</p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #ddd;">
        <p style="margin: 0; color: #666; font-size: 14px;">This is an automated notification from your NextEcommerce store.</p>
      </div>
    </div>
  `;
  
  const text = `
    🔔 NEW ORDER ALERT!
    
    Order Information:
    Order ID: ${order._id}
    Date: ${new Date(order.createdAt).toLocaleString()}
    Status: ${order.orderStatus}
    Payment Method: ${order.paymentMethod}
    Paid: ${order.isPaid ? 'Yes' : 'No'}
    
    Customer Information:
    Name: ${user.name}
    Email: ${user.email}
    Phone: ${order.shippingAddress?.phone || 'Not provided'}
    
    Shipping Address:
    ${order.shippingAddress?.fullName}
    ${order.shippingAddress?.address}
    ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zipCode}
    ${order.shippingAddress?.country}
    
    Order Total: $${order.totalPrice.toFixed(2)}
    
    Please log in to your admin dashboard to process this order.
  `;
  
  return await sendEmail({
    to: 'jaisidhu2004@gmail.com', // Admin email
    subject,
    text,
    html,
  });
};

/**
 * Send admin notification when order status is updated
 * @param {Object} options - Email options  
 * @param {Object} options.user - Customer user object
 * @param {Object} options.order - Order details
 * @param {string} options.oldStatus - Previous order status
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendAdminOrderStatusUpdate = async ({ user, order, oldStatus }) => {
  const subject = `📦 Order Status Updated - Order #${order._id}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">📦 Order Status Updated</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Order #${order._id} status has been changed</p>
      </div>
      
      <div style="padding: 20px;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Status Change</h3>
          <p style="margin: 5px 0;"><strong>From:</strong> <span style="background: #6c757d; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">${oldStatus}</span></p>
          <p style="margin: 5px 0;"><strong>To:</strong> <span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">${order.orderStatus}</span></p>
          <p style="margin: 5px 0;"><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Customer Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${user.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
          <p style="margin: 5px 0;"><strong>Order Total:</strong> $${order.totalPrice.toFixed(2)}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
          <p style="margin: 0; color: #333;"><strong>✅ Customer Notified:</strong></p>
          <p style="margin: 5px 0 0 0; color: #666;">The customer has been automatically notified about this status change via email.</p>
        </div>
      </div>
    </div>
  `;
  
  const text = `
    📦 ORDER STATUS UPDATED
    
    Order #${order._id} status has been changed:
    From: ${oldStatus}
    To: ${order.orderStatus}
    Updated: ${new Date().toLocaleString()}
    
    Customer: ${user.name} (${user.email})
    Order Total: $${order.totalPrice.toFixed(2)}
    
    The customer has been automatically notified about this status change.
  `;
  
  return await sendEmail({
    to: 'jaisidhu2004@gmail.com', // Admin email
    subject,
    text,
    html,
  });
};
