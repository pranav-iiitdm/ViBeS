import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function Footer() {
  return (
    <motion.footer
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="bg-background border-t mt-auto"
    >
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">ViBeS Lab</h3>
            <p className="text-sm text-muted-foreground">
              Visual Biometrics and Surveillance Lab
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: contact@vibeslab.org<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Address</h3>
            <p className="text-sm text-muted-foreground">
              Department of Computer Science<br />
              University Campus<br />
              City, State 12345
            </p>
          </div>
        </div> */}
        © {new Date().getFullYear()} ViBeS Lab. All rights reserved.
        {/* <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground text-sm text-[#F59C7D]"> */}
          {/* © {new Date().getFullYear()} ViBeS Lab. All rights reserved. */}
        {/* </div> */}
      </div>
    </motion.footer>
  );
}
