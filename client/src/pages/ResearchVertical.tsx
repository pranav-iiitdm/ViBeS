import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import ProjectCard from "@/components/research/ProjectCard";
import ProjectTimeline from "@/components/research/ProjectTimeline";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Clock } from "lucide-react";
import { useState } from "react";
import type { Project } from "@shared/schema";

const categoryInfo = {
  visual_surveillance: {
    title: "Visual Surveillance",
    description: "Advanced algorithms for intelligent surveillance systems",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69"
  },
  edge_computing: {
    title: "Edge Computing",
    description: "Optimized solutions for edge devices",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  },
  generative_models: {
    title: "Generative Models",
    description: "State-of-the-art generative AI research",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  biometrics: {
    title: "Biometrics",
    description: "Advanced biometric recognition systems",
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf"
  }
};

interface Props {
  params: {
    category: keyof typeof categoryInfo;
  };
}

export default function ResearchVertical({ params: { category } }: Props) {
  const [view, setView] = useState<"grid" | "timeline">("grid");
  const info = categoryInfo[category];

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: [`/api/projects/${category}`]
  });

  if (!info) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container px-4 py-16">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <div className="relative h-[300px] mb-16 rounded-lg overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${info.image})` }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <motion.h1
              variants={fadeIn}
              className="text-4xl font-bold text-white mb-4"
            >
              {info.title}
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg text-white/80 max-w-2xl"
            >
              {info.description}
            </motion.p>
          </div>
        </div>

        {projects.length > 0 && (
          <motion.div
            variants={fadeIn}
            className="flex justify-end mb-8 gap-2"
          >
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid View
            </Button>
            <Button
              variant={view === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("timeline")}
            >
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </Button>
          </motion.div>
        )}

        {projects.length === 0 ? (
          <motion.div
            variants={fadeIn}
            className="text-center py-16 text-muted-foreground"
          >
            No projects found in this category yet.
          </motion.div>
        ) : view === "grid" ? (
          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <ProjectTimeline projects={projects} />
        )}
      </motion.div>
    </div>
  );
}