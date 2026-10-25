/**
 * Kanal sinyal — pemetaan kemampuan ke bahasa gelombang.
 *
 * Dikelompokkan seperti tiga jenis sinyal yang jadi tema situs:
 * perangkat (sensor), perangkat lunak (pengolah), dan data (penyimpan/penyalur).
 */

export type ChannelGroup = "hardware" | "software" | "data";

export interface SignalChannel {
  id: string;
  index: string;
  label: string;
  detail: string;
  group: ChannelGroup;
}

export const CHANNEL_GROUP_LABEL: Record<ChannelGroup, string> = {
  hardware: "Device",
  software: "Processor",
  data: "Data",
};

export const SIGNAL_CHANNELS: SignalChannel[] = [
  { id: "esp32", index: "01", label: "ESP32", detail: "Microcontroller", group: "hardware" },
  { id: "arduino", index: "02", label: "Arduino", detail: "Electronics", group: "hardware" },
  { id: "raspberry-pi", index: "03", label: "Raspberry Pi", detail: "Edge computing", group: "hardware" },
  { id: "solidworks", index: "04", label: "SolidWorks", detail: "3D CAD", group: "hardware" },
  { id: "nextjs", index: "05", label: "Next.js", detail: "React framework", group: "software" },
  { id: "react", index: "06", label: "React", detail: "UI library", group: "software" },
  { id: "vue", index: "07", label: "Vue", detail: "Progressive framework", group: "software" },
  { id: "nuxt", index: "08", label: "Nuxt", detail: "Vue framework", group: "software" },
  { id: "typescript", index: "09", label: "TypeScript", detail: "Typed JavaScript", group: "software" },
  { id: "nodejs", index: "10", label: "Node.js", detail: "Server runtime", group: "software" },
  { id: "tailwind", index: "11", label: "Tailwind CSS", detail: "Utility styling", group: "software" },
  { id: "prisma", index: "12", label: "Prisma", detail: "Database ORM", group: "data" },
  { id: "mongodb", index: "13", label: "MongoDB", detail: "Document store", group: "data" },
  { id: "sqlite", index: "14", label: "SQLite", detail: "Embedded database", group: "data" },
  { id: "docker", index: "15", label: "Docker", detail: "Containers", group: "data" },
  { id: "n8n", index: "16", label: "n8n", detail: "Process automation", group: "data" },
  { id: "powerbi", index: "17", label: "Power BI", detail: "Business intelligence", group: "data" },
];
