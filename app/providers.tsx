"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SpotifyProvider } from "@/context/spotify-context";

import SmoothScroll from "@/components/smooth-scroll";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <SpotifyProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </SpotifyProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
