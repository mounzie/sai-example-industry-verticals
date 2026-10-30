import React, { JSX } from 'react';
import {
  Field,
  ImageField,
  Link as ContentSdkLink,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { BupaProductFields, bupaItems, useBupaLabels } from '../non-sitecore/bupaShared';
import { BupaIcon } from '../non-sitecore/BupaIcon';

interface Fields {
  Heading: Field<string>;
  Subheading: Field<string>;
  CtaLink: LinkField;
  Image: ImageField;
  Products: unknown;
}

export type BupaHeroProps = ComponentProps & {
  fields: Fields;
};

/** Blue hero with the headline on one side and a card per product (Corporate, Munshaat, Family, Helpers) */
export const Default = (props: BupaHeroProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { isEditing } = useBupaLabels();

  if (!fields) {
    return (
      <div className={`component bupa bupa-hero ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">Bupa Hero</span>
      </div>
    );
  }

  const products = bupaItems<BupaProductFields>(fields.Products);
  const hasImage = !!fields.Image?.value?.src;

  return (
    <section className={`component bupa bupa-hero ${styles ?? ''}`} id={id}>
      {(hasImage || isEditing) && (
        <div className="bupa-hero__media">
          <ContentSdkImage field={fields.Image} className="bupa-hero__image" />
        </div>
      )}
      <div className="bupa-wrap bupa-hero__inner">
        <div className="bupa-hero__copy">
          <ContentSdkText tag="h1" className="bupa-hero__title" field={fields.Heading} />
          <ContentSdkText tag="p" className="bupa-hero__lead" field={fields.Subheading} />
          {(fields.CtaLink?.value?.href || isEditing) && (
            <ContentSdkLink field={fields.CtaLink} className="bupa-btn bupa-btn--light">
              {!isEditing && (
                <>
                  <span>{fields.CtaLink.value.text}</span>
                  <BupaIcon name="arrow" size={18} strokeWidth={2} className="bupa-flip-rtl" />
                </>
              )}
            </ContentSdkLink>
          )}
        </div>

        <div className="bupa-hero__products">
          {products.map((product) => (
            <article key={product.id} className="bupa-product">
              <div className="bupa-product__body">
                {product.fields.Logo?.value?.src || isEditing ? (
                  <ContentSdkImage field={product.fields.Logo} className="bupa-product__logo" />
                ) : (
                  <div className="bupa-product__brand">
                    <ContentSdkText
                      tag="span"
                      className="bupa-product__brand-name"
                      field={product.fields.Brand}
                    />
                    <ContentSdkText
                      tag="span"
                      className="bupa-product__name"
                      field={product.fields.Name}
                    />
                  </div>
                )}
                <ContentSdkText
                  tag="p"
                  className="bupa-product__text"
                  field={product.fields.Description}
                />
              </div>
              <ContentSdkLink field={product.fields.CtaLink} className="bupa-product__cta">
                {!isEditing && (
                  <>
                    <span>{product.fields.CtaLink?.value?.text}</span>
                    <BupaIcon name="arrow" size={18} strokeWidth={2} className="bupa-flip-rtl" />
                  </>
                )}
              </ContentSdkLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
