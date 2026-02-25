import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Leaf, ScanSearch, TrendingUp, Calendar, Camera, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth");
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchPlants();
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

  const deletePlant = async (id: string) => {
    await supabase.from("plants").delete().eq("id", id);
    setPlants(plants.filter(p => p.id !== id));
    toast({ title: "Plant removed" });
  };

  const stats = {
    total: plants.length,
    monitoring: plants.filter(p => p.status === "monitoring").length,
    recovered: plants.filter(p => p.status === "recovered").length,
    avgRecovery: plants.length ? Math.round(plants.reduce((a, p) => a + (p.recovery_percentage || 0), 0) / plants.length) : 0,
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My <span className="text-gradient-green">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.user_metadata?.full_name || "Farmer"}</p>
        </div>
        <Link to="/detect">
          <Button className="gap-2"><Plus className="w-4 h-4" /> New Scan</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Plants", value: stats.total, icon: Leaf, color: "text-primary" },
          { label: "Monitoring", value: stats.monitoring, icon: ScanSearch, color: "text-warning" },
          { label: "Recovered", value: stats.recovered, icon: TrendingUp, color: "text-success" },
          { label: "Avg Recovery", value: `${stats.avgRecovery}%`, icon: Camera, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Plants List */}
      {plants.length === 0 ? (
        <Card className="p-12 text-center">
          <Leaf className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">No plants tracked yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start by scanning a leaf to detect diseases</p>
          <Link to="/detect"><Button className="gap-2"><ScanSearch className="w-4 h-4" /> Scan a Leaf</Button></Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {plants.map((plant) => (
            <Card key={plant.id} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{plant.name}</h3>
                <p className="text-xs text-muted-foreground">{plant.disease_detected || "Unknown disease"}</p>
              </div>
              <div className="hidden sm:block w-32">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Recovery</span>
                  <span>{Math.round(plant.recovery_percentage || 0)}%</span>
                </div>
                <Progress value={plant.recovery_percentage || 0} className="h-1.5" />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(plant.created_at).toLocaleDateString()}
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deletePlant(plant.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
