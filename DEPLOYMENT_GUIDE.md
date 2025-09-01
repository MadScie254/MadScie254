# 🚀 Deployment Guide

## Overview

This guide covers deploying the Daniel Wanjala portfolio website - a static, award-winning progressive web application built with vanilla HTML, CSS, and JavaScript.

## 📋 Prerequisites

### Required Tools
- Git (2.30+)
- Node.js (18+) for development tools
- Python (3.8+) for local testing
- Modern web browser for testing

### Account Requirements
- GitHub account with repository access
- GitHub Pages enabled (or alternative hosting)
- Domain name (optional)

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, ES6+ JavaScript
- **Animations**: GSAP 3.12.2 with ScrollTrigger
- **PWA**: Service Worker, Web App Manifest
- **Build**: No build process required (static files)
- **Deployment**: GitHub Pages with CI/CD automation

### File Structure
```
├── index.html                 # Main landing page
├── about.html                 # About page
├── projects.html              # Projects showcase
├── contact.html               # Contact page
├── manifest.json              # PWA manifest
├── service-worker.js          # PWA service worker
├── assets/
│   ├── css/                   # Stylesheets
│   │   ├── design-tokens.css  # Design system
│   │   ├── hero-variations.css # Hero styles
│   │   └── main.css           # Main styles
│   ├── js/                    # JavaScript modules
│   │   ├── motion-engine.js   # Animation system
│   │   └── main.js            # Application logic
│   ├── data/                  # Static JSON data
│   │   ├── projects.json      # Project data
│   │   ├── skills.json        # Skills data
│   │   ├── github-activity.json # GitHub data
│   │   └── tech-news.json     # News/blog data
│   └── images/                # Static assets
└── .github/workflows/         # CI/CD pipelines
    ├── deploy.yml             # Main deployment
    └── quality-assurance.yml  # QA automation
```

## 🔄 CI/CD Pipeline

### Automated Workflows

#### 1. Data Prefetch & Deployment (`deploy.yml`)
**Triggers:**
- Schedule: Every 6 hours
- Push to `main` branch
- Pull requests
- Manual dispatch

**Process:**
1. **Data Prefetch**
   - Fetches GitHub API data
   - Updates tech news from RSS feeds
   - Refreshes project metadata
   - Validates JSON structure

2. **Quality Checks**
   - Lighthouse performance audit
   - Pa11y accessibility testing
   - Code quality validation

3. **Deployment**
   - Production: Auto-deploy to GitHub Pages
   - Preview: Deploy PR previews
   - Notifications: Status updates

#### 2. Quality Assurance (`quality-assurance.yml`)
**Triggers:**
- Push to `main`/`develop`
- Pull requests
- Weekly schedule
- Manual dispatch

**Process:**
1. **Code Quality**
   - HTML linting (HTMLHint)
   - CSS linting (Stylelint)
   - JavaScript linting (ESLint)

2. **Performance Testing**
   - Lighthouse audits
   - Core Web Vitals measurement
   - Performance recommendations

3. **Accessibility Testing**
   - Pa11y WCAG compliance
   - Manual testing checklists
   - Screen reader compatibility

4. **Security Scanning**
   - Dependency vulnerability checks
   - Security best practices validation

## 🌐 Hosting Options

### Option 1: GitHub Pages (Recommended)

#### Setup Steps
1. **Enable GitHub Pages**
   ```bash
   # Repository Settings → Pages
   # Source: Deploy from a branch
   # Branch: gh-pages (auto-created by workflow)
   ```

2. **Custom Domain (Optional)**
   ```bash
   # Add CNAME file with your domain
   echo "yourdomain.com" > CNAME
   git add CNAME && git commit -m "Add custom domain"
   ```

3. **Verify Deployment**
   - URL: `https://yourusername.github.io/repository-name/`
   - Custom: `https://yourdomain.com/`

#### Configuration
```yaml
# .github/workflows/deploy.yml (already configured)
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./
```

### Option 2: Netlify

#### Setup Steps
1. **Connect Repository**
   - Link GitHub repository
   - Auto-deploy on push

2. **Build Settings**
   ```
   Build command: (leave empty - static site)
   Publish directory: /
   ```

3. **Environment Variables**
   ```
   NODE_VERSION=18
   PYTHON_VERSION=3.11
   ```

### Option 3: Vercel

#### Setup Steps
1. **Import Project**
   - Connect GitHub repository
   - Framework: Other

2. **Build Configuration**
   ```
   Build Command: (none)
   Output Directory: ./
   Install Command: npm install -g lighthouse
   ```

### Option 4: Traditional Web Hosting

#### Requirements
- Static file hosting
- HTTPS support
- HTTP/2 support (recommended)

#### Upload Process
1. **Build Local Copy**
   ```bash
   git clone https://github.com/yourusername/repository.git
   cd repository
   ```

2. **Upload Files**
   - Upload all files via FTP/SFTP
   - Ensure proper file permissions
   - Test all functionality

## 🔧 Local Development

### Setup Development Environment
```bash
# Clone repository
git clone https://github.com/MadScie254/MadScie254.git
cd MadScie254

# Start local server
python -m http.server 8080
# Or with Node.js
npx serve -s . -l 8080

# Open in browser
open http://localhost:8080
```

