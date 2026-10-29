'use client';

import { JSX, useEffect, useState } from 'react';
import {
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ChevronDown, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/shadcn/components/ui/drawer';
import { ComponentProps } from '@/lib/component-props';
import { EMPTY_LINK, JsonField, MasdarListFields } from '@/helpers/masdar';

type NavLink = {
  id: string;
  link?: JsonField<LinkField>;
  /** Optional icon, shown next to dropdown (second-level) links. */
  icon?: JsonField<ImageField>;
  children?: { results?: NavLink[] };
};
type Parent = {
  logo?: JsonField<ImageField>;
  logoLink?: JsonField<LinkField>;
  languageLink?: JsonField<LinkField>;
  ctaLink?: JsonField<LinkField>;
};

type Masdr2HeaderProps = ComponentProps & { fields: MasdarListFields<Parent, NavLink> };

const hasHref = (field?: JsonField<LinkField>) => Boolean(field?.jsonValue?.value?.href);

/** Floating, rounded header: logo, nav with dropdowns, language switch and CTA. */
export const Default = ({ params, fields }: Masdr2HeaderProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const datasource = fields?.data?.datasource;
  const navItems = datasource?.children?.results ?? [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!datasource) {
    return isEditing ? <div className="component masdar-header">[MASDR2 HEADER]</div> : <></>;
  }

  const logo = (
    <ContentSdkLink
      field={datasource.logoLink?.jsonValue ?? EMPTY_LINK}
      className="flex shrink-0 items-center"
      aria-label="Home"
    >
      <ContentSdkImage field={datasource.logo?.jsonValue} className="h-9 w-auto object-contain" />
    </ContentSdkLink>
  );

  const isActive = (item: NavLink) => {
    const href = item.link?.jsonValue?.value?.href;
    return Boolean(
      href && href !== '#' && (href === '/' ? pathname === '/' : pathname?.startsWith(href))
    );
  };

  return (
    <header
      className={`component masdar-header sticky top-0 z-50 w-full px-4 pt-4 ${styles}`}
      id={id}
    >
      <div
        className={`container flex items-center gap-6 rounded-2xl px-6 py-3 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 shadow-[0_0_0.5rem_rgb(0_0_0/0.04),0_1.5rem_2rem_rgb(0_0_0/0.05)]'
            : 'bg-white/70'
        }`}
      >
        {logo}

        {/* Desktop navigation */}
        <nav className="hidden flex-1 justify-center lg:flex" aria-label="Main">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const sub = item.children?.results ?? [];
              return (
                <li key={item.id} className="group relative">
                  <div
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 font-semibold transition-colors ${
                      isActive(item)
                        ? 'text-accent-dark bg-[#f7deea]'
                        : 'text-foreground hover:text-accent-dark hover:bg-background-tint'
                    }`}
                  >
                    <ContentSdkLink field={item.link?.jsonValue ?? EMPTY_LINK} />
                    {sub.length > 0 && (
                      <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                    )}
                  </div>
                  {sub.length > 0 && (
                    <ul className="invisible absolute top-full left-0 min-w-60 translate-y-2 rounded-2xl bg-white p-2 opacity-0 shadow-xl transition-all group-focus-within:visible group-focus-within:translate-y-1 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
                      {sub.map((child) => (
                        <li
                          key={child.id}
                          className="text-foreground hover:bg-background-tint hover:text-accent-dark flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold transition-colors"
                        >
                          {(child.icon?.jsonValue?.value?.src || isEditing) && (
                            <ContentSdkImage
                              field={child.icon?.jsonValue}
                              className="size-4 shrink-0 object-contain"
                            />
                          )}
                          <ContentSdkLink
                            field={child.link?.jsonValue ?? EMPTY_LINK}
                            className="block grow"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4 lg:ml-0">
          {(hasHref(datasource.languageLink) || isEditing) && (
            <ContentSdkLink
              field={datasource.languageLink?.jsonValue ?? EMPTY_LINK}
              className="text-accent-dark hover:text-accent font-semibold transition-colors"
            />
          )}
          {(hasHref(datasource.ctaLink) || isEditing) && (
            <ContentSdkLink
              field={datasource.ctaLink?.jsonValue ?? EMPTY_LINK}
              className="main-btn hidden! after:hidden! sm:flex!"
            />
          )}

          {/* Mobile menu */}
          <div className="lg:hidden">
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="text-accent-dark hover:text-accent p-1 transition-colors"
                >
                  <Menu className="size-7" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-background-muted w-full! max-w-sm! p-6">
                <div className="mb-8 flex items-center justify-between">
                  {logo}
                  <DrawerClose asChild>
                    <button type="button" aria-label="Close menu" className="text-accent-dark p-1">
                      <X className="size-6" />
                    </button>
                  </DrawerClose>
                </div>
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <ContentSdkLink
                        field={item.link?.jsonValue ?? EMPTY_LINK}
                        className="text-foreground hover:bg-background-tint block rounded-lg px-3 py-3 text-lg font-bold"
                      />
                      {(item.children?.results ?? []).length > 0 && (
                        <ul className="border-accent-soft mb-2 ml-4 border-l pl-3">
                          {item.children?.results?.map((child) => (
                            <li key={child.id}>
                              <ContentSdkLink
                                field={child.link?.jsonValue ?? EMPTY_LINK}
                                className="text-foreground-light hover:text-accent-dark block py-2 font-semibold"
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                {hasHref(datasource.ctaLink) && (
                  <ContentSdkLink
                    field={datasource.ctaLink?.jsonValue ?? EMPTY_LINK}
                    className="main-btn mt-8"
                  />
                )}
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
};
