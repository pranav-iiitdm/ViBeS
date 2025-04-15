// // import { useQuery } from "@tanstack/react-query";
// // import { motion } from "framer-motion";
// // import { fadeIn, staggerChildren } from "@/lib/animations";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { ExternalLink } from "lucide-react";
// // import type { Publication } from "@shared/schema";

// // export default function Publications() {
// //   const { data: publications = [] } = useQuery<Publication[]>({
// //     queryKey: ["/api/publications"]
// //   });

// //   // Group publications by year
// //   const publicationsByYear = publications.reduce((acc, pub) => {
// //     const year = pub.year;
// //     if (!acc[year]) {
// //       acc[year] = [];
// //     }
// //     acc[year].push(pub);
// //     return acc;
// //   }, {} as Record<number, Publication[]>);

// //   // Sort years in descending order
// //   const years = Object.keys(publicationsByYear)
// //     .map(Number)
// //     .sort((a, b) => b - a);

// //   return (
// //     <div className="container px-4 py-16 mx-auto">
// //       <motion.div
// //         variants={staggerChildren}
// //         initial="initial"
// //         animate="animate"
// //       >
// //         <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
// //           <h1 className="text-4xl font-bold mb-6">Publications</h1>
// //           <p className="text-lg text-muted-foreground">
// //             Our research contributions to the academic community in computer vision, 
// //             biometrics, and related fields.
// //           </p>
// //         </motion.div>

// //         <motion.div variants={staggerChildren}>
// //           {years.map(year => (
// //             <motion.section key={year} variants={fadeIn} className="mb-12">
// //               <h2 className="text-2xl font-bold mb-6">{year}</h2>
// //               <div className="space-y-4">
// //                 {publicationsByYear[year].map(publication => (
// //                   <motion.div
// //                     key={publication.id}
// //                     whileHover={{ x: 4 }}
// //                     transition={{ duration: 0.2 }}
// //                   >
// //                     <Card>
// //                       <CardContent className="py-4">
// //                         <div className="flex justify-between items-start gap-4">
// //                           <div>
// //                             <h3 className="font-semibold mb-2">
// //                               {publication.title}
// //                             </h3>
// //                             <p className="text-sm text-muted-foreground mb-2">
// //                               {publication.authors.join(", ")}
// //                             </p>
// //                             <p className="text-sm font-medium text-primary">
// //                               {publication.venue}
// //                             </p>
// //                             {publication.abstract && (
// //                               <p className="text-sm text-muted-foreground mt-2">
// //                                 {publication.abstract}
// //                               </p>
// //                             )}
// //                           </div>
// //                           {publication.link && (
// //                             <a
// //                               href={publication.link}
// //                               target="_blank"
// //                               rel="noopener noreferrer"
// //                               className="text-primary hover:text-primary/80"
// //                             >
// //                               <ExternalLink className="h-5 w-5" />
// //                             </a>
// //                           )}
// //                         </div>
// //                       </CardContent>
// //                     </Card>
// //                   </motion.div>
// //                 ))}
// //               </div>
// //             </motion.section>
// //           ))}
// //         </motion.div>
// //       </motion.div>
// //     </div>
// //   );
// // }


// // import { useState } from "react";
// // import { useQuery } from "@tanstack/react-query";
// // import { motion } from "framer-motion";
// // import { fadeIn, staggerChildren } from "@/lib/animations";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { ExternalLink } from "lucide-react";
// // import type { Publication } from "@shared/schema";

// // export default function Publications() {
// //   const { data: publications = [] } = useQuery<Publication[]>({
// //     queryKey: ["/api/publications"],
// //   });

// //   const [activeTab, setActiveTab] = useState<"journal" | "conference">("journal");

// //   // Filter publications based on the active tab
// //   const filteredPublications = publications.filter(
// //     (pub) => pub.type === activeTab
// //   );

// //   // Group filtered publications by year
// //   const publicationsByYear = filteredPublications.reduce((acc, pub) => {
// //     const year = pub.year;
// //     if (!acc[year]) {
// //       acc[year] = [];
// //     }
// //     acc[year].push(pub);
// //     return acc;
// //   }, {} as Record<number, Publication[]>);

// //   // Sort years in descending order
// //   const years = Object.keys(publicationsByYear)
// //     .map(Number)
// //     .sort((a, b) => b - a);

// //   return (
// //     <div className="container px-4 py-16 mx-auto">
// //       <motion.div
// //         variants={staggerChildren}
// //         initial="initial"
// //         animate="animate"
// //       >
// //         <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
// //           <h1 className="text-4xl font-bold mb-6">Publications</h1>
// //           <p className="text-lg text-muted-foreground">
// //             Our research contributions to the academic community in computer vision,
// //             biometrics, and related fields.
// //           </p>
// //         </motion.div>

