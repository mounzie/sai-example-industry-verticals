'use client';

import { IGQLImageField, IGQLRichTextField, IGQLTextField, IGQLLinkField } from 'src/types/igql';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  withDatasourceCheck,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';
import { useI18n } from 'next-localization';

interface Fields {
  data: {
    datasource: {
      children: {
        results: FeatureFields[];
      };
      title: IGQLTextField;
      description: IGQLRichTextField;
    };
  };
}

interface FeatureFields {
  id: string;
  featureTitle: IGQLTextField;
  featureDescription: IGQLTextField;
  featureImage: IGQLImageField;
  featureImageDark?: IGQLImageField;
  featureLink?: IGQLLinkField;
}

type FeaturesProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const FeatureItem = ({
  feature,
  layout = 'vertical',
}: {
  feature: FeatureFields;
  layout: 'vertical' | 'horizontal';
}) => {
  const icon = (
    <div className="bg-background-tint flex size-16 shrink-0 items-center justify-center rounded-2xl p-3.5">
      <ContentSdkImage
        field={feature?.featureImage?.jsonValue}
        className="size-full object-contain"
      />
    </div>
  );

  if (layout === 'horizontal') {
    // Card variant: compact action card with a text link
    return (
      <li key={feature?.id} className="soft-card flex flex-col gap-4 p-8">
        {icon}
        <h3 className="text-xl font-bold">
          <ContentSdkText field={feature?.featureTitle?.jsonValue} />
        </h3>
        <p className="text-foreground-light grow leading-relaxed">
          <ContentSdkText field={feature?.featureDescription?.jsonValue} />
        </p>
        {feature?.featureLink?.jsonValue ? (
          <ContentSdkLink
            field={feature.featureLink.jsonValue}
            className="outline-btn self-start"
          />
        ) : null}
      </li>
    );
  }

  // Default variant: large solution card
  return (
    <li key={feature?.id} className="soft-card flex flex-col gap-5 p-8 lg:p-10">
      {icon}
      <h3 className="text-2xl font-bold">
        <ContentSdkText field={feature?.featureTitle?.jsonValue} />
      </h3>
      <p className="text-foreground-light grow text-lg leading-relaxed">
        <ContentSdkText field={feature?.featureDescription?.jsonValue} />
      </p>
      {feature?.featureLink?.jsonValue ? (
        <ContentSdkLink field={feature.featureLink.jsonValue} className="outline-btn self-start" />
      ) : null}
    </li>
  );
};

// Badge text comes from the site dictionary so authors can translate it; falls back to English.
const SectionHeading = ({
  fields,
  badgeKey,
  fallback,
}: {
  fields: Fields;
  badgeKey: string;
  fallback: string;
}) => {
  const { t } = useI18n();
  return (
    <div className="mb-12 max-w-3xl">
      <span className="section-badge">{t(badgeKey) || fallback}</span>
      <h2 className="text-3xl font-bold">
        <ContentSdkText field={fields?.data?.datasource?.title?.jsonValue} />
      </h2>
    </div>
  );
};

const DefaultFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;

  return (
    <section
      className={`bg-background-muted relative py-16 lg:py-28 ${params?.styles || ''}`}
      id={id || undefined}
    >
      <div className="container">
        <SectionHeading fields={fields} badgeKey="features_badge" fallback="Our Services" />
        <ul className="grid gap-6 lg:grid-cols-2">
          {features?.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} layout="vertical" />
          ))}
        </ul>
      </div>
    </section>
  );
};

const CardFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;

  return (
    <section
      className={`bg-background-muted relative py-16 lg:py-28 ${params?.styles || ''}`}
      id={id || undefined}
    >
      <div className="container">
        <SectionHeading fields={fields} badgeKey="features_card_badge" fallback="Get Involved" />
        <ul className="grid gap-6 lg:grid-cols-3">
          {features?.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} layout="horizontal" />
          ))}
        </ul>
      </div>
    </section>
  );
};

export const Default = withDatasourceCheck()<FeaturesProps>(DefaultFeatures);
export const Card = withDatasourceCheck()<FeaturesProps>(CardFeatures);
