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
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold cursor-pointer"
            >
              ViBeS Lab
            </motion.span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {routes.map(route => (
              <Link key={route.path} href={route.path}>
                <motion.span
                  whileHover={{ y: -2 }}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                    location === route.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </motion.span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}