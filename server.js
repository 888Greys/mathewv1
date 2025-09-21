const { createServer } = require('node:http')
const { parse } = require('node:url')

// Handle styled-jsx issue in standalone builds
let next;
try {
  // Try to resolve styled-jsx/style
  require.resolve('styled-jsx/style');
  console.log('styled-jsx/style found in node_modules');
} catch (e) {
  console.log('styled-jsx/style not found in node_modules, this might be a standalone build issue');
}

try {
  next = require('next');
  console.log('Next.js loaded successfully');
} catch (e) {
  console.error('Failed to load Next.js:', e);
  process.exit(1);
}

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3001
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
}).catch(err => {
  console.error('Failed to prepare Next.js app:', err);
  process.exit(1);
})