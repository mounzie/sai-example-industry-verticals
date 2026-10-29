import { JSX } from 'react';
import {
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
  JsonField,
  childrenOf,
  hasImage,
} from '@/helpers/example2';

type Parent = { title?: JsonField<TextField> };
type Example2PrivilegesProps = ComponentProps & { fields: Ex2Fields<Parent> };

/** Grey band with a heading and image cards (eyebrow, title, outlined button). */
export const Default = ({ params, fields }: Example2PrivilegesProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const ds = fields?.data?.datasource;

  if (!ds) {
    return isEditing ? <Ex2Empty name="EXAMPLE2 PRIVILEGES" id={id} /> : <></>;
  }

  return (
    <section
      className={`component example2 example2-privileges bg-[var(--ex2-band)] pt-10 pb-12 ${styles ?? ''}`}
      id={id}
    >
      <div className="ex2-container">
        <ContentSdkText
          tag="h2"
          field={ds.title?.jsonValue}
          className="mb-8 text-center text-[32px] leading-[1.2] font-normal"
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {childrenOf(ds).map((item) => (
            <li key={item.id} className="flex flex-col bg-white">
              <div className="aspect-[400/263] overflow-hidden">
                <ContentSdkImage
                  field={item.image?.jsonValue}
                  className={`h-full w-full object-cover ${hasImage(item.mobileImage) ? 'hidden md:block' : ''}`}
                />
                {(hasImage(item.mobileImage) || isEditing) && (
                  <ContentSdkImage
                    field={item.mobileImage?.jsonValue}
                    className={`h-full w-full object-cover ${isEditing ? '' : 'md:hidden'}`}
                  />
                )}
              </div>
              <div className="flex grow flex-col px-4 pt-4 pb-4">
                <ContentSdkText
                  tag="h3"
                  field={item.title?.jsonValue}
                  className="text-xl leading-6 font-bold"
                />
                <ContentSdkText
                  tag="p"
                  field={item.eyebrow?.jsonValue}
                  className="mt-2 text-base text-[var(--ex2-text-muted)]"
                />
                <div className="mt-auto pt-6">
                  <ContentSdkLink
                    field={item.link?.jsonValue ?? EMPTY_LINK}
                    className="ex2-btn-outline"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
