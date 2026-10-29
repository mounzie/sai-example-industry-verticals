import { ImageField, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import { JsonField } from '@/helpers/masdar';

export { EMPTY_LINK } from '@/helpers/masdar';
export type { JsonField } from '@/helpers/masdar';

/** A child item as returned by an Example2 ComponentQuery (fields are aliased in camelCase). */
export type Ex2Item = {
  id: string;
  name?: string;
  template?: { name?: string };
  title?: JsonField<TextField & RichTextField>;
  text?: JsonField<TextField>;
  label?: JsonField<TextField>;
  eyebrow?: JsonField<TextField>;
  phone?: JsonField<TextField>;
  link?: JsonField<LinkField>;
  titleLink?: JsonField<LinkField>;
  phoneLink?: JsonField<LinkField>;
  icon?: JsonField<ImageField>;
  image?: JsonField<ImageField>;
  mobileImage?: JsonField<ImageField>;
  children?: { results?: Ex2Item[] };
};

/** `fields` shape for every Example2 component: the datasource plus its child items. */
export type Ex2Fields<TParent> = {
  data?: {
    datasource?: TParent & { children?: { results?: Ex2Item[] } };
  };
};

export const childrenOf = (item?: { children?: { results?: Ex2Item[] } }): Ex2Item[] =>
  item?.children?.results ?? [];

/** Child items whose template name matches, e.g. `byTemplate(items, 'Example2 Slide')`. */
export const byTemplate = (items: Ex2Item[], templateName: string): Ex2Item[] =>
  items.filter((i) => i.template?.name === templateName);

export const hasLink = (f?: JsonField<LinkField>): boolean => Boolean(f?.jsonValue?.value?.href);
export const hasImage = (f?: JsonField<ImageField>): boolean => Boolean(f?.jsonValue?.value?.src);
export const hasText = (f?: JsonField<TextField>): boolean => Boolean(f?.jsonValue?.value);

/** Placeholder shown in the Page builder when a component has no datasource yet. */
export const Ex2Empty = ({ name, id }: { name: string; id?: string }) => (
  <div className="component example2 p-6 text-center" id={id}>
    [{name}]
  </div>
);
