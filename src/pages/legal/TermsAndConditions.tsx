import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { FileText, AlertTriangle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";

export default function TermsAndConditions() {
  return (
    <div className="container py-8">
      <SEO 
        title={PAGE_SEO.terms.title}
        description={PAGE_SEO.terms.description}
        canonicalPath={PAGE_SEO.terms.canonicalPath}
      />
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Legal</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Terms & <span className="bg-gradient-primary bg-clip-text text-transparent">Conditions</span>
          </h1>
          <p className="text-muted-foreground">Last Updated: December 2024</p>
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
                Welcome to Doctori AI, a digital health platform designed to connect users with licensed healthcare
                professionals and provide AI-powered health guidance. These Terms and Conditions ("Terms") govern your
                access to and use of Doctori AI’s services, including the AI chatbot, doctor discovery, appointment
                booking, and related features. By using our platform, you agree to comply with these Terms in full. If
                you do not agree, please do not use our services.
              </p>
            </section>

            <Separator />

            {/* Platform Role */}
            <section>
              <h2 className="text-xl font-semibold mb-4">2. Platform Role & Limitations</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Doctori AI serves solely as a technology provider</strong>
                  and intermediary between users and independent healthcare professionals. We facilitate communication,
                  information sharing, and appointment scheduling but do not provide direct medical services.
                </p>
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-destructive mb-2">Important Limitations:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Doctori AI does NOT provide medical diagnosis, treatment, or prescriptions.</li>
                          <li>
                            Our AI chatbot offers general health information and guidance, but it does not replace
                            professional medical advice.
                          </li>
                          <li>
                            All medical decisions, including diagnoses, treatment, and prescriptions, must be made by
                            licensed healthcare professionals.
                          </li>
                          <li>
                            The platform is not a substitute for in-person medical care, emergency services, or clinical
                            judgment.
                          </li>
                          <li>
                            Use of the platform is at your own discretion, and Doctori AI is not liable for any outcomes
                            resulting from your reliance on the information provided.
                          </li>
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
                <p>As a user of Doctori AI, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, complete, and up-to-date personal and health information.</li>
                  <li>
                    Keep your account credentials confidential and immediately notify us of any unauthorized access.
                  </li>
                  <li>Use the platform only for lawful purposes, and not for any fraudulent or harmful activities.</li>
                  <li>Refrain from impersonating others or providing false information.</li>
                  <li>
                    Respect healthcare providers and other users; harassment or abusive behavior is strictly prohibited.
                  </li>
                  <li>
                    Comply with all applicable laws and regulations governing health data, privacy, and online
                    communications.
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Healthcare Provider Responsibilities */}
            <section>
              <h2 className="text-xl font-semibold mb-4">4. Healthcare Provider Responsibilities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  Doctors and healthcare providers on our platform are independent service providers, not employees or
                  agents of Doctori AI. They are solely responsible for the services they provide, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Ensuring the quality and accuracy of medical advice, diagnoses, and treatment recommendations.
                  </li>
                  <li>
                    Maintaining valid and active medical licenses, certifications, and compliance with local
                    regulations.
                  </li>
                  <li>Adhering to professional medical ethics, clinical guidelines, and applicable laws.</li>
                  <li>Any prescriptions, tests, or treatments issued during consultations.</li>
                  <li>Communicating clearly with patients and ensuring confidentiality of medical information.</li>
                </ul>
                <p className="text-sm italic">
                  View our{" "}
                  <Link to="/doctor-verification" className="text-primary hover:underline">
                    Doctor Verification Policy
                  </Link>
                  for details on how we validate healthcare professionals.
                </p>
              </div>
            </section>

            <Separator />

            {/* Appointment Booking */}
            <section>
              <h2 className="text-xl font-semibold mb-4">5. Appointment Booking, Cancellation & Refunds</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Booking</h3>
                  <p>
                    When you book an appointment through Doctori AI, you enter into a service agreement directly with
                    the healthcare provider. Doctori AI only facilitates the connection and is not a party to the
                    medical consultation or responsible for the quality of care.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Cancellation Policy</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Appointments can be cancelled up to 24 hours before the scheduled time at no charge.</li>
                    <li>Cancellations within 24 hours may incur a fee, as determined by the provider.</li>
                    <li>Repeated no-shows may result in temporary or permanent account restrictions.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Refund Policy</h3>
                  <p>
                    Refunds for paid consultations depend on the provider’s policy and the circumstances of
                    cancellation. Contact support for assistance with refund requests.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Online Consultation Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-4">6. Online Consultation Terms</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Online consultations have inherent limitations due to the virtual nature of the platform:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Physical examinations cannot be conducted remotely.</li>
                  <li>Some conditions require in-person evaluation for accurate diagnosis.</li>
                  <li>Technical issues may affect the quality or accuracy of the consultation.</li>
                  <li>
                    Emergency situations require immediate in-person care; the platform is not an emergency service.
                  </li>
                  <li>
                    All advice provided online should be considered informational and not a replacement for professional
                    care.
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Platform Usage Rules */}
            <section>
              <h2 className="text-xl font-semibold mb-4">7. Platform Usage Rules</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Users are prohibited from the following:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Attempting to obtain controlled substances illegally or without proper prescription.</li>
                  <li>Harassing or threatening healthcare providers or other users.</li>
                  <li>Uploading malicious software, viruses, or attempts to compromise security.</li>
                  <li>Using the platform for illegal, fraudulent, or unethical purposes.</li>
                  <li>Sharing account access with unauthorized persons or third parties.</li>
                  <li>Scraping, copying, or redistributing platform content without permission.</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>To the fullest extent permitted by law, Doctori AI and its affiliates shall not be liable for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Any medical outcomes, including adverse results, from consultations with providers.</li>
                  <li>Actions, advice, or omissions of independent healthcare professionals.</li>
                  <li>Technical failures, service interruptions, or loss of data.</li>
                  <li>Indirect, incidental, special, or consequential damages arising from use of the platform.</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-foreground">Indemnification:</strong> Users agree to indemnify and hold
                  harmless Doctori AI from any claims, damages, or legal actions resulting from their use of the
                  platform or violation of these Terms.
                </p>
              </div>
            </section>

            <Separator />

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold mb-4">9. Intellectual Property</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  All content, trademarks, logos, and intellectual property on Doctori AI are owned by Mahnoor LLC or
                  its licensors. Users may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Copy, reproduce, or distribute platform content without explicit permission.</li>
                  <li>Use branding or logos without authorization.</li>
                  <li>Reverse engineer, decompile, or attempt to extract source code.</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Account Suspension */}
            <section>
              <h2 className="text-xl font-semibold mb-4">10. Account Suspension & Termination</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Doctori AI reserves the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Suspend or terminate accounts that violate Terms or policies.</li>
                  <li>Remove content deemed inappropriate, harmful, or illegal.</li>
                  <li>Refuse service to any user at its discretion.</li>
                  <li>Modify, update, or discontinue platform services with reasonable notice.</li>
                </ul>
                <p className="mt-4">
                  Users may delete their accounts anytime via profile settings or by contacting support.
                </p>
              </div>
            </section>

            <Separator />

            {/* Governing Law */}
            <section>
              <h2 className="text-xl font-semibold mb-4">11. Governing Law & Jurisdiction</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  These Terms are governed by applicable laws in the jurisdiction where Mahnoor LLC is registered. Any
                  disputes arising from use of Doctori AI shall be resolved through appropriate legal channels in that
                  jurisdiction.
                </p>
              </div>
            </section>

            <Separator />

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-4">12. Contact Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>For questions regarding these Terms, contact Doctori AI at:</p>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong className="text-foreground">Email:</strong> info@doctoriai.com
                  </li>
                  <li>
                    <strong className="text-foreground">Email:</strong> contact@doctoriai.com
                  </li>
                  <li>
                    <strong className="text-foreground">Support:</strong> support@doctoriai.com
                  </li>
                  <li>
                    <strong className="text-foreground">Phone:</strong> +1-800-DOCTORI
                  </li>
                </ul>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Related:{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            |
            <Link to="/doctor-verification" className="text-primary hover:underline ml-1">
              Doctor Verification Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