// //         {/* Tabs */}
// //         <motion.div variants={fadeIn} className="flex justify-center mb-8">
// //           <div className="flex space-x-4 p-2 bg-muted rounded-lg">
// //             <button
// //               onClick={() => setActiveTab("journal")}
// //               className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
// //                 activeTab === "journal"
// //                   ? "bg-background text-foreground shadow"
// //                   : "text-muted-foreground hover:bg-background/50"
// //               }`}
// //             >
// //               Journals
// //             </button>
// //             <button
// //               onClick={() => setActiveTab("conference")}
// //               className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
// //                 activeTab === "conference"
// //                   ? "bg-background text-foreground shadow"
// //                   : "text-muted-foreground hover:bg-background/50"
// //               }`}
// //             >
// //               Conferences
// //             </button>
// //           </div>
// //         </motion.div>

// //         {/* Publications List */}
// //         <motion.div variants={staggerChildren}>
// //           {years.map((year) => (
// //             <motion.section key={year} variants={fadeIn} className="mb-12">
// //               <h2 className="text-2xl font-bold mb-6">{year}</h2>
// //               <div className="space-y-4">
// //                 {publicationsByYear[year].map((publication) => (
// //                   <motion.div
// //                     key={publication.id}
// //                     whileHover={{ x: 4 }}
// //                     transition={{ duration: 0.2 }}
// //                   >
// //                     <Card>
// //                       <CardContent className="py-4">
// //                         <div className="flex justify-between items-start gap-4">
// //                           <div>
// //                             <h3 className="font-semibold mb-2">
// //                               {publication.title}
// //                             </h3>
// //                             <p className="text-sm text-muted-foreground mb-2">
// //                               {publication.authors.join(", ")}
// //                             </p>
// //                             <p className="text-sm font-medium text-primary">
// //                               {publication.venue}
// //                             </p>
// //                             {publication.abstract && (
// //                               <p className="text-sm text-muted-foreground mt-2">
// //                                 {publication.abstract}
// //                               </p>
// //                             )}
// //                           </div>
// //                           {publication.link && (
// //                             <a
// //                               href={publication.link}
// //                               target="_blank"
// //                               rel="noopener noreferrer"
// //                               className="text-primary hover:text-primary/80"
// //                             >
// //                               <ExternalLink className="h-5 w-5" />
// //                             </a>
// //                           )}
// //                         </div>
// //                       </CardContent>
// //                     </Card>
// //                   </motion.div>
// //                 ))}
// //               </div>
// //             </motion.section>
// //           ))}
// //         </motion.div>
// //       </motion.div>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import { fadeIn, staggerChildren } from "@/lib/animations";
// import { Card, CardContent } from "@/components/ui/card";
// import { ExternalLink } from "lucide-react";
// import type { Publication } from "@shared/schema";

// export default function Publications() {
//   const { data: publications = [] } = useQuery<Publication[]>({
//     queryKey: ["/api/publications"],
//   });

//   const [activeTab, setActiveTab] = useState<"journal" | "conference">("journal");
//   const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});

//   // Filter publications based on the active tab
//   const filteredPublications = publications.filter(
//     (pub) => pub.type === activeTab
//   );

//   // Group filtered publications by year
//   const publicationsByYear = filteredPublications.reduce((acc, pub) => {
//     const year = pub.year;
//     if (!acc[year]) {
//       acc[year] = [];
//     }
//     acc[year].push(pub);
//     return acc;
//   }, {} as Record<number, Publication[]>);

//   // Sort years in descending order
//   const years = Object.keys(publicationsByYear)
//     .map(Number)
//     .sort((a, b) => b - a);

//   // Toggle abstract expansion
//   const toggleAbstract = (id: string) => {
//     setExpandedAbstracts((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <div className="container px-4 py-16 mx-auto">
//       <motion.div
//         variants={staggerChildren}
//         initial="initial"
//         animate="animate"
//       >
//         <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
//           <h1 className="text-4xl font-bold mb-6">Publications</h1>
//           <p className="text-lg text-muted-foreground">
//             Our research contributions to the academic community in computer vision,
//             biometrics, and related fields.
//           </p>
//         </motion.div>

//         {/* Tabs */}
//         <motion.div variants={fadeIn} className="flex justify-center mb-8">
//           <div className="flex space-x-4 p-2 bg-muted rounded-lg">
//             <button
//               onClick={() => setActiveTab("journal")}
//               className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === "journal"
//                   ? "bg-background text-foreground shadow"
//                   : "text-muted-foreground hover:bg-background/50"
//               }`}
//             >
//               Journals
//             </button>
//             <button
//               onClick={() => setActiveTab("conference")}
//               className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === "conference"
//                   ? "bg-background text-foreground shadow"
//                   : "text-muted-foreground hover:bg-background/50"
//               }`}
//             >
//               Conferences
//             </button>
//           </div>
//         </motion.div>

