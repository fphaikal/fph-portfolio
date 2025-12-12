'use client'

import { Tooltip } from '@heroui/react'
import GlassCard from "@/components/ui/glass-card";
import Image from "next/image";

interface Item {
  name: string
  description: string
  className: string
  icon: string
}

export default function SkillGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4">
      {items.map((item, index) => (
        <GlassCard
          key={index}
          intensity="low"
          className="aspect-square flex items-center justify-center p-4 hover:bg-white/10 transition-all duration-300 group cursor-default"
        >
          <Tooltip content={item.name} placement="top" className="text-black bg-white/90 backdrop-blur-md">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={item.icon}
                alt={item.name}
                width={40}
                height={40}
                className={`transition-transform duration-300 group-hover:scale-110 ${item.className}`}
              />
            </div>
          </Tooltip>
        </GlassCard>
      ))}
    </div>
  )
}
