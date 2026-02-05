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
    title: 'Doctori AI - AI Health Assistant & Doctor Booking',
    description: 'Chat with Doctori AI for symptom guidance, find trusted doctors near you, and book appointments 24/7. Your virtual health companion.',
    canonicalPath: '/',
  },
  chat: {
    title: 'AI Symptom Checker - Free Health Chat',
    description: 'Describe your symptoms and get instant AI-powered health guidance. Free 24/7 symptom checker with doctor recommendations.',
    canonicalPath: '/chat',
  },
  doctors: {
    title: 'Find & Book Doctors Near You',
    description: 'Search verified healthcare professionals, compare ratings, and book appointments online. Find the right doctor for your needs.',
    canonicalPath: '/doctors',
  },
  booking: {
    title: 'Book Doctor Appointment Online',
    description: 'Schedule appointments with verified doctors in your area. Easy online booking with instant confirmation.',
    canonicalPath: '/booking',
  },
  blog: {
    title: 'Health Blog - Expert Medical Articles',
    description: 'Read expert health articles on nutrition, fitness, symptoms, and wellness. Evidence-based medical information.',
    canonicalPath: '/blog',
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
    title: 'Medicine Information Search',
    description: 'Search for detailed medicine information including uses, dosage, side effects, and alternatives.',
    canonicalPath: '/medicine',
  },
  reminders: {
    title: 'Health Reminders - Medication & Appointments',
    description: 'Set reminders for medications, doctor appointments, and health routines. Never miss important health tasks.',
    canonicalPath: '/reminders',
  },
  bloodDonation: {
    title: 'Blood Donation Registration',
    description: 'Register as a blood donor and help save lives. Join our blood donor community in Bangladesh.',
    canonicalPath: '/blood-donation',
  },
  bmiCalculator: {
    title: 'BMI Calculator - Check Your Body Mass Index',
    description: 'Calculate your BMI and understand your weight status. Get personalized health recommendations based on your results.',
    canonicalPath: '/bmi-calculator',
  },
} as const;

// Health-related keywords for SEO
export const HEALTH_KEYWORDS = {
  general: ['AI health assistant', 'doctor booking', 'symptom checker', 'healthcare platform', 'medical advice'],
  chat: ['symptom checker', 'AI diagnosis', 'health chatbot', 'medical questions', 'health guidance'],
  doctors: ['find doctors', 'book appointment', 'healthcare professionals', 'verified doctors', 'doctor near me'],
  blog: ['health articles', 'medical information', 'wellness tips', 'health education', 'disease prevention'],
} as const;
