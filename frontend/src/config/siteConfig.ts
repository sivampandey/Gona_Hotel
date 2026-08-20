/**
 * Centralized Site Configuration for Gona Hotel & Resort
 * Provides a single source of truth for Site URL, Canonical links, OpenGraph metadata,
 * and JSON-LD structured business data.
 */

export const DEFAULT_SITE_URL = 'https://gona-hotel.vercel.app';

export const getSiteUrl = (): string => {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_SITE_URL;
};

export const SITE_URL = getSiteUrl();

export const siteConfig = {
  name: 'Gona Hotel',
  legalName: 'Gona Hotel, Restaurant & Organic Farm',
  description: 'Experience luxury accommodation, authentic North Indian & South Indian dining, and organic agri-tourism at Gona Hotel.',
  url: SITE_URL,
  defaultOgImage: `${SITE_URL}/images/restaurant/sada-thali-bhojan.webp`,
  logoUrl: `${SITE_URL}/images/logo.png`,
  address: {
    streetAddress: 'Gona, Main Highway Road',
    addressLocality: 'Gona',
    addressRegion: 'Uttar Pradesh',
    postalCode: '208001',
    addressCountry: 'IN',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'info@gonahotel.com',
  },
};

/**
 * Generates absolute HTTPS self-referencing canonical URL
 */
export const getCanonicalUrl = (pathname: string): string => {
  const cleanPath = pathname.split('?')[0].split('#')[0];
  if (!cleanPath || cleanPath === '/') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
};

/**
 * Generates absolute HTTPS Open Graph image URL
 */
export const getOgImageUrl = (imagePath?: string): string => {
  if (!imagePath) return siteConfig.defaultOgImage;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
  return `${SITE_URL}${cleanPath}`;
};
