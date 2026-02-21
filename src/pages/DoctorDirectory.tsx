import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SEO } from "@/components/SEO";
import {
  Search,
  Stethoscope,
  MapPin,
  Building2,
  BriefcaseMedical,
  User,
  DollarSign,
  Clock,
} from "lucide-react";

const SPECIALTIES = [
  "Cardiologist", "Neurologist", "Gastroenterologist", "Orthopedic Surgeon",
  "Gynecologist", "Dermatologist", "ENT Specialist", "Psychiatrist",
  "Dentist", "Ophthalmologist", "Urologist", "Pulmonologist",
  "Endocrinologist", "Nephrologist", "General Physician", "Pediatrician",
  "Physiotherapist", "Oncologist",
];

const CITIES = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Rangpur",
  "Khulna", "Barisal", "Mymensingh", "Comilla", "Narayanganj",
  "Bogra", "Pabna", "Kushtia",
];

const DoctorDirectory = () => {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["directory-providers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("providers_public")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: hospitals = [] } = useQuery({
    queryKey: ["directory-hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: hospitalAssignments = [] } = useQuery({
    queryKey: ["directory-hospital-assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_hospital_assignments")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const name = `${p.first_name || ""} ${p.last_name || ""} ${p.name || ""}`.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        name.includes(q) ||
        (p.specialty || "").toLowerCase().includes(q) ||
        (p.city || "").toLowerCase().includes(q);
      const matchesCity = !selectedCity || (p.city || "").toLowerCase() === selectedCity.toLowerCase();
      const matchesSpecialty =
        !selectedSpecialty ||
        (p.specialty || "").toLowerCase().includes(selectedSpecialty.toLowerCase());
      return matchesSearch && matchesCity && matchesSpecialty;
    });
  }, [providers, searchQuery, selectedCity, selectedSpecialty]);

  const hospitalGroups = useMemo(() => {
    return hospitals.map((h) => {
      const assignedIds = hospitalAssignments
        .filter((a) => a.hospital_id === h.id)
        .map((a) => a.provider_id);
      const docs = providers.filter((p) => assignedIds.includes(p.id!));
      return { hospital: h, doctors: docs };
    }).filter((g) => g.doctors.length > 0);
  }, [hospitals, hospitalAssignments, providers]);

  const getDoctorName = (p: typeof providers[0]) => {
    if (p.first_name || p.last_name) return `Dr. ${p.first_name || ""} ${p.last_name || ""}`.trim();
    if (p.name) return `Dr. ${p.name}`;
    return "Doctor";
  };

  const DoctorCard = ({ doctor }: { doctor: typeof providers[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarImage src={doctor.photo_url || ""} alt={getDoctorName(doctor)} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-semibold text-foreground truncate">{getDoctorName(doctor)}</h3>
            {doctor.specialty && (
              <div className="flex items-center gap-1 text-sm text-primary">
                <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{doctor.specialty}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {doctor.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {doctor.city}
                </span>
              )}
              {(doctor.experience || doctor.years_experience) && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {doctor.experience || doctor.years_experience} yrs
                </span>
              )}
              {doctor.consultation_fee && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> ৳{doctor.consultation_fee}
                </span>
              )}
            </div>
            {doctor.verified && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Verified</Badge>
            )}
          </div>
        </div>
        {doctor.id && (
          <Link
            to={`/booking/provider/${doctor.id}`}
            className="mt-3 block text-center text-sm text-primary hover:underline"
          >
            View Profile →
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <SEO
        title="Doctor Directory | Doctori AI"
        description="Browse doctors in Bangladesh by specialty, city, or hospital. Find cardiologists, neurologists, dentists and more."
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
        <div className="container max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <BriefcaseMedical className="h-4 w-4" />
            Doctor Directory
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Browse Doctors in Bangladesh
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find doctors by specialty, city, or hospital. A public directory to help you discover healthcare providers.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container max-w-5xl py-8 space-y-6">
        <Tabs defaultValue="specialty">
          <TabsList className="w-full max-w-xs mx-auto grid grid-cols-2">
            <TabsTrigger value="specialty" className="gap-1.5">
              <Stethoscope className="h-3.5 w-3.5" /> By Specialty
            </TabsTrigger>
            <TabsTrigger value="hospital" className="gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> By Hospital
            </TabsTrigger>
          </TabsList>

          {/* ====== SPECIALTY TAB ====== */}
          <TabsContent value="specialty" className="space-y-6 mt-6">
            {/* City chips */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCity === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCity(null)}
              >
                All Cities
              </Badge>
              {CITIES.map((city) => (
                <Badge
                  key={city}
                  variant={selectedCity === city ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                >
                  {city}
                </Badge>
              ))}
            </div>

            {/* Specialty chips */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedSpecialty === null ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSpecialty(null)}
              >
                All Specialties
              </Badge>
              {SPECIALTIES.map((s) => (
                <Badge
                  key={s}
                  variant={selectedSpecialty === s ? "secondary" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedSpecialty(selectedSpecialty === s ? null : s)}
                >
                  {s}
                </Badge>
              ))}
            </div>

            {/* Results */}
            {isLoading ? (
              <p className="text-center text-muted-foreground py-12">Loading doctors...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No doctors found matching your criteria. Try adjusting your filters.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ====== HOSPITAL TAB ====== */}
          <TabsContent value="hospital" className="space-y-8 mt-6">
            {hospitalGroups.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No hospital data available yet.
              </p>
            ) : (
              hospitalGroups.map(({ hospital, doctors }) => (
                <div key={hospital.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg text-foreground">{hospital.name}</h2>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {hospital.city}
                        {hospital.address && ` — ${hospital.address}`}
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.map((doc) => (
                      <DoctorCard key={doc.id} doctor={doc} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default DoctorDirectory;
