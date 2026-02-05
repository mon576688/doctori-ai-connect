import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  FileCheck, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  UserCheck
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";

export default function DoctorVerificationPolicy() {
  return (
    <div className="container py-8">
      <SEO 
        title={PAGE_SEO.doctorVerification.title}
        description={PAGE_SEO.doctorVerification.description}
        canonicalPath={PAGE_SEO.doctorVerification.canonicalPath}
      />
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Provider Policy
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Doctor{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Verification Policy
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how Doctori AI verifies healthcare professionals to ensure the safety and quality of care for our users.
          </p>
        </div>

        <Card className="shadow-medical mb-8">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                1. Our Commitment to Quality Care
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Doctori AI, patient safety is our top priority. We maintain rigorous verification standards 
                to ensure that all healthcare providers on our platform are licensed, qualified, and committed 
                to delivering quality care. This policy outlines our verification process and requirements.
              </p>
            </section>

            <Separator />

            {/* Requirements */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                2. Verification Requirements
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="font-medium text-foreground">
                  All healthcare providers must submit the following documents for verification:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium text-foreground">Medical License</h3>
                          <p className="text-sm">Valid, current medical license issued by the appropriate regulatory authority</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium text-foreground">Government-Issued ID</h3>
                          <p className="text-sm">National ID, passport, or driver's license for identity verification</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium text-foreground">Medical Degree Certificate</h3>
                          <p className="text-sm">Proof of medical education from an accredited institution</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium text-foreground">Specialty Certification</h3>
                          <p className="text-sm">Board certification for specialists (if claiming a specialty)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <p className="text-sm italic mt-4">
                  Additional documents may be requested based on jurisdiction and specialty.
                </p>
              </div>
            </section>

            <Separator />

            {/* Verification Process */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                3. Verification Process
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Our verification process follows these steps:</p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-medium text-foreground">Document Submission</h3>
                      <p className="text-sm">Provider submits all required documents through our secure portal during registration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-medium text-foreground">Manual Review</h3>
                      <p className="text-sm">Our verification team reviews all documents for authenticity and validity</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-medium text-foreground">License Verification</h3>
                      <p className="text-sm">We verify the medical license with the issuing regulatory body when possible</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-medium text-foreground">Approval Decision</h3>
                      <p className="text-sm">Provider is approved, rejected, or asked for additional documentation</p>
                    </div>
                  </div>
                </div>
                
                <Card className="bg-muted/30 mt-6">
                  <CardContent className="p-4">
                    <p className="text-sm">
                      <strong className="text-foreground">Timeline:</strong> Verification typically takes 3-5 business days. 
                      Providers will be notified via email of the decision.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Doctor Responsibilities */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                4. Provider Responsibilities
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>All verified providers on Doctori AI must:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintain a valid, active medical license at all times</li>
                  <li>Notify Doctori AI immediately of any changes to license status</li>
                  <li>Update credentials when licenses are renewed or certifications change</li>
                  <li>Practice within the scope of their verified specialty and license</li>
                  <li>Follow all applicable medical ethics, laws, and regulations</li>
                  <li>Provide accurate, honest information to patients</li>
                  <li>Maintain patient confidentiality and privacy</li>
                  <li>Respond to patient inquiries and appointments in a timely manner</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Doctori AI Rights */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                5. Doctori AI Rights
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Doctori AI reserves the right to:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h3 className="font-medium text-foreground">Suspend Accounts</h3>
                          <p className="text-sm">Immediately suspend providers who violate our policies or terms</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h3 className="font-medium text-foreground">Remove Providers</h3>
                          <p className="text-sm">Permanently remove providers for serious or repeated violations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium text-foreground">Request Re-verification</h3>
                          <p className="text-sm">Request updated documents or re-verification at any time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium text-foreground">Investigate Complaints</h3>
                          <p className="text-sm">Investigate user complaints and take appropriate action</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <Separator />

            {/* Disclaimer */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                6. Important Disclaimer
              </h2>
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-6">
                  <div className="space-y-4 text-muted-foreground">
                    <p className="leading-relaxed">
                      While Doctori AI takes extensive measures to verify healthcare providers, please note:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-foreground">Doctori AI does NOT guarantee medical outcomes</strong> — 
                        The quality of care depends on individual providers
                      </li>
                      <li>
                        <strong className="text-foreground">Providers are independent</strong> — 
                        They are not employees of Doctori AI and bear full responsibility for their services
                      </li>
                      <li>
                        <strong className="text-foreground">Verification has limitations</strong> — 
                        We verify documents at the time of registration; providers must maintain their credentials
                      </li>
                      <li>
                        <strong className="text-foreground">Users should exercise judgment</strong> — 
                        Review provider profiles, ratings, and reviews before booking
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Reporting */}
            <section>
              <h2 className="text-xl font-semibold mb-4">7. Reporting Concerns</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="leading-relaxed">
                  If you have concerns about a healthcare provider on our platform, please report them immediately:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong className="text-foreground">Email:</strong> providers@doctoriai.com</li>
                  <li><strong className="text-foreground">Support:</strong> support@doctoriai.com</li>
                  <li><strong className="text-foreground">Phone:</strong> +1-800-DOCTORI</li>
                </ul>
                <p className="text-sm mt-4">
                  All reports are investigated confidentially and appropriate action is taken.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Related: <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link> | 
            <Link to="/privacy" className="text-primary hover:underline ml-1">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
