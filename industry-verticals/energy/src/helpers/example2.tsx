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

type RawField = { name: string; jsonValue: unknown };
type RawItem = {
  fields?: RawField[];
  children?: { results?: RawItem[] };
  [key: string]: unknown;
};

/**
 * Header and Footer use a generic ComponentQuery (`fields(ownFields: true) { name jsonValue }`)
 * to stay under the GraphQL depth/complexity limits of the layout service.
 * This turns that field list back into camelCase `{ jsonValue }` properties, recursively,
 * so components read `item.link?.jsonValue` exactly as with aliased queries.
 */
export const normalizeEx2Item = <T,>(raw?: RawItem | null): T | undefined => {
  if (!raw) return undefined;
  const out: Record<string, unknown> = { ...raw };
  if (Array.isArray(raw.fields)) {
    for (const f of raw.fields) {
      if (!f?.name) continue;
      out[f.name.charAt(0).toLowerCase() + f.name.slice(1)] = { jsonValue: f.jsonValue };
    }
    delete out.fields;
  }
  if (raw.children?.results) {
    out.children = { results: raw.children.results.map((c) => normalizeEx2Item<RawItem>(c)) };
  }
  return out as T;
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
