import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  RichTextField,
  RichText as ContentSdkRichText,
  Image as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { Article } from '@/types/article';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from 'next-localization';

interface Fields {
  Title: Field<string>;
  Description: RichTextField;
  Articles: Array<Article>;
}

export type SelectedArticlesProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SelectedArticlesProps) => {
  const { t } = useI18n();
  const id = props.params.RenderingIdentifier;
  const styles = props.params.styles || [];
  const articles = props.fields?.Articles || [];

  return (
    <section className={`bg-background-muted py-16 lg:py-28 ${styles}`} id={id}>
      <div className="container">
        {/* header */}
        <div className="in-[.column-splitter]:px-0">
          <div className="mb-12 max-w-3xl">
            <span className="section-badge">{t('selected_articles_badge') || 'Newsroom'}</span>
            <h2 className="mb-4 text-3xl">
              <ContentSdkText field={props.fields.Title} />
            </h2>
            <div className="text-foreground-light text-lg">
              <ContentSdkRichText field={props.fields.Description} />
            </div>
          </div>
        </div>

        {/* article list section */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, index) => {
            return (
              <Link
                key={index}
                href={article.url}
                className="soft-card group flex flex-col overflow-hidden transition-shadow hover:shadow-xl"
              >
                <div className="overflow-hidden">
                  <ContentSdkImage
                    field={article.fields.Image}
                    className="h-48 w-full shrink-0 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex grow flex-col justify-between gap-6 p-6">
                  <h3 className="text-lg leading-snug">
                    <ContentSdkText field={article.fields.Title} />
                  </h3>
                  <span className="text-accent inline-flex items-center gap-1 self-start text-sm font-bold">
                    {t('read_more') || 'Read More'}
                    <ArrowRight className="h-4 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
