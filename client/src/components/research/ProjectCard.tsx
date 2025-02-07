import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Database } from "lucide-react";
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
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {project.authors.join(", ")}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">{project.abstract}</p>
          <div className="flex gap-2">
            {project.datasetLink && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (project.datasetLink) {
                    window.open(project.datasetLink, "_blank");
                  }
                }}
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
              >
                <Github className="h-4 w-4 mr-2" />
                Code
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}