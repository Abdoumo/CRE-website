import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs/promises';

const BASE_URL = 'https://cre.dz';
const HOME_URL = 'https://cre.dz/index.php/fr/';

async function scrape() {
  console.log('Fetching homepage...');
  const res = await fetch(HOME_URL);
  const html = await res.text();
  const $ = cheerio.load(html);

  const linksToScrape = [];

  // Look for all internal links
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && href.startsWith('/index.php/fr/') && text && href !== '/index.php/fr/') {
      // Avoid duplicates
      if (!linksToScrape.find(l => l.url === BASE_URL + href)) {
        linksToScrape.push({
          title: text,
          url: BASE_URL + href
        });
      }
    }
  });

  console.log(`Found ${linksToScrape.length} links to scrape.`);
  
  const pagesData = {};

  for (const link of linksToScrape) {
    console.log(`Scraping: ${link.title} (${link.url})`);
    try {
      const pageRes = await fetch(link.url);
      const pageHtml = await pageRes.text();
      const $page = cheerio.load(pageHtml);
      
      // Try to find the main content. Usually in .item-page or similar
      let content = $page('.item-page').html() || $page('#sp-main-body').html();
      
      if (content) {
        // Strip out some script/style tags if any
        const $content = cheerio.load(content);
        $content('script, style, noscript').remove();
        
        // Convert to somewhat cleaner HTML or text
        const cleanHtml = $content.html();
        
        // create a slug
        const slug = link.url.split('/').pop().replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
        
        pagesData[slug] = {
          title: link.title,
          original_url: link.url,
          html_content: cleanHtml
        };
      }
    } catch (e) {
      console.error(`Error scraping ${link.url}:`, e.message);
    }
  }

  // Save to file
  await fs.writeFile('src/data/pagesContent.json', JSON.stringify(pagesData, null, 2));
  console.log('Done! Saved to src/data/pagesContent.json');
}

scrape();
