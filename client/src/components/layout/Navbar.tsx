// import { Link, useLocation } from "wouter";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";

// const routes = [
//   { path: "/", label: "Home" },
//   { path: "/research", label: "Research" },
//   { path: "/team", label: "Team" },
//   { path: "/students", label: "Students" },
//   { path: "/publications", label: "Publications" },
//   { path: "/gallery", label: "Gallery" },
//   { path: "/contact", label: "Contact" }
// ];

// export default function Navbar() {
//   const [location] = useLocation();

//   return (
//     <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50 border-b">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           <Link href="/">
//             <motion.span
//               whileHover={{ scale: 1.05 }}
//               className="text-xl font-bold cursor-pointer"
//             >
//               ViBeS Lab
//             </motion.span>
//           </Link>

//           <div className="hidden md:flex space-x-8">
//             {routes.map(route => (
//               <Link key={route.path} href={route.path}>
//                 <motion.span
//                   whileHover={{ y: -2 }}
//                   className={cn(
//                     "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
//                     location === route.path
//                       ? "text-primary"
//                       : "text-muted-foreground"
//                   )}
//                 >
//                   {route.label}
//                 </motion.span>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }


import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const routes = [
  { path: "/", label: "Home" },
  { path: "/research", label: "Research" },
  { path: "/team", label: "Team" },
  { path: "/students", label: "Students" },
  { path: "/publications", label: "Publications" },
  { path: "/gallery", label: "Gallery" },
  { path: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 w-full bg-background backdrop-blur-lg z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* ✅ Logo and Lab Name */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.svg" // ✅ Ensure this image is in the public folder
              alt="ViBeS Logo"
              className="h-36 w-44 object-contain" // Adjust size as needed
            />
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold cursor-pointer"
            >
              {/* ViBeS Lab */}
            </motion.span>
          </Link>

          {/* ✅ Navigation Links */}
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
