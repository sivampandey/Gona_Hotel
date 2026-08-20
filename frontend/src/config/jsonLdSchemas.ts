import { siteConfig } from './siteConfig';

/**
 * Returns Schema.org Hotel JSON-LD object for Gona Hotel
 */
export const getHotelSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': `${siteConfig.url}/#hotel`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    image: [siteConfig.defaultOgImage],
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    checkinTime: '12:00',
    checkoutTime: '11:00',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free High-Speed WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Pure Veg Restaurant & Dining', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Organic Farm & Agri-Tourism', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Room Service', value: true },
    ],
  };
};

/**
 * Returns Schema.org BreadcrumbList JSON-LD object for breadcrumb navigation
 */
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};
