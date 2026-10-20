'use client';

import React, { JSX } from 'react';
import {
  Field,
  ImageField,
  Link as ContentSdkLink,
  LinkField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { useIaLabels } from '../non-sitecore/iaShared';
import { IaHeaderBar } from '../non-sitecore/IaHeaderBar';

interface Fields {
  Logo: ImageField;
  LogoLink: LinkField;
  GovNotice: Field<string>;
  GovVerifyLink: LinkField;
  NavLinks: unknown;
  LoginLink: LinkField;
  SearchLink: LinkField;
}

export type IaHeaderProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: IaHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { isEditing, label } = useIaLabels();

  return (
    <div className={`component ia ia-header ${styles ?? ''}`} id={id}>
      {/* Saudi government sites show this verification notice above the header */}
      {fields && (
        <div className="ia-header__gov">
          <div className="ia-wrap ia-header__gov-inner">
            <span className="ia-header__flag" aria-hidden="true" />
            <ContentSdkText tag="span" field={fields.GovNotice} />
            <ContentSdkLink field={fields.GovVerifyLink} className="ia-header__gov-link" />
            {(fields.LoginLink?.value?.href || isEditing) && (
              <ContentSdkLink field={fields.LoginLink} className="ia-header__login">
                {!isEditing && (fields.LoginLink.value?.text || label('ia_login'))}
              </ContentSdkLink>
            )}
          </div>
        </div>
      )}

      <IaHeaderBar
        logo={fields?.Logo}
        logoLink={fields?.LogoLink}
        navLinks={fields?.NavLinks}
        searchLink={fields?.SearchLink}
      />
    </div>
  );
};
