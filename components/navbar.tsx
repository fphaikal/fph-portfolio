import { Link } from "@heroui/react";
import NextLink from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import GlassCard from "@/components/ui/glass-card";

export const Navbar = () => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <GlassCard
        className="flex items-center justify-between px-6 py-3 rounded-full border-white/20 shadow-2xl backdrop-blur-3xl"
        intensity="high"
      >
        <div className="flex items-center gap-4">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              alt="Logo"
              className="invert dark:invert-0 drop-shadow-md"
              height={32}
              src={"fph-logo.svg"}
              width={32}
            />
          </NextLink>
          <div className="hidden sm:flex gap-6 ml-4">
            {siteConfig.navItems.map((item) => (
              <NextLink
                key={item.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-all hover:scale-105 hover:drop-shadow-glow"
                href={item.href}
              >
                {item.label}
              </NextLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitch />
        </div>
      </GlassCard>
    </div>
  );
};
