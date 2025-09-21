# Deployment Challenges and Solutions Documentation

## Project: mathewv1 Portfolio Deployment
**Date:** September 21, 2025  
**Server:** 194.163.180.87 (pompompurin.xsis.online)  
**Stack:** Next.js 15.5.3, PM2, Nginx, Ubuntu 24.04

---

## 🚨 Major Challenges Encountered

### 1. **Next.js Standalone Build Static Files Issue**
**Problem:** JavaScript chunks returning 404 errors despite successful build
- Static files (`.next/static/chunks/*.js`) existed but weren't served by the application
- Application loaded HTML but JavaScript functionality was broken
- Error: `ERR_BLOCKED_BY_CLIENT` on frontend

**Root Cause:** Next.js standalone builds don't automatically copy static files to the standalone directory

**Solution:**
```bash
# Manual fix
mkdir -p .next/standalone/.next/static
cp -r .next/static/* .next/standalone/.next/static/

# Copy public files too
mkdir -p .next/standalone/public
cp -r public/* .next/standalone/public/
```

**Prevention:** Updated build pipeline to automatically handle this:
- Added `postbuild` script in `package.json`
- Updated GitHub Actions workflow
- Created `scripts/build-standalone.sh` for comprehensive builds

### 2. **styled-jsx Compatibility Issues**
**Problem:** Build failures with styled-jsx in standalone mode
- Error: `Cannot resolve styled-jsx/style`
- Standalone builds couldn't bundle styled-jsx correctly

**Solution:** Updated `next.config.mjs`:
```javascript
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals = config.externals || [];
    config.externals.push({
      'styled-jsx/style': 'styled-jsx/style',
    });
  }
  return config;
},
outputFileTracingExcludes: {
  '*': [
    'node_modules/@swc/core-linux-x64-gnu',
    'node_modules/@swc/core-linux-x64-musl',
    // ... other exclusions
  ],
},
```

### 3. **PM2 Process Management Issues**
**Problem:** PM2 couldn't find server.js file or used wrong entry point
- Error: `Cannot find module '/var/www/pompompurin/.next/standalone/server.js'`
- Process restarting continuously

**Root Cause:** 
- Incomplete standalone build missing required files
- Wrong server.js path in ecosystem configuration

**Solution:**
- Ensure complete build before PM2 restart
- Verify `ecosystem.config.js` points to correct path:
```javascript
module.exports = {
  apps: [{
    name: 'pompompurin',
    script: '.next/standalone/server.js',
    cwd: '/var/www/pompompurin',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
```

### 4. **Port Configuration Conflicts**
**Problem:** Application trying to use port 3000 (already occupied) despite PORT=3001 configuration

**Solution:** Explicit port configuration in multiple places:
- Environment variable: `PORT: 3001`
- Package.json scripts: `"dev": "next dev -p 3001"`
- PM2 ecosystem config
- Nginx proxy configuration

### 5. **Incomplete Build Dependencies**
**Problem:** Standalone build missing `node_modules`, `package.json`, or server files

**Root Cause:** Build process interrupted or corrupted

**Solution:** Complete rebuild process:
```bash
rm -rf .next node_modules
npm ci
npm run build
# Verify all required files exist before deployment
```

### 6. **Text Styling Inconsistencies**
**Problem:** "Brand2D" text appearing with different styling than surrounding text

**Solution:** Convert JSX fragments to simple strings for consistent rendering:
```javascript
// Before (problematic)
subline: (
  <>
    I'm Mathew, a Software engineer at Brand2D, where I craft intuitive
    <br /> user experiences. After hours, I build my own projects.
  </>
),

// After (consistent)
subline: "I'm Mathew, a Software engineer at Brand2D, where I craft intuitive user experiences. After hours, I build my own projects.",
```

---

## 🛠️ Automated Solutions Implemented

### 1. **Enhanced GitHub Actions Workflow**
```yaml
script: |
  cd /var/www/pompompurin
  git pull origin main
  rm -rf .next node_modules
  npm ci
  npm run build
  # Ensure static files are available for standalone build
  mkdir -p .next/standalone/.next/static
  cp -r .next/static/* .next/standalone/.next/static/ 2>/dev/null || true
  # Copy public files if they exist
  if [ -d "public" ]; then
    mkdir -p .next/standalone/public
    cp -r public/* .next/standalone/public/ 2>/dev/null || true
  fi
  # Restart application
  pm2 delete pompompurin || true
  pm2 start ecosystem.config.js
  pm2 save
```

