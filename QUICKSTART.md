# 🚀 QUICK START GUIDE

## Your Portfolio is Ready!

Location: `c:\Users\MadScie254\Documents\GitHub\MadScie254\portfolio`

---

## 🎯 STEP 1: View Your Portfolio

### Method A: Direct Open
1. Go to the portfolio folder
2. Double-click `SETUP.html` to open setup guide
3. Click "Launch Portfolio" button to see your site

### Method B: Live Server (Recommended)
Open terminal in VS Code and run:
```powershell
cd "c:\Users\MadScie254\Documents\GitHub\MadScie254\portfolio"
# Use Live Server extension or run:
python -m http.server 8000
```
Then open: http://localhost:8000

---

## ✏️ STEP 2: Customize Your Content

### Update Personal Information
File: `assets/js/data.js`

Find and update:
```javascript
const personalInfo = {
  name: "Daniel Wanjala Machimbo",
  title: "Data Scientist / ML Engineer",
  email: "dmwanjala254@gmail.com",
  phone: "+254 742 007 277",
  // ... update with your info
};
```

### Add/Edit Projects
Same file (`assets/js/data.js`):
```javascript
const projects = [
  {
    name: "Your Project Name",
    description: "Project description here",
    techStack: ["Python", "TensorFlow", "etc"],
    github: "https://github.com/your-repo",
    demo: "https://your-demo.com",
    featured: true  // Show on homepage
  }
  // Add more projects...
];
```

---

## 📁 STEP 3: Add Your Assets

### Required Files

1. **Resume** (Important!)
   - File: `assets/files/Daniel_Wanjala_Resume.pdf`
   - Format: PDF
   - Action: Replace with your resume

2. **Profile Photo**
   - File: `assets/images/profile.jpg`
   - Size: 400x400px recommended
   - Format: JPG or PNG

3. **Project Images**
   - Location: `assets/images/projects/`
   - Name format: `project-name.jpg`
   - Size: 1200x600px recommended

4. **Favicon**
   - Generate at: https://favicon.io
   - Add to: `assets/images/icons/`

---

## 🎨 STEP 4: Customize Colors

File: `assets/css/main.css`

Find the `:root` section:
```css
:root {
  --primary: #3b82f6;     /* Change main color */
  --accent: #06b6d4;      /* Change accent color */
  
  /* You can also customize: */
  --background: #ffffff;
  --text-primary: #0f172a;
  /* etc... */
}
```

---

## 📧 STEP 5: Setup Contact Form (Optional)

1. **Sign up** at https://www.emailjs.com (free)

2. **Create Email Service**
   - Add your email provider (Gmail, Outlook, etc.)
   - Note your Service ID

3. **Create Email Template**
   - Use these variables: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
   - Note your Template ID

4. **Get Public Key**
   - Go to Account → API Keys
   - Copy your Public Key

5. **Update contact-form.js**
   File: `assets/js/contact-form.js`
   
   Find and uncomment these lines:
   ```javascript
   // Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID
   emailjs.init('YOUR_PUBLIC_KEY');
   
   // In the submit handler:
   await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData);
   ```

---

## 🌐 STEP 6: Deploy Your Website

### Option 1: GitHub Pages (Recommended)

```powershell
# In your terminal:
cd "c:\Users\MadScie254\Documents\GitHub\MadScie254"

# Add files
git add portfolio/

# Commit
git commit -m "Add professional portfolio website"

# Push
git push origin main
```

Then:
1. Go to GitHub repository settings
2. Click "Pages" in sidebar
3. Select branch: `main`
4. Select folder: `/portfolio` (or `/root` if you moved files)
5. Click "Save"

Your site will be live at: `https://madscie254.github.io/portfolio/`

### Option 2: Netlify

1. Go to https://app.netlify.com
2. Drag & drop your `portfolio` folder
3. Done! Get instant URL

