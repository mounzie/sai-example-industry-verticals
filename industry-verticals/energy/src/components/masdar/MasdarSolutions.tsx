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
import { ComponentProps } from '@/lib/component-props';
import { EMPTY_LINK, JsonField, MasdarListFields, MasdarSectionHeader } from '@/helpers/masdar';

type Parent = {
  badge?: JsonField<TextField>;
  title?: JsonField<TextField>;
  description?: JsonField<TextField>;
};
type Solution = {
  icon?: JsonField<ImageField>;
  title?: JsonField<TextField>;
  description?: JsonField<TextField>;
  link?: JsonField<LinkField>;
};

type MasdarSolutionsProps = ComponentProps & { fields: MasdarListFields<Parent, Solution> };

/** Two-column grid of large solution cards with an icon tile and a text link. */
export const Default = ({ params, fields }: MasdarSolutionsProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const datasource = fields?.data?.datasource;
  const items = datasource?.children?.results ?? [];

  if (!datasource) {
    return isEditing ? <div className="component masdar-solutions">[MASDAR SOLUTIONS]</div> : <></>;
  }

  return (
    <section
      className={`component masdar-solutions bg-background-muted py-20 lg:py-32 ${styles}`}
      id={id || 'solutions'}
    >
      <div className="container">
        <MasdarSectionHeader
          badge={datasource.badge}
          title={datasource.title}
          description={datasource.description}
        />
        <ul className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="soft-card group flex flex-col gap-5 p-8 lg:p-10">
              <div className="bg-background-tint group-hover:bg-background-accent flex size-16 items-center justify-center rounded-2xl p-3.5 transition-colors">
                {item.icon?.jsonValue?.value?.src || isEditing ? (
                  <ContentSdkImage
                    field={item.icon?.jsonValue}
                    className="size-full object-contain"
                  />
                ) : (
                  <span className="gradient-text text-2xl font-extrabold">
                    {(item.title?.jsonValue?.value as string)?.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="text-2xl">
                <ContentSdkText field={item.title?.jsonValue} />
              </h3>
              <ContentSdkText
                tag="p"
                field={item.description?.jsonValue}
                className="text-foreground-light grow text-lg leading-relaxed"
              />
              {(item.link?.jsonValue?.value?.href || isEditing) && (
                <ContentSdkLink
                  field={item.link?.jsonValue ?? EMPTY_LINK}
                  className="outline-btn self-start"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
