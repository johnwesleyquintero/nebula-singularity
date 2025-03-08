const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all JSX/TSX files
const jsxFiles = glob.sync('**/*.{jsx,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'out/**']
});

let updatedCount = 0;

jsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check if file already has React import
  if (!content.includes('import React') && !content.includes('import * as React')) {
    // Add React import at the top of the file
    const updatedContent = `import React from 'react';\n${content}`;
    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`Added React import to ${file}`);
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} files with React imports.`);