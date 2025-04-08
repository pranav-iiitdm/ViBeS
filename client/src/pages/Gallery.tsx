import { motion } from "framer-motion";
import { fadeIn, staggerChildren } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";

const galleryImages = [
  {
    title: "Rover",
    description: "One of Rover used to collect the images",
    image: "/rover1.jpg"
  },
  {
    title: "Rover",
    description: "One of Rover used to collect the images",
    image: "/rover2.jpg"
  },
  {
    title: "Rover",
    description: "One of Rover used to collect the imagesm",
    image: "/rover3.jpg"
  },
  // {
  //   title: "Rover",
  //   description: "Presenting our work at CVPR",
  //   image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  // },
  // {
  //   title: "Student Workshop",
  //   description: "Training session on deep learning",
  //   image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf"
  // },
  // {
  //   title: "Lab Equipment",
  //   description: "High-performance computing cluster",
  //   image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  // }
];

export default function Gallery() {
  return (
    <div className="container px-4 py-16 mx-auto">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Gallery</h1>
          <p className="text-lg text-muted-foreground">
            A visual journey through our lab's research activities, events, and achievements.
          </p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {galleryImages.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="h-64 bg-cover bg-center transform transition-transform duration-700 hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
