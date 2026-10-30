import React, { JSX } from 'react';
import {
  Field,
  Link as ContentSdkLink,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { BupaLinkFields, bupaItems, useBupaLabels } from '../non-sitecore/bupaShared';
import { BupaIcon } from '../non-sitecore/BupaIcon';

interface Fields {
  Copyright: Field<string>;
  Note: Field<string>;
  Links: unknown;
  SocialLinks: unknown;
}

export type BupaFooterProps = ComponentProps & {
  fields: Fields;
};

/** Navy footer: legal and help links, the regulator note, social icons and copyright */
export const Default = (props: BupaFooterProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { isEditing, label } = useBupaLabels();

  if (!fields) {
    return (
      <div className={`component bupa bupa-footer ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">Bupa Footer</span>
      </div>
    );
  }

  const links = bupaItems<BupaLinkFields>(fields.Links);
  const socials = bupaItems<BupaLinkFields>(fields.SocialLinks);

  return (
    <footer className={`component bupa bupa-footer ${styles ?? ''}`} id={id}>
      <div className="bupa-wrap">
        <ul className="bupa-footer__links">
          {links.map((item) => (
            <li key={item.id}>
              <ContentSdkLink field={item.fields.Link} />
            </li>
          ))}
        </ul>

        <div className="bupa-footer__bottom">
          <div className="bupa-footer__legal">
            <ContentSdkText tag="p" className="bupa-footer__note" field={fields.Note} />
            <ContentSdkText tag="p" className="bupa-footer__copyright" field={fields.Copyright} />
          </div>
          {socials.length > 0 && (
            <ul className="bupa-footer__social" aria-label={label('bupa_follow_us')}>
              {socials.map((item) => (
                <li key={item.id}>
                  <ContentSdkLink
                    field={item.fields.Link}
                    className="bupa-footer__social-link"
                    aria-label={item.fields.Link?.value?.text}
                  >
                    {!isEditing && <BupaIcon name={item.fields.Icon?.value} size={18} />}
                  </ContentSdkLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
};
