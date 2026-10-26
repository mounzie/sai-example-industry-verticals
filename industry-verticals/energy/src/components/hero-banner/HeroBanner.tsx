import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Image: ImageField;
  Video: ImageField;
  Title: Field<string>;
  Description: Field<string>;
  CtaLink: LinkField;
  SecondaryCtaLink: LinkField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

export const Default = ({ params, fields }: HeroBannerProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;

  const hasMedia = fields?.Video?.value?.src || fields?.Image?.value?.src;

  if (!fields) {
    return isPageEditing ? (
      <div className={`component hero-banner ${styles}`} id={id}>
        [HERO BANNER]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <div
      className={`component hero-banner bg-background-muted relative flex min-h-[600px] items-center overflow-hidden pt-24 pb-28 lg:min-h-[720px] ${styles}`}
      id={id}
    >
      {/* Background Media */}
      {hasMedia && (
        <div className="absolute inset-0 z-0">
          {!isPageEditing && fields?.Video?.value?.src ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={fields.Image?.value?.src}
            >
              <source src={fields.Video?.value?.src} type="video/webm" />
            </video>
          ) : (
            <ContentSdkImage field={fields.Image} className="h-full w-full object-cover" priority />
          )}
        </div>
      )}

      {/* Light wash: white on the reading side, fading into a magenta tint */}
      <div
        className="absolute inset-0 z-1"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgb(255 255 255 / 0.94) 0%, rgb(255 255 255 / 0.78) 45%, rgb(203 46 121 / 0.18) 100%), linear-gradient(180deg, transparent 70%, var(--color-background-muted) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-3 container">
        <div className="max-w-3xl">
          <h1 className="text-4xl leading-[1.15] lg:text-5xl">
            {isPageEditing ? (
              <ContentSdkText field={fields.Title} />
            ) : (
              <TwoToneTitle text={fields.Title?.value} />
            )}
          </h1>

          <div className="text-foreground mt-6 text-lg leading-loose lg:text-xl">
            <ContentSdkRichText field={fields.Description} />
          </div>

          {(fields?.CtaLink?.value?.href ||
            fields?.SecondaryCtaLink?.value?.href ||
            isPageEditing) && (
            <div className="mt-10 flex flex-wrap gap-4">
              <Link field={fields.CtaLink} className="main-btn" />
              {(fields?.SecondaryCtaLink?.value?.href || isPageEditing) && (
                <Link field={fields.SecondaryCtaLink} className="secondary-btn" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the title with its last two words in the plum → magenta gradient.
 * Only used outside editing mode, so authors still edit the plain Title field.
 */
const TwoToneTitle = ({ text }: { text?: string }) => {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  if (words.length < 3) return <span className="gradient-text">{text}</span>;

  const plain = words.slice(0, -2).join(' ');
  const highlight = words.slice(-2).join(' ');
  return (
    <>
      {plain} <span className="gradient-text">{highlight}</span>
    </>
  );
};
