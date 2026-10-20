'use client';

import React, { JSX } from 'react';
import {
  Field,
  Link as ContentSdkLink,
  Placeholder,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaLinkFields, iaItems, useIaLabels } from '../non-sitecore/iaShared';
import { IaIcon } from '../non-sitecore/IaIcon';

interface Fields {
  FirstColumnTitle: Field<string>;
  FirstColumnLinks: unknown;
  SecondColumnTitle: Field<string>;
  SecondColumnLinks: unknown;
  ThirdColumnTitle: Field<string>;
  ThirdColumnLinks: unknown;
  SocialLinks: unknown;
  LegalLinks: unknown;
  Copyright: Field<string>;
  BottomNote: Field<string>;
}

export type IaFooterProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: IaFooterProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const { fields } = props;
  const { label, isEditing } = useIaLabels();

  if (!fields) {
    return (
      <div className={`component ia ia-footer ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA Footer</span>
      </div>
    );
  }

  const columns = [
    [fields.FirstColumnTitle, fields.FirstColumnLinks],
    [fields.SecondColumnTitle, fields.SecondColumnLinks],
    [fields.ThirdColumnTitle, fields.ThirdColumnLinks],
  ] as const;

  return (
    <div className={`component ia ia-footer ${styles ?? ''}`} id={id}>
      <div className="ia-wrap ia-footer__top">
        {columns.map(([title, links], i) => (
          <div key={i} className="ia-footer__col">
            <ContentSdkText tag="h3" className="ia-footer__heading" field={title} />
            <ul>
              {iaItems<IaLinkFields>(links).map((item) => (
                <li key={item.id}>
                  <ContentSdkLink field={item.fields.Link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="ia-footer__col">
          <h3 className="ia-footer__heading">{label('ia_follow_us')}</h3>
          <ul className="ia-footer__social">
            {iaItems<IaLinkFields>(fields.SocialLinks).map((item) => (
              <li key={item.id}>
                <ContentSdkLink
                  field={item.fields.Link}
                  className="ia-footer__social-link"
                  aria-label={item.fields.Link?.value?.text}
                >
                  {!isEditing && <IaIcon name={item.fields.Icon?.value} size={20} />}
                </ContentSdkLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ia-footer__bottom">
        <div className="ia-wrap ia-footer__bottom-inner">
          {/* Logos (IA, Year of AI, Vision 2030) are Image components authors add here */}
          <div className="ia-footer__logos">
            <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>
          <div className="ia-footer__meta">
            <ul className="ia-footer__legal">
              {iaItems<IaLinkFields>(fields.LegalLinks).map((item) => (
                <li key={item.id}>
                  <ContentSdkLink field={item.fields.Link} />
                </li>
              ))}
            </ul>
            <ContentSdkText tag="p" className="ia-footer__copyright" field={fields.Copyright} />
            <ContentSdkText tag="p" className="ia-footer__note" field={fields.BottomNote} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="ia-to-top"
        aria-label={label('ia_back_to_top')}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <IaIcon name="arrowUp" size={22} strokeWidth={2.2} />
      </button>
    </div>
  );
};
