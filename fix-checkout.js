const fs = require('fs');
const path = require('path');

// Path to the checkout page
const checkoutPath = path.join(process.cwd(), 'src/app/checkout/page.js');

// Read the file
console.log('Reading checkout page...');
const content = fs.readFileSync(checkoutPath, 'utf8');

// Fix the circular dependency issue
console.log('Fixing circular dependency issues...');

// 1. Move 'steps' declaration to the top of the component
const fixedContent = content.replace(
  /export default function CheckoutPage\(\) {([\s\S]*?)const steps = \['Shipping', 'Payment', 'Review Order'\];/m,
  "export default function CheckoutPage() {\n  // Steps for the checkout process\n  const steps = ['Shipping', 'Payment', 'Review Order'];\n$1"
);

// 2. Remove steps.length and replace with steps directly in dependency arrays
const finalContent = fixedContent.replace(
  /\[paymentSuccess, orderId, clearCart, steps.length\]/g,
  '[paymentSuccess, orderId, clearCart, steps]'
);

// Write the fixed content back to the file
console.log('Writing fixed file...');
fs.writeFileSync(checkoutPath, finalContent, 'utf8');

console.log('Done! Checkout page has been fixed.');
console.log('Please rebuild your project and deploy again.'); 