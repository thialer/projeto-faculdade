import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';
import { minify } from 'html-minifier-terser';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectRoot, 'docs');
const sourceHtml = path.join(projectRoot, 'html', 'index.html');
const jsFiles = ['templates.js', 'router.js', 'storage.js', 'main.js'];

async function writeMinified(sourcePath, outputPath, loader) {
  const originalSource = await readFile(sourcePath, 'utf8');
  const source = path.basename(sourcePath) === 'templates.js'
    ? originalSource.replaceAll('../imagens/', 'imagens/')
    : originalSource;
  const result = await transform(source, { loader, minify: true, target: 'es2020' });
  await writeFile(outputPath, result.code);
  return Buffer.byteLength(originalSource);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(path.join(outputDir, 'css'), { recursive: true });
await mkdir(path.join(outputDir, 'js'), { recursive: true });
await mkdir(path.join(outputDir, 'imagens'), { recursive: true });

const cssOriginalBytes = await writeMinified(
  path.join(projectRoot, 'css', 'style.css'),
  path.join(outputDir, 'css', 'style.min.css'),
  'css'
);

let jsOriginalBytes = 0;
for (const file of jsFiles) {
  jsOriginalBytes += await writeMinified(
    path.join(projectRoot, 'js', file),
    path.join(outputDir, 'js', file.replace('.js', '.min.js')),
    'js'
  );
}

let imageOriginalBytes = 0;
let imageOutputBytes = 0;
for (const file of await readdir(path.join(projectRoot, 'imagens'))) {
  const sourcePath = path.join(projectRoot, 'imagens', file);
  const outputPath = path.join(outputDir, 'imagens', file);
  const inputBytes = (await readFile(sourcePath)).byteLength;
  imageOriginalBytes += inputBytes;

  const image = sharp(sourcePath);
  if (/\.jpe?g$/i.test(file)) {
    await image.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(outputPath);
  } else if (/\.webp$/i.test(file)) {
    await image.webp({ quality: 78, effort: 5 }).toFile(outputPath);
  } else {
    await copyFile(sourcePath, outputPath);
  }
  imageOutputBytes += (await readFile(outputPath)).byteLength;
}

let html = await readFile(sourceHtml, 'utf8');
html = html
  .replace('../css/style.css', 'css/style.min.css')
  .replace('../js/templates.js', 'js/templates.min.js')
  .replace('../js/router.js', 'js/router.min.js')
  .replace('../js/storage.js', 'js/storage.min.js')
  .replace('../js/main.js', 'js/main.min.js');
await writeFile(path.join(outputDir, 'index.html'), await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true
}));

const percentSaved = (before, after) => before ? ((1 - after / before) * 100).toFixed(1) : '0.0';
const cssOutputBytes = (await readFile(path.join(outputDir, 'css', 'style.min.css'))).byteLength;
const jsOutputBytes = (await Promise.all(jsFiles.map((file) =>
  readFile(path.join(outputDir, 'js', file.replace('.js', '.min.js')))
))).reduce((total, file) => total + file.byteLength, 0);

console.log(`Build concluído em ${path.relative(projectRoot, outputDir)}/`);
console.log(`CSS: ${percentSaved(cssOriginalBytes, cssOutputBytes)}% menor`);
console.log(`JavaScript: ${percentSaved(jsOriginalBytes, jsOutputBytes)}% menor`);
console.log(`Imagens: ${percentSaved(imageOriginalBytes, imageOutputBytes)}% menor`);
