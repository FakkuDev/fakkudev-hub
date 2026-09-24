import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, '../src/content/projects');
const outputDir = path.join(__dirname, '../src/assets/thumbs');

await fs.mkdir(outputDir, { recursive: true });

const files = await fs.readdir(projectsDir);
const browser = await chromium.launch({ headless: true });

for (const file of files) {
  if (!file.endsWith('.json')) continue;

  const filePath = path.join(projectsDir, file);
  const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  const { slug, url } = content;

  console.log(`Capturing ${slug} from ${url}...`);

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.context().setExtraHTTPHeaders({ 'Accept-Language': 'es-AR,es;q=0.9' });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000); // Esperar animaciones o lazy load

    const tempPng = path.join(outputDir, `${slug}-temp.png`);
    await page.screenshot({ path: tempPng, fullPage: false });

    // Redimensionar a 1600x1000 y convertir a WebP calidad 85
    await sharp(tempPng)
      .resize(1600, 1000, { fit: 'cover', position: 'top' })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `${slug}.webp`));

    await fs.unlink(tempPng);
    console.log(`✅ Saved ${slug}.webp`);
  } catch (err) {
    console.error(`❌ Failed to capture ${slug}:`, err.message);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log('🎉 All captures completed.');
