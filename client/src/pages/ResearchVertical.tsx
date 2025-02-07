import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import ProjectCard from "@/components/research/ProjectCard";
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
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${info.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
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

        <motion.div
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
