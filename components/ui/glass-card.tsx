import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, intensity = "medium", ...props }, ref) => {
        // iOS-style glassmorphism with true transparency
        const intensityStyles = {
            low: {
                blur: "backdrop-blur-xl",
                bg: "bg-white/10 dark:bg-white/5",
                border: "border-white/20 dark:border-white/10",
                shadow: "shadow-lg",
            },
            medium: {
                blur: "backdrop-blur-2xl backdrop-saturate-150",
                bg: "bg-white/15 dark:bg-white/10",
                border: "border-white/30 dark:border-white/15",
                shadow: "shadow-xl",
            },
            high: {
                blur: "backdrop-blur-3xl backdrop-saturate-200",
                bg: "bg-white/20 dark:bg-white/15",
                border: "border-white/40 dark:border-white/20",
                shadow: "shadow-2xl",
            },
        };

        const style = intensityStyles[intensity];

        return (
            <div
                ref={ref}
                className={cn(
                    // Base styles
                    "relative overflow-hidden rounded-3xl transition-all duration-500",
                    // Blur and background
                    style.blur,
                    style.bg,
                    // Border - subtle white glow effect
                    "border",
                    style.border,
                    // Shadow for depth
                    style.shadow,
                    // Hover effect
                    "hover:scale-[1.01]",
                    className
                )}
                style={{
                    // CSS for better glass effect
                    WebkitBackdropFilter: "blur(40px) saturate(180%)",
                }}
                {...props}
            >
                {/* Top-left highlight for 3D glass effect */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 100%)",
                    }}
                />

                {/* Subtle inner glow on edges */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-3xl"
                    style={{
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.05)",
                    }}
                />

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
