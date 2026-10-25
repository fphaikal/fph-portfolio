/** Status peran — dipakai untuk menandai posisi yang masih berjalan. */
export type EntryStatus = "current" | "past";

export interface ExperienceEntry {
  id: string;
  title: string;
  org: string;
  type: string;
  start: string;
  end: string;
  duration: string;
  location: string;
  locationType: string;
  summary: string;
  highlights: string[];
  status?: EntryStatus;
  /** Logo wordmark perusahaan di folder public (mis. /astra-graphia.png) */
  logo?: string;
  /** Ikon/monogram perusahaan di folder public (mis. /astra-graphia-icon.svg) */
  icon?: string;
}

/** Riwayat pengalaman kerja — urut kronologis terbaru di atas. */
export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "astra-graphia",
    title: "IT Support Specialist",
    org: "PT Astra Graphia Tbk",
    type: "Internship",
    start: "Feb 2025",
    end: "Present",
    duration: "11 mos",
    location: "Central Jakarta, Jakarta, Indonesia",
    locationType: "On-site",
    summary:
      "IT Specialist with cross-functional expertise in development, data, and automation to drive efficiency and enable data-driven decision-making.",
    highlights: [
      "Application & Web Development: built the 'iScore' web application for KPI monitoring and managed server/web environment setups to support other technical teams.",
      "Data Analysis & Business Intelligence: translated business requirements into measurable metrics, building real-time Power BI dashboards to monitor service productivity and performance.",
      "Process Automation: identified and automated manual workflows using n8n to boost productivity and minimize human error.",
    ],
    status: "current",
    logo: "/astra-graphia.png",
    icon: "/astra-graphia-icon.svg",
  },
];
