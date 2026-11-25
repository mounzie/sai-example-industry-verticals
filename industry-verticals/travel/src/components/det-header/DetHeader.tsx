import React, { JSX, useState } from 'react';
import {
  ImageField,
  Link,
  LinkField,
  NextImage as Image,
  Text,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { DetGqlField, DetLinkGroup } from '@/types/det';

interface DetHeaderDatasource {
  leftLogo: DetGqlField<ImageField>;
  rightLogo: DetGqlField<ImageField>;
  logoLink: DetGqlField<LinkField>;
  searchLink: DetGqlField<LinkField>;
  searchLabel: DetGqlField<TextField>;
  children: { results: DetLinkGroup[] };
}

type DetHeaderProps = ComponentProps & {
  fields: { data: { datasource: DetHeaderDatasource | null } };
};

const Chevron = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </svg>
);

/**
 * DET Header (modelled on dubaidet.gov.ae):
 * 1. utility bar - children with Value "utility" (their sub-links are shown inline;
 *    a sub-link with Value "active" is shown in bold)
 * 2. logo row - Government of Dubai logo (left) and DET logo (right)
 * 3. main navigation - every other child is a menu item; its sub-links form a dropdown
 */
export const Default = (props: DetHeaderProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const id = props.params.RenderingIdentifier;
  const ds = props.fields?.data?.datasource;

  if (!ds) {
    return (
      <div className={`component det-header ${props.params.styles ?? ''}`} id={id}>
        <span className="is-empty-hint">DET Header</span>
      </div>
    );
  }

  const groups = ds.children?.results ?? [];
  const isUtility = (g: DetLinkGroup) =>
    String(g.value?.jsonValue?.value ?? '')
      .toLowerCase()
      .trim() === 'utility';
  const utilityLinks = groups.filter(isUtility).flatMap((g) => g.children?.results ?? []);
  const menus = groups.filter((g) => !isUtility(g));

  return (
    <header className={`component det-header bg-white ${props.params.styles ?? ''}`} id={id}>
      {/* 1. Utility bar */}
      {utilityLinks.length > 0 && (
        <div className="border-b border-neutral-200">
          <ul className="container mx-auto flex flex-wrap gap-x-6 gap-y-1 px-4 py-2 text-[11px] tracking-wider uppercase">
            {utilityLinks.map((l) => {
              const active = String(l.value?.jsonValue?.value ?? '').toLowerCase() === 'active';
              return (
                <li key={l.id}>
                  <Link
                    field={l.link?.jsonValue}
                    className={`text-neutral-700 no-underline hover:text-[#005F66] ${active ? 'font-bold text-neutral-900' : ''}`}
                  >
                    <Text tag="span" field={l.title?.jsonValue} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 2. Logo row */}
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link field={ds.logoLink?.jsonValue} className="block">
          <Image field={ds.leftLogo?.jsonValue} className="h-12 w-auto object-contain md:h-14" />
        </Link>
        <div className="flex items-center gap-4">
          <Image field={ds.rightLogo?.jsonValue} className="h-12 w-auto object-contain md:h-14" />
          <button
            type="button"
            className="border border-neutral-300 p-2 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Main navigation */}
      <nav
        aria-label="Main"
        className={`border-t border-neutral-200 ${mobileOpen || isEditing ? 'block' : 'hidden'} lg:block`}
      >
        <div className="container mx-auto flex flex-col px-4 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-col lg:flex-row">
            {menus.map((menu) => {
              const subs = menu.children?.results ?? [];
              const isOpen = openMenu === menu.id || isEditing;
              return (
                <li
                  key={menu.id}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(menu.id)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <div className="flex items-center gap-1">
                    <Link
                      field={menu.link?.jsonValue}
                      className="block py-4 pr-1 text-sm font-medium text-neutral-900 no-underline hover:text-[#005F66] lg:px-3"
                    >
                      <Text tag="span" field={menu.title?.jsonValue} />
                    </Link>
                    {subs.length > 0 && (
                      <button
                        type="button"
                        aria-label="Show submenu"
                        aria-expanded={isOpen}
                        className="p-1 text-neutral-600"
                        onClick={() => setOpenMenu(isOpen ? null : menu.id)}
                      >
                        <Chevron />
                      </button>
                    )}
                  </div>
                  {subs.length > 0 && isOpen && (
                    <ul className="z-50 min-w-64 border-t-2 border-[#005F66] bg-white py-2 shadow-lg lg:absolute lg:top-full lg:left-0">
                      {subs.map((s) => (
                        <li key={s.id}>
                          <Link
                            field={s.link?.jsonValue}
                            className="block px-5 py-2 text-sm text-neutral-800 no-underline hover:bg-neutral-50 hover:text-[#005F66]"
                          >
                            <Text tag="span" field={s.title?.jsonValue} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            field={ds.searchLink?.jsonValue}
            className="mb-4 flex items-center gap-2 border border-neutral-300 px-4 py-2 text-sm text-neutral-600 no-underline hover:border-[#005F66] lg:mb-0"
          >
            <SearchIcon />
            <Text tag="span" field={ds.searchLabel?.jsonValue} />
          </Link>
        </div>
      </nav>
    </header>
  );
};
