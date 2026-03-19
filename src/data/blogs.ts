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

const make = (id: number, title: string, category: string, date: string, unsplashId?: string): BlogPost => ({
  id,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id,
  title,
  excerpt: 'Actionable guidance from Doctori AI on ' + title.toLowerCase() + '. Practical, trustworthy, and easy to follow.',
  category,
  readTime: `${4 + (id % 5)} min read`,
  date,
  image: unsplashId
    ? `https://images.unsplash.com/photo-${unsplashId}?w=800&h=500&fit=crop&q=80`
    : `https://picsum.photos/seed/health-${id}/400/250`
});

export const blogPosts: BlogPost[] = [
  // Children's Health (1-7)
  make(1, "Child Fever: What Parents Should Know", "Children's Health", '2025-07-01', '1555252333-9f8e92e65df9'),
  make(2, "Common Childhood Vaccines Explained", "Children's Health", '2025-06-28', '1632053002928-2e591e930c93'),
  make(3, "Managing Cough and Cold in Kids", "Children's Health", '2025-06-25', '1588776814546-daab30f310ce'),
  make(4, "Healthy School Lunchbox Ideas", "Children's Health", '2025-06-22', '1498837167922-ddd27525d352'),
  make(5, "Recognizing Dehydration in Children", "Children's Health", '2025-06-18', '1564429238961-4b3d82be8f94'),
  make(6, "When to See a Pediatrician", "Children's Health", '2025-06-15', '1581594693702-fbdc51b2763b'),
  make(7, "Screen Time Balance for Kids", "Children's Health", '2025-06-12', '1596464716388-077b49f0e89c'),
  // Diseases and Conditions (8-14)
  make(8, "Understanding Dengue Symptoms", "Diseases and Conditions", '2025-06-09', '1584308666757-cb2a096c4650'),
  make(9, "Hypertension Basics", "Diseases and Conditions", '2025-06-06', '1559757175-5700dde675bc'),
  make(10, "Type 2 Diabetes Early Signs", "Diseases and Conditions", '2025-06-03', '1593491034932-d7c81e106aff'),
  make(11, "Asthma Triggers and Control", "Diseases and Conditions", '2025-05-31', '1631549916768-4b6a6b332ebc'),
  make(12, "Tuberculosis Awareness", "Diseases and Conditions", '2025-05-28', '1576091160550-2173dba999ef'),
  make(13, "Thyroid Disorders: A Primer", "Diseases and Conditions", '2025-05-25', '1579684385127-1ef15d508118'),
  make(14, "Migraine vs Headache", "Diseases and Conditions", '2025-05-22', '1616012480717-fd5e2e5e2e04'),
  // Healthy Living (15-21)
  make(15, "Daily Habits for Better Sleep", "Healthy Living", '2025-05-19', '1531353826977-0941b4779a1c'),
  make(16, "Stress Management Techniques", "Healthy Living", '2025-05-16', '1506126613408-eca07ce68773'),
  make(17, "Hydration: How Much Water?", "Healthy Living", '2025-05-13', '1548839140-29a749e1cf4d'),
  make(18, "Building a Simple Home Workout", "Healthy Living", '2025-05-10', '1571019614242-c5c5dee9f50c'),
  make(19, "Healthy Habits for Busy People", "Healthy Living", '2025-05-07', '1490645935967-10de6ba17061'),
  make(20, "Sun Safety and Skin Care", "Healthy Living", '2025-05-04', '1507525428034-b723cf961d3e'),
  make(21, "Healthy Sleep for Shift Workers", "Healthy Living", '2025-05-01', '1541781774459-bb2af2f05b55'),
  // Men's Health (22-27)
  make(22, "Men's Heart Health Essentials", "Men's Health", '2025-04-28', '1559757148-6c5b7e8f5e3a'),
  make(23, "Prostate Health Awareness", "Men's Health", '2025-04-25', '1576091160399-112ba8d25d1d'),
  make(24, "Fitness After 40: Safe Routines", "Men's Health", '2025-04-22', '1517836357463-d25dfeac3438'),
  make(25, "Managing Work Stress for Men", "Men's Health", '2025-04-19', '1507003211169-0a1dd7228f2d'),
  make(26, "Nutrition Tips for Muscle Health", "Men's Health", '2025-04-16', '1532550907401-a500c9a57435'),
  make(27, "Understanding Hair Loss Causes", "Men's Health", '2025-04-13', '1585747860036-2b5e76a98e45'),
  // Nutrition and Fitness (28-34)
  make(28, "Balanced Plate: Protein, Carbs, Fats", "Nutrition and Fitness", '2025-04-10', '1490818387583-1bab68ab889b'),
  make(29, "Beginner's Guide to Walking Workouts", "Nutrition and Fitness", '2025-04-07', '1476480862126-209bfaa8eaab'),
  make(30, "Affordable High-Protein Foods", "Nutrition and Fitness", '2025-04-04', '1547592180-85f173990554'),
  make(31, "Meal Prep for Busy Weeks", "Nutrition and Fitness", '2025-04-01', '1512621776951-a57141f2eefd'),
  make(32, "Strength Training Basics at Home", "Nutrition and Fitness", '2025-03-29', '1534438327276-14e5300c3a48'),
  make(33, "Fiber-Rich Foods for Gut Health", "Nutrition and Fitness", '2025-03-26', '1457296898342-cdd24585d095'),
  make(34, "Cardio vs Strength: What to Choose?", "Nutrition and Fitness", '2025-03-23', '1518611012118-696072aa579a'),
  // Symptoms and Diagnosis (35-41)
  make(35, "When Chest Pain Is an Emergency", "Symptoms and Diagnosis", '2025-03-20', '1628348068343-eb9f2f244538'),
  make(36, "Persistent Cough: What It Means", "Symptoms and Diagnosis", '2025-03-17', '1584515933487-779824d29309'),
  make(37, "Fever Patterns and What They Signal", "Symptoms and Diagnosis", '2025-03-14', '1584820927498-cfe5211fd8bf'),
  make(38, "Shortness of Breath: Red Flags", "Symptoms and Diagnosis", '2025-03-11', '1571019613454-1cb2f99b2d8b'),
  make(39, "Abdominal Pain: When to Worry", "Symptoms and Diagnosis", '2025-03-08', '1559757175-0eb30cd8c063'),
  make(40, "Headache Types Simplified", "Symptoms and Diagnosis", '2025-03-05', '1616012480717-fd5e2e5e2e04'),
  make(41, "Dizziness: Causes and Care", "Symptoms and Diagnosis", '2025-03-02', '1576091160550-2173dba999ef'),
  // Treatments and Prevention (42-47)
  make(42, "Antibiotics: When They Help", "Treatments and Prevention", '2025-02-27', '1584308666757-cb2a096c4650'),
  make(43, "Vaccination Myths vs Facts", "Treatments and Prevention", '2025-02-24', '1632053002928-2e591e930c93'),
  make(44, "Home First Aid Essentials", "Treatments and Prevention", '2025-02-21', '1603398938378-e54eab446dde'),
  make(45, "Preventing Seasonal Flu", "Treatments and Prevention", '2025-02-18', '1584515933487-779824d29309'),
  make(46, "Managing High Cholesterol", "Treatments and Prevention", '2025-02-15', '1505576399279-0d06b56c3d93'),
  make(47, "Back Pain: Prevention Basics", "Treatments and Prevention", '2025-02-12', '1544367567-0f2fcb009e0b'),
  // Women's Health (48-53)
  make(48, "PCOS: Signs and Lifestyle Tips", "Women's Health", '2025-02-09', '1571019613454-1cb2f99b2d8b'),
  make(49, "Iron Deficiency in Women", "Women's Health", '2025-02-06', '1505576399279-0d06b56c3d93'),
  make(50, "Breast Self-Exam: How-To", "Women's Health", '2025-02-03', '1579684385127-1ef15d508118'),
  make(51, "Prenatal Nutrition Essentials", "Women's Health", '2025-01-31', '1490818387583-1bab68ab889b'),
  make(52, "Period Pain: Relief Tips", "Women's Health", '2025-01-28', '1559757175-5700dde675bc'),
  make(53, "Menopause: Common Symptoms", "Women's Health", '2025-01-25', '1576091160399-112ba8d25d1d'),
  // More General Wellness (54-60)
  make(54, "Safe Drinking Water at Home", "Healthy Living", '2025-01-22', '1548839140-29a749e1cf4d'),
  make(55, "Healthy Weight Loss Basics", "Nutrition and Fitness", '2025-01-19', '1490645935967-10de6ba17061'),
  make(56, "Office Ergonomics to Prevent Pain", "Healthy Living", '2025-01-16', '1524758631624-e2822e304c36'),
  make(57, "Allergy Season: Preparation Tips", "Diseases and Conditions", '2025-01-13', '1584308666757-cb2a096c4650'),
  make(58, "Healthy Morning Routine", "Healthy Living", '2025-01-10', '1506126613408-eca07ce68773'),
  make(59, "Reading Food Labels Simply", "Nutrition and Fitness", '2025-01-07', '1512621776951-a57141f2eefd'),
  make(60, "Mindful Eating for Beginners", "Nutrition and Fitness", '2025-01-04', '1498837167922-ddd27525d352'),
  // Mental Health & Treatments (61)
  make(61, "Which Supplements Can Boost the Effects of Antidepressants?", "Treatments and Prevention", '2025-07-15', '1559757148-6c5b7e8f5e3a'),
  // New SEO-optimized posts (62-71)
  make(62, "How to Reduce Fever Naturally at Home", "Symptoms and Diagnosis", '2025-07-18', '1584820927498-cfe5211fd8bf'),
  make(63, "Why Do I Have Headaches Every Day?", "Symptoms and Diagnosis", '2025-07-20', '1616012480717-fd5e2e5e2e04'),
  make(64, "Dengue Prevention Tips for Bangladesh", "Diseases and Conditions", '2025-07-22', '1584308666757-cb2a096c4650'),
  make(65, "Best Foods to Lower Blood Sugar Naturally", "Nutrition and Fitness", '2025-07-24', '1490818387583-1bab68ab889b'),
  make(66, "Signs You May Have an Anxiety Disorder", "Mental Health", '2025-07-26', '1506126613408-eca07ce68773'),
  make(67, "Understanding Your Blood Test Results", "Symptoms and Diagnosis", '2025-07-28', '1579684385127-1ef15d508118'),
  make(68, "Home Remedies for Sore Throat and Cough", "Treatments and Prevention", '2025-07-30', '1584515933487-779824d29309'),
  make(69, "How to Manage Back Pain While Working from Home", "Healthy Living", '2025-08-01', '1524758631624-e2822e304c36'),
  make(70, "Complete Guide to Childhood Vaccination Schedule", "Children's Health", '2025-08-03', '1632053002928-2e591e930c93'),
  make(71, "Recognizing Heart Attack Warning Signs in Women", "Women's Health", '2025-08-05', '1628348068343-eb9f2f244538'),
  // High-ranking SEO posts (72-81)
  make(72, "How Long Does the Flu Last and When to See a Doctor", "Diseases and Conditions", '2025-08-07', '1584515933487-779824d29309'),
  make(73, "What Causes Chest Pain When Breathing Deeply", "Symptoms and Diagnosis", '2025-08-09', '1628348068343-eb9f2f244538'),
  make(74, "How to Lower Blood Pressure Quickly and Naturally", "Healthy Living", '2025-08-11', '1505576399279-0d06b56c3d93'),
  make(75, "Early Warning Signs of Diabetes You Should Not Ignore", "Diseases and Conditions", '2025-08-13', '1593491034932-d7c81e106aff'),
  make(76, "What Does a Panic Attack Feel Like vs Heart Attack", "Mental Health", '2025-08-15', '1559757148-6c5b7e8f5e3a'),
  make(77, "Foods That Fight Inflammation and Boost Immunity", "Nutrition and Fitness", '2025-08-17', '1490645935967-10de6ba17061'),
  make(78, "How to Stop Acid Reflux and Heartburn at Night", "Treatments and Prevention", '2025-08-19', '1559757175-5700dde675bc'),
  make(79, "Why Am I Always Tired Even After Sleeping Well", "Symptoms and Diagnosis", '2025-08-21', '1531353826977-0941b4779a1c'),
  make(80, "Best Exercises to Relieve Lower Back Pain Fast", "Nutrition and Fitness", '2025-08-23', '1544367567-0f2fcb009e0b'),
  make(81, "How to Recognize Symptoms of a Stroke FAST", "Diseases and Conditions", '2025-08-25', '1559757175-0eb30cd8c063'),
];
