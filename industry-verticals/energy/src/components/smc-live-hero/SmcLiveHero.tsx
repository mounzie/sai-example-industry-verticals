import React, { JSX } from 'react';
import {
  ImageField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  BackgroundImage: ImageField;
  Category: TextField;
  PartnerLogo: ImageField;
  EventName: TextField;
  Venue: TextField;
  EmbedLabel: TextField;
  EmbedCode: TextField;
  EmbedHeight: TextField;
}

export type SmcLiveHeroProps = ComponentProps & {
  fields: Fields;
};

const DEFAULT_EMBED_HEIGHT = 480;

// Wraps the author's snippet so it renders on the dark card without a white page behind it
const toEmbedDocument = (code: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;background:transparent;color:#f3f6f5;font-family:Montserrat,system-ui,sans-serif}</style></head><body>${code}</body></html>`;

export const Default = (props: SmcLiveHeroProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  if (!fields) {
    return (
      <div className={`component smc-live-hero ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">SMC Live Hero</span>
      </div>
    );
  }

  const embedCode = fields.EmbedCode?.value?.toString().trim() ?? '';
  const embedHeight =
    parseInt(fields.EmbedHeight?.value?.toString() ?? '', 10) || DEFAULT_EMBED_HEIGHT;

  return (
    <div className={`component smc-home smc-welcome-hero smc-live-hero ${styles ?? ''}`} id={id}>
      <div className="smc-home__wrap">
        <div className="smc-card smc-welcome-hero__card smc-live-hero__card">
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
              field={fields.EmbedLabel}
            />

            <div className="smc-live-hero__embed">
              {embedCode ? (
                // Sandboxed without same-origin access, so embed scripts can't reach the page or cookies
                <iframe
                  title={fields.EmbedLabel?.value?.toString() || 'Live results'}
                  srcDoc={toEmbedDocument(embedCode)}
                  sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
                  loading="lazy"
                  style={{ height: embedHeight }}
                />
              ) : (
                isPageEditing && (
                  <div className="smc-live-hero__empty smc-muted smc-small">
                    Paste the live results HTML into the Embed code field below.
                  </div>
                )
              )}
            </div>

            {/* In Pages, the raw HTML and height are edited here; the frame above previews them */}
            {isPageEditing && (
              <div className="smc-live-hero__editor">
                <div className="smc-label">Embed code (HTML)</div>
                <ContentSdkText
                  tag="pre"
                  className="smc-live-hero__code"
                  field={fields.EmbedCode}
                />
                <div className="smc-label">Embed height (px)</div>
                <ContentSdkText
                  tag="div"
                  className="smc-live-hero__code"
                  field={fields.EmbedHeight}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
