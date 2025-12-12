"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center relative overflow-hidden">

      {/* Massive Background Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0"
      >
        <h1 className="text-[20rem] md:text-[30rem] font-bold text-foreground/[0.03] dark:text-foreground/[0.02] leading-none tracking-tighter">
          404
        </h1>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 backdrop-blur-md mb-6">
            <span className="text-sm font-medium text-foreground/60 uppercase tracking-widest">Error 404</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            Lost in the <span className="text-primary">Void</span>?
          </h2>

          <p className="text-lg text-foreground/60 leading-relaxed font-light">
            The page you are looking for seems to have drifted away into the digital expanse.
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <Button
            as={Link}
            href="/"
            size="lg"
            variant="shadow"
            color="primary"
            radius="full"
            className="font-semibold px-8 py-6 text-lg"
            startContent={<RiArrowLeftLine />}
          >
            Return Home
          </Button>
        </motion.div>
      </div>

    </div>
  );
}
