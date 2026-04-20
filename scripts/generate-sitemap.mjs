// Auto-generates public/sitemap.xml from src/data/{symptoms,conditions,blogs}.ts
// Run with: node scripts/generate-sitemap.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = 'https://doctoriai.com';
const today = new Date().toISOString().slice(0, 10);

const extractSlugs = (file) =>
  Array.from(readFileSync(file, 'utf8').matchAll(/slug:\s*'([^']+)'/g)).map((m) => m[1]);

const symptoms = extractSlugs('src/data/symptoms.ts');
const conditions = extractSlugs('src/data/conditions.ts');

// Blog slugs are computed: title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + id
const blogFile = readFileSync('src/data/blogs.ts', 'utf8');
const blogs = Array.from(blogFile.matchAll(/make\((\d+),\s*"([^"]+)"/g)).map(([, id, title]) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id;
  return slug;
});

const staticPages = [
  ['/', '1.0', 'daily'],
  ['/chat', '0.9', 'weekly'],
  ['/doctors', '0.9', 'weekly'],
  ['/doctor-directory', '0.8', 'weekly'],
  ['/blog', '0.8', 'daily'],
  ['/symptoms', '0.9', 'weekly'],
  ['/conditions', '0.9', 'weekly'],
  ['/medicine', '0.7', 'weekly'],
  ['/blood-donation', '0.8', 'weekly'],
  ['/bmi-calculator', '0.7', 'monthly'],
  ['/ai-analysis', '0.8', 'weekly'],
  ['/health-tips', '0.7', 'weekly'],
  ['/about', '0.6', 'monthly'],
  ['/contact', '0.6', 'monthly'],
  ['/privacy', '0.4', 'yearly'],
  ['/terms', '0.4', 'yearly'],
  ['/doctor-verification', '0.5', 'yearly'],
  ['/install', '0.5', 'monthly'],
  ['/booking/location', '0.7', 'weekly'],
];

const url = (loc, priority, changefreq) =>
  `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

const entries = [
  ...staticPages.map(([p, pr, cf]) => url(p, pr, cf)),
  ...symptoms.map((s) => url(`/symptoms/${s}`, '0.8', 'monthly')),
  ...conditions.map((s) => url(`/conditions/${s}`, '0.8', 'monthly')),
  ...blogs.map((s) => url(`/blog/${s}`, '0.7', 'monthly')),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

writeFileSync(resolve('public/sitemap.xml'), xml);
console.log(`✓ Generated sitemap with ${entries.length} URLs (${symptoms.length} symptoms, ${conditions.length} conditions, ${blogs.length} blog posts)`);
