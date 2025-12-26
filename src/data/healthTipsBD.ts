export type BDTip = {
  category: string;
  title: string;
  items: { heading: string; points: string[] }[];
};

export const healthTipsBD: BDTip[] = [
  {
    category: 'Dengue Prevention',
    title: 'Dengue Awareness during Monsoon',
    items: [
      { heading: 'Reduce Mosquito Breeding', points: [
        'Eliminate standing water (flower pots, buckets, tires)',
        'Change water in containers every 2–3 days',
        'Keep rooftop tanks and drums tightly covered'
      ]},
      { heading: 'Personal Protection', points: [
        'Use mosquito nets and repellents (DEET/PMD) at night',
        'Wear long sleeves and light-colored clothing',
        'Install window screens if possible'
      ]},
      { heading: 'When to Seek Care', points: [
        'High fever with severe headache or eye pain',
        'Bleeding gums, vomiting, or severe abdominal pain',
        'Go to hospital immediately if warning signs appear'
      ]}
    ]
  },
  {
    category: 'Water & Sanitation',
    title: 'Safe Water and Diarrhea Prevention',
    items: [
      { heading: 'Safe Drinking Water', points: [
        'Boil water for 1 minute or use certified filters',
        'Store in clean, covered containers; use ladle to pour',
        'Wash hands before handling water'
      ]},
      { heading: 'ORS at Home', points: [
        'Use WHO-ORS or homemade: 6 level tsp sugar + 1/2 tsp salt in 1 liter clean water',
        'Give small sips frequently after each loose stool',
        'Continue breastfeeding/regular diet for children'
      ]}
    ]
  },
  {
    category: 'Heatwave Safety',
    title: 'Stay Safe in High Heat',
    items: [
      { heading: 'Hydration', points: [
        'Drink water regularly; carry a bottle outdoors',
        'Avoid sugary drinks; choose water, lemon water, ORS',
        'Check on elderly/neighbors'
      ]},
      { heading: 'Exposure', points: [
        'Avoid peak sun (11am–4pm); seek shade',
        'Wear loose, light, breathable clothing',
        'Use umbrella/hat; rest often'
      ]}
    ]
  },
  {
    category: 'Air Pollution',
    title: 'Protect Yourself from Poor Air Quality',
    items: [
      { heading: 'Reduce Exposure', points: [
        'Wear a well-fitted mask (N95/KN95) outdoors',
        'Keep windows closed during peak pollution; ventilate when better',
        'Use indoor plants/air purifiers if available'
      ]},
      { heading: 'Vulnerable Groups', points: [
        'Children, elderly, pregnant women, and those with asthma/heart disease need extra caution',
        'Always carry inhaler/meds if prescribed'
      ]}
    ]
  },
  {
    category: 'Maternal & Child Health',
    title: 'Essential Care for Mothers and Children',
    items: [
      { heading: 'Pregnancy Care', points: [
        'Attend all antenatal check-ups',
        'Take iron-folic acid as advised',
        'Know danger signs: bleeding, severe headache, swelling'
      ]},
      { heading: 'Child Immunization', points: [
        'Follow EPI schedule; keep vaccination card safe',
        'Seek care for fever > 3 days, fast breathing, or poor feeding'
      ]}
    ]
  },
  {
    category: 'NCD Awareness',
    title: 'Diabetes & Hypertension Basics',
    items: [
      { heading: 'Lifestyle', points: [
        'Limit salt and sugar; avoid trans fats',
        'Walk 30 minutes daily; take the stairs',
        'Quit tobacco; limit alcohol'
      ]},
      { heading: 'Check-Ups', points: [
        'Screen blood pressure and blood sugar regularly',
        'Adhere to prescribed medications'
      ]}
    ]
  },
  {
    category: 'Nutrition',
    title: 'Balanced Diet on a Rice-Heavy Plate',
    items: [
        { heading: 'Add Protein & Iron', points: [
          'Add lentils, eggs, fish, or chicken to meals',
          'Include leafy greens (spinach), beans, and seasonal fruits',
          'Use iodized salt'
        ]},
        { heading: 'Meal Tips', points: [
          'Half plate vegetables, quarter protein, quarter rice/roti',
          'Carry healthy snacks: fruit, nuts, chana'
        ]}
    ]
  },
  {
    category: 'Mental Health',
    title: 'Mental Wellness & Stress Management',
    items: [
      { heading: 'Daily Practices', points: [
        'Practice deep breathing for 5-10 minutes daily',
        'Maintain regular sleep schedule (7-8 hours)',
        'Take short breaks during work to reduce stress',
        'Stay connected with family and friends'
      ]},
      { heading: 'Warning Signs', points: [
        'Persistent sadness or loss of interest in activities',
        'Changes in appetite or sleep patterns',
        'Difficulty concentrating or making decisions',
        'Seek professional help if symptoms persist'
      ]}
    ]
  },
  {
    category: 'Skin Care',
    title: 'Skin Health in Humid Climate',
    items: [
      { heading: 'Daily Care', points: [
        'Shower twice daily during hot weather',
        'Use mild, pH-balanced soap',
        'Apply sunscreen (SPF 30+) before going outdoors',
        'Keep skin dry to prevent fungal infections'
      ]},
      { heading: 'Common Issues', points: [
        'Treat prickly heat with calamine lotion',
        'Keep affected areas clean and dry for fungal infections',
        'Consult dermatologist for persistent skin problems'
      ]}
    ]
  },
  {
    category: 'Eye Health',
    title: 'Protecting Your Vision',
    items: [
      { heading: 'Screen Time', points: [
        'Follow 20-20-20 rule: every 20 min, look 20 feet away for 20 seconds',
        'Maintain proper distance from screens (arm\'s length)',
        'Adjust screen brightness to match surroundings',
        'Use anti-glare glasses if needed'
      ]},
      { heading: 'General Care', points: [
        'Wear sunglasses with UV protection outdoors',
        'Avoid rubbing eyes with dirty hands',
        'Get annual eye check-ups after age 40'
      ]}
    ]
  },
  {
    category: 'Food Safety',
    title: 'Preventing Food-Borne Illness',
    items: [
      { heading: 'Safe Food Handling', points: [
        'Wash hands thoroughly before cooking and eating',
        'Keep raw meat separate from ready-to-eat foods',
        'Cook meat and eggs thoroughly',
        'Refrigerate leftovers within 2 hours'
      ]},
      { heading: 'Street Food Caution', points: [
        'Choose vendors with clean preparation areas',
        'Avoid raw salads and cut fruits from street vendors',
        'Ensure food is served hot and freshly prepared'
      ]}
    ]
  },
  {
    category: 'Oral Health',
    title: 'Dental Care Essentials',
    items: [
      { heading: 'Daily Routine', points: [
        'Brush teeth twice daily with fluoride toothpaste',
        'Floss at least once a day',
        'Replace toothbrush every 3 months',
        'Limit sugary foods and drinks'
      ]},
      { heading: 'Professional Care', points: [
        'Visit dentist every 6 months for check-up',
        'Get teeth cleaned professionally once a year',
        'Address tooth pain promptly to prevent complications'
      ]}
    ]
  },
  {
    category: 'Elderly Care',
    title: 'Health Tips for Seniors',
    items: [
      { heading: 'Daily Activities', points: [
        'Light exercise like walking or stretching daily',
        'Stay socially active to prevent isolation',
        'Keep a regular medication schedule',
        'Ensure adequate lighting to prevent falls'
      ]},
      { heading: 'Health Monitoring', points: [
        'Regular blood pressure and sugar checks',
        'Annual vision and hearing tests',
        'Maintain updated health records',
        'Know emergency contact numbers'
      ]}
    ]
  },
  {
    category: 'Respiratory Health',
    title: 'Breathing Easy',
    items: [
      { heading: 'Prevention', points: [
        'Avoid smoking and secondhand smoke',
        'Wear mask in dusty or polluted areas',
        'Keep home well-ventilated',
        'Get flu vaccine annually'
      ]},
      { heading: 'When Sick', points: [
        'Rest and stay hydrated',
        'Use steam inhalation for congestion',
        'Cover mouth when coughing or sneezing',
        'Seek care for persistent cough or breathing difficulty'
      ]}
    ]
  },
  {
    category: 'First Aid',
    title: 'Basic First Aid Knowledge',
    items: [
      { heading: 'Common Emergencies', points: [
        'For burns: cool with running water for 10-20 minutes',
        'For cuts: apply pressure with clean cloth to stop bleeding',
        'For choking: perform back blows and abdominal thrusts',
        'For fainting: lay person flat, elevate legs'
      ]},
      { heading: 'First Aid Kit Essentials', points: [
        'Bandages, gauze, and adhesive tape',
        'Antiseptic solution and cotton',
        'Paracetamol and ORS packets',
        'Emergency contact numbers list'
      ]}
    ]
  }
];
