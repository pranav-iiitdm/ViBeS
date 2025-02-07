import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const researchAreas = [
  {
    title: "Visual Surveillance",
    description: "Advanced computer vision algorithms for surveillance systems",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69"
  },
  {
    title: "Edge Computing",
    description: "Efficient computing solutions for edge devices",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  },
  {
    title: "Generative Models",
    description: "State-of-the-art generative AI research",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    title: "Biometrics",
    description: "Advanced biometric recognition systems",
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf"
  }
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-secondary/20"
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
              <Button size="lg" className="text-lg">
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
        <div className="container px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16"
            variants={fadeIn}
          >
            Research Areas
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area.title}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link href="/research">
                  <div className="relative overflow-hidden rounded-lg cursor-pointer">
                    <div 
                      className="h-48 bg-cover bg-center"
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

      {/* Lab Image Section */}
      <motion.section 
        className="py-24 bg-secondary/10"
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container px-4">
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
                <Button variant="outline" size="lg">
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
