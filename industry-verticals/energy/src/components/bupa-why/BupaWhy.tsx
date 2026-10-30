import React, { JSX } from 'react';
import { Field, Text as ContentSdkText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { BupaFeatureFields, bupaItems } from '../non-sitecore/bupaShared';
import { BupaIcon } from '../non-sitecore/BupaIcon';

interface Fields {
  Title: Field<string>;
  Intro: Field<string>;
  Features: unknown;
}

export type BupaWhyProps = ComponentProps & {
  fields: Fields;
};

/** "Why choose Bupa": a heading and a card per reason */
export const Default = (props: BupaWhyProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;

  if (!fields) {
    return (
      <div className={`component bupa bupa-why ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">Bupa Why</span>
      </div>
    );
  }

  const features = bupaItems<BupaFeatureFields>(fields.Features);

  return (
    <section className={`component bupa bupa-section bupa-why ${styles ?? ''}`} id={id}>
      <div className="bupa-wrap">
        <div className="bupa-section__head">
          <ContentSdkText tag="h2" className="bupa-section__title" field={fields.Title} />
          <ContentSdkText tag="p" className="bupa-section__intro" field={fields.Intro} />
        </div>
        <div className="bupa-why__grid">
          {features.map((feature) => (
            <div key={feature.id} className="bupa-why__card">
              <span className="bupa-icon-circle">
                <BupaIcon name={feature.fields.Icon?.value} size={28} />
              </span>
              <ContentSdkText tag="h3" className="bupa-why__title" field={feature.fields.Title} />
              <ContentSdkText
                tag="p"
                className="bupa-why__text"
                field={feature.fields.Description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
