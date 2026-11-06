import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import {
  Field,
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface SlideFields {
  Image: ImageField;
  Caption: TextField;
  Link: LinkField;
}

interface SlideItem {
  id: string;
  name?: string;
  fields: SlideFields;
}

interface Fields {
  Title: TextField;
  Subtitle: TextField;
  Slides: SlideItem[];
  Autoplay: Field<boolean>;
  IntervalSeconds: Field<number | string>;
  RightToLeft: Field<boolean>;
}

export type ImageCarouselProps = ComponentProps & {
  fields?: Fields;
};

interface BuiltInSlide {
  src: string;
  alt: string;
}

// Shipped with the app in /public so the carousel works with no Sitecore media or datasource
const BUILT_IN_SLIDES: BuiltInSlide[] = [
  { src: '/carousel/kiswa/kiswa-01.webp', alt: 'كسوة الكعبة عبر التاريخ' },
  { src: '/carousel/kiswa/kiswa-02.webp', alt: 'البداية الأولى: أول من كسا الكعبة' },
  {
    src: '/carousel/kiswa/kiswa-03.webp',
    alt: 'في عهد النبي ﷺ والخلفاء الراشدين: الكسوة تصبح شعيرة منظمة',
  },
  {
    src: '/carousel/kiswa/kiswa-04.webp',
    alt: 'العصور الإسلامية المتعاقبة: تنافس الحضارات على خدمة الكعبة',
  },
  { src: '/carousel/kiswa/kiswa-05.webp', alt: 'نقطة التحول التاريخية: العهد السعودي' },
  {
    src: '/carousel/kiswa/kiswa-06.webp',
    alt: 'مجمع الملك عبدالعزيز لكسوة الكعبة المشرفة: صناعة تتجاوز مفهوم الحرفة',
  },
  { src: '/carousel/kiswa/kiswa-07.webp', alt: '1448هـ: ذروة الإتقان التقني' },
  { src: '/carousel/kiswa/kiswa-08.webp', alt: 'كسوة الكعبة تاريخٌ يُنسج بخيوط ذهب' },
];

const BUILT_IN_WIDTH = 1080;
const BUILT_IN_HEIGHT = 1350;
const DEFAULT_INTERVAL_SECONDS = 5;
const SLIDE_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw';

const isChecked = (field?: Field<boolean>, fallback = false) => {
  const value = field?.value as unknown;
  if (value === undefined || value === null || value === '') return fallback;
  return value === true || value === '1' || value === 1 || value === 'true';
};

export const Default = (props: ImageCarouselProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const authoredSlides = (fields?.Slides ?? []).filter(
    (slide) => slide?.fields?.Image?.value?.src || isEditing
  );
  const useBuiltIn = authoredSlides.length === 0;
  const slideCount = useBuiltIn ? BUILT_IN_SLIDES.length : authoredSlides.length;

  const rtl = isChecked(fields?.RightToLeft, true);
  const autoplay = isChecked(fields?.Autoplay, true) && !isEditing;
  const intervalMs = (Number(fields?.IntervalSeconds?.value) || DEFAULT_INTERVAL_SECONDS) * 1000;

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // Scroll positions a slide can be aligned to; fewer than slides when several show at once
  const [positions, setPositions] = useState(slideCount);
  const [paused, setPaused] = useState(false);

  const slideEls = () =>
    Array.from(trackRef.current?.querySelectorAll<HTMLElement>('.image-carousel__slide') ?? []);

  // Works in both directions: aligns the slide's leading edge with the track's leading edge
  const goTo = useCallback(
    (index: number, smooth = true) => {
      const track = trackRef.current;
      const slide = slideEls()[index];
      if (!track || !slide) return;
      const t = track.getBoundingClientRect();
      const s = slide.getBoundingClientRect();
      const delta = rtl ? s.right - t.right : s.left - t.left;
      track.scrollBy({ left: delta, behavior: smooth ? 'smooth' : 'auto' });
    },
    [rtl]
  );

  const syncState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = slideEls();
    if (!slides.length) return;
    const t = track.getBoundingClientRect();
    const first = slides[0].getBoundingClientRect();
    const scrolled = Math.abs(track.scrollLeft);
    const max = track.scrollWidth - track.clientWidth;
    let reachable = 0;
    let lastOffset = 0;
    let closest = 0;
    let best = Number.POSITIVE_INFINITY;
    slides.forEach((slide, i) => {
      const s = slide.getBoundingClientRect();
      const offset = rtl ? first.right - s.right : s.left - first.left;
      if (offset <= max + 1) {
        reachable = i + 1;
        lastOffset = offset;
      }
      const distance = Math.abs(rtl ? s.right - t.right : s.left - t.left);
      if (distance < best) {
        best = distance;
        closest = i;
      }
    });
    const isEnd = scrolled >= max - 1;
    // When the slides don't divide evenly, the fully scrolled end is one more position
    const count = Math.max(reachable, 1) + (lastOffset < max - 1 ? 1 : 0);
    setPositions(count);
    setActive(isEnd ? count - 1 : Math.min(closest, count - 1));
    setAtStart(scrolled <= 1);
    setAtEnd(isEnd);
  }, [rtl]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncState);
    };
    syncState();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [syncState, slideCount]);

  const next = useCallback(() => goTo(atEnd ? 0 : active + 1), [goTo, atEnd, active]);
  const prev = useCallback(
    () => goTo(atStart ? positions - 1 : active - 1),
    [goTo, atStart, active, positions]
  );

  useEffect(() => {
    if (!autoplay || paused || slideCount < 2) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) next();
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, intervalMs, next, slideCount]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) {
      event.preventDefault();
      next();
    } else if (event.key === backward) {
      event.preventDefault();
      prev();
    }
  };

  const hasTitle = isEditing || fields?.Title?.value || fields?.Subtitle?.value;

  return (
    <div
      className={`component image-carousel ${styles ?? ''}`}
      id={id}
      dir={rtl ? 'rtl' : 'ltr'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="image-carousel__wrap">
        {hasTitle && fields && (
          <div className="image-carousel__header">
            <ContentSdkText tag="h2" className="image-carousel__title" field={fields.Title} />
            <ContentSdkText tag="p" className="image-carousel__subtitle" field={fields.Subtitle} />
          </div>
        )}

        {isEditing && useBuiltIn && (
          <div className="image-carousel__hint">
            Showing the built-in Kiswa slides. Add Image Carousel Slide items under this datasource
            and select them in the Slides field to replace them.
          </div>
        )}

        <div className="image-carousel__viewport">
          <div
            ref={trackRef}
            className="image-carousel__track"
            role="region"
            aria-roledescription="carousel"
            aria-label={fields?.Title?.value?.toString() || 'Image carousel'}
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            {useBuiltIn
              ? BUILT_IN_SLIDES.map((slide, i) => (
                  <figure
                    key={slide.src}
                    className="image-carousel__slide"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} / ${slideCount}`}
                  >
                    <NextImage
                      src={slide.src}
                      alt={slide.alt}
                      width={BUILT_IN_WIDTH}
                      height={BUILT_IN_HEIGHT}
                      sizes={SLIDE_SIZES}
                      className="image-carousel__image"
                      priority={i === 0}
                    />
                  </figure>
                ))
              : authoredSlides.map((slide, i) => {
                  const image = (
                    <ContentSdkImage
                      field={slide.fields.Image}
                      sizes={SLIDE_SIZES}
                      className="image-carousel__image"
                    />
                  );
                  const href = slide.fields.Link?.value?.href;
                  return (
                    <figure
                      key={slide.id ?? i}
                      className="image-carousel__slide"
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} / ${slideCount}`}
                    >
                      {href && !isEditing ? (
                        <ContentSdkLink field={slide.fields.Link}>{image}</ContentSdkLink>
                      ) : (
                        image
                      )}
                      {(isEditing || slide.fields.Caption?.value) && (
                        <ContentSdkText
                          tag="figcaption"
                          className="image-carousel__caption"
                          field={slide.fields.Caption}
                        />
                      )}
                    </figure>
                  );
                })}
          </div>

          {slideCount > 1 && (
            <>
              <button
                type="button"
                className="image-carousel__arrow image-carousel__arrow--prev"
                onClick={prev}
                aria-label="Previous slide"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                className="image-carousel__arrow image-carousel__arrow--next"
                onClick={next}
                aria-label="Next slide"
              >
                <span aria-hidden="true">›</span>
              </button>
            </>
          )}
        </div>

        {positions > 1 && (
          <div className="image-carousel__dots">
            {Array.from({ length: positions }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`image-carousel__dot ${i === active ? 'is-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
