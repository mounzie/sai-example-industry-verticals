import { Field, ImageField, LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useI18n } from 'next-localization';

// Items picked in a Multilist field arrive with their own fields
export type IaItem<TFields> = {
  id: string;
  name?: string;
  fields: TFields;
};

export type IaLinkFields = {
  Link: LinkField;
  Icon?: Field<string>;
};

export type IaSlideFields = {
  Heading: Field<string>;
  Slogan: Field<string>;
  Image: ImageField;
  CtaLink: LinkField;
};

export type IaServiceFields = {
  Title: Field<string>;
  Description: Field<string>;
  IsBusiness: Field<boolean>;
  DetailsLink: LinkField;
  StartLink: LinkField;
};

export type IaNewsFields = {
  Title: Field<string>;
  Summary: Field<string>;
  Date: Field<string>;
  Image: ImageField;
  Link: LinkField;
};

export type IaPartnerFields = {
  Logo: ImageField;
  Link: LinkField;
};

// Built-in English and Arabic UI labels; a Sitecore Dictionary entry with the same key overrides them
const LABELS: Record<string, { en: string; ar: string }> = {
  ia_view_all: { en: 'View all', ar: 'عرض الكل' },
  ia_read_more: { en: 'Read more', ar: 'قراءة المزيد' },
  ia_service_details: { en: 'Service details', ar: 'تفاصيل الخدمة' },
  ia_service_start: { en: 'Start service', ar: 'بدء الخدمة' },
  ia_filter_all: { en: 'All', ar: 'الكل' },
  ia_filter_individuals: { en: 'Individuals', ar: 'الأفراد' },
  ia_filter_businesses: { en: 'Businesses', ar: 'الأعمال' },
  ia_audience_individuals: { en: 'For individuals', ar: 'خدمة للأفراد' },
  ia_audience_businesses: { en: 'For businesses', ar: 'خدمة للأعمال' },
  ia_login: { en: 'Log in', ar: 'تسجيل الدخول' },
  ia_search: { en: 'Search', ar: 'البحث' },
  ia_menu: { en: 'Menu', ar: 'القائمة' },
  ia_main_nav: { en: 'Main', ar: 'القائمة الرئيسية' },
  ia_previous: { en: 'Previous', ar: 'السابق' },
  ia_next: { en: 'Next', ar: 'التالي' },
  ia_phone: { en: 'Toll-free number', ar: 'الرقم المجاني' },
  ia_email: { en: 'Email', ar: 'البريد الإلكتروني' },
  ia_sign_language: { en: 'Sign-language video call', ar: 'مكالمة فيديو بلغة الإشارة' },
  ia_complaint: { en: 'Submit a complaint', ar: 'تقديم شكوى' },
  ia_follow_us: { en: 'Follow us', ar: 'تابعنا على' },
};

export const isArabicLocale = (locale?: string) => (locale || 'en').toLowerCase().startsWith('ar');

/** Returns a label function for the current page language */
export const useIaLabels = () => {
  const { page } = useSitecore();
  const { t } = useI18n();
  const arabic = isArabicLocale(page.locale);
  return {
    arabic,
    locale: page.locale || 'en',
    isEditing: page.mode.isEditing,
    label: (key: string) => t(key) || (LABELS[key] ? LABELS[key][arabic ? 'ar' : 'en'] : key),
  };
};

/** Multilist fields can arrive empty or missing; always hand back an array */
export const iaItems = <T,>(value: unknown): IaItem<T>[] =>
  Array.isArray(value) ? (value as IaItem<T>[]).filter((item) => item?.fields) : [];
