// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { SiGooglescholar, SiResearchgate } from "react-icons/si";
// import type { TeamMember, Student } from "@shared/schema";

// interface ProfileCardProps {
//   profile: TeamMember | Student;
//   type: "team" | "student";
// }

// export default function ProfileCard({ profile, type }: ProfileCardProps) {
//   const initials = profile.name
//     .split(" ")
//     .map(n => n[0])
//     .join("");

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       whileHover={{ y: -5 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="h-full text-center bg-[#F59C7D]/30 hover:bg-[#EEDAD2]/30 p-6 rounded-lg transition-colors duration-300">
//         <CardHeader className="text-center">
//           <Avatar className="w-32 h-32 mx-auto mb-4">
//             {profile.image ? (
//               <AvatarImage 
//                 src={profile.image} 
//                 alt={profile.name}
//                 className="object-cover"
//               />
//             ) : (
//               <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
//             )}
//           </Avatar>
//           <h3 className="text-xl font-semibold">{profile.name}</h3>
//           <p className="text-sm text-muted-foreground">
//             {type === "team" ? (profile as TeamMember).role : (profile as Student).degree}
//           </p>
//         </CardHeader>
//         <CardContent>
//           {type === "team" ? (
//             <>
//               <p className="text-sm mb-6">{(profile as TeamMember).bio}</p>
//               {/* Academic Profile Links */}
//               <div className="flex justify-center gap-3 mb-6">
//                 {type === "team" && (profile as TeamMember).googleScholarUrl && (
//                   <a
//                     href={(profile as TeamMember).googleScholarUrl || ""}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="gap-2 bg-[#F59C7D] hover:bg-[#EEDAD2]/10"
//                     >
//                       <SiGooglescholar className="w-4 h-4" />
//                       Google Scholar
//                     </Button>
//                   </a>
//                 )}
//                 {type === "team" && (profile as TeamMember).researchGateUrl && (
//                   <a
//                     href={(profile as TeamMember).researchGateUrl || ""}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="gap-2 bg-[#F59C7D]"
//                     >
//                       <SiResearchgate className="w-4 h-4" />
//                       ResearchGate
//                     </Button>
//                   </a>
//                 )}
//               </div>
//             </>
//           ) : (
//             <>
//               {(profile as Student).projects && (
//                 <div className="mt-4">
//                   <h4 className="font-semibold mb-2">Projects</h4>
//                   <ul className="text-sm space-y-3">
//                     {(profile as Student).projects?.map((project, i) => (
//                       <li key={i} className="bg-secondary/20 rounded-lg p-3">
//                         <strong>{project.title}</strong>
//                         <p className="text-muted-foreground mt-1">
//                           {project.description}
//                         </p>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}

//           {profile.researchInterests && (
//             <div className="mt-6">
//               <h4 className="font-semibold mb-2">Research Interests</h4>
//               <div className="flex flex-wrap gap-2">
//                 {profile.researchInterests.map((interest, i) => (
//                   <span
//                     key={i}
//                     className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full bg-opacity-50"
//                   >
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }


// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { SiGooglescholar, SiResearchgate } from "react-icons/si";
// import type { TeamMember, Student } from "@shared/schema";

// interface ProfileCardProps {
//   profile: TeamMember | Student;
//   type: "team" | "student";
// }

// export default function ProfileCard({ profile, type }: ProfileCardProps) {
//   const initials = profile.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("");

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       whileHover={{ y: -5 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="h-full text-center bg-[#EEDAD2]/30 hover:shadow-md p-6 rounded-lg transition-all duration-300 border border-[#EEDAD2]/50">
//         <CardHeader className="text-center">
//           <Avatar className="w-24 h-24 mx-auto mb-4">
//             {profile.image ? (
//               <AvatarImage
//                 src={profile.image}
//                 alt={profile.name}
//                 className="object-cover"
//               />
//             ) : (
//               <AvatarFallback className="text-2xl bg-white text-[#F59C7D]">
//                 {initials}
//               </AvatarFallback>
//             )}
//           </Avatar>
//           <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
//           <p className="text-sm text-gray-600 mt-1">
//             {type === "team" ? (profile as TeamMember).role : (profile as Student).degree}
//           </p>
//         </CardHeader>
//         <CardContent>
//           {type === "team" ? (
//             <>
//               <p className="text-sm text-gray-700 mb-6">{(profile as TeamMember).bio}</p>
//               {/* Academic Profile Links */}
//               <div className="flex justify-center gap-3 mb-6">
//                 {type === "team" && (profile as TeamMember).googleScholarUrl && (
//                   <a
//                     href={(profile as TeamMember).googleScholarUrl || ""}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Button
//                       variant="default"
//                       size="sm"
//                       className="gap-2 bg-[#F59C7D] text-white hover:bg-[#F59C7D]/90"
//                     >
//                       <SiGooglescholar className="w-4 h-4" />
//                       Google Scholar
//                     </Button>
//                   </a>
//                 )}
//                 {type === "team" && (profile as TeamMember).researchGateUrl && (
//                   <a
//                     href={(profile as TeamMember).researchGateUrl || ""}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Button
//                       variant="default"
//                       size="sm"
//                       className="gap-2 bg-[#F59C7D] text-white hover:bg-[#F59C7D]/90"
//                     >
//                       <SiResearchgate className="w-4 h-4" />
//                       ResearchGate
//                     </Button>
//                   </a>
//                 )}
//               </div>
//             </>
//           ) : (
//             <>
//               {(profile as Student).projects && (
//                 <div className="mt-4">
//                   <h4 className="font-semibold text-gray-800 mb-4">Projects</h4>
//                   <ul className="space-y-3">
//                     {(profile as Student).projects?.map((project, i) => (
//                       <li key={i} className="bg-white/50 rounded-lg p-3">
//                         <strong className="text-gray-800">{project.title}</strong>
//                         <p className="text-gray-600 mt-1 text-sm">
//                           {project.description}
//                         </p>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}

//           {profile.researchInterests && (
//             <div className="mt-6">
//               <h4 className="font-semibold text-gray-800 mb-4">Research Interests</h4>
//               <div className="flex flex-wrap gap-2">
//                 {profile.researchInterests.map((interest, i) => (
//                   <span
//                     key={i}
//                     className="text-xs bg-white/50 text-[#F59C7D] px-3 py-1 rounded-full"
//                   >
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }




// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { SiGooglescholar, SiResearchgate, SiLinkedin } from "react-icons/si";
// import { useState } from "react";
// import type { TeamMember, Student } from "@shared/schema";

// interface ProfileCardProps {
//   profile: TeamMember | Student;
//   type: "team" | "student";
// }

// export default function ProfileCard({ profile, type }: ProfileCardProps) {
//   const initials = profile.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("");

//   // State to manage expanded/collapsed state
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Function to toggle expanded state
//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       whileHover={{ y: -5 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="h-full text-center bg-[#EEDAD2] hover:shadow-md p-6 rounded-lg transition-all duration-300 border border-[#EEDAD2]/50">
//         <CardHeader className="text-center">
//           <Avatar className="w-24 h-24 mx-auto mb-4">
//             {profile.image ? (
//               <AvatarImage
//                 src={profile.image}
//                 alt={profile.name}
//                 className="object-cover"
//               />
//             ) : (
//               <AvatarFallback className="text-2xl bg-white text-[#F59C7D]">
//                 {initials}
//               </AvatarFallback>
//             )}
//           </Avatar>
//           <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
//           <p className="text-sm text-gray-600 mt-1">
//             {type === "team" ? (profile as TeamMember).role : (profile as Student).degree}
//           </p>
//         </CardHeader>
//         <CardContent>
//           {type === "team" ? (
//             <>
//               <p className="text-sm text-gray-700 mb-6">{(profile as TeamMember).bio}</p>
//               {/* Social Links */}
//               <div className="flex justify-center gap-3 mb-6">
//                 {(profile as TeamMember).googleScholarUrl && (
//                   <a
//                     href={(profile as TeamMember).googleScholarUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Button
//                       variant="default"
//                       size="sm"
//                       className="gap-2 bg-[#F59C7D] text-white hover:bg-[#F59C7D]/90"
//                     >
//                       <SiGooglescholar className="w-4 h-4" />
//                       Google Scholar
//                     </Button>
//                   </a>
//                 )}
//                 {(profile as TeamMember).researchGateUrl && (
//                   <a
//                     href={(profile as TeamMember).researchGateUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Button
//                       variant="default"
//                       size="sm"
//                       className="gap-2 bg-[#F59C7D] text-white hover:bg-[#F59C7D]/90"
//                     >
//                       <SiResearchgate className="w-4 h-4" />
//                       ResearchGate
//                     </Button>
//                   </a>
//                 )}
//                 {(profile as TeamMember).linkedinUrl && (
//                   <a
//                     href={(profile as TeamMember).linkedinUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Button
//                       variant="default"
//                       size="sm"
//                       className="gap-2 bg-[#F59C7D] text-white hover:bg-[#F59C7D]/90"
//                     >
//                       <SiLinkedin className="w-4 h-4" />
//                       LinkedIn
//                     </Button>
//                   </a>
//                 )}
//               </div>
//             </>
//           ) : (
//             <>
//               {(profile as Student).projects && (
//                 <div className="mt-4">
//                   <h4 className="font-semibold text-gray-800 mb-4">Projects</h4>
//                   <ul className="space-y-3">
//                     {(profile as Student).projects?.map((project, i) => (
//                       <li key={i} className="bg-white/50 rounded-lg p-3">
//                         <strong className="text-gray-800">{project.title}</strong>
//                         <p className="text-gray-600 mt-1 text-sm">
//                           {project.description}
//                         </p>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}

//           {/* Research Interests */}
//           {profile.researchInterests && (
//             <div className="mt-6">
//               <h4 className="font-semibold text-gray-800 mb-4">Research Interests</h4>
//               <div className="flex flex-wrap gap-2">
//                 {profile.researchInterests.map((interest, i) => (
//                   <span
//                     key={i}
//                     className="text-xs bg-white/50 text-[#F59C7D] px-3 py-1 rounded-full"
//                   >
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* "Know More" Section */}
//           <div className="mt-6">
//             <Button
//               variant="outline"
//               size="sm"
//               className="gap-2 border-[#F59C7D] text-[#F59C7D] hover:bg-[#F59C7D]/10"
//               onClick={toggleExpand}
//             >
//               {isExpanded ? "Show Less" : "Know More"}
//             </Button>
//             {isExpanded && (
//               <div className="mt-4 text-sm text-gray-700">
//                 <p>{(profile as TeamMember).additionalInfo}</p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }





import { useState } from "react";
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SiGooglescholar, SiResearchgate, SiLinkedin } from "react-icons/si";
import type { TeamMember, Student } from "@shared/schema";
import Modal from "./Modal";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ProfileCardProps {
  profile: TeamMember | Student;
  type: "team" | "student";
}

