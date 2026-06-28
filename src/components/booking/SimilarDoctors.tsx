import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Calendar, ArrowRight, Award, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBooking } from '@/contexts/BookingContext';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

interface SimilarDoctorsProps {
  currentDoctorId: string;
  specialty?: string;
  city?: string;
}

interface Candidate {
  id: string;
  name: string;
  specialty: string;
  city: string;
  photo_url: string;
  experience: number;
  consultation_fee: number;
  nextSlot: Date | null;
}

const formatNext = (d: Date | null) => {
  if (!d) return 'Schedule on request';
  const time = format(d, 'h:mm a');
  if (isToday(d)) return `Today, ${time}`;
  if (isTomorrow(d)) return `Tomorrow, ${time}`;
  return `${format(d, 'EEE, MMM d')} · ${time}`;
};

export const SimilarDoctors = ({ currentDoctorId, specialty, city }: SimilarDoctorsProps) => {
  const navigate = useNavigate();
  const { setProvider } = useBooking();
  const [doctors, setDoctors] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!specialty) {
        setLoading(false);
        return;
      }
      try {
        let query = supabase
          .from('providers_public')
          .select('id, name, first_name, last_name, specialty, city, photo_url, experience, years_experience, consultation_fee, provider_type')
          .neq('id', currentDoctorId)
          .eq('specialty', specialty)
          .limit(12);
        if (city) query = query.eq('city', city);
        const { data: providers, error } = await query;
        if (error) throw error;
        const candidates = (providers || []).map((p: any) => ({
          id: p.id,
          name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Doctor',
          specialty: p.specialty || 'General Practice',
          city: p.city || '',
          photo_url: p.photo_url || '/placeholder.svg',
          experience: p.years_experience || p.experience || 0,
          consultation_fee: p.consultation_fee || 0,
        }));

        if (candidates.length === 0) {
          if (!cancelled) {
            setDoctors([]);
            setLoading(false);
          }
          return;
        }

        const ids = candidates.map((c) => c.id);
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const endStr = format(addDays(new Date(), 30), 'yyyy-MM-dd');

        // Batch fetch availability_dates for all candidates
        const { data: dateSlots } = await supabase
          .from('availability_dates')
          .select('provider_id, date, time_slot, is_available, is_booked')
          .in('provider_id', ids)
          .gte('date', todayStr)
          .lte('date', endStr)
          .eq('is_available', true)
          .eq('is_booked', false)
          .order('date', { ascending: true })
          .order('time_slot', { ascending: true });

        // Batch fetch recurring slots as fallback
        const { data: weeklySlots } = await supabase
          .from('availability_slots')
          .select('provider_id, day_of_week, start_time, is_available')
          .in('provider_id', ids)
          .eq('is_available', true);

        const now = new Date();
        const nextMap = new Map<string, Date>();

        (dateSlots || []).forEach((s: any) => {
          if (nextMap.has(s.provider_id)) return;
          const dt = new Date(`${s.date}T${s.time_slot}`);
          if (dt > now) nextMap.set(s.provider_id, dt);
        });

        // Fallback via weekly recurrence
        candidates.forEach((c) => {
          if (nextMap.has(c.id)) return;
          const weekly = (weeklySlots || []).filter((w: any) => w.provider_id === c.id);
          if (weekly.length === 0) return;
          let best: Date | null = null;
          for (let offset = 0; offset < 14; offset++) {
            const day = addDays(now, offset);
            const dow = day.getDay();
            const matches = weekly.filter((w: any) => w.day_of_week === dow);
            for (const m of matches) {
              const [h, mi] = String(m.start_time).split(':').map(Number);
              const candidate = new Date(day);
              candidate.setHours(h, mi || 0, 0, 0);
              if (candidate > now && (!best || candidate < best)) best = candidate;
            }
            if (best) break;
          }
          if (best) nextMap.set(c.id, best);
        });

        const enriched: Candidate[] = candidates.map((c) => ({
          ...c,
          nextSlot: nextMap.get(c.id) || null,
        }));

        enriched.sort((a, b) => {
          const at = a.nextSlot?.getTime() ?? Number.MAX_SAFE_INTEGER;
          const bt = b.nextSlot?.getTime() ?? Number.MAX_SAFE_INTEGER;
          if (at !== bt) return at - bt;
          return b.experience - a.experience;
        });

        if (!cancelled) {
          setDoctors(enriched.slice(0, 6));
          setLoading(false);
        }
      } catch (e) {
        console.error('SimilarDoctors load error', e);
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentDoctorId, specialty, city]);

  const handleSelect = (c: Candidate) => {
    setProvider(c.id, {
      id: c.id,
      name: c.name,
      specialty: c.specialty,
      rating: 4.8,
      experience: c.experience,
      price: c.consultation_fee,
      photo_url: c.photo_url,
      latitude: 0,
      longitude: 0,
      address: c.city,
      bio: '',
      provider_type: 'doctor',
      duration: 30,
    });
    navigate(`/booking/provider/${c.id}`);
  };

  if (loading || doctors.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Similar Doctors</h2>
        <p className="text-sm text-muted-foreground">
          Same specialty{city ? ` in ${city}` : ''}. Different schedules so you can find a time that works.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((d) => (
          <Card
            key={d.id}
            className="shadow-card hover:shadow-medical transition-shadow cursor-pointer"
            onClick={() => handleSelect(d)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={d.photo_url}
                  alt={d.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-background shadow"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{d.name}</h3>
                  <Badge variant="secondary" className="mt-1">{d.specialty}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.8</span>
                <span className="flex items-center gap-1"><Award className="h-3 w-3" /> {d.experience}+ yrs</span>
                {d.city && (
                  <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" /> {d.city}</span>
                )}
              </div>
              <div className="flex items-center gap-2 rounded-md bg-primary/5 px-3 py-2 text-sm">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium text-primary">Next: {formatNext(d.nextSlot)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(d);
                }}
              >
                View Profile <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};