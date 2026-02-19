import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuggestedProvider {
  id: string;
  name: string;
  specialty: string;
  city: string;
  photo_url?: string | null;
  consultation_fee?: number | null;
  experience?: number | null;
  verified?: boolean;
}

interface InlineProviderCardsProps {
  providers: SuggestedProvider[];
}

const InlineProviderCards = ({ providers }: InlineProviderCardsProps) => {
  const navigate = useNavigate();

  if (!providers || providers.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
        <Stethoscope className="h-3 w-3" />
        Available doctors from our platform:
      </p>
      <div className="grid gap-2">
        {providers.map((provider) => (
          <Card key={provider.id} className="border border-border shadow-sm">
            <CardContent className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    Dr. {provider.name}
                  </span>
                  {provider.verified && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{provider.specialty}</p>
                {provider.city && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {provider.city}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="default"
                className="shrink-0 text-xs h-8"
                onClick={() => navigate(`/booking/provider/${provider.id}`)}
              >
                <Calendar className="h-3 w-3 mr-1" />
                Book
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InlineProviderCards;
