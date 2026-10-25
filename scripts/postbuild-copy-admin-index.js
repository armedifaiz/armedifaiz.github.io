import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const from = path.join(distDir, 'index.html')
const toDir = path.join(distDir, 'admin')
const to = path.join(toDir, 'index.html')

if (!fs.existsSync(from)) {
  console.warn(`[postbuild] ${from} not found; skipping admin/index.html copy.`)
  process.exit(0)
}

fs.mkdirSync(toDir, { recursive: true })
fs.copyFileSync(from, to)
console.log(`[postbuild] Copied ${from} -> ${to}`)
