'use client';

import React, { JSX, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaSlideFields, iaItems, useIaLabels } from '../non-sitecore/iaShared';

interface Fields {
  Slides: unknown;
}

export type IaHeroProps = ComponentProps & {
  fields: Fields;
};

const SLIDE_INTERVAL_MS = 7000;

export const Default = (props: IaHeroProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const slides = iaItems<IaSlideFields>(props.fields?.Slides);
  const { isEditing } = useIaLabels();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance, but never while editing or when the visitor is hovering
  useEffect(() => {
    if (isEditing || paused || slides.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isEditing, paused, slides.length]);

  if (!slides.length) {
    return (
      <div className={`component ia ia-hero ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA Hero: pick slides in the Slides field</span>
      </div>
    );
  }

  return (
    <section
      className={`component ia ia-hero ${styles ?? ''}`}
      id={id}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={clsx('ia-hero__slide', i === active && 'is-active')}
          aria-hidden={i !== active}
          aria-roledescription="slide"
        >
          <ContentSdkImage field={slide.fields.Image} className="ia-hero__img" />
          <div className="ia-hero__shade" aria-hidden="true" />
          <div className="ia-wrap ia-hero__content">
            <ContentSdkText tag="h2" className="ia-hero__heading" field={slide.fields.Heading} />
            <ContentSdkText tag="p" className="ia-hero__slogan" field={slide.fields.Slogan} />
            {(slide.fields.CtaLink?.value?.href || isEditing) && (
              <ContentSdkLink field={slide.fields.CtaLink} className="ia-btn ia-btn--light" />
            )}
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="ia-hero__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={clsx('ia-hero__dot', i === active && 'is-active')}
              aria-label={`${i + 1} / ${slides.length}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
