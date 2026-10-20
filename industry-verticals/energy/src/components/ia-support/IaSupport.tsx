import React, { JSX } from 'react';
import {
  Field,
  Link as ContentSdkLink,
  LinkField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { useIaLabels } from '../non-sitecore/iaShared';

interface Fields {
  Title: Field<string>;
  Intro: Field<string>;
  Phone: Field<string>;
  Email: Field<string>;
  SignLanguageLink: LinkField;
  ComplaintLink: LinkField;
}

export type IaSupportProps = ComponentProps & {
  fields: Fields;
};

const Icon = ({ d }: { d: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const PHONE =
  'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2';
const MAIL = 'M4 6h16v12H4zM4 7l8 6 8-6';
const VIDEO = 'M4 7h11v10H4zM15 10l5-3v10l-5-3';
const FLAG = 'M5 21V4h11l-2 4 2 4H5';

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
    <section className={`component ia ia-section ia-support ${styles ?? ''}`} id={id}>
      <div className="ia-wrap">
        <div className="ia-support__panel">
          <div className="ia-support__intro">
            <ContentSdkText tag="h2" className="ia-section__title" field={fields.Title} />
            <ContentSdkText tag="p" className="ia-section__intro" field={fields.Intro} />
          </div>
          <div className="ia-support__grid">
            <a className="ia-support__item" href={isEditing ? undefined : `tel:${phone}`}>
              <Icon d={PHONE} />
              <span className="ia-support__label">{label('ia_phone')}</span>
              <ContentSdkText
                tag="span"
                className="ia-support__value ia-ltr"
                field={fields.Phone}
              />
            </a>
            <a className="ia-support__item" href={isEditing ? undefined : `mailto:${email}`}>
              <Icon d={MAIL} />
              <span className="ia-support__label">{label('ia_email')}</span>
              <ContentSdkText
                tag="span"
                className="ia-support__value ia-ltr"
                field={fields.Email}
              />
            </a>
            <ContentSdkLink field={fields.SignLanguageLink} className="ia-support__item">
              <Icon d={VIDEO} />
              <span className="ia-support__label">{label('ia_sign_language')}</span>
            </ContentSdkLink>
            <ContentSdkLink field={fields.ComplaintLink} className="ia-support__item">
              <Icon d={FLAG} />
              <span className="ia-support__label">{label('ia_complaint')}</span>
            </ContentSdkLink>
          </div>
        </div>
      </div>
    </section>
  );
};
