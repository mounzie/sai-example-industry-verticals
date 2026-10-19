'use client';

import React, { JSX, useState } from 'react';
import { ComponentProps } from '@/lib/component-props';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

const NAV_LINKS = [
  { href: '#invitation', label: 'Invitation' },
  { href: '#weekend', label: 'Your weekend' },
  { href: '#itinerary', label: 'Itinerary' },
  { href: '#pass', label: 'Pass' },
  { href: '#concierge', label: 'Concierge' },
];

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`component header smc-header ${styles ?? ''}`} id={id}>
      <div className="smc-header__bar">
        <a className="smc-header__lockup" href="#top" aria-label="Saudi Motorsport Company, home">
          <img
            className="smc-header__logo"
            src="/images/logo-smc.png"
            alt="Saudi Motorsport Company"
          />
          <span className="smc-header__divider" aria-hidden="true" />
          <img className="smc-header__f1" src="/images/logo-f1-red.png" alt="Formula 1" />
        </a>

        <nav
          id="smc-header-nav"
          className={`smc-header__nav${isMenuOpen ? ' is-open' : ''}`}
          aria-label="Main"
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="smc-header__actions">
          <span className="smc-header__pill smc-header__pill--on">EN</span>
          <span className="smc-header__pill smc-header__pill--ar" lang="ar">
            العربية
          </span>
          <button
            type="button"
            className="smc-header__menu"
            aria-expanded={isMenuOpen}
            aria-controls="smc-header-nav"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            Menu
          </button>
          <a className="smc-header__btn" href="#invitation">
            Respond
          </a>
        </div>
      </div>
    </div>
  );
};
