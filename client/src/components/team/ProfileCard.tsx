import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
          <Avatar className="w-24 h-24 mx-auto mb-4">
            {profile.image ? (
              <AvatarImage src={profile.image} alt={profile.name} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
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
              <p className="text-sm mb-4">{(profile as TeamMember).bio}</p>
              {(profile as TeamMember).publications && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Publications</h4>
                  <ul className="text-sm space-y-1">
                    {(profile as TeamMember).publications?.map((pub, i) => (
                      <li key={i}>
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {pub.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              {(profile as Student).projects && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Projects</h4>
                  <ul className="text-sm space-y-1">
                    {(profile as Student).projects?.map((project, i) => (
                      <li key={i}>
                        <strong>{project.title}</strong>
                        <p className="text-muted-foreground">
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
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Research Interests</h4>
              <div className="flex flex-wrap gap-2">
                {profile.researchInterests.map((interest, i) => (
                  <span
                    key={i}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
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
