import React, { JSX } from 'react';
import {
  Field,
  Link as ContentSdkLink,
  Placeholder,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaLinkFields, iaItems, useIaLabels } from '../non-sitecore/iaShared';

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
}

export type IaFooterProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: IaFooterProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const { fields } = props;
  const { label } = useIaLabels();

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
        {/* Logos (IA, Vision 2030) are Image components authors add here */}
        <div className="ia-footer__brand">
          <Placeholder
            name={`ia-footer-logos-${DynamicPlaceholderId}`}
            rendering={props.rendering}
          />
        </div>
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
                <ContentSdkLink field={item.fields.Link} className="ia-footer__social-link" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="ia-footer__bottom">
        <div className="ia-wrap ia-footer__bottom-inner">
          <ContentSdkText tag="p" className="ia-footer__copyright" field={fields.Copyright} />
          <ul className="ia-footer__legal">
            {iaItems<IaLinkFields>(fields.LegalLinks).map((item) => (
              <li key={item.id}>
                <ContentSdkLink field={item.fields.Link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
