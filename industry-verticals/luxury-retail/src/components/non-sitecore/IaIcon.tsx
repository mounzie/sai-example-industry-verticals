import React, { JSX } from 'react';

// Outline icons used across the IA components, matching ia.gov.sa's line style.
// Authors pick one by name (e.g. in an IA Service's Icon field).
const PATHS: Record<string, string[]> = {
  heart: [
    'M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z',
    'M8.5 12h2l1-2 2 4 1-2h1.5',
  ],
  document: ['M7 3h7l4 4v14H7z', 'M14 3v4h4', 'M10 11h5M10 14h5M10 17h3'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M5 21a7 7 0 0 1 14 0'],
  badge: [
    'M12 3l2.4 1.8 3-.2.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.2L12 21l-2.4-1.8-3 .2-.9-2.9L3.3 14.7l1-2.8-1-2.8 2.4-1.8.9-2.9 3 .2z',
    'M8.5 12l2.5 2.5 4.5-5',
  ],
  building: ['M4 21V6l8-3 8 3v15', 'M9 21v-5h6v5', 'M8 9h2M14 9h2M8 12h2M14 12h2'],
  idcard: [
    'M3 6h18v12H3z',
    'M8 11a2 2 0 1 0 0-.01',
    'M5.5 16a2.5 2.5 0 0 1 5 0',
    'M13 10h5M13 13h4',
  ],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5'],
  award: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M8.5 13.5L7 21l5-3 5 3-1.5-7.5'],
  list: ['M9 6h11M9 12h11M9 18h11', 'M4 6h.01M4 12h.01M4 18h.01'],
  coins: [
    'M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z',
    'M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7',
    'M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5',
  ],
  briefcase: ['M3 8h18v12H3z', 'M8 8V5h8v3', 'M3 13h18', 'M11 13v2h2v-2'],
  users: [
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    'M2.5 20a6.5 6.5 0 0 1 13 0',
    'M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6 6 0 0 1 3.5 6',
  ],
  trend: ['M3 17l6-6 4 4 8-8', 'M15 7h6v6'],
  headset: ['M4 14v-2a8 8 0 0 1 16 0v2', 'M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1z'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  video: ['M3 7h12v10H3z', 'M15 10l6-3v10l-6-3'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M20 20l-4-4'],
  translate: ['M3 5h12M9 3v2M5 5c1 4 4 7 8 8M13 5c-1 4-4 7-8 8', 'M13 21l4-9 4 9M14.5 18h5'],
  chevronDown: ['M6 9l6 6 6-6'],
  chevronLeft: ['M15 6l-6 6 6 6'],
  chevronRight: ['M9 6l6 6-6 6'],
  arrowUp: ['M12 19V5M5 12l7-7 7 7'],
  x: ['M4 4l16 16M20 4L4 20'],
  linkedin: [
    'M4 9h3v11H4zM5.5 4.5a1.5 1.5 0 1 1 0 .01',
    'M10 9h3v1.5c.6-1 1.8-1.7 3.3-1.7 2.4 0 3.7 1.5 3.7 4.2v7h-3v-6.3c0-1.3-.6-2-1.7-2s-2.3.8-2.3 2.2V20h-3z',
  ],
  instagram: ['M4 4h16v16H4z', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M17 7h.01'],
  youtube: [
    'M3 7.5C3 6 4 5 5.5 5h13C20 5 21 6 21 7.5v9c0 1.5-1 2.5-2.5 2.5h-13C4 19 3 18 3 16.5z',
    'M10 9l5 3-5 3z',
  ],
  facebook: ['M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z'],
};

type IaIconProps = {
  name?: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export const IaIcon = ({
  name,
  size = 24,
  className,
  strokeWidth = 1.7,
}: IaIconProps): JSX.Element | null => {
  const paths = PATHS[(name || '').trim()] ?? PATHS[(name || '').trim().toLowerCase()];
  if (!paths) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
};
