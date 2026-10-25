/** Status repo — metadata saja, tidak lagi dipakai untuk pewarnaan. */
export type ProjectState = "active" | "archived";

/**
 * Data proyek nyata milik Fahreza Pasha Haikal (github.com/fphaikal).
 * Dikelompokkan menjadi empat panel sesuai konsep Control Room.
 *
 * Catatan kejujuran: `status` mencerminkan keadaan repo yang sebenarnya,
 * bukan klaim pemasaran. Repo yang sudah tidak disentuh ditandai "idle".
 */

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech: string[];
  year: string;
  url?: string;
  status: ProjectState;
  /** Label teks untuk status — makna tidak boleh bergantung pada warna saja. */
  stateLabel: string;
}

export interface ProjectGroup {
  id: string;
  /** Nomor panel, mis. "01". */
  index: string;
  title: string;
  /** Kalimat pendek di bawah judul panel. */
  summary: string;
  /** Teknologi kunci yang ditonjolkan di header panel. */
  keyTech: string[];
  items: ProjectItem[];
}

export const PROJECT_GROUPS: ProjectGroup[] = [
  {
    id: "reliability",
    index: "01",
    title: "Reliability & Ops",
    summary:
      "Perangkat lunak yang tugasnya menjaga sistem lain tetap hidup, dan membuat kegagalannya terlihat sebelum pengguna menyadarinya.",
    keyTech: ["Monitoring", "Alerting", "Docker"],
    items: [
      {
        id: "meytrics",
        name: "MEYTRICS",
        description:
          "Aplikasi pemantauan uptime self-hosted bergaya UptimeRobot. Status page publik plus dashboard admin terlindungi, uptime bar 90 hari, monitor HTTP/DNS/keyword/database, alert email, dan OG image dinamis.",
        tech: ["React", "Express", "Prisma", "SQLite", "JWT", "Docker"],
        year: "2026",
        url: "https://github.com/fphaikal/meytrics",
        status: "active",
        stateLabel: "MAINTAINED",
      },
      {
        id: "spm-dashboard",
        name: "SPM Dashboard",
        description:
          "Dashboard internal untuk memantau indikator kinerja. Dibuat agar tim operasional bisa membaca kondisi layanan tanpa membuka spreadsheet.",
        tech: ["TypeScript", "Dashboard"],
        year: "2025",
        url: "https://github.com/fphaikal/spm-dashboard",
        status: "archived",
        stateLabel: "ARCHIVED",
      },
    ],
  },
  {
    id: "hardware",
    index: "02",
    title: "Hardware ↔ Software",
    summary:
      "Sisi mekatronika: perangkat fisik yang dihubungkan ke layanan web. Inilah bagian \"sensor\" dari kalimat \"from sensor to screen\".",
    keyTech: ["IoT", "ESP32", "Raspberry Pi"],
    items: [
      {
        id: "gaskan",
        name: "GASKAN",
        description:
          "Gerbang Akses Pintar dan Kehadiran. Menggabungkan kontrol akses fisik dengan pencatatan kehadiran yang langsung tersinkron ke dashboard.",
        tech: ["TypeScript", "IoT", "Access Control"],
        year: "2026",
        url: "https://github.com/fphaikal/gaskan",
        status: "active",
        stateLabel: "ACTIVE",
      },
      {
        id: "dashboard-iot",
        name: "Dashboard IoT",
        description:
          "Pasangan klien-server untuk membaca dan mengendalikan perangkat IoT dari browser. Sensor mengirim data, dashboard menampilkannya secara berkala.",
        tech: ["Vue", "Node.js", "Sensors"],
        year: "2024",
        url: "https://github.com/fphaikal/dashboardIot",
        status: "archived",
        stateLabel: "ARCHIVED",
      },
      {
        id: "natslock",
        name: "Natslock",
        description:
          "Sistem locker pintar generasi berikutnya. Mengelola ketersediaan, penyewa, dan pembukaan unit langsung dari antarmuka web.",
        tech: ["Nuxt 3", "Vue"],
        year: "2024",
        url: "https://github.com/fphaikal/natslock",
        status: "archived",
        stateLabel: "ARCHIVED",
      },
    ],
  },
  {
    id: "automation",
    index: "03",
    title: "Automation & Data",
    summary:
      "Mengubah pekerjaan manual berulang menjadi alur otomatis dan metrik yang bisa dibaca. Bagian ini lahir langsung dari pekerjaan harian di lantai operasional.",
    keyTech: ["n8n", "Power BI", "REST API"],
    items: [
      {
        id: "qc-report-api",
        name: "QC Report API",
        description:
          "Layanan backend untuk pelaporan Quality Control. Menerima hasil pemeriksaan, menyimpannya secara terstruktur, dan menyiapkan datanya untuk dilaporkan.",
        tech: ["JavaScript", "REST API"],
        year: "2025",
        url: "https://github.com/fphaikal/qc-report-api",
        status: "archived",
        stateLabel: "ARCHIVED",
      },
      {
        id: "qc-report-app",
        name: "QC Report App",
        description:
          "Antarmuka pelaporan QC yang dipakai di lapangan. Menggantikan pencatatan manual dengan formulir terstruktur yang langsung tervalidasi.",
        tech: ["TypeScript", "Forms"],
        year: "2025",
        url: "https://github.com/fphaikal/qc-report-app",
        status: "archived",
        stateLabel: "ARCHIVED",
      },
    ],
  },
  {
    id: "web",
    index: "04",
    title: "Web Engineering",
    summary:
      "Sisi \"screen\": antarmuka publik yang benar-benar dipakai orang banyak — penjualan tiket, siaran langsung, dan halaman acara.",
    keyTech: ["Next.js", "Vue", "Tailwind"],
    items: [
      {
        id: "chemicfest-8",
        name: "Chemicfest #8",
        description:
          "Situs acara untuk pembelian tiket dan siaran langsung. Dipakai sungguhan selama Chemicfest #8 pada 2024.",
        tech: ["Vue", "Ticketing", "Live Streaming"],
        year: "2024",
        url: "https://github.com/fphaikal/chemicfest-8",
        status: "archived",
        stateLabel: "SHIPPED",
      },
      {
        id: "fase-7",
        name: "FASE #7",
        description:
          "Perombakan tampilan landing page FASE#7 agar lebih menarik dan lebih cepat dibaca di ponsel.",
        tech: ["Next.js", "Tailwind CSS"],
        year: "2025",
        url: "https://github.com/fphaikal/fase-7",
        status: "archived",
        stateLabel: "SHIPPED",
      },
      {
        id: "touch-14",
        name: "TOUCH 14",
        description:
          "Perombakan tampilan landing page TOUCH 14 dengan pendekatan yang sama: struktur lebih rapi, beban lebih ringan.",
        tech: ["Next.js", "Tailwind CSS"],
        year: "2025",
        url: "https://github.com/fphaikal/touch-14",
        status: "archived",
        stateLabel: "SHIPPED",
      },
    ],
  },
];
