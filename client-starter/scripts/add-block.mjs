#!/usr/bin/env node
// Install Watermelon UI blocks/components into this project.
//
//   npm run add -- hero-17 pricing-1 faq-1
//
// Browse everything at https://ui.watermelon.sh. The slug is the last part of
// a block's URL (e.g. .../blocks/hero/hero-17 -> hero-17).
//
// Same result as `npx shadcn add https://registry.watermelon.sh/r/<slug>.json`,
// but it also installs shadcn primitives (button, card, …) from Watermelon's
// registry into src/components/ui so every block's imports resolve, and it
// falls back to the GitHub mirror when registry.watermelon.sh is unreachable.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REGISTRIES = [
  'https://registry.watermelon.sh/r',
  'https://raw.githubusercontent.com/WatermelonCorp/watermellon-registry/main/public/r',
];
const root = path.resolve(import.meta.dirname, '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const installed = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);

async function fetchItem(name) {
  for (const base of REGISTRIES) {
    try {
      const res = await fetch(`${base}/${name}.json`, { signal: AbortSignal.timeout(15000) });
      if (res.ok) return await res.json();
    } catch { /* try next registry */ }
  }
  throw new Error(`"${name}" not found in the Watermelon registry`);
}

function write(file, content, { overwrite }) {
  const abs = path.join(root, file);
  if (existsSync(abs) && !overwrite) return false;
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  return true;
}

const npmDeps = new Set();
const seen = new Set();

// Primitives (button, card, …) live in src/components/ui, which is where blocks import them from.
async function addPrimitive(name) {
  if (seen.has(name)) return;
  seen.add(name);
  const item = await fetchItem(name);
  item.dependencies?.forEach(d => npmDeps.add(d));
  for (const dep of item.registryDependencies ?? []) await addPrimitive(dep);
  for (const f of item.files) {
    const target = f.path.startsWith('src/lib/') ? f.path : `src/components/ui/${path.basename(f.path)}`;
    if (write(target, f.content, { overwrite: false })) console.log(`  + ${target}`);
  }
}

async function addBlock(name) {
  const item = await fetchItem(name);
  console.log(`${name}`);
  item.dependencies?.forEach(d => npmDeps.add(d));
  for (const dep of item.registryDependencies ?? []) await addPrimitive(dep);
  for (const f of item.files) {
    if (write(f.path, f.content, { overwrite: false })) console.log(`  + ${f.path}`);
    else console.log(`  = ${f.path} (exists, kept your version)`);
  }
}

const names = process.argv.slice(2);
if (!names.length) {
  console.log('Usage: npm run add -- <slug> [slug…]   (browse slugs at https://ui.watermelon.sh)');
  process.exit(1);
}
for (const n of names) await addBlock(n);

const missing = [...npmDeps].filter(d => !installed.has(d));
if (missing.length) {
  console.log(`\nInstalling: ${missing.join(' ')}`);
  execSync(`npm install ${missing.join(' ')}`, { cwd: root, stdio: 'inherit' });
}
console.log('\nDone. Import the block in src/App.tsx and replace its copy with the client\'s.');
