'use client';
import { DesignLibrary } from '@sitecore-content-sdk/nextjs';

// Content SDK 2.x: the import map is supplied by SitecoreProvider (see src/Providers.tsx),
// so DesignLibrary no longer takes a loadImportMap prop.
export const DesignLibraryLayout = () => {
  return <DesignLibrary />;
};
