import { JSX } from 'react';
import {
  Field,
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  RichTextField,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Title: Field<string>;
  Highlight: Field<string>;
  Description: RichTextField;
  Image: ImageField;
  PrimaryLink: LinkField;
  SecondaryLink: LinkField;
}

type Masdr2HeroProps = ComponentProps & { fields: Fields };

/** Full-width hero: light wash over a photo, left-aligned title with a gradient highlight. */
export const Default = ({ params, fields }: Masdr2HeroProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;

  if (!fields) {
    return isEditing ? (
      <div className={`component masdar-hero ${styles}`} id={id}>
        [MASDR2 HERO]
      </div>
    ) : (
      <></>
    );
  }

  const hasSecondary = isEditing || fields.SecondaryLink?.value?.href;

  return (
    <section
      className={`component masdar-hero bg-background-muted relative flex min-h-[600px] items-center overflow-hidden pt-28 pb-32 lg:min-h-[760px] ${styles}`}
      id={id}
    >
      {(fields.Image?.value?.src || isEditing) && (
        <div className="absolute inset-0 z-0">
          <ContentSdkImage field={fields.Image} className="h-full w-full object-cover" priority />
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgb(255 255 255 / 0.95) 0%, rgb(255 255 255 / 0.8) 45%, rgb(203 46 121 / 0.2) 100%), linear-gradient(180deg, transparent 72%, var(--color-background-muted) 100%)',
        }}
      />

      <div className="relative z-2 container">
        <div className="max-w-3xl">
          <h1 className="text-4xl leading-[1.15] lg:text-5xl">
            <ContentSdkText field={fields.Title} />{' '}
            <ContentSdkText tag="span" field={fields.Highlight} className="gradient-text" />
          </h1>
          <div className="text-foreground mt-6 text-lg leading-loose lg:text-xl">
            <ContentSdkRichText field={fields.Description} />
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <ContentSdkLink field={fields.PrimaryLink} className="main-btn" />
            {hasSecondary && (
              <ContentSdkLink field={fields.SecondaryLink} className="secondary-btn" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
