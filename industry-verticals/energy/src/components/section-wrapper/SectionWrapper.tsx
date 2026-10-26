import { ComponentProps } from '@/lib/component-props';
import { Field, LinkField, Placeholder, Text } from '@sitecore-content-sdk/nextjs';

interface Fields {
  Title: Field<string>;
  Description: Field<string>;
  Link: LinkField;
}

interface SectionWrapperProps extends ComponentProps {
  fields: Fields;
}

/**
 * Full-bleed plum gradient band with a light heading. Child components keep their
 * own white cards, which read as raised panels on the gradient.
 */
export const Default = ({ params, fields, rendering }: SectionWrapperProps) => {
  const { styles, RenderingIdentifier: id } = params;
  const componentPlaceholderKey = `section-wrapper-content-${params.DynamicPlaceholderId}`;

  return (
    <section className={`component section-wrapper gradient-band py-16 lg:py-28 ${styles}`} id={id}>
      <div className="container">
        <div className="mb-12 max-w-3xl space-y-4 in-[.header-text-position-center]:mx-auto in-[.header-text-position-center]:text-center in-[.header-text-position-right]:ml-auto in-[.header-text-position-right]:text-right">
          <h2 className="text-background! text-3xl">
            <Text field={fields?.Title} />
          </h2>
          <p className="text-accent-soft text-xl">
            <Text field={fields?.Description} />
          </p>
        </div>
      </div>
      <div>
        <Placeholder name={componentPlaceholderKey} rendering={rendering} />
      </div>
    </section>
  );
};
