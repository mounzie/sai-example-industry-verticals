'use client';

import React, { JSX, KeyboardEvent, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  Field,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { BupaServiceFields, bupaItems, useBupaLabels } from '../non-sitecore/bupaShared';
import { BupaIcon } from '../non-sitecore/BupaIcon';

interface Fields {
  Title: Field<string>;
  Intro: Field<string>;
  Services: unknown;
}

export type BupaServicesProps = ComponentProps & {
  fields: Fields;
};

/** "Our Services" as tabs: pick a service on one side, its picture and details show on the other */
export const Default = (props: BupaServicesProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { isEditing, label } = useBupaLabels();

  if (!fields) {
    return (
      <div className={`component bupa bupa-services ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">Bupa Services</span>
      </div>
    );
  }

  const services = bupaItems<BupaServiceFields>(fields.Services);
  const current = services[Math.min(active, services.length - 1)];
  const baseId = `bupa-services-${id || 'tabs'}`;

  // Arrow keys move between tabs; Home/End jump to the ends. The tab list is vertical on desktop
  // and horizontal on phones, so both arrow pairs work
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const steps: Record<string, number> = {
      ArrowDown: 1,
      ArrowUp: -1,
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
    };
    let next = active;
    if (event.key in steps) next = (active + steps[event.key] + services.length) % services.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = services.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className={`component bupa bupa-section bupa-services ${styles ?? ''}`} id={id}>
      <div className="bupa-wrap">
        <div className="bupa-section__head">
          <ContentSdkText tag="h2" className="bupa-section__title" field={fields.Title} />
          <ContentSdkText tag="p" className="bupa-section__intro" field={fields.Intro} />
        </div>

        {services.length > 0 && (
          <div className="bupa-services__layout">
            <div
              className="bupa-services__tabs"
              role="tablist"
              aria-label={label('bupa_services_nav')}
            >
              {services.map((service, i) => (
                <button
                  key={service.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={i === active ? 0 : -1}
                  className={clsx('bupa-services__tab', i === active && 'is-active')}
                  onClick={() => setActive(i)}
                  onKeyDown={onKeyDown}
                >
                  <span className="bupa-services__tab-icon">
                    <BupaIcon name={service.fields.Icon?.value} size={24} />
                  </span>
                  <span className="bupa-services__tab-text">
                    <ContentSdkText
                      tag="span"
                      className="bupa-services__tab-title"
                      field={service.fields.Title}
                    />
                    <ContentSdkText
                      tag="span"
                      className="bupa-services__tab-desc"
                      field={service.fields.Description}
                    />
                  </span>
                </button>
              ))}
            </div>

            {current && (
              <div
                className="bupa-services__panel"
                role="tabpanel"
                id={`${baseId}-panel`}
                aria-labelledby={`${baseId}-tab-${active}`}
              >
                <div className="bupa-services__visual">
                  {current.fields.Image?.value?.src || isEditing ? (
                    <ContentSdkImage
                      field={current.fields.Image}
                      className="bupa-services__image"
                    />
                  ) : (
                    <span className="bupa-services__placeholder">
                      <BupaIcon name={current.fields.Icon?.value} size={96} strokeWidth={1.2} />
                    </span>
                  )}
                </div>
                <div className="bupa-services__card">
                  <ContentSdkText
                    tag="h3"
                    className="bupa-services__title"
                    field={current.fields.Title}
                  />
                  <ContentSdkText
                    tag="p"
                    className="bupa-services__text"
                    field={current.fields.Description}
                  />
                  {(current.fields.Link?.value?.href || isEditing) && (
                    <ContentSdkLink
                      field={current.fields.Link}
                      className="bupa-btn bupa-btn--primary"
                    >
                      {!isEditing && (
                        <>
                          <span>{current.fields.Link.value.text || label('bupa_learn_more')}</span>
                          <BupaIcon
                            name="arrow"
                            size={18}
                            strokeWidth={2}
                            className="bupa-flip-rtl"
                          />
                        </>
                      )}
                    </ContentSdkLink>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
