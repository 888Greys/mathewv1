// For standalone builds, we need to adjust the module resolution
const { createServer } = require('node:http')
const { parse } = require('node:url')

// Handle styled-jsx issue in standalone builds
try {
  // Try to resolve styled-jsx/style
  require.resolve('styled-jsx/style');
  console.log('styled-jsx/style found in node_modules');
} catch (e) {
  console.log('styled-jsx/style not found in node_modules, this might be a standalone build issue');
}

let next;
try {
  // Try to load next from the standalone build location first
  if (process.env.NODE_ENV === 'production') {
    // In standalone builds, next is bundled with the application
    next = require('./.next/standalone/node_modules/next');
    console.log('Loaded Next.js from standalone build');
  } else {
    // In development, load from regular node_modules
    next = require('next');
    console.log('Loaded Next.js from node_modules');
  }
} catch (e) {
  console.log('Failed to load Next.js from standalone location, trying regular node_modules');
  try {
    next = require('next');
    console.log('Loaded Next.js from node_modules');
  } catch (e2) {
    console.error('Failed to load Next.js from any location:', e2);
    process.exit(1);
  }
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

// For standalone builds, we don't need a custom server
// The standalone build already includes a server
console.log('This server.js is not needed for standalone builds.');
console.log('Please start the application using: node .next/standalone/server.js');
process.exit(0);
