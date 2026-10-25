#!/usr/bin/env node

/**
 * fetch-portfolio-data.js
 *
 * Fetches all assets and data from the portfolio-data repo
 * (raw.githubusercontent.com — no rate limit).
 *
 * Usage:
 *   node scripts/fetch-portfolio-data.js
 *
 * Environment variables:
 *   DATA_REPO — repo path (default: "armedifaiz/portfolio-data")
 *   DATA_BRANCH — branch (default: "main")
 *   OUTPUT_DIR — target root dir (default: process.cwd())
 */

import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const REPO = process.env.DATA_REPO || 'armedifaiz/portfolio-data';
const BRANCH = process.env.DATA_BRANCH || 'main';
const BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const BACKEND_BASE_URL = process.env.PORTFOLIO_BACKEND_BASE_URL || '';
const OUT = process.env.OUTPUT_DIR || process.cwd();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fetchJsonRaw = async (path) => {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${path}`);
  return res.json();
};

const fetchJson = async (path, backendEndpoint) => {
  if (BACKEND_BASE_URL && backendEndpoint) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}${backendEndpoint}`);
      if (res.ok) return await res.json();
    } catch {
      // fall back to portfolio-data raw
    }
  }
  return fetchJsonRaw(path);
};

const fetchBuffer = async (path) => {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${path}`);
  return Buffer.from(await res.arrayBuffer());
};

const write = (path, data) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // --- Photos ---
  console.error('Fetching photos/data.json...');
  const photos = await fetchJson('photos/data.json', '/api/portfolio/photos');
  for (const p of photos) {
    const url = `photos/${p.filename}`;
    console.error(`  Downloading ${url}...`);
    const buf = await fetchBuffer(url);
    write(join(OUT, 'public', 'images', 'photos', p.filename), buf);
    p.imageUrl = `images/photos/${p.filename}`;
  }
  write(join(OUT, 'src', 'data', 'photos.json'), JSON.stringify(photos, null, 2));
  console.error(`  -> ${photos.length} photos saved`);

  // --- Certificates ---
  console.error('Fetching certificates/data.json...');
  const certs = await fetchJson('certificates/data.json', '/api/portfolio/certificates');
  for (const c of certs) {
    const url = `certificates/${c.filename}`;
    console.error(`  Downloading ${url}...`);
    const buf = await fetchBuffer(url);
    write(join(OUT, 'public', 'images', 'certificates', c.filename), buf);
    c.imageUrl = `images/certificates/${c.filename}`;
  }
  write(join(OUT, 'src', 'data', 'certificates.json'), JSON.stringify(certs, null, 2));
  console.error(`  -> ${certs.length} certificates saved`);

  // --- Sling icon ---
  console.error('Fetching sling-icon.png...');
  const slingBuf = await fetchBuffer('sling-icon.png');
  write(join(OUT, 'public', 'images', 'sling-icon.png'), slingBuf);
  console.error('  -> sling-icon.png saved');

  // --- Static data ---
  for (const name of ['experience.json', 'skills.json', 'socials.json']) {
    console.error(`Fetching ${name}...`);
    const backendEndpoint = name === 'experience.json'
      ? '/api/portfolio/experience'
      : name === 'skills.json'
        ? '/api/portfolio/skills'
        : '/api/portfolio/socials';
    const data = await fetchJson(name, backendEndpoint);
    write(join(OUT, 'src', 'data', name), JSON.stringify(data, null, 2));
    console.error(`  -> ${name} saved`);
  }

  console.error('\nDone.');
}

main().catch((err) => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
