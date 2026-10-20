'use client';

import React, { JSX, useState } from 'react';
import clsx from 'clsx';
import {
  Field,
  Link as ContentSdkLink,
  LinkField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaServiceFields, iaItems, useIaLabels } from '../non-sitecore/iaShared';

interface Fields {
  Title: Field<string>;
  Intro: Field<string>;
  Services: unknown;
  ViewAllLink: LinkField;
}

export type IaServicesProps = ComponentProps & {
  fields: Fields;
};

type Filter = 'all' | 'individuals' | 'businesses';

export const Default = (props: IaServicesProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { label, isEditing } = useIaLabels();
  const [filter, setFilter] = useState<Filter>('all');
  const services = iaItems<IaServiceFields>(fields?.Services);

  if (!fields) {
    return (
      <div className={`component ia ia-services ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA Services</span>
      </div>
    );
  }

  const isBusiness = (value: unknown) => value === true || value === '1' || value === 'true';
  const visible = services.filter((s) => {
    if (filter === 'all' || isEditing) return true;
    return isBusiness(s.fields.IsBusiness?.value) === (filter === 'businesses');
  });

  const filters: [Filter, string][] = [
    ['all', 'ia_filter_all'],
    ['individuals', 'ia_filter_individuals'],
    ['businesses', 'ia_filter_businesses'],
  ];

  return (
    <section className={`component ia ia-section ia-services ${styles ?? ''}`} id={id}>
      <div className="ia-wrap">
        <div className="ia-section__head">
          <div>
            <ContentSdkText tag="h2" className="ia-section__title" field={fields.Title} />
            <ContentSdkText tag="p" className="ia-section__intro" field={fields.Intro} />
          </div>
          <div className="ia-tabs" role="group">
            {filters.map(([key, labelKey]) => (
              <button
                key={key}
                type="button"
                className={clsx('ia-tab', filter === key && 'is-active')}
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {label(labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="ia-services__grid">
          {visible.map((service) => {
            const business = isBusiness(service.fields.IsBusiness?.value);
            return (
              <article key={service.id} className="ia-card ia-services__card">
                <span className={clsx('ia-tag', business && 'ia-tag--alt')}>
                  {label(business ? 'ia_audience_businesses' : 'ia_audience_individuals')}
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
                <div className="ia-services__actions">
                  <ContentSdkLink
                    field={service.fields.DetailsLink}
                    className="ia-btn ia-btn--ghost ia-btn--sm"
                  >
                    {!isEditing &&
                      (service.fields.DetailsLink?.value?.text || label('ia_service_details'))}
                  </ContentSdkLink>
                  <ContentSdkLink
                    field={service.fields.StartLink}
                    className="ia-btn ia-btn--primary ia-btn--sm"
                  >
                    {!isEditing &&
                      (service.fields.StartLink?.value?.text || label('ia_service_start'))}
                  </ContentSdkLink>
                </div>
              </article>
            );
          })}
        </div>

        {(fields.ViewAllLink?.value?.href || isEditing) && (
          <div className="ia-section__foot">
            <ContentSdkLink field={fields.ViewAllLink} className="ia-link-arrow">
              {!isEditing && label('ia_view_all')}
            </ContentSdkLink>
          </div>
        )}
      </div>
    </section>
  );
};
