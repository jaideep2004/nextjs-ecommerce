// This script will help identify potential circular dependencies and hook ordering issues
const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// List of files to check
const filesToCheck = [
  'src/app/checkout/page.js'
];

// Function to analyze a file for potential issues
function analyzeFile(filePath) {
  console.log(`Analyzing ${filePath}...`);
  
  try {
    const content = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
    
    // Parse the file using Babel
    const ast = babel.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
    
    const issues = [];
    const hooks = [];
    const variables = {};
    
    // Traverse the AST to find React hooks and variable declarations
    traverse(ast, {
      // Track variable declarations
      VariableDeclaration(path) {
        const declarations = path.node.declarations;
        
        declarations.forEach(declaration => {
          if (declaration.id && declaration.id.name) {
            variables[declaration.id.name] = {
              name: declaration.id.name,
              line: declaration.loc.start.line,
              initialized: !!declaration.init
            };
          }
        });
      },
      
      // Track React hooks
      CallExpression(path) {
        const callee = path.node.callee;
        
        // Check if it's a hook call (starts with 'use')
        if (callee.type === 'Identifier' && callee.name.startsWith('use')) {
          hooks.push({
            name: callee.name,
            line: path.node.loc.start.line,
            dependencies: path.node.arguments.length > 1 ? path.node.arguments[1] : null
          });
          
          // Check for dependencies that might not be defined yet
          if (path.node.arguments.length > 1 && path.node.arguments[1].type === 'ArrayExpression') {
            const dependencies = path.node.arguments[1].elements;
            
            dependencies.forEach(dep => {
              if (dep.type === 'Identifier') {
                const depName = dep.name;
                
                // If the variable is used before it's declared, flag it
                if (!variables[depName]) {
                  issues.push({
                    type: 'dependency',
                    message: `Hook ${callee.name} at line ${path.node.loc.start.line} uses dependency "${depName}" which might not be defined yet.`,
                    line: path.node.loc.start.line
                  });
                }
              }
            });
          }
        }
      }
    });
    
    // Report findings
    if (issues.length > 0) {
      console.log(`\nFound ${issues.length} potential issues in ${filePath}:`);
      issues.forEach(issue => {
        console.log(`  - Line ${issue.line}: ${issue.message}`);
      });
    } else {
      console.log(`\nNo issues found in ${filePath}`);
    }
    
    console.log(`\nHooks found (in order):`);
    hooks.forEach(hook => {
      console.log(`  - Line ${hook.line}: ${hook.name}`);
    });
    
    return issues;
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
    return [];
  }
}

// Main function
function main() {
  console.log('Checking for circular dependencies and hook ordering issues...\n');
  
  let totalIssues = 0;
  
  filesToCheck.forEach(file => {
    const issues = analyzeFile(file);
    totalIssues += issues.length;
  });
  
  console.log(`\nAnalysis complete. Found ${totalIssues} potential issues.`);
  console.log('\nNote: This is a basic analysis and might have false positives or miss some issues.');
  console.log('For more accurate results, consider using ESLint with the react-hooks plugin.');
}

main(); 