export type EducationStatus = "current" | "graduated";

export interface EducationEntry {
  id: string;
  institution: string;
  shortName: string;
  degree: string;
  field: string;
  facultyOrMinistry: string;
  start: string;
  end: string;
  location: string;
  status: EducationStatus;
  logo: string;
  website?: string;
  summary: string;
  highlights: string[];
  coursework: string[];
}

/** Riwayat pendidikan — urut dari jenjang terbaru ke sebelumnya. */
export const EDUCATION: EducationEntry[] = [
  {
    id: "uad-yogyakarta",
    institution: "Universitas Ahmad Dahlan",
    shortName: "UAD Yogyakarta",
    degree: "Bachelor's Degree (S1)",
    field: "Informatics (Teknik Informatika)",
    facultyOrMinistry: "Faculty of Industrial Technology (FTI)",
    start: "2025",
    end: "Present",
    location: "Yogyakarta, Indonesia",
    status: "current",
    logo: "/uad-logo.png",
    website: "https://tif.uad.ac.id",
    summary:
      "Pursuing an undergraduate degree in Informatics at the Faculty of Industrial Technology (FTI), deepening computer science foundations, software architecture, data engineering, and intelligent system automation while building production web platforms.",
    highlights: [
      "Software Engineering & Architecture: focusing on scalable full-stack web applications, RESTful API design, relational database modeling, and modern TypeScript/Next.js ecosystems.",
      "Data & Intelligent Systems: studying algorithmic problem-solving, data structures, business intelligence pipelines, and AI-assisted workflow automation.",
      "Applied Industry Alignment: bridging academic computer science principles directly with enterprise IT operations, KPI analytics, and cloud deployment.",
    ],
    coursework: [
      "Algorithms & Data Structures",
      "Software Engineering",
      "Database Systems",
      "Computer Networks",
      "Web Architecture",
      "Artificial Intelligence",
    ],
  },
  {
    id: "smk-smti-yogyakarta",
    institution: "SMK SMTI Yogyakarta",
    shortName: "SMK SMTI Yogyakarta",
    degree: "Vocational High School Diploma (4-Year Program)",
    field: "Mechatronics Engineering (Teknik Mekatronika)",
    facultyOrMinistry: "BPSDMI · Ministry of Industry of the Republic of Indonesia",
    start: "2021",
    end: "2025",
    location: "Yogyakarta, Indonesia",
    status: "graduated",
    logo: "/smti-yogyakarta.png",
    website: "https://smtijogja.sch.id",
    summary:
      "Completed an intensive 4-year industrial engineering program under the Ministry of Industry (Kemenperin RI), combining industrial automation, PLC control, embedded systems, and 3D CAD with full-stack software development.",
    highlights: [
      "Siemens Mechatronics Certification (SMSCP): earned the international Siemens Mechatronics Systems Assistant (Level 1) credential covering system-level industrial troubleshooting and PLC integration.",
      "IoT & Campus Innovation: engineered 'GASKAN' (Smart Gate & Attendance System) using ESP32, Raspberry Pi, RFID, and ultrasonic sensors, and developed the official web platform for Chemicfest #8.",
      "Industrial Placement (PKL): selected for an enterprise IT & engineering internship at PT Astra Graphia Tbk in Central Jakarta, building KPI monitoring systems and n8n workflow automation.",
    ],
    coursework: [
      "PLC & Industrial Automation",
      "Microcontrollers (ESP32 / Arduino)",
      "Pneumatics & Electro-Pneumatics",
      "CAD & 3D Modeling (SolidWorks)",
      "Embedded IoT Telemetry",
      "Siemens SMSCP Level 1",
    ],
  },
];
