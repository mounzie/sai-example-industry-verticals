'use client';

import React, { JSX, useState } from 'react';
import clsx from 'clsx';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
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
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`component header smc-header ${styles ?? ''}`} id={id}>
      <div className="smc-header__bar">
        {/* Logos are Image components added here by authors, so they can come from DAM */}
        <div className="smc-header__lockup">
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>

        <nav
          id="smc-header-nav"
          className={clsx('smc-header__nav', isMenuOpen && 'is-open')}
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
