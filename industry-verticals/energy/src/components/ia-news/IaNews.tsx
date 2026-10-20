import React, { JSX } from 'react';
import {
  DateField,
  Field,
  Link as ContentSdkLink,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaNewsFields, iaItems, useIaLabels } from '../non-sitecore/iaShared';

interface Fields {
  Title: Field<string>;
  Intro: Field<string>;
  Items: unknown;
  ViewAllLink: LinkField;
}

export type IaNewsProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IaNewsProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { label, locale, isEditing } = useIaLabels();
  const items = iaItems<IaNewsFields>(fields?.Items);

  if (!fields) {
    return (
      <div className={`component ia ia-news ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA News</span>
      </div>
    );
  }

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <section className={`component ia ia-section ia-news ${styles ?? ''}`} id={id}>
      <div className="ia-wrap">
        <div className="ia-section__head">
          <div>
            <ContentSdkText tag="h2" className="ia-section__title" field={fields.Title} />
            <ContentSdkText tag="p" className="ia-section__intro" field={fields.Intro} />
          </div>
          {(fields.ViewAllLink?.value?.href || isEditing) && (
            <ContentSdkLink field={fields.ViewAllLink} className="ia-link-arrow">
              {!isEditing && label('ia_view_all')}
            </ContentSdkLink>
          )}
        </div>

        <div className="ia-news__grid">
          {items.map((item) => (
            <article key={item.id} className="ia-card ia-news__card">
              <div className="ia-news__media">
                <ContentSdkImage field={item.fields.Image} className="ia-news__img" />
              </div>
              <div className="ia-news__body">
                <DateField
                  tag="time"
                  className="ia-news__date"
                  field={item.fields.Date}
                  render={formatDate}
                />
                <ContentSdkText tag="h3" className="ia-news__title" field={item.fields.Title} />
                <ContentSdkText tag="p" className="ia-news__summary" field={item.fields.Summary} />
                <ContentSdkLink field={item.fields.Link} className="ia-link-arrow">
                  {!isEditing && label('ia_read_more')}
                </ContentSdkLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
