#!/usr/bin/env node

/**
 * Complete Invoice Items Fix Script
 * Repairs all InvoiceItem objects to match the correct interface
 */

const fs = require('fs');
const path = require('path');

function fixInvoiceItems() {
  const filePath = 'lib/mockData/invoicesData.ts';
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all InvoiceItem objects and fix them
  const itemRegex = /{\s*name:\s*'([^']+)',\s*description:\s*'([^']+)',\s*quantity:\s*(\d+),\s*price:\s*(\d+),\s*tax:\s*(\d+)\s*}/g;
  
  content = content.replace(itemRegex, (match, name, description, quantity, price, tax) => {
    const qty = parseInt(quantity);
    const prc = parseInt(price);
    const total = qty * prc;
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return `{ id: '${id}', description: '${name} - ${description}', quantity: ${qty}, price: ${prc}, total: ${total} }`;
  });
  
  // Write the fixed content back
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed all InvoiceItem objects in invoicesData.ts');
}

function main() {
  console.log('🔧 Fixing all InvoiceItem objects...');
  fixInvoiceItems();
  console.log('✅ InvoiceItem fix completed!');
}

if (require.main === module) {
  main();
}

module.exports = { fixInvoiceItems };
