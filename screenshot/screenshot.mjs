// Usage: node screenshot.mjs <url> [label]
// Saves to ./temporary screenshots/screenshot-N[-label].png
import puppeteer from './frontend/node_modules/puppeteer/lib/puppeteer/puppeteer.js'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

const CHROME = '/home/yahia/.cache/puppeteer/chrome/linux-149.0.7827.22/chrome-linux64/chrome'
const OUT_DIR = './temporary screenshots'

const url   = process.argv[2] || 'http://localhost:5173'
const label = process.argv[3] || ''

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const existing = readdirSync(OUT_DIR).filter(f => f.endsWith('.png'))
const n = existing.length + 1
const filename = label
  ? `screenshot-${n}-${label}.png`
  : `screenshot-${n}.png`
const outPath = join(OUT_DIR, filename)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 })
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: outPath, fullPage: true })
await browser.close()

console.log(`Saved: ${outPath}`)
