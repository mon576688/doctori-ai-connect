export interface SymptomEntry {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  overview: string;
  causes: { title: string; description: string }[];
  whenToSeeDoctor: string[];
  homeRemedies: string[];
  relatedSymptoms: string[];
  relatedConditions: string[];
  relatedBlogs: string[];
  specialtyRecommendation: string;
  faq: { question: string; answer: string }[];
}

export const symptoms: SymptomEntry[] = [
  {
    slug: 'headache',
    name: 'Headache',
    metaTitle: 'Headache: Causes, Types & When to See a Doctor',
    metaDescription: 'Learn about common headache causes, types including tension and migraine, home remedies, and warning signs that need medical attention.',
    category: 'Neurological',
    overview: 'A headache is pain or discomfort in the head, scalp, or neck. It is one of the most common health complaints worldwide, affecting people of all ages. Most headaches are not serious and can be treated with simple measures, but some may signal an underlying condition that requires medical evaluation.\n\nHeadaches are broadly classified into primary headaches (tension-type, migraine, cluster) and secondary headaches caused by other conditions such as infections, injuries, or vascular problems. Understanding your headache pattern helps determine the best course of action.',
    causes: [
      { title: 'Tension and Stress', description: 'Muscle tension in the head, neck, and shoulders from stress, poor posture, or anxiety is the most common cause of headaches.' },
      { title: 'Migraine', description: 'A neurological condition causing intense, throbbing pain often on one side, sometimes with nausea, light sensitivity, and visual disturbances.' },
      { title: 'Dehydration', description: 'Not drinking enough water can lead to dehydration headaches, often felt as a dull ache that worsens with movement.' },
      { title: 'Sinus Congestion', description: 'Inflammation or infection of the sinuses can cause deep, constant pain in the forehead, cheeks, or bridge of the nose.' },
      { title: 'Eye Strain', description: 'Prolonged screen time or uncorrected vision problems can cause headaches, typically felt around the forehead and temples.' },
      { title: 'Sleep Issues', description: 'Too little or too much sleep, irregular sleep patterns, or sleep disorders can trigger headaches.' }
    ],
    whenToSeeDoctor: [
      'Sudden, severe headache unlike any you have had before',
      'Headache with fever, stiff neck, confusion, or seizures',
      'Headache after a head injury',
      'Headache that gets progressively worse over days',
      'Headache with vision changes, weakness, or difficulty speaking',
      'Chronic headaches that interfere with daily life'
    ],
    homeRemedies: [
      'Rest in a quiet, dark room',
      'Apply a cold or warm compress to the forehead or neck',
      'Stay well hydrated throughout the day',
      'Practice relaxation techniques like deep breathing',
      'Take over-the-counter pain relievers as directed',
      'Maintain a regular sleep schedule'
    ],
    relatedSymptoms: ['dizziness', 'nausea', 'neck-pain', 'blurred-vision'],
    relatedConditions: ['migraine', 'hypertension', 'sinusitis'],
    relatedBlogs: ['migraine-vs-headache-14', 'headache-types-simplified-40'],
    specialtyRecommendation: 'Neurology',
    faq: [
      { question: 'What is the most common type of headache?', answer: 'Tension-type headaches are the most common, affecting up to 80% of adults. They typically cause a dull, pressing pain on both sides of the head.' },
      { question: 'When should I worry about a headache?', answer: 'Seek immediate medical attention for a sudden severe headache, headache with fever and stiff neck, or headache following head trauma.' },
      { question: 'Can dehydration cause headaches?', answer: 'Yes, dehydration is a common headache trigger. Drinking adequate water throughout the day can help prevent dehydration headaches.' }
    ]
  },
  {
    slug: 'stomach-pain',
    name: 'Stomach Pain',
    metaTitle: 'Stomach Pain: Common Causes & Relief Options',
    metaDescription: 'Explore causes of stomach pain including indigestion, gastritis, and IBS. Learn home remedies and when abdominal pain needs medical care.',
    category: 'Digestive',
    overview: 'Stomach pain, also called abdominal pain, refers to discomfort felt anywhere between the chest and the pelvis. It can range from a mild, dull ache to sharp, intense pain and may be accompanied by other symptoms like bloating, nausea, or changes in bowel habits.\n\nThe abdomen contains many organs including the stomach, intestines, liver, gallbladder, and pancreas. Pain can originate from any of these structures, making it important to note the location, severity, and duration of pain to help identify the cause.',
    causes: [
      { title: 'Indigestion', description: 'Overeating, eating too quickly, or consuming spicy or fatty foods can cause upper abdominal discomfort, bloating, and a burning sensation.' },
      { title: 'Gastritis', description: 'Inflammation of the stomach lining caused by infection, medications, or alcohol can produce gnawing or burning pain in the upper abdomen.' },
      { title: 'Gas and Bloating', description: 'Excess gas in the digestive tract can cause cramping, bloating, and sharp pains that move around the abdomen.' },
      { title: 'Food Poisoning', description: 'Consuming contaminated food can lead to sudden stomach pain, nausea, vomiting, and diarrhea within hours.' },
      { title: 'Irritable Bowel Syndrome', description: 'IBS causes recurring abdominal pain, cramping, bloating, and changes in bowel habits without visible damage to the digestive tract.' },
      { title: 'Peptic Ulcer', description: 'Open sores on the stomach lining or upper small intestine cause burning pain that may worsen on an empty stomach.' }
    ],
    whenToSeeDoctor: [
      'Severe pain that prevents normal activity',
      'Pain accompanied by high fever',
      'Blood in vomit or stool',
      'Persistent vomiting or inability to keep fluids down',
      'Pain that lasts more than 48 hours without improvement',
      'Sudden sharp pain localized to one area'
    ],
    homeRemedies: [
      'Sip ginger or peppermint tea to ease nausea and cramping',
      'Apply a warm compress to the abdomen',
      'Eat bland foods like rice, toast, and bananas',
      'Avoid spicy, fatty, or acidic foods until pain resolves',
      'Stay hydrated with clear fluids',
      'Try over-the-counter antacids for acid-related pain'
    ],
    relatedSymptoms: ['nausea', 'bloating', 'diarrhea', 'vomiting'],
    relatedConditions: ['gastritis', 'irritable-bowel-syndrome', 'peptic-ulcer-disease'],
    relatedBlogs: ['abdominal-pain-when-to-worry-39'],
    specialtyRecommendation: 'Gastroenterology',
    faq: [
      { question: 'What causes stomach pain after eating?', answer: 'Common causes include indigestion, food intolerance, gastritis, or eating too quickly. If it happens frequently, consult a gastroenterologist.' },
      { question: 'How can I tell if stomach pain is serious?', answer: 'Warning signs include severe or worsening pain, fever, blood in stool or vomit, and inability to eat or drink. These warrant immediate medical attention.' },
      { question: 'Does stress cause stomach pain?', answer: 'Yes, stress can trigger or worsen stomach pain by increasing acid production and affecting gut motility. Stress management can help reduce symptoms.' }
    ]
  },
  {
    slug: 'chest-pain',
    name: 'Chest Pain',
    metaTitle: 'Chest Pain: Causes, Warning Signs & When to Call 911',
    metaDescription: 'Understand chest pain causes from heartburn to heart attack. Learn critical warning signs and when chest pain requires emergency care.',
    category: 'Cardiovascular',
    overview: 'Chest pain is any discomfort or pain felt in the front of the body between the neck and upper abdomen. While chest pain can be alarming, many causes are not life-threatening. However, because chest pain can also indicate serious heart or lung conditions, it should always be taken seriously.\n\nChest pain can feel sharp, dull, burning, aching, stabbing, or tight. The sensation may stay in one spot or spread to the jaw, neck, shoulders, arms, or back. The nature of the pain, along with associated symptoms, helps determine whether it is cardiac or non-cardiac in origin.',
    causes: [
      { title: 'Heart Attack', description: 'A blocked coronary artery causes crushing or squeezing chest pain, often with shortness of breath, sweating, and pain radiating to the arm or jaw.' },
      { title: 'Acid Reflux (GERD)', description: 'Stomach acid flowing back into the esophagus causes burning chest pain (heartburn), often worse after eating or lying down.' },
      { title: 'Muscle Strain', description: 'Overexertion or injury to chest wall muscles can cause localized, sharp pain that worsens with movement or deep breathing.' },
      { title: 'Anxiety or Panic Attack', description: 'Intense anxiety can cause chest tightness, rapid heartbeat, and shortness of breath that mimics heart-related symptoms.' },
      { title: 'Costochondritis', description: 'Inflammation of the cartilage connecting ribs to the breastbone causes sharp, localized chest pain that worsens with pressure or movement.' },
      { title: 'Pneumonia', description: 'Lung infection can cause sharp chest pain that worsens with breathing or coughing, accompanied by fever and cough.' }
    ],
    whenToSeeDoctor: [
      'Crushing or squeezing chest pain lasting more than a few minutes',
      'Pain spreading to the jaw, neck, shoulder, or arm',
      'Chest pain with shortness of breath, sweating, or nausea',
      'Sudden sharp chest pain with difficulty breathing',
      'Chest pain after a fall or chest injury',
      'New or unexplained chest pain in someone with heart disease risk factors'
    ],
    homeRemedies: [
      'For heartburn: take an antacid and avoid lying flat after meals',
      'For muscle strain: rest and apply ice to the affected area',
      'For anxiety-related pain: practice slow, deep breathing exercises',
      'Avoid caffeine and heavy meals if prone to acid reflux',
      'Maintain good posture to reduce musculoskeletal chest pain',
      'Note: if chest pain may be cardiac, call emergency services immediately'
    ],
    relatedSymptoms: ['shortness-of-breath', 'dizziness', 'nausea', 'palpitations'],
    relatedConditions: ['coronary-artery-disease', 'gerd', 'anxiety-disorders'],
    relatedBlogs: ['when-chest-pain-is-an-emergency-35'],
    specialtyRecommendation: 'Cardiology',
    faq: [
      { question: 'How do I know if chest pain is a heart attack?', answer: 'Heart attack pain typically feels like pressure, squeezing, or tightness in the center of the chest, lasting more than a few minutes, often with shortness of breath and sweating. Call emergency services immediately if suspected.' },
      { question: 'Can acid reflux cause chest pain?', answer: 'Yes, GERD is one of the most common non-cardiac causes of chest pain. The burning sensation from acid reflux can closely mimic heart-related chest pain.' },
      { question: 'Is chest pain from anxiety dangerous?', answer: 'While anxiety-related chest pain is not physically dangerous, it can be very distressing. If you are unsure whether chest pain is from anxiety or a cardiac cause, seek medical evaluation.' }
    ]
  },
  {
    slug: 'fever',
    name: 'Fever',
    metaTitle: 'Fever: Causes, Treatment & When It Is Dangerous',
    metaDescription: 'Learn what causes fever, how to treat it at home, and when a high temperature needs urgent medical attention for adults and children.',
    category: 'General',
    overview: 'A fever is a temporary increase in body temperature, usually above 100.4°F (38°C). It is one of the body\'s natural defense mechanisms against infection. While fevers can be uncomfortable, they are generally a sign that the immune system is fighting off an illness.\n\nFever can accompany a wide range of conditions from common viral infections to more serious bacterial infections. Monitoring the temperature and associated symptoms helps determine whether home care is sufficient or medical attention is needed.',
    causes: [
      { title: 'Viral Infections', description: 'Common colds, influenza, and other viral illnesses are the most frequent cause of fever.' },
      { title: 'Bacterial Infections', description: 'Urinary tract infections, pneumonia, and other bacterial infections often cause higher or more persistent fevers.' },
      { title: 'Dengue Fever', description: 'In tropical regions, dengue virus transmitted by mosquitoes causes high fever with severe body aches and rash.' },
      { title: 'Heat Exhaustion', description: 'Prolonged exposure to high temperatures can cause elevated body temperature with heavy sweating and weakness.' },
      { title: 'Medications', description: 'Some medications, including antibiotics and anti-seizure drugs, can cause drug-induced fever as a side effect.' },
      { title: 'Inflammatory Conditions', description: 'Autoimmune diseases and inflammatory conditions can cause recurring low-grade fevers.' }
    ],
    whenToSeeDoctor: [
      'Temperature above 103°F (39.4°C) in adults',
      'Fever lasting more than 3 days',
      'Fever with severe headache, stiff neck, or confusion',
      'Fever in infants under 3 months old (any temperature)',
      'Fever with rash, difficulty breathing, or chest pain',
      'Fever with persistent vomiting or signs of dehydration'
    ],
    homeRemedies: [
      'Rest and get plenty of sleep',
      'Drink plenty of fluids to prevent dehydration',
      'Take acetaminophen or ibuprofen as directed to reduce fever',
      'Wear light clothing and use light bedding',
      'Sponge the body with lukewarm (not cold) water',
      'Eat light, easy-to-digest foods when hungry'
    ],
    relatedSymptoms: ['chills', 'body-aches', 'fatigue', 'headache'],
    relatedConditions: ['influenza', 'dengue', 'pneumonia'],
    relatedBlogs: ['fever-patterns-and-what-they-signal-37', 'understanding-dengue-symptoms-8'],
    specialtyRecommendation: 'Internal Medicine',
    faq: [
      { question: 'What temperature is considered a fever?', answer: 'A body temperature of 100.4°F (38°C) or higher is generally considered a fever. Normal body temperature averages around 98.6°F (37°C) but can vary.' },
      { question: 'Should I always try to reduce a fever?', answer: 'Not necessarily. A mild fever helps the body fight infection. Treatment is recommended when fever causes discomfort or rises above 102°F (38.9°C) in adults.' },
      { question: 'How long is too long for a fever?', answer: 'A fever lasting more than 3 days in adults or any fever in infants under 3 months should prompt a doctor visit.' }
    ]
  },
  {
    slug: 'cough',
    name: 'Cough',
    metaTitle: 'Cough: Types, Causes & Effective Remedies',
    metaDescription: 'Understand different types of cough, from dry to productive. Learn causes, home remedies, and when a persistent cough needs medical evaluation.',
    category: 'Respiratory',
    overview: 'A cough is a reflex that helps clear the airways of irritants, mucus, and foreign particles. It can be acute (lasting less than 3 weeks), subacute (3-8 weeks), or chronic (more than 8 weeks). While coughing is a normal protective mechanism, a persistent or severe cough can indicate an underlying condition.\n\nCoughs are classified as productive (wet, producing mucus) or non-productive (dry). The type of cough, its duration, and accompanying symptoms can help identify the cause and guide treatment.',
    causes: [
      { title: 'Common Cold', description: 'Upper respiratory viral infections cause cough that may last 1-3 weeks, often with nasal congestion and sore throat.' },
      { title: 'Allergies', description: 'Exposure to allergens like pollen, dust, or pet dander can trigger a persistent dry cough and throat irritation.' },
      { title: 'Asthma', description: 'Airway inflammation and constriction can cause a chronic cough, especially at night or during exercise, often with wheezing.' },
      { title: 'Post-Nasal Drip', description: 'Mucus dripping from the sinuses into the throat causes a nagging cough, often worse when lying down.' },
      { title: 'Acid Reflux', description: 'Stomach acid irritating the throat can cause a chronic dry cough, especially after eating or at night.' },
      { title: 'Smoking', description: 'Chronic smoking irritates the airways, causing a persistent "smoker\'s cough" that typically produces mucus.' }
    ],
    whenToSeeDoctor: [
      'Cough lasting more than 3 weeks',
      'Coughing up blood or blood-tinged mucus',
      'Cough with high fever or difficulty breathing',
      'Wheezing or barking cough sounds',
      'Unexplained weight loss with persistent cough',
      'Cough that worsens despite home treatment'
    ],
    homeRemedies: [
      'Drink warm liquids like honey-lemon tea or broth',
      'Use a humidifier to add moisture to the air',
      'Honey (1-2 teaspoons) can soothe cough in adults and children over 1 year',
      'Gargle with warm salt water for throat irritation',
      'Elevate your head while sleeping to reduce post-nasal drip',
      'Avoid smoke, dust, and other irritants'
    ],
    relatedSymptoms: ['sore-throat', 'shortness-of-breath', 'chest-pain', 'fever'],
    relatedConditions: ['asthma', 'bronchitis', 'pneumonia'],
    relatedBlogs: ['persistent-cough-what-it-means-36'],
    specialtyRecommendation: 'Pulmonology',
    faq: [
      { question: 'How long should a cough last before seeing a doctor?', answer: 'See a doctor if a cough persists beyond 3 weeks, produces blood, or is accompanied by fever, weight loss, or difficulty breathing.' },
      { question: 'Is honey effective for cough?', answer: 'Yes, studies show honey can be as effective as some cough suppressants. Give 1-2 teaspoons directly or in warm water. Do not give honey to children under 1 year.' },
      { question: 'What is the difference between a dry and wet cough?', answer: 'A dry cough does not produce mucus and is often caused by allergies, asthma, or throat irritation. A wet cough produces phlegm and usually indicates an infection or excess mucus production.' }
    ]
  },
  {
    slug: 'back-pain',
    name: 'Back Pain',
    metaTitle: 'Back Pain: Causes, Prevention & Treatment Guide',
    metaDescription: 'Comprehensive guide to back pain causes, prevention strategies, home remedies, and when to seek medical treatment for upper and lower back pain.',
    category: 'Musculoskeletal',
    overview: 'Back pain is one of the most common reasons for doctor visits and missed work. It can range from a dull, constant ache to a sudden, sharp pain. Most back pain is mechanical in nature and improves with self-care within a few weeks.\n\nBack pain can affect the upper, middle, or lower back. Lower back pain is the most prevalent. Risk factors include age, lack of exercise, excess weight, poor posture, and occupational factors. Understanding these factors can help in both treatment and prevention.',
    causes: [
      { title: 'Muscle Strain', description: 'Lifting heavy objects, sudden movements, or poor posture can strain back muscles and ligaments, causing pain and stiffness.' },
      { title: 'Herniated Disc', description: 'A bulging or ruptured disc can press on spinal nerves, causing back pain that may radiate to the leg (sciatica).' },
      { title: 'Poor Posture', description: 'Prolonged sitting with poor posture, especially at a desk, puts excessive strain on the back muscles and spine.' },
      { title: 'Arthritis', description: 'Osteoarthritis can affect the lower back, and in some cases, spinal stenosis can put pressure on the spinal cord and nerves.' },
      { title: 'Osteoporosis', description: 'Weakened, porous bones can lead to compression fractures of the vertebrae, causing back pain especially in older adults.' },
      { title: 'Kidney Problems', description: 'Kidney stones or infections can cause pain in the flank area of the back, often with urinary symptoms.' }
    ],
    whenToSeeDoctor: [
      'Pain that persists beyond 6 weeks despite home treatment',
      'Severe pain that does not improve with rest',
      'Pain that radiates down one or both legs, especially below the knee',
      'Numbness, tingling, or weakness in the legs',
      'Back pain with fever, unexplained weight loss, or bowel/bladder problems',
      'Pain following a fall, injury, or accident'
    ],
    homeRemedies: [
      'Stay active with gentle movement; avoid prolonged bed rest',
      'Apply ice for the first 48 hours, then switch to heat',
      'Practice gentle stretches and back-strengthening exercises',
      'Maintain proper posture when sitting and standing',
      'Use a firm mattress and supportive pillow',
      'Take over-the-counter anti-inflammatory medications as directed'
    ],
    relatedSymptoms: ['neck-pain', 'leg-pain', 'numbness-tingling', 'muscle-stiffness'],
    relatedConditions: ['herniated-disc', 'sciatica', 'osteoarthritis'],
    relatedBlogs: ['back-pain-prevention-basics-47', 'office-ergonomics-to-prevent-pain-56'],
    specialtyRecommendation: 'Orthopedics',
    faq: [
      { question: 'How long does typical back pain last?', answer: 'Most acute back pain improves within 2-4 weeks with self-care. If pain persists beyond 6 weeks, it is considered subacute and may need professional evaluation.' },
      { question: 'Is bed rest good for back pain?', answer: 'Extended bed rest is not recommended. Brief rest (1-2 days) may help, but gentle activity and movement generally promote faster recovery.' },
      { question: 'Can poor posture cause chronic back pain?', answer: 'Yes, prolonged poor posture puts excessive stress on back muscles and spinal structures, which can lead to chronic pain over time.' }
    ]
  },
  {
    slug: 'sore-throat',
    name: 'Sore Throat',
    metaTitle: 'Sore Throat: Causes, Home Remedies & Treatment',
    metaDescription: 'Learn about sore throat causes from viral infections to strep throat. Discover effective home remedies and when antibiotics are needed.',
    category: 'ENT',
    overview: 'A sore throat is pain, scratchiness, or irritation in the throat that often worsens when swallowing. It is one of the most common reasons for medical visits, especially during cold and flu season. Most sore throats are caused by viral infections and resolve on their own.\n\nSore throats can be caused by infections (viral or bacterial), environmental factors, or other conditions. Identifying whether a sore throat is viral or bacterial is important because bacterial infections like strep throat may require antibiotic treatment.',
    causes: [
      { title: 'Viral Infections', description: 'Common cold, flu, and other viruses cause most sore throats, often with runny nose, cough, and mild fever.' },
      { title: 'Strep Throat', description: 'A bacterial infection by group A Streptococcus causes severe sore throat, high fever, and swollen lymph nodes without cough.' },
      { title: 'Allergies', description: 'Post-nasal drip from allergies can irritate the throat, causing persistent scratchiness and discomfort.' },
      { title: 'Dry Air', description: 'Breathing dry indoor air, especially during winter with heating systems, can make the throat feel rough and scratchy.' },
      { title: 'Voice Strain', description: 'Yelling, talking loudly for extended periods, or singing without proper technique can strain throat muscles.' },
      { title: 'Tonsillitis', description: 'Inflammation of the tonsils, usually from infection, causes sore throat, difficulty swallowing, and visibly swollen tonsils.' }
    ],
    whenToSeeDoctor: [
      'Sore throat lasting more than a week',
      'Difficulty swallowing or breathing',
      'High fever (above 101°F/38.3°C) with sore throat',
      'Swollen, tender lymph nodes in the neck',
      'White patches or pus on the tonsils',
      'Recurrent sore throats (more than 7 times in a year)'
    ],
    homeRemedies: [
      'Gargle with warm salt water (1/2 teaspoon salt in 8 oz water)',
      'Drink warm liquids like tea with honey',
      'Suck on ice chips, lozenges, or throat sprays',
      'Use a humidifier to moisten dry air',
      'Rest the voice and stay hydrated',
      'Take over-the-counter pain relievers as needed'
    ],
    relatedSymptoms: ['cough', 'fever', 'difficulty-swallowing', 'hoarseness'],
    relatedConditions: ['tonsillitis', 'pharyngitis', 'influenza'],
    relatedBlogs: [],
    specialtyRecommendation: 'ENT (Otolaryngology)',
    faq: [
      { question: 'How do I know if my sore throat is strep?', answer: 'Strep throat typically causes severe pain, high fever, and swollen lymph nodes WITHOUT cough or runny nose. A rapid strep test or throat culture at the doctor can confirm.' },
      { question: 'Do I need antibiotics for a sore throat?', answer: 'Only if caused by bacteria like strep. Most sore throats are viral and do not respond to antibiotics. A doctor can determine the cause.' },
      { question: 'How long does a sore throat usually last?', answer: 'Viral sore throats typically improve within 5-7 days. If it lasts more than a week or worsens, see a doctor.' }
    ]
  },
  {
    slug: 'fatigue',
    name: 'Fatigue',
    metaTitle: 'Fatigue: Why Am I Always Tired? Causes & Solutions',
    metaDescription: 'Explore reasons for constant tiredness including sleep issues, anemia, thyroid problems, and lifestyle factors. Get tips to boost your energy naturally.',
    category: 'General',
    overview: 'Fatigue is a persistent feeling of tiredness, exhaustion, or lack of energy that is not relieved by rest. It is different from normal drowsiness and can significantly impact daily activities, work performance, and quality of life.\n\nFatigue can be a symptom of many medical conditions or a result of lifestyle factors. It may be physical, mental, or a combination of both. When fatigue is persistent and unexplained, it warrants medical investigation to rule out underlying causes.',
    causes: [
      { title: 'Poor Sleep Quality', description: 'Insufficient or disrupted sleep, sleep apnea, or irregular sleep schedules are leading causes of fatigue.' },
      { title: 'Anemia', description: 'Low red blood cell count or hemoglobin reduces oxygen delivery to tissues, causing tiredness, weakness, and pallor.' },
      { title: 'Thyroid Disorders', description: 'Hypothyroidism (underactive thyroid) slows metabolism, causing fatigue, weight gain, and feeling cold.' },
      { title: 'Depression', description: 'Mental health conditions can cause overwhelming fatigue, loss of motivation, and difficulty concentrating.' },
      { title: 'Diabetes', description: 'Uncontrolled blood sugar levels can cause fatigue as the body cannot efficiently use glucose for energy.' },
      { title: 'Nutritional Deficiencies', description: 'Low levels of iron, vitamin B12, vitamin D, or other nutrients can cause persistent tiredness.' }
    ],
    whenToSeeDoctor: [
      'Fatigue lasting more than 2 weeks without improvement',
      'Tiredness severe enough to limit daily activities',
      'Fatigue with unexplained weight loss or gain',
      'Extreme fatigue with muscle weakness',
      'Fatigue accompanied by depression or anxiety',
      'Persistent tiredness despite adequate sleep'
    ],
    homeRemedies: [
      'Establish a consistent sleep schedule (7-9 hours)',
      'Exercise regularly, even moderate walking helps',
      'Eat a balanced diet rich in iron and B vitamins',
      'Stay well hydrated throughout the day',
      'Limit caffeine and avoid it after 2 PM',
      'Manage stress with meditation or relaxation techniques'
    ],
    relatedSymptoms: ['weakness', 'dizziness', 'difficulty-concentrating', 'body-aches'],
    relatedConditions: ['anemia', 'hypothyroidism', 'diabetes', 'depression'],
    relatedBlogs: ['daily-habits-for-better-sleep-15', 'stress-management-techniques-16'],
    specialtyRecommendation: 'Internal Medicine',
    faq: [
      { question: 'When is fatigue a sign of something serious?', answer: 'Fatigue lasting more than 2 weeks, especially with weight changes, fever, or unusual symptoms, may indicate an underlying condition and should be evaluated by a doctor.' },
      { question: 'Can exercise help with fatigue?', answer: 'Yes, regular moderate exercise actually boosts energy levels by improving circulation, sleep quality, and overall fitness. Start gently and increase gradually.' },
      { question: 'What blood tests should I get for fatigue?', answer: 'Common tests include complete blood count (CBC) for anemia, thyroid function tests, blood glucose, vitamin B12, vitamin D, and iron levels.' }
    ]
  },
  {
    slug: 'dizziness',
    name: 'Dizziness',
    metaTitle: 'Dizziness: Causes, Types & When to Seek Help',
    metaDescription: 'Understand why you feel dizzy — from vertigo and low blood pressure to inner ear issues. Learn home management tips and warning signs.',
    category: 'Neurological',
    overview: 'Dizziness is a term used to describe a range of sensations including feeling faint, lightheaded, unsteady, or a false sense of spinning (vertigo). It is a common symptom that usually is not a sign of anything serious, but recurring dizziness can affect quality of life.\n\nDizziness can be caused by problems in the inner ear, brain, or cardiovascular system. True vertigo — a spinning sensation — often points to inner ear conditions, while lightheadedness may be related to blood pressure or blood sugar changes.',
    causes: [
      { title: 'Benign Positional Vertigo (BPPV)', description: 'Small calcium crystals in the inner ear become dislodged, causing brief episodes of spinning with head position changes.' },
      { title: 'Low Blood Pressure', description: 'A sudden drop in blood pressure when standing up (orthostatic hypotension) can cause lightheadedness or fainting.' },
      { title: 'Dehydration', description: 'Insufficient fluid intake reduces blood volume, leading to lightheadedness, especially in hot weather or during exercise.' },
      { title: 'Inner Ear Infections', description: 'Viral or bacterial infections of the inner ear (labyrinthitis) can cause severe vertigo, nausea, and hearing changes.' },
      { title: 'Anemia', description: 'Low hemoglobin reduces oxygen to the brain, causing dizziness, especially with exertion or standing up quickly.' },
      { title: 'Anxiety', description: 'Hyperventilation and stress responses during anxiety can cause dizziness, lightheadedness, and a sense of unreality.' }
    ],
    whenToSeeDoctor: [
      'Dizziness with sudden severe headache',
      'Vertigo with hearing loss or ringing in the ears',
      'Dizziness with chest pain or shortness of breath',
      'Fainting or loss of consciousness',
      'Persistent dizziness lasting more than a few days',
      'Dizziness with numbness, weakness, or vision changes'
    ],
    homeRemedies: [
      'Sit or lie down immediately when feeling dizzy',
      'Stay well hydrated and avoid skipping meals',
      'Rise slowly from sitting or lying positions',
      'Avoid sudden head movements',
      'Practice balance exercises when feeling stable',
      'Reduce caffeine, alcohol, and salt intake'
    ],
    relatedSymptoms: ['nausea', 'headache', 'blurred-vision', 'fatigue'],
    relatedConditions: ['vertigo', 'anemia', 'hypertension'],
    relatedBlogs: ['dizziness-causes-and-care-41'],
    specialtyRecommendation: 'ENT / Neurology',
    faq: [
      { question: 'What is the difference between dizziness and vertigo?', answer: 'Dizziness is a general term for feeling unsteady or lightheaded. Vertigo is a specific type of dizziness where you feel a spinning or rotating sensation, often from inner ear problems.' },
      { question: 'Can dehydration cause dizziness?', answer: 'Yes, dehydration reduces blood volume and blood pressure, which can cause lightheadedness, especially when standing up.' },
      { question: 'Is dizziness a sign of a stroke?', answer: 'Sudden severe dizziness with numbness, speech difficulty, or vision changes can indicate a stroke. Call emergency services immediately if these occur.' }
    ]
  },
  {
    slug: 'shortness-of-breath',
    name: 'Shortness of Breath',
    metaTitle: 'Shortness of Breath: Causes & Warning Signs',
    metaDescription: 'Learn why you may feel breathless — from asthma to heart conditions. Understand when shortness of breath is an emergency requiring immediate care.',
    category: 'Respiratory',
    overview: 'Shortness of breath, medically called dyspnea, is the sensation of not being able to get enough air. It can feel like chest tightness, air hunger, or difficulty breathing. While it can occur normally during intense exercise, unexplained breathlessness at rest or during mild activity may signal a medical problem.\n\nShortness of breath can be caused by conditions affecting the lungs, heart, or other body systems. The onset pattern — sudden versus gradual — helps narrow down potential causes.',
    causes: [
      { title: 'Asthma', description: 'Airway inflammation and narrowing cause episodic breathlessness, often with wheezing, coughing, and chest tightness.' },
      { title: 'Heart Failure', description: 'A weakened heart cannot pump blood efficiently, causing fluid buildup in the lungs and progressive breathlessness.' },
      { title: 'Pneumonia', description: 'Lung infection fills air sacs with fluid, reducing oxygen exchange and causing breathlessness with fever and cough.' },
      { title: 'Anxiety', description: 'Panic attacks and severe anxiety can cause rapid, shallow breathing and a feeling of not getting enough air.' },
      { title: 'COPD', description: 'Chronic obstructive pulmonary disease, usually from smoking, causes progressive breathlessness and chronic cough.' },
      { title: 'Anemia', description: 'Low red blood cells reduce oxygen-carrying capacity, causing breathlessness especially during exertion.' }
    ],
    whenToSeeDoctor: [
      'Sudden, severe shortness of breath',
      'Breathlessness at rest or during minimal activity',
      'Shortness of breath with chest pain or pressure',
      'Waking up at night unable to breathe',
      'Lips or fingertips turning blue',
      'Progressive worsening of breathlessness over days or weeks'
    ],
    homeRemedies: [
      'Practice pursed-lip breathing: inhale through nose, exhale slowly through pursed lips',
      'Sit upright or lean forward to open airways',
      'Use a fan directed at the face for relief',
      'Avoid triggers such as smoke, dust, and allergens',
      'Maintain a healthy weight to reduce strain on the lungs',
      'Note: seek immediate care for sudden or severe breathlessness'
    ],
    relatedSymptoms: ['chest-pain', 'cough', 'wheezing', 'fatigue'],
    relatedConditions: ['asthma', 'copd', 'heart-failure', 'pneumonia'],
    relatedBlogs: ['shortness-of-breath-red-flags-38'],
    specialtyRecommendation: 'Pulmonology / Cardiology',
    faq: [
      { question: 'When is shortness of breath an emergency?', answer: 'Seek emergency care for sudden severe breathlessness, breathlessness with chest pain, bluish lips or fingers, or inability to speak due to breathing difficulty.' },
      { question: 'Can anxiety cause shortness of breath?', answer: 'Yes, anxiety and panic attacks often cause rapid breathing and a sensation of breathlessness. While not physically dangerous, it can be very distressing.' },
      { question: 'What is the best position for shortness of breath?', answer: 'Sitting upright or leaning forward with arms supported on a table can help open the airways and make breathing easier.' }
    ]
  },
  {
    slug: 'nausea',
    name: 'Nausea',
    metaTitle: 'Nausea: Common Causes & How to Feel Better',
    metaDescription: 'Discover what causes nausea from motion sickness to pregnancy. Learn effective remedies to stop feeling nauseous and when to see a doctor.',
    category: 'Digestive',
    overview: 'Nausea is an uneasy, queasy feeling in the stomach that often comes before vomiting. While it is very unpleasant, nausea itself is not a disease but a symptom of many different conditions. It can be brief or prolonged, and may or may not lead to vomiting.\n\nNausea can be triggered by problems in the digestive tract, inner ear, brain, or even psychological stress. It is one of the most common symptoms experienced by people of all ages.',
    causes: [
      { title: 'Food Poisoning', description: 'Eating contaminated food causes nausea, vomiting, and diarrhea, usually starting within hours of consumption.' },
      { title: 'Motion Sickness', description: 'Conflicting signals between the eyes and inner ear during travel cause nausea, dizziness, and sweating.' },
      { title: 'Pregnancy', description: 'Morning sickness causes nausea (with or without vomiting) during the first trimester, affecting up to 80% of pregnant women.' },
      { title: 'Gastroenteritis', description: 'Viral or bacterial stomach flu causes nausea, vomiting, diarrhea, and abdominal cramps.' },
      { title: 'Medications', description: 'Many medications, including antibiotics, painkillers, and chemotherapy drugs, can cause nausea as a side effect.' },
      { title: 'Migraine', description: 'Migraine headaches frequently include nausea and sometimes vomiting as prominent symptoms.' }
    ],
    whenToSeeDoctor: [
      'Nausea lasting more than 48 hours',
      'Signs of dehydration (dark urine, dizziness, dry mouth)',
      'Vomiting blood or material that looks like coffee grounds',
      'Severe abdominal pain accompanying nausea',
      'Nausea with high fever and stiff neck',
      'Inability to keep any fluids down for 12+ hours'
    ],
    homeRemedies: [
      'Sip ginger tea or chew small pieces of fresh ginger',
      'Eat small, bland meals (crackers, toast, rice)',
      'Avoid strong smells, greasy, or spicy foods',
      'Stay hydrated with clear fluids in small sips',
      'Try peppermint tea or inhale peppermint oil',
      'Rest in an upright or semi-reclined position'
    ],
    relatedSymptoms: ['vomiting', 'stomach-pain', 'dizziness', 'headache'],
    relatedConditions: ['gastritis', 'migraine', 'food-poisoning'],
    relatedBlogs: [],
    specialtyRecommendation: 'Gastroenterology',
    faq: [
      { question: 'What is the fastest way to relieve nausea?', answer: 'Ginger (tea or chewing raw), peppermint, and taking slow, deep breaths can provide quick relief. Sipping cold clear fluids and eating bland foods also helps.' },
      { question: 'Is nausea a sign of pregnancy?', answer: 'Nausea is a very common early pregnancy symptom, often starting around week 6. If you suspect pregnancy, take a home test or see a doctor.' },
      { question: 'Can anxiety cause nausea?', answer: 'Yes, stress and anxiety can trigger nausea through the gut-brain connection. Managing stress with deep breathing and relaxation can help.' }
    ]
  },
  {
    slug: 'joint-pain',
    name: 'Joint Pain',
    metaTitle: 'Joint Pain: Causes, Treatment & Relief Options',
    metaDescription: 'Understand joint pain causes from arthritis to injury. Learn about treatment options, exercises, and when to see a specialist for joint problems.',
    category: 'Musculoskeletal',
    overview: 'Joint pain refers to discomfort, aches, or soreness in any of the body\'s joints — areas where two or more bones meet. Joints allow movement and include the knees, hips, shoulders, elbows, wrists, and fingers. Joint pain can range from mildly irritating to debilitating.\n\nJoint pain becomes more common with age but can affect people of any age. It may result from injury, overuse, inflammation, or degenerative conditions. The pattern of joint involvement (single vs multiple joints, symmetric vs asymmetric) helps guide diagnosis.',
    causes: [
      { title: 'Osteoarthritis', description: 'Wear-and-tear breakdown of cartilage causes pain, stiffness, and swelling in weight-bearing joints, especially knees and hips.' },
      { title: 'Rheumatoid Arthritis', description: 'An autoimmune condition causing joint inflammation, pain, swelling, and stiffness, typically in multiple joints symmetrically.' },
      { title: 'Injury', description: 'Sprains, strains, and fractures can cause acute joint pain, swelling, and reduced mobility in the affected joint.' },
      { title: 'Gout', description: 'Uric acid crystal buildup in joints causes sudden, severe pain, redness, and swelling, often in the big toe.' },
      { title: 'Bursitis', description: 'Inflammation of the fluid-filled sacs (bursae) that cushion joints causes localized pain and tenderness.' },
      { title: 'Viral Infections', description: 'Some viral illnesses like dengue, chikungunya, and hepatitis can cause widespread joint pain and muscle aches.' }
    ],
    whenToSeeDoctor: [
      'Joint pain lasting more than 3 days',
      'Severe swelling, redness, or warmth around the joint',
      'Inability to move or bear weight on the joint',
      'Joint pain with fever',
      'Sudden onset of severe joint pain',
      'Joint deformity or visible changes in joint shape'
    ],
    homeRemedies: [
      'Rest the affected joint and avoid aggravating activities',
      'Apply ice for 15-20 minutes several times a day for swelling',
      'Use compression wraps and elevate the joint',
      'Take anti-inflammatory medications as directed',
      'Maintain a healthy weight to reduce joint stress',
      'Practice gentle range-of-motion exercises when tolerated'
    ],
    relatedSymptoms: ['muscle-stiffness', 'swelling', 'back-pain', 'fatigue'],
    relatedConditions: ['osteoarthritis', 'rheumatoid-arthritis', 'gout'],
    relatedBlogs: [],
    specialtyRecommendation: 'Rheumatology / Orthopedics',
    faq: [
      { question: 'What is the most common cause of joint pain?', answer: 'Osteoarthritis is the most common cause, affecting millions worldwide. It results from gradual cartilage wear and is more common with age, obesity, and prior joint injury.' },
      { question: 'Can exercise help joint pain?', answer: 'Yes, regular low-impact exercise (swimming, walking, cycling) strengthens muscles around joints, improves flexibility, and can reduce pain.' },
      { question: 'When should joint pain be checked by a doctor?', answer: 'See a doctor if joint pain is severe, persists beyond a few days, involves swelling or redness, or is accompanied by fever.' }
    ]
  },
  {
    slug: 'skin-rash',
    name: 'Skin Rash',
    metaTitle: 'Skin Rash: Types, Causes & Treatment Guide',
    metaDescription: 'Identify common skin rashes including eczema, allergic reactions, and infections. Learn causes, home remedies, and when to consult a dermatologist.',
    category: 'Skin',
    overview: 'A skin rash is a change in the color, texture, or appearance of the skin. Rashes can be localized to one area or widespread across the body. They may be flat, raised, bumpy, scaly, blistered, or ulcerated, and may or may not be itchy or painful.\n\nSkin rashes have numerous causes including infections, allergies, autoimmune conditions, and irritants. Identifying the pattern, distribution, and associated symptoms helps determine the cause and appropriate treatment.',
    causes: [
      { title: 'Allergic Reaction', description: 'Contact with allergens (plants, chemicals, metals) or ingested allergens can cause itchy, red rashes or hives.' },
      { title: 'Eczema (Dermatitis)', description: 'Chronic skin condition causing dry, itchy, inflamed patches, often on the hands, face, and inside elbows and knees.' },
      { title: 'Fungal Infections', description: 'Ringworm, athlete\'s foot, and yeast infections cause red, scaly, or ring-shaped rashes in warm, moist areas.' },
      { title: 'Viral Infections', description: 'Chickenpox, measles, and other viral illnesses cause characteristic rashes as part of the infection.' },
      { title: 'Heat Rash', description: 'Blocked sweat ducts in hot, humid weather cause small, itchy bumps, especially in skin folds.' },
      { title: 'Psoriasis', description: 'An autoimmune condition causing thick, scaly, silvery patches on the skin, often on elbows, knees, and scalp.' }
    ],
    whenToSeeDoctor: [
      'Rash spreading rapidly or covering a large body area',
      'Rash with fever, joint pain, or difficulty breathing',
      'Blistering or open sores that may be infected',
      'Rash that does not improve after 1-2 weeks of home care',
      'Rash with swelling of the face, lips, or throat (allergic emergency)',
      'Painful rash following a line or band on one side (possible shingles)'
    ],
    homeRemedies: [
      'Apply cool, wet compresses to soothe irritation',
      'Use fragrance-free moisturizers for dry, itchy skin',
      'Take oatmeal baths for widespread itching',
      'Avoid scratching to prevent infection',
      'Wear loose, breathable clothing',
      'Use over-the-counter hydrocortisone cream for mild rashes'
    ],
    relatedSymptoms: ['itching', 'swelling', 'fever', 'skin-dryness'],
    relatedConditions: ['eczema', 'psoriasis', 'urticaria'],
    relatedBlogs: ['sun-safety-and-skin-care-20', 'allergy-season-preparation-tips-57'],
    specialtyRecommendation: 'Dermatology',
    faq: [
      { question: 'How can I tell if a rash is serious?', answer: 'Seek immediate care if a rash is accompanied by fever, spreads rapidly, causes difficulty breathing, or involves blistering. A rash with swelling of the face or throat is an emergency.' },
      { question: 'Can stress cause skin rashes?', answer: 'Yes, stress can trigger or worsen skin conditions like eczema, hives, and psoriasis by affecting the immune system and skin barrier function.' },
      { question: 'When should I see a dermatologist for a rash?', answer: 'See a dermatologist if the rash persists beyond 2 weeks, keeps coming back, is painful, or does not respond to over-the-counter treatments.' }
    ]
  },
  {
    slug: 'difficulty-swallowing',
    name: 'Difficulty Swallowing',
    metaTitle: 'Difficulty Swallowing (Dysphagia): Causes & Care',
    metaDescription: 'Understand why swallowing may be difficult or painful. Learn about causes from throat infections to esophageal conditions and when to seek care.',
    category: 'ENT',
    overview: 'Difficulty swallowing, medically known as dysphagia, is the sensation that food or liquid is stuck in the throat or chest, or that swallowing requires extra effort. Occasional difficulty swallowing from eating too fast is normal, but persistent dysphagia may indicate a medical condition.\n\nDysphagia can occur at two levels: oropharyngeal (throat) or esophageal (food tube). The location and pattern of difficulty helps identify the cause and guide treatment.',
    causes: [
      { title: 'Throat Infections', description: 'Severe tonsillitis, pharyngitis, or peritonsillar abscess can cause significant pain and difficulty swallowing.' },
      { title: 'GERD', description: 'Chronic acid reflux can cause esophageal inflammation and narrowing, making swallowing progressively difficult.' },
      { title: 'Esophageal Stricture', description: 'Scarring or narrowing of the esophagus from chronic inflammation restricts the passage of food.' },
      { title: 'Muscle or Nerve Disorders', description: 'Conditions affecting the muscles or nerves controlling swallowing (stroke, Parkinson\'s) can impair the swallowing process.' },
      { title: 'Anxiety', description: 'The sensation of a lump in the throat (globus sensation) from anxiety can feel like difficulty swallowing.' },
      { title: 'Allergic Esophagitis', description: 'Allergic inflammation of the esophagus can cause food impaction and difficulty swallowing solid foods.' }
    ],
    whenToSeeDoctor: [
      'Persistent difficulty swallowing lasting more than 2 weeks',
      'Complete inability to swallow food or liquids',
      'Unintentional weight loss due to swallowing difficulty',
      'Pain when swallowing that is getting worse',
      'Feeling of food getting stuck regularly',
      'Difficulty swallowing with voice changes or coughing during eating'
    ],
    homeRemedies: [
      'Eat slowly and chew food thoroughly',
      'Cut food into small pieces and choose softer textures',
      'Drink plenty of water with meals',
      'Sit upright while eating and for 30 minutes after',
      'Avoid eating close to bedtime',
      'For GERD-related symptoms, avoid acidic and spicy foods'
    ],
    relatedSymptoms: ['sore-throat', 'chest-pain', 'heartburn', 'hoarseness'],
    relatedConditions: ['gerd', 'tonsillitis', 'esophageal-stricture'],
    relatedBlogs: [],
    specialtyRecommendation: 'Gastroenterology / ENT',
    faq: [
      { question: 'Is difficulty swallowing a sign of cancer?', answer: 'While most causes of dysphagia are benign, persistent or progressive difficulty swallowing should be evaluated to rule out esophageal or throat conditions.' },
      { question: 'Can anxiety cause difficulty swallowing?', answer: 'Yes, anxiety can cause a globus sensation — a feeling of a lump in the throat — which can feel like difficulty swallowing even when no physical obstruction exists.' },
      { question: 'What tests are done for swallowing problems?', answer: 'Common tests include barium swallow X-ray, upper endoscopy, and swallowing studies to evaluate the structure and function of the throat and esophagus.' }
    ]
  },
  {
    slug: 'palpitations',
    name: 'Heart Palpitations',
    metaTitle: 'Heart Palpitations: Causes & When to Worry',
    metaDescription: 'Learn why your heart may race, flutter, or skip beats. Understand common causes of palpitations and when they indicate a heart problem.',
    category: 'Cardiovascular',
    overview: 'Heart palpitations are feelings of having a rapid, fluttering, or pounding heart. They can feel like the heart is beating too fast, too hard, skipping beats, or flip-flopping. Palpitations can be felt in the chest, throat, or neck.\n\nMost heart palpitations are harmless and resolve on their own. They can be triggered by stress, exercise, caffeine, or medications. However, some palpitations may indicate an underlying heart rhythm disorder that needs evaluation.',
    causes: [
      { title: 'Stress and Anxiety', description: 'Emotional stress and anxiety trigger adrenaline release, which can cause a racing or pounding heartbeat.' },
      { title: 'Caffeine and Stimulants', description: 'Coffee, energy drinks, nicotine, and some medications can stimulate the heart and cause palpitations.' },
      { title: 'Exercise', description: 'Physical activity naturally increases heart rate and can cause awareness of heartbeat, especially in unfit individuals.' },
      { title: 'Arrhythmias', description: 'Abnormal heart rhythms such as atrial fibrillation or supraventricular tachycardia cause irregular or rapid heartbeats.' },
      { title: 'Thyroid Disorders', description: 'Hyperthyroidism (overactive thyroid) speeds up metabolism and heart rate, causing palpitations and tremor.' },
      { title: 'Hormonal Changes', description: 'Pregnancy, menstruation, and menopause can trigger palpitations due to hormonal fluctuations.' }
    ],
    whenToSeeDoctor: [
      'Palpitations lasting more than a few minutes',
      'Palpitations with dizziness, fainting, or near-fainting',
      'Palpitations with chest pain or shortness of breath',
      'New palpitations with a history of heart disease',
      'Very rapid heartbeat (above 150 beats per minute at rest)',
      'Palpitations becoming more frequent or severe over time'
    ],
    homeRemedies: [
      'Practice deep, slow breathing to calm the nervous system',
      'Reduce or eliminate caffeine intake',
      'Manage stress with meditation or yoga',
      'Stay well hydrated',
      'Avoid alcohol and nicotine',
      'Keep a log of triggers and episodes to share with your doctor'
    ],
    relatedSymptoms: ['chest-pain', 'dizziness', 'shortness-of-breath', 'fatigue'],
    relatedConditions: ['atrial-fibrillation', 'hyperthyroidism', 'anxiety-disorders'],
    relatedBlogs: ['mens-heart-health-essentials-22'],
    specialtyRecommendation: 'Cardiology',
    faq: [
      { question: 'Are heart palpitations dangerous?', answer: 'Most palpitations are harmless. However, palpitations with fainting, chest pain, or severe breathlessness may indicate a heart rhythm problem and need medical evaluation.' },
      { question: 'Can caffeine cause palpitations?', answer: 'Yes, caffeine is a common trigger. Reducing coffee, tea, energy drinks, and chocolate may decrease palpitation frequency.' },
      { question: 'What tests are done for palpitations?', answer: 'An ECG (electrocardiogram) records heart rhythm. A Holter monitor records it over 24-48 hours. Blood tests check thyroid function and electrolytes.' }
    ]
  },
  {
    slug: 'bloating',
    name: 'Bloating',
    metaTitle: 'Bloating: Causes, Prevention & Quick Relief Tips',
    metaDescription: 'Find out what causes abdominal bloating and gas. Get practical tips for prevention and relief, and learn when bloating may need medical attention.',
    category: 'Digestive',
    overview: 'Bloating is a feeling of fullness, tightness, or swelling in the abdomen. It is extremely common and is usually caused by excess gas production, disturbances in the movement of digestive muscles, or increased sensitivity to gas in the gut.\n\nWhile bloating is usually harmless and temporary, chronic or severe bloating can impact quality of life and may sometimes indicate an underlying digestive condition that warrants medical evaluation.',
    causes: [
      { title: 'Swallowing Air', description: 'Eating too fast, chewing gum, or drinking carbonated beverages leads to swallowing air, which accumulates in the digestive tract.' },
      { title: 'Gas-Producing Foods', description: 'Beans, lentils, broccoli, onions, and whole grains are common foods that produce excess gas during digestion.' },
      { title: 'Food Intolerance', description: 'Lactose intolerance, gluten sensitivity, or fructose malabsorption can cause bloating after eating trigger foods.' },
      { title: 'Constipation', description: 'Infrequent bowel movements allow gas to build up behind stool, causing abdominal bloating and discomfort.' },
      { title: 'IBS', description: 'Irritable bowel syndrome causes bloating, gas, and altered bowel habits due to gut hypersensitivity.' },
      { title: 'Hormonal Changes', description: 'Many women experience bloating during menstruation due to water retention and hormonal fluctuations.' }
    ],
    whenToSeeDoctor: [
      'Bloating that persists daily for more than 2 weeks',
      'Bloating with unexplained weight loss',
      'Severe abdominal pain with bloating',
      'Blood in the stool',
      'Bloating that worsens over time rather than improving',
      'Bloating with nausea, vomiting, or inability to pass gas'
    ],
    homeRemedies: [
      'Eat slowly and chew food thoroughly',
      'Avoid carbonated drinks and chewing gum',
      'Identify and limit gas-producing foods',
      'Walk for 10-15 minutes after meals',
      'Try peppermint tea or ginger to ease gas',
      'Consider a low-FODMAP diet if bloating is chronic'
    ],
    relatedSymptoms: ['stomach-pain', 'gas', 'constipation', 'nausea'],
    relatedConditions: ['irritable-bowel-syndrome', 'celiac-disease', 'lactose-intolerance'],
    relatedBlogs: ['fiber-rich-foods-for-gut-health-33'],
    specialtyRecommendation: 'Gastroenterology',
    faq: [
      { question: 'Why do I feel bloated after every meal?', answer: 'Eating too fast, food intolerances (lactose, gluten), or IBS are common reasons. Keep a food diary to identify triggers and consider seeing a gastroenterologist.' },
      { question: 'Does drinking water help with bloating?', answer: 'Yes, staying hydrated helps digestion and can reduce bloating, especially bloating caused by water retention or constipation.' },
      { question: 'Can bloating be a sign of something serious?', answer: 'Persistent bloating with weight loss, pain, or blood in stool should be evaluated. In rare cases, it may indicate ovarian cancer or other conditions.' }
    ]
  },
  {
    slug: 'insomnia',
    name: 'Insomnia',
    metaTitle: 'Insomnia: Causes, Tips & Treatment for Better Sleep',
    metaDescription: 'Struggling to sleep? Learn about insomnia causes, proven sleep hygiene tips, and when to consult a doctor for chronic sleep problems.',
    category: 'Neurological',
    overview: 'Insomnia is a common sleep disorder characterized by difficulty falling asleep, staying asleep, or waking up too early and not being able to get back to sleep. It can be acute (short-term, lasting days to weeks) or chronic (occurring at least 3 nights per week for 3 months or more).\n\nInsomnia affects daytime functioning, causing fatigue, difficulty concentrating, mood disturbances, and decreased performance. It is both a symptom and a condition, as it can exist independently or result from other medical or psychological conditions.',
    causes: [
      { title: 'Stress and Anxiety', description: 'Worrying about work, finances, health, or relationships is the most common cause of acute insomnia.' },
      { title: 'Poor Sleep Habits', description: 'Irregular sleep schedules, screen time before bed, and uncomfortable sleep environments disrupt sleep patterns.' },
      { title: 'Caffeine and Stimulants', description: 'Consuming caffeine, nicotine, or alcohol too close to bedtime can interfere with falling or staying asleep.' },
      { title: 'Medical Conditions', description: 'Chronic pain, asthma, GERD, and neurological conditions can make it difficult to sleep comfortably.' },
      { title: 'Medications', description: 'Certain medications for asthma, blood pressure, allergies, and depression can cause insomnia as a side effect.' },
      { title: 'Mental Health Disorders', description: 'Depression, anxiety, and PTSD are strongly associated with sleep disturbances and chronic insomnia.' }
    ],
    whenToSeeDoctor: [
      'Insomnia lasting more than 4 weeks',
      'Sleep problems significantly affecting daytime function',
      'Reliance on sleep medications to fall asleep',
      'Insomnia with depression, anxiety, or mood changes',
      'Loud snoring or breathing pauses during sleep (possible sleep apnea)',
      'Daytime sleepiness severe enough to be dangerous (e.g., while driving)'
    ],
    homeRemedies: [
      'Keep a consistent sleep and wake time, even on weekends',
      'Create a dark, cool, quiet bedroom environment',
      'Avoid screens for at least 30 minutes before bed',
      'Limit caffeine after noon and alcohol before bed',
      'Practice relaxation techniques like deep breathing or meditation',
      'Exercise regularly, but not within 2-3 hours of bedtime'
    ],
    relatedSymptoms: ['fatigue', 'difficulty-concentrating', 'headache', 'irritability'],
    relatedConditions: ['anxiety-disorders', 'depression', 'sleep-apnea'],
    relatedBlogs: ['daily-habits-for-better-sleep-15', 'healthy-sleep-for-shift-workers-21'],
    specialtyRecommendation: 'Sleep Medicine / Psychiatry',
    faq: [
      { question: 'How many hours of sleep do I need?', answer: 'Most adults need 7-9 hours of sleep per night. Quality matters as much as quantity — uninterrupted, deep sleep is essential for health.' },
      { question: 'Is melatonin safe for insomnia?', answer: 'Melatonin is generally safe for short-term use and can help with jet lag or shift work. Consult a doctor before long-term use, especially for children.' },
      { question: 'Can insomnia be cured?', answer: 'Yes, many cases of insomnia improve with cognitive behavioral therapy for insomnia (CBT-I), sleep hygiene changes, and addressing underlying causes.' }
    ]
  },
  {
    slug: 'body-aches',
    name: 'Body Aches',
    metaTitle: 'Body Aches: Why Does My Whole Body Hurt?',
    metaDescription: 'Discover causes of body-wide aches from flu and overexertion to fibromyalgia. Learn effective relief strategies and when to see a doctor.',
    category: 'General',
    overview: 'Body aches are feelings of pain, soreness, or discomfort throughout the body. Almost everyone experiences body aches at some point, often during illness or after physical exertion. They can range from mild discomfort to severe pain affecting daily activities.\n\nBody aches are usually a sign that the body is fighting an infection or recovering from physical stress. However, persistent body aches without a clear cause may indicate a chronic condition that needs evaluation.',
    causes: [
      { title: 'Viral Infections', description: 'Influenza, COVID-19, dengue, and other viral infections commonly cause widespread body aches as part of the immune response.' },
      { title: 'Overexertion', description: 'Intense exercise, heavy lifting, or unaccustomed physical activity can cause delayed-onset muscle soreness (DOMS).' },
      { title: 'Fibromyalgia', description: 'A chronic condition causing widespread muscle pain, fatigue, and tenderness without visible inflammation.' },
      { title: 'Dehydration', description: 'Not drinking enough water can lead to muscle cramps and body-wide aches.' },
      { title: 'Stress', description: 'Chronic stress causes muscle tension and can produce widespread aches, particularly in the neck, shoulders, and back.' },
      { title: 'Vitamin D Deficiency', description: 'Low vitamin D levels are associated with bone and muscle pain, fatigue, and weakness.' }
    ],
    whenToSeeDoctor: [
      'Body aches lasting more than 2 weeks without improvement',
      'Severe pain that limits mobility',
      'Body aches with high fever or rash',
      'Aches with significant swelling or joint redness',
      'Body aches with numbness or weakness',
      'Unexplained body aches with fatigue and weight changes'
    ],
    homeRemedies: [
      'Rest and allow the body time to recover',
      'Stay hydrated with water and electrolyte drinks',
      'Take warm baths or apply heat pads to sore areas',
      'Use over-the-counter anti-inflammatory medications',
      'Gentle stretching and light movement can ease stiffness',
      'Ensure adequate sleep for recovery'
    ],
    relatedSymptoms: ['fatigue', 'fever', 'headache', 'joint-pain'],
    relatedConditions: ['influenza', 'fibromyalgia', 'vitamin-d-deficiency'],
    relatedBlogs: [],
    specialtyRecommendation: 'Internal Medicine / Rheumatology',
    faq: [
      { question: 'Why does the flu cause body aches?', answer: 'When fighting infection, the immune system releases chemicals called cytokines that cause inflammation and pain receptors to activate, resulting in widespread aching.' },
      { question: 'Can dehydration cause body aches?', answer: 'Yes, dehydration can cause muscle cramps and body aches. Staying hydrated is essential, especially during illness or hot weather.' },
      { question: 'When are body aches a sign of something serious?', answer: 'Persistent body aches with fever, weight loss, night sweats, or weakness lasting more than 2 weeks should be evaluated by a doctor.' }
    ]
  },
  {
    slug: 'constipation',
    name: 'Constipation',
    metaTitle: 'Constipation: Causes, Natural Remedies & Prevention',
    metaDescription: 'Understand what causes constipation and how to relieve it naturally with diet changes, hydration, and exercise. Know when to consult a doctor.',
    category: 'Digestive',
    overview: 'Constipation is a common condition in which bowel movements become infrequent (fewer than three per week) or difficult to pass. Stools are often hard, dry, and small. Constipation can cause straining, bloating, and a feeling of incomplete evacuation.\n\nWhile occasional constipation is very common and usually harmless, chronic constipation can interfere with daily life. Most cases respond well to dietary and lifestyle changes.',
    causes: [
      { title: 'Low Fiber Diet', description: 'Not eating enough fruits, vegetables, and whole grains leads to harder stools that are difficult to pass.' },
      { title: 'Inadequate Hydration', description: 'Not drinking enough water results in harder, drier stools as the colon absorbs more water from waste.' },
      { title: 'Sedentary Lifestyle', description: 'Lack of physical activity slows digestion and reduces bowel motility, contributing to constipation.' },
      { title: 'Medications', description: 'Opioid pain medications, antacids with calcium or aluminum, and some antidepressants can cause constipation.' },
      { title: 'Ignoring the Urge', description: 'Regularly postponing bowel movements can weaken the reflex over time and lead to chronic constipation.' },
      { title: 'IBS', description: 'Irritable bowel syndrome with constipation (IBS-C) causes chronic constipation with abdominal pain and bloating.' }
    ],
    whenToSeeDoctor: [
      'No bowel movement for more than 7 days',
      'Severe abdominal pain with constipation',
      'Blood in or on the stool',
      'Constipation alternating with diarrhea',
      'Unexplained weight loss with constipation',
      'Constipation not improving with dietary changes after 3 weeks'
    ],
    homeRemedies: [
      'Eat more fiber-rich foods: fruits, vegetables, beans, and whole grains',
      'Drink at least 8 glasses of water daily',
      'Exercise regularly — even daily walking helps',
      'Respond to the urge promptly, do not delay',
      'Try warm liquids in the morning to stimulate bowel activity',
      'Consider a fiber supplement if dietary fiber is insufficient'
    ],
    relatedSymptoms: ['bloating', 'stomach-pain', 'nausea', 'loss-of-appetite'],
    relatedConditions: ['irritable-bowel-syndrome', 'hypothyroidism', 'hemorrhoids'],
    relatedBlogs: ['fiber-rich-foods-for-gut-health-33'],
    specialtyRecommendation: 'Gastroenterology',
    faq: [
      { question: 'How often should you have a bowel movement?', answer: 'Normal frequency ranges from three times a day to three times a week. Fewer than three times a week is generally considered constipation.' },
      { question: 'What is the best natural remedy for constipation?', answer: 'Increasing fiber intake (25-30g daily), drinking plenty of water, and regular exercise are the most effective natural approaches.' },
      { question: 'Can constipation cause other health problems?', answer: 'Chronic constipation can lead to hemorrhoids, anal fissures, and in rare cases, fecal impaction. It can also worsen bloating and abdominal discomfort.' }
    ]
  },
  {
    slug: 'eye-strain',
    name: 'Eye Strain',
    metaTitle: 'Eye Strain: Symptoms, Digital Screen Tips & Relief',
    metaDescription: 'Learn how to prevent and relieve eye strain from screens, reading, and driving. Practical tips for digital eye health and when to see an eye doctor.',
    category: 'Eye',
    overview: 'Eye strain (asthenopia) is a common condition that occurs when the eyes become tired from intense use, such as prolonged screen time, reading, or driving long distances. While uncomfortable, eye strain is not usually serious and typically resolves with rest.\n\nWith the increasing use of digital devices, a specific form called digital eye strain or computer vision syndrome has become very common, affecting up to 90% of people who use computers for extended periods.',
    causes: [
      { title: 'Prolonged Screen Use', description: 'Staring at computers, phones, or tablets for long periods reduces blink rate and strains the focusing muscles of the eyes.' },
      { title: 'Poor Lighting', description: 'Reading or working in either too dim or too bright lighting forces the eyes to work harder, causing strain.' },
      { title: 'Uncorrected Vision', description: 'Needing glasses or an updated prescription causes the eyes to strain to focus, leading to headaches and fatigue.' },
      { title: 'Dry Eyes', description: 'Reduced blinking during screen use or dry environments causes eye dryness, irritation, and discomfort.' },
      { title: 'Improper Screen Distance', description: 'Holding screens too close or sitting too far from monitors forces eyes into unnatural focusing positions.' },
      { title: 'Driving Long Distances', description: 'Extended driving, especially at night with oncoming headlights, can cause significant eye fatigue.' }
    ],
    whenToSeeDoctor: [
      'Eye strain that does not improve with rest',
      'Persistent headaches associated with vision use',
      'Blurred or double vision',
      'Significant eye pain or redness',
      'Changes in vision clarity',
      'Eye strain causing difficulty with daily tasks'
    ],
    homeRemedies: [
      'Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds',
      'Adjust screen brightness to match surrounding light',
      'Position screen at arm\'s length, slightly below eye level',
      'Use artificial tears for dry eye relief',
      'Blink frequently, especially during screen use',
      'Take regular breaks from close-up work'
    ],
    relatedSymptoms: ['headache', 'blurred-vision', 'neck-pain', 'dry-eyes'],
    relatedConditions: ['dry-eye-syndrome', 'myopia', 'computer-vision-syndrome'],
    relatedBlogs: ['screen-time-balance-for-kids-7'],
    specialtyRecommendation: 'Ophthalmology / Optometry',
    faq: [
      { question: 'Can screen time damage your eyes permanently?', answer: 'Screen use does not cause permanent eye damage, but prolonged use can cause digital eye strain with discomfort, dryness, and headaches. Taking breaks prevents symptoms.' },
      { question: 'What is the 20-20-20 rule?', answer: 'Every 20 minutes, look at something 20 feet away for 20 seconds. This relaxes the focusing muscles of the eyes and reduces strain.' },
      { question: 'Do blue light glasses help with eye strain?', answer: 'Research on blue light glasses is mixed. Adjusting screen brightness, following the 20-20-20 rule, and proper lighting may be more effective.' }
    ]
  },
  {
    slug: 'frequent-urination',
    name: 'Frequent Urination',
    metaTitle: 'Frequent Urination: Causes & When to See a Doctor',
    metaDescription: 'Learn why you may be urinating more often than usual. Understand causes from UTIs to diabetes, and when frequent urination needs medical evaluation.',
    category: 'Urological',
    overview: 'Frequent urination means needing to urinate more often than usual. Most people urinate 6-8 times in 24 hours. Urinating more than 8 times during the day or waking up more than once at night to urinate may be considered frequent.\n\nFrequent urination can be a symptom of many conditions, from minor issues like excessive fluid intake to more significant conditions like diabetes or urinary tract infections. It can disrupt sleep, work, and daily activities.',
    causes: [
      { title: 'Urinary Tract Infection (UTI)', description: 'Bacterial infection of the urinary tract causes frequent, urgent, and sometimes painful urination, often with burning sensation.' },
      { title: 'Diabetes', description: 'High blood sugar causes the kidneys to produce more urine, leading to frequent urination and excessive thirst.' },
      { title: 'Excessive Fluid Intake', description: 'Drinking large amounts of water, coffee, tea, or alcohol naturally increases urination frequency.' },
      { title: 'Overactive Bladder', description: 'The bladder contracts involuntarily, causing sudden urges to urinate frequently, even when the bladder is not full.' },
      { title: 'Prostate Problems', description: 'In men, an enlarged prostate can press on the urethra and bladder, causing frequent urination, especially at night.' },
      { title: 'Pregnancy', description: 'The growing uterus puts pressure on the bladder, causing more frequent urination, especially in the first and third trimesters.' }
    ],
    whenToSeeDoctor: [
      'Urinating much more frequently than normal without increased fluid intake',
      'Frequent urination with pain, burning, or blood in urine',
      'Waking up more than twice per night to urinate',
      'Frequent urination with excessive thirst and unexplained weight loss',
      'Difficulty starting or stopping urine stream',
      'Incontinence or inability to control urination'
    ],
    homeRemedies: [
      'Track fluid intake and reduce excessive consumption',
      'Limit caffeine and alcohol, which increase urine production',
      'Practice bladder training: gradually extend time between bathroom visits',
      'Do Kegel exercises to strengthen pelvic floor muscles',
      'Avoid fluids 2-3 hours before bedtime to reduce nighttime trips',
      'If UTI is suspected, drink cranberry juice and see a doctor for antibiotics'
    ],
    relatedSymptoms: ['painful-urination', 'thirst', 'fatigue', 'lower-abdominal-pain'],
    relatedConditions: ['diabetes', 'urinary-tract-infection', 'enlarged-prostate'],
    relatedBlogs: ['type-2-diabetes-early-signs-10'],
    specialtyRecommendation: 'Urology / Endocrinology',
    faq: [
      { question: 'How many times a day is too many to urinate?', answer: 'Urinating more than 8 times during the day or waking more than once at night is generally considered frequent and may warrant evaluation.' },
      { question: 'Can frequent urination be a sign of diabetes?', answer: 'Yes, frequent urination with excessive thirst and unexplained weight loss are classic signs of diabetes. A simple blood test can check blood sugar levels.' },
      { question: 'Is frequent urination normal during pregnancy?', answer: 'Yes, it is very common, especially in the first and third trimesters, due to hormonal changes and the growing uterus pressing on the bladder.' }
    ]
  }
];

export const getSymptomBySlug = (slug: string): SymptomEntry | undefined => {
  return symptoms.find(s => s.slug === slug);
};

export const getSymptomsByCategory = (category: string): SymptomEntry[] => {
  return symptoms.filter(s => s.category === category);
};

export const getSymptomCategories = (): string[] => {
  return [...new Set(symptoms.map(s => s.category))];
};
