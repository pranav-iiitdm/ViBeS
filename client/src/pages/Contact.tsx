import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="container px-4 py-16 mx-auto">
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with the ViBeS Lab team for collaboration opportunities 
            and research inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            className="relative h-[400px] rounded-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <iframe
              title="Lab Location"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.0691379219925!2d80.13465372507417!3d12.83880883746449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525851fbcd3b6b%3A0x9f1067aa71e3898e!2sIndian%20Institute%20of%20Information%20Technology%2C%20Design%20and%20Manufacturing%2C%20Kancheepuram!5e0!3m2!1sen!2sin!4v1738988934402!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

          </motion.div>

          <div className="space-y-6">
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">contact@vibeslab.org</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">+91 99999 99999</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">
                      Department of Computer Science<br />
                      IIITDM Kancheepuram<br />
                      Chennai, TamilNadu 600127
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <motion.section
          variants={fadeIn}
          className="bg-secondary/10 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Visit Our Lab</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We welcome visitors interested in our research. Please contact us in advance 
            to schedule a visit to our facilities.
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
}