### 2. **Post-build Script in package.json**
```json
{
  "scripts": {
    "postbuild": "mkdir -p .next/standalone/.next/static && cp -r .next/static/* .next/standalone/.next/static/ 2>/dev/null || true"
  }
}
```

### 3. **Comprehensive Build Script**
Created `scripts/build-standalone.sh` for manual deployments:
```bash
#!/bin/bash
echo "Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Setting up static files for standalone build..."
mkdir -p .next/standalone/.next/static
if [ -d ".next/static" ]; then
    cp -r .next/static/* .next/standalone/.next/static/
    echo "Static files copied successfully!"
fi

if [ -d "public" ]; then
    mkdir -p .next/standalone/public
    cp -r public/* .next/standalone/public/
    echo "Public files copied successfully!"
fi

echo "Standalone build preparation complete!"
```

---

## 🔍 Debugging Strategies for Future Issues

### 1. **Build Verification Checklist**
Before deploying, always verify:
```bash
# Check standalone build structure
ls -la .next/standalone/
ls -la .next/standalone/server.js
ls -la .next/standalone/package.json
ls -la .next/standalone/node_modules/

# Verify static files
ls -la .next/standalone/.next/static/chunks/

# Test local server
cd .next/standalone && node server.js
```

### 2. **PM2 Debugging Commands**
```bash
# Check process status
pm2 status

# View detailed logs
pm2 logs pompompurin --lines 50

# Monitor in real-time
pm2 monit

# Restart with fresh logs
pm2 restart pompompurin && pm2 logs pompompurin --lines 10
```

### 3. **Network Connectivity Tests**
```bash
# Test direct application access
curl -I http://localhost:3001/

# Test static file serving
curl -I http://localhost:3001/_next/static/chunks/[filename].js

# Check nginx proxy
curl -I https://pompompurin.xsis.online/

# Monitor nginx access logs
tail -f /var/log/nginx/access.log
```

### 4. **Port and Process Verification**
```bash
# Check what's using ports
netstat -tulpn | grep -E "(3000|3001)"
# Alternative: ss -tulpn | grep -E "(3000|3001)"

# List all PM2 processes
pm2 list

# Check process details
pm2 show pompompurin
```

---

## 🎯 Best Practices for Future Deployments

### 1. **Pre-deployment Validation**
- Always test builds locally before deploying
- Verify all environment variables are set correctly
- Check that all dependencies are compatible with Node.js version

### 2. **Gradual Deployment Process**
1. **Stop existing process:** `pm2 delete app-name`
2. **Clean previous build:** `rm -rf .next node_modules`
3. **Fresh install:** `npm ci`
4. **Build and verify:** `npm run build && ls -la .next/standalone/`
5. **Copy static files:** Run post-build script
6. **Start process:** `pm2 start ecosystem.config.js`
7. **Verify functionality:** Test endpoints and static files

### 3. **Monitoring and Alerts**
- Set up PM2 monitoring: `pm2 plus`
- Monitor disk space (builds can consume significant space)
- Set up nginx error log monitoring
- Implement health checks in application

### 4. **Backup and Rollback Strategy**
```bash
# Before deployment, backup current working version
cp -r .next .next.backup.$(date +%Y%m%d_%H%M%S)

# Quick rollback if needed
pm2 stop app-name
rm -rf .next
mv .next.backup.YYYYMMDD_HHMMSS .next
pm2 start ecosystem.config.js
```

---

## 📋 Environment-Specific Configurations

### Development vs Production Differences
- **Development:** Uses `next dev` with hot reloading
- **Production:** Uses standalone build with pre-compiled assets
- **Static files:** Development serves from `.next/static/`, production needs files copied to `.next/standalone/.next/static/`

### Server Requirements
- **Node.js:** v20.x LTS recommended
- **Memory:** Minimum 512MB, recommended 1GB+ for builds
- **Disk space:** Monitor `.next` directory size (can grow large)
- **Process management:** PM2 for production stability

---

## 🚀 Quick Recovery Commands

If deployment fails, use these commands for quick recovery:

```bash
# Emergency recovery
cd /var/www/pompompurin
pm2 delete pompompurin || true
git stash  # Save any local changes
git pull origin main
rm -rf .next node_modules
npm ci
npm run build
mkdir -p .next/standalone/.next/static
cp -r .next/static/* .next/standalone/.next/static/
pm2 start ecosystem.config.js
pm2 save

# Verify recovery
curl -I http://localhost:3001/
pm2 logs pompompurin --lines 5
```

---

**Document Version:** 1.0  
**Last Updated:** September 21, 2025  
**Next Review:** Upon any deployment issues or major framework updates