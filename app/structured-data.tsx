'use client'

import { siteConfig } from "@/config/site"

export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "image": siteConfig.ogImage,
    "jobTitle": "IT Support Specialist & Full Stack Developer",
    "description": siteConfig.description,
    "sameAs": [
      siteConfig.links.github,
      siteConfig.links.instagram,
      siteConfig.links.linkedin,
    ].filter(Boolean),
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "inLanguage": "en-US",
    "author": {
      "@type": "Person",
      "name": siteConfig.name
    }
  };

  // Schema for the portfolio collection/creative work
  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "FPHaikal Portfolio",
    "description": "Showcase of projects and skills by Fahreza Pasha Haikal",
    "url": `${siteConfig.url}/projects`,
    "author": {
      "@type": "Person",
      "name": siteConfig.name
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioSchema),
        }}
      />
    </>
  );
}
