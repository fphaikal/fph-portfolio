import type { Metadata } from "next";

import { Hero } from "@/components/deck/hero";
import { About } from "@/components/deck/sections/about";
import { Certificates } from "@/components/deck/sections/certificates";
import { Contact } from "@/components/deck/sections/contact";
import { Education } from "@/components/deck/sections/education";
import { Journey } from "@/components/deck/sections/journey";
import { Projects } from "@/components/deck/sections/projects";
import { Stack } from "@/components/deck/sections/stack";
import { Statement } from "@/components/deck/sections/statement";
import { LiveDashboard } from "@/components/deck/live-dashboard";
import { CERTIFICATES } from "@/config/certificates";
import { SIGNAL_CHANNELS } from "@/config/channels";
import { EDUCATION } from "@/config/education";
import { EXPERIENCE } from "@/config/experience";
import { PROJECT_GROUPS } from "@/config/projects";
import { siteConfig } from "@/config/site";

import StructuredData from "./structured-data";

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

/**
 * Halaman utama — kartu dibuka satu per satu.
 *
 * Urutannya sengaja memberi irama: bagian terang, bagian gelap, lalu
 * ditutup oleh kartu terakhir. Hampir setiap section digerakkan gulir.
 */
export default function Home() {
  return (
    <>
      <StructuredData />

      <Hero />
      <About />
      <Projects groups={PROJECT_GROUPS} />
      <Stack channels={SIGNAL_CHANNELS} />
      <Statement />
      <Journey entries={EXPERIENCE} />
      <Education entries={EDUCATION} />
      <Certificates items={CERTIFICATES} />
      <LiveDashboard />
      <Contact />
    </>
  );
}
