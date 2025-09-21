# Magic Portfolio

Magic Portfolio is a simple, clean, beginner-friendly portfolio template. It supports an MDX-based content system for projects and blog posts, an about / CV page and a gallery.

View the demo [here](https://demo.magic-portfolio.com).

![Magic Portfolio](public/images/og/home.jpg)

## Getting started

**1. Clone the repository**
```
git clone https://github.com/once-ui-system/magic-portfolio.git
```

**2. Install dependencies**
```
npm install
```

**3. Run dev server**
```
npm run dev
```

**4. Edit config**
```
src/resources/once-ui.config.js
```

**5. Edit content**
```
src/resources/content.js
```

**6. Create blog posts / projects**
```
Add a new .mdx file to src/app/blog/posts or src/app/work/projects
```

## 📝 Content Customization Guide

This section provides a comprehensive guide on which files to edit when customizing your portfolio.

### 🏠 Personal Information & Profile
**File:** `src/resources/content.tsx`
- **Personal details:** Name, role, email, location (timezone), languages
- **Bio/Subline:** Main description on homepage
- **Social links:** GitHub, LinkedIn, email, etc.
- **Avatar:** Change path in `person.avatar` (upload to `public/images/`)

### 🎨 Design & Branding
**File:** `src/resources/once-ui.config.ts`
- **Colors:** Primary brand colors, background colors
- **Typography:** Font families, sizes
- **Layout:** Spacing, borders, radius
- **Theme:** Light/dark mode settings

**Files:** `public/images/`
- **Avatar:** Replace `avatar.jpg` with your photo
- **Favicon:** Replace `src/app/favicon.ico`
- **Open Graph images:** Update `public/images/og/` for social media previews

### 📝 Blog Posts
**Directory:** `src/app/blog/posts/`
- **Create new post:** Add `your-post-title.mdx` file
- **Required frontmatter:**
  ```yaml
  ---
  title: "Your Post Title"
  publishedAt: "2025-09-21"
  summary: "Brief description for previews"
  tag: "Category"
  image: "/images/blog/your-image.jpg" (optional)
  ---
  ```
- **Content:** Write in Markdown/MDX format below frontmatter
- **Images:** Upload to `public/images/blog/` and reference in posts

**Configuration:** `src/resources/content.tsx`
- **Blog settings:** Enable/disable blog section in `blog` object
- **Display options:** Set `display: false` to hide blog entirely

### 💼 Work/Projects
**Directory:** `src/app/work/projects/`
- **Create new project:** Add `your-project-slug.mdx` file
- **Required frontmatter:**
  ```yaml
  ---
  title: "Project Name"
  publishedAt: "2025-09-21"
  summary: "Project description"
  images:
    - "/images/projects/project-name/cover.jpg"
    - "/images/projects/project-name/demo.mp4"
  team:
    - name: "Your Name"
      role: "Developer"
  ---
  ```
- **Project images:** Upload to `public/images/projects/project-name/`

**Configuration:** `src/resources/content.tsx`
- **Work experience:** Edit `about.work.experiences` array
- **Featured project:** Set `home.featured.href` to highlight a project

### 🖼️ Gallery
**File:** `src/app/gallery/page.tsx`
- **Images:** Edit the `images` array with your gallery photos
- **Upload location:** `public/images/gallery/`
- **Format:** Support for JPG, PNG, MP4

**Configuration:** `src/resources/content.tsx`
- **Gallery settings:** Enable/disable in `gallery` object

### 📄 About/CV Page
**File:** `src/resources/content.tsx`
- **Introduction:** Edit `about.intro.description`
- **Work experience:** Update `about.work.experiences` array
- **Education:** Modify `about.studies.institutions`
- **Technical skills:** Edit `about.technical.skills`
- **Calendar link:** Update `about.calendar.link` for booking meetings

### 🔧 Technical Configuration
**File:** `next.config.mjs`
- **Images:** Add domains to `remotePatterns` for external images
- **Environment:** Set custom port in `env.CUSTOM_PORT`

**File:** `package.json`
- **Scripts:** Modify development/build commands
- **Dependencies:** Add new packages as needed

### 🚀 Deployment Settings
**File:** `.github/workflows/deploy.yml`
- **Deployment target:** Change server details if deploying elsewhere
- **Build process:** Modify if you need custom build steps

**File:** `ecosystem.config.js`
- **PM2 settings:** Port, environment variables, process name

### 📧 Newsletter & Contact
**File:** `src/resources/content.tsx`
- **Newsletter:** Enable/disable and customize in `newsletter` object
- **Contact form:** Configure form submission (currently uses example endpoint)

### 🎯 Quick Customization Checklist

**For a basic personal portfolio:**
1. ✅ Update personal info in `src/resources/content.tsx`
2. ✅ Replace avatar in `public/images/avatar.jpg`
3. ✅ Add your projects to `src/app/work/projects/`
4. ✅ Write blog posts in `src/app/blog/posts/`
5. ✅ Update social links and contact information
6. ✅ Customize colors in `src/resources/once-ui.config.ts`

**For deployment:**
1. ✅ Push changes to GitHub (triggers auto-deployment)
2. ✅ Monitor deployment in GitHub Actions tab
3. ✅ Visit https://pompompurin.xsis.online to see changes

### 📁 File Structure Reference
```
src/
├── app/
│   ├── blog/posts/           # Blog posts (.mdx files)
│   ├── work/projects/        # Portfolio projects (.mdx files)
│   ├── gallery/              # Photo gallery
│   └── about/               # About/CV page
├── resources/
│   ├── content.tsx          # Main content configuration
│   └── once-ui.config.ts    # Design/theme settings
public/
├── images/
│   ├── avatar.jpg           # Your profile photo
│   ├── blog/               # Blog post images
│   ├── projects/           # Project images
│   └── gallery/            # Gallery photos
```

Magic Portfolio was built with [Once UI](https://once-ui.com) for [Next.js](https://nextjs.org). It requires Node.js v18.17+.

## Deployment to pompompurin.xsis.online

This project is configured for deployment to [pompompurin.xsis.online](https://pompompurin.xsis.online) using GitHub Actions and PM2 on a server with Nginx.

### Prerequisites
- Domain configured with Cloudflare (pompompurin.xsis.online)
- Server with SSH access (194.163.180.87)
- Node.js 20+ installed on server
- PM2 installed globally on server
- Nginx configured on server

### GitHub Actions Setup
1. Add the following secrets to your GitHub repository:
   - `SERVER_HOST` = 194.163.180.87
   - `SERVER_USERNAME` = pom
   - `SERVER_SSH_KEY` = (your SSH private key)
   - `SERVER_PORT` = 22

2. Push to the `main` branch to trigger the deployment workflow

### Manual Server Setup (if needed)
1. Create project directory:
   ```bash
   sudo mkdir -p /var/www/pompompurin
   sudo chown pom:pom /var/www/pompompurin
   ```

2. Clone your repository:
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/your-repo.git pompompurin
   cd pompompurin
   ```

3. Install dependencies and build:
   ```bash
   npm ci
   npm run build
   ```

4. Configure Nginx using the provided configuration file `pompompurin.xsis.online`

5. Start with PM2:
   ```bash
   pm2 start server.js --name pompompurin
   pm2 save
   ```

## Documentation

Docs available at: [docs.once-ui.com](https://docs.once-ui.com/docs/magic-portfolio/quick-start)

## Features

### Once UI
- All tokens, components & features of [Once UI](https://once-ui.com)

### SEO
- Automatic open-graph and X image generation with next/og
- Automatic schema and metadata generation based on the content file

### Design
- Responsive layout optimized for all screen sizes
- Timeless design without heavy animations and motion
- Endless customization options through [data attributes](https://once-ui.com/docs/theming)

### Content
- Render sections conditionally based on the content file
- Enable or disable pages for blog, work, gallery and about / CV
- Generate and display social links automatically
- Set up password protection for URLs

### Localization
- A localized, earlier version of Magic Portfolio is available with the next-intl library
- To use localization, switch to the 'i18n' branch

## Creators

Lorant One: [Threads](https://www.threads.net/@lorant.one) / [LinkedIn](https://www.linkedin.com/in/lorant-one/)

## Get involved

- Join the Design Engineers Club on [Discord](https://discord.com/invite/5EyAQ4eNdS) and share your project with us!
- Deployed your docs? Share it on the [Once UI Hub](https://once-ui.com/hub) too! We feature our favorite apps on our landing page.

## License

Distributed under the CC BY-NC 4.0 License.
- Attribution is required.
- Commercial usage is not allowed.
- You can extend the license to [Dopler CC](https://dopler.app/license) by purchasing a [Once UI Pro](https://once-ui.com/pricing) license.

See `LICENSE.txt` for more information.

## Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fonce-ui-system%2Fmagic-portfolio&project-name=portfolio&repository-name=portfolio&redirect-url=https%3A%2F%2Fgithub.com%2Fonce-ui-system%2Fmagic-portfolio&demo-title=Magic%20Portfolio&demo-description=Showcase%20your%20designers%20or%20developer%20portfolio&demo-url=https%3A%2F%2Fdemo.magic-portfolio.com&demo-image=%2F%2Fraw.githubusercontent.com%2Fonce-ui-system%2Fmagic-portfolio%2Fmain%2Fpublic%2Fimages%2Fog%2Fhome.jpg)
