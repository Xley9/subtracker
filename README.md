# SubTracker — Universal Subscription Tracker

**Keep track of all your subscriptions in one place. Free, private, no sign-up required.**

SubTracker is a lightweight Progressive Web App (PWA) that helps you monitor every recurring payment you make — from streaming services and software licenses to gym memberships and magazine subscriptions. It runs entirely in your browser with zero server infrastructure, meaning your financial data never leaves your device.

---

## The Problem

The average internet user today pays for 5–20+ subscription services. Over time, people lose track of what they are paying for, when renewals happen, and how much money is going out every month. Studies show that roughly 20–30% of subscription spending goes toward services that are rarely or never used.

There is no simple, universal, privacy-respecting tool that solves this for everyone — regardless of their bank, country, or technical skill level.

## The Solution

SubTracker gives you a single dashboard where you can:

- **See your total monthly and yearly cost** at a glance
- **Add subscriptions in seconds** using pre-built templates (Netflix, Spotify, Adobe, etc.) or manual entry
- **Get reminded before renewals** so you can cancel what you don't need
- **Identify forgotten or unused subscriptions** before they silently charge you again
- **Export and import your data** as a JSON file for backups or switching devices

All of this without creating an account, sharing personal information, or installing anything.

---

## Features

### Core
- **Add / Edit / Delete subscriptions** — name, price, billing cycle, renewal date, category, notes
- **Dashboard** — real-time overview of monthly cost, yearly cost, and active subscription count
- **Next renewal alert** — always know which payment is coming up next

### Templates
- 20+ pre-built subscription templates with icons — just tap and adjust the price
- Covers streaming, music, software, gaming, fitness, news, and cloud services

### Privacy & Data
- **100% local storage** — all data is stored in your browser (LocalStorage)
- **No backend, no database, no tracking** — zero network requests
- **JSON export/import** — full backup and restore functionality
- **Open source** — inspect the code yourself

### Design
- **Dark and Light mode** — auto-detects your system preference, toggleable manually
- **Fully responsive** — works on phones, tablets, and desktops
- **PWA-ready** — install it on your home screen like a native app
- **Multi-currency support** — EUR, USD, GBP, TRY, CHF

### Accessibility
- **No registration** — open the page and start using it immediately
- **No technical knowledge required** — large buttons, clear labels, minimal UI
- **Onboarding** — a simple 3-step introduction shown on first visit
- **Keyboard support** — Escape to close modals, standard form navigation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Logic | Vanilla JavaScript (ES6+, no frameworks) |
| Storage | Browser LocalStorage |
| App Model | Progressive Web App (PWA) |
| Hosting | GitHub Pages (static, free) |

No build tools. No dependencies. No npm. Just open `index.html` and it works.

---

## Getting Started

### Use it online
Visit the hosted version (GitHub Pages):
**https://xley9.github.io/subtracker/**

### Run it locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Xley9/subtracker.git
   ```
2. Open `index.html` in your browser. That's it.

There is no build step, no server to start, no configuration needed.

---

## Project Structure

```
subtracker/
├── index.html          # Main application page
├── manifest.json       # PWA manifest
├── css/
│   └── style.css       # All styles (light/dark themes, responsive)
├── js/
│   ├── app.js          # Core application logic (CRUD, storage, UI)
│   └── templates.js    # Pre-built subscription templates and constants
├── img/
│   └── favicon.svg     # App icon
├── LICENSE             # MIT License
└── README.md
```

---

## Data Privacy

SubTracker was designed with a strict privacy-first approach:

- **No data is transmitted.** The app makes zero network requests. Your subscription data exists only in your browser's LocalStorage.
- **No analytics, no cookies, no fingerprinting.** There is nothing to track because there is no server.
- **You own your data.** Export it anytime as a JSON file. Delete it by clearing your browser data.
- **Open source.** Every line of code is visible in this repository. You can verify there is no hidden data collection.

---

## Browser Support

SubTracker works in all modern browsers:

- Chrome / Edge (full PWA support, notifications)
- Firefox (full support, limited PWA install)
- Safari / iOS Safari (full support, add to home screen)
- Opera, Brave, Vivaldi

---

## Contributing

Contributions are welcome. If you want to add a feature, fix a bug, or improve translations:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

Please keep the codebase simple — no frameworks, no build tools, no unnecessary dependencies.

---

## Roadmap

- [ ] Multi-language support (German, English, Turkish, Spanish, French)
- [ ] Spending charts and trends over time
- [ ] Category-based spending breakdown
- [ ] Recurring reminder notifications (Service Worker)
- [ ] Shareable subscription lists
- [ ] More currency options

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Built with simplicity in mind. No sign-up. No tracking. Just clarity over your subscriptions.**
