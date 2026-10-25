export type SiteConfig = typeof siteConfig;

/**
 * Konfigurasi identitas situs.
 *
 * Navigasi TIDAK lagi didefinisikan di sini — lihat `config/navigation.ts`.
 * Sebelumnya file ini memuat `navMenuItems` dengan delapan rute yang tidak
 * pernah ada (/profile, /dashboard, /projects, /team, /calendar, /settings,
 * /help-feedback, /logout) beserta ikon yang hanya dipakai sidebar lama.
 */
export const siteConfig = {
  name: "FPHaikal",
  fullName: "Fahreza Pasha Haikal",
  alternateNames: ["FPHaikal", "FPH", "Fahreza Haikal"],
  title: "Fahreza Pasha Haikal (FPHaikal) | IT Support & Full Stack Developer",
  description:
    "Official portfolio of Fahreza Pasha Haikal, also known as FPHaikal and FPH—an IT Support Specialist and full-stack developer in Indonesia.",
  keywords: [
    "Fahreza Pasha Haikal",
    "FPHaikal",
    "FPH",
    "IT Support Specialist",
    "Full Stack Developer",
    "Web Developer",
    "Mechatronics Engineering",
    "Next.js Developer",
    "React Developer",
    "Indonesia",
    "Portfolio",
  ],
  url: "https://www.fph.my.id",
  ogImage: "https://www.fph.my.id/opengraph-image",
  links: {
    github: "https://github.com/fphaikal",
    instagram: "https://instagram.com/fp_haikal",
    linkedin: "https://linkedin.com/in/fphaikal",
  },
};
