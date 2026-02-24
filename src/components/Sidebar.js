import React from 'react';

function ChecklistIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="14" height="14" rx="2" />
      <path d="M5 8l2 2 4-4" />
    </svg>
  );
}

export default function Sidebar({ sections, activeId, isOpen, onClose }) {
  const handleClick = (e, section) => {
    e.preventDefault();
    const el = document.getElementById(section.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (onClose) onClose();
  };

  return (
    <>
      <div
        className={`sidebar-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
      />
      <nav className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-label">Design Team</div>
        <ul className="sidebar-nav">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            const cls = isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item';

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={cls}
                  onClick={(e) => handleClick(e, section)}
                >
                  {section.isPrerequisites ? (
                    <span className="sidebar-nav-icon">
                      <ChecklistIcon />
                    </span>
                  ) : (
                    <span className="sidebar-nav-number">{section.number}</span>
                  )}
                  <span className="sidebar-nav-item-content">
                    <span className="sidebar-nav-item-row">
                      <span className="sidebar-nav-text">{section.title}</span>
                    </span>
                    {section.isPrerequisites && (
                      <span className="sidebar-start-label">Start here →</span>
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
