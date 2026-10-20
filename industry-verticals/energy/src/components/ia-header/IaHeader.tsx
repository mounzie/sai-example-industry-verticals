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
import { IaIcon } from '../non-sitecore/IaIcon';

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
  { locale: 'ar-SA', short: 'عربي', lang: 'ar' },
  { locale: 'en', short: 'English', lang: 'en' },
];

export const Default = (props: IaHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const { fields } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { arabic, isEditing, label } = useIaLabels();
  const router = useRouter();
  const navLinks = iaItems<IaLinkFields>(fields?.NavLinks);

  // The language the visitor can switch to
  const other = LANGUAGES.find((l) => (l.lang === 'ar') !== arabic) ?? LANGUAGES[0];

  return (
    <div className={`component ia ia-header ${styles ?? ''}`} id={id}>
      {/* Saudi government sites show this verification notice above the header */}
      {fields && (
        <div className="ia-header__gov">
          <div className="ia-wrap ia-header__gov-inner">
            <span className="ia-header__flag" aria-hidden="true" />
            <ContentSdkText tag="span" field={fields.GovNotice} />
            <ContentSdkLink field={fields.GovVerifyLink} className="ia-header__gov-link" />
            {(fields.LoginLink?.value?.href || isEditing) && (
              <ContentSdkLink field={fields.LoginLink} className="ia-header__login">
                {!isEditing && (fields.LoginLink.value?.text || label('ia_login'))}
              </ContentSdkLink>
            )}
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
          <ul className="ia-header__menu-list">
            {navLinks.map((item) => {
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
          {fields?.SearchLink && (fields.SearchLink.value?.href || isEditing) && (
            <ContentSdkLink field={fields.SearchLink} className="ia-header__tool">
              {!isEditing && (
                <>
                  <IaIcon name="search" size={22} />
                  <span>{fields.SearchLink.value?.text || label('ia_search')}</span>
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
    </div>
  );
};
