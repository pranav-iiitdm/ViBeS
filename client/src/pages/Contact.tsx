import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="container px-4 py-16">
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00649682427088!3d40.71329937132881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2sNew%20York%20University!5e0!3m2!1sen!2sus!4v1695489762967!5m2!1sen!2sus"
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
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
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
                      University Campus<br />
                      City, State 12345
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
