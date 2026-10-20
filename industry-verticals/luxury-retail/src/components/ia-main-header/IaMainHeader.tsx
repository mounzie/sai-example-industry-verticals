'use client';

import React, { JSX } from 'react';
import { LinkField, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { IaHeaderBar } from '../non-sitecore/IaHeaderBar';

// Uses the same content as IA Header (an "IA Header" item); only the menu and Search are shown
interface Fields {
  NavLinks: unknown;
  SearchLink: LinkField;
}

export type IaMainHeaderProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

/** The ia.gov.sa header bar on its own, without the government verification notice above it */
export const Default = (props: IaMainHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const { fields } = props;

  return (
    <div className={`component ia ia-header ia-main-header ${styles ?? ''}`} id={id}>
      <IaHeaderBar
        // The logo is an Image component authors add here, so it can come from DAM
        logo={
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        }
        navLinks={fields?.NavLinks}
        searchLink={fields?.SearchLink}
      />
    </div>
  );
};
