const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.prisma = { seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts' };
pkg.scripts = { ...pkg.scripts, 'setup:db': 'prisma db push && prisma db seed' };
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
