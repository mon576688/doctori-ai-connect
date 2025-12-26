export type BDTip = {
  category: string;
  title: string;
  items: { heading: string; points: string[] }[];
};

export const healthTipsBD: BDTip[] = [
  {
    category: "Dengue Prevention",
    title: "Dengue Awareness during Monsoon",
    items: [
      {
        heading: "Reduce Mosquito Breeding",
        points: [
          "Eliminate standing water (flower pots, buckets, tires)",
          "Change water in containers every 2–3 days",
          "Keep rooftop tanks and drums tightly covered",
        ],
      },
      {
        heading: "Personal Protection",
        points: [
          "Use mosquito nets and repellents (DEET/PMD) at night",
          "Wear long sleeves and light-colored clothing",
          "Install window screens if possible",
        ],
      },
      {
        heading: "When to Seek Care",
        points: [
          "High fever with severe headache or eye pain",
          "Bleeding gums, vomiting, or severe abdominal pain",
          "Go to hospital immediately if warning signs appear",
        ],
      },
    ],
  },
  {
    category: "Water & Sanitation",
    title: "Safe Water and Diarrhea Prevention",
    items: [
      {
        heading: "Safe Drinking Water",
        points: [
          "Boil water for 1 minute or use certified filters",
          "Store in clean, covered containers; use ladle to pour",
          "Wash hands before handling water",
        ],
      },
      {
        heading: "ORS at Home",
        points: [
          "Use WHO-ORS or homemade: 6 level tsp sugar + 1/2 tsp salt in 1 liter clean water",
          "Give small sips frequently after each loose stool",
          "Continue breastfeeding/regular diet for children",
        ],
      },
    ],
  },
  {
    category: "Heatwave Safety",
    title: "Stay Safe in High Heat",
    items: [
      {
        heading: "Hydration",
        points: [
          "Drink water regularly; carry a bottle outdoors",
          "Avoid sugary drinks; choose water, lemon water, ORS",
          "Check on elderly/neighbors",
        ],
      },
      {
        heading: "Exposure",
        points: [
          "Avoid peak sun (11am–4pm); seek shade",
          "Wear loose, light, breathable clothing",
          "Use umbrella/hat; rest often",
        ],
      },
    ],
  },
  {
    category: "Winter Safety",
    title: "Protecting Health During Cold Waves",
    items: [
      {
        heading: "Stay Warm",
        points: [
          "Wear layers of warm clothing rather than one heavy layer",
          "Cover head and ears (ears are sensitive to cold wind)",
          "Apply moisturizer or petroleum jelly to prevent cracked skin",
        ],
      },
      {
        heading: "Vulnerable Groups",
        points: [
          "Keep children and elderly indoors during early morning/late night fog",
          "Ensure warm bedding and adequate nutrition",
          "Seek help for persistent cough or breathing trouble (pneumonia risk)",
        ],
      },
    ],
  },
  {
    category: "Air Pollution",
    title: "Protect Yourself from Poor Air Quality",
    items: [
      {
        heading: "Reduce Exposure",
        points: [
          "Wear a well-fitted mask (N95/KN95) outdoors",
          "Keep windows closed during peak pollution; ventilate when better",
          "Use indoor plants/air purifiers if available",
        ],
      },
      {
        heading: "Vulnerable Groups",
        points: [
          "Children, elderly, pregnant women, and those with asthma/heart disease need extra caution",
          "Always carry inhaler/meds if prescribed",
        ],
      },
    ],
  },
  {
    category: "Maternal & Child Health",
    title: "Essential Care for Mothers and Children",
    items: [
      {
        heading: "Pregnancy Care",
        points: [
          "Attend all antenatal check-ups",
          "Take iron-folic acid as advised",
          "Know danger signs: bleeding, severe headache, swelling",
        ],
      },
      {
        heading: "Child Immunization",
        points: [
          "Follow EPI schedule; keep vaccination card safe",
          "Seek care for fever > 3 days, fast breathing, or poor feeding",
        ],
      },
    ],
  },
  {
    category: "Antibiotic Awareness",
    title: "Using Antibiotics Responsibly",
    items: [
      {
        heading: "Proper Usage",
        points: [
          "Never buy antibiotics without a registered doctor’s prescription",
          "Complete the full course even if you feel better",
          "Do not share your antibiotics with others",
        ],
      },
      {
        heading: "Common Misconceptions",
        points: [
          "Antibiotics do not cure viral infections like common cold or flu",
          "Overuse causes antibiotic resistance (medicines stop working)",
          'Consult a doctor instead of asking pharmacists for "strong medicine"',
        ],
      },
    ],
  },
  {
    category: "NCD Awareness",
    title: "Diabetes & Hypertension Basics",
    items: [
      {
        heading: "Lifestyle",
        points: [
          "Limit salt and sugar; avoid trans fats",
          "Walk 30 minutes daily; take the stairs",
          "Quit tobacco; limit alcohol",
        ],
      },
      {
        heading: "Check-Ups",
        points: ["Screen blood pressure and blood sugar regularly", "Adhere to prescribed medications"],
      },
    ],
  },
  {
    category: "Nutrition",
    title: "Balanced Diet on a Rice-Heavy Plate",
    items: [
      {
        heading: "Add Protein & Iron",
        points: [
          "Add lentils, eggs, fish, or chicken to meals",
          "Include leafy greens (spinach), beans, and seasonal fruits",
          "Use iodized salt",
        ],
      },
      {
        heading: "Meal Tips",
        points: [
          "Half plate vegetables, quarter protein, quarter rice/roti",
          "Carry healthy snacks: fruit, nuts, chana",
        ],
      },
    ],
  },
  {
    category: "Kidney Health",
    title: "Maintaining Healthy Kidneys",
    items: [
      {
        heading: "Hydration & Diet",
        points: [
          "Drink 8-10 glasses of water daily (adjust for activity level)",
          "Limit salt intake to less than 1 teaspoon per day",
          "Avoid excessive use of painkillers (NSAIDs) without advice",
        ],
      },
      {
        heading: "Risk Factors",
        points: [
          "Control blood sugar and blood pressure strictly",
          "Maintain a healthy weight to reduce strain on kidneys",
          "Get kidney function tests (creatinine) annually if over 40",
        ],
      },
    ],
  },
  {
    category: "Mental Health",
    title: "Mental Wellness & Stress Management",
    items: [
      {
        heading: "Daily Practices",
        points: [
          "Practice deep breathing for 5-10 minutes daily",
          "Maintain regular sleep schedule (7-8 hours)",
          "Take short breaks during work to reduce stress",
          "Stay connected with family and friends",
        ],
      },
      {
        heading: "Warning Signs",
        points: [
          "Persistent sadness or loss of interest in activities",
          "Changes in appetite or sleep patterns",
          "Difficulty concentrating or making decisions",
          "Seek professional help if symptoms persist",
        ],
      },
    ],
  },
  {
    category: "Skin Care",
    title: "Skin Health in Humid Climate",
    items: [
      {
        heading: "Daily Care",
        points: [
          "Shower twice daily during hot weather",
          "Use mild, pH-balanced soap",
          "Apply sunscreen (SPF 30+) before going outdoors",
          "Keep skin dry to prevent fungal infections",
        ],
      },
      {
        heading: "Common Issues",
        points: [
          "Treat prickly heat with calamine lotion",
          "Keep affected areas clean and dry for fungal infections",
          "Consult dermatologist for persistent skin problems",
        ],
      },
    ],
  },
  {
    category: "Eye Health",
    title: "Protecting Your Vision",
    items: [
      {
        heading: "Screen Time",
        points: [
          "Follow 20-20-20 rule: every 20 min, look 20 feet away for 20 seconds",
          "Maintain proper distance from screens (arm's length)",
          "Adjust screen brightness to match surroundings",
          "Use anti-glare glasses if needed",
        ],
      },
      {
        heading: "General Care",
        points: [
          "Wear sunglasses with UV protection outdoors",
          "Avoid rubbing eyes with dirty hands",
          "Get annual eye check-ups after age 40",
        ],
      },
    ],
  },
  {
    category: "Food Safety",
    title: "Preventing Food-Borne Illness",
    items: [
      {
        heading: "Safe Food Handling",
        points: [
          "Wash hands thoroughly before cooking and eating",
          "Keep raw meat separate from ready-to-eat foods",
          "Cook meat and eggs thoroughly",
          "Refrigerate leftovers within 2 hours",
        ],
      },
      {
        heading: "Street Food Caution",
        points: [
          "Choose vendors with clean preparation areas",
          "Avoid raw salads and cut fruits from street vendors",
          "Ensure food is served hot and freshly prepared",
        ],
      },
    ],
  },
  {
    category: "Oral Health",
    title: "Dental Care Essentials",
    items: [
      {
        heading: "Daily Routine",
        points: [
          "Brush teeth twice daily with fluoride toothpaste",
          "Floss at least once a day",
          "Replace toothbrush every 3 months",
          "Limit sugary foods and drinks",
        ],
      },
      {
        heading: "Professional Care",
        points: [
          "Visit dentist every 6 months for check-up",
          "Get teeth cleaned professionally once a year",
          "Address tooth pain promptly to prevent complications",
        ],
      },
    ],
  },
  {
    category: "Road Safety",
    title: "Preventing Accidents & Injuries",
    items: [
      {
        heading: "Pedestrians",
        points: [
          "Use footbridges or zebra crossings where available",
          "Walk on the footpath; if unavailable, walk facing oncoming traffic",
          "Avoid using mobile phones or headphones while crossing roads",
        ],
      },
      {
        heading: "Commuters",
        points: [
          "Always wear a helmet properly when on a motorbike",
          "Do not board or alight from moving buses",
          "Fasten seatbelts in cars/microbuses",
        ],
      },
    ],
  },
  {
    category: "Workplace Ergonomics",
    title: "Posture & Back Care",
    items: [
      {
        heading: "Sitting Posture",
        points: [
          "Keep back straight with support; avoid slouching",
          "Keep screen at eye level to prevent neck strain",
          "Keep feet flat on the floor or on a footrest",
        ],
      },
      {
        heading: "Movement",
        points: [
          "Stand up and stretch every 30-45 minutes",
          "Avoid lifting heavy objects by bending your back (bend knees instead)",
          "Perform simple neck and wrist stretches at your desk",
        ],
      },
    ],
  },
  {
    category: "Elderly Care",
    title: "Health Tips for Seniors",
    items: [
      {
        heading: "Daily Activities",
        points: [
          "Light exercise like walking or stretching daily",
          "Stay socially active to prevent isolation",
          "Keep a regular medication schedule",
          "Ensure adequate lighting to prevent falls",
        ],
      },
      {
        heading: "Health Monitoring",
        points: [
          "Regular blood pressure and sugar checks",
          "Annual vision and hearing tests",
          "Maintain updated health records",
          "Know emergency contact numbers",
        ],
      },
    ],
  },
  {
    category: "Respiratory Health",
    title: "Breathing Easy",
    items: [
      {
        heading: "Prevention",
        points: [
          "Avoid smoking and secondhand smoke",
          "Wear mask in dusty or polluted areas",
          "Keep home well-ventilated",
          "Get flu vaccine annually",
        ],
      },
      {
        heading: "When Sick",
        points: [
          "Rest and stay hydrated",
          "Use steam inhalation for congestion",
          "Cover mouth when coughing or sneezing",
          "Seek care for persistent cough or breathing difficulty",
        ],
      },
    ],
  },
  {
    category: "Sleep Hygiene",
    title: "Quality Sleep for Better Health",
    items: [
      {
        heading: "Good Habits",
        points: [
          "Stick to a consistent wake-up time, even on holidays",
          "Avoid large meals and caffeine before bedtime",
          "Stop using mobile screens 1 hour before sleep",
        ],
      },
      {
        heading: "Environment",
        points: [
          "Keep the bedroom dark, cool, and quiet",
          "Use comfortable pillows and mattress",
          "Establish a relaxing pre-sleep routine (reading, prayer)",
        ],
      },
    ],
  },
  {
    category: "Hepatitis Awareness",
    title: "Liver Health & Infection Control",
    items: [
      {
        heading: "Prevention",
        points: [
          "Ensure blood is screened before transfusion",
          "Never share razors, toothbrushes, or needles",
          "Get vaccinated against Hepatitis B",
        ],
      },
      {
        heading: "Food & Water",
        points: [
          "Avoid unclean street water/juice (risk of Hep A & E)",
          "Wash hands thoroughly after using the toilet",
          "Eat freshly cooked food",
        ],
      },
    ],
  },
  {
    category: "Vitamin D & Sunlight",
    title: "Bone Health & Immunity",
    items: [
      {
        heading: "Sun Exposure",
        points: [
          "Spend 15-20 minutes in morning sunlight (before 11 am)",
          "Expose arms and face for better absorption",
          "Essential for strong bones and immune system",
        ],
      },
      {
        heading: "Dietary Sources",
        points: [
          "Eat egg yolks, saltwater fish, and fortified milk",
          "Consult a doctor for supplements if you have joint pain",
          "Essential for growing children to prevent rickets",
        ],
      },
    ],
  },
  {
    category: "First Aid",
    title: "Basic First Aid Knowledge",
    items: [
      {
        heading: "Common Emergencies",
        points: [
          "For burns: cool with running water for 10-20 minutes",
          "For cuts: apply pressure with clean cloth to stop bleeding",
          "For choking: perform back blows and abdominal thrusts",
          "For fainting: lay person flat, elevate legs",
        ],
      },
      {
        heading: "First Aid Kit Essentials",
        points: [
          "Bandages, gauze, and adhesive tape",
          "Antiseptic solution and cotton",
          "Paracetamol and ORS packets",
          "Emergency contact numbers list",
        ],
      },
    ],
  },
];
