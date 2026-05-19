import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, basename, extname } from 'path';

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkDir(full);
    else yield full;
  }
}

const SIZES = [400, 800];
let count = 0;

for await (const file of walkDir('public/images')) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  const base = file.slice(0, -ext.length);
  const img = sharp(file);
  const { width } = await img.metadata();

  await img.clone().webp({ quality: 85 }).toFile(`${base}.webp`);
  for (const w of SIZES) {
    if (width >= w) {
      await sharp(file).resize(w).webp({ quality: 85 }).toFile(`${base}-${w}.webp`);
    }
  }
  console.log(`✓ ${file} → webp (${SIZES.filter(w => width >= w).join('w, ')}w)`);
  count++;
}
console.log(`\nDone — ${count} images processed.`);
