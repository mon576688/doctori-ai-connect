import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { Helmet } from "react-helmet";
import { PAGE_SEO } from "@/lib/seo";
import {
  Search,
  Stethoscope,
  MapPin,
  BriefcaseMedical,
  User,
  Clock,
  Phone,
  Building2,
  Info,
} from "lucide-react";

const CITIES = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Rangpur",
  "Khulna", "Barisal", "Mymensingh", "Comilla", "Narayanganj",
];

interface DirectoryDoctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  qualifications: string | null;
  hospital_name: string | null;
  chamber_address: string | null;
  city: string;
  area: string | null;
  office_hours: string | null;
  consultation_fee: number | null;
  phone: string | null;
  whatsapp: string | null;
  photo_url: string | null;
  bio: string | null;
  years_experience: number | null;
  is_featured: boolean;
}

const DoctorDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["directory-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("directory_doctors")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("name");
      if (error) throw error;
      return (data || []) as DirectoryDoctor[];
    },
  });

  const specialties = useMemo(() => {
    const set = new Set(doctors.map((d) => d.specialty).filter(Boolean));
    return Array.from(set).sort();
  }, [doctors]);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        (d.hospital_name || "").toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q);
      const matchesCity = !selectedCity || d.city === selectedCity;
      const matchesSpecialty = !selectedSpecialty || d.specialty === selectedSpecialty;
      return matchesSearch && matchesCity && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedCity, selectedSpecialty]);

  const DoctorCard = ({ d }: { d: DirectoryDoctor }) => (
    <article itemScope itemType="https://schema.org/Physician" className="h-full">
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex gap-3">
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground leading-tight" itemProp="name">{d.name}</h3>
            <div className="flex items-center gap-1 text-sm text-primary mt-0.5" itemProp="medicalSpecialty">
              <Stethoscope className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{d.specialty}</span>
            </div>
            {d.years_experience != null && (
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {d.years_experience}+ years experience
              </div>
            )}
          </div>
        </div>

        {d.qualifications && (
          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{d.qualifications}</p>
        )}

        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground flex-1">
          {d.hospital_name && (
            <div className="flex items-start gap-1.5" itemProp="worksFor">
              <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{d.hospital_name}</span>
            </div>
          )}
          {d.chamber_address && (
            <div className="flex items-start gap-1.5" itemProp="address">
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{d.chamber_address}</span>
            </div>
          )}
          {d.office_hours && (
            <div className="flex items-start gap-1.5">
              <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{d.office_hours}</span>
            </div>
          )}
        </div>

        {d.phone && (
          <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t">
            <a
              href={`tel:${d.phone}`}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              itemProp="telephone"
            >
              <Phone className="h-3 w-3" /> Call
            </a>
          </div>
        )}
      </CardContent>
    </Card>
    </article>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Reputed Doctors Across Bangladesh",
    itemListElement: doctors.slice(0, 25).map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Physician",
        name: d.name,
        medicalSpecialty: d.specialty,
        ...(d.hospital_name && { worksFor: { "@type": "Hospital", name: d.hospital_name } }),
        ...(d.chamber_address && { address: d.chamber_address }),
        ...(d.phone && { telephone: d.phone }),
        areaServed: d.city,
      },
    })),
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={PAGE_SEO.doctorDirectory.title}
        description={PAGE_SEO.doctorDirectory.description}
        canonicalPath={PAGE_SEO.doctorDirectory.canonicalPath}
        keywords={PAGE_SEO.doctorDirectory.keywords}
      />
      {doctors.length > 0 && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
        <div className="container max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <BriefcaseMedical className="h-4 w-4" />
            Doctor Directory
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Reputed Doctors Across Bangladesh
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated public directory of trusted specialists nationwide. Informational listings — to book a Doctori AI consultation, visit Find Doctors.
          </p>

          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty, hospital, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      <section className="container max-w-5xl py-8 space-y-6">
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <Info className="h-4 w-4 text-amber-700" />
          <AlertDescription className="text-amber-900 dark:text-amber-200 text-sm">
            This directory provides public information about reputed doctors. Doctori AI is not affiliated with these doctors and does not facilitate appointments with them. Please contact the chamber directly.
          </AlertDescription>
        </Alert>

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
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedSpecialty === null ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedSpecialty(null)}
            >
              All Specialties
            </Badge>
            {specialties.map((s) => (
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
        )}

        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Loading directory...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No doctors found matching your criteria. Try adjusting your filters.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length} doctor{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((d) => (
                <DoctorCard key={d.id} d={d} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default DoctorDirectory;
