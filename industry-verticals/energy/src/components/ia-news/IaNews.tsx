'use client';

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
import { IaNewsFields, iaItems, useIaCarousel, useIaLabels } from '../non-sitecore/iaShared';
import { IaCarouselControls } from '../non-sitecore/IaCarouselControls';

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
  const carousel = useIaCarousel(items.length);

  if (!fields) {
    return (
      <div className={`component ia ia-news ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA News</span>
      </div>
    );
  }

  // Same format as ia.gov.sa: "18 October 2026"
  const formatDate = (date: Date | null) =>
    date
      ? date.toLocaleDateString(locale === 'en' ? 'en-GB' : locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '';

  return (
    // The hero's "Explorer our news" button scrolls to #latest-news unless authors set their own id
    <section className={`component ia ia-section ia-news ${styles ?? ''}`} id={id || 'latest-news'}>
      <div className="ia-wrap">
        <div className="ia-section__head">
          <div>
            <ContentSdkText tag="h2" className="ia-section__title" field={fields.Title} />
            <ContentSdkText tag="p" className="ia-section__intro" field={fields.Intro} />
          </div>
          {(fields.ViewAllLink?.value?.href || isEditing) && (
            <ContentSdkLink field={fields.ViewAllLink} className="ia-btn ia-btn--outline">
              {!isEditing && label('ia_view_all')}
            </ContentSdkLink>
          )}
        </div>

        <div className="ia-carousel__track" ref={carousel.trackRef}>
          {items.map((item) => (
            <article key={item.id} className="ia-carousel__slide ia-card ia-news__card">
              <div className="ia-news__media">
                <ContentSdkImage field={item.fields.Image} className="ia-news__img" />
              </div>
              <DateField
                tag="time"
                className="ia-news__date"
                field={item.fields.Date}
                render={formatDate}
              />
              <ContentSdkText tag="h3" className="ia-news__title" field={item.fields.Title} />
              <ContentSdkText tag="p" className="ia-news__summary" field={item.fields.Summary} />
              <ContentSdkLink field={item.fields.Link} className="ia-btn ia-btn--primary">
                {!isEditing && (item.fields.Link?.value?.text || label('ia_read_more'))}
              </ContentSdkLink>
            </article>
          ))}
        </div>

        <IaCarouselControls
          {...carousel}
          previousLabel={label('ia_previous')}
          nextLabel={label('ia_next')}
        />
      </div>
    </section>
  );
};
