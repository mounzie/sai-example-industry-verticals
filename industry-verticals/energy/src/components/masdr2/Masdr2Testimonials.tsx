import { JSX } from 'react';
import {
  ImageField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { Quote } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { JsonField, MasdarListFields, MasdarSectionHeader } from '@/helpers/masdar';

type Parent = {
  badge?: JsonField<TextField>;
  title?: JsonField<TextField>;
  description?: JsonField<TextField>;
};
type Testimonial = {
  quote?: JsonField<TextField>;
  name?: JsonField<TextField>;
  role?: JsonField<TextField>;
  photo?: JsonField<ImageField>;
};

type Masdr2TestimonialsProps = ComponentProps & {
  fields: MasdarListFields<Parent, Testimonial>;
};

const initials = (name?: string) =>
  (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

/** Lavender band with quote cards; scrolls sideways on small screens. */
export const Default = ({ params, fields }: Masdr2TestimonialsProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const datasource = fields?.data?.datasource;
  const items = datasource?.children?.results ?? [];

  if (!datasource) {
    return isEditing ? (
      <div className="component masdar-testimonials">[MASDR2 TESTIMONIALS]</div>
    ) : (
      <></>
    );
  }

  return (
    <section
      className={`component masdar-testimonials bg-background-accent py-20 lg:py-32 ${styles}`}
      id={id}
    >
      <div className="container">
        <MasdarSectionHeader
          badge={datasource.badge}
          title={datasource.title}
          description={datasource.description}
        />
        <ul className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="soft-card flex w-[85%] shrink-0 snap-start flex-col gap-6 p-8 md:w-auto"
            >
              <Quote className="text-accent size-9" aria-hidden="true" />
              <ContentSdkText
                tag="p"
                field={item.quote?.jsonValue}
                className="text-foreground grow text-lg leading-relaxed"
              />
              <div className="flex items-center gap-4 border-t pt-6">
                {item.photo?.jsonValue?.value?.src ? (
                  <ContentSdkImage
                    field={item.photo.jsonValue}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="bg-accent-dark text-background flex size-12 items-center justify-center rounded-full font-bold">
                    {initials(item.name?.jsonValue?.value as string)}
                  </span>
                )}
                <div>
                  <ContentSdkText
                    tag="p"
                    field={item.name?.jsonValue}
                    className="text-accent-dark font-bold"
                  />
                  <ContentSdkText
                    tag="p"
                    field={item.role?.jsonValue}
                    className="text-foreground-light text-sm"
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
