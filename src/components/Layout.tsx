import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, ScanSearch, BookOpen, TrendingUp, LogIn, LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User as AuthUser } from "@supabase/supabase-js";

const navItems = [
  { path: "/", label: "Home", icon: Leaf },
  { path: "/detect", label: "Detect", icon: ScanSearch },
  { path: "/library", label: "Disease Library", icon: BookOpen },
  { path: "/recovery", label: "Recovery", icon: TrendingUp },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">ProDetect AI+</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}>
                <Button variant={location.pathname === item.path ? "default" : "ghost"} className="w-full justify-start gap-2">
                  <item.icon className="w-4 h-4" /> {item.label}
                </Button>
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2"><User className="w-4 h-4" /> Dashboard</Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)}>
                <Button className="w-full justify-start gap-2"><LogIn className="w-4 h-4" /> Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
}
