'use client';

import { JSX } from 'react';
import {
  ImageField,
  LinkField,
  TextField,
  Image as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/shadcn/components/ui/drawer';
import { ComponentProps } from '@/lib/component-props';
import {
  EMPTY_LINK,
  Ex2Empty,
  Ex2Fields,
  Ex2Item,
  JsonField,
  byTemplate,
  childrenOf,
  hasLink,
  normalizeEx2Item,
} from '@/helpers/example2';

type Parent = {
  logo?: JsonField<ImageField>;
  logoLink?: JsonField<LinkField>;
  languageLink?: JsonField<LinkField>;
  helpLink?: JsonField<LinkField>;
  loginLabel?: JsonField<TextField>;
};

type Example2HeaderProps = ComponentProps & { fields: Ex2Fields<Parent> };

/** Mega-menu panel: one column per nav group, each with its links. */
const MegaPanel = ({ groups }: { groups: Ex2Item[] }) => (
  <div className="invisible absolute top-full left-0 z-50 w-full translate-y-1 bg-white opacity-0 shadow-[var(--ex2-shadow-menu)] transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
    <div className="ex2-container flex flex-wrap gap-x-16 gap-y-6 py-6">
      {groups.map((group) => (
        <div key={group.id} className="min-w-52">
          <ContentSdkText
            tag="p"
            field={group.title?.jsonValue}
            className="py-2 pr-4 text-[13px] leading-4 font-bold text-[var(--ex2-text-heading-muted)]"
          />
          <ul className="flex flex-col gap-3 pt-2">
            {childrenOf(group).map((link) => (
              <li key={link.id}>
                <ContentSdkLink
                  field={link.link?.jsonValue ?? EMPTY_LINK}
                  className="ex2-link text-[15px] leading-[18px]"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

/** Brand header: logo, mega-menu, language link, help link and a Log In menu of portal links. */
export const Default = ({ params, fields }: Example2HeaderProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const ds = normalizeEx2Item<Parent & { children?: { results?: Ex2Item[] } }>(
    fields?.data?.datasource as Parameters<typeof normalizeEx2Item>[0]
  );

  if (!ds) {
    return isEditing ? <Ex2Empty name="EXAMPLE2 HEADER" id={id} /> : <></>;
  }

  const items = childrenOf(ds);
  const navItems = byTemplate(items, 'Example2 Nav Item');
  const loginMenu = byTemplate(items, 'Example2 Link Menu')[0];
  const loginLinks = childrenOf(loginMenu);

  const logo = (
    <ContentSdkLink
      field={ds.logoLink?.jsonValue ?? EMPTY_LINK}
      className="flex shrink-0 items-center"
      aria-label="Home"
    >
      <ContentSdkImage field={ds.logo?.jsonValue} className="h-[45px] w-[45px] object-contain" />
    </ContentSdkLink>
  );

  return (
    <header
      className={`component example2 example2-header relative z-50 border-b border-[var(--ex2-border-light)] bg-white ${styles ?? ''}`}
      id={id}
    >
      <div className="ex2-container flex h-[54px] items-center gap-4">
        {logo}

        {/* Desktop mega-menu */}
        <nav className="hidden h-full lg:flex" aria-label="Main">
          <ul className="flex h-full items-stretch border-x border-[var(--ex2-border-light)]">
            {navItems.map((item) => {
              const groups = childrenOf(item);
              return (
                <li
                  key={item.id}
                  className="group static flex items-center border-r border-[var(--ex2-border-light)] last:border-r-0"
                >
                  <ContentSdkLink
                    field={item.link?.jsonValue ?? EMPTY_LINK}
                    className="flex h-full items-center px-5 font-[Inter,sans-serif] text-[15px] leading-[18px] text-[var(--ex2-primary)]"
                  />
                  {groups.length > 0 && <MegaPanel groups={groups} />}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-5">
          {(hasLink(ds.languageLink) || isEditing) && (
            <ContentSdkLink
              field={ds.languageLink?.jsonValue ?? EMPTY_LINK}
              className="ex2-link text-base"
            />
          )}
          {(hasLink(ds.helpLink) || isEditing) && (
            <ContentSdkLink
              field={ds.helpLink?.jsonValue ?? EMPTY_LINK}
              className="hidden text-[15px] text-[var(--ex2-primary)] md:inline"
            />
          )}

          {/* Log In menu: plain links to the brand's own portals */}
          <div className="group relative hidden sm:block">
            <button type="button" className="ex2-btn gap-1" aria-haspopup="true">
              <ContentSdkText field={ds.loginLabel?.jsonValue} />
              <ChevronDown className="size-4" />
            </button>
            {loginLinks.length > 0 && (
              <ul className="invisible absolute top-full right-0 z-50 mt-1 min-w-56 rounded-[var(--ex2-radius-sm)] bg-white py-2 opacity-0 shadow-[var(--ex2-shadow-menu)] transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {loginLinks.map((link) => (
                  <li key={link.id}>
                    <ContentSdkLink
                      field={link.link?.jsonValue ?? EMPTY_LINK}
                      className="block px-4 py-2 text-[15px] text-[var(--ex2-primary)] hover:bg-[var(--ex2-band-light)]"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile menu */}
          <div className="lg:hidden">
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="rounded-[var(--ex2-radius-md)] bg-[var(--ex2-primary)] p-2 text-white"
                >
                  <Menu className="size-5" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="example2 w-full! max-w-sm! overflow-y-auto bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  {logo}
                  <DrawerClose asChild>
                    <button type="button" aria-label="Close menu" className="p-1">
                      <X className="size-6" />
                    </button>
                  </DrawerClose>
                </div>
                <ul className="flex flex-col divide-y divide-[var(--ex2-border-light)]">
                  {navItems.map((item) => (
                    <li key={item.id} className="py-3">
                      <ContentSdkLink
                        field={item.link?.jsonValue ?? EMPTY_LINK}
                        className="text-lg text-[var(--ex2-primary)]"
                      />
                      {childrenOf(item).map((group) => (
                        <div key={group.id} className="mt-3 pl-3">
                          <ContentSdkText
                            tag="p"
                            field={group.title?.jsonValue}
                            className="text-[13px] font-bold text-[var(--ex2-text-heading-muted)]"
                          />
                          <ul className="mt-1">
                            {childrenOf(group).map((link) => (
                              <li key={link.id}>
                                <ContentSdkLink
                                  field={link.link?.jsonValue ?? EMPTY_LINK}
                                  className="ex2-link block py-1.5 text-[15px]"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
                {loginLinks.length > 0 && (
                  <div className="mt-6">
                    <ContentSdkText
                      tag="p"
                      field={ds.loginLabel?.jsonValue}
                      className="mb-2 font-bold"
                    />
                    {loginLinks.map((link) => (
                      <ContentSdkLink
                        key={link.id}
                        field={link.link?.jsonValue ?? EMPTY_LINK}
                        className="ex2-link block py-1.5"
                      />
                    ))}
                  </div>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
};
