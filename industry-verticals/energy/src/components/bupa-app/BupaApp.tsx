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
import { bupaLines, useBupaLabels } from '../non-sitecore/bupaShared';
import { BupaIcon } from '../non-sitecore/BupaIcon';

interface Fields {
  Title: Field<string>;
  Subtitle: Field<string>;
  FirstTitle: Field<string>;
  FirstItems: Field<string>;
  SecondTitle: Field<string>;
  SecondItems: Field<string>;
  Image: ImageField;
  AppStoreLink: LinkField;
  GooglePlayLink: LinkField;
}

export type BupaAppProps = ComponentProps & {
  fields: Fields;
};

/** A list of services, one per line; in Pages the whole field stays editable as text */
const ServiceList = ({
  title,
  items,
  isEditing,
}: {
  title: Field<string>;
  items: Field<string>;
  isEditing: boolean;
}) => (
  <div className="bupa-app__list">
    <ContentSdkText tag="h3" className="bupa-app__list-title" field={title} />
    {isEditing ? (
      <ContentSdkText tag="div" className="bupa-app__list-edit" field={items} />
    ) : (
      <ul>
        {bupaLines(items).map((line) => (
          <li key={line}>
            <BupaIcon name="check" size={18} strokeWidth={2.4} />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

/** Bupa Arabia app promotion: member and decision-maker services, store badges and a phone */
export const Default = (props: BupaAppProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { isEditing, label } = useBupaLabels();

  if (!fields) {
    return (
      <div className={`component bupa bupa-app ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">Bupa App</span>
      </div>
    );
  }

  const stores = [
    { field: fields.AppStoreLink, icon: 'apple', small: label('bupa_app_store'), big: 'App Store' },
    {
      field: fields.GooglePlayLink,
      icon: 'play',
      small: label('bupa_google_play'),
      big: 'Google Play',
    },
  ];

  return (
    <section className={`component bupa bupa-section bupa-app ${styles ?? ''}`} id={id}>
      <div className="bupa-wrap bupa-app__inner">
        <div className="bupa-app__copy">
          <ContentSdkText tag="h2" className="bupa-section__title" field={fields.Title} />
          <ContentSdkText tag="p" className="bupa-section__intro" field={fields.Subtitle} />
          <div className="bupa-app__lists">
            <ServiceList
              title={fields.FirstTitle}
              items={fields.FirstItems}
              isEditing={isEditing}
            />
            <ServiceList
              title={fields.SecondTitle}
              items={fields.SecondItems}
              isEditing={isEditing}
            />
          </div>
          <div className="bupa-app__stores">
            {stores.map(({ field, icon, small, big }) =>
              field?.value?.href || isEditing ? (
                <ContentSdkLink key={icon} field={field} className="bupa-store-badge">
                  {!isEditing && (
                    <>
                      <BupaIcon name={icon} size={26} />
                      <span className="bupa-store-badge__text">
                        <small>{small}</small>
                        <strong>{big}</strong>
                      </span>
                    </>
                  )}
                </ContentSdkLink>
              ) : null
            )}
          </div>
        </div>

        <div className="bupa-app__visual">
          {fields.Image?.value?.src || isEditing ? (
            <ContentSdkImage field={fields.Image} className="bupa-app__image" />
          ) : (
            // A simple phone drawn in CSS until an app screenshot is picked
            <div className="bupa-phone" aria-hidden="true">
              <div className="bupa-phone__screen">
                <span className="bupa-phone__bar" />
                <span className="bupa-phone__card" />
                <span className="bupa-phone__row" />
                <span className="bupa-phone__row" />
                <span className="bupa-phone__row bupa-phone__row--short" />
                <span className="bupa-phone__grid">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
