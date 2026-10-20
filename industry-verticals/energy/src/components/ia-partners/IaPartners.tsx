'use client';

import React, { JSX } from 'react';
import {
  Field,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaPartnerFields, iaItems, useIaCarousel, useIaLabels } from '../non-sitecore/iaShared';
import { IaIcon } from '../non-sitecore/IaIcon';

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
  const { isEditing, label } = useIaLabels();
  const partners = iaItems<IaPartnerFields>(fields?.Partners);
  const { trackRef, page, pages, prev, next } = useIaCarousel(partners.length);

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
        <div className="ia-partners__row">
          <button
            type="button"
            className="ia-partners__arrow"
            aria-label={label('ia_previous')}
            disabled={page === 0}
            onClick={prev}
          >
            <IaIcon name="chevronLeft" size={22} strokeWidth={2} className="ia-flip-rtl" />
          </button>
          <div className="ia-carousel__track ia-partners__track" ref={trackRef}>
            {partners.map((partner) => {
              const logo = (
                <ContentSdkImage field={partner.fields.Logo} className="ia-partners__logo" />
              );
              return (
                <div key={partner.id} className="ia-carousel__slide ia-partners__item">
                  {partner.fields.Link?.value?.href && !isEditing ? (
                    <ContentSdkLink field={partner.fields.Link}>{logo}</ContentSdkLink>
                  ) : (
                    logo
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="ia-partners__arrow"
            aria-label={label('ia_next')}
            disabled={page >= pages - 1}
            onClick={next}
          >
            <IaIcon name="chevronRight" size={22} strokeWidth={2} className="ia-flip-rtl" />
          </button>
        </div>
      </div>
    </section>
  );
};
