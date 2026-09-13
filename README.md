# Ultraviolet New Tab

A minimal browser-style frontend using Ultraviolet + BareMux + Epoxy + Wisp.

## Run

Requires Node.js 24+.

```bash
npm install
npm start
```

Then open:

http://localhost:8080

## Production

Ultraviolet uses a Service Worker, so production should use HTTPS.

This is a Node/WebSocket application, not a static-only site. Static hosts such as plain GitHub Pages or plain Cloudflare Pages are not sufficient for the included Wisp server.

## Structure

- `src/index.js` - Express server + Wisp WebSocket endpoint
- `public/index.html` - browser-style UI
- `public/app.js` - address bar, BareMux transport and UV navigation
- `public/register-sw.js` - registers the UV Service Worker
- `public/uv/uv.config.js` - Ultraviolet config
