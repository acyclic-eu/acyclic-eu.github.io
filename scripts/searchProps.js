// ...existing code...

// Example: Find props inside defineProps({ ... })
const fs = require('fs');
const path = require('path');

function searchPropsInDefine(fileContent) {
  // This regex matches defineProps({ ... }) and captures the object literal
  const definePropsRegex = /defineProps\s*\(\s*({[\s\S]*?})\s*\)/g;
  let match;
  const results = [];
  while ((match = definePropsRegex.exec(fileContent)) !== null) {
    results.push(match[1]); // match[1] is the object literal
  }
  return results;
}

// ...existing code...
// Example usage:
const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf-8');
const propsObjects = searchPropsInDefine(content);
console.log(propsObjects);

// ...existing code...

