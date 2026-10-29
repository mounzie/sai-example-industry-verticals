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
  JsonField,
  childrenOf,
  hasLink,
} from '@/helpers/example2';

type Parent = {
  backgroundImage?: JsonField<ImageField>;
  helpIcon?: JsonField<ImageField>;
  helpTitle?: JsonField<TextField>;
  helpText?: JsonField<TextField>;
  helpLink?: JsonField<LinkField>;
  callTitle?: JsonField<TextField>;
};
type Example2HelpContactProps = ComponentProps & { fields: Ex2Fields<Parent> };

/** "Need help?" band: help-centre link on the left, phone numbers on the right. */
export const Default = ({ params, fields }: Example2HelpContactProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const ds = fields?.data?.datasource;

  if (!ds) {
    return isEditing ? <Ex2Empty name="EXAMPLE2 HELP CONTACT" id={id} /> : <></>;
  }

  const bg = ds.backgroundImage?.jsonValue?.value?.src;

  return (
    <section
      className={`component example2 example2-help-contact relative overflow-hidden bg-[var(--ex2-band-light)] bg-cover bg-center py-20 ${styles ?? ''}`}
      id={id}
      style={bg ? { backgroundImage: `url("${bg}")` } : undefined}
    >
      {isEditing && (
        <div className="absolute top-2 left-2 z-10 h-12 w-24 overflow-hidden rounded border bg-white">
          <ContentSdkImage
            field={ds.backgroundImage?.jsonValue}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="ex2-container flex flex-col gap-10 md:flex-row md:justify-center md:gap-0">
        <div className="flex gap-5 md:border-r md:border-[var(--ex2-border)] md:pr-8">
          <ContentSdkImage field={ds.helpIcon?.jsonValue} className="h-[50px] w-[50px] shrink-0" />
          <div>
            <ContentSdkText
              tag="p"
              field={ds.helpTitle?.jsonValue}
              className="text-xl leading-6 font-medium"
            />
            <ContentSdkText
              tag="p"
              field={ds.helpText?.jsonValue}
              className="mt-1 text-[13px] leading-4 text-[var(--ex2-text-subtle)]"
            />
            {(hasLink(ds.helpLink) || isEditing) && (
              <ContentSdkLink
                field={ds.helpLink?.jsonValue ?? EMPTY_LINK}
                className="ex2-btn mt-4 rounded-[var(--ex2-radius-md)] px-3 py-1.5 text-base"
              />
            )}
          </div>
        </div>
        <div className="md:pl-8">
          <ContentSdkText
            tag="p"
            field={ds.callTitle?.jsonValue}
            className="text-xl leading-6 font-medium"
          />
          <ul className="mt-2 flex flex-wrap gap-8">
            {childrenOf(ds).map((contact) => (
              <li key={contact.id} className="flex items-start gap-3">
                {(contact.icon?.jsonValue?.value?.src || isEditing) && (
                  <ContentSdkImage
                    field={contact.icon?.jsonValue}
                    className="mt-1 h-6 w-6 shrink-0 md:hidden"
                  />
                )}
                <div>
                  <ContentSdkText
                    tag="p"
                    field={contact.label?.jsonValue}
                    className="text-[13px] leading-4 text-[var(--ex2-text-subtle)]"
                  />
                  <ContentSdkLink
                    field={contact.phoneLink?.jsonValue ?? EMPTY_LINK}
                    className="mt-1 block text-2xl leading-[1.2] font-medium text-[var(--ex2-text-strong)]"
                  >
                    <ContentSdkText field={contact.phone?.jsonValue} />
                  </ContentSdkLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
