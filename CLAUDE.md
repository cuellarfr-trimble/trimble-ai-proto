# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lista Payroll Design Playbook — a single-page React app serving as an interactive guide for designers/PMs learning to prototype with AI tools (Cursor). Content is entirely driven by a markdown file (`public/content.md`), making it editable without touching code.

## Commands

- **Dev server:** `npm start` (runs on localhost:3000)
- **Build:** `npm run build`
- **Test:** `npm test` (runs react-scripts test in watch mode)
- **Deploy to GitHub Pages:** `npm run deploy` (builds then pushes to gh-pages branch)

## Architecture

**Data flow:** `App.js` fetches `public/content.md` at runtime → `extractSections()` parses h2 headings into sidebar nav items → `MarkdownRenderer` renders content with custom component handlers → `IntersectionObserver` scroll spy updates active sidebar item.

**Layout:** Fixed header (56px) + fixed sidebar (256px) + main content area (max 720px). Mobile breakpoint at 768px collapses sidebar into hamburger menu.

**Components (`src/components/`):**
- `Header.js` — fixed top bar with title and last-updated date
- `Sidebar.js` — auto-generated navigation from h2 headings, scroll progress indicator
- `MarkdownRenderer.js` — core rendering with custom handlers for headings, code blocks, tables, blockquotes, checklists, and links
- `CodeBlock.js` — syntax-highlighted code blocks (react-syntax-highlighter, a11yDark theme) with copy-to-clipboard

**Key patterns:**
- Section extraction uses regex on numbered h2s (`## 1. Title`) to build nav
- Checklists parsed from `- [ ]` syntax with interactive checkbox state
- Staggered fade-up animations on section load (`animationDelay: ${i * 0.08}s`)
- Dark/light mode follows OS preference via CSS custom properties

## Design System

- **Theme:** Dark-first with red accent `#E53935`
- **Typography:** System fonts (Helvetica Neue); monospace (SF Mono / Fira Code)
- **Spacing:** 8px base grid
- **Styling:** Vanilla CSS with CSS variables (no CSS-in-JS)
- **Tone:** Minimal, premium developer tool aesthetic — whitespace over decoration

## Content Editing

All playbook content lives in `public/content.md`. The app dynamically generates navigation from h2 headings. No code changes needed to update guide content.
