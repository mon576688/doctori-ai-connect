import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const { toast } = useToast();

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!weightNum || !heightNum || weightNum <= 0 || heightNum <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid weight and height values',
        variant: 'destructive'
      });
      return;
    }

    // Calculate BMI (weight in kg / height in meters squared)
    const heightInMeters = heightNum / 100;
    const bmiValue = weightNum / (heightInMeters * heightInMeters);
    setBmi(parseFloat(bmiValue.toFixed(1)));

    // Determine BMI category
    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setCategory('Normal weight');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'Underweight':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Normal weight':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Overweight':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Obese':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return '';
    }
  };

  const getHealthTips = () => {
    switch (category) {
      case 'Underweight':
        return [
          'Increase calorie intake with nutrient-dense foods',
          'Focus on protein-rich meals',
          'Consider consulting a nutritionist',
          'Regular strength training exercises'
        ];
      case 'Normal weight':
        return [
          'Maintain balanced diet and exercise',
          'Stay hydrated',
          'Regular health check-ups',
          'Keep up the good work!'
        ];
      case 'Overweight':
        return [
          'Reduce calorie intake gradually',
          'Increase physical activity',
          'Focus on whole foods',
          'Consult healthcare provider for guidance'
        ];
      case 'Obese':
        return [
          'Consult healthcare provider immediately',
          'Create structured weight loss plan',
          'Regular physical activity',
          'Consider professional nutritional counseling'
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <Helmet>
        <title>BMI Calculator - Check Your Body Mass Index | Doctori AI</title>
        <meta name="description" content="Free BMI calculator to check your body mass index. Get instant BMI results with health recommendations. Calculate BMI using weight and height." />
        <meta name="keywords" content="BMI calculator, body mass index, health calculator, weight calculator, BMI check, health assessment" />
        <link rel="canonical" href="https://yourdomain.com/bmi-calculator" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="BMI Calculator - Check Your Body Mass Index | Doctori AI" />
        <meta property="og:description" content="Free BMI calculator to check your body mass index. Get instant BMI results with health recommendations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/bmi-calculator" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BMI Calculator - Check Your Body Mass Index" />
        <meta name="twitter:description" content="Free BMI calculator to check your body mass index. Get instant results." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "BMI Calculator",
            "description": "Calculate your Body Mass Index (BMI) and get personalized health recommendations",
            "url": "https://yourdomain.com/bmi-calculator",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* Header Section */}
          <header className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-primary p-4 rounded-full">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">BMI Calculator</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Calculate your Body Mass Index (BMI) and get personalized health recommendations
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Calculator Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Calculate Your BMI
                </CardTitle>
                <CardDescription>Enter your weight and height to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight in kilograms"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter your height in centimeters"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>

                <Button onClick={calculateBMI} className="w-full" size="lg">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate BMI
                </Button>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bmi !== null ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary mb-2">{bmi}</div>
                      <Badge className={`text-lg py-2 px-4 ${getCategoryColor()}`}>
                        {category}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Health Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {getHealthTips().map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your weight and height to see your BMI results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* BMI Categories Info */}
          <section className="mb-12">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Understanding BMI Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="font-semibold text-blue-700 mb-1">Underweight</div>
                    <div className="text-sm text-muted-foreground">Below 18.5</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="font-semibold text-green-700 mb-1">Normal</div>
                    <div className="text-sm text-muted-foreground">18.5 - 24.9</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="font-semibold text-yellow-700 mb-1">Overweight</div>
                    <div className="text-sm text-muted-foreground">25 - 29.9</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="font-semibold text-red-700 mb-1">Obese</div>
                    <div className="text-sm text-muted-foreground">30 and above</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SEO Content */}
          <article className="prose max-w-none">
            <Card className="shadow-card">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">What is BMI?</h2>
                <p className="text-muted-foreground">
                  Body Mass Index (BMI) is a simple calculation using a person's height and weight. 
                  The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is their height in metres squared.
                </p>
                
                <h3 className="text-xl font-semibold">How to Use This BMI Calculator</h3>
                <p className="text-muted-foreground">
                  Simply enter your weight in kilograms and your height in centimeters. Our calculator will instantly 
                  compute your BMI and provide you with personalized health recommendations based on your result.
                </p>

                <h3 className="text-xl font-semibold">Is BMI Accurate?</h3>
                <p className="text-muted-foreground">
                  While BMI is a useful screening tool, it's not a diagnostic tool. It doesn't account for muscle mass, 
                  bone density, or overall body composition. Always consult with a healthcare provider for a comprehensive 
                  health assessment.
                </p>
              </CardContent>
            </Card>
          </article>
        </div>
      </div>
    </>
  );
}
