
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Plants table for tracking
CREATE TABLE public.plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  disease_detected TEXT,
  confidence_score NUMERIC,
  detection_date TIMESTAMPTZ DEFAULT now(),
  original_image_url TEXT,
  status TEXT DEFAULT 'monitoring',
  recovery_percentage NUMERIC DEFAULT 0,
  ai_advisory TEXT,
  treatment_plan JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own plants" ON public.plants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plants" ON public.plants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plants" ON public.plants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plants" ON public.plants FOR DELETE USING (auth.uid() = user_id);

-- Recovery logs
CREATE TABLE public.recovery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  image_url TEXT,
  notes TEXT,
  recovery_percentage NUMERIC,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.recovery_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own recovery logs" ON public.recovery_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recovery logs" ON public.recovery_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recovery logs" ON public.recovery_logs FOR UPDATE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON public.plants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
