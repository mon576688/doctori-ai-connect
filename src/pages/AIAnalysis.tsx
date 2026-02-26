import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Activity, Stethoscope, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AnalysisType = "prescription" | "report" | "symptom";

const tabConfig: {value: AnalysisType;label: string;icon: React.ElementType;description: string;placeholder: string;}[] = [
{
  value: "prescription",
  label: "Prescription",
  icon: FileText,
  description: "Upload a prescription photo. AI extracts medicine names, identifies drug class, and explains uses.",
  placeholder: "Optionally paste prescription text here..."
},
{
  value: "report",
  label: "Medical Report",
  icon: Activity,
  description: "Upload a medical report. AI highlights key values, explains terms, and summarizes findings.",
  placeholder: "Optionally paste report text here..."
},
{
  value: "symptom",
  label: "Symptom Analysis",
  icon: Stethoscope,
  description: "Upload an image of visible symptoms or describe them. AI provides condition insights and guidance.",
  placeholder: "Describe your symptoms here (e.g., headache for 3 days, mild fever, sore throat)..."
}];


const AIAnalysis = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType>("prescription");
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setActiveTab(value as AnalysisType);
    setText("");
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file (JPG, PNG).", variant: "destructive" });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!text && !imageFile) {
      toast({ title: "Nothing to analyze", description: "Please upload an image or enter text.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const { data, error } = await supabase.functions.invoke("analyze-medical", {
        body: { type: activeTab, text: text || undefined, imageBase64 }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data.result);
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: "Analysis failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentTab = tabConfig.find((t) => t.value === activeTab)!;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Health Analysis</h1>
        <p className="text-muted-foreground">
          Upload prescriptions, medical reports, or describe symptoms for instant AI-powered analysis.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {tabConfig.map((tab) =>
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          )}
        </TabsList>

        {tabConfig.map((tab) =>
        <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <tab.icon className="h-5 w-5 text-primary" />
                  {tab.label} Analysis
                </CardTitle>
                <CardDescription>{tab.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>

                  {imagePreview ?
                <div className="relative inline-block">
                      <img src={imagePreview} alt="Upload preview" className="max-h-48 rounded-md mx-auto" />
                      <button
                    onClick={(e) => {e.stopPropagation();removeImage();}}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">

                        <X className="h-4 w-4" />
                      </button>
                    </div> :

                <div className="space-y-2">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-xs text-muted-foreground">JPG, PNG — Max 10MB</p>
                    </div>
                }
                  <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />

                </div>

                {/* Text Input */}
                <Textarea
                placeholder={tab.placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4} />


                {/* Analyze Button */}
                <Button
                onClick={handleAnalyze}
                disabled={isLoading || !text && !imageFile}
                className="w-full"
                variant="medical"
                size="lg">

                  {isLoading ?
                <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </> :

                <>
                      <Stethoscope className="h-4 w-4" />
                      Analyze
                    </>
                }
                </Button>

                {/* Results */}
                {result &&
              <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                        {result}
                      </div>
                    </CardContent>
                  </Card>
              }

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center border-t pt-4">
                  This AI provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment; always consult a qualified healthcare provider for personal health concerns.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>);

};

export default AIAnalysis;