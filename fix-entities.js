const fs = require('fs');
const path = require('path');

// Define specific fixes for each file based on the error messages
const specificFixes = [
  {
    file: 'src/app/about/page.js',
    replacements: [
      { search: "customers'", replace: "customers&apos;" },
      { search: "we'll", replace: "we&apos;ll" }
    ]
  },
  {
    file: 'src/app/admin/categories/page.js',
    replacements: [
      { search: '"Add"', replace: '&quot;Add&quot;' },
      { search: '"Edit"', replace: '&quot;Edit&quot;' }
    ]
  },
  {
    file: 'src/app/cart/page.js',
    replacements: [
      { search: "haven't", replace: "haven&apos;t" }
    ]
  },
  {
    file: 'src/app/contact/page.js',
    replacements: [
      { search: "We'll", replace: "We&apos;ll" }
    ]
  },
  {
    file: 'src/app/customer/dashboard/page.js',
    replacements: [
      { search: "You're", replace: "You&apos;re" }
    ]
  },
  {
    file: 'src/app/faq/page.js',
    replacements: [
      { search: "you'll", replace: "you&apos;ll" },
      { search: "you're", replace: "you&apos;re" }
    ]
  },
  {
    file: 'src/app/login/page.js',
    replacements: [
      { search: "Don't", replace: "Don&apos;t" }
    ]
  },
  {
    file: 'src/app/privacy/page.js',
    replacements: [
      { search: "user's", replace: "user&apos;s" },
      { search: '"cookies"', replace: '&quot;cookies&quot;' },
      { search: '"Do Not Track"', replace: '&quot;Do Not Track&quot;' }
    ]
  },
  {
    file: 'src/app/terms/page.js',
    replacements: [
      { search: "company's", replace: "company&apos;s" },
      { search: '"as is"', replace: '&quot;as is&quot;' }
    ]
  }
];

// Process each file with its specific fixes
specificFixes.forEach(({ file, replacements }) => {
  try {
    const fullPath = path.join(process.cwd(), file);
    
    // Read file content
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Apply each replacement
    replacements.forEach(({ search, replace }) => {
      content = content.replace(new RegExp(search, 'g'), replace);
    });
    
    // Write fixed content back to file
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`Fixed entities in ${file}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('Completed fixing unescaped entities'); 