export default function ProfileCard({ profile, type }: ProfileCardProps) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full text-center bg-[#EEDAD2] hover:shadow-md p-6 rounded-lg transition-all duration-300 border border-[#EEDAD2]/50">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              {profile.image ? (
                <AvatarImage
                  src={profile.image}
                  alt={profile.name}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-2xl bg-white text-[#F59C7D]">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {type === "team" ? (profile as TeamMember).role : ""}
            </p>
          </CardHeader>

          <CardContent>
            <>
              <p className="text-sm text-gray-700 mb-6">{profile.bio}</p>

              {/* Social Links */}
              {(profile.googleScholarUrl || profile.researchGateUrl || profile.linkedinUrl) && (
                <div className="flex justify-center gap-3 mb-6">
                  {profile.googleScholarUrl && (
                    <a href={profile.googleScholarUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2 bg-[#F59C7D] text-white hover:bg-[#F59C7D]/90"
                      >
                        <SiGooglescholar className="w-4 h-4" />
                        Google Scholar
                      </Button>
                    </a>
                  )}
                  {profile.researchGateUrl && (
                    <a href={profile.researchGateUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2 bg-[#F59C7D] text-white hover:bg-[#F59C7D]/90"
                      >
                        <SiResearchgate className="w-4 h-4" />
                        ResearchGate
                      </Button>
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2 bg-[#F59C7D] text-white hover:bg-[#F59C7D]/90"
                      >
                        <SiLinkedin className="w-4 h-4" />
                        LinkedIn
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {/* Projects for Students */}
              {"projects" in profile && profile.projects.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Projects</h4>
                  <ul className="space-y-3">
                    {profile.projects.map((project, i) => (
                      <li key={i} className="bg-white/50 rounded-lg p-3">
                        <strong className="text-gray-800">{project.title}</strong>
                        <p className="text-gray-600 mt-1 text-sm">{project.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Research Interests */}
              {profile.researchInterests && profile.researchInterests.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Research Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.researchInterests.map((interest, i) => (
                      <span key={i} className="text-xs bg-white/50 text-[#F59C7D] px-3 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* "Know More" Button */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-[#F59C7D] text-[#F59C7D] hover:bg-[#F59C7D]/10"
                  onClick={openModal}
                >
                  Know More
                </Button>
              </div>
            </>
          </CardContent>

        </Card>
      </motion.div>

      {/* Modal for "Know More" */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-lg overflow-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4">About {profile.name}</h3>
          <div className="prose text-sm text-gray-700 whitespace-normal break-words overflow-y-auto max-h-[70vh]">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {(profile as TeamMember).additionalInfo}
            </ReactMarkdown>
          </div>
        </div>
      </Modal>
    </>
  );
}