const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app/(public)/_components/home');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Hex with Tailwind semantic classes
  content = content.replace(/bg-\[\#0B1220\]/g, 'bg-primary');
  content = content.replace(/text-\[\#0B1220\]/g, 'text-primary');
  content = content.replace(/border-\[\#0B1220\]/g, 'border-primary');
  content = content.replace(/from-\[\#0B1220\]/g, 'from-primary');
  content = content.replace(/via-\[\#0B1220\]/g, 'via-primary');

  content = content.replace(/bg-\[\#E87532\]/g, 'bg-accent');
  content = content.replace(/text-\[\#E87532\]/g, 'text-accent');
  content = content.replace(/border-\[\#E87532\]/g, 'border-accent');
  content = content.replace(/from-\[\#E87532\]/g, 'from-accent');

  content = content.replace(/bg-\[\#F7F5F0\]/g, 'bg-secondary');
  content = content.replace(/text-\[\#F7F5F0\]/g, 'text-secondary');
  
  // Replace dark mode whites in some places where primary should be used (if they were hardcoded for dark theme)
  // For safety, I won't replace 'text-white' blindly as some sections (like buttons) need it.
  
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Replaced colors successfully!');
