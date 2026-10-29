import { JSX } from 'react';
import {
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faLinkedinIn,
  faXTwitter,
  faYoutube,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import { Mail, Phone } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { EMPTY_LINK, JsonField, MasdarListFields } from '@/helpers/masdar';

type FooterLink = { id: string; link?: JsonField<LinkField> };
type FooterColumn = {
  title?: JsonField<TextField>;
  children?: { results?: FooterLink[] };
};
type Parent = {
  logo?: JsonField<ImageField>;
  description?: JsonField<TextField>;
  copyright?: JsonField<TextField>;
  email?: JsonField<TextField>;
  phone?: JsonField<TextField>;
  linkedIn?: JsonField<LinkField>;
  x?: JsonField<LinkField>;
  instagram?: JsonField<LinkField>;
  youTube?: JsonField<LinkField>;
};

type Masdr2FooterProps = ComponentProps & { fields: MasdarListFields<Parent, FooterColumn> };

/** Footer: brand block with contact and social links, link columns, and a copyright bar. */
export const Default = ({ params, fields }: Masdr2FooterProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const datasource = fields?.data?.datasource;
  const columns = datasource?.children?.results ?? [];

  if (!datasource) {
    return isEditing ? <div className="component masdar-footer">[MASDR2 FOOTER]</div> : <></>;
  }

  const socials: Array<[JsonField<LinkField> | undefined, IconDefinition, string]> = [
    [datasource.linkedIn, faLinkedinIn, 'LinkedIn'],
    [datasource.x, faXTwitter, 'X'],
    [datasource.instagram, faInstagram, 'Instagram'],
    [datasource.youTube, faYoutube, 'YouTube'],
  ];

  return (
    <footer className={`component masdar-footer bg-background w-full ${styles}`} id={id}>
      <div className="gradient-band h-1.5" aria-hidden="true" />
      <div className="container grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        {/* Brand block */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <ContentSdkImage
            field={datasource.logo?.jsonValue}
            className="h-10 w-auto self-start object-contain"
          />
          <ContentSdkText
            tag="p"
            field={datasource.description?.jsonValue}
            className="text-foreground-light max-w-sm leading-relaxed"
          />
          <ul className="flex flex-col gap-2 text-sm font-semibold">
            {(datasource.email?.jsonValue?.value || isEditing) && (
              <li className="flex items-center gap-2">
                <Mail className="text-accent size-4" aria-hidden="true" />
                <ContentSdkText field={datasource.email?.jsonValue} />
              </li>
            )}
            {(datasource.phone?.jsonValue?.value || isEditing) && (
              <li className="flex items-center gap-2">
                <Phone className="text-accent size-4" aria-hidden="true" />
                <ContentSdkText field={datasource.phone?.jsonValue} />
              </li>
            )}
          </ul>
          <ul className="flex gap-3">
            {socials.map(([field, icon, label]) =>
              field?.jsonValue?.value?.href || isEditing ? (
                <li key={label}>
                  <ContentSdkLink
                    field={field?.jsonValue ?? EMPTY_LINK}
                    aria-label={label}
                    className="bg-background-tint text-accent-dark hover:bg-accent-dark hover:text-background flex size-10 items-center justify-center rounded-full transition-colors"
                  >
                    <FontAwesomeIcon icon={icon} className="size-4" />
                  </ContentSdkLink>
                </li>
              ) : null
            )}
          </ul>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8 lg:pl-12">
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-accent-dark mb-5 text-lg font-bold">
                <ContentSdkText field={column.title?.jsonValue} />
              </h3>
              <ul className="flex flex-col gap-3">
                {(column.children?.results ?? []).map((item) => (
                  <li key={item.id}>
                    <ContentSdkLink
                      field={item.link?.jsonValue ?? EMPTY_LINK}
                      className="text-foreground-light hover:text-accent font-semibold transition-colors"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="container py-6">
          <ContentSdkText
            tag="p"
            field={datasource.copyright?.jsonValue}
            className="text-foreground-secondary text-sm"
          />
        </div>
      </div>
    </footer>
  );
};
