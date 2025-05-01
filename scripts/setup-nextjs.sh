#!/bin/bash

# Create necessary directories
mkdir -p src/{components,hooks,services,types,utils,store}

# Copy Next.js files from temp directory
cp -r ../temp-next-setup/src/* src/
cp ../temp-next-setup/package*.json .
cp ../temp-next-setup/tsconfig.json .
cp ../temp-next-setup/postcss.config.mjs .
cp ../temp-next-setup/next-env.d.ts .
cp ../temp-next-setup/next.config.ts .
cp ../temp-next-setup/eslint.config.mjs .
cp -r ../temp-next-setup/public .

# Add DaisyUI to package.json
npm install daisyui@latest zustand@latest

# Update package.json name and description
node -e "
const pkg = require('./package.json');
pkg.name = 'living-abroad-budget';
pkg.description = 'A modern budgeting platform for planning international moves by modeling multiple financial scenarios';
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Install dependencies
npm install

# Clean up
rm -rf ../temp-next-setup

echo "Next.js project setup complete!" 