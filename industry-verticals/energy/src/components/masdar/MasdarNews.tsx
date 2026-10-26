import { JSX } from 'react';
import {
  DateField,
  Field,
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import {
  EMPTY_DATE,
  EMPTY_LINK,
  JsonField,
  MasdarListFields,
  MasdarSectionHeader,
} from '@/helpers/masdar';

type Parent = {
  badge?: JsonField<TextField>;
  title?: JsonField<TextField>;
  link?: JsonField<LinkField>;
};
type NewsItem = {
  image?: JsonField<ImageField>;
  date?: JsonField<Field<string>>;
  category?: JsonField<TextField>;
  title?: JsonField<TextField>;
  link?: JsonField<LinkField>;
};

type MasdarNewsProps = ComponentProps & { fields: MasdarListFields<Parent, NewsItem> };

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

/** Newsroom row: image cards with category, date and title, plus a "view all" link. */
export const Default = ({ params, fields }: MasdarNewsProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const datasource = fields?.data?.datasource;
  const items = datasource?.children?.results ?? [];

  if (!datasource) {
    return isEditing ? <div className="component masdar-news">[MASDAR NEWS]</div> : <></>;
  }

  const viewAll =
    datasource.link?.jsonValue?.value?.href || isEditing ? (
      <ContentSdkLink field={datasource.link?.jsonValue ?? EMPTY_LINK} className="secondary-btn" />
    ) : null;

  return (
    <section
      className={`component masdar-news bg-background-muted py-20 lg:py-32 ${styles}`}
      id={id}
    >
      <div className="container">
        <MasdarSectionHeader badge={datasource.badge} title={datasource.title} aside={viewAll} />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="soft-card group flex flex-col overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden">
                <ContentSdkImage
                  field={item.image?.jsonValue}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex grow flex-col gap-4 p-6 lg:p-8">
                <div className="flex items-center gap-3 text-sm">
                  <ContentSdkText
                    tag="span"
                    field={item.category?.jsonValue}
                    className="section-badge mb-0! text-sm!"
                  />
                  <DateField
                    tag="span"
                    field={item.date?.jsonValue ?? EMPTY_DATE}
                    className="text-foreground-secondary"
                    render={(date) => formatDate(date?.toISOString())}
                  />
                </div>
                <h3 className="grow text-xl leading-snug">
                  <ContentSdkText field={item.title?.jsonValue} />
                </h3>
                {(item.link?.jsonValue?.value?.href || isEditing) && (
                  <ContentSdkLink
                    field={item.link?.jsonValue ?? EMPTY_LINK}
                    className="text-accent inline-flex items-center gap-1 self-start text-sm font-bold"
                  >
                    {item.link?.jsonValue?.value?.text || 'Read more'}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </ContentSdkLink>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
