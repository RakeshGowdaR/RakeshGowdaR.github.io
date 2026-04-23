# Rakesh Gowdar — Portfolio

Senior Flutter Engineer portfolio with interactive demos, developer terminal, and smooth animations.

## 🚀 Deploy to GitHub Pages

### Option A — Automatic (Recommended)
1. Push this repo to `github.com/rakeshgowdar/rakeshgowdar.github.io`
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Push to `main` branch — it deploys automatically via `.github/workflows/deploy.yml`
4. Live at: `https://rakeshgowdar.github.io`

### Option B — Manual (fastest)
1. Push repo to GitHub
2. Go to **Settings → Pages**
3. Set **Source** to `Deploy from a branch`
4. Select `main` branch, `/ (root)` folder
5. Click Save → live in ~60 seconds

## 📁 File Structure
```
portfolio/
├── index.html              # Main HTML
├── css/
│   └── style.css           # All styles + design tokens
├── js/
│   └── main.js             # All interactivity
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deploy action
└── README.md
```

## ✨ Features
- **Developer Terminal** — type `whoami`, `skills`, `projects`, `contact`, `flutter`, `help`
- **Snake Game** — playable canvas game (WASD / Arrow keys / mobile buttons)
- **App Simulator** — clickable Flutter-style mobile UI mockup
- **Live API Explorer** — fetch real joke/crypto/GitHub APIs
- **Flutter Curves Demo** — Spring, Ease Out, Bounce, Pulse, Slide animations
- **Interactive Projects** — hover + expand for details
- **Animated Timeline** — scroll-triggered work history
- **Animated Skill Bars** — scroll into view to trigger
- **Custom Cursor** — glowing dot + ring (desktop)
- **Konami Code Easter Egg** — ↑↑↓↓←→←→BA

## 🛠️ Customization
- Edit personal info in `index.html`
- Tweak colors via CSS variables in `css/style.css` (`:root` block)
- Update terminal commands in `js/main.js` (the `commands` object in `initTerminal()`)

## 📞 No dependencies required — pure HTML/CSS/JS, zero build step.
