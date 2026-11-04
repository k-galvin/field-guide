import fs from 'node:fs';

const files = [
  'js/storage.js',
  'js/sample-data.js',
  'js/day-loop.js',
  'js/kml-parser.js',
  'js/map.js',
  'js/supabase.js',
  'js/app.js'
];

let bundleContent = '(function() {\n"use strict";\n\n';

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  // Strip single-line and multi-line import statements
  content = content.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?/g, '');
  content = content.replace(/import\s+.*?\s+from\s*['"][^'"]+['"];?/g, '');
  // Strip export keywords
  content = content.replace(/export\s+(async\s+)?(const|let|var|function|class)\s+/g, '$1$2 ');
  content = content.replace(/export\s*\{[\s\S]*?\};?/g, '');
  content = content.replace(/export\s+default\s+.*?;?/g, '');
  bundleContent += `// --- ${f} ---\n${content}\n\n`;
}

bundleContent += '})();\n';

fs.writeFileSync('js/bundle.js', bundleContent, 'utf8');
console.log('Successfully bundled js/bundle.js (' + bundleContent.length + ' bytes)');
