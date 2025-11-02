import { useNavigate } from 'react-router-dom';
import { Stethoscope, Building2, UserCog } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';

export default function ProviderTypeSelect() {
  const navigate = useNavigate();
  const { setProviderType, city } = useBooking();

  const handleTypeSelect = (type: 'doctor' | 'hospital' | 'nurse') => {
    setProviderType(type);
    navigate('/booking/providers');
  };

  if (!city) {
    navigate('/booking/location');
    return null;
  }

  const providerTypes = [
    {
      type: 'doctor' as const,
      icon: Stethoscope,
      title: 'Doctor Consultation',
      description: 'Consult with experienced doctors for diagnosis and treatment',
    },
    {
      type: 'hospital' as const,
      icon: Building2,
      title: 'Hospital / Clinic',
      description: 'Book appointments at hospitals and specialized clinics',
    },
    {
      type: 'nurse' as const,
      icon: UserCog,
      title: 'Nurse Home Visit',
      description: 'Professional nursing care in the comfort of your home',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            What type of service do you need?
          </h1>
          <p className="text-muted-foreground">
            Select the type of healthcare service you're looking for in {city}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {providerTypes.map(({ type, icon: Icon, title, description }) => (
            <Card
              key={type}
              className="hover:shadow-float transition-all cursor-pointer group"
              onClick={() => handleTypeSelect(type)}
            >
              <CardHeader className="text-center py-8">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary" size={32} />
                </div>
                <CardTitle className="text-xl mb-2">{title}</CardTitle>
                <CardDescription className="text-sm">{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
