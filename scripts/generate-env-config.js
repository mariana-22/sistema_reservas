const fs = require('fs');
const path = require('path');

function parseEnv(content) {
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const equalsIndex = line.indexOf('=');
      if (equalsIndex === -1) return acc;
      const key = line.slice(0, equalsIndex).trim();
      const value = line.slice(equalsIndex + 1).trim();
      acc[key] = value.replace(/^"|"$/g, '');
      return acc;
    }, {});
}

const envPath = path.resolve(__dirname, '..', '.env');
const outPath = path.resolve(__dirname, '..', 'src', 'assets', 'env-config.js');
let env = {};

if (fs.existsSync(envPath)) {
  env = parseEnv(fs.readFileSync(envPath, 'utf8'));
} else {
  console.warn('.env file not found. env-config.js will be generated with empty values.');
}

const supabaseUrl = env.SUPABASE_URL || '';
const supabaseKey = env.SUPABASE_ANON_KEY || env.SUPABASE_KEY || '';

const content = `window.SUPABASE_URL = ${JSON.stringify(supabaseUrl)};
window.SUPABASE_ANON_KEY = ${JSON.stringify(supabaseKey)};
if (${JSON.stringify(supabaseUrl)}) {
  localStorage.setItem('SUPABASE_URL', ${JSON.stringify(supabaseUrl)});
}
if (${JSON.stringify(supabaseKey)}) {
  localStorage.setItem('SUPABASE_ANON_KEY', ${JSON.stringify(supabaseKey)});
}
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`Generated ${path.relative(process.cwd(), outPath)} from .env`);
