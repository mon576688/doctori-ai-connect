import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Search,
  BookOpen,
  Heart,
  Shield,
  Users,
  Stethoscope,
  Brain,
  Activity,
  Clock,
  Star,
  CheckCircle,
  Globe,
  Smartphone,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Languages,
  ThumbsUp,
  Eye,
  Zap,
  Calculator,
  Bell,
  Quote,
  Pill,
  Droplets,
  ClipboardCheck,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";
import DailyWellnessPractice from "@/components/DailyWellnessPractice";

const HeartbeatDivider = () => {
  const filterId = useId();
  return (
    <div className="my-4 max-w-[60%] mx-auto group cursor-pointer" aria-hidden="true">
      <svg
        viewBox="0 0 600 40"
        preserveAspectRatio="none"
        width="100%"
        height="24"
        className="heartbeat-divider"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 0,20 L 150,20 L 170,20 L 180,12 L 190,20 L 210,20 L 220,20 L 230,4 L 240,36 L 250,16 L 260,20 L 280,20 L 290,14 L 300,20 L 400,20 L 600,20"
          fill="none"
          stroke="hsl(217 91% 60%)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
          className="heartbeat-path"
          style={{ filter: `url(#${filterId})` }}
        />
      </svg>
    </div>
  );
};

const Index = () => {
  const { t } = useTranslation('home');

  const featuresRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Center-focus observer for scaling effect
    const focusObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5) {
            entry.target.classList.add('feature-card-focus');
          } else {
            entry.target.classList.remove('feature-card-focus');
          }
        });
      },
      { threshold: [0, 0.5, 1], rootMargin: '-30% 0px -30% 0px' }
    );

    const cards = featuresRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => {
      observer.observe(card);
      focusObserver.observe(card);
    });

    // Wellness cards
    const wellnessCards = sectionsRef.current?.querySelectorAll('.wellness-card');
    wellnessCards?.forEach((card) => {
      observer.observe(card);
      focusObserver.observe(card);
    });

    // Section scroll-in animations
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    const sections = sectionsRef.current?.querySelectorAll('.section-animate');
    sections?.forEach((section) => sectionObserver.observe(section));

    return () => {
      observer.disconnect();
      focusObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden dot-grid-bg" ref={sectionsRef}>
      {/* Global background gradient mesh */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px] -left-40 top-[10%]"
          style={{ transform: `translate3d(0, ${scrollY * 0.01}px, 0)` }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-secondary/[0.05] blur-[120px] right-[-10%] top-[30%]"
          style={{ transform: `translate3d(0, ${scrollY * -0.015}px, 0)` }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full bg-accent/[0.03] blur-[120px] left-[20%] top-[55%]"
          style={{ transform: `translate3d(0, ${scrollY * 0.02}px, 0)` }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-destructive/[0.03] blur-[120px] right-[5%] top-[75%]"
          style={{ transform: `translate3d(0, ${scrollY * -0.01}px, 0)` }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-secondary/[0.04] blur-[120px] left-[-5%] top-[90%]"
          style={{ transform: `translate3d(0, ${scrollY * -0.02}px, 0)` }}
        />
      </div>

      {/* Floating medical icons across the full page */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <HeartPulse
          className="absolute text-primary/[0.05] left-[8%] top-[15%]"
          size={64}
          style={{ transform: `translate3d(0, ${scrollY * -0.04}px, 0)`, animation: 'float 6s ease-in-out infinite' }}
        />
        <Stethoscope
          className="absolute text-secondary/[0.05] right-[12%] top-[28%]"
          size={52}
          style={{ transform: `translate3d(0, ${scrollY * 0.03}px, 0)`, animation: 'float 6s ease-in-out infinite 1s' }}
        />
        <Shield
          className="absolute text-accent/[0.04] left-[5%] top-[48%]"
          size={56}
          style={{ transform: `translate3d(0, ${scrollY * -0.05}px, 0)`, animation: 'float 6s ease-in-out infinite 2s' }}
        />
        <Brain
          className="absolute text-primary/[0.05] right-[8%] top-[62%]"
          size={60}
          style={{ transform: `translate3d(0, ${scrollY * 0.04}px, 0)`, animation: 'float 6s ease-in-out infinite 3s' }}
        />
        <Activity
          className="absolute text-secondary/[0.04] left-[25%] top-[78%]"
          size={48}
          style={{ transform: `translate3d(0, ${scrollY * -0.03}px, 0)`, animation: 'float 6s ease-in-out infinite 4s' }}
        />
        <Pill
          className="absolute text-accent/[0.05] right-[18%] top-[88%]"
          size={44}
          style={{ transform: `translate3d(0, ${scrollY * 0.02}px, 0)`, animation: 'float 6s ease-in-out infinite 5s' }}
        />
      </div>

      <div className="relative z-10">
      <SEO
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        canonicalPath={PAGE_SEO.home.canonicalPath}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-24 px-4 overflow-hidden">
        {/* Floating decorations */}
        <div className="floating-shape w-72 h-72 bg-primary/30 -top-20 -left-20" />
        <div
          className="floating-shape w-96 h-96 bg-secondary/20 -bottom-32 -right-32"
          style={{ animationDelay: "2s" }}
        />

        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">{t('hero.badge')}</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  {t('hero.title')} <span className="bg-gradient-primary bg-clip-text text-transparent">{t('hero.titleHighlight')}</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t('hero.subtitle')}
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed">
                  {t('hero.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/chat">
                  <Button variant="medical" size="lg" className="text-lg px-8 w-full sm:w-auto shadow-medical" aria-label="Chat with AI health assistant">
                    {t('hero.startChat')}
                  </Button>
                </Link>
                <Link to="/ai-analysis">
                  <Button variant="healing" size="lg" className="text-lg px-8 w-full sm:w-auto" aria-label="Analyze prescriptions and medical reports with AI">
                    {t('hero.aiAnalysis')}
                  </Button>
                </Link>
                <Link to="/booking/location">
                  <Button variant="hero" size="lg" className="text-lg px-8 w-full sm:w-auto" aria-label="Book a doctor appointment online">
                    {t('hero.bookAppointment')}
                  </Button>
                </Link>
                <Link to="/blood-donation">
                  <Button variant="destructive" size="lg" className="text-lg px-8 w-full sm:w-auto" aria-label="Register as a blood donor">
                    {t('hero.bloodDonation')}
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/doctors">
                  <Button variant="hero" size="lg" className="text-lg px-8 w-full sm:w-auto" aria-label="Find and book verified doctors">
                    {t('hero.findDoctors')}
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto" aria-label="Read health blog articles">
                    {t('hero.healthBlog')}
                  </Button>
                </Link>
                <Link to="/bmi-calculator">
                  <Button variant="secondary" size="lg" className="text-lg px-8 w-full sm:w-auto" aria-label="Calculate your body mass index">
                    {t('hero.bmiCalculator')}
                  </Button>
                </Link>
                <Link to="/reminders">
                  <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto" aria-label="Set health and medication reminders">
                    {t('hero.healthReminders')}
                  </Button>
                </Link>
                <Button
                  variant="healing"
                  size="lg"
                  className="text-lg px-8 w-full sm:w-auto"
                  aria-label="Scroll to daily wellness practice section"
                  onClick={() => document.getElementById('daily-wellness')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('hero.dailyWellness')}
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Doctori AI virtual health assistant interface showing doctor consultation"
                className="rounded-2xl shadow-float w-full animate-float"
                loading="eager"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* How It Works Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-primary">
            <div className="text-center mb-12">
              <Badge className="bg-primary/20 text-primary mb-4">{t('howItWorks.badge')}</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('howItWorks.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('howItWorks.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -translate-y-1/2 z-0" />

              <Card className="card-glass card-hover-lift text-center relative z-10">
                <CardContent className="p-8">
                  <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-medical">
                    <MessageCircle className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t('howItWorks.step1Title')}</h3>
                  <p className="text-muted-foreground">{t('howItWorks.step1Desc')}</p>
                </CardContent>
              </Card>

              <Card className="card-glass card-hover-lift text-center relative z-10">
                <CardContent className="p-8">
                  <div className="bg-gradient-healing p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <div className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t('howItWorks.step2Title')}</h3>
                  <p className="text-muted-foreground">{t('howItWorks.step2Desc')}</p>
                </CardContent>
              </Card>

              <Card className="card-glass card-hover-lift text-center relative z-10">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Stethoscope className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div className="bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t('howItWorks.step3Title')}</h3>
                  <p className="text-muted-foreground">{t('howItWorks.step3Desc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* Your Complete Health Companion Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-secondary">
            <div className="text-center mb-12">
              <Badge className="bg-secondary/20 text-secondary mb-4">{t('healthCompanion.badge')}</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('healthCompanion.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('healthCompanion.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Link to="/chat" aria-label="Start AI health chat assistant">
                <Card className="card-glass card-hover-lift cursor-pointer h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{t('healthCompanion.aiAssistant')}</h3>
                    <p className="text-muted-foreground">{t('healthCompanion.aiAssistantDesc')}</p>
                    <div className="mt-4 flex items-center justify-center text-primary">
                      <span className="text-sm font-medium">{t('healthCompanion.startChat')}</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/doctors" aria-label="Find and book verified doctors near you">
                <Card className="card-glass card-hover-lift cursor-pointer h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-healing p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <Users className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{t('healthCompanion.findDoctors')}</h3>
                    <p className="text-muted-foreground">{t('healthCompanion.findDoctorsDesc')}</p>
                    <div className="mt-4 flex items-center justify-center text-secondary">
                      <span className="text-sm font-medium">{t('healthCompanion.browseDoctors')}</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/blog" aria-label="Read expert health articles and guides">
                <Card className="card-glass card-hover-lift cursor-pointer h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{t('healthCompanion.healthEducation')}</h3>
                    <p className="text-muted-foreground">{t('healthCompanion.healthEducationDesc')}</p>
                    <div className="mt-4 flex items-center justify-center text-accent">
                      <span className="text-sm font-medium">{t('healthCompanion.readArticles')}</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* Featured Doctors Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-gradient">
            <div className="text-center mb-12">
              <Badge className="bg-accent/20 text-accent mb-4">{t('featuredDoctors.badge')}</Badge>
              <h2 className="text-3xl font-bold mb-4">{t('featuredDoctors.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('featuredDoctors.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  specialty: "Cardiologist",
                  rating: "4.8",
                  reviews: 127,
                  status: t('featuredDoctors.availableToday'),
                  statusColor: "bg-secondary/20 text-secondary",
                  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
                  id: 1,
                },
                {
                  name: "Dr. Michael Chen",
                  specialty: "General Practice",
                  rating: "4.9",
                  reviews: 203,
                  status: t('featuredDoctors.topRated'),
                  statusColor: "bg-primary/20 text-primary",
                  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
                  id: 2,
                },
                {
                  name: "Dr. Emily Rodriguez",
                  specialty: "Pediatrics",
                  rating: "4.7",
                  reviews: 89,
                  status: t('featuredDoctors.verified'),
                  statusColor: "bg-accent/20 text-accent",
                  image: "https://images.unsplash.com/photo-1594824797147-5cd0b4cf9e67?w=120&h=120&fit=crop&crop=face",
                  id: 3,
                },
              ].map((doctor) => (
                <Card
                  key={doctor.id}
                  className="bg-background/80 backdrop-blur-sm card-hover-lift border-2 border-transparent hover:border-primary/20"
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={doctor.image}
                        alt={`${doctor.name} - ${doctor.specialty} at Doctori AI`}
                        className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-primary/20"
                        loading="lazy"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1">{doctor.name}</h3>
                    <Badge variant="secondary" className="mb-3">
                      {doctor.specialty}
                    </Badge>
                    <div className="flex items-center justify-center space-x-1 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {doctor.rating} ({doctor.reviews} {t('featuredDoctors.reviews')})
                      </span>
                    </div>
                    <Badge className={`${doctor.statusColor} mb-4`}>{doctor.status}</Badge>
                    <Link to={`/doctor/${doctor.id}`}>
                      <Button variant="medical" size="sm" className="w-full">
                        {t('featuredDoctors.viewProfile')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/doctors">
                <Button variant="outline" size="lg" className="bg-background/50">
                  {t('featuredDoctors.viewAllDoctors')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* Trust Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-primary p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 text-primary-foreground">{t('trust.title')}</h2>

              <div className="grid md:grid-cols-4 gap-8 mb-12">
                {[
                  { value: "10,000+", label: t('trust.happyUsers'), icon: Users },
                  { value: "500+", label: t('trust.verifiedDoctors'), icon: Stethoscope },
                  { value: "24/7", label: t('trust.aiSupport'), icon: Brain },
                  { value: "100%", label: t('trust.secure'), icon: Shield },
                ].map((stat, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 stat-glow">
                    <stat.icon className="h-8 w-8 text-primary-foreground/80 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary-foreground">{stat.value}</div>
                    <div className="text-primary-foreground/80">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-8 items-center text-primary-foreground/90">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  <span>{t('trust.dataSecured')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  <span>{t('trust.medicalGradeSecurity')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  <span>{t('trust.trustedCare')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* Common Health Concerns Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-accent">
            <div className="text-center mb-12">
              <Badge className="bg-accent/20 text-accent mb-4">{t('healthConcerns.badge')}</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('healthConcerns.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('healthConcerns.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Brain,
                  label: t('healthConcerns.mentalHealth'),
                  desc: t('healthConcerns.mentalHealthDesc'),
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  icon: Heart,
                  label: t('healthConcerns.cardiovascular'),
                  desc: t('healthConcerns.cardiovascularDesc'),
                  gradient: "from-red-500 to-red-600",
                },
                {
                  icon: Activity,
                  label: t('healthConcerns.generalHealth'),
                  desc: t('healthConcerns.generalHealthDesc'),
                  gradient: "from-green-500 to-green-600",
                },
                {
                  icon: Eye,
                  label: t('healthConcerns.preventiveCare'),
                  desc: t('healthConcerns.preventiveCareDesc'),
                  gradient: "from-blue-500 to-blue-600",
                },
              ].map((category, index) => (
                <Link key={index} to="/chat">
                  <Card className="bg-background/80 backdrop-blur-sm card-hover-lift cursor-pointer h-full group">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`bg-gradient-to-br ${category.gradient} p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <category.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">{category.label}</h3>
                      <p className="text-sm text-muted-foreground">{category.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* Daily Health Tips Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-secondary">
            <div className="text-center mb-12">
              <Badge className="bg-secondary/20 text-secondary mb-4">{t('healthTips.badge')}</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('healthTips.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('healthTips.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {[
                {
                  tip: t('healthTips.tip1'),
                  category: t('healthTips.tip1Category'),
                  icon: Target,
                  color: "bg-primary",
                },
                {
                  tip: t('healthTips.tip2'),
                  category: t('healthTips.tip2Category'),
                  icon: Brain,
                  color: "bg-accent",
                },
                {
                  tip: t('healthTips.tip3'),
                  category: t('healthTips.tip3Category'),
                  icon: Eye,
                  color: "bg-secondary",
                },
              ].map((tip, index) => (
                <Link key={index} to="/blog">
                  <Card className="bg-background/80 backdrop-blur-sm card-hover-lift cursor-pointer h-full border-l-4 border-l-secondary">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`${tip.color} p-3 rounded-xl flex-shrink-0`}>
                          <tip.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-3">
                            {tip.category}
                          </Badge>
                          <p className="text-muted-foreground leading-relaxed">{tip.tip}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link to="/blog">
                <Button variant="outline" size="lg" className="bg-background/50">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  {t('healthTips.moreHealthTips')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

       {/* Advanced Features Section */}
      <section className="py-16 px-4 relative overflow-hidden section-animate">
        {/* Background depth blobs */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div
            className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -left-32 top-20"
            style={{ transform: `translate3d(0, ${scrollY * -0.03}px, 0)` }}
          />
          <div
            className="absolute w-[600px] h-[600px] rounded-full bg-secondary/5 blur-3xl -right-40 top-1/2"
            style={{ transform: `translate3d(0, ${scrollY * 0.02}px, 0)` }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl left-1/4 bottom-0"
            style={{ transform: `translate3d(0, ${scrollY * -0.04}px, 0)` }}
          />
        </div>

        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="section-box section-box-primary">
            <div className="text-center mb-12">
              <Badge className="bg-primary/20 text-primary mb-4">{t('features.badge')}</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('features.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative" ref={featuresRef}>
              {/* Vertical connector lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block" aria-hidden="true">
                <line x1="25%" y1="0" x2="25%" y2="100%" className="stroke-primary/10" strokeWidth="1" strokeDasharray="4 8" />
                <line x1="50%" y1="0" x2="50%" y2="100%" className="stroke-primary/10" strokeWidth="1" strokeDasharray="4 8" />
                <line x1="75%" y1="0" x2="75%" y2="100%" className="stroke-primary/10" strokeWidth="1" strokeDasharray="4 8" />
              </svg>
              {[
                {
                  icon: Sparkles,
                  title: t('features.aiAnalysisSuite'),
                  description: t('features.aiAnalysisSuiteDesc'),
                  size: "md:col-span-3",
                  link: "/ai-analysis",
                  badge: "AI-Powered",
                  gradient: "bg-gradient-to-br from-primary/20 to-accent/10",
                  iconBg: "bg-gradient-to-br from-primary to-accent",
                },
                {
                  icon: Languages,
                  title: t('features.multiLanguage'),
                  description: t('features.multiLanguageDesc'),
                  size: "md:col-span-2",
                  iconBg: "bg-gradient-primary",
                },
                {
                  icon: Smartphone,
                  title: t('features.mobileOptimized'),
                  description: t('features.mobileOptimizedDesc'),
                  size: "",
                  iconBg: "bg-gradient-primary",
                },
                {
                  icon: Pill,
                  title: t('features.medicineIntelligence'),
                  description: t('features.medicineIntelligenceDesc'),
                  size: "md:col-span-2",
                  link: "/medicine",
                  badge: "New",
                  iconBg: "bg-gradient-healing",
                },
                {
                  icon: Activity,
                  title: t('features.bmiCalculator'),
                  description: t('features.bmiCalculatorDesc'),
                  size: "",
                  link: "/bmi-calculator",
                  iconBg: "bg-gradient-healing",
                },
                {
                  icon: Calendar,
                  title: t('features.symptomTracking'),
                  description: t('features.symptomTrackingDesc'),
                  size: "",
                  iconBg: "bg-gradient-primary",
                },
                {
                  icon: FileText,
                  title: t('features.healthReports'),
                  description: t('features.healthReportsDesc'),
                  size: "md:col-span-2",
                  iconBg: "bg-gradient-primary",
                },
                {
                  icon: Bell,
                  title: t('features.healthReminders'),
                  description: t('features.healthRemindersDesc'),
                  size: "",
                  link: "/reminders",
                  badge: "New",
                  iconBg: "bg-gradient-to-br from-accent to-accent/80",
                },
                {
                  icon: Droplets,
                  title: t('features.bloodDonation'),
                  description: t('features.bloodDonationDesc'),
                  size: "md:col-span-2",
                  link: "/blood-donation",
                  badge: "Community",
                  iconBg: "bg-gradient-to-br from-destructive to-destructive/80",
                },
                {
                  icon: TrendingUp,
                  title: t('features.progressMonitoring'),
                  description: t('features.progressMonitoringDesc'),
                  size: "",
                  iconBg: "bg-gradient-primary",
                },
                {
                  icon: Zap,
                  title: t('features.instantAnalysis'),
                  description: t('features.instantAnalysisDesc'),
                  size: "md:col-span-2",
                  iconBg: "bg-gradient-primary",
                },
              ].map((feature, index) => {
                const cardContent = (
                  <Card
                    key={index}
                    className={`feature-card relative z-10 rounded-2xl border-primary/10 backdrop-blur-sm bg-background/80 card-hover-lift card-hover-glow ${feature.size} ${(feature as any).gradient || ''} ${index % 2 === 1 ? 'md:mt-10' : ''}`}
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className={`${(feature as any).iconBg || 'bg-gradient-primary'} p-3 rounded-xl flex-shrink-0`}>
                        <feature.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{feature.title}</h3>
                          {(feature as any).badge && (
                            <Badge variant="secondary" className="text-xs">{(feature as any).badge}</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                      {(feature as any).link && (
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                      )}
                    </CardContent>
                  </Card>
                );

                return (feature as any).link ? (
                  <Link key={index} to={(feature as any).link} className={feature.size}>
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* Daily Wellness Practice */}
      <div id="daily-wellness">
        <DailyWellnessPractice />
      </div>

      <HeartbeatDivider />

      {/* Parallax Medical Divider */}
      <section className="relative overflow-hidden py-16 pointer-events-none" aria-hidden="true">
        {/* Gradient blobs */}
        <div
          className="absolute w-72 h-72 rounded-full bg-primary/15 blur-3xl -left-20 top-0"
          style={{ transform: `translate3d(0, ${scrollY * -0.08}px, 0)` }}
        />
        <div
          className="absolute w-96 h-96 rounded-full bg-secondary/10 blur-3xl -right-24 -bottom-10"
          style={{ transform: `translate3d(0, ${scrollY * 0.06}px, 0)` }}
        />

        {/* Floating medical icons */}
        <HeartPulse
          className="absolute text-primary/12 left-[10%] top-[20%]"
          size={56}
          style={{
            transform: `translate3d(0, ${scrollY * -0.05}px, 0)`,
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <Pill
          className="absolute text-secondary/12 right-[15%] top-[30%]"
          size={44}
          style={{
            transform: `translate3d(0, ${scrollY * 0.04}px, 0)`,
            animation: 'float 6s ease-in-out infinite 1.5s',
          }}
        />
        <Stethoscope
          className="absolute text-accent/12 left-[60%] bottom-[20%]"
          size={48}
          style={{
            transform: `translate3d(0, ${scrollY * -0.03}px, 0)`,
            animation: 'float 6s ease-in-out infinite 3s',
          }}
        />

        {/* SVG ECG heartbeat line */}
        <svg
          className="w-full max-w-4xl mx-auto h-16"
          viewBox="0 0 800 60"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `translate3d(0, ${scrollY * -0.02}px, 0)` }}
        >
          <path
            d="M0 30 L150 30 L170 30 L185 10 L200 50 L215 5 L230 55 L245 25 L260 35 L280 30 L400 30 L420 30 L435 12 L450 48 L465 8 L480 52 L495 28 L510 32 L530 30 L800 30"
            className="stroke-primary/10"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </section>

      <HeartbeatDivider />

      {/* Testimonials Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-warm">
            <div className="text-center mb-12">
              <Badge className="bg-orange-500/20 text-orange-600 mb-4">{t('testimonials.badge')}</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('testimonials.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('testimonials.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Miller",
                  role: "Teacher",
                  content:
                    "Doctori AI helped me understand my symptoms before my doctor's appointment. The AI was so helpful and the doctor I found was excellent!",
                  rating: 5,
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=60&h=60&fit=crop&crop=face",
                },
                {
                  name: "Ahmed Rahman",
                  role: "Software Engineer",
                  content:
                    "Being able to chat in Bengali made all the difference. The AI understood my concerns perfectly and connected me with a local doctor.",
                  rating: 5,
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
                },
                {
                  name: "Maria Garcia",
                  role: "Mother of 2",
                  content:
                    "As a busy mom, having 24/7 access to health guidance is invaluable. Doctori AI has become my trusted health companion.",
                  rating: 5,
                  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="bg-background/90 backdrop-blur-sm card-hover-lift relative">
                  <CardContent className="p-6">
                    <Quote className="absolute top-4 right-4 h-8 w-8 text-orange-500/20" />
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-orange-500/20"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* Emergency Contact Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800/50 p-8 md:p-12 text-center">
            <div className="mb-8">
              <div className="bg-red-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Phone className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-700 dark:text-red-400">{t('emergency.title')}</h2>
              <p className="text-lg text-red-600 dark:text-red-300 mb-6">
                {t('emergency.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { country: "USA", number: "911" },
                { country: "UK", number: "999" },
                { country: "Bangladesh", number: "999 / 16263" },
              ].map((emergency, index) => (
                <div key={index} className="bg-background p-4 rounded-xl shadow-card">
                  <h3 className="font-semibold mb-2">{emergency.country}</h3>
                  <p className="text-2xl font-bold text-red-600">{emergency.number}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-red-500 mt-6">
              {t('emergency.disclaimer')}
            </p>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* FAQ Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-4xl mx-auto">
          <div className="section-box section-box-muted">
            <div className="text-center mb-12">
              <Badge className="bg-muted-foreground/20 text-muted-foreground mb-4">{t('faq.badge')}</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('faq.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('faq.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { question: t('faq.q1'), answer: t('faq.a1') },
                { question: t('faq.q2'), answer: t('faq.a2') },
                { question: t('faq.q3'), answer: t('faq.a3') },
                { question: t('faq.q4'), answer: t('faq.a4') },
                { question: t('faq.q5'), answer: t('faq.a5') },
                { question: t('faq.q6'), answer: t('faq.a6') },
              ].map((faq, index) => (
                <Card key={index} className="bg-background/70 backdrop-blur-sm card-hover-lift">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-start">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed pl-7">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HeartbeatDivider />

      {/* Final CTA Section */}
      <section className="py-16 px-4 section-animate">
        <div className="container max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-hero p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="floating-shape w-32 h-32 bg-primary/30 top-10 left-10" />
            <div
              className="floating-shape w-24 h-24 bg-secondary/30 bottom-10 right-20"
              style={{ animationDelay: "1s" }}
            />
            <div className="floating-shape w-16 h-16 bg-accent/30 top-20 right-10" style={{ animationDelay: "2s" }} />

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t('cta.title')}</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/chat">
                  <Button variant="medical" size="lg" className="text-lg px-8 w-full sm:w-auto shadow-medical">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t('cta.startFreeChat')}
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="healing" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    <Stethoscope className="mr-2 h-5 w-5" />
                    {t('cta.findDoctors')}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="hero" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    <Award className="mr-2 h-5 w-5" />
                    {t('cta.createAccount')}
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center bg-background/50 rounded-full px-4 py-2">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  {t('cta.noCreditCard')}
                </div>
                <div className="flex items-center bg-background/50 rounded-full px-4 py-2">
                  <Shield className="h-4 w-4 text-primary mr-2" />
                  {t('cta.medicalGradeSecurity')}
                </div>
                <div className="flex items-center bg-background/50 rounded-full px-4 py-2">
                  <Clock className="h-4 w-4 text-accent mr-2" />
                  {t('cta.available247')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Index;
