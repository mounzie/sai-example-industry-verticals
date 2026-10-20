'use client';

import React, { JSX, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useI18n } from 'next-localization';
import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

const LANGUAGES = [
  { locale: 'en', label: 'EN', lang: 'en' },
  { locale: 'ar-SA', label: 'العربية', lang: 'ar' },
];

// Built-in English and Arabic labels; a Sitecore Dictionary entry with the same key overrides them
const LABELS: Record<string, { en: string; ar: string }> = {
  smc_header_invitation: { en: 'Invitation', ar: 'الدعوة' },
  smc_header_weekend: { en: 'Your weekend', ar: 'عطلة نهاية الأسبوع' },
  smc_header_itinerary: { en: 'Itinerary', ar: 'البرنامج' },
  smc_header_pass: { en: 'Pass', ar: 'التصريح' },
  smc_header_concierge: { en: 'Concierge', ar: 'الكونسيرج' },
  smc_header_menu: { en: 'Menu', ar: 'القائمة' },
  smc_header_respond: { en: 'Respond', ar: 'الرد' },
  smc_header_nav_label: { en: 'Main', ar: 'القائمة الرئيسية' },
};

const NAV_LINKS = [
  { href: '#invitation', key: 'smc_header_invitation' },
  { href: '#weekend', key: 'smc_header_weekend' },
  { href: '#itinerary', key: 'smc_header_itinerary' },
  { href: '#pass', key: 'smc_header_pass' },
  { href: '#concierge', key: 'smc_header_concierge' },
];

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { page } = useSitecore();
  const { t } = useI18n();
  const router = useRouter();

  const isArabic = (page.locale || 'en').toLowerCase().startsWith('ar');
  const label = (key: string) => t(key) || (isArabic ? LABELS[key].ar : LABELS[key].en);

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
          aria-label={label('smc_header_nav_label')}
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {label(link.key)}
            </a>
          ))}
        </nav>

        <div className="smc-header__actions">
          {LANGUAGES.map(({ locale, label: name, lang }) => {
            const isCurrent = (lang === 'ar') === isArabic;
            const className = clsx(
              'smc-header__pill',
              isCurrent && 'smc-header__pill--on',
              lang === 'ar' && 'smc-header__pill--ar'
            );
            // In Pages the language is switched from the editor, so the pills only show the current one
            return isCurrent || page.mode.isEditing ? (
              <span key={locale} className={className} lang={lang} aria-current={isCurrent}>
                {name}
              </span>
            ) : (
              <Link
                key={locale}
                href={router.asPath}
                locale={locale}
                className={className}
                lang={lang}
              >
                {name}
              </Link>
            );
          })}
          <button
            type="button"
            className="smc-header__menu"
            aria-expanded={isMenuOpen}
            aria-controls="smc-header-nav"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {label('smc_header_menu')}
          </button>
          <a className="smc-header__btn" href="#invitation">
            {label('smc_header_respond')}
          </a>
        </div>
      </div>
    </div>
  );
};