### Option 3: Vercel

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "c:\Users\MadScie254\Documents\GitHub\MadScie254\portfolio"
vercel --prod
```

---

## 🧪 STEP 7: Test Everything

### Before Going Live

- [ ] **Mobile Responsive**
  - Resize browser to check mobile view
  - Test on actual phone

- [ ] **Dark Mode**
  - Click moon/sun icon
  - Check all sections look good

- [ ] **Links**
  - Test all navigation links
  - Test social media links
  - Test GitHub project links

- [ ] **Contact Form**
  - Fill out and submit
  - Check if email arrives

- [ ] **Performance**
  - Run Lighthouse audit (F12 → Lighthouse)
  - Aim for 90+ scores

- [ ] **Content**
  - Proofread all text
  - Check spelling
  - Verify dates are current

---

## 🎨 Customization Tips

### Change Hero Background
Edit `assets/js/main.js` - Particles.js config:
```javascript
particlesJS('particles-js', {
  particles: {
    color: { value: '#3b82f6' },  // Change particle color
    number: { value: 80 },         // Change particle count
    // ... other options
  }
});
```

### Change Typing Effect Words
Edit `assets/js/main.js`:
```javascript
new Typed('#typed', {
  strings: [
    'Data Scientist',      // Add your titles
    'ML Engineer',
    'Your Custom Title'
  ],
  typeSpeed: 50,
  // ...
});
```

### Add More Sections
1. Copy section structure from `index.html`
2. Add your content
3. Style in `assets/css/main.css`

---

## 📊 Project Structure

```
portfolio/
├── index.html              ← Main page (START HERE)
├── SETUP.html             ← Setup guide (OPEN FIRST)
├── README.md              ← Full documentation
├── PROJECT_SUMMARY.md     ← This file
│
├── assets/
│   ├── css/
│   │   ├── main.css       ← Main styles
│   │   ├── components.css ← UI components
│   │   └── responsive.css ← Mobile styles
│   │
│   ├── js/
│   │   ├── data.js        ← YOUR DATA (edit this!)
│   │   ├── main.js        ← Core functionality
│   │   ├── navigation.js  ← Menu logic
│   │   ├── theme.js       ← Dark mode
│   │   ├── animations.js  ← GSAP animations
│   │   └── contact-form.js← Email form
│   │
│   ├── images/            ← Add your images
│   └── files/             ← Add your resume
│
└── data/                  ← JSON data files
    ├── projects.json
    ├── experience.json
    ├── skills.json
    └── certifications.json
```

---

## 🆘 Troubleshooting

### Portfolio Won't Open
- Make sure you're opening `index.html` or using a live server
- Don't open from File Explorer directly - use browser

### Animations Not Working
- Check browser console (F12) for errors
- Ensure internet connection (CDN libraries)
- Try different browser

### Dark Mode Not Saving
- Check browser local storage permissions
- Try clearing cache and reload

### Contact Form Not Sending
- Verify EmailJS configuration
- Check API keys are correct
- Look for errors in console (F12)

---

## 📚 Additional Resources

### Learn More
- HTML/CSS: [MDN Web Docs](https://developer.mozilla.org)
- JavaScript: [JavaScript.info](https://javascript.info)
- GSAP: [GreenSock Docs](https://greensock.com/docs/)

### Tools
- Favicon Generator: https://favicon.io
- Image Optimizer: https://tinypng.com
- Color Picker: https://coolors.co
- Font Pairs: https://fontpair.co

---

## ✅ Success Checklist

Complete these before going live:

- [ ] Updated all personal information in `data.js`
- [ ] Added resume PDF
- [ ] Added profile photo
- [ ] Added project images
- [ ] Generated and added favicon
- [ ] Customized colors (optional)
- [ ] Configured EmailJS (optional)
- [ ] Tested on mobile
- [ ] Tested dark/light mode
- [ ] Checked all links work
- [ ] Proofread all content
- [ ] Ran Lighthouse audit
- [ ] Deployed to hosting
- [ ] Shared with friends! 🎉

---

## 🎊 You're Done!

Your professional portfolio is ready to showcase your amazing work!

**Next Actions:**
1. Open `SETUP.html` for visual guide
2. Open `index.html` to see your portfolio
3. Edit `assets/js/data.js` to customize
4. Add your assets (resume, photos)
5. Deploy and share!

---

**Questions or Issues?**

Check the full documentation in `README.md`

**Contact:**
- Email: dmwanjala254@gmail.com
- GitHub: @MadScie254

---

*Built with ❤️ | Award-Winning Design | Production-Ready*
