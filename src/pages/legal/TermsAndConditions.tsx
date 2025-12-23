import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { FileText, AlertTriangle } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Terms &{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Conditions
            </span>
          </h1>
          <p className="text-muted-foreground">
            Last Updated: December 2024
          </p>
        </div>

        <Card className="shadow-medical mb-8">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Doctori AI. These Terms and Conditions govern your use of our platform and services. 
                By accessing or using Doctori AI, you agree to be bound by these terms. Please read them carefully 
                before using our services.
              </p>
            </section>

            <Separator />

            {/* Platform Role */}
            <section>
              <h2 className="text-xl font-semibold mb-4">2. Platform Role & Limitations</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Doctori AI is a digital health-tech platform</strong> that connects users 
                  with independent healthcare professionals. We act solely as an intermediary and technology provider.
                </p>
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-destructive mb-2">Important Limitations:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Doctori AI does NOT provide medical diagnosis, treatment, or prescriptions</li>
                          <li>Our AI chatbot offers informational guidance only, not medical advice</li>
                          <li>All medical decisions must be made by licensed healthcare professionals</li>
                          <li>The platform is NOT a substitute for professional medical care</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* User Responsibilities */}
            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>By using Doctori AI, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, complete, and current personal and health information</li>
                  <li>Keep your account credentials secure and confidential</li>
                  <li>Use the platform only for lawful purposes</li>
                  <li>Not impersonate others or provide false information</li>
                  <li>Not misuse the AI chatbot or platform features</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Doctor Responsibilities */}
            <section>
              <h2 className="text-xl font-semibold mb-4">4. Healthcare Provider Responsibilities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  Doctors and healthcare providers on our platform are <strong className="text-foreground">independent service providers</strong>, 
                  not employees of Doctori AI. They are fully responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The quality and accuracy of their medical advice and services</li>
                  <li>Maintaining valid medical licenses and certifications</li>
                  <li>Adhering to professional medical ethics and standards</li>
                  <li>Any prescriptions, diagnoses, or treatments they provide</li>
                </ul>
                <p className="text-sm italic">
                  View our <Link to="/doctor-verification" className="text-primary hover:underline">Doctor Verification Policy</Link> for 
                  information on how we verify healthcare providers.
                </p>
              </div>
            </section>

            <Separator />

            {/* Booking & Cancellation */}
            <section>
              <h2 className="text-xl font-semibold mb-4">5. Appointment Booking, Cancellation & Refunds</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Booking</h3>
                  <p>When you book an appointment through Doctori AI, you are entering into a service agreement 
                  directly with the healthcare provider. Doctori AI facilitates this connection but is not a party 
                  to the medical consultation.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Cancellation Policy</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Appointments can be cancelled up to 24 hours before the scheduled time at no charge</li>
                    <li>Cancellations within 24 hours may incur a fee as determined by the provider</li>
                    <li>Repeated no-shows may result in account restrictions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Refund Policy</h3>
                  <p>Refunds for paid consultations are subject to the individual provider's policy and the 
                  circumstances of the cancellation. Contact support for refund requests.</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Online Consultation Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-4">6. Online Consultation Terms</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Online consultations through Doctori AI are subject to inherent limitations:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Physical examinations cannot be performed remotely</li>
                  <li>Some conditions require in-person evaluation</li>
                  <li>Technical issues may affect consultation quality</li>
                  <li>Emergency situations require immediate in-person care, not online consultation</li>
                </ul>
                <p className="font-medium text-foreground mt-4">
                  By using online consultations, you acknowledge these limitations and agree that some medical 
                  conditions cannot be adequately assessed remotely.
                </p>
              </div>
            </section>

            <Separator />

            {/* Platform Usage Rules */}
            <section>
              <h2 className="text-xl font-semibold mb-4">7. Platform Usage Rules</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>The following behaviors are prohibited on Doctori AI:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Attempting to obtain controlled substances illegally</li>
                  <li>Harassing or abusing healthcare providers or other users</li>
                  <li>Uploading malicious content or attempting to compromise security</li>
                  <li>Using the platform for any illegal activity</li>
                  <li>Sharing account access with unauthorized persons</li>
                  <li>Scraping, copying, or redistributing platform content</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  To the maximum extent permitted by law, Doctori AI and its affiliates shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Any medical outcomes resulting from consultations with providers on our platform</li>
                  <li>Actions, advice, or services provided by independent healthcare professionals</li>
                  <li>Technical failures, service interruptions, or data loss</li>
                  <li>Any indirect, incidental, or consequential damages</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-foreground">Indemnification:</strong> You agree to indemnify and hold harmless 
                  Doctori AI from any claims arising from your use of the platform or violation of these terms.
                </p>
              </div>
            </section>

            <Separator />

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold mb-4">9. Intellectual Property</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  All content, trademarks, logos, and intellectual property on Doctori AI are owned by 
                  Mahnoor LLC or its licensors. You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Copy, modify, or distribute platform content without permission</li>
                  <li>Use our branding or trademarks without authorization</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Account Termination */}
            <section>
              <h2 className="text-xl font-semibold mb-4">10. Account Suspension & Termination</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Doctori AI reserves the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Suspend or terminate accounts that violate these terms</li>
                  <li>Remove content that violates our policies</li>
                  <li>Refuse service to any user at our discretion</li>
                  <li>Modify or discontinue services with reasonable notice</li>
                </ul>
                <p className="mt-4">
                  You may delete your account at any time through your profile settings or by contacting support.
                </p>
              </div>
            </section>

            <Separator />

            {/* Governing Law */}
            <section>
              <h2 className="text-xl font-semibold mb-4">11. Governing Law & Jurisdiction</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  These Terms and Conditions are governed by applicable laws. Any disputes arising from the use 
                  of Doctori AI shall be resolved through appropriate legal channels in the jurisdiction where 
                  Mahnoor LLC is registered.
                </p>
              </div>
            </section>

            <Separator />

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-4">12. Contact Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>For questions about these Terms and Conditions, please contact us:</p>
                <ul className="space-y-2 ml-4">
                  <li><strong className="text-foreground">Email:</strong> legal@doctoriai.com</li>
                  <li><strong className="text-foreground">Support:</strong> support@doctoriai.com</li>
                  <li><strong className="text-foreground">Phone:</strong> +1-800-DOCTORI</li>
                </ul>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Related: <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> | 
            <Link to="/doctor-verification" className="text-primary hover:underline ml-1">Doctor Verification Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
