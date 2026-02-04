# Daniel Wanjala - Portfolio Website

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎯 Overview

Professional portfolio website showcasing my expertise as a Data Scientist and Machine Learning Engineer. Built with pure HTML, CSS, and JavaScript - no frameworks, just clean, performant code.

## ✨ Features

### 🎨 Design & UX
- **Modern, Award-Winning UI** - Clean, professional design
- **Dark/Light Mode** - System preference detection + manual toggle
- **Fully Responsive** - Perfect on all devices (mobile-first approach)
- **Smooth Animations** - GSAP, AOS, Particles.js, Typed.js
- **Fast Loading** - Optimized performance, lazy loading

### 🛠️ Technical Features
- **Pure Vanilla JavaScript** (ES6+) - No jQuery
- **CSS Grid & Flexbox** - Modern, flexible layouts
- **CSS Custom Properties** - Dynamic theming
- **Semantic HTML5** - SEO optimized
- **Accessibility** - WCAG AA compliant
- **Progressive Enhancement** - Works without JS

### 📱 Sections
1. **Hero** - Particle background, typing effect, CTA buttons
2. **Stats** - Animated counters (years, projects, certifications)
3. **Featured Projects** - Top 3 ML/AI projects with tech tags
4. **Tech Stack** - Visual display of technologies
5. **Experience** - Professional journey
6. **Skills** - Programming, ML, Tools
7. **Certifications** - Credentials & achievements
8. **Contact** - EmailJS integration

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/MadScie254/portfolio.git
cd portfolio
```

### 2. Open in Browser
Simply open `index.html` in your browser. No build process required!

### 3. Live Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using VS Code Live Server extension
# Right-click index.html > Open with Live Server
```

Visit `http://localhost:8000`

## 📁 Project Structure

```
portfolio/
├── index.html                 # Main landing page
├── about.html                 # About me page
├── projects.html              # Projects showcase
├── experience.html            # Work experience
├── skills.html                # Skills & expertise
├── certifications.html        # Certifications
├── contact.html               # Contact form
│
├── assets/
│   ├── css/
│   │   ├── main.css          # Core styles & variables
│   │   ├── components.css    # Component-specific styles
│   │   └── responsive.css    # Media queries
│   │
│   ├── js/
│   │   ├── main.js           # Core functionality
│   │   ├── data.js           # Portfolio data
│   │   ├── navigation.js     # Nav & menu logic
│   │   ├── theme.js          # Dark mode toggle
│   │   ├── animations.js     # GSAP animations
│   │   └── contact-form.js   # Form handling
│   │
│   ├── images/               # Images & icons
│   └── files/                # Resume PDF
│
└── README.md
```

## 🎨 Customization

### Update Personal Information
Edit `assets/js/data.js`:
```javascript
const personalInfo = {
  name: "Your Name",
  title: "Your Title",
  email: "your@email.com",
  // ... etc
};
```

### Add Projects
```javascript
const projects = [
  {
    name: "Project Name",
    description: "Project description",
    techStack: ["Tech1", "Tech2"],
    github: "github-url",
    demo: "demo-url",
    featured: true
  }
];
```

### Modify Color Scheme
Edit CSS custom properties in `assets/css/main.css`:
```css
:root {
  --primary: #3b82f6;        /* Change primary color */
  --accent: #06b6d4;         /* Change accent color */
  /* ... other colors */
}
```

## 📧 Contact Form Setup

### Using EmailJS (Free)
1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Create email service & template
3. Get your credentials
4. Update `assets/js/contact-form.js`:
```javascript
emailjs.init('YOUR_PUBLIC_KEY');
// ...
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData);
```

## 🌐 Deployment

### GitHub Pages
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
Enable GitHub Pages in repository settings.

### Netlify
```bash
# Drop folder in Netlify or use CLI
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

## 📦 Technologies Used

### Core
- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript (ES6+)

### Libraries (CDN)
- **AOS** - Scroll animations
- **Particles.js** - Background particles
- **Typed.js** - Typing effect
- **GSAP** - Advanced animations
- **EmailJS** - Contact form emails

### Fonts
- Inter (Sans-serif)
- JetBrains Mono (Monospace)

## 🎯 Performance

- ✅ Lighthouse Score: 95+
- ✅ Mobile-First Responsive
- ✅ Fast Load Times
- ✅ SEO Optimized
- ✅ Accessible (WCAG AA)

## 📝 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Daniel Wanjala Machimbo**
- GitHub: [@MadScie254](https://github.com/MadScie254)
- LinkedIn: [daniel-wanjala](https://linkedin.com/in/daniel-wanjala-912b8b17b)
- Email: dmwanjala254@gmail.com

## 🙏 Acknowledgments

- Icons: Heroicons (Tailwind)
- Fonts: Google Fonts
- Inspiration: Awwwards.com portfolios

---

⭐ **Star this repo if you found it helpful!**
