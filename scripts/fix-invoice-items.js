#!/usr/bin/env node

/**
 * Fix Invoice Items Script
 * Adds missing 'total' property to all InvoiceItem objects
 */

const fs = require('fs');
const path = require('path');

function fixInvoiceItems() {
  const filePath = 'src/utils/mockData/invoicesData.ts';
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all InvoiceItem objects and add total property
  const itemRegex = /{\s*id:\s*"[^"]+",\s*description:\s*"[^"]+",\s*quantity:\s*\d+,\s*price:\s*\d+,\s*}(?=\s*[,}])/g;
  
  content = content.replace(itemRegex, (match) => {
    // Extract quantity and price
    const quantityMatch = match.match(/quantity:\s*(\d+)/);
    const priceMatch = match.match(/price:\s*(\d+)/);
    
    if (quantityMatch && priceMatch) {
      const quantity = parseInt(quantityMatch[1]);
      const price = parseInt(priceMatch[1]);
      const total = quantity * price;
      
      // Add total property before the closing brace
      return match.replace(/,\s*}$/, `,\n        total: ${total},\n      }`);
    }
    
    return match;
  });
  
  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed InvoiceItem objects in invoicesData.ts');
}

function main() {
  console.log('🔧 Fixing InvoiceItem objects...');
  fixInvoiceItems();
  console.log('✅ InvoiceItem fix completed!');
}

if (require.main === module) {
  main();
}

module.exports = { fixInvoiceItems };
