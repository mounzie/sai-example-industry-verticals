import React, { JSX } from 'react';
import { Link, NextImage as Image, Text } from '@sitecore-content-sdk/nextjs';
import { DetCard, DetSectionProps } from '@/types/det';

/**
 * DET Results: "Latest economy and tourism results".
 * Child items WITHOUT an image render as teal stat tiles (big Value + Title + Text).
 * Child items WITH an image render as report cards (image left, title, text, link).
 */
export const Default = (props: DetSectionProps<DetCard>): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-results ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET Results</span>
      </div>
    );
  }

  const items = ds.children?.results ?? [];
  const hasImage = (c: DetCard) => Boolean(c.image?.jsonValue?.value?.src);
  const stats = items.filter((c) => !hasImage(c));
  const reports = items.filter(hasImage);

  return (
    <section
      className={`component det-results bg-neutral-50 py-14 lg:py-20 ${props.params.styles ?? ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        <Text tag="h2" field={ds.title?.jsonValue} className="text-3xl font-medium md:text-4xl" />

        {stats.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.id} className="flex flex-col gap-2 bg-[#005F66] p-6 text-white">
                <Text
                  tag="span"
                  field={s.value?.jsonValue}
                  className="text-5xl leading-none font-medium"
                />
                <Text tag="span" field={s.title?.jsonValue} className="text-lg font-medium" />
                <Text tag="p" field={s.text?.jsonValue} className="text-sm text-white/80" />
                <Link
                  field={s.link?.jsonValue}
                  className="mt-auto pt-3 text-sm font-medium text-white underline underline-offset-4"
                />
              </div>
            ))}
          </div>
        )}

        {reports.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {reports.map((r) => (
              <article
                key={r.id}
                className="flex flex-col overflow-hidden border border-neutral-200 bg-white sm:flex-row"
              >
                <div className="sm:w-2/5">
                  <Image
                    field={r.image?.jsonValue}
                    className="h-56 w-full object-cover sm:h-full"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6 sm:w-3/5">
                  <Text tag="h3" field={r.title?.jsonValue} className="text-2xl font-medium" />
                  <Text tag="p" field={r.text?.jsonValue} className="text-foreground-light" />
                  <Link
                    field={r.link?.jsonValue}
                    className="mt-auto text-sm font-medium text-[#005F66] underline underline-offset-4"
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
