// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import { fadeIn, staggerChildren } from "@/lib/animations";
// import ProfileCard from "@/components/team/ProfileCard";
// import type { Student } from "@shared/schema";

// export default function Students() {
//   const { data: students = [] } = useQuery<Student[]>({
//     queryKey: ["/api/students"]
//   });

//   return (
//     <div className="container px-4 py-16 mx-auto">
//       <motion.div
//         variants={staggerChildren}
//         initial="initial"
//         animate="animate"
//       >
//         <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
//           <h1 className="text-4xl font-bold mb-6">Our Students</h1>
//           <p className="text-lg text-muted-foreground">
//             Meet the bright minds working on cutting-edge research projects at ViBeS Lab.
//           </p>
//         </motion.div>

//         <motion.div 
//           variants={staggerChildren}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           {students.map(student => (
//             <ProfileCard
//               key={student.id}
//               profile={student}
//               type="student"
//             />
//           ))}
//         </motion.div>

//         <motion.section
//           variants={fadeIn}
//           className="mt-24 bg-secondary/10 rounded-lg p-8 text-center"
//         >
//           <div className="max-w-2xl mx-auto">
//             <h2 className="text-2xl font-semibold mb-4">Student Opportunities</h2>
//             <p className="text-muted-foreground mb-4">
//               We offer various research opportunities for undergraduate and graduate students 
//               interested in computer vision, machine learning, and biometrics.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
//               <div className="bg-background p-6 rounded-lg">
//                 <h3 className="font-semibold mb-2">Graduate Research</h3>
//                 <p className="text-sm text-muted-foreground">
//                   PhD and Masters positions available for qualified candidates interested in 
//                   pursuing advanced research.
//                 </p>
//               </div>
//               <div className="bg-background p-6 rounded-lg">
//                 <h3 className="font-semibold mb-2">Undergraduate Projects</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Opportunities for undergraduate students to participate in ongoing research 
//                   projects and gain hands-on experience.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.section>
//       </motion.div>
//     </div>
//   );
// }


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import ProfileCard from "@/components/team/ProfileCard";
import type { Student } from "@shared/schema";

export default function Students() {
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const [activeTab, setActiveTab] = useState<"PG" | "UG" | "Alumni">("PG");

  // Filter students based on the active tab
  const filteredStudents = students.filter((student) => student.category === activeTab);

  return (
    <div className="container px-4 py-16 mx-auto">
      <motion.div variants={staggerChildren} initial="initial" animate="animate">
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Our Students</h1>
          <p className="text-lg text-muted-foreground">
            Meet the bright minds working on cutting-edge research projects at ViBeS Lab.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeIn} className="flex justify-center mb-8">
          <div className="flex space-x-4 p-2 bg-secondary/10 rounded-lg">
            {["PG", "UG", "Alumni"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category as "PG" | "UG" | "Alumni")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === category
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Student Profiles */}
        <motion.div variants={staggerChildren} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <ProfileCard key={student.id} profile={student} type="student" />
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-full">No students found in this category.</p>
          )}
        </motion.div>

        <motion.section variants={fadeIn} className="mt-24 bg-secondary/10 rounded-lg p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Student Opportunities</h2>
            <p className="text-muted-foreground mb-4">
              We offer various research opportunities for undergraduate and graduate students 
              interested in computer vision, machine learning, and biometrics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
              <div className="bg-background p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Graduate Research</h3>
                <p className="text-sm text-muted-foreground">
                  PhD and Masters positions available for qualified candidates interested in 
                  pursuing advanced research.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Undergraduate Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Opportunities for undergraduate students to participate in ongoing research 
                  projects and gain hands-on experience.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
