import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

function extractSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const numberedH2 = line.match(/^## (\d+)\.\s+(.+)/);
    const prereqH2 = line.match(/^## Prerequisites\b/);

    if (numberedH2) {
      if (current) sections.push(current);
      const number = numberedH2[1];
      current = {
        id: `section-${number}`,
        number,
        title: numberedH2[2],
        lines: [line],
      };
    } else if (prereqH2) {
      if (current) sections.push(current);
      current = {
        id: 'section-prerequisites',
        number: '',
        title: 'Prerequisites',
        isPrerequisites: true,
        lines: [line],
      };
    } else if (current) {
      current.lines.push(line);
    } else {
      if (!sections.length && !current) {
        current = {
          id: 'intro',
          number: '',
          title: 'Introduction',
          lines: [line],
          isIntro: true,
        };
      } else if (current) {
        current.lines.push(line);
      }
    }
  }
  if (current) sections.push(current);

  return { sections };
}

function HeadingRenderer({ level, children }) {
  const text = typeof children === 'string'
    ? children
    : React.Children.toArray(children)
        .map((c) => (typeof c === 'string' ? c : c?.props?.children || ''))
        .join('');

  if (level === 2) {
    const numberMatch = text.match(/^(\d+)\.\s+(.+)/);
    const prereqMatch = text.match(/^Prerequisites\s*[—–-]\s*(.+)/);

    if (numberMatch) {
      return (
        <h2 id={`section-${numberMatch[1]}`}>
          <span className="section-number">{numberMatch[1]}</span>
          {numberMatch[2]}
        </h2>
      );
    }

    if (prereqMatch) {
      return <h2 id="section-prerequisites">{text}</h2>;
    }

    return <h2>{children}</h2>;
  }

  if (level === 1) return <h1>{children}</h1>;
  if (level === 3) return <h3>{children}</h3>;
  if (level === 4) return <h4>{children}</h4>;
  return React.createElement(`h${level}`, {}, children);
}

function TableRenderer({ children }) {
  return (
    <div className="table-container">
      <table>{children}</table>
    </div>
  );
}

function LinkRenderer({ href, children }) {
  const isExternal =
    href && (href.startsWith('http://') || href.startsWith('https://'));
  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

function PreRenderer({ children }) {
  const child = React.Children.toArray(children).find(
    (c) => React.isValidElement(c)
  );
  if (child && child.props) {
    return (
      <CodeBlock className={child.props.className}>
        {child.props.children}
      </CodeBlock>
    );
  }
  return <CodeBlock>{children}</CodeBlock>;
}

function InlineCodeRenderer({ className, children, ...props }) {
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

function ListRenderer({ children, ordered, className }) {
  if (ordered) {
    return <ol className={className}>{children}</ol>;
  }
  return <ul className={className}>{children}</ul>;
}

function ListItemRenderer({ children, checked, ...props }) {
  if (typeof checked === 'boolean') {
    return null;
  }
  return <li {...props}>{children}</li>;
}

function ChecklistItem({ label, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <li className="checklist-item">
      <button
        className={`checklist-checkbox${checked ? ' checked' : ''}`}
        onClick={() => setChecked(!checked)}
        aria-label={checked ? 'Uncheck item' : 'Check item'}
        type="button"
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6l2.5 2.5 4.5-5" />
        </svg>
      </button>
      <span className="checklist-label">{label}</span>
    </li>
  );
}

function parseChecklist(content) {
  const items = [];
  for (const line of content.split('\n')) {
    const match = line.match(/^- \[([ xX])\]\s+(.+)/);
    if (match) {
      items.push({ checked: match[1] !== ' ', label: match[2] });
    }
  }
  return items;
}

const markdownComponents = {
  h1: (p) => <HeadingRenderer level={1} {...p} />,
  h2: (p) => <HeadingRenderer level={2} {...p} />,
  h3: (p) => <HeadingRenderer level={3} {...p} />,
  h4: (p) => <HeadingRenderer level={4} {...p} />,
  table: TableRenderer,
  a: LinkRenderer,
  pre: PreRenderer,
  code: InlineCodeRenderer,
  ul: ListRenderer,
  li: ListItemRenderer,
};

function SectionContent({ markdown }) {
  const checklistRegex = /(?:^|\n)((?:- \[[ xX]\]\s+.+\n?)+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = checklistRegex.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'md', content: markdown.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'checklist', content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < markdown.length) {
    parts.push({ type: 'md', content: markdown.slice(lastIndex) });
  }

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'checklist') {
          const items = parseChecklist(part.content);
          return (
            <ul className="checklist" key={i}>
              {items.map((item, j) => (
                <ChecklistItem
                  key={j}
                  label={item.label}
                  defaultChecked={item.checked}
                />
              ))}
            </ul>
          );
        }
        return (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {part.content}
          </ReactMarkdown>
        );
      })}
    </>
  );
}

export { extractSections };

export default function MarkdownRenderer({ markdown }) {
  const { sections } = extractSections(markdown);

  return (
    <div className="markdown-body">
      {sections.map((section, i) => (
        <div
          key={section.id}
          className={section.isIntro ? 'intro-block' : 'section-block'}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <SectionContent markdown={section.lines.join('\n')} />
        </div>
      ))}
    </div>
  );
}
