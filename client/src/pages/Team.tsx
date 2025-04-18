import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import ProfileCard from "@/components/team/ProfileCard";
import type { TeamMember } from "@shared/schema";
import { api } from "@/lib/api";

export default function Team() {
  const { data: team = [], isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ["team"],
    queryFn: () => api.getTeamMembers(),
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (isLoading) {
    return <div className="container py-16 text-center">Loading team members...</div>;
  }

  if (error) {
    console.error("Error loading team members:", error);
    return (
      <div className="container py-16 text-center">
        <p className="text-red-500 mb-4">Failed to load team members.</p>
        <p className="text-muted-foreground">Please try again later.</p>
        <pre className="text-xs bg-gray-100 p-2 mt-4 rounded max-w-md mx-auto overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }

  console.log("Team data loaded:", team);

  return (
    <div className="container px-4 py-16 mx-auto">
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
          {team.length > 0 ? (
            team.map(member => (
              <ProfileCard
                key={member.id}
                profile={member}
                type="team"
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">No team members found.</p>
          )}
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
