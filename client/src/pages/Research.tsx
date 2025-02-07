import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

const categories = [
  {
    id: "visual_surveillance",
    label: "Visual Surveillance",
    description: "Advanced algorithms for intelligent surveillance systems",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69"
  },
  {
    id: "edge_computing",
    label: "Edge Computing",
    description: "Optimized solutions for edge devices",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  },
  {
    id: "generative_models",
    label: "Generative Models",
    description: "State-of-the-art generative AI research",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: "biometrics",
    label: "Biometrics",
    description: "Advanced biometric recognition systems",
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf"
  }
];

export default function Research() {
  return (
    <div className="container px-4 py-16">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto"
      >
        <motion.h1 
          variants={fadeIn}
          className="text-4xl font-bold mb-6"
        >
          Research Areas
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          className="text-lg text-muted-foreground mb-12"
        >
          Explore our cutting-edge research across various domains of computer vision and biometrics.
        </motion.p>

        <motion.div
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categories.map(category => (
            <Link key={category.id} href={`/research/${category.id}`}>
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-0">
                    <div
                      className="h-48 bg-cover bg-center transform transition-transform duration-700 hover:scale-110"
                      style={{ backgroundImage: `url(${category.image})` }}
                    />
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-2">{category.label}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}