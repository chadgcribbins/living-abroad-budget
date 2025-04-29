#!/usr/bin/env node
/**
 * setup-docs.js
 *
 * 1. Ensures vitepress is a dev-dependency.
 * 2. Creates /docs structure   ─ .vitepress/config.js
 *                              ─ index.md
 *                              ─ features/<feature>.md  (one per task)
 * 3. Adds "docs:dev / docs:build / docs:preview" scripts to package.json.
 *
 * Run once, right after `task-master parse`.
 */

import fs    from 'fs';
import path  from 'path';
import cp    from 'child_process';

const root = process.cwd();
const docsDir = path.join(root, 'docs');
const vitepressDir = path.join(docsDir, '.vitepress');

// ────────────────────────────────────────────
// 1. install vitepress if missing
// ────────────────────────────────────────────
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

if (!(pkg.devDependencies && pkg.devDependencies.vitepress)) {
  console.log('▶ Installing vitepress …');
  cp.execSync('npm install --save-dev vitepress', { stdio: 'inherit' });
}

// add docs scripts if absent
pkg.scripts = pkg.scripts || {};
pkg.scripts['docs:dev']     = pkg.scripts['docs:dev']     || 'vitepress dev docs';
pkg.scripts['docs:build']   = pkg.scripts['docs:build']   || 'vitepress build docs';
pkg.scripts['docs:preview'] = pkg.scripts['docs:preview'] || 'vitepress preview docs';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('✔ package.json updated');

// ────────────────────────────────────────────
// 2. scaffold folders & base index
// ────────────────────────────────────────────
fs.mkdirSync(vitepressDir, { recursive: true });
fs.mkdirSync(path.join(docsDir, 'features'),     { recursive: true });
fs.mkdirSync(path.join(docsDir, 'architecture'), { recursive: true });

const configJs = `export default {
  title: 'Project Documentation',
  description: 'Living docs for the built system.',
  themeConfig: {
    sidebar: [
      { text: 'Features', link: '/features/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'Follow-ups', link: '/followups' }
    ]
  }
}
`;
fs.writeFileSync(path.join(vitepressDir, 'config.js'), configJs);

if (!fs.existsSync(path.join(docsDir, 'index.md'))) {
  fs.writeFileSync(
    path.join(docsDir, 'index.md'),
    '# Project Documentation\n\nWelcome! This site reflects what is actually built.\n'
  );
}

// ────────────────────────────────────────────
// 3. create feature stubs from /tasks backlog
// ────────────────────────────────────────────
const tasksDir = path.join(root, 'tasks');
if (fs.existsSync(tasksDir)) {
  const files = fs.readdirSync(tasksDir).filter(f => f.endsWith('.md'));
  files.forEach(f => {
    const taskMd = fs.readFileSync(path.join(tasksDir, f), 'utf-8');
    const firstLine = taskMd.split('\n')[0];
    const featureName = firstLine.replace(/^#\s*/, '').trim().toLowerCase()
      .replace(/\s+/g, '-');
    const featurePath = path.join(docsDir, 'features', `${featureName}.md`);
    if (!fs.existsSync(featurePath)) {
      fs.writeFileSync(
        featurePath,
`# ${firstLine.replace(/^#\s*/, '')}

*(Placeholder generated from task backlog. Fill in when built.)*
`
      );
      console.log('➕ feature stub:', featurePath);
    }
  });
}

console.log('🎉  VitePress docs bootstrapped. Run `npm run docs:dev` to preview.');