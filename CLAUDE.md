# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Create optimized production build to /dist
npm run preview  # Preview production build locally
```

No test framework is configured.

## Architecture

This is a **frontend-only React SPA** built with Vite. It's a public transparency compliance portal for the municipality of Parintins, Brazil.

All application data is **hardcoded directly in [src/App.jsx](src/App.jsx)** — there is no backend, no API, and no external data source. The portal tracks compliance with Brazilian public transparency requirements across 9 categories.

### Key files

- [src/App.jsx](src/App.jsx) — Contains all static data (`topLinks`, `navItems`, `cards` array) and the main layout. This is where content changes happen.
- [src/Card.jsx](src/Card.jsx) — Reusable expandable card component. Renders criteria items with status icons (check, x, dash).
- [src/styles.css](src/styles.css) — All styling using CSS custom properties. Responsive breakpoint at `max-width: 820px`.

### Data model

Each entry in the `cards` array in App.jsx has this shape:

```js
{
  title: string,
  description: string,
  icon: string,          // Bootstrap Icons class name (e.g. "bi-bar-chart")
  tone: string,          // CSS color token (e.g. "blue", "yellow")
  features: [
    {
      name: string,
      subitems: [
        { label: string, status: "check" | "x" | "dash" }
      ]
    }
  ]
}
```

### External dependencies (CDN)

Bootstrap Icons and Google Fonts (Manrope, Sora) are loaded via CDN in [index.html](index.html) — not bundled via npm.

### Hard-coded external URLs

- Logo: `https://acheitudo.com.br/images/logo.png`
- Transparency portal link: `https://transparencia.parintins.am.gov.br/`
