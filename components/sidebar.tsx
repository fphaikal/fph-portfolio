'use client'

import Image from "next/image";
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import { link as linkStyles } from "@heroui/theme";
import { Divider, Tooltip } from "@heroui/react";
import { usePathname } from "next/navigation";
import { RiInstagramFill } from "react-icons/ri";
import { ThemeSwitch } from "@/components/theme-switch";

import GlassCard from "@/components/ui/glass-card";

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 h-screen z-50 flex-none hidden md:block">
      <GlassCard
        intensity="high"
        className="h-[calc(100vh-32px)] w-[80px] m-4 p-4 rounded-3xl border-black/20 dark:border-white/20"
      >
        {/* Main container with flex column and full height */}
        <div className="flex flex-col h-full">
          {/* Top Section - Logo & Navigation */}
          <div className="flex flex-col gap-4 items-center">
            <Tooltip content="FPH" placement="right">
              <div className="p-2 bg-black/10 dark:bg-white/10 rounded-xl backdrop-blur-md shadow-sm">
                <Image
                  alt="FPH Logo"
                  className="invert dark:invert-0"
                  height={24}
                  src={"fph-logo.svg"}
                  width={24}
                />
              </div>
            </Tooltip>
            <Divider className="bg-black/20 dark:bg-white/20" />
            <div className="flex flex-col items-center gap-3">
              {siteConfig.navItems.map((item) => (
                <Tooltip key={item.href} content={item.label} placement="right">
                  {pathname === item.href ? (
                    <NextLink
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "p-3 bg-primary/20 text-primary rounded-2xl shadow-glow transition-all duration-300",
                      )}
                      color="foreground"
                      href={item.href}
                    >
                      <item.icon size={22} />
                    </NextLink>
                  ) : (
                    <NextLink
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "p-3 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110",
                      )}
                      color="foreground"
                      href={item.href}
                    >
                      <item.activeIcon size={22} />
                    </NextLink>
                  )}
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Spacer - pushes bottom section to the bottom */}
          <div className="flex-1" />

          {/* Bottom Section - Social Links & Theme Switch */}
          <div className="flex flex-col items-center gap-4">
            <Divider className="bg-black/20 dark:bg-white/20 w-full" />
            <div className="flex flex-col gap-2 items-center">
              {siteConfig.socials.map((item) => (
                <Tooltip key={item.href} content={item.label || "Link"} placement="right">
                  <NextLink
                    className={"p-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 duration-300 rounded-xl transition-all hover:scale-110"}
                    color="foreground"
                    href={item.href}
                  >
                    <item.icon size={20} />
                  </NextLink>
                </Tooltip>
              ))}
            </div>
            <ThemeSwitch />
          </div>
        </div>
      </GlassCard>
    </aside>
  );
}