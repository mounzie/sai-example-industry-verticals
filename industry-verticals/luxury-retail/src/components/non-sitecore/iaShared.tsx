import { useCallback, useEffect, useRef, useState } from 'react';
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
  /** Dropdown links under a header menu item */
  SubLinks?: unknown;
};

export type IaSlideFields = {
  Heading: Field<string>;
  Slogan: Field<string>;
  Image: ImageField;
  CtaLink: LinkField;
};

export type IaServiceFields = {
  Icon?: Field<string>;
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
  ia_view_all: { en: 'View All', ar: 'عرض الكل' },
  ia_read_more: { en: 'Read more', ar: 'قراءة المزيد' },
  ia_service_details: { en: 'Service Details', ar: 'تفاصيل الخدمة' },
  ia_service_start: { en: 'Start eService', ar: 'بدء الخدمة' },
  ia_audience_individuals: { en: 'Individual', ar: 'أفراد' },
  ia_audience_businesses: { en: 'Business', ar: 'أعمال' },
  ia_login: { en: 'Sign In', ar: 'تسجيل الدخول' },
  ia_search: { en: 'Search', ar: 'البحث' },
  ia_menu: { en: 'Menu', ar: 'القائمة' },
  ia_main_nav: { en: 'Main', ar: 'القائمة الرئيسية' },
  ia_previous: { en: 'Previous', ar: 'السابق' },
  ia_next: { en: 'Next', ar: 'التالي' },
  ia_click_here: { en: 'Click Here', ar: 'اضغط هنا' },
  ia_follow_us: { en: 'Follow Us', ar: 'تابعنا على' },
  ia_back_to_top: { en: 'Back to top', ar: 'العودة للأعلى' },
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

/**
 * Horizontal carousel built on native scrolling (works with touch, keyboard and RTL).
 * Returns a ref for the scrolling track, the page count, the current page, and prev/next/goTo.
 */
export const useIaCarousel = (itemCount: number) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const total = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(total);
    // scrollLeft is negative in right-to-left layouts, so compare its size only
    setPage(Math.min(total - 1, Math.round(Math.abs(el.scrollLeft) / el.clientWidth)));
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure, itemCount]);

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    const target = Math.max(0, Math.min(pages - 1, index)) * el.clientWidth;
    el.scrollTo({ left: rtl ? -target : target, behavior: 'smooth' });
  };

  return {
    trackRef,
    pages,
    page,
    goTo,
    prev: () => goTo(page - 1),
    next: () => goTo(page + 1),
  };
};
