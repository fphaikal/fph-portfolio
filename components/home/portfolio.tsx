'use client';

import { useEffect, useState } from 'react';
import {
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Divider,
  Image
} from "@heroui/react";
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import { RiExternalLinkLine, RiGlobalLine, RiGithubLine } from 'react-icons/ri';

export interface Project {
  name: string;
  thumb: string;
  description: string;
  client: string;
  tech: string[];
  url: string;
}

// Tech icon mapping
const techIcons: Record<string, string> = {
  nextjs: '/nextjs.svg',
  nuxt: '/nuxt.svg',
  nodejs: '/nodejs.svg',
  express: '/express.svg',
  mongodb: '/mongodb.svg',
  vuejs: '/vuejs.svg',
  typescript: '/ts.svg',
  javascript: '/js.svg',
  tailwindcss: '/tailwindcss.svg',
};

export default function Portfolio({ initialProjects }: { initialProjects: Project[] | null }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState<boolean>(initialProjects === null);
  const [error, setError] = useState<boolean>(false);

  // Modal state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (initialProjects !== null) return;

    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) throw new Error('Project API URL is not configured');

        const baseUrl = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;
        const response = await fetch(`${baseUrl}/api/projects`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setProjects(data.data || data || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [initialProjects]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    onOpen();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-64 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard intensity="medium" className="p-8">
        <div className="flex items-center justify-center gap-3">
          <p className="text-red-500">Failed to load projects</p>
        </div>
      </GlassCard>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <GlassCard intensity="medium" className="p-8">
        <div className="flex items-center justify-center gap-3">
          <p className="text-foreground/60">No projects available</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => handleProjectClick(project)}
          >
            <GlassCard
              intensity="medium"
              className="p-6 h-full transition-all duration-300 group-hover:bg-white/15 dark:group-hover:bg-white/10"
            >
              <div className="flex flex-col h-full gap-4">
                {/* Header with Thumbnail Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                      <span className="text-sm font-bold text-primary/80 text-center leading-tight">
                        {project.thumb}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {project.name}
                      </h3>
                      <p className="text-sm text-foreground/60">
                        {project.client}
                      </p>
                    </div>
                  </div>

                  {/* External Link Icon (Visual hint) */}
                  <div className="p-2 rounded-xl bg-foreground/5 transition-colors duration-300 opacity-0 group-hover:opacity-100">
                    <RiExternalLinkLine size={18} className="text-foreground/60" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3 flex-1">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-foreground/5 border border-foreground/10"
                    >
                      {techIcons[tech.toLowerCase()] && (
                        <img
                          src={techIcons[tech.toLowerCase()]}
                          alt={tech}
                          className="w-4 h-4"
                        />
                      )}
                      <span className="text-xs text-foreground/60 capitalize">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Project Details Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="2xl"
        classNames={{
          base: "bg-black/80 backdrop-blur-xl border border-white/10 text-white",
          header: "border-b border-white/10",
          footer: "border-t border-white/10",
          closeButton: "hover:bg-white/10 active:bg-white/20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">{selectedProject?.name}</span>
                  {selectedProject?.client && (
                    <span className="text-sm font-normal text-white/50 px-2 py-0.5 rounded-full bg-white/10">
                      {selectedProject.client}
                    </span>
                  )}
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="flex flex-col gap-6">
                  {/* Project Thumbnail / Banner */}
                  <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    <span className="text-6xl font-bold text-white/10 select-none group-hover:scale-110 transition-transform duration-500">
                      {selectedProject?.thumb}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Description</h4>
                      <p className="text-white/80 leading-relaxed text-sm md:text-base">
                        {selectedProject?.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white/50 mb-3 uppercase tracking-wider">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject?.tech.map((tech) => (
                          <div
                            key={tech}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            {techIcons[tech.toLowerCase()] && (
                              <img
                                src={techIcons[tech.toLowerCase()]}
                                alt={tech}
                                className="w-4 h-4"
                              />
                            )}
                            <span className="text-sm text-white/80 capitalize">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedProject?.url && (
                  <Button
                    className="bg-white text-black hover:bg-white/90"
                    endContent={<RiExternalLinkLine />}
                    onPress={() => window.open(selectedProject.url, '_blank')}
                  >
                    Visit Project
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
