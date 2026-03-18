import { useParams, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { getConditionBySlug, conditions } from '@/data/conditions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, Stethoscope, ArrowRight, ShieldCheck, Pill, Search } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ConditionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const condition = getConditionBySlug(slug || '');

  if (!condition) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Condition Not Found</h1>
        <p className="text-muted-foreground mb-6">The condition page you're looking for doesn't exist.</p>
        <Link to="/conditions"><Button>Browse All Conditions</Button></Link>
      </div>
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": condition.faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };

  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "name": condition.name,
    "description": condition.metaDescription,
    "url": `https://doctoriai.com/conditions/${condition.slug}`,
    "signOrSymptom": condition.symptoms.map(s => ({ "@type": "MedicalSymptom", "name": s })),
    "riskFactor": condition.riskFactors.map(r => ({ "@type": "MedicalRiskFactor", "name": r }))
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO
        title={condition.metaTitle}
        description={condition.metaDescription}
        canonicalPath={`/conditions/${condition.slug}`}
        keywords={`${condition.name}, ${condition.name} symptoms, ${condition.name} treatment, ${condition.name} causes, ${condition.name} prevention`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(medicalSchema)}</script>
      </Helmet>

      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/conditions" className="hover:text-primary">Conditions</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{condition.name}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{condition.name}</h1>
      <p className="text-muted-foreground mb-8">Category: {condition.category}</p>

      {/* Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-3">Overview</h2>
        {condition.overview.split('\n\n').map((p, i) => (
          <p key={i} className="text-muted-foreground mb-4 leading-relaxed">{p}</p>
        ))}
      </section>

      {/* Symptoms */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="h-5 w-5" /> Symptoms
        </h2>
        <ul className="grid md:grid-cols-2 gap-2">
          {condition.symptoms.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary mt-0.5">•</span><span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Causes & Risk Factors */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Causes</h2>
        <ul className="space-y-2 mb-6">
          {condition.causes.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary mt-0.5">•</span><span>{c}</span>
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-semibold text-foreground mb-3">Risk Factors</h3>
        <div className="flex flex-wrap gap-2">
          {condition.riskFactors.map((r, i) => (
            <span key={i} className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground">{r}</span>
          ))}
        </div>
      </section>

      {/* Diagnosis */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-3">Diagnosis</h2>
        <p className="text-muted-foreground leading-relaxed">{condition.diagnosis}</p>
      </section>

      {/* Treatment */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center gap-2">
          <Pill className="h-5 w-5" /> Treatment
        </h2>
        <p className="text-muted-foreground leading-relaxed">{condition.treatment}</p>
      </section>

      {/* Prevention */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> Prevention
        </h2>
        <ul className="space-y-2">
          {condition.prevention.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary mt-1">✓</span><span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* When to See a Doctor */}
      <section className="mb-8">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-destructive mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" /> When to See a Doctor
            </h2>
            <ul className="space-y-2">
              {condition.whenToSeeDoctor.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-destructive mt-1">•</span><span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Related */}
      {condition.relatedConditions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Related Conditions</h2>
          <div className="flex flex-wrap gap-2">
            {condition.relatedConditions.map((c) => (
              <Link key={c} to={`/conditions/${c}`}>
                <Button variant="outline" size="sm" className="capitalize">{c.replace(/-/g, ' ')}</Button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {condition.relatedSymptoms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Related Symptoms</h2>
          <div className="flex flex-wrap gap-2">
            {condition.relatedSymptoms.map((s) => (
              <Link key={s} to={`/symptoms/${s}`}>
                <Button variant="outline" size="sm" className="capitalize">{s.replace(/-/g, ' ')}</Button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {condition.faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {condition.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <Stethoscope className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Check Your Symptoms with AI</h2>
          <p className="text-muted-foreground mb-4">Describe your symptoms and get instant AI-powered health guidance, 24/7.</p>
          <Link to="/chat">
            <Button size="lg" className="gap-2">Start AI Symptom Check <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-8 p-4 bg-muted/50 rounded-lg">
        <strong>Medical Disclaimer:</strong> This content is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
      </p>
    </div>
  );
};

export default ConditionPage;