//         {/* Publications List */}
//         <motion.div variants={staggerChildren}>
//           {years.map((year) => (
//             <motion.section key={year} variants={fadeIn} className="mb-12">
//               <h2 className="text-2xl font-bold mb-6">{year}</h2>
//               <div className="space-y-4">
//                 {publicationsByYear[year].map((publication) => (
//                   <motion.div
//                     key={publication.id}
//                     whileHover={{ x: 4 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <Card>
//                       <CardContent className="py-4">
//                         <div className="flex justify-between items-start gap-4">
//                           <div>
//                             <h3 className="font-semibold mb-2">
//                               {publication.title}
//                             </h3>
//                             <p className="text-sm text-muted-foreground mb-2">
//                               {publication.authors.join(", ")}
//                             </p>
//                             <p className="text-sm font-medium text-primary">
//                               {publication.venue}
//                             </p>
//                             {publication.abstract && (
//                               <div className="mt-2">
//                                 <p className="text-sm text-muted-foreground">
//                                   {expandedAbstracts[publication.id]
//                                     ? publication.abstract
//                                     : `${publication.abstract.slice(0, 150)}...`}
//                                 </p>
//                                 {publication.abstract.length > 150 && (
//                                   <button
//                                     onClick={() => toggleAbstract(publication.id.toString())}
//                                     className="text-sm text-primary hover:text-primary/80 mt-1"
//                                   >
//                                     {expandedAbstracts[publication.id]
//                                       ? "Read Less"
//                                       : "Read More"}
//                                   </button>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                           {publication.link && (
//                             <a
//                               href={publication.link}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-primary hover:text-primary/80"
//                             >
//                               <ExternalLink className="h-5 w-5" />
//                             </a>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.section>
//           ))}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { Publication } from "@shared/schema";
import { api } from "@/lib/api";

export default function Publications() {
  const { data: publications = [], isLoading, error } = useQuery<Publication[]>({
    queryKey: ["publications"],
    queryFn: () => api.getPublications(),
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const [activeTab, setActiveTab] = useState<"journal" | "conference">("journal");
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return <div className="container py-16 text-center">Loading publications...</div>;
  }

  if (error) {
    console.error("Error loading publications:", error);
    return (
      <div className="container py-16 text-center">
        <p className="text-red-500 mb-4">Failed to load publications.</p>
        <p className="text-muted-foreground">Please try again later.</p>
        <pre className="text-xs bg-gray-100 p-2 mt-4 rounded max-w-md mx-auto overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }

  console.log("Publications data loaded:", publications);

  // Filter publications based on the active tab
  const filteredPublications = publications.filter(
    (pub) => pub.type === activeTab
  );

  // Group filtered publications by year
  const publicationsByYear = filteredPublications.reduce((acc, pub) => {
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

  // Toggle abstract expansion
  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container px-4 py-16 mx-auto">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        {/* Header Section */}
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Publications</h1>
          <p className="text-lg text-muted-foreground">
            Our research contributions to the academic community in computer vision,
            biometrics, and related fields.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeIn} className="flex justify-center mb-8">
          <div className="flex space-x-4 p-2 bg-[#EEDAD2]/20 rounded-lg">
            <button
              onClick={() => setActiveTab("journal")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "journal"
                  ? "bg-[#F59C7D] text-white shadow"
                  : "text-foreground hover:bg-[#F59C7D]/10"
              }`}
            >
              Journals
            </button>
            <button
              onClick={() => setActiveTab("conference")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "conference"
                  ? "bg-[#F59C7D] text-white shadow"
                  : "text-foreground hover:bg-[#F59C7D]/10"
              }`}
            >
              Conferences
            </button>
          </div>
        </motion.div>

        {/* Publications List */}
        <motion.div variants={staggerChildren}>
          {years.map((year) => (
            <motion.section key={year} variants={fadeIn} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{year}</h2>
              <div className="space-y-4">
                {publicationsByYear[year].map((publication) => (
                  <motion.div
                    key={publication.id}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-[#EEDAD2]/10 hover:bg-[#F59C7D]/20 transition-colors border-[#EEDAD2]/20">
                      <CardContent className="py-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">
                              {publication.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {publication.authors.join(", ")}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground">
                              {publication.venue}
                            </p>
                            {publication.abstract && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  {expandedAbstracts[publication.id]
                                    ? publication.abstract
                                    : `${publication.abstract.slice(0, 150)}...`}
                                </p>
                                {publication.abstract.length > 150 && (
                                  <button
                                    onClick={() => toggleAbstract(publication.id.toString())}
                                    className="text-sm text-[#F59C7D] hover:text-[#F59C7D]/80 mt-1"
                                  >
                                    {expandedAbstracts[publication.id]
                                      ? "Read Less"
                                      : "Read More"}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          {publication.link && (
                            <a
                              href={publication.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#F59C7D] hover:text-[#F59C7D]/80"
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