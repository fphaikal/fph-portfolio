"use client";

import dynamic from "next/dynamic";
import FluidBackground from "@/components/ui/fluid-background";
import GlassCard from "@/components/ui/glass-card";

const Certificate = dynamic(() => import("@/components/home/certificate"), { ssr: false });
const Portfolio = dynamic(() => import("@/components/home/portfolio"), { ssr: false });
const SkillGrid = dynamic(() => import("@/components/home/skill-grid"), { ssr: false });
const Hero = dynamic(() => import("@/components/home/hero"), { ssr: false });
const SpotifyStats = dynamic(() => import("@/components/spotify/now-playing"), { ssr: false });
const GithubStats = dynamic(() => import("@/components/github/index"), { ssr: false });
const Experience = dynamic(() => import("@/components/home/experience"), { ssr: false });

const skill = [
  { name: "Next.js", description: "React Framework", className: "dark:invert", icon: "nextjs.svg" },
  { name: "Vue.js", description: "Progressive Framework", className: "", icon: "vuejs.svg" },
  { name: "Nuxt.js", description: "Intuitive Vue Framework", className: "", icon: "nuxt.svg" },
  { name: "Tailwind CSS", description: "Utility-first CSS", className: "", icon: "tailwindcss.svg" },
  { name: "TypeScript", description: "Typed JavaScript", className: "", icon: "ts.svg" },
  { name: "JavaScript", description: "Web Language", className: "", icon: "js.svg" },
  { name: "Vercel", description: "Deployment Platform", className: "dark:invert", icon: "vercel.svg" },
  { name: "Node.js", description: "JS Runtime", className: "", icon: "nodejs.svg" },
  { name: "MongoDB", description: "NoSQL Database", className: "", icon: "mongodb.svg" },
  { name: "Arduino", description: "Electronics Platform", className: "", icon: "arduino.svg" },
  { name: "Raspberry Pi", description: "Single-board Computer", className: "", icon: "raspberry-pi.svg" },
  { name: "SolidWorks", description: "3D CAD", className: "", icon: "solidworks.svg" }
];



const certificates = [
  {
    name: "Siemens Mechatronics System Certification Program",
    company: "SIEMENS",
    year: "2024",
    image: "/smscp.webp",
  },
  {
    name: "Learn the Basics of Web Programming",
    company: "Dicoding",
    year: "2025",
    image: "/web-developer.webp",
  },
];

const experiences = [
  {
    title: "IT Support Specialist",
    company: "PT Astra Graphia Tbk",
    companyLogo: "/astra-graphia-icon.svg",
    companyColor: "#6E1D46", // Astra Graphia brand maroon
    type: "Internship",
    startDate: "Feb 2025",
    endDate: "Present",
    duration: "11 mos",
    location: "Central Jakarta, Jakarta, Indonesia",
    locationType: "On-site",
    description: "An IT Specialist with cross-functional expertise in development, data, and automation to drive efficiency and enable data-driven decision-making.",
    highlights: [
      "Application & Web Development: Built the 'iScore' web application for KPI monitoring and managed server/web environment setups to support other technical teams.",
      "Data Analysis & Business Intelligence: Translated business requirements into measurable metrics, building real-time Power BI dashboards to monitor service productivity and performance.",
      "Process Automation: Identified and automated manual workflows using n8n to boost productivity and minimize the potential for human error."
    ]
  }
];

export default function Home() {
  return (
    <section className="relative min-h-screen p-4 md:p-8 max-w-7xl mx-auto overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min pb-20">

        {/* Hero Section */}
        <div className="col-span-1 md:col-span-12 min-h-[70vh] flex items-center justify-center">
          <Hero />
        </div>

        {/* Skills Grid */}
        <div className="col-span-1 md:col-span-12">
          <SkillGrid items={skill} />
        </div>

        {/* Experience Section */}
        <div className="col-span-1 md:col-span-12 mt-20 mb-8" id="experience">
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-black/50 dark:to-white/50 tracking-tighter">
            Experience
          </h2>
        </div>

        <div className="col-span-1 md:col-span-12">
          <Experience experiences={experiences} />
        </div>

        {/* Stats Row */}
        <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-5 gap-2 items-center mt-20">
          {/* <GlassCard className="" intensity="medium">
            <GithubStats />
          </GlassCard> */}

          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-black/50 dark:to-white/50 tracking-tighter">
            My<br /> Spotify
          </h2>

          <div className="col-span-4">
            <SpotifyStats className="" />
          </div>
        </div>

        {/* Projects Section */}
        <div className="col-span-1 md:col-span-12 mt-20 mb-8" id="projects">
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-black/50 dark:to-white/50 tracking-tighter">
            Selected Projects
          </h2>
        </div>

        <div className="col-span-1 md:col-span-12">
          <Portfolio />
        </div>

        {/* Certificates Section */}
        <div className="col-span-1 md:col-span-12 mt-20 mb-8">
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-black/50 dark:to-white/50 tracking-tighter">
            Certifications
          </h2>
        </div>

        <div className="col-span-1 md:col-span-12">
          <Certificate certificate={certificates} />
        </div>

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Fahreza Pasha Haikal",
            alternateName: ["FPHaikal", "FPH", "Fahreza Haikal"],
            url: "https://www.fph.my.id",
            image: "https://www.fph.my.id/og-image.png",
            sameAs: [
              "https://github.com/fphaikal",
              "https://instagram.com/fp_haikal",
              "https://linkedin.com/in/fphaikal",
            ],
            jobTitle: "IT Support Specialist",
            worksFor: {
              "@type": "Organization",
              name: "PT Astra Graphia Tbk",
            },
            description: "Mechatronics Engineering Student and Full Stack Developer passionate about programming and automation.",
            knowsAbout: ["Web Development", "Mechatronics", "Automation", "IT Support", "Next.js", "React"],
          }),
        }}
      />
    </section>
  );
}
