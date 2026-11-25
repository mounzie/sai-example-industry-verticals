import React, { JSX } from 'react';
import { Link, Text } from '@sitecore-content-sdk/nextjs';
import { DetCard, DetSectionProps } from '@/types/det';

/**
 * DET Link Tiles: simple side-by-side tiles with a heading and a "Learn more"
 * link, e.g. "Official legislation" and "Legal forms of company".
 */
export const Default = (props: DetSectionProps<DetCard>): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-link-tiles ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET Link Tiles</span>
      </div>
    );
  }

  const tiles = ds.children?.results ?? [];

  return (
    <section className={`component det-link-tiles py-10 ${props.params.styles ?? ''}`} id={id}>
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 md:grid-cols-2">
        {tiles.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between gap-6 border-l-4 border-[#005F66] bg-neutral-50 p-8"
          >
            <Text tag="h3" field={t.title?.jsonValue} className="text-2xl font-medium" />
            <Text tag="p" field={t.text?.jsonValue} className="text-foreground-light" />
            <Link
              field={t.link?.jsonValue}
              className="font-medium text-[#005F66] underline underline-offset-4"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
