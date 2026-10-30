'use client';

import React, { JSX, useState } from 'react';
import clsx from 'clsx';
import {
  Field,
  Link as ContentSdkLink,
  LinkField,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { BupaFaqFields, bupaItems, useBupaLabels } from '../non-sitecore/bupaShared';
import { BupaIcon } from '../non-sitecore/BupaIcon';

interface Fields {
  Title: Field<string>;
  Subtitle: Field<string>;
  AllLabel: Field<string>;
  Faqs: unknown;
  ViewAllLink: LinkField;
}

export type BupaFaqProps = ComponentProps & {
  fields: Fields;
};

/** FAQs filtered by category chips, each question opening its answer */
export const Default = (props: BupaFaqProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const { isEditing, label } = useBupaLabels();

  if (!fields) {
    return (
      <div className={`component bupa bupa-faq ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">Bupa FAQ</span>
      </div>
    );
  }

  const faqs = bupaItems<BupaFaqFields>(fields.Faqs);
  const categories = Array.from(
    new Set(faqs.map((faq) => faq.fields.Category?.value?.trim()).filter((c): c is string => !!c))
  );
  // Pages shows every question so all of them can be edited
  const visible =
    isEditing || !category
      ? faqs
      : faqs.filter((faq) => faq.fields.Category?.value?.trim() === category);

  return (
    <section className={`component bupa bupa-section bupa-faq ${styles ?? ''}`} id={id}>
      <div className="bupa-wrap bupa-faq__inner">
        <div className="bupa-faq__head">
          <ContentSdkText tag="h2" className="bupa-section__title" field={fields.Title} />
          <ContentSdkText tag="p" className="bupa-faq__subtitle" field={fields.Subtitle} />
          {(fields.ViewAllLink?.value?.href || isEditing) && (
            <ContentSdkLink field={fields.ViewAllLink} className="bupa-btn bupa-btn--outline" />
          )}
        </div>

        <div className="bupa-faq__body">
          {categories.length > 0 && (
            <div className="bupa-faq__chips" role="group" aria-label={label('bupa_faq_categories')}>
              <button
                type="button"
                className={clsx('bupa-chip', !category && 'is-active')}
                aria-pressed={!category}
                onClick={() => setCategory(null)}
              >
                {isEditing ? (
                  <ContentSdkText field={fields.AllLabel} />
                ) : (
                  fields.AllLabel?.value || 'All'
                )}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={clsx('bupa-chip', category === c && 'is-active')}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="bupa-faq__list">
            {visible.map((faq) => {
              const isOpen = isEditing || open === faq.id;
              const panelId = `bupa-faq-${faq.id}`;
              return (
                <div key={faq.id} className={clsx('bupa-faq__item', isOpen && 'is-open')}>
                  <h3 className="bupa-faq__q">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : faq.id)}
                    >
                      <ContentSdkText tag="span" field={faq.fields.Question} />
                      <BupaIcon name={isOpen ? 'minus' : 'plus'} size={20} strokeWidth={2.2} />
                    </button>
                  </h3>
                  <div id={panelId} className="bupa-faq__a" hidden={!isOpen}>
                    <ContentSdkRichText field={faq.fields.Answer} />
                    {isEditing && (
                      <ContentSdkText
                        tag="span"
                        className="bupa-faq__category-edit"
                        field={faq.fields.Category}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
