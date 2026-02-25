import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Plus, Camera, Calendar, Leaf, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

export default function Recovery() {
  const [user, setUser] = useState<User | null>(null);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) fetchPlants();
    else setLoading(false);
  }, [user]);

  const fetchPlants = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("plants")
      .select("*")
      .order("created_at", { ascending: false });
    setPlants(data || []);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto">
          <TrendingUp className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Recovery Monitoring</h1>
          <p className="text-muted-foreground mb-6">Sign in to track your plants' recovery progress from disease detection to full health.</p>
          <Link to="/auth">
            <Button className="gap-2"><LogIn className="w-4 h-4" /> Sign In to Get Started</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Recovery <span className="text-gradient-green">Monitoring</span>
          </h1>
          <p className="text-muted-foreground">Track your plants from detection to full recovery</p>
        </div>
        <Link to="/detect">
          <Button className="gap-2"><Plus className="w-4 h-4" /> New Detection</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-2/3 mb-4" />
              <div className="h-3 bg-muted rounded w-1/2 mb-6" />
              <div className="h-2 bg-muted rounded w-full" />
            </Card>
          ))}
        </div>
      ) : plants.length === 0 ? (
        <Card className="p-12 text-center max-w-lg mx-auto">
          <Leaf className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">No Plants Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start by detecting a disease on a leaf image. Your plants will appear here for recovery tracking.</p>
          <Link to="/detect">
            <Button className="gap-2"><Camera className="w-4 h-4" /> Detect a Disease</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plants.map((plant) => (
            <Card key={plant.id} className="p-5 hover:shadow-emerald transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-semibold text-foreground">{plant.name}</h3>
                  <p className="text-xs text-muted-foreground">{plant.disease_detected || "Unknown"}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  plant.status === "recovered" ? "bg-success/10 text-success" :
                  plant.status === "monitoring" ? "bg-warning/10 text-warning" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {plant.status}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Recovery</span>
                  <span>{Math.round(plant.recovery_percentage || 0)}%</span>
                </div>
                <Progress value={plant.recovery_percentage || 0} className="h-2" />
              </div>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(plant.created_at).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
