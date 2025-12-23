import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Privacy{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Policy
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
                <Shield className="h-5 w-5 text-primary" />
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Doctori AI, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, store, and protect your personal information when you use our platform. By using Doctori AI, 
                you consent to the practices described in this policy.
              </p>
            </section>

            <Separator />

            {/* Data We Collect */}
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

            {/* Purpose of Collection */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                3. How We Use Your Data
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>We use your personal information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Account Creation & Management:</strong> To create and maintain your account</li>
                  <li><strong className="text-foreground">Healthcare Services:</strong> To facilitate appointment booking and consultations</li>
                  <li><strong className="text-foreground">AI Health Guidance:</strong> To provide personalized health information through our AI chatbot</li>
                  <li><strong className="text-foreground">Communication:</strong> To send appointment reminders, health tips, and important updates</li>
                  <li><strong className="text-foreground">Platform Improvement:</strong> To analyze usage patterns and improve our services</li>
                  <li><strong className="text-foreground">Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Data Storage & Security */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                4. Data Storage & Security
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Your data is stored securely using industry-leading security practices:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Secure Infrastructure:</strong> Data is stored using Supabase with enterprise-grade security</li>
                  <li><strong className="text-foreground">Encryption:</strong> All data is encrypted in transit (TLS) and at rest</li>
                  <li><strong className="text-foreground">Access Control:</strong> Strict role-based access controls limit who can view your data</li>
                  <li><strong className="text-foreground">Regular Audits:</strong> We conduct regular security assessments and audits</li>
                  <li><strong className="text-foreground">HIPAA Standards:</strong> We follow HIPAA-compliant practices for health data protection</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold mb-4">5. Data Sharing</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  We are committed to protecting your privacy. Your data is shared only in the following circumstances:
                </p>
                
                <Card className="bg-secondary/5 border-secondary/20">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground mb-2">We DO Share With:</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Healthcare providers you book appointments with (for consultation purposes)</li>
                      <li>• Legal authorities when required by law</li>
                      <li>• Service providers who help us operate the platform (under strict confidentiality agreements)</li>
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
              </div>
            </section>

            <Separator />

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold mb-4">6. Cookies & Analytics</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  We use cookies and similar technologies to improve your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Essential Cookies:</strong> Required for platform functionality (authentication, security)</li>
                  <li><strong className="text-foreground">Analytics:</strong> To understand how users interact with our platform</li>
                  <li><strong className="text-foreground">Preferences:</strong> To remember your settings and language preferences</li>
                </ul>
                <p className="text-sm italic mt-4">
                  You can manage cookie preferences through your browser settings.
                </p>
              </div>
            </section>

            <Separator />

            {/* User Rights */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                7. Your Rights
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>You have the following rights regarding your personal data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                  <li><strong className="text-foreground">Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong className="text-foreground">Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong className="text-foreground">Export:</strong> Download your data in a portable format</li>
                  <li><strong className="text-foreground">Withdraw Consent:</strong> Opt out of marketing communications</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, contact us at <span className="text-primary">privacy@doctoriai.com</span>
                </p>
              </div>
            </section>

            <Separator />

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-4">8. Data Retention</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  We retain your personal data for as long as your account is active or as needed to provide services. 
                  Specifically:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information is retained while your account is active</li>
                  <li>Health records may be retained for legal/regulatory compliance (typically 7 years)</li>
                  <li>Chat history is retained for service improvement unless you request deletion</li>
                  <li>Upon account deletion, personal data is removed within 30 days (except where legally required)</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                9. Contact Us
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>For privacy-related questions or concerns, please contact our Data Protection team:</p>
                <ul className="space-y-2 ml-4">
                  <li><strong className="text-foreground">Privacy Email:</strong> privacy@doctoriai.com</li>
                  <li><strong className="text-foreground">General Support:</strong> support@doctoriai.com</li>
                  <li><strong className="text-foreground">Phone:</strong> +1-800-DOCTORI</li>
                </ul>
                <p className="text-sm mt-4">
                  We aim to respond to all privacy inquiries within 5 business days.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Related: <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link> | 
            <Link to="/doctor-verification" className="text-primary hover:underline ml-1">Doctor Verification Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
