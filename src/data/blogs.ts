export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=500&fit=crop&q=80`;

const make = (id: number, title: string, category: string, date: string, imageUrl: string): BlogPost => ({
  id,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id,
  title,
  excerpt: 'Actionable guidance from Doctori AI on ' + title.toLowerCase() + '. Practical, trustworthy, and easy to follow.',
  category,
  readTime: `${4 + (id % 5)} min read`,
  date,
  image: imageUrl,
});

// Verified working Unsplash CDN photo IDs grouped by topic
const IMAGES = {
  // Children & Family
  childFever: img('1555252333-9f8e92e65df9'),
  childVaccine: img('1581594693702-fbdc51b2763b'),
  childCold: img('1588776814546-daab30f310ce'),
  childLunch: img('1498837167922-ddd27525d352'),
  childDehydration: img('1551076805-e1869033e561'),
  pediatrician: img('1505751172876-fa1923c5c528'),
  screenTime: img('1573497019940-1c28c88b4f3e'),
  // Medical / Disease
  dengue: img('1584820927498-cfe5211fd8bf'),
  bloodPressure: img('1559757175-5700dde675bc'),
  diabetes: img('1550831107-1553da8c8464'),
  asthma: img('1571019613576-2b22c76fd955'),
  tuberculosis: img('1576091160550-2173dba999ef'),
  thyroid: img('1579684385127-1ef15d508118'),
  migraine: img('1540206395-68808572332f'),
  // Healthy Living
  sleep: img('1531353826977-0941b4779a1c'),
  meditation: img('1506126613408-eca07ce68773'),
  water: img('1548839140-29a749e1cf4d'),
  homeWorkout: img('1534438327276-14e5300c3a48'),
  healthyHabits: img('1490645935967-10de6ba17061'),
  sunSafety: img('1507525428034-b723cf961d3e'),
  nightSleep: img('1541781774459-bb2af2f05b55'),
  // Men's Health
  heartHealth: img('1530026405186-ed1f139313f8'),
  prostate: img('1576091160399-112ba8d25d1d'),
  fitness40: img('1517836357463-d25dfeac3438'),
  workStress: img('1507003211169-0a1dd7228f2d'),
  muscle: img('1532550907401-a500c9a57435'),
  hairLoss: img('1556740738-b6a63e27c4df'),
  // Nutrition & Fitness
  balancedPlate: img('1512069772995-ec65ed45afd6'),
  walking: img('1538805060514-97d9cc17730c'),
  protein: img('1547592180-85f173990554'),
  mealPrep: img('1512621776951-a57141f2eefd'),
  strength: img('1534438327276-14e5300c3a48'),
  fiber: img('1457296898342-cdd24585d095'),
  cardio: img('1518611012118-696072aa579a'),
  // Symptoms
  chestPain: img('1530026405186-ed1f139313f8'),
  cough: img('1584515933487-779824d29309'),
  fever: img('1584820927498-cfe5211fd8bf'),
  breathing: img('1571019613454-1cb2f99b2d8b'),
  abdominalPain: img('1573497491765-dccce02b29df'),
  headache: img('1540206395-68808572332f'),
  dizziness: img('1576091160550-2173dba999ef'),
  // Treatments & Prevention
  antibiotics: img('1587854692152-cbe660dbde88'),
  vaccination: img('1581594693702-fbdc51b2763b'),
  firstAid: img('1603398938378-e54eab446dde'),
  flu: img('1584515933487-779824d29309'),
  cholesterol: img('1494390248081-4e521a5940db'),
  backPain: img('1544367567-0f2fcb009e0b'),
  // Women's Health
  pcos: img('1571019613454-1cb2f99b2d8b'),
  ironDeficiency: img('1494390248081-4e521a5940db'),
  breastExam: img('1579684385127-1ef15d508118'),
  prenatal: img('1512069772995-ec65ed45afd6'),
  periodPain: img('1559757175-5700dde675bc'),
  menopause: img('1576091160399-112ba8d25d1d'),
  // General
  drinkingWater: img('1548839140-29a749e1cf4d'),
  weightLoss: img('1490645935967-10de6ba17061'),
  ergonomics: img('1524758631624-e2822e304c36'),
  allergy: img('1584820927498-cfe5211fd8bf'),
  morningRoutine: img('1506126613408-eca07ce68773'),
  foodLabels: img('1512621776951-a57141f2eefd'),
  mindfulEating: img('1498837167922-ddd27525d352'),
  // Mental Health
  supplements: img('1550831107-1553da8c8464'),
  anxiety: img('1506126613408-eca07ce68773'),
  panicAttack: img('1573497620053-ea5300f94f21'),
  // SEO posts
  bloodTest: img('1579684385127-1ef15d508118'),
  acidReflux: img('1573497491765-dccce02b29df'),
  fatigue: img('1531353826977-0941b4779a1c'),
  backExercise: img('1544367567-0f2fcb009e0b'),
  stroke: img('1530026405186-ed1f139313f8'),
  inflammation: img('1490645935967-10de6ba17061'),
  heartAttackWomen: img('1538108149393-fbbd81895907'),
};

export const blogPosts: BlogPost[] = [
  // Children's Health (1-7)
  make(1, "Child Fever: What Parents Should Know", "Children's Health", '2025-07-01', IMAGES.childFever),
  make(2, "Common Childhood Vaccines Explained", "Children's Health", '2025-06-28', IMAGES.childVaccine),
  make(3, "Managing Cough and Cold in Kids", "Children's Health", '2025-06-25', IMAGES.childCold),
  make(4, "Healthy School Lunchbox Ideas", "Children's Health", '2025-06-22', IMAGES.childLunch),
  make(5, "Recognizing Dehydration in Children", "Children's Health", '2025-06-18', IMAGES.childDehydration),
  make(6, "When to See a Pediatrician", "Children's Health", '2025-06-15', IMAGES.pediatrician),
  make(7, "Screen Time Balance for Kids", "Children's Health", '2025-06-12', IMAGES.screenTime),
  // Diseases and Conditions (8-14)
  make(8, "Understanding Dengue Symptoms", "Diseases and Conditions", '2025-06-09', IMAGES.dengue),
  make(9, "Hypertension Basics", "Diseases and Conditions", '2025-06-06', IMAGES.bloodPressure),
  make(10, "Type 2 Diabetes Early Signs", "Diseases and Conditions", '2025-06-03', IMAGES.diabetes),
  make(11, "Asthma Triggers and Control", "Diseases and Conditions", '2025-05-31', IMAGES.asthma),
  make(12, "Tuberculosis Awareness", "Diseases and Conditions", '2025-05-28', IMAGES.tuberculosis),
  make(13, "Thyroid Disorders: A Primer", "Diseases and Conditions", '2025-05-25', IMAGES.thyroid),
  make(14, "Migraine vs Headache", "Diseases and Conditions", '2025-05-22', IMAGES.migraine),
  // Healthy Living (15-21)
  make(15, "Daily Habits for Better Sleep", "Healthy Living", '2025-05-19', IMAGES.sleep),
  make(16, "Stress Management Techniques", "Healthy Living", '2025-05-16', IMAGES.meditation),
  make(17, "Hydration: How Much Water?", "Healthy Living", '2025-05-13', IMAGES.water),
  make(18, "Building a Simple Home Workout", "Healthy Living", '2025-05-10', IMAGES.homeWorkout),
  make(19, "Healthy Habits for Busy People", "Healthy Living", '2025-05-07', IMAGES.healthyHabits),
  make(20, "Sun Safety and Skin Care", "Healthy Living", '2025-05-04', IMAGES.sunSafety),
  make(21, "Healthy Sleep for Shift Workers", "Healthy Living", '2025-05-01', IMAGES.nightSleep),
  // Men's Health (22-27)
  make(22, "Men's Heart Health Essentials", "Men's Health", '2025-04-28', IMAGES.heartHealth),
  make(23, "Prostate Health Awareness", "Men's Health", '2025-04-25', IMAGES.prostate),
  make(24, "Fitness After 40: Safe Routines", "Men's Health", '2025-04-22', IMAGES.fitness40),
  make(25, "Managing Work Stress for Men", "Men's Health", '2025-04-19', IMAGES.workStress),
  make(26, "Nutrition Tips for Muscle Health", "Men's Health", '2025-04-16', IMAGES.muscle),
  make(27, "Understanding Hair Loss Causes", "Men's Health", '2025-04-13', IMAGES.hairLoss),
  // Nutrition and Fitness (28-34)
  make(28, "Balanced Plate: Protein, Carbs, Fats", "Nutrition and Fitness", '2025-04-10', IMAGES.balancedPlate),
  make(29, "Beginner's Guide to Walking Workouts", "Nutrition and Fitness", '2025-04-07', IMAGES.walking),
  make(30, "Affordable High-Protein Foods", "Nutrition and Fitness", '2025-04-04', IMAGES.protein),
  make(31, "Meal Prep for Busy Weeks", "Nutrition and Fitness", '2025-04-01', IMAGES.mealPrep),
  make(32, "Strength Training Basics at Home", "Nutrition and Fitness", '2025-03-29', IMAGES.strength),
  make(33, "Fiber-Rich Foods for Gut Health", "Nutrition and Fitness", '2025-03-26', IMAGES.fiber),
  make(34, "Cardio vs Strength: What to Choose?", "Nutrition and Fitness", '2025-03-23', IMAGES.cardio),
  // Symptoms and Diagnosis (35-41)
  make(35, "When Chest Pain Is an Emergency", "Symptoms and Diagnosis", '2025-03-20', IMAGES.chestPain),
  make(36, "Persistent Cough: What It Means", "Symptoms and Diagnosis", '2025-03-17', IMAGES.cough),
  make(37, "Fever Patterns and What They Signal", "Symptoms and Diagnosis", '2025-03-14', IMAGES.fever),
  make(38, "Shortness of Breath: Red Flags", "Symptoms and Diagnosis", '2025-03-11', IMAGES.breathing),
  make(39, "Abdominal Pain: When to Worry", "Symptoms and Diagnosis", '2025-03-08', IMAGES.abdominalPain),
  make(40, "Headache Types Simplified", "Symptoms and Diagnosis", '2025-03-05', IMAGES.headache),
  make(41, "Dizziness: Causes and Care", "Symptoms and Diagnosis", '2025-03-02', IMAGES.dizziness),
  // Treatments and Prevention (42-47)
  make(42, "Antibiotics: When They Help", "Treatments and Prevention", '2025-02-27', IMAGES.antibiotics),
  make(43, "Vaccination Myths vs Facts", "Treatments and Prevention", '2025-02-24', IMAGES.vaccination),
  make(44, "Home First Aid Essentials", "Treatments and Prevention", '2025-02-21', IMAGES.firstAid),
  make(45, "Preventing Seasonal Flu", "Treatments and Prevention", '2025-02-18', IMAGES.flu),
  make(46, "Managing High Cholesterol", "Treatments and Prevention", '2025-02-15', IMAGES.cholesterol),
  make(47, "Back Pain: Prevention Basics", "Treatments and Prevention", '2025-02-12', IMAGES.backPain),
  // Women's Health (48-53)
  make(48, "PCOS: Signs and Lifestyle Tips", "Women's Health", '2025-02-09', IMAGES.pcos),
  make(49, "Iron Deficiency in Women", "Women's Health", '2025-02-06', IMAGES.ironDeficiency),
  make(50, "Breast Self-Exam: How-To", "Women's Health", '2025-02-03', IMAGES.breastExam),
  make(51, "Prenatal Nutrition Essentials", "Women's Health", '2025-01-31', IMAGES.prenatal),
  make(52, "Period Pain: Relief Tips", "Women's Health", '2025-01-28', IMAGES.periodPain),
  make(53, "Menopause: Common Symptoms", "Women's Health", '2025-01-25', IMAGES.menopause),
  // More General Wellness (54-60)
  make(54, "Safe Drinking Water at Home", "Healthy Living", '2025-01-22', IMAGES.drinkingWater),
  make(55, "Healthy Weight Loss Basics", "Nutrition and Fitness", '2025-01-19', IMAGES.weightLoss),
  make(56, "Office Ergonomics to Prevent Pain", "Healthy Living", '2025-01-16', IMAGES.ergonomics),
  make(57, "Allergy Season: Preparation Tips", "Diseases and Conditions", '2025-01-13', IMAGES.allergy),
  make(58, "Healthy Morning Routine", "Healthy Living", '2025-01-10', IMAGES.morningRoutine),
  make(59, "Reading Food Labels Simply", "Nutrition and Fitness", '2025-01-07', IMAGES.foodLabels),
  make(60, "Mindful Eating for Beginners", "Nutrition and Fitness", '2025-01-04', IMAGES.mindfulEating),
  // Mental Health & Treatments (61)
  make(61, "Which Supplements Can Boost the Effects of Antidepressants?", "Treatments and Prevention", '2025-07-15', IMAGES.supplements),
  // SEO-optimized posts (62-71)
  make(62, "How to Reduce Fever Naturally at Home", "Symptoms and Diagnosis", '2025-07-18', IMAGES.fever),
  make(63, "Why Do I Have Headaches Every Day?", "Symptoms and Diagnosis", '2025-07-20', IMAGES.headache),
  make(64, "Dengue Prevention Tips for Bangladesh", "Diseases and Conditions", '2025-07-22', IMAGES.dengue),
  make(65, "Best Foods to Lower Blood Sugar Naturally", "Nutrition and Fitness", '2025-07-24', IMAGES.balancedPlate),
  make(66, "Signs You May Have an Anxiety Disorder", "Mental Health", '2025-07-26', IMAGES.anxiety),
  make(67, "Understanding Your Blood Test Results", "Symptoms and Diagnosis", '2025-07-28', IMAGES.bloodTest),
  make(68, "Home Remedies for Sore Throat and Cough", "Treatments and Prevention", '2025-07-30', IMAGES.cough),
  make(69, "How to Manage Back Pain While Working from Home", "Healthy Living", '2025-08-01', IMAGES.ergonomics),
  make(70, "Complete Guide to Childhood Vaccination Schedule", "Children's Health", '2025-08-03', IMAGES.childVaccine),
  make(71, "Recognizing Heart Attack Warning Signs in Women", "Women's Health", '2025-08-05', IMAGES.heartAttackWomen),
  // High-ranking SEO posts (72-81)
  make(72, "How Long Does the Flu Last and When to See a Doctor", "Diseases and Conditions", '2025-08-07', IMAGES.flu),
  make(73, "What Causes Chest Pain When Breathing Deeply", "Symptoms and Diagnosis", '2025-08-09', IMAGES.chestPain),
  make(74, "How to Lower Blood Pressure Quickly and Naturally", "Healthy Living", '2025-08-11', IMAGES.bloodPressure),
  make(75, "Early Warning Signs of Diabetes You Should Not Ignore", "Diseases and Conditions", '2025-08-13', IMAGES.diabetes),
  make(76, "What Does a Panic Attack Feel Like vs Heart Attack", "Mental Health", '2025-08-15', IMAGES.panicAttack),
  make(77, "Foods That Fight Inflammation and Boost Immunity", "Nutrition and Fitness", '2025-08-17', IMAGES.inflammation),
  make(78, "How to Stop Acid Reflux and Heartburn at Night", "Treatments and Prevention", '2025-08-19', IMAGES.acidReflux),
  make(79, "Why Am I Always Tired Even After Sleeping Well", "Symptoms and Diagnosis", '2025-08-21', IMAGES.fatigue),
  make(80, "Best Exercises to Relieve Lower Back Pain Fast", "Nutrition and Fitness", '2025-08-23', IMAGES.backExercise),
  make(81, "How to Recognize Symptoms of a Stroke FAST", "Diseases and Conditions", '2025-08-25', IMAGES.stroke),
];
