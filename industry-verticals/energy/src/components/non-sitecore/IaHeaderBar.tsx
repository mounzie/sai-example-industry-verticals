'use client';

import React, { JSX, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ImageField,
  Link as ContentSdkLink,
  LinkField,
  NextImage as ContentSdkImage,
} from '@sitecore-content-sdk/nextjs';
import { IaLinkFields, iaItems, useIaLabels } from './iaShared';
import { IaIcon } from './IaIcon';

type IaHeaderBarProps = {
  /** Logo image picked in Pages (e.g. from DAM) */
  logo?: ImageField;
  /** Where the logo links to, usually the homepage */
  logoLink?: LinkField;
  /** Multilist of IA Link items; each can carry dropdown SubLinks */
  navLinks: unknown;
  searchLink?: LinkField;
};

const LANGUAGES = [
  { locale: 'ar-SA', short: 'عربي', lang: 'ar' },
  { locale: 'en', short: 'English', lang: 'en' },
];

/** The ia.gov.sa main bar: logo, menu with dropdowns, Search and the language switch */
export const IaHeaderBar = ({
  logo,
  logoLink,
  navLinks,
  searchLink,
}: IaHeaderBarProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { arabic, isEditing, label } = useIaLabels();
  const router = useRouter();
  const items = iaItems<IaLinkFields>(navLinks);
  const [isCompact, setIsCompact] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const neededWidth = useRef(0);

  // Fold the menu behind the Menu button whenever its links don't fit beside the logo and tools.
  // Label widths differ by language and authors can add links, so this measures rather than
  // relying on a fixed breakpoint
  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const check = () => {
      const nav = navRef.current;
      const list = listRef.current;
      if (!nav || !list) return;
      if (!bar.classList.contains('is-compact')) {
        neededWidth.current = list.scrollWidth;
        setIsCompact(list.scrollWidth > nav.clientWidth + 1);
        return;
      }
      // The folded menu can't be measured, so compare with its last full width. The Menu
      // button counts as taken space, which keeps the header from flipping back and forth
      const style = getComputedStyle(bar);
      const available =
        bar.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight) -
        (logoRef.current?.offsetWidth ?? 0) -
        (actionsRef.current?.offsetWidth ?? 0) -
        2 * (parseFloat(style.columnGap) || 0);
      if (neededWidth.current <= available) setIsCompact(false);
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [isCompact, items.length, arabic, isEditing]);

  // The language the visitor can switch to
  const other = LANGUAGES.find((l) => (l.lang === 'ar') !== arabic) ?? LANGUAGES[0];

  // In Pages the image stays editable (click to pick from DAM); on the site it links home
  const logoImage = logo && (logo.value?.src || isEditing) && (
    <ContentSdkImage field={logo} className="ia-header__logo-img" />
  );

  return (
    <div ref={barRef} className={clsx('ia-wrap ia-header__bar', isCompact && 'is-compact')}>
      <div ref={logoRef} className="ia-header__logo">
        {logoImage && !isEditing && logoLink?.value?.href ? (
          <Link
            href={logoLink.value.href}
            aria-label={logoLink.value.text || undefined}
            className="ia-header__logo-link"
          >
            {logoImage}
          </Link>
        ) : (
          logoImage
        )}
      </div>

      <nav
        ref={navRef}
        id="ia-header-nav"
        className={clsx('ia-header__nav', isMenuOpen && 'is-open')}
        aria-label={label('ia_main_nav')}
      >
        <ul ref={listRef} className="ia-header__menu-list">
          {items.map((item) => {
            const subLinks = iaItems<IaLinkFields>(item.fields.SubLinks);
            const hasSub = subLinks.length > 0;
            const isOpen = openItem === item.id;
            return (
              <li
                key={item.id}
                className={clsx('ia-header__item', hasSub && 'has-sub', isOpen && 'is-open')}
                onMouseEnter={() => hasSub && setOpenItem(item.id)}
                onMouseLeave={() => hasSub && setOpenItem(null)}
              >
                <ContentSdkLink field={item.fields.Link} className="ia-header__link" />
                {hasSub && (
                  <>
                    <button
                      type="button"
                      className="ia-header__caret"
                      aria-expanded={isOpen}
                      aria-label={item.fields.Link?.value?.text}
                      onClick={() => setOpenItem(isOpen ? null : item.id)}
                    >
                      <IaIcon name="chevronDown" size={16} strokeWidth={2} />
                    </button>
                    <ul className="ia-header__sub">
                      {subLinks.map((sub) => (
                        <li key={sub.id}>
                          <ContentSdkLink field={sub.fields.Link} />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div ref={actionsRef} className="ia-header__actions">
        {searchLink && (searchLink.value?.href || isEditing) && (
          <ContentSdkLink field={searchLink} className="ia-header__tool">
            {!isEditing && (
              <>
                <IaIcon name="search" size={22} />
                <span>{searchLink.value?.text || label('ia_search')}</span>
              </>
            )}
          </ContentSdkLink>
        )}
        {isEditing ? (
          <span className="ia-header__tool" lang={other.lang}>
            <IaIcon name="translate" size={22} />
            <span>{other.short}</span>
          </span>
        ) : (
          <Link
            href={router.asPath}
            locale={other.locale}
            className="ia-header__tool"
            lang={other.lang}
          >
            <IaIcon name="translate" size={22} />
            <span>{other.short}</span>
          </Link>
        )}
        <button
          type="button"
          className="ia-header__menu"
          aria-expanded={isMenuOpen}
          aria-controls="ia-header-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {label('ia_menu')}
        </button>
      </div>
    </div>
  );
};
