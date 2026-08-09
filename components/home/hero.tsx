'use client'

import { motion } from "framer-motion";
import { Link } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { GithubIcon } from "@/components/icons";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 md:py-20 relative overflow-visible z-10">
      {/* Background Glow */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-violet-500/20 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none" /> */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 md:gap-8"
      >
        <h1 className="flex flex-col items-center font-bold tracking-tighter drop-shadow-2xl">
          <span className="text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-black/40 dark:to-white/40">
            FPHaikal
          </span>
          <span className="mt-3 text-xl md:text-3xl tracking-tight text-black/75 dark:text-white/75">
            Fahreza Pasha Haikal
          </span>
        </h1>

        <div className="space-y-4 max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-medium text-black/90 dark:text-white/90 tracking-wide">
            IT Support Specialist
          </h2>
          <p className="text-lg md:text-xl text-black/60 dark:text-white/60 font-light leading-relaxed">
            Also known as FPH, a Mechatronics Engineering student crafting immersive digital experiences with code, creativity, and precision.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link
            isExternal
            className={`${buttonStyles({ variant: "bordered", radius: "full" })} border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 px-8 py-6 text-lg backdrop-blur-md`}
            href="https://github.com/fphaikal"
          >
            <GithubIcon size={24} />
            GitHub
          </Link>
          <Link
            isExternal
            className={`${buttonStyles({ variant: "solid", radius: "full" })} bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-lg shadow-black/10 dark:shadow-white/10`}
            href="#projects"
          >
            View Projects
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
