import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import ProjectCard from "@/components/research/ProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@shared/schema";

const categories = [
  {
    id: "visual_surveillance",
    label: "Visual Surveillance",
    description: "Advanced algorithms for intelligent surveillance systems"
  },
  {
    id: "edge_computing",
    label: "Edge Computing",
    description: "Optimized solutions for edge devices"
  },
  {
    id: "generative_models",
    label: "Generative Models",
    description: "State-of-the-art generative AI research"
  },
  {
    id: "biometrics",
    label: "Biometrics",
    description: "Advanced biometric recognition systems"
  }
];

export default function Research() {
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  return (
    <div className="container px-4 py-16">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto"
      >
        <motion.h1 
          variants={fadeIn}
          className="text-4xl font-bold mb-6"
        >
          Research Areas
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          className="text-lg text-muted-foreground mb-12"
        >
          Explore our cutting-edge research across various domains of computer vision and biometrics.
        </motion.p>

        <Tabs defaultValue="visual_surveillance" className="mb-16">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <motion.div
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{category.label}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects
                    .filter(project => project.category === category.id)
                    .map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}
