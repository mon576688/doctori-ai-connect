// SEO Configuration and Constants for Doctori AI

export const SITE_CONFIG = {
  name: 'Doctori AI',
  url: 'https://doctoriai.com',
  defaultOgImage: '/og-image.png',
  twitterHandle: '@DoctoriAI',
};

// Page-specific SEO metadata
export const PAGE_SEO = {
  home: {
    title: 'Doctori AI - Your AI Health Assistant | Find Doctors 24/7',
    description: 'Chat with AI to check symptoms, find verified doctors near you, locate blood banks, and book appointments online. Free & available 24/7.',
    canonicalPath: '/',
    keywords: 'doctor, doctor AI, find doctor near me, nearby doctor, health analysis, blood bank, health blogs, symptom checker, online doctor appointment',
  },
  chat: {
    title: 'Free AI Health Chat - Talk to AI Doctor 24/7 | Doctori AI',
    description: 'Describe your symptoms and get instant AI-powered health guidance. Free, private, and available 24/7.',
    canonicalPath: '/chat',
  },
  doctors: {
    title: 'Find Verified Doctors Near You | Doctori AI',
    description: 'Browse and book appointments with verified healthcare professionals near you. Filter by specialty, location, and availability.',
    canonicalPath: '/doctors',
    keywords: 'find doctor, nearby doctor, book doctor appointment, doctor near me, healthcare professionals',
  },
  booking: {
    title: 'Book Doctor Appointment Online',
    description: 'Schedule appointments with verified doctors in your area. Easy online booking with instant confirmation.',
    canonicalPath: '/booking',
  },
  blog: {
    title: 'Health Blog, Tips & Medical Advice | Doctori AI',
    description: 'Expert health articles, wellness tips, and medical guidance to help you live healthier.',
    canonicalPath: '/blog',
    keywords: 'health blogs, medical articles, health tips, wellness blog, disease prevention, nutrition tips',
  },
  healthTips: {
    title: 'Bangladesh Health Tips - Dengue, Safety & More',
    description: 'Get practical health tips for Bangladesh: dengue prevention, water safety, heatwave precautions, and maternal care.',
    canonicalPath: '/health-tips',
  },
  about: {
    title: 'About Doctori AI - Your Trusted Health Companion',
    description: 'Learn about Doctori AI\'s mission to make healthcare accessible. HIPAA-compliant AI health guidance platform.',
    canonicalPath: '/about',
  },
  contact: {
    title: 'Contact Doctori AI - Get Support',
    description: 'Reach Doctori AI support team. 24/7 AI assistance, human support Mon-Fri. Email, phone, and chat options.',
    canonicalPath: '/contact',
  },
  privacy: {
    title: 'Privacy Policy - Data Protection',
    description: 'How Doctori AI protects your health data. HIPAA-compliant, encrypted, and secure. Your privacy matters.',
    canonicalPath: '/privacy',
  },
  terms: {
    title: 'Terms & Conditions - Legal',
    description: 'Read Doctori AI\'s terms of service. Platform usage rules, limitations, and user responsibilities.',
    canonicalPath: '/terms',
  },
  doctorVerification: {
    title: 'Doctor Verification Policy',
    description: 'How Doctori AI verifies healthcare providers. Our rigorous credentialing process ensures quality care.',
    canonicalPath: '/doctor-verification',
  },
  medicine: {
    title: 'Medicine Search & Drug Interaction Checker | Doctori AI',
    description: 'Search medications, understand dosages, and check for drug-to-drug interactions in our comprehensive medicine database.',
    canonicalPath: '/medicine',
  },
  reminders: {
    title: 'Health Reminders - Medication & Appointments',
    description: 'Set reminders for medications, doctor appointments, and health routines. Never miss important health tasks.',
    canonicalPath: '/reminders',
  },
  bloodDonation: {
    title: 'Find Blood Banks & Donate Blood Near You | Doctori AI',
    description: 'Locate blood banks near you, register as a blood donor, and help save lives in your community.',
    canonicalPath: '/blood-donation',
    keywords: 'blood donation, blood bank, blood bank list, blood donor, donate blood, blood group',
  },
  bmiCalculator: {
    title: 'BMI Calculator - Check Your Body Mass Index',
    description: 'Calculate your BMI and understand your weight status. Get personalized health recommendations based on your results.',
    canonicalPath: '/bmi-calculator',
  },
  aiAnalysis: {
    title: 'AI Health Analysis - Prescription & Report Scanner',
    description: 'Upload prescriptions or medical reports for instant AI health analysis. Get clear explanations and insights from your health documents.',
    canonicalPath: '/ai-analysis',
    keywords: 'health analysis, AI medical analysis, prescription scanner, medical report analysis, health document reader',
  },
  search: {
    title: 'Search Doctors, Medicine & Health Articles',
    description: 'Search verified doctors, medicine information, and health articles. Find what you need for your health journey.',
    canonicalPath: '/search',
  },
  chatSummary: {
    title: 'Chat Summary - Health Consultation Report',
    description: 'View your AI health consultation summary with symptom analysis, recommendations, and nearby doctor suggestions.',
    canonicalPath: '/chat-summary',
  },
} as const;

// Health-related keywords for SEO
export const HEALTH_KEYWORDS = {
  general: ['AI health assistant', 'doctor booking', 'symptom checker', 'healthcare platform', 'medical advice'],
  chat: ['symptom checker', 'AI diagnosis', 'health chatbot', 'medical questions', 'health guidance'],
  doctors: ['find doctors', 'book appointment', 'healthcare professionals', 'verified doctors', 'doctor near me'],
  blog: ['health articles', 'medical information', 'wellness tips', 'health education', 'disease prevention'],
} as const;
