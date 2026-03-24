import React, { useState, useCallback, useSyncExternalStore } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import { a11yLight, a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);

const darkQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null;

function subscribeToDarkMode(callback) {
  darkQuery?.addEventListener('change', callback);
  return () => darkQuery?.removeEventListener('change', callback);
}

function getIsDark() {
  return darkQuery?.matches ?? false;
}

function useDarkMode() {
  return useSyncExternalStore(subscribeToDarkMode, getIsDark);
}

const customStyle = {
  background: 'transparent',
  padding: '20px 24px',
  margin: 0,
  fontSize: '0.8125rem',
  lineHeight: '1.6',
  fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
};

export default function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const isDark = useDarkMode();
  const code = String(children).replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        {language && <span className="code-block-language">{language}</span>}
        <button
          className={`code-block-copy${copied ? ' copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'plaintext'}
        style={isDark ? a11yDark : a11yLight}
        customStyle={customStyle}
        codeTagProps={{
          style: {
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            fontSize: '0.8125rem',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
