'use client';

import GlassCard from "@/components/ui/glass-card";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { BsCalendar3 } from "react-icons/bs";
import { motion } from "framer-motion";

interface Experience {
  title: string;
  company: string;
  companyLogo?: string;
  companyColor?: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  location: string;
  locationType: string;
  description: string;
  highlights: string[];
}

export default function Experience({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-success via-success/50 to-transparent" />

      <div className="flex flex-col gap-12">
        {experiences.map((exp, index) => (
          <div key={index} className="relative flex gap-6 md:gap-8">
            {/* Timeline node with logo */}
            <div className="relative flex-shrink-0">
              {/* Glowing ring */}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 20px ${exp.companyColor || '#22c55e'}40`,
                    `0 0 40px ${exp.companyColor || '#22c55e'}60`,
                    `0 0 20px ${exp.companyColor || '#22c55e'}40`,
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/20 dark:bg-white/10 border-2"
                style={{ borderColor: exp.companyColor || '#22c55e' }}
              >
                {/* Inner glass circle with logo */}
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full backdrop-blur-md bg-white/40 dark:bg-white/20 flex items-center justify-center p-2 md:p-3 border border-white/30 dark:border-white/10">
                  {exp.companyLogo ? (
                    <img
                      src={exp.companyLogo}
                      alt={`${exp.company} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <HiOutlineBuildingOffice2 className="w-6 h-6 md:w-10 md:h-10 text-foreground/50" />
                  )}
                </div>
              </motion.div>

              {/* Connection dot */}
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-3 h-3 rounded-full border-2 border-background"
                style={{ backgroundColor: exp.companyColor || '#22c55e' }}
              />
            </div>

            {/* Content card */}
            <div className="flex-1 pt-2">
              <GlassCard
                id={`experience-${index}`}
                intensity="medium"
                className="w-full overflow-hidden"
              >
                {/* Colored top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: exp.companyColor || '#22c55e' }}
                />

                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                          {exp.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-foreground/80">
                          <span className="text-lg font-semibold">{exp.company}</span>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: exp.companyColor || '#22c55e' }}
                          >
                            {exp.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-foreground/60 text-sm">
                        <div className="flex items-center gap-2">
                          <BsCalendar3 size={14} />
                          <span>{exp.startDate} - {exp.endDate}</span>
                          <span className="text-foreground/40">·</span>
                          <span className="font-medium">{exp.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IoLocationOutline size={16} />
                          <span>{exp.location}</span>
                          <span className="text-foreground/40">·</span>
                          <span className="font-medium">{exp.locationType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-foreground/70 text-base leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    {exp.highlights.length > 0 && (
                      <div className="flex flex-col gap-3 mt-2">
                        {exp.highlights.map((highlight, hIndex) => (
                          <div key={hIndex} className="flex items-start gap-3 group">
                            <div
                              className="w-2 h-2 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"
                              style={{ backgroundColor: exp.companyColor || '#22c55e' }}
                            />
                            <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                              {highlight}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
