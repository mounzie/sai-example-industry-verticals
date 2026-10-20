'use client';

import React, { JSX } from 'react';
import { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaHeaderBar } from '../non-sitecore/IaHeaderBar';

// Uses the same content as IA Header (an "IA Header" item); the government notice isn't shown
interface Fields {
  Logo: ImageField;
  LogoLink: LinkField;
  NavLinks: unknown;
  SearchLink: LinkField;
}

export type IaMainHeaderProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

/** The ia.gov.sa header bar on its own, without the government verification notice above it */
export const Default = (props: IaMainHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;

  return (
    <div className={`component ia ia-header ia-main-header ${styles ?? ''}`} id={id}>
      <IaHeaderBar
        logo={fields?.Logo}
        logoLink={fields?.LogoLink}
        navLinks={fields?.NavLinks}
        searchLink={fields?.SearchLink}
      />
    </div>
  );
};
