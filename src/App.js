import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MarkdownRenderer, { extractSections } from './components/MarkdownRenderer';

function parseSectionsForSidebar(markdown, isUnlocked) {
  const { sections, lockedSectionEntries } = extractSections(markdown);
  const navSections = sections
    .filter((s) => !s.isIntro)
    .map((s) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      isPrerequisites: !!s.isPrerequisites,
      locked: false,
    }));

  for (const entry of lockedSectionEntries) {
    navSections.push({
      id: entry.id,
      number: entry.number,
      title: entry.title,
      isPrerequisites: false,
      locked: !isUnlocked,
    });
  }

  return navSections;
}

export default function App() {
  const [markdown, setMarkdown] = useState('');
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [scrollPercent, setScrollPercent] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    fetch('/content.md')
      .then((res) => res.text())
      .then((text) => {
        setMarkdown(text);
        setSections(parseSectionsForSidebar(text, false));
      });
  }, []);

  useEffect(() => {
    if (markdown) {
      setSections(parseSectionsForSidebar(markdown, unlocked));
    }
  }, [unlocked, markdown]);

  useEffect(() => {
    if (!sections.length) return;

    const observable = unlocked
      ? sections
      : sections.filter((s) => !s.locked);
    if (!observable.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    const timer = setTimeout(() => {
      observable.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [sections, unlocked]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      setScrollPercent(Math.min(100, (scrollTop / docHeight) * 100));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div className="progress-bar" style={{ width: `${scrollPercent}%` }} />
      <Header />
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileMenuOpen ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      <div className="app-layout">
        <Sidebar
          sections={sections}
          activeId={activeId}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          scrollPercent={scrollPercent}
        />
        <main className="main-content">
          <div className="main-content-inner">
            {markdown && (
              <MarkdownRenderer
                markdown={markdown}
                unlocked={unlocked}
                onUnlock={() => setUnlocked(true)}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
