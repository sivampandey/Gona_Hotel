import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig, getCanonicalUrl, getOgImageUrl } from '../config/siteConfig';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object | object[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalPath,
  ogImage,
  ogType = 'website',
  noindex = false,
  jsonLd,
}) => {
  const location = useLocation();
  const currentPath = canonicalPath || location.pathname;

  const pageTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | Comfortable Stay & Luxury Hospitality`;
  const pageDescription = description || siteConfig.description;
  const canonicalUrl = getCanonicalUrl(currentPath);
  const fullOgImage = getOgImageUrl(ogImage);

  useEffect(() => {
    // 1. Update document title
    document.title = pageTitle;

    // Helper to set/update meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta description & robots
    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 3. Open Graph tags
    setMetaTag('property', 'og:site_name', siteConfig.name);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', fullOgImage);

    // 4. Twitter Card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', fullOgImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data
    const scriptId = 'seo-jsonld-script';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(jsonLd);
    } else if (scriptElement) {
      scriptElement.remove();
    }
  }, [pageTitle, pageDescription, canonicalUrl, fullOgImage, ogType, noindex, jsonLd]);

  return null;
};
