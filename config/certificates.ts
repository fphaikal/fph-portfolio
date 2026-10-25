export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

/** Sertifikasi & program pelatihan yang sudah terverifikasi. */
export const CERTIFICATES: Certificate[] = [
  {
    id: "siemens-mechatronics",
    name: "Siemens Mechatronics System Certification Program",
    issuer: "SIEMENS",
    year: "2024",
  },
  {
    id: "dicoding-web-basics",
    name: "Learn the Basics of Web Programming",
    issuer: "Dicoding",
    year: "2025",
  },
];
