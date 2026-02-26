# AI Prototyping Guide for Designers

A practical, interactive guide for designers learning to build real prototypes with Claude Code and Cursor. Built by the design team at [Savvy Wealth](https://www.savvywealth.com).

**[View the live guide →](https://savvy-s-ai-prototyping-guide.vercel.app/)**

---

## What this is

Most AI prototyping guides stop at Figma plugins and prompt tips. This one goes further — it's designed to get designers comfortable with Terminal, local development environments, and AI-assisted code so they can build and ship working prototypes without waiting on engineering.

It covers:
- Getting comfortable with Terminal
- Setting up a local dev environment with Homebrew and Node.js
- Building prototypes with Claude Code and Cursor
- Connecting Claude Code to Figma for bidirectional prototyping
- Deploying to Vercel and sharing a real URL
- Using AI tools efficiently — model selection and credit management

---

## Who it's for

Designers and PMs who want to go beyond Figma and build things that feel real. No coding background required — the guide assumes you're starting from zero.

---

## Running it locally

```bash
git clone https://github.com/monicycle/Savvy-s-AI-Prototyping-Guide.git
cd Savvy-s-AI-Prototyping-Guide
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Updating the content

All guide content lives in one file:

```
public/content.md
```

Edit that file and refresh your browser — no code changes needed. The app fetches and renders the markdown at runtime.

---

## Stack

- React (Create React App)
- `react-markdown` + `remark-gfm` for markdown rendering
- `react-syntax-highlighter` for code blocks
- Deployed on Vercel

---

## About

Built by Monica, Design Manager at Savvy Wealth, as part of an initiative to get the design team building real, shareable prototypes using AI tools. The guide itself was built using the exact workflow it teaches — Claude Code and Cursor.

Feel free to fork it and adapt it for your own team.

---

*Questions or suggestions? Open an issue or reach out on [LinkedIn](https://www.linkedin.com/in/monicafinc/).*
