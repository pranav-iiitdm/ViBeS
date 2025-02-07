import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import ProfileCard from "@/components/team/ProfileCard";
import type { TeamMember } from "@shared/schema";

export default function Team() {
  const { data: team = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"]
  });

  return (
    <div className="container px-4 py-16">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Our Team</h1>
          <p className="text-lg text-muted-foreground">
            Meet our dedicated team of researchers and faculty members pushing the boundaries
            of computer vision and biometrics research.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {team.map(member => (
            <ProfileCard
              key={member.id}
              profile={member}
              type="team"
            />
          ))}
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="mt-24 text-center"
        >
          <div 
            className="bg-cover bg-center h-64 rounded-lg mb-8"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1519389950473-47ba0277781c)`
            }}
          />
          <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're always looking for talented researchers and students who are passionate about 
            advancing the field of computer vision and biometrics. If you're interested in 
            joining our team, please reach out.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
