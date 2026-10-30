'use client';

import React, { JSX, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Field,
  ImageField,
  Link as ContentSdkLink,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { BupaLinkFields, bupaItems, useBupaLabels } from '../non-sitecore/bupaShared';
import { BupaIcon } from '../non-sitecore/BupaIcon';

interface Fields {
  Logo: ImageField;
  LogoLink: LinkField;
  TopLinks: unknown;
  NavLinks: unknown;
  Greeting: Field<string>;
  HelpLink: LinkField;
  StoreLink: LinkField;
  LoginLink: LinkField;
  SearchLink: LinkField;
}

export type BupaHeaderProps = ComponentProps & {
  fields: Fields;
};

const LANGUAGES = [
  { locale: 'en', short: 'EN', lang: 'en' },
  { locale: 'ar-SA', short: 'AR', lang: 'ar' },
];

/** Shown until a logo image is picked in Pages */
const Wordmark = () => (
  <span className="bupa-header__wordmark" aria-hidden="true">
    <span>bupa</span>
    <span lang="ar">بوبا</span>
  </span>
);

/** The bupa.com.sa header: utility links, language switch, menu, Help, E-Store and Login */
export const Default = (props: BupaHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { arabic, isEditing, label } = useBupaLabels();
  const router = useRouter();

  if (!fields) {
    return (
      <div className={`component bupa bupa-header ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">Bupa Header</span>
      </div>
    );
  }

  const topLinks = bupaItems<BupaLinkFields>(fields.TopLinks);
  const navLinks = bupaItems<BupaLinkFields>(fields.NavLinks);
  const hasLogo = !!fields.Logo?.value?.src;
  const logo =
    hasLogo || isEditing ? (
      <ContentSdkImage field={fields.Logo} className="bupa-header__logo-img" />
    ) : (
      <Wordmark />
    );
  const show = (link?: LinkField) => !!link && (!!link.value?.href || isEditing);

  return (
    <header className={`component bupa bupa-header ${styles ?? ''}`} id={id}>
      <div className="bupa-header__top">
        <div className="bupa-wrap bupa-header__top-inner">
          <ul className="bupa-header__top-links">
            {topLinks.map((item) => (
              <li key={item.id}>
                <ContentSdkLink field={item.fields.Link} />
              </li>
            ))}
          </ul>
          <div className="bupa-header__langs">
            {LANGUAGES.map(({ locale, short, lang }) => {
              const current = (lang === 'ar') === arabic;
              return isEditing || current ? (
                <span
                  key={lang}
                  className={clsx('bupa-header__lang', current && 'is-current')}
                  lang={lang}
                >
                  {short}
                </span>
              ) : (
                <Link
                  key={lang}
                  href={router.asPath}
                  locale={locale}
                  className="bupa-header__lang"
                  lang={lang}
                >
                  {short}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bupa-wrap bupa-header__bar">
        <div className="bupa-header__logo">
          {!isEditing && fields.LogoLink?.value?.href ? (
            <Link
              href={fields.LogoLink.value.href}
              aria-label={fields.LogoLink.value.text || 'Bupa Arabia'}
            >
              {logo}
            </Link>
          ) : (
            logo
          )}
        </div>

        <nav
          id="bupa-header-nav"
          className={clsx('bupa-header__nav', isMenuOpen && 'is-open')}
          aria-label={label('bupa_main_nav')}
        >
          <ul>
            {navLinks.map((item) => (
              <li key={item.id}>
                <ContentSdkLink field={item.fields.Link} className="bupa-header__link" />
              </li>
            ))}
          </ul>
        </nav>

        <div className="bupa-header__actions">
          {show(fields.HelpLink) && (
            <ContentSdkLink
              field={fields.HelpLink}
              className="bupa-btn bupa-btn--ghost bupa-header__help"
            >
              {!isEditing && (
                <>
                  <span>{fields.HelpLink.value.text}</span>
                  <BupaIcon name="arrow" size={18} strokeWidth={2} className="bupa-flip-rtl" />
                </>
              )}
            </ContentSdkLink>
          )}
          {show(fields.StoreLink) && (
            <ContentSdkLink
              field={fields.StoreLink}
              className="bupa-btn bupa-btn--primary bupa-header__store"
            >
              {!isEditing && (
                <>
                  <span>{fields.StoreLink.value.text}</span>
                  <BupaIcon name="store" size={18} strokeWidth={1.8} />
                </>
              )}
            </ContentSdkLink>
          )}
          {show(fields.SearchLink) && (
            <ContentSdkLink
              field={fields.SearchLink}
              className="bupa-header__icon-btn"
              aria-label={label('bupa_search')}
            >
              {!isEditing && <BupaIcon name="search" size={22} strokeWidth={2} />}
            </ContentSdkLink>
          )}
          <div className="bupa-header__account">
            <BupaIcon name="user" size={26} />
            <div>
              <ContentSdkText
                tag="span"
                className="bupa-header__greeting"
                field={fields.Greeting}
              />
              {show(fields.LoginLink) && (
                <ContentSdkLink field={fields.LoginLink} className="bupa-header__login" />
              )}
            </div>
          </div>
          <button
            type="button"
            className="bupa-header__icon-btn bupa-header__toggle"
            aria-expanded={isMenuOpen}
            aria-controls="bupa-header-nav"
            aria-label={label(isMenuOpen ? 'bupa_close' : 'bupa_menu')}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <BupaIcon name={isMenuOpen ? 'close' : 'menu'} size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
};
