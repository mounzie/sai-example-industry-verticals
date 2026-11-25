import React, { JSX } from 'react';
import {
  ImageField,
  Link,
  LinkField,
  NextImage as Image,
  Text,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { DetGqlField, DetLinkGroup } from '@/types/det';

interface DetFooterDatasource {
  logo: DetGqlField<ImageField>;
  logoLink: DetGqlField<LinkField>;
  linkedIn: DetGqlField<LinkField>;
  facebook: DetGqlField<LinkField>;
  instagram: DetGqlField<LinkField>;
  x: DetGqlField<LinkField>;
  copyright: DetGqlField<TextField>;
  note: DetGqlField<TextField>;
  children: { results: DetLinkGroup[] };
}

type DetFooterProps = ComponentProps & {
  fields: { data: { datasource: DetFooterDatasource | null } };
};

const socialIcons: Record<string, JSX.Element> = {
  linkedIn: (
    <path d="M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.6c.6-1 1.9-1.8 3.6-1.8 3 0 4.4 1.9 4.4 5.2V20h-4v-5.5c0-1.6-.6-2.6-2-2.6s-2 1-2 2.6V20h-4z" />
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v9h4v-9h3l1-4h-4V8z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4L4 20" />,
};

/**
 * DET Footer (modelled on dubaidet.gov.ae): logo + social icons, link columns
 * (each child group = one column, e.g. Popular links, Help, Related sites, Useful links),
 * a row of legal links (child group with Value "legal"), copyright and a note line.
 */
export const Default = (props: DetFooterProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-footer ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET Footer</span>
      </div>
    );
  }

  const groups = ds.children?.results ?? [];
  const isLegal = (g: DetLinkGroup) =>
    String(g.value?.jsonValue?.value ?? '')
      .toLowerCase()
      .trim() === 'legal';
  const columns = groups.filter((g) => !isLegal(g));
  const legalLinks = groups.filter(isLegal).flatMap((g) => g.children?.results ?? []);
  const socials = (['linkedIn', 'facebook', 'instagram', 'x'] as const).filter(
    (k) => ds[k]?.jsonValue?.value?.href
  );

  return (
    <footer
      className={`component det-footer border-t border-neutral-200 bg-white text-neutral-800 ${props.params.styles ?? ''}`}
      id={id}
    >
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-[1fr_3fr]">
        <div className="flex flex-col gap-6">
          <Link field={ds.logoLink?.jsonValue} className="block w-fit">
            <Image field={ds.logo?.jsonValue} className="h-14 w-auto object-contain" />
          </Link>
          {socials.length > 0 && (
            <ul className="flex gap-4">
              {socials.map((k) => (
                <li key={k}>
                  <Link
                    field={ds[k].jsonValue}
                    className="text-neutral-800 hover:text-[#005F66]"
                    aria-label={k}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={k === 'instagram' || k === 'x' ? 'none' : 'currentColor'}
                      stroke={k === 'instagram' || k === 'x' ? 'currentColor' : 'none'}
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      {socialIcons[k]}
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.id}>
              <Text tag="h3" field={col.title?.jsonValue} className="mb-4 text-sm font-medium" />
              <ul className="flex flex-col gap-3">
                {(col.children?.results ?? []).map((l) => (
                  <li key={l.id}>
                    <Link
                      field={l.link?.jsonValue}
                      className="text-sm text-neutral-600 no-underline hover:text-[#005F66]"
                    >
                      <Text tag="span" field={l.title?.jsonValue} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-8 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-4">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
              {legalLinks.map((l) => (
                <li key={l.id}>
                  <Link
                    field={l.link?.jsonValue}
                    className="text-neutral-700 no-underline hover:text-[#005F66]"
                  >
                    <Text tag="span" field={l.title?.jsonValue} />
                  </Link>
                </li>
              ))}
            </ul>
            <Text tag="p" field={ds.copyright?.jsonValue} className="text-xs text-neutral-600" />
          </div>
          <Text
            tag="p"
            field={ds.note?.jsonValue}
            className="max-w-sm text-xs text-neutral-600 lg:text-right"
          />
        </div>
      </div>
    </footer>
  );
};
