import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SiGooglescholar, SiResearchgate } from "react-icons/si";
import type { TeamMember, Student } from "@shared/schema";

interface ProfileCardProps {
  profile: TeamMember | Student;
  type: "team" | "student";
}

export default function ProfileCard({ profile, type }: ProfileCardProps) {
  const initials = profile.name
    .split(" ")
    .map(n => n[0])
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader className="text-center">
          <Avatar className="w-32 h-32 mx-auto mb-4">
            {profile.image ? (
              <AvatarImage 
                src={profile.image} 
                alt={profile.name}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            )}
          </Avatar>
          <h3 className="text-xl font-semibold">{profile.name}</h3>
          <p className="text-sm text-muted-foreground">
            {type === "team" ? (profile as TeamMember).role : (profile as Student).degree}
          </p>
        </CardHeader>
        <CardContent>
          {type === "team" ? (
            <>
              <p className="text-sm mb-6">{(profile as TeamMember).bio}</p>
              {/* Academic Profile Links */}
              <div className="flex justify-center gap-3 mb-6">
                {type === "team" && (profile as TeamMember).googleScholarUrl && (
                  <a
                    href={(profile as TeamMember).googleScholarUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <SiGooglescholar className="w-4 h-4" />
                      Google Scholar
                    </Button>
                  </a>
                )}
                {type === "team" && (profile as TeamMember).researchGateUrl && (
                  <a
                    href={(profile as TeamMember).researchGateUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <SiResearchgate className="w-4 h-4" />
                      ResearchGate
                    </Button>
                  </a>
                )}
              </div>
            </>
          ) : (
            <>
              {(profile as Student).projects && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Projects</h4>
                  <ul className="text-sm space-y-3">
                    {(profile as Student).projects?.map((project, i) => (
                      <li key={i} className="bg-secondary/20 rounded-lg p-3">
                        <strong>{project.title}</strong>
                        <p className="text-muted-foreground mt-1">
                          {project.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {profile.researchInterests && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Research Interests</h4>
              <div className="flex flex-wrap gap-2">
                {profile.researchInterests.map((interest, i) => (
                  <span
                    key={i}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}