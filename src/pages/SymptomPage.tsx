import { useParams, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { getSymptomBySlug, symptoms } from '@/data/symptoms';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, Home as HomeIcon, Stethoscope, Heart, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

const SymptomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const symptom = getSymptomBySlug(slug || '');

  if (!symptom) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Symptom Not Found</h1>
        <p className="text-muted-foreground mb-6">The symptom page you're looking for doesn't exist.</p>
        <Link to="/symptoms"><Button>Browse All Symptoms</Button></Link>
      </div>
    );
  }

  const relatedSymptomEntries = symptom.relatedSymptoms
    .map(s => symptoms.find(sy => sy.slug === s))
    .filter(Boolean);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": symptom.faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };

  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": symptom.name,
    "about": { "@type": "MedicalSymptom", "name": symptom.name },
    "description": symptom.metaDescription,
    "url": `https://doctoriai.com/symptoms/${symptom.slug}`
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO
        title={symptom.metaTitle}
        description={symptom.metaDescription}
        canonicalPath={`/symptoms/${symptom.slug}`}
        keywords={`${symptom.name}, ${symptom.name} causes, ${symptom.name} treatment, ${symptom.name} symptoms, when to see doctor for ${symptom.name}`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(medicalSchema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/symptoms" className="hover:text-primary">Symptoms</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{symptom.name}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{symptom.name}</h1>
      <p className="text-muted-foreground mb-8">Specialty: {symptom.specialtyRecommendation} • Category: {symptom.category}</p>

      {/* Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-3">Overview</h2>
        {symptom.overview.split('\n\n').map((p, i) => (
          <p key={i} className="text-muted-foreground mb-4 leading-relaxed">{p}</p>
        ))}
      </section>

      {/* Causes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Common Causes</h2>
        <div className="grid gap-3">
          {symptom.causes.map((cause, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{cause.title}</h3>
                <p className="text-sm text-muted-foreground">{cause.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* When to See a Doctor */}
      <section className="mb-8">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-destructive mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              When to See a Doctor
            </h2>
            <ul className="space-y-2">
              {symptom.whenToSeeDoctor.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-destructive mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Home Remedies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <HomeIcon className="h-5 w-5" />
          Home Remedies & Self-Care
        </h2>
        <ul className="space-y-2">
          {symptom.homeRemedies.map((remedy, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary mt-1">✓</span>
              <span>{remedy}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Related Symptoms */}
      {relatedSymptomEntries.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Related Symptoms</h2>
          <div className="flex flex-wrap gap-2">
            {relatedSymptomEntries.map((s) => s && (
              <Link key={s.slug} to={`/symptoms/${s.slug}`}>
                <Button variant="outline" size="sm">{s.name}</Button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Conditions */}
      {symptom.relatedConditions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Related Conditions</h2>
          <div className="flex flex-wrap gap-2">
            {symptom.relatedConditions.map((c) => (
              <Link key={c} to={`/conditions/${c}`}>
                <Button variant="outline" size="sm" className="capitalize">{c.replace(/-/g, ' ')}</Button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {symptom.faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {symptom.faq.map((f, i) => (
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
            <Button size="lg" className="gap-2">
              Start AI Symptom Check <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      <p className="text-xs text-muted-foreground mt-8 p-4 bg-muted/50 rounded-lg">
        <strong>Medical Disclaimer:</strong> This content is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider for diagnosis and treatment. If you are experiencing a medical emergency, call your local emergency number immediately.
      </p>
    </div>
  );
};

export default SymptomPage;
