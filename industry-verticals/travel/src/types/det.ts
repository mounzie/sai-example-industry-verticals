import { ImageField, LinkField, TextField, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/** A GraphQL field as returned by `field(name: "...") { jsonValue }` */
export interface DetGqlField<T> {
  jsonValue: T;
}

/** Child item based on the "DET Card" template */
export interface DetCard {
  id: string;
  title: DetGqlField<TextField>;
  text: DetGqlField<TextField>;
  value: DetGqlField<TextField>;
  image: DetGqlField<ImageField>;
  link: DetGqlField<LinkField>;
}

/** Child item based on the "DET News Item" template */
export interface DetNewsItem {
  id: string;
  category: DetGqlField<TextField>;
  date: DetGqlField<Field<string>>;
  location: DetGqlField<TextField>;
  title: DetGqlField<TextField>;
  summary: DetGqlField<TextField>;
  image: DetGqlField<ImageField>;
  link: DetGqlField<LinkField>;
}

/** Datasource based on the "DET Section" template */
export interface DetSectionDatasource<TChild> {
  title: DetGqlField<TextField>;
  subtitle: DetGqlField<TextField>;
  viewAllLink: DetGqlField<LinkField>;
  children: { results: TChild[] };
}

export type DetSectionProps<TChild> = ComponentProps & {
  fields: { data: { datasource: DetSectionDatasource<TChild> | null } };
};

/** DET brand colours (taken from dubaidet.gov.ae) */
export const DET_TEAL = '#005F66';
