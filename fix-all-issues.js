const fs = require('fs');
const path = require('path');

console.log('Starting to fix all identified issues...');

// 1. Fix product variations in cart
function fixProductVariationsInCart() {
  console.log('\nFixing product variations in cart...');
  
  const productPagePath = path.join(process.cwd(), 'src/app/product/[slug]/page.js');
  let content = fs.readFileSync(productPagePath, 'utf8');
  
  // Update handleAddToCart function
  const updatedContent = content.replace(
    /const handleAddToCart = \(\) => \{[\s\S]*?\};/m,
    `const handleAddToCart = () => {
    if (product) {
      // Check if the product has colors but none is selected
      if (product.colors?.length > 0 && !selectedColor) {
        toast.error('Please select a color');
        return;
      }
      
      // Check if the product has sizes but none is selected
      if (product.sizes?.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
      }
      
      const success = addToCart(
        product,
        quantity,
        selectedColor,
        selectedSize,
        user
      );
      
      if (success) {
        // Optional: Show a success message or navigate to cart
        // router.push('/cart');
      }
    }
  };`
  );
  
  // Add toast import if it doesn't exist
  if (!updatedContent.includes('import { toast }')) {
    const updatedContentWithImport = updatedContent.replace(
      /import \{([^}]*)\} from '@mui\/icons-material';/,
      `import {$1} from '@mui/icons-material';\nimport { toast } from 'react-toastify';`
    );
    fs.writeFileSync(productPagePath, updatedContentWithImport, 'utf8');
  } else {
    fs.writeFileSync(productPagePath, updatedContent, 'utf8');
  }
  
  console.log('✓ Fixed product variations in cart');
}

// 2. Fix product images not showing
function fixProductImages() {
  console.log('\nFixing product images not showing...');
  
  // Fix ProductCard component
  const productCardPath = path.join(process.cwd(), 'src/components/products/ProductCard.jsx');
  let productCardContent = fs.readFileSync(productCardPath, 'utf8');
  
  const updatedProductCardContent = productCardContent.replace(
    /src=\{product\.images\[0\] \|\| '\/images\/placeholder\.png'\}/,
    `src={product.image || (product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png')}`
  );
  
  fs.writeFileSync(productCardPath, updatedProductCardContent, 'utf8');
  
  // Fix Single Product Page
  const productPagePath = path.join(process.cwd(), 'src/app/product/[slug]/page.js');
  let productPageContent = fs.readFileSync(productPagePath, 'utf8');
  
  const updatedProductPageContent = productPageContent.replace(
    /src=\{product\.image\}/,
    `src={product.image || (product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png')}`
  );
  
  fs.writeFileSync(productPagePath, updatedProductPageContent, 'utf8');
  
  console.log('✓ Fixed product images not showing');
}

// 3. Fix categories page
function fixCategoriesPage() {
  console.log('\nFixing categories page...');
  
  const categoriesApiPath = path.join(process.cwd(), 'src/app/api/categories/route.js');
  let categoriesApiContent = fs.readFileSync(categoriesApiPath, 'utf8');
  
  const updatedCategoriesApiContent = categoriesApiContent.replace(
    /const productCount = await Product\.countDocuments\(\{ category: category\._id \}\);/,
    `const productCount = await Product.countDocuments({ category: category.name });`
  );
  
  // Add console log for debugging
  const finalCategoriesApiContent = updatedCategoriesApiContent.replace(
    /\)\;\s+return Response\.json\(/,
    `);\n    
    console.log('Categories API response:', categoriesWithCounts);\n    
    return Response.json(`
  );
  
  fs.writeFileSync(categoriesApiPath, finalCategoriesApiContent, 'utf8');
  
  console.log('✓ Fixed categories page');
}

// 4. Fix new arrivals page
function fixNewArrivalsPage() {
  console.log('\nFixing new arrivals page...');
  
  const newArrivalsPath = path.join(process.cwd(), 'src/app/products/new-arrivals/page.js');
  let newArrivalsContent = fs.readFileSync(newArrivalsPath, 'utf8');
  
  const updatedNewArrivalsContent = newArrivalsContent.replace(
    /const \{ data \} = await axios\.get\('\/api\/products\?sort=-createdAt&limit=12'\);\s+setProducts\(data\.products \|\| \[\]\);/,
    `const response = await axios.get('/api/products?sort=-createdAt&limit=12');
        console.log('New arrivals API response:', response.data);
        
        // Handle different response structures
        const productsData = response.data.products || response.data.data?.products || [];
        setProducts(productsData);`
  );
  
  fs.writeFileSync(newArrivalsPath, updatedNewArrivalsContent, 'utf8');
  
  console.log('✓ Fixed new arrivals page');
}

// Run all fixes
function runAllFixes() {
  try {
    fixProductVariationsInCart();
    fixProductImages();
    fixCategoriesPage();
    fixNewArrivalsPage();
    
    console.log('\n✅ All issues have been fixed successfully!');
    console.log('\nPlease restart your development server to see the changes.');
  } catch (error) {
    console.error('\n❌ Error fixing issues:', error);
  }
}

runAllFixes(); 