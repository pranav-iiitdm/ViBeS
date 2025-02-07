import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { Publication } from "@shared/schema";

export default function Publications() {
  const { data: publications = [] } = useQuery<Publication[]>({
    queryKey: ["/api/publications"]
  });

  // Group publications by year
  const publicationsByYear = publications.reduce((acc, pub) => {
    const year = pub.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);

  // Sort years in descending order
  const years = Object.keys(publicationsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="container px-4 py-16">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Publications</h1>
          <p className="text-lg text-muted-foreground">
            Our research contributions to the academic community in computer vision, 
            biometrics, and related fields.
          </p>
        </motion.div>

        <motion.div variants={staggerChildren}>
          {years.map(year => (
            <motion.section key={year} variants={fadeIn} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{year}</h2>
              <div className="space-y-4">
                {publicationsByYear[year].map(publication => (
                  <motion.div
                    key={publication.id}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">
                              {publication.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {publication.authors.join(", ")}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {publication.venue}
                            </p>
                            {publication.abstract && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {publication.abstract}
                              </p>
                            )}
                          </div>
                          {publication.link && (
                            <a
                              href={publication.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
