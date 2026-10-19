import React, { JSX } from 'react';
import {
  Link as ContentSdkLink,
  LinkField,
  Text as ContentSdkText,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  FirstTitle: TextField;
  FirstSubtitle: TextField;
  FirstLink: LinkField;
  SecondTitle: TextField;
  SecondSubtitle: TextField;
  SecondLink: LinkField;
  ThirdTitle: TextField;
  ThirdSubtitle: TextField;
  ThirdLink: LinkField;
}

export type SmcQuickLinksProps = ComponentProps & {
  fields: Fields;
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  'aria-hidden': true,
};

// Icons follow the prototype: car, pass, concierge chat
const ICONS = [
  <svg key="car" {...iconProps}>
    <path d="M5 16l1.5-5A2 2 0 0 1 8.4 9.6h7.2a2 2 0 0 1 1.9 1.4L19 16" />
    <rect x="3" y="15" width="18" height="4" rx="1.5" />
    <circle cx="7.5" cy="19" r="1.2" />
    <circle cx="16.5" cy="19" r="1.2" />
  </svg>,
  <svg key="pass" {...iconProps}>
    <rect x="4" y="3" width="16" height="18" rx="3" />
    <path d="M8 8h3v3H8zM13 13h3v3h-3zM13 8h3M8 16h3" />
  </svg>,
  <svg key="chat" {...iconProps}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </svg>,
];

export const Default = (props: SmcQuickLinksProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  if (!fields) {
    return (
      <div className={`component smc-quick-links ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">SMC Quick Links</span>
      </div>
    );
  }

  const tiles = [
    { title: fields.FirstTitle, subtitle: fields.FirstSubtitle, link: fields.FirstLink },
    { title: fields.SecondTitle, subtitle: fields.SecondSubtitle, link: fields.SecondLink },
    { title: fields.ThirdTitle, subtitle: fields.ThirdSubtitle, link: fields.ThirdLink },
  ];

  return (
    <div className={`component smc-home smc-quick-links ${styles ?? ''}`} id={id}>
      <div className="smc-home__wrap smc-quick-links__grid">
        {tiles.map((tile, i) => {
          const body = (
            <>
              <span className="smc-quick-links__icon">{ICONS[i]}</span>
              <ContentSdkText tag="div" className="smc-quick-links__title" field={tile.title} />
              <ContentSdkText tag="div" className="smc-muted smc-xsmall" field={tile.subtitle} />
            </>
          );

          return (
            <div key={i} className="smc-card2 smc-quick-links__tile">
              {tile.link?.value?.href && !isPageEditing ? (
                <ContentSdkLink field={tile.link} className="smc-quick-links__link">
                  {body}
                </ContentSdkLink>
              ) : (
                <div className="smc-quick-links__link">
                  {body}
                  {isPageEditing && (
                    <ContentSdkLink field={tile.link} className="smc-quick-links__edit-link" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
