import { useState } from "react";
import { BookOpen, ChevronRight, AlertTriangle, X, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DISEASES, type Disease } from "@/lib/diseases";
import { speak, getLanguages } from "@/lib/tts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Library() {
  const [selected, setSelected] = useState<Disease | null>(null);
  const [language, setLanguage] = useState("en");

  const severityVariant = (s: string) => {
    if (s === "severe") return "destructive" as const;
    if (s === "moderate") return "secondary" as const;
    return "default" as const;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Disease <span className="text-gradient-green">Library</span>
        </h1>
        <p className="text-muted-foreground">Browse common plant diseases with detailed information</p>
      </div>

      {selected ? (
        <div className="max-w-3xl mx-auto animate-fade-in">
          <Button variant="ghost" className="mb-4 gap-2" onClick={() => setSelected(null)}>
            <X className="w-4 h-4" /> Back to Library
          </Button>
          <Card className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground italic">{selected.scientificName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {getLanguages().map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => speak(`${selected.name}. ${selected.causes}. Treatment: ${selected.treatment}`, language)}>
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Badge variant={severityVariant(selected.severity)} className="capitalize">{selected.severity}</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Affected Crops</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.affectedCrops.map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Symptoms</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selected.symptoms.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Causes</h3>
                <p className="text-sm text-muted-foreground">{selected.causes}</p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Treatment</h3>
                <p className="text-sm text-muted-foreground">{selected.treatment}</p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Prevention</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selected.prevention.map((p, i) => <li key={i}>✓ {p}</li>)}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {DISEASES.map((d) => (
            <Card
              key={d.id}
              className="overflow-hidden cursor-pointer hover:shadow-emerald hover:-translate-y-1 transition-all duration-300 group"
              onClick={() => setSelected(d)}
            >
              <div className="h-36 overflow-hidden">
                <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold text-foreground">{d.name}</h3>
                  <Badge variant={severityVariant(d.severity)} className="capitalize text-xs">{d.severity}</Badge>
                </div>
                <p className="text-xs text-muted-foreground italic mb-2">{d.scientificName}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {d.affectedCrops.slice(0, 3).map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                </div>
                <div className="flex items-center text-sm text-primary font-medium gap-1 group-hover:gap-2 transition-all">
                  View Details <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
