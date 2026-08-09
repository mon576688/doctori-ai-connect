import { Ambulance, Building2, Info, MapPin, Phone, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { governmentAmbulances, toTelHref } from "@/data/governmentAmbulances";

/**
 * Information-only directory of government hospital ambulance contacts.
 * DoctoriAI does not operate, dispatch or guarantee ambulance services.
 */
export const GovernmentAmbulanceSection = () => {
  const { t } = useTranslation("home");

  return (
    <section
      id="government-ambulance"
      aria-labelledby="government-ambulance-heading"
      className="py-16 lg:py-20 border-t border-border bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-4">
            <Ambulance className="h-4 w-4 text-primary" aria-hidden="true" />
            {t("ambulance.badge", { defaultValue: "Information Directory" })}
          </div>
          <h2
            id="government-ambulance-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
          >
            {t("ambulance.title", {
              defaultValue: "Government Hospital Emergency & Ambulance Contacts",
            })}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("ambulance.subtitle", {
              defaultValue:
                "Contact the hospital directly to ask about ambulance availability. DoctoriAI does not operate or dispatch ambulances. Contact information may change, so please verify availability with the hospital.",
            })}
          </p>
        </div>

        {/* Disclaimer — always visible, including on mobile */}
        <div className="max-w-3xl mx-auto mb-10 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="flex gap-3 text-sm leading-relaxed text-foreground">
            <Info className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <span>
              {t("ambulance.disclaimer", {
                defaultValue:
                  "DoctoriAI does not provide or dispatch ambulances. The information shown here is publicly available government hospital contact information, provided for informational purposes only. Numbers are general hospital, emergency or help desk lines and are not guaranteed to be dedicated ambulance lines. Availability, fees, and response times may vary. Please contact the hospital directly for assistance.",
              })}
            </span>
          </p>
        </div>

        {governmentAmbulances.length === 0 ? (
          <p className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
            {t("ambulance.empty", {
              defaultValue: "Verified government ambulance contacts are being added.",
            })}
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto list-none">
            {governmentAmbulances.map((item) => (
              <li key={item.hospitalName}>
                <Card className="h-full border-border bg-card shadow-card">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="inline-flex items-center gap-1.5 self-start rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary mb-3">
                      <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("ambulance.facilityLabel", { defaultValue: "Government Healthcare Facility" })}
                    </div>

                    <h3 className="text-lg font-semibold leading-snug mb-2">{item.hospitalName}</h3>

                    <p className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.location}
                    </p>

                    {item.facilityType && (
                      <p className="text-xs text-muted-foreground mb-3">{item.facilityType}</p>
                    )}

                    {item.availability && (
                      <p className="text-sm text-muted-foreground mb-3">{item.availability}</p>
                    )}

                    <div className="mt-auto">
                      <ul className="space-y-2 mb-4 list-none">
                        {item.contacts.map((contact) => (
                          <li key={contact.number} className="flex items-start gap-2">
                            {contact.label.toLowerCase().includes("emergency") ? (
                              <Ambulance
                                className="h-4 w-4 mt-1 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                            ) : (
                              <Phone
                                className="h-4 w-4 mt-1 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                              />
                            )}
                            <span className="text-sm">
                              <span className="text-muted-foreground">{contact.label}: </span>
                              <a
                                href={toTelHref(contact.number)}
                                className="font-semibold tracking-tight break-words hover:underline"
                              >
                                {contact.number}
                              </a>
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button asChild variant="medical" className="w-full h-12 text-base">
                        <a
                          href={toTelHref(item.contacts[0].number)}
                          aria-label={t("ambulance.callAria", {
                            defaultValue: `Call ${item.hospitalName}`,
                            hospital: item.hospitalName,
                          })}
                        >
                          <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                          {t("ambulance.call", { defaultValue: "Call Hospital" })}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}

        {/* Emergency notice */}
        <div className="max-w-3xl mx-auto mt-10 rounded-xl border border-border bg-background p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold mb-2">
            <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />
            {t("ambulance.emergencyTitle", { defaultValue: "Emergency Notice" })}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("ambulance.emergencyNotice", {
              defaultValue:
                "For a medical emergency, contact the appropriate emergency service or the hospital directly. DoctoriAI does not dispatch ambulances or provide emergency transportation.",
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GovernmentAmbulanceSection;