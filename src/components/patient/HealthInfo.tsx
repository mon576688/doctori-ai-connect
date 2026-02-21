import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Heart, AlertTriangle, Pill, Plus, X, Activity, Weight, Ruler } from 'lucide-react';

interface HealthData {
  medical_conditions: string[];
  allergies: string[];
  medications: string[];
  weight: number | null;
  height: number | null;
}

function HealthSection({
  title,
  description,
  icon: Icon,
  items,
  placeholder,
  onAdd,
  onRemove,
  variant,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  items: string[];
  placeholder: string;
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  variant: 'default' | 'destructive' | 'secondary';
}) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (items.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning('Already added');
      return;
    }
    onAdd(trimmed);
    setInput('');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
              <Badge key={idx} variant={variant} className="gap-1 pr-1">
                {item}
                <button
                  onClick={() => onRemove(idx)}
                  className="ml-1 rounded-full p-0.5 hover:bg-background/20 transition-colors"
                  aria-label={`Remove ${item}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">None added yet</p>
        )}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            className="text-sm"
          />
          <Button size="sm" onClick={handleAdd} disabled={!input.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HealthInfo() {
  const { user } = useAuth();
  const [data, setData] = useState<HealthData>({
    medical_conditions: [],
    allergies: [],
    medications: [],
    weight: null,
    height: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('medical_conditions, allergies, medications, weight, height')
        .eq('id', user.id)
        .single();
      if (!error && profile) {
        setData({
          medical_conditions: (profile.medical_conditions as string[]) || [],
          allergies: (profile.allergies as string[]) || [],
          medications: (profile.medications as string[]) || [],
          weight: profile.weight ? Number(profile.weight) : null,
          height: profile.height ? Number(profile.height) : null,
        });
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const updateField = async (field: 'medical_conditions' | 'allergies' | 'medications', value: string[]) => {
    const prev = data[field];
    setData(d => ({ ...d, [field]: value }));

    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', user!.id);

    if (error) {
      setData(d => ({ ...d, [field]: prev }));
      toast.error('Failed to save changes');
    } else {
      toast.success('Updated successfully');
    }
  };

  const bmi =
    data.weight && data.height
      ? (data.weight / Math.pow(data.height / 100, 2)).toFixed(1)
      : null;

  const bmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-yellow-600' };
    if (val < 25) return { label: 'Normal', color: 'text-green-600' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="py-8">
              <div className="h-4 bg-muted rounded animate-pulse w-1/3 mb-3" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <HealthSection
        title="Health Conditions"
        description="Chronic or ongoing conditions (e.g., Diabetes, Hypertension)"
        icon={Heart}
        items={data.medical_conditions}
        placeholder="Add a condition..."
        variant="default"
        onAdd={(item) => updateField('medical_conditions', [...data.medical_conditions, item])}
        onRemove={(idx) => updateField('medical_conditions', data.medical_conditions.filter((_, i) => i !== idx))}
      />

      <HealthSection
        title="Allergies"
        description="Known allergies (e.g., Penicillin, Peanuts, Dust)"
        icon={AlertTriangle}
        items={data.allergies}
        placeholder="Add an allergy..."
        variant="destructive"
        onAdd={(item) => updateField('allergies', [...data.allergies, item])}
        onRemove={(idx) => updateField('allergies', data.allergies.filter((_, i) => i !== idx))}
      />

      <HealthSection
        title="Current Medications"
        description="Medications you're currently taking"
        icon={Pill}
        items={data.medications}
        placeholder="Add a medication..."
        variant="secondary"
        onAdd={(item) => updateField('medications', [...data.medications, item])}
        onRemove={(idx) => updateField('medications', data.medications.filter((_, i) => i !== idx))}
      />

      {(data.weight || data.height) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              BMI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm">
              {data.weight && (
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span>Weight: <strong>{data.weight} kg</strong></span>
                </div>
              )}
              {data.height && (
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span>Height: <strong>{data.height} cm</strong></span>
                </div>
              )}
              {bmi && (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>
                    BMI: <strong>{bmi}</strong>{' '}
                    <span className={bmiCategory(parseFloat(bmi)).color}>
                      ({bmiCategory(parseFloat(bmi)).label})
                    </span>
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
