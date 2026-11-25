import React, { JSX } from 'react';
import { Link, NextImage as Image, Text } from '@sitecore-content-sdk/nextjs';
import { DetCard, DetSectionProps } from '@/types/det';

/**
 * DET Industry Cards: "What are you looking for?" grid of image cards, each
 * with a title and a "Learn more" link (modelled on dubaidet.gov.ae).
 */
export const Default = (props: DetSectionProps<DetCard>): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-industry-cards ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET Industry Cards</span>
      </div>
    );
  }

  const cards = ds.children?.results ?? [];

  return (
    <section
      className={`component det-industry-cards py-14 lg:py-20 ${props.params.styles ?? ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        <Text tag="h2" field={ds.title?.jsonValue} className="text-3xl font-medium md:text-4xl" />
        <Text
          tag="p"
          field={ds.subtitle?.jsonValue}
          className="text-foreground-light mt-2 text-lg"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group flex flex-col overflow-hidden border border-neutral-200 bg-white"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  field={card.image?.jsonValue}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex grow flex-col justify-between gap-4 p-5">
                <Text tag="h3" field={card.title?.jsonValue} className="text-lg font-medium" />
                <Link
                  field={card.link?.jsonValue}
                  className="text-sm font-medium text-[#005F66] underline underline-offset-4"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
