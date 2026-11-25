import React, { JSX, useRef } from 'react';
import {
  DateField,
  Link,
  NextImage as Image,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { DetNewsItem, DetSectionProps } from '@/types/det';

const formatDate = (value?: string): string => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase();
};

const Arrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
  </svg>
);

/**
 * DET News: "News from DET" horizontal carousel of press-release cards with
 * category, date, location, headline and summary (modelled on dubaidet.gov.ae).
 */
export const Default = (props: DetSectionProps<DetNewsItem>): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const trackRef = useRef<HTMLUListElement>(null);
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-news ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET News</span>
      </div>
    );
  }

  const items = ds.children?.results ?? [];
  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({
      left: dir * trackRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });

  return (
    <section className={`component det-news py-14 lg:py-20 ${props.params.styles ?? ''}`} id={id}>
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4">
          <Text tag="h2" field={ds.title?.jsonValue} className="text-3xl font-medium md:text-4xl" />
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scroll(-1)}
              className="border border-neutral-300 p-2 hover:border-[#005F66] hover:text-[#005F66]"
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scroll(1)}
              className="border border-neutral-300 p-2 hover:border-[#005F66] hover:text-[#005F66]"
            >
              <Arrow dir="right" />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:thin]"
        >
          {items.map((n) => (
            <li
              key={n.id}
              className="flex w-[85%] shrink-0 snap-start flex-col border border-neutral-200 bg-white sm:w-[45%] lg:w-[31%]"
            >
              <Image field={n.image?.jsonValue} className="h-52 w-full object-cover" />
              <div className="flex grow flex-col gap-3 p-5">
                <Text
                  tag="span"
                  field={n.category?.jsonValue}
                  className="text-xs font-medium tracking-wider text-[#005F66] uppercase"
                />
                <div className="flex flex-wrap gap-x-3 text-xs tracking-wider text-neutral-500 uppercase">
                  {isEditing ? (
                    <DateField field={n.date?.jsonValue} />
                  ) : (
                    <span>{formatDate(n.date?.jsonValue?.value)}</span>
                  )}
                  <Text tag="span" field={n.location?.jsonValue} />
                </div>
                <Link
                  field={n.link?.jsonValue}
                  className="text-inherit no-underline hover:underline"
                >
                  <Text tag="h3" field={n.title?.jsonValue} className="text-xl font-medium" />
                </Link>
                <Text
                  tag="p"
                  field={n.summary?.jsonValue}
                  className="text-foreground-light text-sm"
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Link
            field={ds.viewAllLink?.jsonValue}
            className="font-medium text-[#005F66] underline underline-offset-4"
          />
        </div>
      </div>
    </section>
  );
};
