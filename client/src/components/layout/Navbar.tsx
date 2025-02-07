import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const routes = [
  { path: "/", label: "Home" },
  { path: "/research", label: "Research" },
  { path: "/team", label: "Team" },
  { path: "/students", label: "Students" },
  { path: "/publications", label: "Publications" },
  { path: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold"
            >
              ViBeS Lab
            </motion.div>
          </Link>

          <div className="hidden md:flex space-x-8">
            {routes.map(route => (
              <Link key={route.path} href={route.path}>
                <motion.a
                  whileHover={{ y: -2 }}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location === route.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </motion.a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
