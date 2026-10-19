'use client';

import React, { JSX, useEffect, useState } from 'react';

type SmcCountdownProps = {
  /** ISO date string the countdown runs to */
  target?: string;
};

const UNITS = [
  { label: 'Days', ms: 86400000, mod: Infinity },
  { label: 'Hours', ms: 3600000, mod: 24 },
  { label: 'Min', ms: 60000, mod: 60 },
  { label: 'Sec', ms: 1000, mod: 60 },
];

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

export const SmcCountdown = ({ target }: SmcCountdownProps): JSX.Element | null => {
  // Render placeholders on the server, then tick on the client to avoid hydration mismatches
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const targetTime = target ? new Date(target).getTime() : NaN;
  if (Number.isNaN(targetTime)) return null;

  const diff = now === null ? null : Math.max(0, targetTime - now);

  return (
    <div className="smc-countdown">
      {UNITS.map((unit, i) => {
        const value = diff === null ? null : Math.floor(diff / unit.ms) % unit.mod;
        return (
          <div key={unit.label} className="smc-countdown__unit">
            <div className="smc-countdown__value smc-disp">
              {value === null ? '--' : i === 0 ? value : pad(value)}
            </div>
            <div className="smc-countdown__label">{unit.label}</div>
          </div>
        );
      })}
    </div>
  );
};
