import { JSX } from 'react';
import { Text as ContentSdkText, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { JsonField, MasdarListFields, MasdarSectionHeader } from '@/helpers/masdar';

type Parent = {
  badge?: JsonField<TextField>;
  title?: JsonField<TextField>;
  description?: JsonField<TextField>;
};
type Stat = {
  value?: JsonField<TextField>;
  label?: JsonField<TextField>;
  description?: JsonField<TextField>;
};

type MasdarImpactProps = ComponentProps & { fields: MasdarListFields<Parent, Stat> };

/** Plum gradient band: heading on the left, translucent stat cards stacked on the right. */
export const Default = ({ params, fields }: MasdarImpactProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const datasource = fields?.data?.datasource;
  const stats = datasource?.children?.results ?? [];

  if (!datasource) {
    return isEditing ? <div className="component masdar-impact">[MASDAR IMPACT]</div> : <></>;
  }

  return (
    <section className={`component masdar-impact gradient-band py-20 lg:py-32 ${styles}`} id={id}>
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <MasdarSectionHeader
          inverted
          badge={datasource.badge}
          title={datasource.title}
          description={datasource.description}
        />
        <ul className="flex flex-col gap-6">
          {stats.map((stat) => (
            <li
              key={stat.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_1.5rem_2rem_rgb(0_0_0/0.06)] backdrop-blur-sm lg:p-10"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <ContentSdkText
                  tag="span"
                  field={stat.value?.jsonValue}
                  className="text-background text-4xl font-extrabold lg:text-5xl"
                />
                <ContentSdkText
                  tag="span"
                  field={stat.label?.jsonValue}
                  className="text-accent-soft text-xl font-bold"
                />
              </div>
              <ContentSdkText
                tag="p"
                field={stat.description?.jsonValue}
                className="mt-3 text-lg text-white/80"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
