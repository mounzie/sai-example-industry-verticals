import React, { JSX } from 'react';
import { Link, NextImage as Image, Text } from '@sitecore-content-sdk/nextjs';
import { DetCard, DetSectionProps } from '@/types/det';

/**
 * DET Resources: "More resources" grid of partner cards (image, name,
 * short description, call-to-action link), modelled on dubaidet.gov.ae.
 */
export const Default = (props: DetSectionProps<DetCard>): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-resources ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET Resources</span>
      </div>
    );
  }

  const cards = ds.children?.results ?? [];

  return (
    <section
      className={`component det-resources py-14 lg:py-20 ${props.params.styles ?? ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        <Text tag="h2" field={ds.title?.jsonValue} className="text-3xl font-medium md:text-4xl" />
        <Text
          tag="p"
          field={ds.subtitle?.jsonValue}
          className="text-foreground-light mt-2 text-lg"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.id}
              className="flex flex-col overflow-hidden border border-neutral-200 bg-white"
            >
              <Image field={card.image?.jsonValue} className="h-44 w-full object-cover" />
              <div className="flex grow flex-col gap-3 p-5">
                <Text tag="h3" field={card.title?.jsonValue} className="text-lg font-medium" />
                <Text
                  tag="p"
                  field={card.text?.jsonValue}
                  className="text-foreground-light text-sm"
                />
                <Link
                  field={card.link?.jsonValue}
                  className="mt-auto pt-2 text-sm font-medium text-[#005F66] underline underline-offset-4"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
