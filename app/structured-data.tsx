import { siteConfig } from "@/config/site";

export default function StructuredData() {
  const personId = `${siteConfig.url}/#person`;
  const websiteId = `${siteConfig.url}/#website`;
  const profileId = `${siteConfig.url}/#profile`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: [siteConfig.fullName, "FPH"],
        description: siteConfig.description,
        inLanguage: "en-US",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": profileId,
        url: siteConfig.url,
        name: `${siteConfig.fullName} (${siteConfig.name})`,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.fullName,
        alternateName: siteConfig.alternateNames,
        url: siteConfig.url,
        mainEntityOfPage: { "@id": profileId },
        jobTitle: ["IT Support Specialist", "Full Stack Developer"],
        description: siteConfig.description,
        sameAs: [
          siteConfig.links.github,
          siteConfig.links.instagram,
          siteConfig.links.linkedin,
        ].filter(Boolean),
        worksFor: {
          "@type": "Organization",
          name: "PT Astra Graphia Tbk",
        },
        knowsAbout: [
          "IT support",
          "Full-stack web development",
          "Automation",
          "Data analysis",
          "Mechatronics engineering",
          "Next.js",
          "React",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
