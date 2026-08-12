const babel = require('@babel/core');
const fs = require('fs');
const code = fs.readFileSync('main.js', 'utf8');
try {
  babel.transformSync(code, {
    presets: ['@babel/preset-react'],
    filename: 'main.js'
  });
  console.log("Success!");
} catch (e) {
  console.error(e);
}
