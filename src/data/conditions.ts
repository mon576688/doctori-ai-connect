export interface ConditionEntry {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  riskFactors: string[];
  diagnosis: string;
  treatment: string;
  prevention: string[];
  whenToSeeDoctor: string[];
  relatedSymptoms: string[];
  relatedConditions: string[];
  relatedBlogs: string[];
  faq: { question: string; answer: string }[];
}

export const conditions: ConditionEntry[] = [
  {
    slug: 'diabetes',
    name: 'Diabetes',
    metaTitle: 'Diabetes: Types, Symptoms, Treatment & Prevention',
    metaDescription: 'Comprehensive guide to diabetes including Type 1, Type 2, and gestational diabetes. Learn about symptoms, blood sugar management, and prevention strategies.',
    category: 'Endocrine',
    overview: 'Diabetes mellitus is a group of metabolic diseases characterized by high blood sugar (glucose) levels over a prolonged period. It occurs when the pancreas does not produce enough insulin, or when the body cannot effectively use the insulin it produces. Left unmanaged, diabetes can lead to serious complications affecting the heart, kidneys, eyes, and nerves.\n\nType 2 diabetes accounts for about 90-95% of all diabetes cases and is largely preventable through healthy lifestyle choices. Early detection and proper management can significantly reduce the risk of complications.',
    symptoms: [
      'Frequent urination (polyuria)',
      'Excessive thirst (polydipsia)',
      'Unexplained weight loss',
      'Increased hunger',
      'Fatigue and weakness',
      'Blurred vision',
      'Slow-healing wounds',
      'Numbness or tingling in hands or feet'
    ],
    causes: [
      'Type 1: Autoimmune destruction of insulin-producing cells in the pancreas',
      'Type 2: Insulin resistance combined with progressive decline in insulin production',
      'Gestational: Hormonal changes during pregnancy affecting insulin function',
      'Genetic predisposition and family history'
    ],
    riskFactors: [
      'Family history of diabetes',
      'Obesity or overweight (especially abdominal fat)',
      'Sedentary lifestyle',
      'Age over 45 years',
      'History of gestational diabetes',
      'Polycystic ovary syndrome (PCOS)',
      'High blood pressure or high cholesterol'
    ],
    diagnosis: 'Diabetes is diagnosed through blood tests including fasting blood glucose (≥126 mg/dL), oral glucose tolerance test (≥200 mg/dL at 2 hours), HbA1c test (≥6.5%), or random blood glucose (≥200 mg/dL with symptoms). Pre-diabetes is identified when levels are above normal but below diabetic thresholds.',
    treatment: 'Type 1 diabetes requires insulin therapy. Type 2 diabetes management includes lifestyle modifications (diet, exercise, weight loss), oral medications (metformin is first-line), and insulin if needed. Regular blood sugar monitoring, foot care, and screening for complications are essential components of management.',
    prevention: [
      'Maintain a healthy weight',
      'Exercise at least 150 minutes per week',
      'Eat a balanced diet rich in fiber and low in processed foods',
      'Limit sugary drinks and refined carbohydrates',
      'Get regular blood sugar screenings after age 45',
      'Manage stress and get adequate sleep'
    ],
    whenToSeeDoctor: [
      'Experiencing symptoms like excessive thirst, frequent urination, or unexplained weight loss',
      'Blood sugar readings consistently above normal',
      'Family history of diabetes and age over 45',
      'Numbness, tingling, or wounds that heal slowly',
      'Vision changes or frequent infections'
    ],
    relatedSymptoms: ['frequent-urination', 'fatigue', 'blurred-vision', 'numbness-tingling'],
    relatedConditions: ['hypertension', 'obesity', 'coronary-artery-disease'],
    relatedBlogs: ['type-2-diabetes-early-signs-10'],
    faq: [
      { question: 'Can diabetes be reversed?', answer: 'Type 2 diabetes can sometimes be put into remission through significant weight loss, dietary changes, and exercise, especially when caught early. Type 1 diabetes cannot be reversed.' },
      { question: 'What is a normal blood sugar level?', answer: 'Fasting blood sugar should be below 100 mg/dL. Levels between 100-125 mg/dL indicate pre-diabetes, and 126 mg/dL or above indicates diabetes.' },
      { question: 'How often should blood sugar be checked?', answer: 'People with diabetes may need to check multiple times daily. Those at risk should have screening blood tests at least annually after age 45.' }
    ]
  },
  {
    slug: 'hypertension',
    name: 'Hypertension (High Blood Pressure)',
    metaTitle: 'Hypertension: Causes, Risks & How to Lower Blood Pressure',
    metaDescription: 'Learn about high blood pressure causes, health risks, and effective ways to lower blood pressure through lifestyle changes and medication.',
    category: 'Cardiovascular',
    overview: 'Hypertension, or high blood pressure, is a chronic condition in which the force of blood against artery walls is consistently too high. Blood pressure is measured as systolic (pressure when heart beats) over diastolic (pressure between beats). Normal blood pressure is below 120/80 mmHg.\n\nOften called the "silent killer," hypertension usually has no symptoms but significantly increases the risk of heart attack, stroke, kidney disease, and vision loss. Regular monitoring is the only way to detect it.',
    symptoms: [
      'Usually no symptoms (silent condition)',
      'Severe headaches in hypertensive crisis',
      'Shortness of breath',
      'Nosebleeds (in severe cases)',
      'Dizziness or lightheadedness',
      'Chest pain (in severe cases)',
      'Vision changes',
      'Blood in urine (in advanced kidney damage)'
    ],
    causes: [
      'Primary hypertension: No identifiable cause, develops gradually over years',
      'Secondary hypertension: Caused by underlying conditions (kidney disease, thyroid problems, medications)',
      'Narrowing of arteries (atherosclerosis)',
      'High sodium intake increasing blood volume'
    ],
    riskFactors: [
      'Age (risk increases with age)',
      'Family history of hypertension',
      'Obesity and overweight',
      'High sodium, low potassium diet',
      'Physical inactivity',
      'Excessive alcohol consumption',
      'Chronic stress',
      'Smoking'
    ],
    diagnosis: 'Blood pressure is measured using a sphygmomanometer. Hypertension is diagnosed when readings are consistently 130/80 mmHg or higher on multiple occasions. Ambulatory blood pressure monitoring (24-hour) may be used to confirm. Additional tests include blood work, urinalysis, ECG, and echocardiogram to assess organ damage.',
    treatment: 'Treatment includes lifestyle modifications as first-line: reducing sodium intake, regular exercise, weight management, limiting alcohol, and stress reduction. Medications include ACE inhibitors, ARBs, calcium channel blockers, and diuretics, often in combination. Target blood pressure is typically below 130/80 mmHg.',
    prevention: [
      'Limit sodium intake to less than 2,300 mg per day',
      'Eat a DASH diet (fruits, vegetables, whole grains, lean proteins)',
      'Exercise at least 30 minutes most days',
      'Maintain a healthy weight',
      'Limit alcohol to moderate amounts',
      'Manage stress through relaxation techniques',
      'Quit smoking',
      'Get regular blood pressure checks'
    ],
    whenToSeeDoctor: [
      'Blood pressure reading above 130/80 mmHg',
      'Severe headache with high blood pressure reading',
      'Chest pain, difficulty breathing, or vision changes',
      'Family history of hypertension or heart disease',
      'Already diagnosed and blood pressure is not controlled with current treatment'
    ],
    relatedSymptoms: ['headache', 'dizziness', 'shortness-of-breath', 'chest-pain'],
    relatedConditions: ['coronary-artery-disease', 'stroke', 'chronic-kidney-disease'],
    relatedBlogs: ['hypertension-basics-9'],
    faq: [
      { question: 'What is a dangerously high blood pressure?', answer: 'A reading above 180/120 mmHg is a hypertensive crisis requiring immediate medical attention. Call emergency services if experiencing symptoms at this level.' },
      { question: 'Can high blood pressure be cured?', answer: 'Primary hypertension cannot be cured but can be effectively managed with lifestyle changes and medication. Secondary hypertension may resolve if the underlying cause is treated.' },
      { question: 'How often should blood pressure be checked?', answer: 'Adults should have blood pressure checked at least once a year. Those with elevated readings or risk factors should check more frequently, including at-home monitoring.' }
    ]
  },
  {
    slug: 'asthma',
    name: 'Asthma',
    metaTitle: 'Asthma: Symptoms, Triggers, Treatment & Management',
    metaDescription: 'Complete guide to asthma including symptoms, common triggers, inhaler use, and long-term management strategies for better breathing.',
    category: 'Respiratory',
    overview: 'Asthma is a chronic respiratory condition in which the airways become inflamed, narrow, and produce excess mucus, making breathing difficult. It causes recurring episodes of wheezing, coughing, chest tightness, and shortness of breath.\n\nAsthma affects over 300 million people worldwide. While it cannot be cured, with proper management, most people with asthma can lead active, normal lives. An asthma action plan developed with your doctor is essential for effective control.',
    symptoms: [
      'Wheezing (whistling sound when breathing)',
      'Shortness of breath',
      'Chest tightness or pain',
      'Coughing, especially at night or early morning',
      'Difficulty sleeping due to breathing problems',
      'Reduced exercise tolerance',
      'Rapid breathing during attacks'
    ],
    causes: [
      'Genetic predisposition (family history of asthma or allergies)',
      'Allergic sensitization (dust mites, pollen, pet dander, mold)',
      'Airway hyperresponsiveness to irritants',
      'Environmental factors during childhood development'
    ],
    riskFactors: [
      'Family history of asthma or allergies',
      'Having other allergic conditions (eczema, hay fever)',
      'Childhood respiratory infections',
      'Exposure to secondhand smoke',
      'Obesity',
      'Occupational exposure to chemical fumes or dust',
      'Air pollution exposure'
    ],
    diagnosis: 'Asthma is diagnosed through spirometry (measuring airflow), peak flow testing, and bronchial challenge tests. Allergy testing may identify triggers. A trial of asthma medication may also help confirm diagnosis if symptoms improve.',
    treatment: 'Treatment includes quick-relief inhalers (short-acting bronchodilators like salbutamol) for acute symptoms and long-term controller medications (inhaled corticosteroids, long-acting bronchodilators) for daily management. Trigger avoidance, an asthma action plan, and regular follow-up are essential.',
    prevention: [
      'Identify and avoid personal asthma triggers',
      'Take controller medications as prescribed, even when feeling well',
      'Use a peak flow meter to monitor lung function',
      'Get annual flu vaccination',
      'Keep indoor air clean (use air purifiers, avoid smoke)',
      'Exercise regularly with proper warm-up',
      'Maintain a healthy weight'
    ],
    whenToSeeDoctor: [
      'Using rescue inhaler more than twice a week',
      'Nighttime symptoms more than twice a month',
      'Asthma symptoms limiting daily activities',
      'Needing emergency treatment for asthma attacks',
      'Peak flow readings dropping below personal best',
      'Symptoms not improving with current medications'
    ],
    relatedSymptoms: ['cough', 'shortness-of-breath', 'chest-pain', 'wheezing'],
    relatedConditions: ['allergic-rhinitis', 'eczema', 'copd'],
    relatedBlogs: ['asthma-triggers-and-control-11'],
    faq: [
      { question: 'Can asthma go away?', answer: 'Childhood asthma sometimes improves or seems to go away in adolescence, but it can return later in life. Adult-onset asthma is usually a lifelong condition that requires ongoing management.' },
      { question: 'Is exercise safe with asthma?', answer: 'Yes, regular exercise is recommended for people with asthma. Using a rescue inhaler before exercise and warming up properly can help prevent exercise-induced symptoms.' },
      { question: 'What should I do during an asthma attack?', answer: 'Sit upright, use your rescue inhaler (usually 2-4 puffs), and try to stay calm. If symptoms do not improve within 15 minutes, seek emergency medical care.' }
    ]
  },
  {
    slug: 'migraine',
    name: 'Migraine',
    metaTitle: 'Migraine: Symptoms, Triggers & Treatment Options',
    metaDescription: 'Understand migraine headaches including aura, triggers, and effective treatments. Learn how to prevent migraines and improve quality of life.',
    category: 'Neurological',
    overview: 'Migraine is a neurological condition that causes intense, debilitating headaches usually on one side of the head. Migraines often come with nausea, vomiting, and extreme sensitivity to light and sound. Some people experience visual disturbances called aura before the headache begins.\n\nMigraines affect about 12% of the population and are three times more common in women than men. They can last from 4 hours to 72 hours and significantly impact quality of life and daily functioning.',
    symptoms: [
      'Intense, throbbing pain usually on one side of the head',
      'Nausea and vomiting',
      'Sensitivity to light (photophobia)',
      'Sensitivity to sound (phonophobia)',
      'Visual aura (flashing lights, blind spots, zigzag lines)',
      'Tingling or numbness in the face or hands',
      'Difficulty concentrating'
    ],
    causes: [
      'Abnormal brain activity affecting nerve signals, chemicals, and blood vessels',
      'Genetic factors (migraines run in families)',
      'Changes in brainstem function and trigeminal nerve interactions',
      'Imbalances in serotonin and other brain chemicals'
    ],
    riskFactors: [
      'Family history of migraines',
      'Female sex (hormonal fluctuations)',
      'Age 15-55 years',
      'Stress and anxiety',
      'Hormonal changes (menstruation, oral contraceptives)',
      'Sleep disturbances',
      'Certain foods and drinks (aged cheese, alcohol, chocolate)'
    ],
    diagnosis: 'Migraine is diagnosed clinically based on symptom criteria: at least 5 headache episodes lasting 4-72 hours with at least two characteristics (unilateral, pulsating, moderate-severe intensity, aggravated by activity) and at least one associated symptom (nausea, photophobia, phonophobia). Brain imaging may be ordered to rule out other causes.',
    treatment: 'Acute treatment includes triptans (sumatriptan), NSAIDs, and anti-nausea medications. Preventive treatment for frequent migraines includes beta-blockers, antidepressants, anti-seizure medications, CGRP inhibitors, and Botox injections. Lifestyle management and trigger avoidance are essential complements.',
    prevention: [
      'Keep a migraine diary to identify personal triggers',
      'Maintain regular sleep patterns',
      'Eat regular meals and stay hydrated',
      'Manage stress with relaxation techniques',
      'Exercise regularly (moderate intensity)',
      'Limit caffeine and alcohol intake',
      'Consider preventive medication if having 4+ migraines per month'
    ],
    whenToSeeDoctor: [
      'Headaches occurring more than 15 days per month',
      'Headaches requiring pain medication more than twice a week',
      'Migraines not responding to over-the-counter treatments',
      'New or changed headache patterns',
      'Headache with neurological symptoms (weakness, confusion, vision loss)',
      'First migraine after age 50'
    ],
    relatedSymptoms: ['headache', 'nausea', 'dizziness', 'blurred-vision'],
    relatedConditions: ['tension-headache', 'cluster-headache', 'depression'],
    relatedBlogs: ['migraine-vs-headache-14'],
    faq: [
      { question: 'What is the difference between a headache and a migraine?', answer: 'Migraines are typically one-sided, throbbing, moderate-to-severe, and accompanied by nausea or light/sound sensitivity. Regular headaches are usually less severe and bilateral.' },
      { question: 'Can migraines cause permanent damage?', answer: 'Migraines themselves do not cause brain damage. However, chronic migraines significantly impact quality of life, and effective treatment can prevent disability.' },
      { question: 'Are migraines hereditary?', answer: 'Yes, migraines have a strong genetic component. If one parent has migraines, there is about a 50% chance their child will also develop them.' }
    ]
  },
  {
    slug: 'gastritis',
    name: 'Gastritis',
    metaTitle: 'Gastritis: Causes, Symptoms & Treatment Guide',
    metaDescription: 'Learn about gastritis — stomach lining inflammation. Understand causes including H. pylori, NSAID use, diet changes, and treatment options.',
    category: 'Digestive',
    overview: 'Gastritis is inflammation of the stomach lining. It can occur suddenly (acute gastritis) or develop gradually (chronic gastritis). The stomach lining produces acid and enzymes for digestion, and when inflamed, it may produce less acid, enzymes, and mucus.\n\nGastritis is common and usually not serious, but if left untreated, chronic gastritis can lead to ulcers and, in rare cases, stomach cancer. Treatment depends on the cause and usually leads to significant improvement.',
    symptoms: [
      'Gnawing or burning pain in the upper abdomen',
      'Nausea and vomiting',
      'Feeling of fullness after eating',
      'Loss of appetite',
      'Bloating',
      'Indigestion',
      'Dark or tarry stools (if bleeding occurs)'
    ],
    causes: [
      'Helicobacter pylori (H. pylori) bacterial infection',
      'Regular use of NSAIDs (ibuprofen, aspirin)',
      'Excessive alcohol consumption',
      'Severe stress from major surgery, illness, or injury',
      'Autoimmune gastritis (body attacks stomach lining cells)',
      'Bile reflux from the small intestine'
    ],
    riskFactors: [
      'H. pylori infection (very common in developing countries)',
      'Regular NSAID or aspirin use',
      'Heavy alcohol use',
      'Older age (stomach lining thins with age)',
      'Chronic stress',
      'Smoking',
      'Autoimmune conditions'
    ],
    diagnosis: 'Diagnosis may include upper endoscopy with biopsy, H. pylori testing (breath test, blood test, or stool test), and blood tests. Upper GI series X-ray may also be used. Endoscopy allows direct visualization and biopsy of the stomach lining.',
    treatment: 'Treatment addresses the cause: antibiotics for H. pylori (triple therapy), proton pump inhibitors (PPIs) to reduce acid, H2 blockers, antacids for symptom relief, and stopping NSAIDs. Dietary modifications and stress management support healing.',
    prevention: [
      'Limit NSAID use and take with food if needed',
      'Moderate alcohol consumption',
      'Eat smaller, more frequent meals',
      'Avoid spicy and acidic foods that worsen symptoms',
      'Practice good hygiene to reduce H. pylori risk',
      'Manage stress effectively',
      'Do not smoke'
    ],
    whenToSeeDoctor: [
      'Upper abdominal pain lasting more than a week',
      'Vomiting blood or material resembling coffee grounds',
      'Black, tarry stools',
      'Severe nausea interfering with eating',
      'Unintended weight loss',
      'Symptoms not improving with antacids'
    ],
    relatedSymptoms: ['stomach-pain', 'nausea', 'bloating', 'loss-of-appetite'],
    relatedConditions: ['peptic-ulcer-disease', 'gerd', 'stomach-cancer'],
    relatedBlogs: [],
    faq: [
      { question: 'Is gastritis the same as an ulcer?', answer: 'No. Gastritis is inflammation of the stomach lining, while an ulcer is an actual open sore. However, untreated gastritis can lead to ulcers.' },
      { question: 'Can gastritis heal on its own?', answer: 'Acute gastritis from irritants may heal once the irritant is removed. Chronic gastritis from H. pylori requires antibiotic treatment to resolve.' },
      { question: 'What foods should I avoid with gastritis?', answer: 'Avoid spicy foods, acidic foods (citrus, tomatoes), alcohol, coffee, and fried or fatty foods. Eat bland, non-irritating foods during flare-ups.' }
    ]
  },
  {
    slug: 'anxiety-disorders',
    name: 'Anxiety Disorders',
    metaTitle: 'Anxiety Disorders: Symptoms, Types & Treatment',
    metaDescription: 'Understand anxiety disorders including generalized anxiety, panic disorder, and social anxiety. Learn coping strategies and treatment options.',
    category: 'Mental Health',
    overview: 'Anxiety disorders are a group of mental health conditions characterized by excessive, persistent worry and fear that interferes with daily activities. While occasional anxiety is a normal response to stress, anxiety disorders involve anxiety that does not go away, may worsen over time, and significantly impacts life.\n\nAnxiety disorders are the most common mental health conditions, affecting about 30% of adults at some point. They are highly treatable through therapy, medication, or a combination of both.',
    symptoms: [
      'Excessive worry that is difficult to control',
      'Restlessness or feeling on edge',
      'Rapid heartbeat and palpitations',
      'Sweating and trembling',
      'Difficulty concentrating',
      'Sleep disturbances',
      'Muscle tension',
      'Avoidance of anxiety-triggering situations',
      'Panic attacks (sudden intense fear with physical symptoms)'
    ],
    causes: [
      'Imbalance in brain chemicals (serotonin, norepinephrine, GABA)',
      'Genetic predisposition',
      'Traumatic or stressful life events',
      'Chronic medical conditions',
      'Personality factors (tendency toward negativity or harm avoidance)'
    ],
    riskFactors: [
      'Family history of anxiety or mental health disorders',
      'Childhood trauma or abuse',
      'Chronic stress',
      'Other mental health conditions (depression)',
      'Substance abuse',
      'Female sex (twice as common in women)',
      'Chronic illness'
    ],
    diagnosis: 'Anxiety disorders are diagnosed through clinical evaluation including a detailed history of symptoms, their duration and impact, and ruling out medical causes. Standardized questionnaires (GAD-7, PHQ) may be used. Physical examination and blood tests rule out thyroid problems and other medical causes.',
    treatment: 'Treatment includes cognitive behavioral therapy (CBT) as first-line psychotherapy, medications (SSRIs, SNRIs, buspirone), and lifestyle modifications. Relaxation techniques, mindfulness, and regular exercise are important complementary approaches. Severe cases may benefit from a combination of therapy and medication.',
    prevention: [
      'Practice regular stress management (meditation, deep breathing)',
      'Exercise regularly (30 minutes most days)',
      'Maintain a consistent sleep schedule',
      'Limit caffeine and alcohol',
      'Build strong social connections',
      'Seek help early when anxiety begins interfering with life',
      'Learn and practice cognitive reframing techniques'
    ],
    whenToSeeDoctor: [
      'Anxiety interfering with work, relationships, or daily activities',
      'Persistent worry that you cannot control',
      'Panic attacks',
      'Avoiding situations due to excessive fear',
      'Physical symptoms (heart racing, dizziness) with no medical cause',
      'Using alcohol or drugs to cope with anxiety'
    ],
    relatedSymptoms: ['palpitations', 'insomnia', 'dizziness', 'chest-pain'],
    relatedConditions: ['depression', 'panic-disorder', 'obsessive-compulsive-disorder'],
    relatedBlogs: ['stress-management-techniques-16'],
    faq: [
      { question: 'What is the difference between normal anxiety and an anxiety disorder?', answer: 'Normal anxiety is temporary and related to a specific situation. An anxiety disorder involves persistent, excessive worry that is difficult to control and interferes with daily functioning.' },
      { question: 'Can anxiety disorders be cured?', answer: 'Anxiety disorders are highly treatable. Many people experience significant improvement or complete resolution with therapy and/or medication, though management may be ongoing.' },
      { question: 'Is anxiety a mental illness?', answer: 'Yes, anxiety disorders are recognized mental health conditions. They are medical conditions involving brain chemistry and are not a sign of weakness.' }
    ]
  },
  {
    slug: 'depression',
    name: 'Depression',
    metaTitle: 'Depression: Signs, Symptoms & Treatment Options',
    metaDescription: 'Recognize depression symptoms, understand causes, and explore treatment options including therapy and medication. You are not alone — help is available.',
    category: 'Mental Health',
    overview: 'Depression (major depressive disorder) is a common and serious mood disorder that causes persistent feelings of sadness, hopelessness, and loss of interest in activities once enjoyed. It affects how you feel, think, and handle daily activities.\n\nDepression is more than just feeling sad or going through a rough patch. It is a medical condition that requires treatment. With proper care, including therapy and medication, most people with depression can improve significantly.',
    symptoms: [
      'Persistent sad, anxious, or empty mood',
      'Loss of interest in hobbies and activities',
      'Significant weight loss or gain',
      'Sleeping too much or too little',
      'Fatigue and loss of energy',
      'Feelings of worthlessness or excessive guilt',
      'Difficulty thinking, concentrating, or making decisions',
      'Thoughts of death or suicide'
    ],
    causes: [
      'Imbalance in brain neurotransmitters (serotonin, dopamine, norepinephrine)',
      'Genetic vulnerability',
      'Major life changes, trauma, or loss',
      'Chronic medical conditions',
      'Hormonal changes (postpartum, thyroid disorders)'
    ],
    riskFactors: [
      'Family history of depression',
      'Traumatic or stressful experiences',
      'Chronic illness or chronic pain',
      'Certain medications',
      'Substance abuse',
      'Social isolation',
      'Low self-esteem'
    ],
    diagnosis: 'Depression is diagnosed based on criteria in the DSM-5: at least 5 symptoms present for at least 2 weeks, including depressed mood or loss of interest. Screening tools like PHQ-9 are commonly used. Blood tests may be done to rule out thyroid problems or other medical causes.',
    treatment: 'Treatment includes psychotherapy (CBT, interpersonal therapy), antidepressant medications (SSRIs, SNRIs), or a combination. Regular exercise, adequate sleep, social support, and sometimes electroconvulsive therapy (ECT) for severe cases are also part of comprehensive treatment.',
    prevention: [
      'Stay connected with friends and family',
      'Exercise regularly',
      'Get adequate sleep',
      'Limit alcohol consumption',
      'Seek help early when feeling persistently down',
      'Practice stress management and self-care',
      'Continue treatment even after feeling better to prevent relapse'
    ],
    whenToSeeDoctor: [
      'Feeling sad or hopeless most of the day, nearly every day',
      'Loss of interest in most activities for more than 2 weeks',
      'Changes in sleep, appetite, or energy lasting more than 2 weeks',
      'Difficulty functioning at work or in relationships',
      'Thoughts of death or suicide (seek immediate help)',
      'Current treatment is not providing adequate relief'
    ],
    relatedSymptoms: ['fatigue', 'insomnia', 'body-aches', 'difficulty-concentrating'],
    relatedConditions: ['anxiety-disorders', 'bipolar-disorder', 'chronic-fatigue-syndrome'],
    relatedBlogs: ['stress-management-techniques-16', 'which-supplements-can-boost-the-effects-of-antidepressants-61'],
    faq: [
      { question: 'Is depression the same as sadness?', answer: 'No. Sadness is a normal emotion that passes. Depression is a persistent condition lasting at least 2 weeks with multiple symptoms that interfere with daily life.' },
      { question: 'Can depression go away without treatment?', answer: 'Some mild episodes may improve, but treatment significantly speeds recovery, reduces severity, and prevents recurrence. Untreated depression can worsen over time.' },
      { question: 'Are antidepressants addictive?', answer: 'No, antidepressants are not addictive. However, stopping them abruptly can cause withdrawal symptoms, so they should be tapered under medical supervision.' }
    ]
  },
  {
    slug: 'influenza',
    name: 'Influenza (Flu)',
    metaTitle: 'Influenza (Flu): Symptoms, Treatment & Prevention',
    metaDescription: 'Learn about flu symptoms, how it differs from a cold, treatment options, and the importance of annual flu vaccination for protection.',
    category: 'Infectious',
    overview: 'Influenza (flu) is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and lungs. It can range from mild to severe and can sometimes lead to death. Flu is different from a cold — it usually comes on suddenly and is more severe.\n\nAnnual flu vaccination is the best way to prevent influenza. The flu season typically peaks between December and February in the Northern Hemisphere, but can occur year-round in tropical regions.',
    symptoms: [
      'Sudden onset of high fever (100-104°F)',
      'Body aches and muscle pain',
      'Chills and sweats',
      'Headache',
      'Dry, persistent cough',
      'Fatigue and weakness (can last 2-3 weeks)',
      'Sore throat',
      'Runny or stuffy nose'
    ],
    causes: [
      'Influenza A viruses (most common cause of flu epidemics)',
      'Influenza B viruses',
      'Spread through respiratory droplets from coughing, sneezing, or talking',
      'Can spread by touching contaminated surfaces then touching face'
    ],
    riskFactors: [
      'Age under 5 or over 65',
      'Chronic conditions (asthma, diabetes, heart disease)',
      'Weakened immune system',
      'Pregnancy',
      'Obesity',
      'Living in crowded settings (dormitories, nursing homes)',
      'Not being vaccinated'
    ],
    diagnosis: 'Flu can be diagnosed clinically during flu season. Rapid influenza diagnostic tests (nasal swab) provide results in 15-20 minutes. RT-PCR testing is more accurate. Testing is most useful within the first 48 hours of symptoms when antiviral treatment is most effective.',
    treatment: 'Treatment includes rest, fluids, and fever/pain management with acetaminophen or ibuprofen. Antiviral medications (oseltamivir/Tamiflu) are most effective when started within 48 hours of symptom onset, especially for high-risk individuals. Antibiotics do not treat flu.',
    prevention: [
      'Get annual flu vaccination',
      'Wash hands frequently with soap and water',
      'Avoid touching your face',
      'Cover coughs and sneezes',
      'Stay home when sick',
      'Clean and disinfect frequently touched surfaces',
      'Maintain a healthy immune system with good nutrition and sleep'
    ],
    whenToSeeDoctor: [
      'Difficulty breathing or chest pain',
      'Persistent high fever despite treatment',
      'Severe muscle pain or weakness',
      'Worsening symptoms after initial improvement',
      'High-risk individuals at first sign of flu symptoms',
      'Dehydration (dark urine, dizziness, no tears when crying in children)'
    ],
    relatedSymptoms: ['fever', 'cough', 'body-aches', 'fatigue'],
    relatedConditions: ['pneumonia', 'bronchitis', 'sinusitis'],
    relatedBlogs: ['preventing-seasonal-flu-45', 'vaccination-myths-vs-facts-43'],
    faq: [
      { question: 'How is the flu different from a cold?', answer: 'Flu comes on suddenly with high fever, severe body aches, and fatigue. Colds develop gradually with milder symptoms like runny nose and sneezing. Flu is more likely to cause serious complications.' },
      { question: 'How long is the flu contagious?', answer: 'You are contagious from 1 day before symptoms start to about 5-7 days after. Children and immunocompromised people may be contagious longer.' },
      { question: 'Should I get a flu shot every year?', answer: 'Yes, because flu viruses change each year, and the vaccine is updated annually to match circulating strains. Protection also wanes over time.' }
    ]
  },
  {
    slug: 'pneumonia',
    name: 'Pneumonia',
    metaTitle: 'Pneumonia: Causes, Symptoms & Treatment Guide',
    metaDescription: 'Learn about pneumonia — lung infection causing cough, fever, and breathing difficulty. Understand types, treatment, and prevention with vaccination.',
    category: 'Respiratory',
    overview: 'Pneumonia is an infection that inflames the air sacs (alveoli) in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing. Pneumonia can range from mild to life-threatening.\n\nIt is most serious for infants, young children, people over 65, and those with weakened immune systems. Pneumonia can be caused by various organisms including bacteria, viruses, and fungi.',
    symptoms: [
      'Cough with phlegm (may be greenish, yellow, or bloody)',
      'Fever, sweating, and shaking chills',
      'Shortness of breath',
      'Chest pain that worsens with breathing or coughing',
      'Fatigue and weakness',
      'Nausea, vomiting, or diarrhea',
      'Confusion (especially in older adults)'
    ],
    causes: [
      'Bacteria (Streptococcus pneumoniae is most common)',
      'Viruses (influenza, COVID-19, RSV)',
      'Fungi (more common in immunocompromised individuals)',
      'Aspiration (inhaling food, drink, or vomit into the lungs)'
    ],
    riskFactors: [
      'Age under 2 or over 65',
      'Chronic lung disease (COPD, asthma)',
      'Weakened immune system',
      'Smoking',
      'Recent viral respiratory infection',
      'Hospitalization (especially on a ventilator)',
      'Difficulty swallowing'
    ],
    diagnosis: 'Diagnosis includes physical examination (listening for abnormal lung sounds), chest X-ray, blood tests (CBC, blood cultures), sputum culture, pulse oximetry, and sometimes CT scan. These help confirm pneumonia, identify the cause, and assess severity.',
    treatment: 'Bacterial pneumonia is treated with antibiotics. Viral pneumonia may be treated with antiviral medications. Supportive care includes rest, fluids, fever reducers, and cough management. Severe cases may require hospitalization for IV antibiotics, oxygen therapy, or mechanical ventilation.',
    prevention: [
      'Get vaccinated (pneumococcal vaccine, flu vaccine)',
      'Practice good hand hygiene',
      'Do not smoke',
      'Maintain a healthy immune system',
      'Treat underlying conditions properly',
      'Practice good oral hygiene (reduces aspiration risk)',
      'Avoid close contact with sick individuals'
    ],
    whenToSeeDoctor: [
      'Cough with colored or bloody phlegm',
      'Fever above 102°F (39°C) with chills',
      'Difficulty breathing or rapid breathing',
      'Chest pain when breathing',
      'Symptoms worsening after initial improvement from a cold or flu',
      'Any symptoms in people over 65 or with chronic conditions'
    ],
    relatedSymptoms: ['cough', 'fever', 'shortness-of-breath', 'chest-pain'],
    relatedConditions: ['influenza', 'bronchitis', 'copd'],
    relatedBlogs: [],
    faq: [
      { question: 'Is pneumonia contagious?', answer: 'The germs that cause pneumonia can be contagious, but developing pneumonia after exposure depends on your immune system. Viral and bacterial pneumonia can spread through respiratory droplets.' },
      { question: 'How long does it take to recover from pneumonia?', answer: 'Mild cases may improve in 1-2 weeks, but fatigue can last a month or more. Severe cases in older adults may take 6-8 weeks for full recovery.' },
      { question: 'Can pneumonia be prevented with a vaccine?', answer: 'Yes, pneumococcal vaccines protect against the most common bacterial cause. They are recommended for children under 5, adults over 65, and people with certain health conditions.' }
    ]
  },
  {
    slug: 'dengue',
    name: 'Dengue Fever',
    metaTitle: 'Dengue Fever: Symptoms, Treatment & Prevention in Bangladesh',
    metaDescription: 'Essential guide to dengue fever symptoms, warning signs of severe dengue, treatment, and mosquito prevention strategies for South Asia.',
    category: 'Infectious',
    overview: 'Dengue fever is a mosquito-borne viral illness transmitted by Aedes mosquitoes (primarily Aedes aegypti). It is common in tropical and subtropical regions, particularly in South Asia, Southeast Asia, and Latin America. Bangladesh experiences major dengue outbreaks annually, especially during the monsoon season.\n\nMost dengue infections cause mild illness, but severe dengue (dengue hemorrhagic fever) can be life-threatening and requires immediate medical care. There is no specific antiviral treatment — management focuses on symptom relief and monitoring for complications.',
    symptoms: [
      'High fever (104°F/40°C)',
      'Severe headache, especially behind the eyes',
      'Severe muscle and joint pain (breakbone fever)',
      'Nausea and vomiting',
      'Skin rash (appears 2-5 days after fever onset)',
      'Fatigue',
      'Mild bleeding (nose, gums)',
      'Low white blood cell count'
    ],
    causes: [
      'Dengue virus (4 serotypes: DENV-1, DENV-2, DENV-3, DENV-4)',
      'Transmitted by Aedes aegypti and Aedes albopictus mosquitoes',
      'Mosquitoes bite during early morning and before dusk',
      'Second infection with a different serotype increases risk of severe dengue'
    ],
    riskFactors: [
      'Living in or traveling to tropical regions',
      'Previous dengue infection (increases severe dengue risk)',
      'Monsoon season (June-October in Bangladesh)',
      'Standing water near living areas',
      'Lack of mosquito protection',
      'Children and young adults',
      'Immunocompromised individuals'
    ],
    diagnosis: 'Diagnosed through NS1 antigen test (early detection within first 5 days), dengue IgM/IgG antibody tests, and complete blood count (low platelets, rising hematocrit are warning signs). PCR testing can confirm the virus and identify the serotype.',
    treatment: 'No specific antiviral treatment exists. Management includes rest, adequate fluid intake (oral rehydration), acetaminophen for fever and pain (avoid aspirin and NSAIDs which can worsen bleeding), and close monitoring of platelet count and hematocrit. Severe dengue requires hospitalization with IV fluids and careful management.',
    prevention: [
      'Use mosquito repellent (DEET, picaridin)',
      'Wear long sleeves and pants, especially at dawn and dusk',
      'Use mosquito nets, especially for sleeping',
      'Eliminate standing water (flower pots, tires, containers)',
      'Use window and door screens',
      'Support community mosquito control programs',
      'Dengue vaccine (Dengvaxia) is available in some regions for previously infected individuals'
    ],
    whenToSeeDoctor: [
      'High fever lasting more than 2 days during dengue season',
      'Severe abdominal pain',
      'Persistent vomiting (3+ times in 24 hours)',
      'Bleeding from gums, nose, or in stool/urine',
      'Extreme fatigue or restlessness',
      'Signs of dehydration',
      'Decreasing platelet count below 100,000'
    ],
    relatedSymptoms: ['fever', 'body-aches', 'skin-rash', 'headache'],
    relatedConditions: ['malaria', 'chikungunya', 'zika'],
    relatedBlogs: ['understanding-dengue-symptoms-8'],
    faq: [
      { question: 'Can you get dengue twice?', answer: 'Yes. There are 4 dengue serotypes, and infection with one provides lifelong immunity to that serotype only. A second infection with a different serotype carries a higher risk of severe dengue.' },
      { question: 'What platelet count is dangerous in dengue?', answer: 'Platelets below 100,000 need monitoring. Below 20,000 is critical and may require platelet transfusion. Normal platelet count is 150,000-400,000.' },
      { question: 'Why should you avoid aspirin in dengue?', answer: 'Aspirin and NSAIDs (ibuprofen) can increase bleeding risk in dengue patients. Use only acetaminophen (paracetamol) for fever and pain.' }
    ]
  },
  {
    slug: 'eczema',
    name: 'Eczema (Atopic Dermatitis)',
    metaTitle: 'Eczema: Symptoms, Triggers & Skin Care Tips',
    metaDescription: 'Comprehensive guide to eczema (atopic dermatitis) including triggers, treatment options, and daily skin care routines to manage flare-ups.',
    category: 'Skin',
    overview: 'Eczema, also known as atopic dermatitis, is a chronic inflammatory skin condition that causes dry, itchy, inflamed patches on the skin. It is most common in children but can occur at any age. Eczema is not contagious.\n\nThe condition tends to flare up periodically and may be accompanied by asthma or hay fever (the atopic triad). While there is no cure, proper skin care and treatment can manage symptoms and reduce flare-ups.',
    symptoms: [
      'Dry, sensitive skin',
      'Intense itching, especially at night',
      'Red to brownish-gray patches',
      'Small raised bumps that may leak fluid when scratched',
      'Thickened, cracked, or scaly skin',
      'Raw, swollen skin from scratching',
      'Patches commonly on hands, feet, ankles, wrists, neck, and eyelids'
    ],
    causes: [
      'Overactive immune system responding to irritants',
      'Genetic mutation affecting the skin barrier protein filaggrin',
      'Family history of eczema, asthma, or allergies',
      'Environmental and lifestyle factors'
    ],
    riskFactors: [
      'Family history of eczema, asthma, or hay fever',
      'Living in dry or cold climates',
      'Exposure to irritants (soaps, detergents, fragrances)',
      'Food allergies',
      'Stress',
      'Hormonal changes',
      'Urban environments with higher pollution'
    ],
    diagnosis: 'Eczema is diagnosed clinically based on the appearance of the skin, symptom history, and family history. Patch testing may identify contact allergens. Blood tests for IgE levels and skin prick tests may identify allergic triggers. A skin biopsy is rarely needed.',
    treatment: 'Treatment includes daily moisturizing (emollients), topical corticosteroids for flare-ups, topical calcineurin inhibitors, antihistamines for itching, and wet wrap therapy. Severe cases may require systemic immunosuppressants or biologic medications (dupilumab). Identifying and avoiding triggers is essential.',
    prevention: [
      'Moisturize skin at least twice daily with fragrance-free cream',
      'Take short, lukewarm baths or showers',
      'Use gentle, fragrance-free soaps and detergents',
      'Wear soft, breathable fabrics (cotton)',
      'Manage stress',
      'Identify and avoid personal triggers',
      'Use a humidifier in dry weather',
      'Keep fingernails short to minimize scratching damage'
    ],
    whenToSeeDoctor: [
      'Eczema not improving with regular moisturizing and OTC treatments',
      'Skin appears infected (increased redness, warmth, pus, fever)',
      'Eczema affecting sleep or daily activities',
      'Spreading to new areas of the body',
      'Severe itching not controlled by antihistamines',
      'Eczema in an infant or young child for the first time'
    ],
    relatedSymptoms: ['skin-rash', 'itching', 'skin-dryness', 'insomnia'],
    relatedConditions: ['asthma', 'allergic-rhinitis', 'psoriasis'],
    relatedBlogs: ['sun-safety-and-skin-care-20'],
    faq: [
      { question: 'Is eczema contagious?', answer: 'No, eczema is not contagious. You cannot catch it from or spread it to another person.' },
      { question: 'Can eczema be cured?', answer: 'There is currently no cure for eczema, but it can be effectively managed. Many children outgrow eczema by adolescence.' },
      { question: 'Does diet affect eczema?', answer: 'In some people, especially children, food allergies can trigger eczema flare-ups. Common triggers include dairy, eggs, nuts, and wheat. An allergist can help identify food triggers.' }
    ]
  },
  {
    slug: 'irritable-bowel-syndrome',
    name: 'Irritable Bowel Syndrome (IBS)',
    metaTitle: 'IBS: Symptoms, Diet Tips & Treatment Options',
    metaDescription: 'Understand IBS symptoms, triggers, and management strategies including the low-FODMAP diet. Learn how to improve digestive comfort and quality of life.',
    category: 'Digestive',
    overview: 'Irritable bowel syndrome (IBS) is a common functional gastrointestinal disorder affecting the large intestine. It causes chronic abdominal pain, bloating, gas, and changes in bowel habits (diarrhea, constipation, or both) without any visible damage to the digestive tract.\n\nIBS affects 10-15% of the global population and is more common in women. While it does not cause permanent damage or increase cancer risk, it can significantly impact quality of life. Management focuses on symptom control through diet, lifestyle, and sometimes medication.',
    symptoms: [
      'Abdominal pain and cramping, often related to bowel movements',
      'Bloating and gas',
      'Diarrhea, constipation, or alternating between both',
      'Mucus in stool',
      'Feeling of incomplete bowel evacuation',
      'Symptoms that worsen with stress',
      'Symptoms triggered by certain foods'
    ],
    causes: [
      'Gut-brain axis dysfunction (altered communication between gut and brain)',
      'Visceral hypersensitivity (increased sensitivity to gut sensations)',
      'Altered gut motility (too fast or too slow)',
      'Post-infectious IBS (after gastroenteritis)',
      'Changes in gut microbiome',
      'Stress and psychological factors'
    ],
    riskFactors: [
      'Female sex',
      'Age under 50',
      'Family history of IBS',
      'History of anxiety or depression',
      'Previous gastrointestinal infection',
      'History of physical or sexual abuse',
      'High-stress lifestyle'
    ],
    diagnosis: 'IBS is diagnosed using Rome IV criteria: recurrent abdominal pain at least 1 day per week in the last 3 months, associated with bowel movements, change in stool frequency, or change in stool form. Tests to rule out other conditions may include blood tests, stool tests, and colonoscopy.',
    treatment: 'Treatment is individualized and includes dietary modifications (low-FODMAP diet, fiber adjustment), stress management, regular exercise, and medications as needed (antispasmodics, laxatives, anti-diarrheal agents, low-dose antidepressants). Psychological therapies (CBT, gut-directed hypnotherapy) can be highly effective.',
    prevention: [
      'Identify and avoid personal food triggers',
      'Eat regular meals and avoid skipping meals',
      'Exercise regularly',
      'Manage stress through relaxation techniques',
      'Get adequate sleep',
      'Consider probiotics',
      'Limit high-FODMAP foods if they trigger symptoms'
    ],
    whenToSeeDoctor: [
      'Symptoms significantly affecting quality of life',
      'Unexplained weight loss',
      'Rectal bleeding',
      'Persistent diarrhea not responding to dietary changes',
      'Symptoms starting after age 50',
      'Family history of colon cancer or inflammatory bowel disease',
      'Night-time symptoms that wake you from sleep'
    ],
    relatedSymptoms: ['stomach-pain', 'bloating', 'constipation', 'diarrhea'],
    relatedConditions: ['celiac-disease', 'inflammatory-bowel-disease', 'lactose-intolerance'],
    relatedBlogs: ['fiber-rich-foods-for-gut-health-33'],
    faq: [
      { question: 'Is IBS a serious condition?', answer: 'IBS is not life-threatening and does not cause permanent damage. However, it can significantly impact quality of life. Effective treatments are available.' },
      { question: 'What is the low-FODMAP diet?', answer: 'A diet that limits fermentable carbohydrates (oligosaccharides, disaccharides, monosaccharides, and polyols) that can trigger IBS symptoms. It is done in phases with dietitian guidance.' },
      { question: 'Can stress cause IBS?', answer: 'Stress does not cause IBS directly but is a major trigger for symptoms. The gut-brain connection means emotional stress can significantly worsen IBS symptoms.' }
    ]
  },
  {
    slug: 'coronary-artery-disease',
    name: 'Coronary Artery Disease',
    metaTitle: 'Coronary Artery Disease: Risks, Symptoms & Prevention',
    metaDescription: 'Learn about coronary artery disease (CAD), the leading cause of heart attacks. Understand risk factors, warning signs, and heart-healthy prevention.',
    category: 'Cardiovascular',
    overview: 'Coronary artery disease (CAD) is the most common type of heart disease and the leading cause of death worldwide. It develops when the major blood vessels that supply the heart (coronary arteries) become damaged or diseased, usually due to plaque buildup (atherosclerosis).\n\nPlaque narrows the coronary arteries, reducing blood flow to the heart. This can cause chest pain (angina) and, if an artery becomes completely blocked, a heart attack. CAD develops over decades and is largely preventable through lifestyle modifications.',
    symptoms: [
      'Chest pain or discomfort (angina) with exertion',
      'Shortness of breath during activity',
      'Pain in the neck, jaw, throat, upper abdomen, or back',
      'Fatigue with exertion',
      'Heart attack symptoms: crushing chest pain, sweating, nausea, arm pain',
      'Some people have no symptoms until a heart attack occurs (silent ischemia)'
    ],
    causes: [
      'Atherosclerosis (plaque buildup of cholesterol, fat, and other substances in artery walls)',
      'Endothelial damage from smoking, high blood pressure, or high cholesterol',
      'Chronic inflammation of artery walls',
      'Coronary artery spasm (less common)'
    ],
    riskFactors: [
      'High blood pressure',
      'High LDL cholesterol',
      'Smoking',
      'Diabetes',
      'Obesity',
      'Physical inactivity',
      'Family history of early heart disease',
      'Age (men over 45, women over 55)',
      'Unhealthy diet'
    ],
    diagnosis: 'Diagnosis includes ECG, stress testing (exercise or pharmacological), echocardiogram, coronary angiography (gold standard), CT coronary angiogram, blood tests (cholesterol, troponin). Risk assessment tools calculate 10-year cardiovascular risk.',
    treatment: 'Treatment includes lifestyle modifications (diet, exercise, smoking cessation), medications (statins, aspirin, beta-blockers, ACE inhibitors), and procedures such as angioplasty with stenting or coronary artery bypass grafting (CABG) for severe blockages. Cardiac rehabilitation programs support recovery.',
    prevention: [
      'Do not smoke or quit smoking',
      'Eat a heart-healthy diet low in saturated fat and sodium',
      'Exercise at least 150 minutes per week',
      'Maintain a healthy weight',
      'Control blood pressure, cholesterol, and blood sugar',
      'Manage stress',
      'Limit alcohol consumption',
      'Get regular cardiovascular health screenings'
    ],
    whenToSeeDoctor: [
      'Chest pain or discomfort, especially with exertion',
      'Shortness of breath with normal activities',
      'Known risk factors without regular screening',
      'Family history of early heart disease',
      'Erectile dysfunction (can be an early sign of CAD)',
      'Any suspected heart attack symptoms — call emergency services immediately'
    ],
    relatedSymptoms: ['chest-pain', 'shortness-of-breath', 'fatigue', 'palpitations'],
    relatedConditions: ['hypertension', 'diabetes', 'hyperlipidemia'],
    relatedBlogs: ['mens-heart-health-essentials-22', 'managing-high-cholesterol-46'],
    faq: [
      { question: 'Can coronary artery disease be reversed?', answer: 'Aggressive lifestyle changes and statin therapy can slow progression and in some cases partially reverse plaque buildup. However, significant reversal is difficult once disease is advanced.' },
      { question: 'What is the difference between a heart attack and CAD?', answer: 'CAD is the underlying disease (narrowed arteries). A heart attack occurs when a coronary artery becomes completely blocked, usually by a blood clot on a plaque, cutting off blood flow to heart muscle.' },
      { question: 'At what age should I start worrying about heart disease?', answer: 'Risk factors like high cholesterol can be present from young adulthood. Regular screening should begin at age 20 for cholesterol and blood pressure, with more comprehensive assessment starting at age 40.' }
    ]
  },
  {
    slug: 'gerd',
    name: 'GERD (Gastroesophageal Reflux Disease)',
    metaTitle: 'GERD: Symptoms, Treatment & Diet Tips for Acid Reflux',
    metaDescription: 'Understand GERD (chronic acid reflux) causes, treatment options, and dietary changes to reduce heartburn and prevent complications.',
    category: 'Digestive',
    overview: 'Gastroesophageal reflux disease (GERD) is a chronic condition in which stomach acid frequently flows back into the esophagus (the tube connecting the mouth and stomach). This acid reflux irritates the lining of the esophagus, causing heartburn and other symptoms.\n\nWhile occasional acid reflux is common, GERD is diagnosed when it occurs more than twice a week or causes significant symptoms. Untreated GERD can lead to esophageal inflammation, strictures, Barrett\'s esophagus, and rarely, esophageal cancer.',
    symptoms: [
      'Burning sensation in the chest (heartburn), usually after eating',
      'Chest pain',
      'Difficulty swallowing',
      'Regurgitation of food or sour liquid',
      'Sensation of a lump in the throat',
      'Chronic cough, especially at night',
      'Laryngitis or hoarseness',
      'Disrupted sleep from nighttime reflux'
    ],
    causes: [
      'Weakened or relaxed lower esophageal sphincter (LES)',
      'Hiatal hernia (stomach pushes through the diaphragm)',
      'Delayed stomach emptying',
      'Increased abdominal pressure from obesity or pregnancy'
    ],
    riskFactors: [
      'Obesity',
      'Pregnancy',
      'Smoking',
      'Eating large meals or eating late at night',
      'Fatty or fried foods',
      'Coffee, alcohol, or chocolate',
      'Certain medications (aspirin, ibuprofen)',
      'Hiatal hernia'
    ],
    diagnosis: 'Diagnosis may involve upper endoscopy (to visualize esophageal damage), 24-hour pH monitoring (measures acid exposure), esophageal manometry (measures muscle function), and barium swallow X-ray. Many cases are diagnosed based on symptoms and response to treatment.',
    treatment: 'Treatment includes lifestyle modifications, over-the-counter antacids, H2 receptor blockers (famotidine), and proton pump inhibitors (omeprazole, pantoprazole). Surgery (fundoplication) may be considered for severe cases not responding to medication. Dietary changes are a key component.',
    prevention: [
      'Maintain a healthy weight',
      'Eat smaller, more frequent meals',
      'Avoid eating 2-3 hours before bedtime',
      'Elevate the head of the bed 6-8 inches',
      'Avoid trigger foods (spicy, fatty, acidic, chocolate, mint)',
      'Quit smoking',
      'Wear loose-fitting clothing',
      'Limit alcohol and caffeine'
    ],
    whenToSeeDoctor: [
      'Heartburn more than twice a week',
      'Difficulty swallowing or painful swallowing',
      'Unexplained weight loss',
      'Persistent nausea or vomiting',
      'Symptoms not improving with OTC medications after 2 weeks',
      'Chest pain (always rule out cardiac causes first)'
    ],
    relatedSymptoms: ['chest-pain', 'difficulty-swallowing', 'cough', 'sore-throat'],
    relatedConditions: ['gastritis', 'esophageal-stricture', 'barretts-esophagus'],
    relatedBlogs: [],
    faq: [
      { question: 'Is GERD the same as heartburn?', answer: 'Heartburn is a symptom — a burning sensation in the chest. GERD is the disease — chronic acid reflux occurring frequently enough to cause symptoms or complications.' },
      { question: 'Can GERD cause cancer?', answer: 'Long-term, untreated GERD can lead to Barrett\'s esophagus, a precancerous condition. While the risk of esophageal cancer is low, regular monitoring is important for Barrett\'s patients.' },
      { question: 'What sleeping position is best for GERD?', answer: 'Sleep on your left side with the head elevated 6-8 inches. This position keeps the stomach below the esophagus and uses gravity to reduce reflux.' }
    ]
  },
  {
    slug: 'osteoarthritis',
    name: 'Osteoarthritis',
    metaTitle: 'Osteoarthritis: Symptoms, Treatment & Joint Care Tips',
    metaDescription: 'Learn about osteoarthritis, the most common form of arthritis. Understand symptoms, risk factors, and effective treatments for joint pain and stiffness.',
    category: 'Musculoskeletal',
    overview: 'Osteoarthritis (OA) is the most common form of arthritis, affecting millions of people worldwide. It occurs when the protective cartilage that cushions the ends of bones in joints gradually wears down over time, leading to pain, stiffness, and reduced mobility.\n\nOsteoarthritis most commonly affects the knees, hips, hands, and spine. While it cannot be reversed, treatments can slow progression, relieve pain, and improve joint function and quality of life.',
    symptoms: [
      'Joint pain during or after movement',
      'Joint stiffness, especially in the morning or after inactivity',
      'Tenderness when pressing on the joint',
      'Loss of flexibility and range of motion',
      'Grinding or crackling sensation (crepitus) during joint movement',
      'Bone spurs (hard lumps around the joint)',
      'Swelling around the joint'
    ],
    causes: [
      'Gradual breakdown of joint cartilage from wear and tear',
      'Changes in the bone, connective tissue, and joint lining',
      'Previous joint injury or surgery',
      'Genetic factors affecting cartilage quality'
    ],
    riskFactors: [
      'Age over 50',
      'Female sex (more common after menopause)',
      'Obesity (excess weight stresses weight-bearing joints)',
      'Previous joint injury',
      'Repetitive stress on joints (occupational)',
      'Genetics',
      'Bone deformities'
    ],
    diagnosis: 'Diagnosis involves physical examination, X-rays (showing joint space narrowing, bone spurs), and sometimes MRI for detailed assessment. Blood tests may be done to rule out other forms of arthritis (rheumatoid arthritis, gout). Joint fluid analysis may be performed.',
    treatment: 'Treatment includes exercise (especially low-impact), weight management, physical therapy, pain medications (acetaminophen, NSAIDs), topical treatments, corticosteroid injections, hyaluronic acid injections, and joint replacement surgery for severe cases. A combination approach works best.',
    prevention: [
      'Maintain a healthy weight to reduce joint stress',
      'Stay physically active with low-impact exercises',
      'Protect joints from injury during sports',
      'Strengthen muscles around joints',
      'Maintain good posture',
      'Avoid repetitive stress on joints when possible',
      'Eat an anti-inflammatory diet'
    ],
    whenToSeeDoctor: [
      'Joint pain or stiffness that persists or worsens',
      'Joint pain interfering with daily activities',
      'Joint swelling or redness',
      'Decreased range of motion in a joint',
      'Pain not adequately controlled with OTC medications',
      'Considering joint replacement surgery'
    ],
    relatedSymptoms: ['joint-pain', 'muscle-stiffness', 'back-pain', 'difficulty-walking'],
    relatedConditions: ['rheumatoid-arthritis', 'gout', 'bursitis'],
    relatedBlogs: [],
    faq: [
      { question: 'Does osteoarthritis get worse over time?', answer: 'OA is generally progressive, but the rate varies. Regular exercise, weight management, and appropriate treatment can significantly slow progression and maintain joint function.' },
      { question: 'Is walking good for osteoarthritis?', answer: 'Yes, walking is one of the best exercises for OA. It strengthens muscles around joints, maintains flexibility, and helps with weight management. Start gradually and increase distance over time.' },
      { question: 'Can osteoarthritis be prevented?', answer: 'While you cannot completely prevent OA, maintaining a healthy weight, staying active, protecting joints from injury, and building strong muscles can significantly reduce your risk.' }
    ]
  },
  {
    slug: 'urinary-tract-infection',
    name: 'Urinary Tract Infection (UTI)',
    metaTitle: 'UTI: Symptoms, Causes, Treatment & Prevention',
    metaDescription: 'Complete guide to urinary tract infections including symptoms, causes, antibiotic treatment, and prevention tips especially for women.',
    category: 'Infectious',
    overview: 'A urinary tract infection (UTI) is an infection in any part of the urinary system — kidneys, ureters, bladder, or urethra. Most infections involve the lower urinary tract (bladder and urethra). Women are at greater risk of developing UTIs than men.\n\nUTIs are one of the most common bacterial infections, affecting millions of people annually. Most UTIs are easily treated with antibiotics, but recurrent or untreated UTIs can lead to serious complications including kidney infection.',
    symptoms: [
      'Strong, persistent urge to urinate',
      'Burning sensation during urination',
      'Passing frequent, small amounts of urine',
      'Cloudy or strong-smelling urine',
      'Pink, red, or cola-colored urine (blood in urine)',
      'Pelvic pain in women',
      'Fever and chills (if infection reaches kidneys)',
      'Back or flank pain (kidney infection)'
    ],
    causes: [
      'Escherichia coli (E. coli) bacteria (most common cause)',
      'Other bacteria entering the urinary tract through the urethra',
      'Sexual activity introducing bacteria',
      'Catheter use in healthcare settings'
    ],
    riskFactors: [
      'Female anatomy (shorter urethra)',
      'Sexual activity',
      'Certain types of birth control (diaphragms, spermicides)',
      'Menopause (hormonal changes)',
      'Urinary tract abnormalities',
      'Kidney stones or enlarged prostate blocking urine flow',
      'Weakened immune system',
      'Catheter use'
    ],
    diagnosis: 'Diagnosis includes urinalysis (checking for white blood cells, red blood cells, bacteria), urine culture (identifying the specific bacteria and antibiotic sensitivity), and sometimes imaging (ultrasound, CT) for recurrent UTIs to check for structural abnormalities.',
    treatment: 'Antibiotics are the standard treatment, with the type and duration depending on the severity and location of infection. Common antibiotics include nitrofurantoin, trimethoprim-sulfamethoxazole, and fosfomycin. Increased fluid intake and pain relievers support recovery. Kidney infections may require IV antibiotics.',
    prevention: [
      'Drink plenty of water',
      'Urinate frequently and do not hold urine',
      'Wipe from front to back after using the bathroom',
      'Urinate after sexual intercourse',
      'Avoid irritating feminine products',
      'Consider cranberry products (some evidence for prevention)',
      'Change birth control method if contributing to recurrent UTIs',
      'Wear cotton underwear and loose-fitting clothing'
    ],
    whenToSeeDoctor: [
      'Symptoms of a UTI (burning, urgency, frequency)',
      'Blood in urine',
      'Fever with urinary symptoms',
      'Back or flank pain',
      'Symptoms returning after completing antibiotics',
      'More than 3 UTIs in a year'
    ],
    relatedSymptoms: ['frequent-urination', 'painful-urination', 'fever', 'back-pain'],
    relatedConditions: ['kidney-infection', 'kidney-stones', 'interstitial-cystitis'],
    relatedBlogs: [],
    faq: [
      { question: 'Can a UTI go away on its own?', answer: 'Some mild UTIs may resolve without antibiotics, but this risks the infection spreading to the kidneys. Antibiotic treatment is recommended to clear the infection quickly and prevent complications.' },
      { question: 'Why do women get more UTIs than men?', answer: 'Women have a shorter urethra, which means bacteria have a shorter distance to travel to reach the bladder. Hormonal changes, sexual activity, and anatomy all contribute to higher risk.' },
      { question: 'Does cranberry juice prevent UTIs?', answer: 'Some studies suggest cranberry products may help prevent UTIs by preventing bacteria from adhering to urinary tract walls. However, cranberry juice cannot treat an existing UTI.' }
    ]
  },
  {
    slug: 'sinusitis',
    name: 'Sinusitis',
    metaTitle: 'Sinusitis: Symptoms, Types & Effective Treatment',
    metaDescription: 'Learn about sinusitis (sinus infection) symptoms, acute vs chronic types, treatment options, and when antibiotics are truly needed.',
    category: 'ENT',
    overview: 'Sinusitis is inflammation or swelling of the tissue lining the sinuses — air-filled spaces in the skull behind the forehead, cheeks, and eyes. When sinuses become blocked and filled with fluid, germs can grow and cause infection.\n\nSinusitis can be acute (lasting less than 4 weeks, usually after a cold), subacute (4-12 weeks), chronic (more than 12 weeks), or recurrent (several acute episodes per year). Most cases of acute sinusitis are viral and resolve without antibiotics.',
    symptoms: [
      'Facial pain or pressure, especially around the cheeks, forehead, or between the eyes',
      'Nasal congestion and blockage',
      'Thick, discolored nasal discharge (yellow or green)',
      'Reduced sense of smell and taste',
      'Headache',
      'Post-nasal drip (mucus dripping down the throat)',
      'Cough (especially at night)',
      'Bad breath (halitosis)',
      'Fatigue'
    ],
    causes: [
      'Viral infections (most common — after a cold)',
      'Bacterial infections (secondary to viral sinusitis)',
      'Allergies causing sinus inflammation',
      'Nasal polyps blocking sinus drainage',
      'Deviated nasal septum'
    ],
    riskFactors: [
      'Recent upper respiratory infection (cold)',
      'Allergies (allergic rhinitis)',
      'Nasal polyps',
      'Deviated septum',
      'Smoking or secondhand smoke exposure',
      'Weakened immune system',
      'Dental infections'
    ],
    diagnosis: 'Acute sinusitis is usually diagnosed based on symptoms and physical examination. For chronic or recurrent cases, nasal endoscopy (looking inside the nose with a camera) and CT scan of the sinuses help assess the extent of disease. Allergy testing may identify contributing factors.',
    treatment: 'Most acute sinusitis resolves with supportive care: saline nasal irrigation, decongestants (short-term), pain relievers, and steam inhalation. Antibiotics are reserved for bacterial sinusitis (symptoms lasting more than 10 days or worsening after initial improvement). Chronic sinusitis may require nasal corticosteroid sprays, longer antibiotic courses, or surgery.',
    prevention: [
      'Practice regular nasal irrigation with saline solution',
      'Manage allergies effectively',
      'Avoid smoking and secondhand smoke',
      'Use a humidifier to keep nasal passages moist',
      'Wash hands frequently to prevent colds',
      'Avoid diving or swimming in polluted water',
      'Stay hydrated'
    ],
    whenToSeeDoctor: [
      'Symptoms lasting more than 10 days without improvement',
      'Severe facial pain or headache',
      'High fever with sinus symptoms',
      'Symptoms worsening after initial improvement',
      'Multiple sinus infections per year',
      'Swelling around the eyes'
    ],
    relatedSymptoms: ['headache', 'cough', 'sore-throat', 'fever'],
    relatedConditions: ['allergic-rhinitis', 'nasal-polyps', 'bronchitis'],
    relatedBlogs: ['allergy-season-preparation-tips-57'],
    faq: [
      { question: 'Do I need antibiotics for a sinus infection?', answer: 'Most sinus infections are viral and do not need antibiotics. Antibiotics are indicated when symptoms last more than 10 days, worsen after initial improvement, or are very severe (high fever, facial pain).' },
      { question: 'How long does sinusitis last?', answer: 'Acute viral sinusitis typically resolves within 7-10 days. Bacterial sinusitis may last 10-14 days. Chronic sinusitis persists for 12 weeks or longer despite treatment.' },
      { question: 'Is sinusitis contagious?', answer: 'Sinusitis itself is not contagious, but the viral infections that cause it can spread. Practice good hygiene to avoid spreading cold viruses.' }
    ]
  },
  {
    slug: 'hypothyroidism',
    name: 'Hypothyroidism',
    metaTitle: 'Hypothyroidism: Symptoms, Diagnosis & Treatment',
    metaDescription: 'Understand hypothyroidism (underactive thyroid) symptoms, causes, and treatment. Learn how thyroid hormone replacement restores normal function.',
    category: 'Endocrine',
    overview: 'Hypothyroidism is a condition in which the thyroid gland does not produce enough thyroid hormones. The thyroid — a small butterfly-shaped gland at the front of the neck — controls metabolism, energy, and many body functions. When thyroid hormone levels are low, body processes slow down.\n\nHypothyroidism is common, especially in women over 60, and develops gradually. It is easily diagnosed with blood tests and effectively treated with daily thyroid hormone replacement medication.',
    symptoms: [
      'Fatigue and sluggishness',
      'Weight gain and difficulty losing weight',
      'Cold intolerance',
      'Dry skin and hair',
      'Hair loss',
      'Constipation',
      'Muscle weakness and aches',
      'Depression',
      'Memory problems and difficulty concentrating',
      'Elevated cholesterol levels',
      'Puffy face and swelling'
    ],
    causes: [
      'Hashimoto\'s thyroiditis (autoimmune — most common cause)',
      'Thyroid surgery or radioactive iodine treatment',
      'Certain medications (lithium, amiodarone)',
      'Iodine deficiency (common in some developing regions)',
      'Pituitary gland disorders',
      'Congenital hypothyroidism'
    ],
    riskFactors: [
      'Female sex',
      'Age over 60',
      'Family history of thyroid disease',
      'Autoimmune conditions (type 1 diabetes, rheumatoid arthritis)',
      'Previous thyroid surgery or radiation',
      'Pregnancy or recent delivery',
      'Iodine imbalance'
    ],
    diagnosis: 'Diagnosed through blood tests: TSH (thyroid stimulating hormone) is elevated in hypothyroidism, and free T4 is low. Anti-thyroid antibodies (anti-TPO) confirm Hashimoto\'s thyroiditis. TSH is the most sensitive initial screening test.',
    treatment: 'Treatment is daily oral levothyroxine (synthetic thyroid hormone). The dose is adjusted based on TSH levels checked every 6-8 weeks initially, then annually once stable. Take medication on an empty stomach, 30-60 minutes before breakfast. Treatment is usually lifelong.',
    prevention: [
      'Ensure adequate iodine intake (iodized salt)',
      'Regular thyroid function screening if at risk',
      'Be aware of family history of thyroid disease',
      'Monitor thyroid function during pregnancy',
      'Avoid excessive iodine supplementation',
      'Regular health check-ups after age 35'
    ],
    whenToSeeDoctor: [
      'Persistent unexplained fatigue',
      'Unexplained weight gain',
      'Feeling cold when others are comfortable',
      'Dry skin and hair loss',
      'Depression that does not respond to treatment',
      'Family history of thyroid disease and experiencing symptoms',
      'Irregular menstrual periods'
    ],
    relatedSymptoms: ['fatigue', 'constipation', 'body-aches', 'insomnia'],
    relatedConditions: ['hashimotos-thyroiditis', 'goiter', 'hyperthyroidism'],
    relatedBlogs: ['thyroid-disorders-a-primer-13'],
    faq: [
      { question: 'Is hypothyroidism a lifelong condition?', answer: 'In most cases, yes. Hypothyroidism from Hashimoto\'s or thyroid surgery is permanent and requires lifelong medication. Some cases (postpartum thyroiditis, medication-induced) may be temporary.' },
      { question: 'Can you lose weight with hypothyroidism?', answer: 'Yes, once thyroid hormone levels are normalized with medication, weight management becomes more achievable with proper diet and exercise.' },
      { question: 'How often should thyroid levels be checked?', answer: 'Every 6-8 weeks when starting or adjusting medication, then annually once stable. More frequent testing may be needed during pregnancy.' }
    ]
  }
];

export const getConditionBySlug = (slug: string): ConditionEntry | undefined => {
  return conditions.find(c => c.slug === slug);
};

export const getConditionsByCategory = (category: string): ConditionEntry[] => {
  return conditions.filter(c => c.category === category);
};

export const getConditionCategories = (): string[] => {
  return [...new Set(conditions.map(c => c.category))];
};
