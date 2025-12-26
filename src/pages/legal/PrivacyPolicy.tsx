import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, UserCheck, Mail, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Legal</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Privacy <span className="bg-gradient-primary bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-muted-foreground">Last Updated: December 2024</p>
        </div>

        <Card className="shadow-medical mb-8">
          <CardContent className="p-8 space-y-8">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Doctori AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, store,
                and protect your personal information when you use our platform. By using Doctori AI, you consent to the
                practices described in this policy.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Doctori AI does not provide medical diagnoses, prescriptions, or treatment. AI guidance is for
                informational purposes only, and you should consult a licensed healthcare provider for any medical
                decisions.
              </p>
            </section>

            <Separator />

            {/* 2. Personal Data We Collect */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                2. Personal Data We Collect
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We collect the following types of information:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-foreground mb-2">Account Information</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Full name</li>
                        <li>• Email address</li>
                        <li>• Phone number</li>
                        <li>• Date of birth / Age</li>
                        <li>• Gender</li>
                        <li>• Profile photo (optional)</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-foreground mb-2">Health Information</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Symptoms described in chat</li>
                        <li>• Medical history (if provided)</li>
                        <li>• Medications and allergies</li>
                        <li>• Blood group</li>
                        <li>• Height and weight</li>
                        <li>• Uploaded medical documents</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-foreground mb-2">AI Chat Data</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Conversation history with AI</li>
                        <li>• Symptom assessments</li>
                        <li>• Health recommendations received</li>
                        <li>• Chat session metadata</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-foreground mb-2">Prescriptions & Documents</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Prescriptions from doctors</li>
                        <li>• Uploaded test results</li>
                        <li>• Medical certificates</li>
                        <li>• Appointment records</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <Separator />

            {/* 3. How We Use Your Data */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                3. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>
                  <strong>Account Creation & Management:</strong> To create and maintain your account
                </li>
                <li>
                  <strong>Healthcare Services:</strong> To facilitate appointment booking and consultations
                </li>
                <li>
                  <strong>AI Health Guidance:</strong> To provide personalized health information through our AI chatbot
                </li>
                <li>
                  <strong>Communication:</strong> To send appointment reminders, health tips, and important updates
                </li>
                <li>
                  <strong>Platform Improvement:</strong> To analyze usage patterns and improve our services
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable laws and regulations
                </li>
              </ul>
            </section>

            <Separator />

            {/* 4. Data Storage & Security */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                4. Data Storage & Security
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>
                  <strong>Secure Infrastructure:</strong> Data is stored using Supabase with enterprise-grade security
                </li>
                <li>
                  <strong>Encryption:</strong> All data is encrypted in transit (TLS) and at rest
                </li>
                <li>
                  <strong>Access Control:</strong> Strict role-based access controls limit who can view your data
                </li>
                <li>
                  <strong>Regular Audits:</strong> We conduct regular security assessments and audits
                </li>
                <li>
                  <strong>HIPAA Standards:</strong> We follow HIPAA-compliant practices for health data protection
                </li>
                <li>
                  <strong>Data Breach Notification:</strong> Users will be notified promptly in the unlikely event of a
                  security breach
                </li>
              </ul>
            </section>

            <Separator />

            {/* 5. Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold mb-4">5. Data Sharing</h2>
              <Card className="bg-secondary/5 border-secondary/20 mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-2">We DO Share With:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Healthcare providers you book appointments with</li>
                    <li>• Legal authorities when required by law</li>
                    <li>• Service providers who help us operate the platform (under confidentiality agreements)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-2">We Do NOT:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Sell your personal data to third parties</li>
                    <li>• Share your health information for marketing purposes</li>
                    <li>• Allow unauthorized access to your medical records</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* 6. Third-Party Services & International Transfers */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                6. Third-Party & International Users
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services to operate the platform. These providers access your data only to
                perform tasks on our behalf and are required to protect it. Your data may be stored or processed outside
                your country of residence, with safeguards to protect your information according to international
                standards.
              </p>
            </section>

            <Separator />

            {/* 7. Cookies & Analytics */}
            <section>
              <h2 className="text-xl font-semibold mb-4">7. Cookies & Analytics</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>
                  <strong>Essential Cookies:</strong> Required for platform functionality (authentication, security)
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how users interact with our platform
                </li>
                <li>
                  <strong>Preferences:</strong> To remember your settings and language preferences
                </li>
              </ul>
              <p className="text-sm italic mt-2">You can manage cookie preferences through your browser settings.</p>
            </section>

            <Separator />

            {/* 8. Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Doctori AI is not intended for children under 13. We do not knowingly collect personal information from
                children. If you believe we have, contact us to request deletion.
              </p>
            </section>

            <Separator />

            {/* 9. User Rights */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                9. Your Rights
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account and associated data
                </li>
                <li>
                  <strong>Export:</strong> Download your data in a portable format
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Opt out of marketing communications
                </li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                To exercise any of these rights, contact us at <span className="text-primary">info@doctoriai.com</span>{" "}
                or <span className="text-primary">contact@doctoriai.com</span>.
              </p>
            </section>

            <Separator />

            {/* 10. Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-4">10. Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>Account information is retained while your account is active</li>
                <li>Health records may be retained for legal/regulatory compliance (typically 7 years)</li>
                <li>Chat history is retained for service improvement unless deletion is requested</li>
                <li>Upon account deletion, personal data is removed within 30 days (except where legally required)</li>
              </ul>
            </section>

            <Separator />

            {/* 11. Policy Updates */}
            <section>
              <h2 className="text-xl font-semibold mb-4">11. Policy Updates</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Privacy Policy may be updated periodically. The “Last Updated” date reflects the most recent
                revision. Continued use of Doctori AI after updates constitutes acceptance.
              </p>
            </section>

            <Separator />

            {/* 12. Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                12. Contact Us
              </h2>
              <ul className="space-y-2 ml-4 text-muted-foreground">
                <li>
                  <strong>Email:</strong> info@doctoriai.com
                </li>
                <li>
                  <strong>Email:</strong> contact@doctoriai.com
                </li>
              </ul>
              <p className="text-sm mt-2 text-muted-foreground">
                We aim to respond to all privacy inquiries within 5 business days.
              </p>
            </section>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Related:{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms & Conditions
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
