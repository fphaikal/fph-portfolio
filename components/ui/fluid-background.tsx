'use client';

import { useSpotify } from "@/context/spotify-context";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function FluidBackground() {
    const { colorPalette, isPlaying } = useSpotify();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render gradient overlays until mounted to prevent flash of wrong colors
    // Return simple black background while waiting for theme to be determined
    if (!mounted) {
        return <div className="fixed inset-0 -z-10 bg-black" />;
    }

    const isDark = resolvedTheme === 'dark';

    // Performance: removed console.log

    // Check if we have valid colors
    const hasColors = isPlaying && colorPalette.length === 3;

    // Default colors when not playing - different for light/dark mode
    const defaultColors = isDark ? {
        blob1: "bg-cyan-600/30",
        blob2: "bg-sky-600/30",
        blob3: "bg-blue-600/30",
    } : {
        blob1: "bg-cyan-400/25",
        blob2: "bg-sky-400/25",
        blob3: "bg-blue-400/25",
    };

    // Floating animation variants for each blob - more lively movements
    const floatingAnimation1 = {
        animate: {
            x: [0, 50, -30, 60, -20, 40, 0],
            y: [0, -120, 80, -150, 60, -100, 0],
        },
        transition: {
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut" as const,
        }
    };

    const floatingAnimation2 = {
        animate: {
            x: [0, -40, 30, -50, 25, -35, 0],
            y: [0, 100, -130, 90, -110, 70, 0],
        },
        transition: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut" as const,
        }
    };

    const floatingAnimation3 = {
        animate: {
            x: [0, 40, -50, 45, -35, 55, 0],
            y: [0, -100, 120, -140, 80, -90, 0],
        },
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" as const,
        }
    };

    // Theme-based colors
    const bgColor = isDark ? 'bg-black' : 'bg-white';
    const blob4Color = isDark ? 'bg-black' : 'bg-white';
    const gradientBottom = isDark
        ? 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.85) 85%, black 100%)'
        : 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.2) 55%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.85) 85%, white 100%)';
    const sideVignette = isDark
        ? 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.3) 100%)'
        : 'linear-gradient(to right, rgba(255,255,255,0.3) 0%, transparent 15%, transparent 85%, rgba(255,255,255,0.3) 100%)';
    const bottomVignette = isDark
        ? 'radial-gradient(ellipse 150% 60% at 50% 100%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, transparent 70%)'
        : 'radial-gradient(ellipse 150% 60% at 50% 100%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 40%, transparent 70%)';

    return (
        <div className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${bgColor}`}>
            {/* Radial gradient layout: at 0% 0%, at 50% 0%, at 100% 0% with smooth fade */}

            {/* Blob 4 - Base blob for depth and smooth transition */}
            <motion.div
                className={`absolute top-0 -left-[30%] w-[100vw] h-[100vh] ${blob4Color} filter blur-[120px] will-change-transform`}
                style={{
                    opacity: 0.7,
                }}
            ></motion.div>
            {/* Blob 1 - Top Left (0% 0%) - Floating animation */}
            <motion.div
                animate={{
                    backgroundColor: hasColors ? colorPalette[0] : undefined,
                    ...floatingAnimation1.animate,
                }}
                transition={{
                    backgroundColor: { duration: 1.5, ease: "easeInOut" },
                    ...floatingAnimation1.transition,
                }}
                className={`absolute -top-[10%] left-[25%] w-[50vw] h-[50vh] ${!hasColors ? defaultColors.blob1 : ''} filter blur-[100px] will-change-transform`}
                style={{
                    backgroundColor: hasColors ? colorPalette[0] : undefined,
                    opacity: 0.5,
                }}
            ></motion.div>

            {/* Blob 2 - Top Center (50% 0%) - Floating animation */}
            <motion.div
                animate={{
                    backgroundColor: hasColors ? colorPalette[1] : undefined,
                    ...floatingAnimation2.animate,
                }}
                transition={{
                    backgroundColor: { duration: 1.5, ease: "easeInOut", delay: 0.2 },
                    ...floatingAnimation2.transition,
                }}
                className={`absolute -top-[10%] left-[45%] -translate-x-1/2 w-[50vw] h-[50vh] ${!hasColors ? defaultColors.blob2 : ''} filter blur-[100px] will-change-transform`}
                style={{
                    backgroundColor: hasColors ? colorPalette[1] : undefined,
                    opacity: 0.45,
                }}
            ></motion.div>

            {/* Blob 3 - Top Right (100% 0%) - Floating animation */}
            <motion.div
                animate={{
                    backgroundColor: hasColors ? colorPalette[2] : undefined,
                    ...floatingAnimation3.animate,
                }}
                transition={{
                    backgroundColor: { duration: 1.5, ease: "easeInOut", delay: 0.4 },
                    ...floatingAnimation3.transition,
                }}
                className={`absolute -top-[10%] -right-[40%] w-[50vw] h-[50vh] ${!hasColors ? defaultColors.blob3 : ''} filter blur-[100px] will-change-transform`}
                style={{
                    backgroundColor: hasColors ? colorPalette[2] : undefined,
                    opacity: 0.5,
                }}
            ></motion.div>

            {/* Gradient overlay for smooth fade at the bottom */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: gradientBottom }}
            ></div>

            {/* Side vignette */}

            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: sideVignette }}
            ></div>

            {/* Bottom vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: bottomVignette }}
            ></div>
        </div>
    );
}
