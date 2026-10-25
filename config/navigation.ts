/**
 * Navigasi.
 *
 * Hanya rute yang benar-benar ada. Tidak ada menu mati.
 */

export interface NavModule {
  id: string;
  /** Nomor modul, ditampilkan sebagai label kecil. */
  index: string;
  label: string;
  href: string;
  /** Keterangan singkat, dipakai untuk atribut title dan pembaca layar. */
  description: string;
}

export const NAV_MODULES: NavModule[] = [
  {
    id: "home",
    index: "01",
    label: "Home",
    href: "/",
    description: "Halaman utama",
  },
  {
    id: "notes",
    index: "02",
    label: "Notes",
    href: "/blog",
    description: "Catatan dan tulisan",
  },
  {
    id: "music",
    index: "03",
    label: "Music",
    href: "/spotify",
    description: "Yang sedang saya dengar",
  },
];

export interface ExternalLink {
  id: string;
  label: string;
  href: string;
}

export const EXTERNAL_LINKS: ExternalLink[] = [
  { id: "github", label: "GitHub", href: "https://github.com/fphaikal" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/fphaikal" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com/fp_haikal" },
];
