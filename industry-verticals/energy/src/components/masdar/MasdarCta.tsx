import { JSX } from 'react';
import {
  Field,
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Title: Field<string>;
  Highlight: Field<string>;
  Description: Field<string>;
  Link: LinkField;
  Image: ImageField;
}

type MasdarCtaProps = ComponentProps & { fields: Fields };

/** Rounded call-to-action panel: text on a light card, image on the right. */
export const Default = ({ params, fields }: MasdarCtaProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;

  if (!fields) {
    return isEditing ? <div className="component masdar-cta">[MASDAR CTA]</div> : <></>;
  }

  return (
    <section
      className={`component masdar-cta bg-background-muted py-20 lg:py-32 ${styles}`}
      id={id}
    >
      <div className="container">
        <div className="soft-card grid overflow-hidden lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-6 p-10 lg:p-16">
            <h2 className="text-3xl lg:text-4xl">
              <ContentSdkText field={fields.Title} />{' '}
              <ContentSdkText tag="span" field={fields.Highlight} className="gradient-text" />
            </h2>
            <ContentSdkText
              tag="p"
              field={fields.Description}
              className="text-foreground-light text-lg leading-relaxed"
            />
            <ContentSdkLink field={fields.Link} className="main-btn self-start" />
          </div>
          <div className="relative min-h-72">
            {(fields.Image?.value?.src || isEditing) && (
              <ContentSdkImage
                field={fields.Image}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgb(102 37 119 / 0.35) 0%, rgb(203 46 121 / 0.15) 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
