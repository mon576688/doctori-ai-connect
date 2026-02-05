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
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        canonicalPath={PAGE_SEO.home.canonicalPath}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 px-4 overflow-hidden">
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
                <Badge className="bg-primary/10 text-primary border-primary/20">🩺 Your AI Health Assistant</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Meet <span className="bg-gradient-primary bg-clip-text text-transparent">Doctori AI</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Chat with our AI to understand your symptoms, receive health suggestions, and connect with nearby
                  doctors instantly.
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed">
                  Your trusted virtual health companion, available 24/7 to guide you on your wellness journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/chat">
                  <Button variant="medical" size="lg" className="text-lg px-8 w-full sm:w-auto shadow-medical">
                    Start Chat
                  </Button>
                </Link>
                <Link to="/booking/location">
                  <Button variant="healing" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/blood-donation">
                  <Button variant="destructive" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    Register for Blood Donation
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/doctors">
                  <Button variant="hero" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    Find Doctors
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    Health Blog
                  </Button>
                </Link>
                <Link to="/bmi-calculator">
                  <Button variant="secondary" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    BMI Calculator
                  </Button>
                </Link>
                <Link to="/reminders">
                  <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    Health Reminders
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Doctori AI Health Assistant"
                className="rounded-2xl shadow-float w-full animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-primary">
            <div className="text-center mb-12">
              <Badge className="bg-primary/20 text-primary mb-4">Simple Process</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Get help in just 3 simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -translate-y-1/2 z-0" />

              <Card className="card-glass card-hover-lift text-center relative z-10">
                <CardContent className="p-8">
                  <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-medical">
                    <MessageCircle className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Ask Your Symptoms</h3>
                  <p className="text-muted-foreground">
                    Describe your health concerns to our intelligent AI assistant in natural language.
                  </p>
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
                  <h3 className="text-xl font-semibold mb-4">Get Instant Advice</h3>
                  <p className="text-muted-foreground">
                    Receive personalized health guidance and recommendations based on your symptoms.
                  </p>
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
                  <h3 className="text-xl font-semibold mb-4">Connect with a Doctor</h3>
                  <p className="text-muted-foreground">
                    Find and book appointments with verified healthcare professionals near you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Your Complete Health Companion Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-secondary">
            <div className="text-center mb-12">
              <Badge className="bg-secondary/20 text-secondary mb-4">All-in-One Platform</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Your Complete Health Companion</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get personalized health guidance, connect with doctors, and stay informed about your wellbeing
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Link to="/chat">
                <Card className="card-glass card-hover-lift cursor-pointer h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">AI Health Assistant</h3>
                    <p className="text-muted-foreground">
                      Chat with our intelligent AI to understand symptoms and get personalized health guidance 24/7.
                    </p>
                    <div className="mt-4 flex items-center justify-center text-primary">
                      <span className="text-sm font-medium">Start Chat</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/doctors">
                <Card className="card-glass card-hover-lift cursor-pointer h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-healing p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <Users className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Find Doctors</h3>
                    <p className="text-muted-foreground">
                      Connect with verified healthcare professionals in your area and book appointments instantly.
                    </p>
                    <div className="mt-4 flex items-center justify-center text-secondary">
                      <span className="text-sm font-medium">Browse Doctors</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/blog">
                <Card className="card-glass card-hover-lift cursor-pointer h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Health Education</h3>
                    <p className="text-muted-foreground">
                      Stay informed with expert articles, tips, and resources for better health and wellness.
                    </p>
                    <div className="mt-4 flex items-center justify-center text-accent">
                      <span className="text-sm font-medium">Read Articles</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-gradient">
            <div className="text-center mb-12">
              <Badge className="bg-accent/20 text-accent mb-4">Top Professionals</Badge>
              <h2 className="text-3xl font-bold mb-4">Featured Doctors</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet some of our trusted healthcare professionals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  specialty: "Cardiologist",
                  rating: "4.8",
                  reviews: 127,
                  status: "🟢 Available Today",
                  statusColor: "bg-secondary/20 text-secondary",
                  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
                  id: 1,
                },
                {
                  name: "Dr. Michael Chen",
                  specialty: "General Practice",
                  rating: "4.9",
                  reviews: 203,
                  status: "⭐ Top Rated",
                  statusColor: "bg-primary/20 text-primary",
                  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
                  id: 2,
                },
                {
                  name: "Dr. Emily Rodriguez",
                  specialty: "Pediatrics",
                  rating: "4.7",
                  reviews: 89,
                  status: "✅ Verified",
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
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-primary/20"
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
                        {doctor.rating} ({doctor.reviews} reviews)
                      </span>
                    </div>
                    <Badge className={`${doctor.statusColor} mb-4`}>{doctor.status}</Badge>
                    <Link to={`/doctor/${doctor.id}`}>
                      <Button variant="medical" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/doctors">
                <Button variant="outline" size="lg" className="bg-background/50">
                  View All Doctors
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Bold gradient */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-primary p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 text-primary-foreground">Trusted by Thousands</h2>

              <div className="grid md:grid-cols-4 gap-8 mb-12">
                {[
                  { value: "10,000+", label: "Happy Users", icon: Users },
                  { value: "500+", label: "Verified Doctors", icon: Stethoscope },
                  { value: "24/7", label: "AI Support", icon: Brain },
                  { value: "100%", label: "Secure", icon: Shield },
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
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  <span>Medical Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  <span>Trusted Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Health Concerns Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-accent">
            <div className="text-center mb-12">
              <Badge className="bg-accent/20 text-accent mb-4">We Can Help</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Common Health Concerns</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI is trained to help with a wide range of health symptoms and conditions
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Brain,
                  label: "Mental Health",
                  desc: "Stress, anxiety, depression",
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  icon: Heart,
                  label: "Cardiovascular",
                  desc: "Heart conditions, blood pressure",
                  gradient: "from-red-500 to-red-600",
                },
                {
                  icon: Activity,
                  label: "General Health",
                  desc: "Common symptoms, wellness",
                  gradient: "from-green-500 to-green-600",
                },
                {
                  icon: Eye,
                  label: "Preventive Care",
                  desc: "Health screening, lifestyle",
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

      {/* Daily Health Tips Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-secondary">
            <div className="text-center mb-12">
              <Badge className="bg-secondary/20 text-secondary mb-4">Stay Healthy</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Daily Health Tips</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Expert advice to keep you healthy and informed
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {[
                {
                  tip: "Stay hydrated by drinking at least 8 glasses of water daily",
                  category: "Nutrition",
                  icon: Target,
                  color: "bg-primary",
                },
                {
                  tip: "Practice deep breathing for 5 minutes to reduce stress and anxiety",
                  category: "Mental Health",
                  icon: Brain,
                  color: "bg-accent",
                },
                {
                  tip: "Take regular breaks from screen time to protect your vision",
                  category: "Wellness",
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
                  More Health Tips
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section - Bento Grid */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-primary">
            <div className="text-center mb-12">
              <Badge className="bg-primary/20 text-primary mb-4">Cutting Edge</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Advanced AI Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Cutting-edge technology to support your health journey
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Languages,
                  title: "Multi-Language Support",
                  description: "Chat in your preferred language including English, Bengali, and more",
                  size: "md:col-span-2",
                },
                {
                  icon: Smartphone,
                  title: "Mobile Optimized",
                  description: "Access Doctori AI on any device, anywhere, anytime",
                  size: "",
                },
                {
                  icon: Calendar,
                  title: "Symptom Tracking",
                  description: "Track your symptoms over time and share with doctors",
                  size: "",
                },
                {
                  icon: FileText,
                  title: "Health Reports",
                  description: "Generate detailed health summaries and consultation reports",
                  size: "md:col-span-2",
                },
                {
                  icon: TrendingUp,
                  title: "Progress Monitoring",
                  description: "Monitor your health trends and improvements over time",
                  size: "",
                },
                {
                  icon: Zap,
                  title: "Instant Analysis",
                  description: "Get immediate insights based on your symptoms and health data",
                  size: "md:col-span-2",
                },
              ].map((feature, index) => (
                <Card key={index} className={`bg-background/80 backdrop-blur-sm card-hover-lift ${feature.size}`}>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-gradient-primary p-3 rounded-xl flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="section-box section-box-warm">
            <div className="text-center mb-12">
              <Badge className="bg-orange-500/20 text-orange-600 mb-4">Real Stories</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real experiences from people who trust Doctori AI
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

      {/* Emergency Contact Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800/50 p-8 md:p-12 text-center">
            <div className="mb-8">
              <div className="bg-red-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Phone className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-700 dark:text-red-400">Emergency Medical Assistance</h2>
              <p className="text-lg text-red-600 dark:text-red-300 mb-6">
                If you're experiencing a medical emergency, please contact emergency services immediately
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
              Remember: Doctori AI is not a substitute for emergency medical care
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="section-box section-box-muted">
            <div className="text-center mb-12">
              <Badge className="bg-muted-foreground/20 text-muted-foreground mb-4">Got Questions?</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about Doctori AI
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "Is Doctori AI free to use?",
                  answer:
                    "Yes! Our AI health assistant is completely free. You can chat without creating an account. Premium features like PDF reports require registration.",
                },
                {
                  question: "How accurate is the AI diagnosis?",
                  answer:
                    "No. Doctori AI does not provide medical diagnoses or treatment. It offers general health information and guidance only. Always consult a qualified healthcare professional for medical advice.",
                },
                {
                  question: "Can I use Doctori AI in my language?",
                  answer:
                    "Yes! We support multiple languages including English, Bengali, and more. Select your preferred language from the dropdown menu.",
                },
                {
                  question: "Is my health data secure?",
                  answer:
                    "Absolutely. We use medical-grade security and are HIPAA compliant. Your health information is encrypted and protected.",
                },
                {
                  question: "How do I book an appointment with a doctor?",
                  answer:
                    "After chatting with our AI, you'll be shown nearby verified doctors. Click on any doctor to view their profile and book an appointment.",
                },
                {
                  question: "Can doctors join Doctori AI platform?",
                  answer:
                    "Yes! Healthcare professionals can register through our 'Join with Us' section. All doctors undergo verification before being listed.",
                },
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

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-hero p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Decorative floating shapes */}
            <div className="floating-shape w-32 h-32 bg-primary/30 top-10 left-10" />
            <div
              className="floating-shape w-24 h-24 bg-secondary/30 bottom-10 right-20"
              style={{ animationDelay: "1s" }}
            />
            <div className="floating-shape w-16 h-16 bg-accent/30 top-20 right-10" style={{ animationDelay: "2s" }} />

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust Doctori AI for their health guidance. Start your journey to better
                health today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/chat">
                  <Button variant="medical" size="lg" className="text-lg px-8 w-full sm:w-auto shadow-medical">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Start Free Chat
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="healing" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    <Stethoscope className="mr-2 h-5 w-5" />
                    Find Doctors
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="hero" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    <Award className="mr-2 h-5 w-5" />
                    Create Account
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center bg-background/50 rounded-full px-4 py-2">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center bg-background/50 rounded-full px-4 py-2">
                  <Shield className="h-4 w-4 text-primary mr-2" />
                  Medical-Grade Security
                </div>
                <div className="flex items-center bg-background/50 rounded-full px-4 py-2">
                  <Clock className="h-4 w-4 text-accent mr-2" />
                  24/7 available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