### Development Workflow
1. **Make Changes**
   - Edit HTML, CSS, or JavaScript files
   - Update data files as needed

2. **Test Locally**
   ```bash
   # Run quality checks
   npm install -g htmlhint stylelint eslint
   htmlhint *.html
   stylelint assets/css/*.css
   eslint assets/js/*.js
   
   # Test accessibility
   npm install -g pa11y
   pa11y http://localhost:8080
   
   # Test performance
   npm install -g lighthouse
   lighthouse http://localhost:8080 --view
   ```

3. **Commit and Push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

## 📊 Performance Optimization

### Targets
- **Lighthouse Performance**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimization Strategies

#### 1. Asset Optimization
```html
<!-- Critical CSS inlined -->
<style>
  /* Critical above-the-fold styles */
</style>

<!-- Non-critical CSS deferred -->
<link rel="preload" href="assets/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

#### 2. Image Optimization
- WebP format with fallbacks
- Lazy loading implementation
- Responsive images with srcset

#### 3. JavaScript Optimization
- ES6+ modules
- Dynamic imports for non-critical features
- Service worker caching

#### 4. Caching Strategy
```javascript
// Service Worker cache strategy
const CACHE_STRATEGIES = {
  'cache-first': ['assets/css/', 'assets/js/', 'assets/images/'],
  'network-first': ['assets/data/', '/api/'],
  'stale-while-revalidate': ['*.html']
};
```

## 🛡️ Security Configuration

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.github.com;
">
```

### HTTPS Configuration
- Force HTTPS redirects
- HSTS headers
- Secure cookie settings

### Privacy Compliance
- GDPR compliance considerations
- Cookie policy implementation
- Analytics opt-out options

## 🔍 Monitoring & Analytics

### Performance Monitoring
```javascript
// Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking
```javascript
// Service Worker error handling
self.addEventListener('error', event => {
  console.error('Service Worker error:', event.error);
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### Analytics Setup
- Google Analytics 4 (optional)
- Privacy-compliant tracking
- Performance metrics collection

## 🚨 Troubleshooting

### Common Issues

#### 1. Service Worker Not Updating
```javascript
// Force service worker update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.update();
    });
  });
}
```

#### 2. CORS Issues
- Ensure proper CORS headers
- Use relative URLs for same-origin requests
- Check CSP configuration

#### 3. Cache Issues
```bash
# Clear browser cache
# Hard reload: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

# Clear service worker cache
# Developer Tools → Application → Storage → Clear Storage
```

#### 4. Build Failures
```bash
# Check GitHub Actions logs
# Repository → Actions → Failed workflow

# Common fixes:
git config --global user.email "action@github.com"
git config --global user.name "GitHub Action"
```

### Debug Mode
```javascript
// Enable debug logging
const DEBUG = window.location.hostname === 'localhost';

if (DEBUG) {
  console.log('Debug mode enabled');
  // Additional debugging code
}
```

## 📝 Maintenance Checklist

### Daily (Automated)
- [ ] Data prefetch runs successfully
- [ ] Site deploys without errors
- [ ] Performance metrics within targets

### Weekly
- [ ] Review GitHub Actions logs
- [ ] Check Lighthouse reports
- [ ] Update content as needed
- [ ] Monitor error rates

### Monthly
- [ ] Dependency security audit
- [ ] Performance optimization review
- [ ] Accessibility compliance check
- [ ] Content freshness review

### Quarterly
- [ ] Full security review
- [ ] Technology stack updates
- [ ] Design system maintenance
- [ ] User experience testing

## 🆘 Emergency Procedures

### Site Down
1. **Check Status**
   ```bash
   curl -I https://yourdomain.com
   # Check response codes and headers
   ```

2. **GitHub Pages Issues**
   - Check GitHub Status: https://www.githubstatus.com/
   - Review recent commits
   - Check Actions workflow status

3. **Rollback Process**
   ```bash
   # Revert to last known good commit
   git revert HEAD
   git push origin main
   ```

### Data Corruption
1. **Restore from Backup**
   ```bash
   # Git history serves as backup
   git log --oneline assets/data/
   git checkout <commit-hash> -- assets/data/
   ```

2. **Manual Data Refresh**
   - Run GitHub Action manually
   - Verify data integrity
   - Test site functionality

### Performance Degradation
1. **Immediate Assessment**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Review recent changes

2. **Quick Fixes**
   - Clear CDN cache
   - Optimize critical resources
   - Disable non-essential features

## 📞 Support Contacts

### Technical Issues
- **Repository**: https://github.com/MadScie254/MadScie254
- **Documentation**: This deployment guide
- **Issues**: GitHub Issues tracker

### Hosting Support
- **GitHub Pages**: GitHub Support
- **Custom Domain**: Domain registrar support
- **CDN**: CloudFlare support (if applicable)

---

## 📅 Deployment History

### Version 1.0.0 (Current)
- **Date**: [Current Date]
- **Features**: Award-winning static site with PWA
- **Performance**: Lighthouse 90+ target
- **Accessibility**: WCAG 2.1 AA compliant
- **Security**: CSP and HTTPS enforced

### Planned Updates
- [ ] Advanced analytics integration
- [ ] Extended PWA features
- [ ] Enhanced accessibility features
- [ ] Performance optimizations

---

*This deployment guide is automatically updated with each release. For the latest version, check the repository documentation.*
