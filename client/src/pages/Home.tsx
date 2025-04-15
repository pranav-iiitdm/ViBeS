import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Publication, TeamMember } from "@shared/schema";
import { api } from "@/lib/api";

// Define the API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const researchAreas = [
  {
    title: "Visual Surveillance",
    description: "Advanced computer vision algorithms for surveillance systems",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69",
    category: "visual_surveillance"
  },
  {
    title: "Edge Computing",
    description: "Efficient computing solutions for edge devices",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    category: "edge_computing"
  },
  {
    title: "Generative Models",
    description: "State-of-the-art generative AI research",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    category: "generative_models"
  },
  {
    title: "Biometrics",
    description: "Advanced biometric recognition systems",
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf",
    category: "biometrics"
  }
];

export default function Home() {
  const { data: publications = [], isLoading: pubsLoading, error: pubsError } = useQuery<Publication[]>({
    queryKey: ["publications-home"],
    queryFn: () => api.getPublications(),
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const { data: team = [], isLoading: teamLoading, error: teamError } = useQuery<TeamMember[]>({
    queryKey: ["team-home"],
    queryFn: () => api.getTeamMembers(),
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Initialize the chatbot when the home page loads
  useEffect(() => {
    // Call the initialization endpoint to warm up the chatbot
    const initChatbot = async () => {
      try {
        console.log("Initializing chatbot on page load...");
        const response = await fetch(`${API_BASE_URL}/chatbot/init`);
        const data = await response.json();
        console.log("Chatbot initialization:", data);
      } catch (error) {
        console.error("Failed to initialize chatbot:", error);
      }
    };

    initChatbot();
  }, []);

  console.log("Home data:", { 
    publications: publications.length, 
    team: team.length,
    pubsError: pubsError ? String(pubsError) : null,
    teamError: teamError ? String(teamError) : null
  });

  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        // className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-secondary/20"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEDAD2] to-secondary/20"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="container px-4 py-32 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Visual Biometrics & <br/>
            Surveillance Lab
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Advancing the frontiers of computer vision through cutting-edge research in biometrics, 
            surveillance, and deep learning.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/research">
              {/* <Button size="lg" className="text-lg">
                Explore Our Research
              </Button> */}
              <Button 
                size="lg" 
                className="text-lg bg-[#F59C7D] hover:bg-[#F59C7D]/90"
              >
                Explore Our Research
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Research Areas */}
      <motion.section 
        className="py-24 bg-background"
        variants={staggerChildren}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16"
            variants={fadeIn}
          >
            Research Areas
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchAreas.map((area, index) => (
              <motion.div
                // key={area.title}
                // variants={fadeIn}
                // whileHover={{ y: -10 }}
                // className="group"
                key={area.title}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="group bg-[#EEDAD2]/10 hover:bg-[#EEDAD2]/20 transition-colors duration-300 rounded-lg"
              >
                <Link href={`/research/${area.category}`}>
                  <div className="relative overflow-hidden rounded-lg cursor-pointer">
                    <div 
                      className="h-48 bg-cover bg-center transform transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${area.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 transition-all duration-300 group-hover:bg-black/40">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {area.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Publications */}
      <motion.section 
        className="py-24 bg-secondary/10"
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16"
            variants={fadeIn}
          >
            Recent Publications
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {publications.slice(0, 2).map(publication => (
              <motion.div
                key={publication.id}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-[#F59C7D]/20 p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{publication.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {publication.authors.join(", ")}
                </p>
                <p className="text-sm font-medium text-primary mb-4">
                  {publication.venue} ({publication.year})
                </p>
                {publication.abstract && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {publication.abstract}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div 
            variants={fadeIn}
            className="text-center mt-12"
          >
            <Link href="/publications">
              <Button variant="outline" size="lg" 
              className="bg-[#F59C7D] hover:bg-[#F59C7D]/90">
                View All Publications
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Preview */}
      <motion.section 
        className="py-24 bg-background"
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16"
            variants={fadeIn}
          >
            Our Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.slice(0, 3).map(member => (
              <motion.div
                // key={member.id}
                // variants={fadeIn}
                // whileHover={{ y: -5 }}
                // className="text-center"
                key={member.id}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="text-center bg-[#F59C7D]/20 p-6 rounded-lg shadow-lg duration-300"
              >
                <div className="w-32 h-32 mx-auto mb-4 relative overflow-hidden rounded-full">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
          <motion.div 
            variants={fadeIn}
            className="text-center mt-12"
          >
            <Link href="/team">
              <Button variant="outline" size="lg" className="bg-[#F59C7D] hover:bg-[#F59C7D]/90">Meet Our Team</Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Lab Image Section */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-[#EEDAD2] to-secondary/10"
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div 
              className="rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1563974604538-67f52beb353a)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '500px'
              }}
            />
            <div>
              <motion.h2 
                className="text-3xl font-bold mb-6"
                variants={fadeIn}
              >
                State-of-the-Art Research Facility
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground mb-8"
                variants={fadeIn}
              >
                Our lab is equipped with cutting-edge technology and computing resources to support 
                groundbreaking research in computer vision, deep learning, and biometric systems.
              </motion.p>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="bg-[#F59C7D] hover:bg-[#F59C7D]/90">
                  Visit Our Lab
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}