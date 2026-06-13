// Serves the project root at http://localhost:3000
// Run: node serve.mjs
import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { extname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(new URL('.', import.meta.url))
const PORT = 3000

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.mjs':  'text/javascript',
  '.json': 'application/json',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
}

createServer(async (req, res) => {
  let path = req.url.split('?')[0]
  if (path === '/' || path === '') path = '/index.html'

  const file = resolve(join(ROOT, path))
  if (!file.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return
  }

  try {
    const data = await readFile(file)
    const ext  = extname(file).toLowerCase()
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('404 Not Found')
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
