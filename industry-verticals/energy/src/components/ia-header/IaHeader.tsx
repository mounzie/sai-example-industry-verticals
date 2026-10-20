'use client';

import React, { JSX, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Field,
  Link as ContentSdkLink,
  LinkField,
  Placeholder,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaLinkFields, iaItems, useIaLabels } from '../non-sitecore/iaShared';

interface Fields {
  GovNotice: Field<string>;
  GovVerifyLink: LinkField;
  NavLinks: unknown;
  LoginLink: LinkField;
  SearchLink: LinkField;
}

export type IaHeaderProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

const LANGUAGES = [
  { locale: 'ar-SA', name: 'العربية', lang: 'ar' },
  { locale: 'en', name: 'English', lang: 'en' },
];

export const Default = (props: IaHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const { fields } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { arabic, isEditing, label } = useIaLabels();
  const router = useRouter();
  const navLinks = iaItems<IaLinkFields>(fields?.NavLinks);

  // The language the visitor can switch to
  const other = LANGUAGES.find((l) => (l.lang === 'ar') !== arabic) ?? LANGUAGES[1];

  return (
    <div className={`component ia ia-header ${styles ?? ''}`} id={id}>
      {/* Saudi government sites show this verification notice above the header */}
      {fields && (
        <div className="ia-header__gov">
          <div className="ia-wrap ia-header__gov-inner">
            <span className="ia-header__flag" aria-hidden="true" />
            <ContentSdkText tag="span" field={fields.GovNotice} />
            <ContentSdkLink field={fields.GovVerifyLink} className="ia-header__gov-link" />
          </div>
        </div>
      )}

      <div className="ia-wrap ia-header__bar">
        {/* The logo is an Image component authors add here, so it can come from DAM */}
        <div className="ia-header__logo">
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>

        <nav
          id="ia-header-nav"
          className={clsx('ia-header__nav', isMenuOpen && 'is-open')}
          aria-label={label('ia_main_nav')}
        >
          {navLinks.map((item) => (
            <ContentSdkLink
              key={item.id}
              field={item.fields.Link}
              onClick={() => setIsMenuOpen(false)}
            />
          ))}
        </nav>

        <div className="ia-header__actions">
          {fields?.SearchLink && (fields.SearchLink.value?.href || isEditing) && (
            <ContentSdkLink
              field={fields.SearchLink}
              className="ia-iconbtn"
              aria-label={label('ia_search')}
            >
              {!isEditing && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              )}
            </ContentSdkLink>
          )}
          {isEditing ? (
            <span className="ia-header__lang" lang={other.lang}>
              {other.name}
            </span>
          ) : (
            <Link
              href={router.asPath}
              locale={other.locale}
              className="ia-header__lang"
              lang={other.lang}
            >
              {other.name}
            </Link>
          )}
          {fields?.LoginLink && (
            <ContentSdkLink field={fields.LoginLink} className="ia-btn ia-btn--primary ia-btn--sm">
              {!isEditing && (fields.LoginLink.value?.text || label('ia_login'))}
            </ContentSdkLink>
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
    </div>
  );
};
