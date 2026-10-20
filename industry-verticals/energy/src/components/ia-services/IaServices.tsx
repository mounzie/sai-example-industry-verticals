'use client';

import React, { JSX } from 'react';
import clsx from 'clsx';
import {
  Field,
  Link as ContentSdkLink,
  LinkField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaServiceFields, iaItems, useIaCarousel, useIaLabels } from '../non-sitecore/iaShared';
import { IaIcon } from '../non-sitecore/IaIcon';
import { IaCarouselControls } from '../non-sitecore/IaCarouselControls';

interface Fields {
  Title: Field<string>;
  Intro: Field<string>;
  Services: unknown;
  ViewAllLink: LinkField;
}

export type IaServicesProps = ComponentProps & {
  fields: Fields;
};

const isBusiness = (value: unknown) => value === true || value === '1' || value === 'true';

export const Default = (props: IaServicesProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { label, isEditing } = useIaLabels();
  const services = iaItems<IaServiceFields>(fields?.Services);
  const carousel = useIaCarousel(services.length);

  if (!fields) {
    return (
      <div className={`component ia ia-services ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA Services</span>
      </div>
    );
  }

  return (
    <section
      className={`component ia ia-section ia-section--grey ia-services ${styles ?? ''}`}
      id={id}
    >
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
          {services.map((service) => {
            const business = isBusiness(service.fields.IsBusiness?.value);
            return (
              <article key={service.id} className="ia-carousel__slide ia-card ia-services__card">
                <span className="ia-icon-circle">
                  <IaIcon name={service.fields.Icon?.value || 'document'} size={28} />
                </span>
                <ContentSdkText
                  tag="h3"
                  className="ia-services__title"
                  field={service.fields.Title}
                />
                <ContentSdkText
                  tag="p"
                  className="ia-services__desc"
                  field={service.fields.Description}
                />
                <span className={clsx('ia-tag', business && 'ia-tag--alt')}>
                  {label(business ? 'ia_audience_businesses' : 'ia_audience_individuals')}
                </span>
                <div className="ia-services__actions">
                  <ContentSdkLink
                    field={service.fields.DetailsLink}
                    className="ia-btn ia-btn--outline"
                  >
                    {!isEditing &&
                      (service.fields.DetailsLink?.value?.text || label('ia_service_details'))}
                  </ContentSdkLink>
                  <ContentSdkLink
                    field={service.fields.StartLink}
                    className="ia-btn ia-btn--primary"
                  >
                    {!isEditing &&
                      (service.fields.StartLink?.value?.text || label('ia_service_start'))}
                  </ContentSdkLink>
                </div>
              </article>
            );
          })}
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
