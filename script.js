const fs = require('fs');
const path = require('path');

const loginSrc = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');
const signupSrc = fs.readFileSync('src/app/(auth)/signup/page.tsx', 'utf8');

function modifyLogin(src, role) {
  let content = src;
  
  // Remove state for role
  content = content.replace(/const \[role, setRole\] = useState<'STUDENT' \| 'TUTOR'>\('STUDENT'\);/g, `const role = '${role}';`);
  
  // Remove toggle buttons
  content = content.replace(/<div className="flex bg-secondary\/50 p-1 rounded-none mb-6">[\s\S]*?<\/div>\s*<div>\s*<label/g, '<div>\n              <label');
  
  // Update "Back to Home" to point to selection screen
  content = content.replace(/<Link href="\/" className="inline-flex/g, `<Link href="/login" className="inline-flex`);

  // Update signup link at bottom
  content = content.replace(/<Link href="\/signup"/g, `<Link href="/${role.toLowerCase()}/signup"`);
  
  return content;
}

function modifySignup(src, role) {
  let content = src;
  
  // Remove state for role
  content = content.replace(/const \[role, setRole\] = useState\('STUDENT'\);/g, `const role = '${role}';`);
  
  // Remove toggle buttons
  content = content.replace(/<div className="flex gap-4 mb-6">[\s\S]*?<\/div>\s*<div>\s*<label/g, '<div>\n              <label');
  
  // Update "Back to Home" to point to selection screen
  content = content.replace(/<Link href="\/" className="inline-flex/g, `<Link href="/signup" className="inline-flex`);
  
  // Update login link at bottom
  content = content.replace(/<Link href="\/login"/g, `<Link href="/${role.toLowerCase()}/login"`);
  
  return content;
}

// Create dirs
fs.mkdirSync('src/app/(auth)/student/login', { recursive: true });
fs.mkdirSync('src/app/(auth)/student/signup', { recursive: true });
fs.mkdirSync('src/app/(auth)/tutor/login', { recursive: true });
fs.mkdirSync('src/app/(auth)/tutor/signup', { recursive: true });

// Write files
fs.writeFileSync('src/app/(auth)/student/login/page.tsx', modifyLogin(loginSrc, 'STUDENT'));
fs.writeFileSync('src/app/(auth)/tutor/login/page.tsx', modifyLogin(loginSrc, 'TUTOR'));
fs.writeFileSync('src/app/(auth)/student/signup/page.tsx', modifySignup(signupSrc, 'STUDENT'));
fs.writeFileSync('src/app/(auth)/tutor/signup/page.tsx', modifySignup(signupSrc, 'TUTOR'));

console.log("Files copied and modified successfully.");
