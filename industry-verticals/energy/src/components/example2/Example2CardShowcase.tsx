import { JSX } from 'react';
import {
  TextField,
  Image as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { EMPTY_LINK, Ex2Empty, Ex2Fields, JsonField, childrenOf } from '@/helpers/example2';

type Parent = { title?: JsonField<TextField> };
type Example2CardShowcaseProps = ComponentProps & { fields: Ex2Fields<Parent> };

/** "Choose the card" row: a centred heading over product cards that link to their pages. */
export const Default = ({ params, fields }: Example2CardShowcaseProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const ds = fields?.data?.datasource;

  if (!ds) {
    return isEditing ? <Ex2Empty name="EXAMPLE2 CARD SHOWCASE" id={id} /> : <></>;
  }

  return (
    <section
      className={`component example2 example2-card-showcase bg-white pt-10 pb-12 ${styles ?? ''}`}
      id={id}
    >
      <div className="ex2-container">
        <ContentSdkText
          tag="h1"
          field={ds.title?.jsonValue}
          className="mb-10 text-center text-[32px] leading-[1.2] font-normal"
        />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {childrenOf(ds).map((card) => (
            <li key={card.id} className="flex flex-col items-center text-center">
              <ContentSdkLink
                field={card.link?.jsonValue ?? EMPTY_LINK}
                className="block transition-transform duration-300 hover:-translate-y-1"
              >
                <ContentSdkImage
                  field={card.image?.jsonValue}
                  className="h-auto w-full max-w-[250px] rounded-md shadow-md"
                />
              </ContentSdkLink>
              <ContentSdkText
                tag="h2"
                field={card.title?.jsonValue}
                className="mt-4 max-w-[250px] text-base leading-[1.2] font-normal"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
