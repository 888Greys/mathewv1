# Quick Troubleshooting Guide

## 🚨 Common Issues & Quick Fixes

### Static Files Return 404
**Symptoms:** JavaScript chunks fail to load, `ERR_BLOCKED_BY_CLIENT` errors
**Quick Fix:**
```bash
cd /var/www/pompompurin
mkdir -p .next/standalone/.next/static
cp -r .next/static/* .next/standalone/.next/static/
pm2 restart pompompurin
```

### PM2 Can't Find server.js
**Symptoms:** `Cannot find module '.next/standalone/server.js'`
**Quick Fix:**
```bash
npm run build
ls -la .next/standalone/server.js  # Verify file exists
pm2 restart pompompurin
```

### Application Won't Start
**Symptoms:** PM2 shows "errored" or "stopped" status
**Quick Fix:**
```bash
pm2 logs pompompurin --lines 20  # Check error logs
pm2 delete pompompurin
pm2 start ecosystem.config.js
```

### Build Fails with styled-jsx Errors
**Symptoms:** Build stops with styled-jsx related errors
**Quick Fix:**
```bash
rm -rf node_modules .next
npm ci
npm run build
```

### Port Already in Use
**Symptoms:** `EADDRINUSE: address already in use`
**Quick Fix:**
```bash
pm2 delete all  # Or specific app name
# Or kill process using port
lsof -ti:3001 | xargs kill -9
pm2 start ecosystem.config.js
```

---

## 📞 Emergency Contacts & Resources

- **GitHub Repository:** https://github.com/888Greys/mathewv1
- **Server:** 194.163.180.87 (pompompurin.xsis.online)
- **PM2 Dashboard:** https://app.pm2.io/#/r/93l6qbz06fo50bk
- **GitHub Actions:** https://github.com/888Greys/mathewv1/actions

## 🔧 Essential Commands Cheat Sheet

```bash
# Status check
pm2 status
curl -I http://localhost:3001/

# Log inspection
pm2 logs pompompurin --lines 20
tail -f /var/log/nginx/access.log

# Quick restart
pm2 restart pompompurin

# Emergency rebuild
cd /var/www/pompompurin && npm run build && pm2 restart pompompurin

# Complete reset
pm2 delete pompompurin && rm -rf .next node_modules && npm ci && npm run build && pm2 start ecosystem.config.js
```