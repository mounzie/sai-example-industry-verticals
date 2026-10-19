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
  Label: TextField;
  Name: TextField;
  Role: TextField;
  Initials: TextField;
  CallLink: LinkField;
  MessageLink: LinkField;
}

export type SmcHostCardProps = ComponentProps & {
  fields: Fields;
};

const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </svg>
);

export const Default = (props: SmcHostCardProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  if (!fields) {
    return (
      <div className={`component smc-host-card ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">SMC Host Card</span>
      </div>
    );
  }

  const actions = [
    { link: fields.CallLink, label: 'Call', icon: <PhoneIcon /> },
    { link: fields.MessageLink, label: 'Message', icon: <ChatIcon /> },
  ];

  return (
    <div className={`component smc-home smc-host-card ${styles ?? ''}`} id={id}>
      <div className="smc-home__wrap">
        <div className="smc-card smc-host-card__card">
          <div className="smc-row">
            <ContentSdkText tag="div" className="smc-host-card__avatar" field={fields.Initials} />
            <div>
              <ContentSdkText tag="div" className="smc-label" field={fields.Label} />
              <ContentSdkText tag="div" className="smc-host-card__name" field={fields.Name} />
              <ContentSdkText tag="div" className="smc-muted smc-xsmall" field={fields.Role} />
            </div>
          </div>
          <div className="smc-row smc-host-card__actions">
            {actions.map(({ link, label, icon }) =>
              isPageEditing ? (
                <ContentSdkLink
                  key={label}
                  field={link}
                  className="smc-iconbtn smc-iconbtn--edit"
                />
              ) : link?.value?.href ? (
                <ContentSdkLink key={label} field={link} className="smc-iconbtn" aria-label={label}>
                  {icon}
                </ContentSdkLink>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
