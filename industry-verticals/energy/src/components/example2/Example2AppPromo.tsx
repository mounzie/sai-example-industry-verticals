import { JSX } from 'react';
import {
  ImageField,
  LinkField,
  RichTextField,
  TextField,
  Image as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  EMPTY_LINK,
  Ex2Empty,
  Ex2Fields,
  JsonField,
  childrenOf,
  hasImage,
  hasLink,
} from '@/helpers/example2';

type Parent = {
  image?: JsonField<ImageField>;
  title?: JsonField<RichTextField>;
  description?: JsonField<TextField>;
  qrImage?: JsonField<ImageField>;
  qrCaption?: JsonField<TextField>;
  appStoreLink?: JsonField<LinkField>;
  appStoreBadge?: JsonField<ImageField>;
  googlePlayLink?: JsonField<LinkField>;
  googlePlayBadge?: JsonField<ImageField>;
};
type Example2AppPromoProps = ComponentProps & { fields: Ex2Fields<Parent> };

const StoreBadge = ({
  link,
  badge,
  isEditing,
}: {
  link?: JsonField<LinkField>;
  badge?: JsonField<ImageField>;
  isEditing: boolean;
}) =>
  hasLink(link) || hasImage(badge) || isEditing ? (
    <ContentSdkLink field={link?.jsonValue ?? EMPTY_LINK} className="inline-block">
      <ContentSdkImage field={badge?.jsonValue} className="h-10 w-auto" />
    </ContentSdkLink>
  ) : null;

/** Mobile app promo: phone image, headline, feature list, QR code and store links. */
export const Default = ({ params, fields }: Example2AppPromoProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const ds = fields?.data?.datasource;

  if (!ds) {
    return isEditing ? <Ex2Empty name="EXAMPLE2 APP PROMO" id={id} /> : <></>;
  }

  return (
    <section
      className={`component example2 example2-app-promo bg-white pt-6 ${styles ?? ''}`}
      id={id}
    >
      <div className="ex2-container grid items-center gap-10 md:grid-cols-2">
        <div className="flex justify-center md:justify-end">
          <ContentSdkImage
            field={ds.image?.jsonValue}
            className="h-auto w-full max-w-[608px] object-contain"
          />
        </div>
        <div className="py-6">
          <ContentSdkRichText
            field={ds.title?.jsonValue}
            className="[&_h2]:text-[32px] [&_h2]:leading-[48px] [&_h2]:font-bold [&_p]:text-[32px] [&_p]:leading-[48px] [&_p]:font-bold"
          />
          <ContentSdkText
            tag="p"
            field={ds.description?.jsonValue}
            className="mt-4 text-xl text-[var(--ex2-text-subtle)]"
          />
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {childrenOf(ds).map((feature) => (
              <li key={feature.id} className="flex items-start gap-4">
                <ContentSdkImage
                  field={feature.icon?.jsonValue}
                  className="h-8 w-8 shrink-0 object-contain"
                />
                <ContentSdkText
                  tag="span"
                  field={feature.text?.jsonValue}
                  className="max-w-48 text-[13px] leading-4"
                />
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-6">
            <ContentSdkImage field={ds.qrImage?.jsonValue} className="h-32 w-32 object-contain" />
            <ContentSdkText
              tag="p"
              field={ds.qrCaption?.jsonValue}
              className="max-w-64 text-base font-bold"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:hidden">
            <StoreBadge link={ds.appStoreLink} badge={ds.appStoreBadge} isEditing={isEditing} />
            <StoreBadge link={ds.googlePlayLink} badge={ds.googlePlayBadge} isEditing={isEditing} />
          </div>
          {isEditing && (
            <div className="mt-6 hidden flex-wrap gap-3 md:flex">
              <StoreBadge link={ds.appStoreLink} badge={ds.appStoreBadge} isEditing />
              <StoreBadge link={ds.googlePlayLink} badge={ds.googlePlayBadge} isEditing />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
