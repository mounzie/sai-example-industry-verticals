'use client';

import { JSX } from 'react';
import {
  Image as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ComponentProps } from '@/lib/component-props';
import {
  EMPTY_LINK,
  Ex2Empty,
  Ex2Fields,
  Ex2Item,
  byTemplate,
  childrenOf,
  hasLink,
} from '@/helpers/example2';

type Example2HeroGridProps = ComponentProps & { fields: Ex2Fields<object> };

const CategoryTile = ({ item }: { item: Ex2Item }) => (
  <ContentSdkLink
    field={item.link?.jsonValue ?? EMPTY_LINK}
    className="flex min-h-[150px] flex-1 flex-col justify-center gap-4 border border-[var(--ex2-border)] bg-white px-5 transition-colors hover:bg-[var(--ex2-band-light)] [&+&]:border-t-0"
  >
    <ContentSdkImage field={item.icon?.jsonValue} className="h-10 w-10 object-contain" />
    <ContentSdkText
      tag="span"
      field={item.label?.jsonValue}
      className="text-base font-bold text-[var(--ex2-text-strong)]"
    />
  </ContentSdkLink>
);

const PromoTile = ({ item, isEditing }: { item: Ex2Item; isEditing: boolean }) => (
  <div className="relative min-h-[240px] flex-1 overflow-hidden">
    <ContentSdkImage
      field={item.image?.jsonValue}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 z-[2] p-4 text-white">
      <ContentSdkLink
        field={item.titleLink?.jsonValue ?? EMPTY_LINK}
        className="block text-[13px] text-white"
      >
        <ContentSdkText field={item.title?.jsonValue} />
      </ContentSdkLink>
      <ContentSdkText
        tag="p"
        field={item.text?.jsonValue}
        className="mt-1 text-xl leading-snug font-bold text-white"
      />
    </div>
    {/* Whole tile is clickable on the live site; keep authoring controls reachable in editing. */}
    {hasLink(item.link) && !isEditing && (
      <ContentSdkLink
        field={item.link?.jsonValue ?? EMPTY_LINK}
        className="absolute inset-0 z-[1]"
        aria-label={String(item.text?.jsonValue?.value ?? '')}
      >
        <span className="sr-only">{String(item.text?.jsonValue?.value ?? '')}</span>
      </ContentSdkLink>
    )}
    {isEditing && (
      <div className="absolute top-2 right-2 z-[3] rounded bg-white/90 px-2 py-1 text-xs">
        <ContentSdkLink field={item.link?.jsonValue ?? EMPTY_LINK} />
      </div>
    )}
  </div>
);

/** Home hero: card-type tiles, a banner carousel and two promo tiles in one row. */
export const Default = ({ params, fields }: Example2HeroGridProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const ds = fields?.data?.datasource;

  if (!ds) {
    return isEditing ? <Ex2Empty name="EXAMPLE2 HERO GRID" id={id} /> : <></>;
  }

  const items = childrenOf(ds);
  const categories = byTemplate(items, 'Example2 Category');
  const slides = byTemplate(items, 'Example2 Slide');
  const promos = byTemplate(items, 'Example2 Promo Tile');

  return (
    <section
      className={`component example2 example2-hero-grid bg-white py-8 ${styles ?? ''}`}
      id={id}
    >
      <div className="ex2-container grid gap-3 lg:grid-cols-[3fr_5fr_4fr]">
        <div className="order-2 flex min-w-0 flex-row lg:order-1 lg:flex-col">
          {categories.map((item) => (
            <CategoryTile key={item.id} item={item} />
          ))}
        </div>

        <div className="relative order-1 min-w-0 min-h-[420px] overflow-hidden lg:order-2 lg:min-h-[560px]">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            loop={!isEditing && slides.length > 1}
            autoplay={isEditing ? false : { delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <ContentSdkLink
                  field={slide.link?.jsonValue ?? EMPTY_LINK}
                  className="block h-full w-full"
                >
                  <ContentSdkImage
                    field={slide.image?.jsonValue}
                    className="h-full w-full object-cover"
                  />
                </ContentSdkLink>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="order-3 flex min-w-0 flex-col gap-3">
          {promos.map((item) => (
            <PromoTile key={item.id} item={item} isEditing={isEditing} />
          ))}
        </div>
      </div>
    </section>
  );
};
