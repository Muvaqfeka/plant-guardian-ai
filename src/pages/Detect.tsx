import { useState, useRef } from "react";
import { Upload, Loader2, Volume2, VolumeX, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { speak, stopSpeaking, getLanguages } from "@/lib/tts";
import { useToast } from "@/hooks/use-toast";

interface DetectionResult {
  disease_name: string;
  confidence: number;
  description: string;
  symptoms: string[];
  causes: string;
  treatment: {
    immediate: string;
    day1: string;
    day2_3: string;
    day4_7: string;
    week2: string;
    ongoing: string;
  };
  prevention: string[];
  severity: string;
  affected_crops?: string[];
}

export default function Detect() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [language, setLanguage] = useState("en");
  const [speaking, setSpeaking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageFile) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(imageFile);
      });

      const { data, error } = await supabase.functions.invoke("detect-disease", {
        body: { imageBase64: base64, language },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      toast({ title: "Detection Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      speak(text, language);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 10000);
    }
  };

  const severityColor = (s: string) => {
    if (s === "severe") return "text-destructive";
    if (s === "moderate") return "text-warning";
    return "text-success";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          AI Disease <span className="text-gradient-green">Detection</span>
        </h1>
        <p className="text-muted-foreground">Upload a leaf image for instant AI-powered diagnosis</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Upload */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-foreground">Upload Leaf Image</h2>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getLanguages().map((l) => (
                  <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all min-h-[300px] flex flex-col items-center justify-center"
          >
            {image ? (
              <img src={image} alt="Leaf" className="max-h-64 rounded-lg object-contain mx-auto" />
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">Click to upload or drag a leaf image</p>
                <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />

          <Button onClick={analyze} disabled={!imageFile || loading} className="w-full mt-4 gap-2" size="lg">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ScanIcon className="w-5 h-5" />}
            {loading ? "Analyzing..." : "Analyze Leaf"}
          </Button>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {result.disease_name === "Healthy" ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : (
                        <AlertTriangle className={`w-6 h-6 ${severityColor(result.severity)}`} />
                      )}
                      <h2 className="font-display font-bold text-xl text-foreground">{result.disease_name}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Confidence: <span className="font-semibold text-foreground">{Math.round((result.confidence || 0) * 100)}%</span>
                      {result.severity && (
                        <span className={`ml-3 font-semibold capitalize ${severityColor(result.severity)}`}>
                          {result.severity}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSpeak(`${result.disease_name}. ${result.description}. Treatment: ${result.treatment?.immediate || ""}`)}
                  >
                    {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-foreground text-sm mb-4">{result.description}</p>

                {result.symptoms?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-display font-semibold text-sm text-foreground mb-2">Symptoms</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {result.symptoms.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                )}

                {result.causes && (
                  <div>
                    <h3 className="font-display font-semibold text-sm text-foreground mb-1">Causes</h3>
                    <p className="text-sm text-muted-foreground">{result.causes}</p>
                  </div>
                )}
              </Card>

              {/* Treatment Plan */}
              {result.treatment && (
                <Card className="p-6">
                  <h2 className="font-display font-bold text-lg text-foreground mb-4">🌱 Recovery Plan</h2>
                  <div className="space-y-3">
                    {[
                      { label: "Immediate Action", value: result.treatment.immediate },
                      { label: "Day 1", value: result.treatment.day1 },
                      { label: "Day 2-3", value: result.treatment.day2_3 },
                      { label: "Day 4-7", value: result.treatment.day4_7 },
                      { label: "Week 2", value: result.treatment.week2 },
                      { label: "Ongoing", value: result.treatment.ongoing },
                    ].filter(s => s.value).map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{step.label}</p>
                          <p className="text-sm text-muted-foreground">{step.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {result.prevention?.length > 0 && (
                <Card className="p-6">
                  <h2 className="font-display font-bold text-lg text-foreground mb-3">🛡 Prevention</h2>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.prevention.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <ScanIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg text-muted-foreground">No Analysis Yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Upload a leaf image and click analyze to get started</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ScanIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="4" /><path d="m15 9-6 6" />
    </svg>
  );
}
