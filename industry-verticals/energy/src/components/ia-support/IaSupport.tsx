import React, { JSX } from 'react';
import {
  Field,
  Link as ContentSdkLink,
  LinkField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { useIaLabels } from '../non-sitecore/iaShared';
import { IaIcon } from '../non-sitecore/IaIcon';

interface Fields {
  Title: Field<string>;
  Intro: Field<string>;
  PhoneTitle: Field<string>;
  PhoneSubtitle: Field<string>;
  Phone: Field<string>;
  EmailTitle: Field<string>;
  EmailSubtitle: Field<string>;
  Email: Field<string>;
  VideoTitle: Field<string>;
  VideoSubtitle: Field<string>;
  VideoLink: LinkField;
}

export type IaSupportProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IaSupportProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { label, isEditing } = useIaLabels();

  if (!fields) {
    return (
      <div className={`component ia ia-support ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA Support</span>
      </div>
    );
  }

  const phone = fields.Phone?.value?.toString() ?? '';
  const email = fields.Email?.value?.toString() ?? '';

  return (
    <section
      className={`component ia ia-section ia-section--mint ia-support ${styles ?? ''}`}
      id={id}
    >
      <div className="ia-wrap">
        <div className="ia-section__head">
          <div>
            <ContentSdkText tag="h2" className="ia-section__title" field={fields.Title} />
            <ContentSdkText tag="p" className="ia-section__intro" field={fields.Intro} />
          </div>
        </div>
        <div className="ia-support__grid">
          <div className="ia-support__item">
            <IaIcon name="headset" size={34} className="ia-support__icon" />
            <ContentSdkText tag="h3" className="ia-support__title" field={fields.PhoneTitle} />
            <ContentSdkText tag="p" className="ia-support__subtitle" field={fields.PhoneSubtitle} />
            {isEditing ? (
              <ContentSdkText
                tag="span"
                className="ia-support__value ia-ltr"
                field={fields.Phone}
              />
            ) : (
              <a className="ia-support__value ia-ltr" href={`tel:${phone}`}>
                {phone}
              </a>
            )}
          </div>
          <div className="ia-support__item">
            <IaIcon name="mail" size={34} className="ia-support__icon" />
            <ContentSdkText tag="h3" className="ia-support__title" field={fields.EmailTitle} />
            <ContentSdkText tag="p" className="ia-support__subtitle" field={fields.EmailSubtitle} />
            {isEditing ? (
              <ContentSdkText
                tag="span"
                className="ia-support__value ia-ltr"
                field={fields.Email}
              />
            ) : (
              <a className="ia-support__value ia-ltr" href={`mailto:${email}`}>
                {email}
              </a>
            )}
          </div>
          <div className="ia-support__item">
            <IaIcon name="video" size={34} className="ia-support__icon" />
            <ContentSdkText tag="h3" className="ia-support__title" field={fields.VideoTitle} />
            <ContentSdkText tag="p" className="ia-support__subtitle" field={fields.VideoSubtitle} />
            <ContentSdkLink field={fields.VideoLink} className="ia-btn ia-btn--primary">
              {!isEditing && (fields.VideoLink?.value?.text || label('ia_click_here'))}
            </ContentSdkLink>
          </div>
        </div>
      </div>
    </section>
  );
};
