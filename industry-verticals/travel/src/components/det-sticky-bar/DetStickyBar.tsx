import React, { JSX } from 'react';
import { Link, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { DetCard, DetSectionProps } from '@/types/det';

/** Icons chosen by the "Value" field of each link item. */
const icons: Record<string, JSX.Element> = {
  services: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  newsroom: <path d="M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5" />,
  contact: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  whatsapp: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
};

/**
 * DET Sticky Bar: the bar fixed to the bottom of the screen on dubaidet.gov.ae
 * (Services, Newsroom, Contact us, WhatsApp chat). Shown inline while editing.
 */
export const Default = (props: DetSectionProps<DetCard>): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-sticky-bar ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET Sticky Bar</span>
      </div>
    );
  }

  const links = ds.children?.results ?? [];
  const position = isEditing ? 'relative' : 'fixed bottom-0 left-0 right-0';

  return (
    <>
      {!isEditing && <div aria-hidden="true" className="h-16" />}
      <nav
        aria-label="Quick actions"
        className={`component det-sticky-bar ${position} z-40 border-t border-neutral-200 bg-white/95 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] backdrop-blur ${props.params.styles ?? ''}`}
        id={id}
      >
        <ul className="container mx-auto flex items-center justify-between gap-2 px-4 py-3 md:justify-end md:gap-8">
          {links.map((l) => {
            const key = String(l.value?.jsonValue?.value ?? '')
              .toLowerCase()
              .trim();
            return (
              <li key={l.id}>
                <Link
                  field={l.link?.jsonValue}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-800 no-underline hover:text-[#005F66]"
                >
                  {icons[key] && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {icons[key]}
                    </svg>
                  )}
                  <Text tag="span" field={l.title?.jsonValue} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
