import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Database, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-medium">{project.title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            {project.authors.join(", ")}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base leading-relaxed">{project.abstract}</p>
          <div className="flex flex-wrap gap-3">
            {project.datasetLink && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (project.datasetLink) {
                    window.open(project.datasetLink, "_blank");
                  }
                }}
                className="hover:bg-secondary/80"
              >
                <Database className="h-4 w-4 mr-2" />
                Dataset
              </Button>
            )}
            {project.githubLink && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (project.githubLink) {
                    window.open(project.githubLink, "_blank");
                  }
                }}
                className="hover:bg-secondary/80"
              >
                <Github className="h-4 w-4 mr-2" />
                Code Repository
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}