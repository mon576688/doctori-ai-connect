import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { healthTipsBD } from "@/data/healthTipsBD";
import { healthTipsBN } from "@/data/healthTipsBD_bn";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { useTranslation } from "react-i18next";

export default function HealthTipsBD() {
  const { t, i18n } = useTranslation('common');
  const tipsData = i18n.language === 'bn' ? healthTipsBN : healthTipsBD;

  return (
    <div className="container py-8">
      <SEO 
        title={PAGE_SEO.healthTips.title}
        description={PAGE_SEO.healthTips.description}
        canonicalPath={PAGE_SEO.healthTips.canonicalPath}
      />
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{t('healthTips.title')}</h1>
          <p className="text-muted-foreground">{t('healthTips.subtitle')}</p>
        </header>

        <main className="space-y-6">
          {tipsData.map((section) => (
            <Card key={section.title} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                  <Badge variant="secondary">{section.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.heading}>
                    <h3 className="font-semibold mb-2">{item.heading}</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {item.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
}
