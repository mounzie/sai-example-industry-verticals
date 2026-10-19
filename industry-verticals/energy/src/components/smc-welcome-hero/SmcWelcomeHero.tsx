import React, { JSX } from 'react';
import {
  DateField,
  ImageField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { SmcCountdown } from '../non-sitecore/SmcCountdown';

interface Fields {
  Greeting: TextField;
  GuestName: TextField;
  Initials: TextField;
  BackgroundImage: ImageField;
  Category: TextField;
  PartnerLogo: ImageField;
  EventName: TextField;
  Venue: TextField;
  CountdownLabel: TextField;
  EventStart: { value?: string };
}

export type SmcWelcomeHeroProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SmcWelcomeHeroProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  if (!fields) {
    return (
      <div className={`component smc-welcome-hero ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">SMC Welcome Hero</span>
      </div>
    );
  }

  return (
    <div className={`component smc-home smc-welcome-hero ${styles ?? ''}`} id={id}>
      <div className="smc-home__wrap">
        <div className="smc-welcome-hero__greeting">
          <div>
            <ContentSdkText tag="div" className="smc-muted" field={fields.Greeting} />
            <ContentSdkText
              tag="h1"
              className="smc-disp smc-welcome-hero__name"
              field={fields.GuestName}
            />
          </div>
          <ContentSdkText
            tag="div"
            className="smc-welcome-hero__avatar smc-disp"
            field={fields.Initials}
          />
        </div>

        <div className="smc-card smc-welcome-hero__card">
          <ContentSdkImage field={fields.BackgroundImage} className="smc-welcome-hero__bg" />
          <div className="smc-welcome-hero__panel" aria-hidden="true" />
          <div className="smc-welcome-hero__overlay" aria-hidden="true" />
          <div className="smc-sheen" aria-hidden="true" />

          <div className="smc-welcome-hero__content">
            <div className="smc-welcome-hero__top">
              <div className="smc-row">
                <span className="smc-livedot" aria-hidden="true" />
                <ContentSdkText tag="span" className="smc-kicker" field={fields.Category} />
              </div>
              <ContentSdkImage field={fields.PartnerLogo} className="smc-welcome-hero__partner" />
            </div>
            <ContentSdkText
              tag="h2"
              className="smc-disp smc-welcome-hero__event"
              field={fields.EventName}
            />
            <ContentSdkText tag="div" className="smc-muted" field={fields.Venue} />
            <ContentSdkText
              tag="div"
              className="smc-welcome-hero__begins"
              field={fields.CountdownLabel}
            />
            <SmcCountdown target={fields.EventStart?.value} />
            {/* In Pages, show the date field so authors can change what the countdown runs to */}
            {isPageEditing && (
              <DateField
                tag="div"
                className="smc-welcome-hero__date"
                field={fields.EventStart}
                render={(date) => date?.toUTCString()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
