import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Database, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";
import { fadeIn, staggerChildren } from "@/lib/animations";

interface ProjectTimelineProps {
  projects: Project[];
}

// export default function ProjectTimeline({ projects }: ProjectTimelineProps) {
//   return (
//     <motion.div
//       variants={staggerChildren}
//       initial="initial"
//       animate="animate"
//       className="relative"
//     >
//       {/* Vertical line */}
//       <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20" />

//       {projects.map((project, index) => (
//         <motion.div
//           key={project.id}
//           variants={fadeIn}
//           className={`flex items-center mb-16 ${
//             index % 2 === 0 ? "flex-row" : "flex-row-reverse"
//           }`}
//         >
//           {/* Timeline dot */}
//           <div className="absolute left-1/2 transform -translate-x-1/2">
//             <div className="w-4 h-4 bg-primary rounded-full" />
//           </div>

//           {/* Content */}
//           <div className={`w-1/2 ${index % 2 === 0 ? "pr-12" : "pl-12"}`}>
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="relative"
//             >
//               <Card className="overflow-hidden">
//                 <CardContent className="p-6">
//                   <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
//                   <div className="flex items-center text-sm text-muted-foreground mb-4">
//                     <Calendar className="h-4 w-4 mr-2" />
//                     {/* Note: We'll need to add a date field to the Project type later */}
//                     Project Started: 2024
//                   </div>
//                   <p className="text-muted-foreground mb-4">{project.abstract}</p>
//                   <div className="flex items-center text-sm text-muted-foreground mb-4">
//                     Authors: {project.authors.join(", ")}
//                   </div>
//                   <div className="flex flex-wrap gap-3">
//                     {project.datasetLink && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => window.open(project.datasetLink!, "_blank")}
//                       >
//                         <Database className="h-4 w-4 mr-2" />
//                         Dataset
//                       </Button>
//                     )}
//                     {project.githubLink && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => window.open(project.githubLink!, "_blank")}
//                       >
//                         <Github className="h-4 w-4 mr-2" />
//                         Code Repository
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </motion.div>
//       ))}
//     </motion.div>
//   );
// }

export default function ProjectTimeline({ projects }: ProjectTimelineProps) {
  // Sort projects by date (latest first)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <motion.div
      variants={staggerChildren}
      initial="initial"
      animate="animate"
      className="relative"
    >
      {/* Vertical line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20" />

      {sortedProjects.map((project, index) => (
        <motion.div
          key={project.id}
          variants={fadeIn}
          className={`flex items-center mb-16 ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {/* Timeline dot */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-primary rounded-full" />
          </div>

          {/* Content */}
          <div className={`w-1/2 ${index % 2 === 0 ? "pr-12" : "pl-12"}`}>
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Project Started: {new Date(project.date).toLocaleDateString()}
                  </div>
                  <p className="text-muted-foreground mb-4">{project.abstract}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    Authors: {project.authors.join(", ")}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {project.datasetLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.datasetLink!, "_blank")}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Dataset
                      </Button>
                    )}
                    {project.githubLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.githubLink!, "_blank")}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Code Repository
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

