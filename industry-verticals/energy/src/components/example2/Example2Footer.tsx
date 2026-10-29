import { JSX } from 'react';
import {
  ImageField,
  LinkField,
  TextField,
  Image as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  EMPTY_LINK,
  Ex2Empty,
  Ex2Fields,
  Ex2Item,
  JsonField,
  byTemplate,
  childrenOf,
  hasLink,
  normalizeEx2Item,
} from '@/helpers/example2';

type Parent = {
  wordmark?: JsonField<ImageField>;
  logo?: JsonField<ImageField>;
  countryFlag?: JsonField<ImageField>;
  countryLabel?: JsonField<TextField>;
  changeCountryLink?: JsonField<LinkField>;
  arabicLink?: JsonField<LinkField>;
  englishLink?: JsonField<LinkField>;
  regulatorText?: JsonField<TextField>;
  copyright?: JsonField<TextField>;
};
type Example2FooterProps = ComponentProps & { fields: Ex2Fields<Parent> };

/** Footer: link columns, wordmark with country and language, socials, legal links and copyright. */
export const Default = ({ params, fields }: Example2FooterProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const ds = normalizeEx2Item<Parent & { children?: { results?: Ex2Item[] } }>(
    fields?.data?.datasource as Parameters<typeof normalizeEx2Item>[0]
  );

  if (!ds) {
    return isEditing ? <Ex2Empty name="EXAMPLE2 FOOTER" id={id} /> : <></>;
  }

  const items = childrenOf(ds);
  const columns = byTemplate(items, 'Example2 Footer Column');
  const socials = byTemplate(items, 'Example2 Social Link');
  const legal = childrenOf(byTemplate(items, 'Example2 Link Menu')[0]);

  return (
    <footer className={`component example2 example2-footer bg-white py-8 ${styles ?? ''}`} id={id}>
      <div className="ex2-container">
        <div className="grid grid-cols-1 gap-8 border-b border-[var(--ex2-border-light)] pb-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.id}>
              <ContentSdkText
                tag="p"
                field={col.title?.jsonValue}
                className="mb-3 text-[13px] leading-4 font-bold text-[var(--ex2-text-strong)]"
              />
              <ul className="flex flex-col gap-[17px]">
                {childrenOf(col).map((link) => (
                  <li key={link.id}>
                    <ContentSdkLink
                      field={link.link?.jsonValue ?? EMPTY_LINK}
                      className="ex2-link text-[15px] leading-[18px]"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-start sm:justify-between">
          <ContentSdkImage field={ds.wordmark?.jsonValue} className="h-[15px] w-auto" />
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-2 text-base">
              <ContentSdkImage field={ds.countryFlag?.jsonValue} className="h-[14px] w-[22px]" />
              <ContentSdkText field={ds.countryLabel?.jsonValue} />
              <ContentSdkLink
                field={ds.changeCountryLink?.jsonValue ?? EMPTY_LINK}
                className="ex2-link"
              />
            </div>
            <div className="flex items-center gap-2 text-base">
              {(hasLink(ds.arabicLink) || isEditing) && (
                <ContentSdkLink
                  field={ds.arabicLink?.jsonValue ?? EMPTY_LINK}
                  className="ex2-link"
                />
              )}
              <span className="h-4 w-px bg-[var(--ex2-border)]" aria-hidden="true" />
              {(hasLink(ds.englishLink) || isEditing) && (
                <ContentSdkLink
                  field={ds.englishLink?.jsonValue ?? EMPTY_LINK}
                  className="text-[var(--ex2-text)]"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          {socials.map((social) => (
            <ContentSdkLink
              key={social.id}
              field={social.link?.jsonValue ?? EMPTY_LINK}
              className="inline-flex last:ml-auto"
            >
              <ContentSdkImage
                field={social.icon?.jsonValue}
                className={
                  social.name?.toLowerCase().includes('simah')
                    ? 'h-[45px] w-auto'
                    : 'h-[30px] w-auto'
                }
              />
            </ContentSdkLink>
          ))}
        </div>

        <ul className="mt-6 flex flex-wrap items-center text-base">
          {legal.map((link, i) => (
            <li
              key={link.id}
              className={i > 0 ? 'ml-3 border-l border-[var(--ex2-border)] pl-3' : ''}
            >
              <ContentSdkLink field={link.link?.jsonValue ?? EMPTY_LINK} className="ex2-link" />
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-end justify-between gap-6">
          <div className="flex flex-col gap-3 text-base">
            <ContentSdkText tag="p" field={ds.regulatorText?.jsonValue} />
            <ContentSdkText tag="p" field={ds.copyright?.jsonValue} />
          </div>
          <ContentSdkImage
            field={ds.logo?.jsonValue}
            className="hidden h-[45px] w-[45px] md:block"
          />
        </div>
      </div>
    </footer>
  );
};
