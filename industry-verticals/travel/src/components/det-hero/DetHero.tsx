import React, { JSX } from 'react';
import {
  ImageField,
  Link,
  LinkField,
  NextImage as Image,
  Text,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { DetCard, DetGqlField } from '@/types/det';

interface DetHeroDatasource {
  title: DetGqlField<TextField>;
  text: DetGqlField<TextField>;
  image: DetGqlField<ImageField>;
  viewAllLink: DetGqlField<LinkField>;
  children: { results: DetCard[] };
}

type DetHeroProps = ComponentProps & {
  fields: { data: { datasource: DetHeroDatasource | null } };
};

/**
 * DET Hero: full-screen image hero with a left-aligned headline and a row of
 * quick service links along the bottom (modelled on dubaidet.gov.ae).
 */
export const Default = (props: DetHeroProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-hero ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET Hero</span>
      </div>
    );
  }

  const links = ds.children?.results ?? [];

  return (
    <section
      className={`component det-hero relative flex min-h-[88vh] flex-col justify-end overflow-hidden text-white ${props.params.styles ?? ''}`}
      id={id}
    >
      <div className="absolute inset-0 z-0">
        <Image field={ds.image?.jsonValue} className="h-full w-full object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/70" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-10">
        <Text
          tag="h1"
          field={ds.title?.jsonValue}
          className="max-w-3xl text-4xl leading-tight font-medium text-white md:text-6xl"
        />
        <Text
          tag="p"
          field={ds.text?.jsonValue}
          className="mt-5 max-w-2xl text-lg text-white/90 md:text-xl"
        />
      </div>

      {(links.length > 0 || isEditing) && (
        <div className="relative z-10 bg-black/45 backdrop-blur-sm">
          <ul className="container mx-auto grid grid-cols-1 px-4 sm:grid-cols-2 lg:grid-cols-5">
            {links.map((item) => (
              <li key={item.id} className="border-white/20 lg:border-r">
                <Link
                  field={item.link?.jsonValue}
                  className="block h-full px-4 py-6 text-white no-underline transition-colors hover:bg-white/10"
                >
                  <Text
                    tag="span"
                    field={item.title?.jsonValue}
                    className="block text-base font-medium"
                  />
                  <Text
                    tag="span"
                    field={item.text?.jsonValue}
                    className="mt-1 block text-sm text-white/75"
                  />
                </Link>
              </li>
            ))}
            <li className="flex items-center px-4 py-6">
              <Link
                field={ds.viewAllLink?.jsonValue}
                className="font-medium text-white underline underline-offset-4"
              />
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};
