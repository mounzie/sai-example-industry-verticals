import { Field, ImageField, LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useI18n } from 'next-localization';

// Items picked in a Multilist field arrive with their own fields
export type BupaItem<TFields> = {
  id: string;
  name?: string;
  fields: TFields;
};

export type BupaLinkFields = {
  Link: LinkField;
  Icon?: Field<string>;
};

export type BupaProductFields = {
  Logo: ImageField;
  Brand: Field<string>;
  Name: Field<string>;
  Description: Field<string>;
  CtaLink: LinkField;
};

export type BupaFeatureFields = {
  Icon: Field<string>;
  Title: Field<string>;
  Description: Field<string>;
};

export type BupaServiceFields = {
  Icon: Field<string>;
  Title: Field<string>;
  Description: Field<string>;
  Image: ImageField;
  Link: LinkField;
};

export type BupaFaqFields = {
  Category: Field<string>;
  Question: Field<string>;
  Answer: Field<string>;
};

// Built-in English and Arabic UI labels; a Sitecore Dictionary entry with the same key overrides them
const LABELS: Record<string, { en: string; ar: string }> = {
  bupa_menu: { en: 'Menu', ar: 'القائمة' },
  bupa_close: { en: 'Close', ar: 'إغلاق' },
  bupa_main_nav: { en: 'Main', ar: 'القائمة الرئيسية' },
  bupa_search: { en: 'Search', ar: 'البحث' },
  bupa_learn_more: { en: 'Learn More', ar: 'اعرف المزيد' },
  bupa_services_nav: { en: 'Services', ar: 'الخدمات' },
  bupa_faq_categories: { en: 'FAQ categories', ar: 'تصنيفات الأسئلة' },
  bupa_follow_us: { en: 'Follow us', ar: 'تابعنا' },
  bupa_app_store: { en: 'Download on the', ar: 'حمّل من' },
  bupa_google_play: { en: 'Get it on', ar: 'احصل عليه من' },
};

export const isArabicLocale = (locale?: string) => (locale || 'en').toLowerCase().startsWith('ar');

/** Returns a label function for the current page language */
export const useBupaLabels = () => {
  const { page } = useSitecore();
  const { t } = useI18n();
  const arabic = isArabicLocale(page.locale);
  return {
    arabic,
    isEditing: page.mode.isEditing,
    label: (key: string) => t(key) || (LABELS[key] ? LABELS[key][arabic ? 'ar' : 'en'] : key),
  };
};

/** Multilist fields can arrive empty or missing; always hand back an array */
export const bupaItems = <T,>(value: unknown): BupaItem<T>[] =>
  Array.isArray(value) ? (value as BupaItem<T>[]).filter((item) => item?.fields) : [];

/** A Multi-Line Text field holding one entry per line */
export const bupaLines = (field?: Field<string>): string[] =>
  (field?.value ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
