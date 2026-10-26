import { JSX } from 'react';
import {
  ImageField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { JsonField, MasdarListFields } from '@/helpers/masdar';

type Parent = { title?: JsonField<TextField> };
type Logo = { name?: JsonField<TextField>; logo?: JsonField<ImageField> };

type MasdarLogoStripProps = ComponentProps & { fields: MasdarListFields<Parent, Logo> };

/** White card overlapping the hero, with an endlessly scrolling row of partner logos. */
export const Default = ({ params, fields }: MasdarLogoStripProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const datasource = fields?.data?.datasource;
  const logos = datasource?.children?.results ?? [];

  if (!datasource) {
    return isEditing ? (
      <div className="component masdar-logo-strip">[MASDAR LOGO STRIP]</div>
    ) : (
      <></>
    );
  }

  const renderLogo = (logo: Logo & { id: string }, key: string) => (
    <li key={key} className="flex h-16 shrink-0 items-center">
      {logo.logo?.jsonValue?.value?.src ? (
        <ContentSdkImage
          field={logo.logo.jsonValue}
          className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
        />
      ) : (
        // No logo uploaded yet: show the partner name as a simple wordmark.
        <ContentSdkText
          tag="span"
          field={logo.name?.jsonValue}
          className="text-foreground-secondary text-lg font-bold whitespace-nowrap"
        />
      )}
    </li>
  );

  return (
    <section
      className={`component masdar-logo-strip bg-background-muted relative z-10 -mt-20 pb-8 ${styles}`}
      id={id}
    >
      <div className="container">
        <div className="soft-card overflow-hidden px-6 py-8 lg:px-10">
          <h2 className="text-accent-dark mb-6 text-xl font-bold">
            <ContentSdkText field={datasource.title?.jsonValue} />
          </h2>
          {isEditing ? (
            <ul className="flex flex-wrap gap-x-16 gap-y-4">
              {logos.map((logo) => renderLogo(logo, logo.id))}
            </ul>
          ) : (
            <div className="masdar-marquee relative overflow-hidden">
              {/* Two copies back to back so the loop is seamless */}
              <ul className="masdar-marquee-track flex w-max gap-x-16">
                {[...logos, ...logos].map((logo, i) => renderLogo(logo, `${logo.id}-${i}`))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
