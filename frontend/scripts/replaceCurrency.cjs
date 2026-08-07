const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'pages');
const CURRENCY_UTIL_PATH = '../../utils/currency.js'; // relative to most pages

function walkSync(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkSync(dirPath, callback);
    } else {
      if (f.endsWith('.jsx')) {
        callback(dirPath);
      }
    }
  });
}

walkSync(DIR, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // 1. Remove local formatCurrency
  const regex1 = /const formatCurrency =.*?`₹\$\{Number.*?`/g;
  const regex2 = /const formatCurrency = \(n\) => n \? `₹\$\{Number\(n\)\.toLocaleString\('en-IN'\)\}` : '₹0'/g;
  const regex3 = /const formatCurrency = \(n\) => `₹\$\{Number\(n\)\.toLocaleString\('en-IN'\)\}`/g;
  const regex4 = /const formatCurrency = \(num\) => \{\n\s*if \(\!num\) return '₹0'\n\s*return `₹\$\{num\.toLocaleString\('en-IN'\)\}`\n\s*\}/g;

  if (content.match(regex2)) { content = content.replace(regex2, ''); changed = true; }
  if (content.match(regex3)) { content = content.replace(regex3, ''); changed = true; }
  if (content.match(regex4)) { content = content.replace(regex4, ''); changed = true; }

  // 2. Add imports if needed
  if (changed && !content.includes('utils/currency.js')) {
    // get relative path from file to src/utils/currency.js
    const relativeDepth = filePath.split('src\\pages\\')[1].split('\\').length;
    let importPath = '';
    for(let i=0; i<relativeDepth; i++) importPath += '../';
    importPath += 'utils/currency.js';

    // Insert import after the last import statement
    const importRegex = /import .* from '.*';?\n/g;
    let match;
    let lastImportIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    content = content.slice(0, lastImportIndex) + `import { formatCurrency, CURRENCY_SYMBOL } from '${importPath}'\n` + content.slice(lastImportIndex);
  }

  // 3. Replace static strings
  if (content.includes('Amount (₹)')) {
    content = content.replaceAll('Amount (₹)', 'Amount ({CURRENCY_SYMBOL})');
    changed = true;
  }
  if (content.includes('Refund Amount (₹)')) {
    content = content.replaceAll('Refund Amount (₹)', 'Refund Amount ({CURRENCY_SYMBOL})');
    changed = true;
  }
  if (content.includes('Security Deposit (₹)')) {
    content = content.replaceAll('Security Deposit (₹)', 'Security Deposit ({CURRENCY_SYMBOL})');
    changed = true;
  }
  if (content.includes('placeholder="₹"')) {
    content = content.replaceAll('placeholder="₹"', 'placeholder={CURRENCY_SYMBOL}');
    changed = true;
  }
  
  if (content.includes('Rent: ₹{unit.rent}')) {
    content = content.replaceAll('Rent: ₹{unit.rent}', 'Rent: {formatCurrency(unit.rent)}');
    changed = true;
  }

  // Ensure CURRENCY_SYMBOL is imported if we just used it
  if (changed && content.includes('CURRENCY_SYMBOL') && !content.includes('import { formatCurrency, CURRENCY_SYMBOL }')) {
    if (content.includes('import { formatCurrency }')) {
       content = content.replace('import { formatCurrency }', 'import { formatCurrency, CURRENCY_SYMBOL }');
    } else {
      const relativeDepth = filePath.split('src\\pages\\')[1].split('\\').length;
      let importPath = '';
      for(let i=0; i<relativeDepth; i++) importPath += '../';
      importPath += 'utils/currency.js';
      const importRegex = /import .* from '.*';?\n/g;
      let match;
      let lastImportIndex = 0;
      while ((match = importRegex.exec(content)) !== null) {
        lastImportIndex = match.index + match[0].length;
      }
      content = content.slice(0, lastImportIndex) + `import { formatCurrency, CURRENCY_SYMBOL } from '${importPath}'\n` + content.slice(lastImportIndex);
    }
  }

  // Payments.jsx specifically
  if (filePath.includes('Payments.jsx')) {
    content = content.replaceAll('*Total Pending: ₹{{total_pending}}*', '*Total Pending: ${CURRENCY_SYMBOL}{{total_pending}}*');
    content = content.replaceAll('`• ${due.title}: ₹${due.amount}${dateStr}\\n`', '`• ${due.title}: ${CURRENCY_SYMBOL}${due.amount}${dateStr}\\n`');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
});
