'use client';

import React, { JSX, ReactNode, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Link as ContentSdkLink, LinkField } from '@sitecore-content-sdk/nextjs';
import { IaLinkFields, iaItems, useIaLabels } from './iaShared';
import { IaIcon } from './IaIcon';

type IaHeaderBarProps = {
  /** The logo area, usually a Placeholder authors drop an Image into */
  logo: ReactNode;
  /** Multilist of IA Link items; each can carry dropdown SubLinks */
  navLinks: unknown;
  searchLink?: LinkField;
};

const LANGUAGES = [
  { locale: 'ar-SA', short: 'عربي', lang: 'ar' },
  { locale: 'en', short: 'English', lang: 'en' },
];

/** The ia.gov.sa main bar: logo, menu with dropdowns, Search and the language switch */
export const IaHeaderBar = ({ logo, navLinks, searchLink }: IaHeaderBarProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { arabic, isEditing, label } = useIaLabels();
  const router = useRouter();
  const items = iaItems<IaLinkFields>(navLinks);

  // The language the visitor can switch to
  const other = LANGUAGES.find((l) => (l.lang === 'ar') !== arabic) ?? LANGUAGES[0];

  return (
    <div className="ia-wrap ia-header__bar">
      <div className="ia-header__logo">{logo}</div>

      <nav
        id="ia-header-nav"
        className={clsx('ia-header__nav', isMenuOpen && 'is-open')}
        aria-label={label('ia_main_nav')}
      >
        <ul className="ia-header__menu-list">
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

      <div className="ia-header__actions">
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
