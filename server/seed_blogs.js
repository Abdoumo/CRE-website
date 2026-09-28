import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedBlogs() {
  try {
    const dataPath = path.join(__dirname, '../client/src/data/pagesContent.json');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const pages = JSON.parse(fileContent);

    let count = 0;
    for (const [slug, content] of Object.entries(pages)) {
      // Format slug into title
      const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const htmlContent = `<p>${content.replace(/\n/g, '<br/>')}</p>`;
      const author = 'CRE Admin';

      // Use an image conditionally based on the slug or just a default
      let imageUrl = '';
      if (count % 3 === 0) imageUrl = 'https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg';
      else if (count % 3 === 1) imageUrl = 'https://cre.dz/images/headers/10.jpg';
      else imageUrl = 'https://cre.dz/images/headers/blue-flower.jpg';

      await pool.query(
        `INSERT INTO blogs (title, content, author, image_url) VALUES ($1, $2, $3, $4)`,
        [title, htmlContent, author, imageUrl]
      );
      count++;
    }

    console.log(`Successfully imported ${count} blogs from pagesContent.json!`);
  } catch (error) {
    console.error('Error seeding blogs:', error);
  } finally {
    process.exit(0);
  }
}

seedBlogs();
