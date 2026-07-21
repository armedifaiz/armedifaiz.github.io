#!/usr/bin/env node

/**
 * fetch-credly-badges.js
 *
 * Fetches public Credly badges from configured profiles and writes
 * a normalized JSON file consumable by the portfolio React app.
 *
 * Usage:
 *   node scripts/fetch-credly-badges.js
 *
 * Environment variables:
 *   CREDLY_OUTPUT  – output path (default: src/data/credly-badges.json)
 *   CREDLY_USERS   – comma-separated list of username:label pairs
 *                    (default: "faiz-armedi:Google Cloud,faiz-armedi.5a800b60:Google for Developers")
 */

import { mkdirSync, writeFile } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const BASE_URL = 'https://www.credly.com';
const DEFAULT_USERS = [
  { username: 'faizarmedi', label: 'Google Cloud' },
];
const OUTPUT_PATH = process.env.CREDLY_OUTPUT || 'src/data/credly-badges.json';

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchBadgesForUser(username) {
  const badges = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${BASE_URL}/users/${encodeURIComponent(username)}/badges.json?page=${page}&per=48`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://github.com/armedifaiz)',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching ${url}`);
    }

    const body = await res.json();
    const data = body.data || [];
    const meta = body.metadata || {};

    badges.push(...data);
    hasMore = meta.current_page < meta.total_pages;
    page++;
  }

  return badges;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function normalizeBadge(raw, sourceLabel) {
  const template = raw.badge_template || {};
  const issuerEntities = raw.issuer?.entities || [];
  const primaryEntity = issuerEntities.find((e) => e.primary)?.entity;
  const issuer = primaryEntity?.name || sourceLabel || 'Unknown';

  const skills = (template.skills || []).map((s) => s.name).sort();

  return {
    id: raw.id,
    name: template.name || '',
    description: template.description || '',
    issuer,
    source: sourceLabel,
    level: template.level || '',
    issue_date: raw.issued_at_date || '',
    expiration_date: raw.expires_at_date || null,
    image_url: template.image_url || raw.image_url || '',
    badge_url: `https://www.credly.com/badges/${raw.id}`, // unique badge instance URL
    skills,
    state: raw.state || 'unknown',
    verified: raw.state === 'accepted',
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const rawUsers = process.env.CREDLY_USERS
    ? process.env.CREDLY_USERS.split(',').map((part) => {
        const [username, label] = part.split(':');
        return { username: username.trim(), label: (label || username).trim() };
      })
    : DEFAULT_USERS;

  const seen = new Set();
  const allBadges = [];

  for (const { username, label } of rawUsers) {
    console.error(`Fetching badges for: ${username} (${label})`);
    const raw = await fetchBadgesForUser(username);
    console.error(`  -> ${raw.length} badges found`);

    for (const b of raw) {
      const dedupKey = b.badge_template?.id || b.id;
      if (seen.has(dedupKey)) continue;
      seen.add(dedupKey);

      allBadges.push(normalizeBadge(b, label));
    }
  }

  // Sort: newest issue_date first
  allBadges.sort((a, b) => {
    if (!a.issue_date && !b.issue_date) return 0;
    if (!a.issue_date) return 1;
    if (!b.issue_date) return -1;
    return b.issue_date.localeCompare(a.issue_date);
  });

  const output = {
    fetched_at: new Date().toISOString(),
    total: allBadges.length,
    badges: allBadges,
  };

  await fsWrite(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.error(`\nWrote ${allBadges.length} badges to ${OUTPUT_PATH}`);
}

function fsWrite(path, data) {
  return new Promise((resolve, reject) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFile(path, data, 'utf-8', (err) => (err ? reject(err) : resolve()));
  });
}

main().catch((err) => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
