import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, normalize, extname } from 'node:path'

const FIXTURES = join(process.cwd(), 'tests', 'fixtures')
const PORT = Number(process.env.TEST_PORT) || 4175

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.heic': 'image/heic',
  '.jpg': 'image/jpeg',
}

const VENDOR_FILES = {
  '/vendor/libheif.js': join(
    process.cwd(),
    'node_modules',
    'libheif-js',
    'libheif',
    'libheif.js'
  ),
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0])

    let filePath
    if (VENDOR_FILES[urlPath]) {
      filePath = VENDOR_FILES[urlPath]
    } else {
      filePath = normalize(
        join(FIXTURES, urlPath === '/' ? 'index.html' : urlPath)
      )
    }

    const info = await stat(filePath)
    if (!info.isFile()) throw new Error('not a file')
    const body = await readFile(filePath)
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
    })
    res.end(body)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(PORT, () => {
  console.log(`fixture server listening on http://127.0.0.1:${PORT}`)
})