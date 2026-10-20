import React, { JSX } from 'react';
import {
  Field,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaPartnerFields, iaItems, useIaLabels } from '../non-sitecore/iaShared';

interface Fields {
  Title: Field<string>;
  Partners: unknown;
}

export type IaPartnersProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IaPartnersProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { isEditing } = useIaLabels();
  const partners = iaItems<IaPartnerFields>(fields?.Partners);

  if (!fields) {
    return (
      <div className={`component ia ia-partners ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA Partners</span>
      </div>
    );
  }

  return (
    <section className={`component ia ia-section ia-partners ${styles ?? ''}`} id={id}>
      <div className="ia-wrap">
        <ContentSdkText
          tag="h2"
          className="ia-section__title ia-partners__title"
          field={fields.Title}
        />
        <ul className="ia-partners__list">
          {partners.map((partner) => {
            const logo = (
              <ContentSdkImage field={partner.fields.Logo} className="ia-partners__logo" />
            );
            return (
              <li key={partner.id} className="ia-partners__item">
                {partner.fields.Link?.value?.href && !isEditing ? (
                  <ContentSdkLink field={partner.fields.Link}>{logo}</ContentSdkLink>
                ) : (
                  logo
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
