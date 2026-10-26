import { JSX } from 'react';
import { Field, LinkField, Text as ContentSdkText, TextField } from '@sitecore-content-sdk/nextjs';

/** Empty fallbacks for SDK components that require a field object. */
export const EMPTY_LINK: LinkField = { value: {} };
export const EMPTY_DATE: Field<string> = { value: '' };

/** A field as returned by a Masdar component's GraphQL ComponentQuery. */
export type JsonField<T = unknown> = { jsonValue: T };

/** Shape of `fields` for Masdar components that list child items via GraphQL. */
export type MasdarListFields<TParent, TChild> = {
  data?: {
    datasource?: TParent & {
      children?: { results?: Array<TChild & { id: string }> };
    };
  };
};

type SectionHeaderProps = {
  badge?: JsonField<TextField>;
  title?: JsonField<TextField>;
  description?: JsonField<TextField>;
  /** Use light text when the header sits on the plum gradient band. */
  inverted?: boolean;
  /** Optional element shown on the right of the heading (e.g. a "view all" link). */
  aside?: JSX.Element | null;
};

/** Pill badge + heading + intro text used at the top of every Masdar section. */
export const MasdarSectionHeader = ({
  badge,
  title,
  description,
  inverted = false,
  aside = null,
}: SectionHeaderProps): JSX.Element => (
  <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
    <div className="max-w-3xl">
      {badge?.jsonValue?.value || !inverted ? (
        <ContentSdkText
          tag="span"
          field={badge?.jsonValue}
          className={
            inverted
              ? 'text-accent-soft mb-4 inline-block rounded-3xl border border-white/15 bg-white/10 px-4 py-0.5 text-base font-bold'
              : 'section-badge'
          }
        />
      ) : null}
      <h2 className={`text-3xl lg:text-4xl ${inverted ? 'text-background!' : ''}`}>
        <ContentSdkText field={title?.jsonValue} />
      </h2>
      {description?.jsonValue ? (
        <ContentSdkText
          tag="p"
          field={description.jsonValue}
          className={`mt-4 text-lg leading-relaxed ${inverted ? 'text-white/80' : 'text-foreground-light'}`}
        />
      ) : null}
    </div>
    {aside}
  </div>
);
