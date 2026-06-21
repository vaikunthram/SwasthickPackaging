const fs = require('fs');

// Read the Web3Forms Access Key from environment variables (set in Vercel settings)
const accessKey = process.env.WEB3FORMS_ACCESS_KEY || '';

// Write it to config.js dynamically during build
const content = `// Auto-generated during Vercel build
const CONFIG = {
    WEB3FORMS_ACCESS_KEY: '${accessKey}'
};
`;

fs.writeFileSync('config.js', content);
console.log('Generated config.js successfully for Vercel deployment.');
