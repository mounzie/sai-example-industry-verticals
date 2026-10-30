import React, { JSX } from 'react';

// Line icons for the Bupa Arabia components. Authors pick one by name in an Icon field
// (e.g. "shield" on a Bupa Feature, "linkedin" on a social Bupa Link).
const PATHS: Record<string, string[]> = {
  globe: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    'M3 12h18',
    'M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z',
  ],
  shield: ['M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
  support: [
    'M4 14v-2a8 8 0 0 1 16 0v2',
    'M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1z',
    'M17 20c0 1-2 1.5-4 1.5',
  ],
  calendar: ['M4 6h16v15H4z', 'M4 10h16', 'M8 3v4M16 3v4', 'M8 14h3v3H8z'],
  video: ['M3 7h12v10H3z', 'M15 10l6-3v10l-6-3'],
  pill: ['M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7z', 'M7 10l7 7'],
  home: ['M3 11l9-7 9 7', 'M5 10v10h14V10', 'M10 20v-5h4v5'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M20 20l-4-4'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M5 21a7 7 0 0 1 14 0'],
  store: [
    'M4 9l1.5-5h13L20 9',
    'M4 9h16v2a3 3 0 0 1-5.3 2 3 3 0 0 1-5.4 0A3 3 0 0 1 4 11z',
    'M5 13v8h14v-8',
  ],
  help: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    'M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7',
    'M12 17h.01',
  ],
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  chevronDown: ['M6 9l6 6 6-6'],
  check: ['M5 12l4.5 4.5L19 7'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  close: ['M6 6l12 12M18 6L6 18'],
  translate: [
    'M4 5h9',
    'M8.5 3v2',
    'M11 5c-1 4-3.5 7-7 9',
    'M6 9c1 2 3 4 5 5',
    'M13 21l4-9 4 9',
    'M14.5 18h5',
  ],
};

// Brand marks are filled rather than outlined
const FILLED: Record<string, string> = {
  x: 'M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.3 4.7H5.5z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z',
  instagram:
    'M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1C6 19.2 4.9 18 4.8 15.6c-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6C4.9 6 6 4.9 8.4 4.8c.9-.1 1.2-.2 3.6-.2zM12 3c-2.4 0-2.8 0-3.7.1C5 3.2 3.2 5 3.1 8.3 3 9.2 3 9.6 3 12s0 2.8.1 3.7C3.2 19 5 20.8 8.3 20.9c.9.1 1.3.1 3.7.1s2.8 0 3.7-.1c3.3-.1 5.1-1.9 5.2-5.2.1-.9.1-1.3.1-3.7s0-2.8-.1-3.7C20.8 5 19 3.2 15.7 3.1 14.8 3 14.4 3 12 3z',
  facebook:
    'M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.6V13h2.7v8z',
  youtube:
    'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z',
  apple:
    'M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.9-.8-3.1-.8C6.8 7.4 5.3 8.3 4.5 9.8c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.1.8c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.7-4.1zM14.1 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z',
  play: 'M4 3.5v17c0 .6.6.9 1.1.6l15-8.5c.5-.3.5-1 0-1.2l-15-8.5C4.6 2.6 4 2.9 4 3.5z',
};

type BupaIconProps = {
  name?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export const BupaIcon = ({
  name,
  size = 24,
  strokeWidth = 1.6,
  className,
}: BupaIconProps): JSX.Element | null => {
  const key = (name || '').trim();
  const filled = FILLED[key.toLowerCase()];
  const paths = PATHS[key];
  if (!filled && !paths) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {filled ? <path d={filled} /> : paths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
};
