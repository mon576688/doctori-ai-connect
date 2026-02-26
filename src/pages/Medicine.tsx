import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Search, Loader2, Info, Plus, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { useTranslation } from 'react-i18next';

interface MedicineInfo {
  name: string;
  genericName?: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  precautions: string[];
  brandNames: string[];
  alternatives: string[];
  category: string;
}

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'contraindicated';
  description: string;
  recommendation: string;
}

interface InteractionResult {
  interactions: DrugInteraction[];
  generalWarnings: string[];
  safeToTakeTogether: boolean;
}

export default function Medicine() {
  const { t } = useTranslation('common');

  const severityConfig: Record<string, { labelKey: string; className: string; badgeVariant: 'outline' | 'secondary' | 'default' | 'destructive' }> = {
    none: { labelKey: 'medicine.noInteraction', className: 'border-green-500/30 bg-green-500/5', badgeVariant: 'outline' },
    mild: { labelKey: 'medicine.mild', className: 'border-yellow-500/30 bg-yellow-500/5', badgeVariant: 'secondary' },
    moderate: { labelKey: 'medicine.moderate', className: 'border-orange-500/30 bg-orange-500/5', badgeVariant: 'default' },
    severe: { labelKey: 'medicine.severe', className: 'border-destructive/30 bg-destructive/5', badgeVariant: 'destructive' },
    contraindicated: { labelKey: 'medicine.contraindicated', className: 'border-destructive bg-destructive/10', badgeVariant: 'destructive' },
  };

  // Lookup state
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Interaction checker state
  const [medicines, setMedicines] = useState<string[]>(['', '']);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [interactionError, setInteractionError] = useState('');

  const searchMedicine = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setMedicineInfo(null);

    try {
      const { data: cached } = await supabase
        .from('medicine_cache')
        .select('medicine_data')
        .eq('medicine_name', searchTerm.toLowerCase())
        .single();

      if (cached) {
        setMedicineInfo(cached.medicine_data as unknown as MedicineInfo);
        setLoading(false);
        return;
      }

      const { data, error: funcError } = await supabase.functions.invoke('medicine-lookup', {
        body: { medicineName: searchTerm }
      });

      if (funcError) throw funcError;
      
      setMedicineInfo(data.medicineInfo);

      await supabase
        .from('medicine_cache')
        .insert({
          medicine_name: searchTerm.toLowerCase(),
          medicine_data: data.medicineInfo
        });

    } catch (err: any) {
      setError(err.message || 'Failed to fetch medicine information');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchMedicine();
    }
  };

  const addMedicine = () => {
    if (medicines.length < 6) {
      setMedicines([...medicines, '']);
    }
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 2) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, value: string) => {
    const updated = [...medicines];
    updated[index] = value;
    setMedicines(updated);
  };

  const checkInteractions = async () => {
    const validMedicines = medicines.filter(m => m.trim().length > 0);
    if (validMedicines.length < 2) {
      setInteractionError(t('medicine.enterAtLeast2'));
      return;
    }

    setInteractionLoading(true);
    setInteractionError('');
    setInteractionResult(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('drug-interaction-checker', {
        body: { medicines: validMedicines }
      });

      if (funcError) throw funcError;
      if (data.error) throw new Error(data.error);

      setInteractionResult(data);
    } catch (err: any) {
      setInteractionError(err.message || 'Failed to check drug interactions');
    } finally {
      setInteractionLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO 
        title={PAGE_SEO.medicine.title}
        description={PAGE_SEO.medicine.description}
        canonicalPath={PAGE_SEO.medicine.canonicalPath}
      />
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('medicine.title')}</h1>
        <p className="text-muted-foreground">{t('medicine.subtitle')}</p>
      </header>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Medical Disclaimer:</strong> {t('medicine.disclaimer')}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="lookup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lookup" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {t('medicine.lookupTab')}
          </TabsTrigger>
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            {t('medicine.interactionsTab')}
          </TabsTrigger>
        </TabsList>

        {/* Medicine Lookup Tab */}
        <TabsContent value="lookup">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('medicine.searchTitle')}</CardTitle>
              <CardDescription>{t('medicine.searchDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder={t('medicine.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={searchMedicine} disabled={loading || !searchTerm.trim()}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {t('medicine.search')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {medicineInfo && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {medicineInfo.name}
                    <Badge variant="secondary">{medicineInfo.category}</Badge>
                  </CardTitle>
                  {medicineInfo.genericName && (
                    <CardDescription>{t('medicine.genericName')}: {medicineInfo.genericName}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {t('medicine.uses')}
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.uses.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">{t('medicine.dosage')}</h3>
                    <p className="text-sm bg-muted p-3 rounded-md">{medicineInfo.dosage}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2 text-orange-600">{t('medicine.sideEffects')}</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.sideEffects.map((effect, index) => (
                        <li key={index}>{effect}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2 text-red-600">{t('medicine.precautions')}</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.precautions.map((precaution, index) => (
                        <li key={index}>{precaution}</li>
                      ))}
                    </ul>
                  </div>

                  {medicineInfo.brandNames.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">{t('medicine.brandNames')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {medicineInfo.brandNames.map((brand, index) => (
                            <Badge key={index} variant="outline">{brand}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {medicineInfo.alternatives.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">{t('medicine.alternatives')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {medicineInfo.alternatives.map((alt, index) => (
                            <Badge key={index} variant="secondary">{alt}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{t('medicine.verifyInfo')}</AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>

        {/* Interaction Checker Tab */}
        <TabsContent value="interactions">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('medicine.interactionTitle')}</CardTitle>
              <CardDescription>{t('medicine.interactionDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicines.map((medicine, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground w-24 shrink-0">
                    {t('medicine.medicineLabel')} {index + 1}:
                  </span>
                  <Input
                    placeholder={t('medicine.searchPlaceholder')}
                    value={medicine}
                    onChange={(e) => updateMedicine(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') checkInteractions();
                    }}
                    className="flex-1"
                  />
                  {medicines.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedicine(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                {medicines.length < 6 && (
                  <Button variant="outline" onClick={addMedicine} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t('medicine.addMedicine')}
                  </Button>
                )}
                <Button
                  onClick={checkInteractions}
                  disabled={interactionLoading || medicines.filter(m => m.trim()).length < 2}
                  className="gap-2"
                >
                  {interactionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {t('medicine.checkInteractions')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {interactionError && (
            <Alert className="mb-6" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{interactionError}</AlertDescription>
            </Alert>
          )}

          {interactionResult && (
            <div className="space-y-4">
              {/* Overall Safety Summary */}
              <Card className={interactionResult.safeToTakeTogether ? 'border-green-500/30' : 'border-destructive/30'}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {interactionResult.safeToTakeTogether ? (
                      <ShieldCheck className="h-6 w-6 text-green-600" />
                    ) : (
                      <ShieldAlert className="h-6 w-6 text-destructive" />
                    )}
                    <div>
                      <p className="font-semibold text-lg">
                        {interactionResult.safeToTakeTogether
                          ? t('medicine.safeToTake')
                          : t('medicine.potentialInteractions')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {interactionResult.interactions.length} {t('medicine.interactionsAnalyzed')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Interactions */}
              {interactionResult.interactions.map((interaction, index) => {
                const config = severityConfig[interaction.severity] || severityConfig.none;
                return (
                  <Card key={index} className={config.className}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-base">
                          {interaction.drug1} + {interaction.drug2}
                        </CardTitle>
                        <Badge variant={config.badgeVariant}>
                          {t(config.labelKey)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">{interaction.description}</p>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm font-medium">{t('medicine.recommendation')}:</p>
                        <p className="text-sm text-muted-foreground">{interaction.recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* General Warnings */}
              {interactionResult.generalWarnings && interactionResult.generalWarnings.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {interactionResult.generalWarnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{t('medicine.interactionDisclaimer')}</AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
