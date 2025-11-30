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
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Thank You for Your Order!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">We're excited to fulfill your purchase</p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 10px 0;">Hello ${user.name}!</h2>
          <p style="color: #666; margin: 0;">We've received your order and are working on it right away.</p>
        </div>
        
        <div style="background-color: #f1f3f4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Order Details</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order ID</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${order._id}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order Date</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Status</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px; color: #28a745;">${order.orderStatus}</p>
            </div>
          </div>
        </div>
        
        <h3 style="color: #333; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #eee;">Items Purchased</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #e9ecef;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Product</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">Quantity</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Subtotal:</span>
                <span style="font-weight: bold;">$${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Shipping:</span>
                <span style="font-weight: bold;">$${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Tax:</span>
                <span style="font-weight: bold;">$${order.taxPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                <span style="font-size: 18px; font-weight: bold;">Total:</span>
                <span style="font-size: 18px; font-weight: bold; color: #28a745;">$${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center; padding: 20px; background-color: #e8f4ff; border-radius: 8px;">
          <p style="margin: 0; color: #333; font-weight: bold;">Questions about your order?</p>
          <p style="margin: 10px 0 0 0; color: #666;">Our customer service team is here to help</p>
        </div>
      </div>
      
      <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">Thank you for shopping with us!</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">© ${new Date().getFullYear()} NextEcommerce. All rights reserved.</p>
      </div>
    </div>
  `;
  
  const text = `
=============================================
    THANK YOU FOR YOUR ORDER!
=============================================

Hello ${user.name}!

We've received your order and are working on it right away.

ORDER DETAILS:
─────────────────────────────────────────────
Order ID:     ${order._id}
Order Date:   ${new Date(order.createdAt).toLocaleDateString()}
Status:       ${order.orderStatus}

ITEMS PURCHASED:
─────────────────────────────────────────────
${order.orderItems.map(item => 
  `${item.name}
   Quantity: ${item.quantity}  Price: $${item.price.toFixed(2)}  Total: $${(item.price * item.quantity).toFixed(2)}
`).join('')}

PAYMENT SUMMARY:
─────────────────────────────────────────────
Subtotal:     $${order.itemsPrice.toFixed(2)}
Shipping:     $${order.shippingPrice.toFixed(2)}
Tax:          $${order.taxPrice.toFixed(2)}
─────────────────────────────────────────────
TOTAL:        $${order.totalPrice.toFixed(2)}

Questions about your order?
Our customer service team is here to help.

Thank you for shopping with us!

© ${new Date().getFullYear()} NextEcommerce. All rights reserved.
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
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Order Status Update</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your order information has been updated</p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 10px 0;">Hello ${user.name}!</h2>
          <p style="color: #666; margin: 0; font-size: 16px;">${statusMessage}</p>
        </div>
        
        <div style="background-color: #f1f3f4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Order Details</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order ID</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${order._id}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order Date</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Current Status</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px; color: #28a745;">${order.orderStatus}</p>
            </div>
          </div>
          ${order.statusNote ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #856404;">Important Note:</p>
            <p style="margin: 5px 0 0 0; color: #856404;">${order.statusNote}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="margin-top: 30px; text-align: center; padding: 20px; background-color: #e8f4ff; border-radius: 8px;">
          <p style="margin: 0; color: #333; font-weight: bold;">Have questions about your order?</p>
          <p style="margin: 10px 0 0 0; color: #666;">Our customer service team is ready to assist you</p>
        </div>
      </div>
      
      <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">Thank you for shopping with us!</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">© ${new Date().getFullYear()} NextEcommerce. All rights reserved.</p>
      </div>
    </div>
  `;
  
  const text = `
=============================================
    ORDER STATUS UPDATE
=============================================

Hello ${user.name}!

${statusMessage}

ORDER DETAILS:
─────────────────────────────────────────────
Order ID:      ${order._id}
Order Date:    ${new Date(order.createdAt).toLocaleDateString()}
Current Status: ${order.orderStatus}
${order.statusNote ? `
IMPORTANT NOTE:
${order.statusNote}
` : ''}

Have questions about your order?
Our customer service team is ready to assist you.

Thank you for shopping with us!

© ${new Date().getFullYear()} NextEcommerce. All rights reserved.
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
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f8f9fa; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔔 New Order Alert!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">A new order has been placed on your store</p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background-color: #f1f3f4; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
              <span style="background-color: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">1</span>
              Order Information
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order ID</p>
                <p style="margin: 0; font-weight: bold; font-size: 16px;">${order._id}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order Date</p>
                <p style="margin: 0; font-weight: bold; font-size: 16px;">${new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Status</p>
                <p style="margin: 0; font-weight: bold; font-size: 16px;"><span style="background: #28a745; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${order.orderStatus}</span></p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Payment Method</p>
                <p style="margin: 0; font-weight: bold; font-size: 16px;">${order.paymentMethod}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Payment Status</p>
                <p style="margin: 0; font-weight: bold; font-size: 16px;">${order.isPaid ? '✅ Paid' : '❌ Pending'}</p>
              </div>
            </div>
          </div>
          
          <div style="background-color: #f1f3f4; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
              <span style="background-color: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">2</span>
              Customer Information
            </h3>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Full Name</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${user.name}</p>
            </div>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Email Address</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${user.email}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Phone Number</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${order.shippingAddress?.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div style="background-color: #f1f3f4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
            <span style="background-color: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">3</span>
            Shipping Address
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Recipient</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${order.shippingAddress?.fullName || 'Not provided'}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Street Address</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${order.shippingAddress?.address || 'Not provided'}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">City & State</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${order.shippingAddress?.city}${order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Postal Code</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${order.shippingAddress?.zipCode || 'Not provided'}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Country</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${order.shippingAddress?.country || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #eee; display: flex; align-items: center;">
            <span style="background-color: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">4</span>
            Order Items
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #e9ecef;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Subtotal:</span>
                <span style="font-weight: bold;">$${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Shipping:</span>
                <span style="font-weight: bold;">$${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Tax:</span>
                <span style="font-weight: bold;">$${order.taxPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                <span style="font-size: 18px; font-weight: bold;">Order Total:</span>
                <span style="font-size: 18px; font-weight: bold; color: #28a745;">$${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #e7f3ff; border-left: 4px solid #007bff; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #333; display: flex; align-items: center;">
            <span style="background-color: #007bff; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">5</span>
            Next Steps
          </h3>
          <p style="margin: 0; color: #666;">Please log in to your admin dashboard to process this order and update the customer with shipping information.</p>
        </div>
      </div>
      
      <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">This is an automated notification from your NextEcommerce store.</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">© ${new Date().getFullYear()} NextEcommerce. All rights reserved.</p>
      </div>
    </div>
  `;
  
  const text = `
=============================================
    🔔 NEW ORDER ALERT!
=============================================

ORDER INFORMATION:
─────────────────────────────────────────────
Order ID:        ${order._id}
Order Date:      ${new Date(order.createdAt).toLocaleDateString()}
Status:          ${order.orderStatus}
Payment Method:  ${order.paymentMethod}
Payment Status:  ${order.isPaid ? '✅ PAID' : '❌ PENDING'}

CUSTOMER INFORMATION:
─────────────────────────────────────────────
Full Name:       ${user.name}
Email Address:   ${user.email}
Phone Number:    ${order.shippingAddress?.phone || 'Not provided'}

SHIPPING ADDRESS:
─────────────────────────────────────────────
Recipient:       ${order.shippingAddress?.fullName || 'Not provided'}
Street Address:  ${order.shippingAddress?.address || 'Not provided'}
City & State:    ${order.shippingAddress?.city}${order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}
Postal Code:     ${order.shippingAddress?.zipCode || 'Not provided'}
Country:         ${order.shippingAddress?.country || 'Not provided'}

ORDER ITEMS:
─────────────────────────────────────────────
${order.orderItems.map(item => 
  `${item.name}
   Quantity: ${item.quantity}  Price: $${item.price.toFixed(2)}  Total: $${(item.price * item.quantity).toFixed(2)}
`).join('')}

PAYMENT SUMMARY:
─────────────────────────────────────────────
Subtotal:        $${order.itemsPrice.toFixed(2)}
Shipping:        $${order.shippingPrice.toFixed(2)}
Tax:             $${order.taxPrice.toFixed(2)}
─────────────────────────────────────────────
ORDER TOTAL:     $${order.totalPrice.toFixed(2)}

NEXT STEPS:
─────────────────────────────────────────────
Please log in to your admin dashboard to process this order and update the customer with shipping information.

This is an automated notification from your NextEcommerce store.
© ${new Date().getFullYear()} NextEcommerce. All rights reserved.
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
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">📦 Order Status Updated</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Order #${order._id} status has been changed</p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <div style="background-color: #f1f3f4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
            <span style="background-color: #28a745; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">1</span>
            Status Change Details
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Previous Status</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;"><span style="background: #6c757d; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${oldStatus}</span></p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">New Status</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;"><span style="background: #28a745; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${order.orderStatus}</span></p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Updated On</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div style="background-color: #f1f3f4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
            <span style="background-color: #28a745; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">2</span>
            Customer Information
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Customer Name</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${user.name}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Email Address</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${user.email}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order Total</p>
              <p style="margin: 0; font-weight: bold; font-size: 16px; color: #28a745;">$${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 20px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #333; display: flex; align-items: center;">
            <span style="background-color: #28a745; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">✅</span>
            Customer Notification
          </h3>
          <p style="margin: 0; color: #666;">The customer has been automatically notified about this status change via email.</p>
        </div>
      </div>
      
      <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">This is an automated notification from your NextEcommerce store.</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">© ${new Date().getFullYear()} NextEcommerce. All rights reserved.</p>
      </div>
    </div>
  `;
  
  const text = `
=============================================
    📦 ORDER STATUS UPDATED
=============================================

STATUS CHANGE DETAILS:
─────────────────────────────────────────────
Order ID:        ${order._id}
Previous Status: ${oldStatus}
New Status:      ${order.orderStatus}
Updated On:      ${new Date().toLocaleDateString()}

CUSTOMER INFORMATION:
─────────────────────────────────────────────
Customer Name:   ${user.name}
Email Address:   ${user.email}
Order Total:     $${order.totalPrice.toFixed(2)}

CUSTOMER NOTIFICATION:
─────────────────────────────────────────────
The customer has been automatically notified about this status change via email.

This is an automated notification from your NextEcommerce store.
© ${new Date().getFullYear()} NextEcommerce. All rights reserved.
  `;
  
  return await sendEmail({
    to: 'jaisidhu2004@gmail.com', // Admin email
    subject,
    text,
    html,
  });
};
