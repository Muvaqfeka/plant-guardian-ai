import { Link } from "react-router-dom";
import { ScanSearch, Mic, Globe, TrendingUp, BookOpen, Shield, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: ScanSearch,
    title: "AI Disease Detection",
    description: "Upload leaf images for instant CNN-powered disease identification with confidence scores.",
  },
  {
    icon: Mic,
    title: "Voice Navigation",
    description: "Navigate hands-free. Ask questions about diseases and get spoken treatment guidance.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Get advisory in Tamil, Telugu, Hindi, French, and English with text-to-speech.",
  },
  {
    icon: TrendingUp,
    title: "Recovery Monitoring",
    description: "Track plant recovery from Day 1 to full health with photo comparisons and AI analysis.",
  },
  {
    icon: BookOpen,
    title: "Disease Library",
    description: "Browse comprehensive disease references with symptoms, treatment, and prevention tips.",
  },
  {
    icon: Shield,
    title: "Smart Alerts",
    description: "Get notified if conditions worsen with updated treatment recommendations.",
  },
];

export default function Index() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Smart agriculture" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-sm text-primary-foreground backdrop-blur-sm">
              <Leaf className="w-4 h-4" />
              <span>AI-Powered Smart Agriculture</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              ProDetect<br />
              <span className="text-secondary">AI+</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-lg">
              Intelligent multilingual plant disease detection, voice-assisted advisory, and complete recovery monitoring for sustainable agriculture.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/detect">
                <Button size="lg" className="gap-2 shadow-emerald text-lg px-8">
                  <ScanSearch className="w-5 h-5" /> Start Detection
                </Button>
              </Link>
              <Link to="/library">
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                  <BookOpen className="w-5 h-5" /> Disease Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Plant Healthcare <span className="text-gradient-green">Ecosystem</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From detection to full recovery — everything your farm needs in one intelligent platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group glass-card rounded-xl p-6 hover:shadow-emerald transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join thousands of farmers using AI to detect diseases early and save their harvest.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 shadow-amber">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-hero flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">ProDetect AI+</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 ProDetect AI+. Empowering sustainable agriculture.</p>
        </div>
      </footer>
    </div>
  );
}
