import type { Metadata } from "next";
import Link from "next/link";

import Certificate from "@/components/home/certificate";
import Experience from "@/components/home/experience";
import Hero from "@/components/home/hero";
import Portfolio, { type Project } from "@/components/home/portfolio";
import SkillGrid from "@/components/home/skill-grid";
import SpotifyStats from "@/components/spotify/now-playing";
import StructuredData from "./structured-data";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const revalidate = 3600;

async function getProjects(): Promise<Project[] | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return null;

  const baseUrl = apiUrl.startsWith("http") ? apiUrl : `https://${apiUrl}`;

  try {
    const response = await fetch(`${baseUrl}/api/projects`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.data || data || [];
  } catch {
    return null;
  }
}

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

export default async function Home() {
  const projects = await getProjects();

  return (
    <section className="relative min-h-screen p-4 md:p-8 max-w-7xl mx-auto overflow-hidden">
      <StructuredData />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min pb-20">

        {/* Hero Section */}
        <div className="col-span-1 md:col-span-12 min-h-[70vh] flex items-center justify-center">
          <Hero />
        </div>

        <section
          aria-labelledby="about-fahreza"
          className="col-span-1 md:col-span-12 max-w-4xl mx-auto text-center space-y-5 pb-14"
          id="about"
        >
          <h2 id="about-fahreza" className="text-3xl md:text-5xl font-bold tracking-tight">
            About Fahreza Pasha Haikal
          </h2>
          <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
            Fahreza Pasha Haikal, known online as FPHaikal or FPH, is an IT Support Specialist,
            full-stack developer, and Mechatronics Engineering student based in Indonesia. He
            builds web applications, automation workflows, and data-driven tools that turn
            operational needs into practical digital solutions.
          </p>
          <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
            Explore his selected projects and professional experience below, or visit his{" "}
            <Link className="underline underline-offset-4 hover:text-primary" href={siteConfig.links.github} rel="me">
              GitHub profile
            </Link>{" "}
            and{" "}
            <Link className="underline underline-offset-4 hover:text-primary" href={siteConfig.links.linkedin} rel="me">
              LinkedIn profile
            </Link>
            .
          </p>
        </section>

        {/* Skills Grid */}
        <div className="col-span-1 md:col-span-12">
          <SkillGrid items={skill} />
        </div>

        {/* Experience Section */}
        <div className="col-span-1 md:col-span-12 mt-20 mb-8" id="experience">
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-black/50 dark:to-white/50 tracking-tighter">
            Professional Experience
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
          <Portfolio initialProjects={projects} />
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

    </section>
  );
}
