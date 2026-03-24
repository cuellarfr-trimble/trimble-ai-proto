# A AI Guide for Designers working on Lista Payroll

A practical, interactive guide for designers learning to build real prototypes with Cursor. Built by the design team at [Trimble](https://www.trimble.com).

**[View the live guide →](https://trimble-ai-proto.vercel.app/)**

---

## What this is

Most AI prototyping guides stop at Figma plugins and prompt tips. This one goes further — it's designed to get designers comfortable with Terminal, local development environments, and AI-assisted code so they can build and ship working prototypes without waiting on engineering.

It covers:
- Getting comfortable with Terminal
- Setting up a local dev environment with Homebrew and Node.js
- Building prototypes with Cursor
- Connecting Cursor to Figma
- Connecting Azure DevOps to Figma
- Deploying to Vercel and sharing a real URL
- Using AI tools efficiently — model selection and credit management

---

## Who it's for

Designers and PMs who want to go beyond Figma and build things that feel real. No coding background required — the guide assumes you're starting from zero.

---

## Running it locally

```bash
git clone https://github.com/cuellarfr-trimble/trimble-ai-proto.git
cd trimble-ai-proto
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

This is a fork of a guide built originall by by Monica, Design Manager at Savvy, as part of an initiative to get the design team building real, shareable prototypes using AI tools. 

---

