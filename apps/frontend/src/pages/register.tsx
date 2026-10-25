import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, 
  CheckCircle2, Flame, Dumbbell, Target, Shield, Activity, Zap, 
  Scale, Ruler, HeartPulse, Sparkles, Cpu, Award, Trophy, Check,
  ChevronRight, Compass, ShieldAlert, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  onboardingStep1Schema, 
  onboardingStep2Schema, 
  onboardingStep3Schema,
  type OnboardingData 
} from "@/lib/schemas";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading, signUp } = useAuth();
  
  // Step Management: 1: Uplink, 2: Biometrics, 3: Directives, 4: Synthesis
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // --- Step 1: Security & Identity ---
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Step 2: Physical Baseline & Biometrics ---
  const [gender, setGender] = useState<"male" | "female" | "cybernetic">("male");
  const [age, setAge] = useState<number>(24);
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [heightCm, setHeightCm] = useState<number>(178);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(10);

  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(76);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(80);
  const [bodyFatTier, setBodyFatTier] = useState<"shredded" | "athletic" | "defined" | "building" | "power">("athletic");

  // --- Step 3: Training Directives & Dream Physique ---
  const [experienceLevel, setExperienceLevel] = useState<"recruit" | "operative" | "veteran" | "elite">("operative");
  const [workoutFrequency, setWorkoutFrequency] = useState<number>(4);
  const [primaryGoal, setPrimaryGoal] = useState<"hypertrophy" | "strength" | "shred" | "athleticism">("hypertrophy");
  const [dreamPhysique, setDreamPhysique] = useState<"apollo" | "juggernaut" | "phantom" | "commando">("apollo");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "moderate" | "active" | "extreme">("moderate");

  // Status & UI
  const [loading, setLoading] = useState(false);
  const [isSuccessConfirmation, setIsSuccessConfirmation] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      setLocation("/dashboard");
    }
  }, [user, authLoading, setLocation]);

  // Handle Height Unit Conversion
  const handleHeightUnitToggle = (unit: "cm" | "ft") => {
    if (unit === heightUnit) return;
    setHeightUnit(unit);
    if (unit === "ft") {
      const totalInches = heightCm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches % 12);
      setHeightFeet(ft);
      setHeightInches(inch);
    } else {
      const calculatedCm = Math.round(heightFeet * 30.48 + heightInches * 2.54);
      setHeightCm(calculatedCm);
    }
  };

  const handleFeetChange = (ft: number, inch: number) => {
    setHeightFeet(ft);
    setHeightInches(inch);
    setHeightCm(Math.round(ft * 30.48 + inch * 2.54));
  };

  // Handle Weight Unit Conversion
  const handleWeightUnitToggle = (unit: "kg" | "lbs") => {
    setWeightUnit(unit);
  };

  // Convert displayed weights
  const displayCurrentWeight = useMemo(() => {
    return weightUnit === "kg" ? currentWeightKg : Math.round(currentWeightKg * 2.20462);
  }, [currentWeightKg, weightUnit]);

  const displayTargetWeight = useMemo(() => {
    return weightUnit === "kg" ? targetWeightKg : Math.round(targetWeightKg * 2.20462);
  }, [targetWeightKg, weightUnit]);

  const handleCurrentWeightChange = (val: number) => {
    if (weightUnit === "kg") {
      setCurrentWeightKg(val);
    } else {
      setCurrentWeightKg(Math.round((val / 2.20462) * 10) / 10);
    }
  };

  const handleTargetWeightChange = (val: number) => {
    if (weightUnit === "kg") {
      setTargetWeightKg(val);
    } else {
      setTargetWeightKg(Math.round((val / 2.20462) * 10) / 10);
    }
  };

  // Calculated Telemetry Baseline Metrics (Step 4 Synthesis)
  const synthesisMetrics = useMemo(() => {
    // Mifflin-St Jeor Equation
    let bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age;
    if (gender === "male") bmr += 5;
    else if (gender === "female") bmr -= 161;
    else bmr -= 78;

    // Activity Multiplier based on frequency
    let activityMultiplier = 1.35;
    if (workoutFrequency >= 6) activityMultiplier = 1.725;
    else if (workoutFrequency >= 4) activityMultiplier = 1.55;
    else if (workoutFrequency >= 3) activityMultiplier = 1.4;

    const tdee = Math.round(bmr * activityMultiplier);

    // Goal calories
    let targetCalories = tdee;
    if (primaryGoal === "hypertrophy") targetCalories += 300;
    else if (primaryGoal === "strength") targetCalories += 200;
    else if (primaryGoal === "shred") targetCalories -= 450;
    else if (primaryGoal === "athleticism") targetCalories += 50;

    // Daily Protein
    const proteinFactor = (primaryGoal === "hypertrophy" || primaryGoal === "shred") ? 2.2 : 2.0;
    const targetProtein = Math.round(currentWeightKg * proteinFactor);

    // Recommended Split
    let splitName = "Push / Pull / Legs (PPL)";
    if (workoutFrequency <= 3) splitName = "Full Body Kinetic (3x/Week)";
    else if (workoutFrequency === 4) splitName = "Upper / Lower Tactical Split (4x/Week)";
    else if (workoutFrequency >= 6) splitName = "PPL Arnold High-Density Protocol (6x/Week)";

    // BMI
    const heightM = heightCm / 100;
    const bmi = (currentWeightKg / (heightM * heightM)).toFixed(1);

    // Numeric Body Fat Estimate
    const bodyFatMap: Record<string, number> = {
      shredded: 8,
      athletic: 12,
      defined: 16,
      building: 21,
      power: 26,
    };

    return {
      tdee,
      targetCalories,
      targetProtein,
      splitName,
      bmi,
      estimatedBodyFat: bodyFatMap[bodyFatTier] || 14
    };
  }, [currentWeightKg, heightCm, age, gender, workoutFrequency, primaryGoal, bodyFatTier]);

  // Validation per step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (password !== confirmPassword) {
        toast({
          title: "Passcode Mismatch",
          description: "Passcode and confirmation sequence must match exactly.",
          variant: "destructive",
        });
        return;
      }
      const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '_')).toLowerCase().trim();
      const val = onboardingStep1Schema.safeParse({
        fullName: name,
        username: cleanUsername,
        email,
        password,
        confirmPassword
      });
      if (!val.success) {
        toast({
          title: "Identity Incomplete",
          description: val.error.errors[0]?.message || "Please complete all identity fields.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const val = onboardingStep2Schema.safeParse({
        gender,
        age,
        heightCm,
        currentWeightKg,
        targetWeightKg,
        bodyFatTier
      });
      if (!val.success) {
        toast({
          title: "Telemetry Incomplete",
          description: val.error.errors[0]?.message || "Please check your biometric values.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const val = onboardingStep3Schema.safeParse({
        experienceLevel,
        workoutFrequency,
        primaryGoal,
        dreamPhysique,
        activityLevel
      });
      if (!val.success) {
        toast({
          title: "Directives Incomplete",
          description: val.error.errors[0]?.message || "Please select your training directives.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  // Final Submission
  const handleFinalRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '_')).toLowerCase().trim();

    const telemetryData: OnboardingData = {
      fullName: name.trim(),
      username: cleanUsername,
      email: email.trim(),
      password,
      confirmPassword,
      gender,
      age,
      heightCm,
      currentWeightKg,
      targetWeightKg,
      bodyFatTier,
      experienceLevel,
      workoutFrequency,
      primaryGoal,
      dreamPhysique,
      activityLevel
    };

    const { data, error } = await signUp(email, password, {
      data: {
        full_name: telemetryData.fullName,
        username: cleanUsername,
        gender,
        age,
        height_cm: heightCm,
        current_weight_kg: currentWeightKg,
        weight_goal: targetWeightKg,
        body_fat_goal: synthesisMetrics.estimatedBodyFat,
        experience_level: experienceLevel,
        workout_frequency: workoutFrequency,
        primary_goal: primaryGoal,
        dream_physique: dreamPhysique,
        daily_calories: synthesisMetrics.targetCalories,
        daily_protein: synthesisMetrics.targetProtein,
      },
    });

    if (error) {
      let desc = error.message || "Failed to initialize operative identity.";
      if (error.message?.toLowerCase().includes("rate limit")) {
        desc = "Supabase email rate limit reached. If needed, disable 'Confirm email' in Supabase Dashboard (Auth > Providers > Email) for instant password login.";
      }
      toast({
        title: "Registration Interrupted",
        description: desc,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Save baseline locally so metrics and graphs show real data immediately
    try {
      const localProfile = {
        id: data?.user?.id || `usr-${Date.now()}`,
        username: cleanUsername,
        full_name: telemetryData.fullName,
        height_cm: heightCm,
        weight_goal: targetWeightKg,
        body_fat_goal: synthesisMetrics.estimatedBodyFat,
        avatar_url: "",
        xp: 0,
        level: 1,
        rank_tier: "NEURAL INITIATE"
      };
      localStorage.setItem('ironpulse_local_profile', JSON.stringify(localProfile));

      const initialMetric = {
        id: `bm-${Date.now()}`,
        user_id: data?.user?.id || 'local-operative',
        weight_kg: currentWeightKg,
        body_fat: synthesisMetrics.estimatedBodyFat,
        chest_cm: 100,
        waist_cm: 80,
        arms_cm: 36,
        recorded_at: new Date().toLocaleDateString('en-CA')
      };
      localStorage.setItem('ironpulse_local_metrics', JSON.stringify([initialMetric]));
    } catch {}

    // If session established immediately (email confirmation disabled)
    if (data?.session) {
      try {
        // Update user profile in Supabase
        await supabase.from('profiles').update({
          full_name: telemetryData.fullName,
          username: cleanUsername,
          height_cm: heightCm,
          weight_goal: targetWeightKg,
          body_fat_goal: synthesisMetrics.estimatedBodyFat,
          bio: `Directive: ${primaryGoal.toUpperCase()} | Archetype: ${dreamPhysique.toUpperCase()}`
        }).eq('id', data.session.user.id);

        // Record initial baseline body metric
        await supabase.from('body_metrics').insert({
          user_id: data.session.user.id,
          weight_kg: currentWeightKg,
          body_fat: synthesisMetrics.estimatedBodyFat,
          notes: `Initial Operative Baseline: ${primaryGoal.toUpperCase()}`
        });
      } catch (err) {
        console.warn("Could not save initial profile telemetry to DB directly:", err);
      }

      toast({
        title: "Operative Identity Initialized",
        description: "Biometric link synchronized. Welcome to IronPulse.",
      });
      setLocation("/dashboard");
    } else {
      // Confirmation email dispatched
      setIsSuccessConfirmation(true);
      toast({
        title: "Confirmation Transmitted",
        description: "Neural verification uplink dispatched to your email vector.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center px-4 py-8 relative overflow-hidden font-rajdhani">
      {/* Ambient Cybernetic Grid & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-card/60 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl z-10 relative overflow-hidden"
      >
        {/* Neon Accent Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_#00D4FF]" />
        
        {/* Terminal Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-14 h-14 mb-2 relative cursor-pointer"
            >
              <img 
                src="/logo.svg" 
                alt="IronPulse Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,212,255,0.6)]"
              />
            </motion.div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-[0.2em] text-white">
            Operative <span className="text-accent text-glow">Onboarding</span>
          </h1>
          <p className="text-muted-foreground text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-70">
            Phase 1.0 // Biometric & Training Calibration
          </p>
        </div>

        {isSuccessConfirmation ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 mx-auto flex items-center justify-center text-accent shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-white">
              Verification Dispatched
            </h2>
            <p className="text-xs text-muted-foreground font-mono leading-relaxed max-w-md mx-auto">
              We transmitted a neural verification uplink to <span className="text-accent font-bold">{email}</span>. Click the link in your inbox to confirm your operative status and sign in.
            </p>
            <div className="pt-4">
              <Link 
                href="/login" 
                className="inline-block py-3 px-8 bg-accent text-black font-display font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-accent/90 transition-all shadow-lg"
              >
                Proceed to Login →
              </Link>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Step HUD Timeline Indicator */}
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { step: 1, label: "01 IDENTITY", icon: Shield },
                  { step: 2, label: "02 BIOMETRICS", icon: Scale },
                  { step: 3, label: "03 DIRECTIVES", icon: Target },
                  { step: 4, label: "04 DOSSIER", icon: Cpu },
                ].map((s) => {
                  const isActive = currentStep === s.step;
                  const isCompleted = currentStep > s.step;
                  const Icon = s.icon;
                  return (
                    <div 
                      key={s.step} 
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center ${
                        isActive 
                          ? "bg-accent/10 border-accent text-accent shadow-[0_0_12px_rgba(0,212,255,0.2)]" 
                          : isCompleted 
                            ? "bg-white/5 border-primary/40 text-primary" 
                            : "bg-white/[0.02] border-white/5 text-muted-foreground/40"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {isCompleted ? <Check className="w-3.5 h-3.5 text-primary" /> : <Icon className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-mono font-bold tracking-wider hidden sm:inline">
                          {s.label}
                        </span>
                      </div>
                      <div className={`h-1 w-full rounded-full transition-all ${
                        isActive ? "bg-accent" : isCompleted ? "bg-primary" : "bg-white/10"
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <form onSubmit={currentStep === 4 ? handleFinalRegister : (e) => { e.preventDefault(); handleNextStep(); }}>
              <AnimatePresence mode="wait">
                {/* STEP 1: SECURITY & CREDENTIALS */}
                {currentStep === 1 && (
                  <motion.div 
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-accent" /> Security & Uplink Credentials
                      </h2>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Define your operational designation and cryptographic access vector.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Operative Designation (Full Name)
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                          <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                            placeholder="e.g. Alex Vance"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Callsign (Username)
                        </label>
                        <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted-foreground text-xs">@</span>
                          <input 
                            type="text" 
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                            placeholder="nexus_operative"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                        Email Vector
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                          placeholder="operative@domain.com"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Passcode (Min 6 Characters)
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                          <input 
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                            placeholder="••••••••"
                            disabled={loading}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Confirm Passcode
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                          <input 
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-3.5 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                            placeholder="••••••••"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: BIOMETRIC TELEMETRY */}
                {currentStep === 2 && (
                  <motion.div 
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <Scale className="w-4 h-4 text-accent" /> Physical Baseline & Telemetry
                      </h2>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Input your somatic dimensions to calibrate progressive overload algorithms.
                      </p>
                    </div>

                    {/* Physiology & Age */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Biological Profile
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "male", label: "MALE" },
                            { id: "female", label: "FEMALE" },
                            { id: "cybernetic", label: "OTHER" },
                          ].map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setGender(g.id as any)}
                              className={`py-2.5 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                                gender === g.id 
                                  ? "bg-accent/15 border-accent text-accent shadow-[0_0_10px_rgba(0,212,255,0.2)]" 
                                  : "bg-black/50 border-white/10 text-muted-foreground hover:border-white/20"
                              }`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Operative Chronology (Age)
                        </label>
                        <div className="relative group">
                          <input 
                            type="number" 
                            required
                            min={14}
                            max={100}
                            value={age}
                            onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-accent font-mono text-sm"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
                            YRS
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Height with CM / FT Toggle */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">
                          Stature (Height)
                        </label>
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                          <button
                            type="button"
                            onClick={() => handleHeightUnitToggle("cm")}
                            className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                              heightUnit === "cm" ? "bg-accent text-black" : "text-muted-foreground hover:text-white"
                            }`}
                          >
                            CM
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHeightUnitToggle("ft")}
                            className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                              heightUnit === "ft" ? "bg-accent text-black" : "text-muted-foreground hover:text-white"
                            }`}
                          >
                            FT / IN
                          </button>
                        </div>
                      </div>

                      {heightUnit === "cm" ? (
                        <div className="relative">
                          <input 
                            type="number"
                            min={100}
                            max={250}
                            value={heightCm}
                            onChange={(e) => setHeightCm(parseInt(e.target.value) || 170)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-accent font-mono text-sm"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">CM</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <input 
                              type="number"
                              min={3}
                              max={8}
                              value={heightFeet}
                              onChange={(e) => handleFeetChange(parseInt(e.target.value) || 5, heightInches)}
                              className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-accent font-mono text-sm"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">FT</span>
                          </div>
                          <div className="relative">
                            <input 
                              type="number"
                              min={0}
                              max={11}
                              value={heightInches}
                              onChange={(e) => handleFeetChange(heightFeet, parseInt(e.target.value) || 0)}
                              className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-accent font-mono text-sm"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">IN</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Weight: Current & Target with KG / LBS Toggle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            Current Mass
                          </label>
                          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                            <button
                              type="button"
                              onClick={() => handleWeightUnitToggle("kg")}
                              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                                weightUnit === "kg" ? "bg-accent text-black" : "text-muted-foreground hover:text-white"
                              }`}
                            >
                              KG
                            </button>
                            <button
                              type="button"
                              onClick={() => handleWeightUnitToggle("lbs")}
                              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                                weightUnit === "lbs" ? "bg-accent text-black" : "text-muted-foreground hover:text-white"
                              }`}
                            >
                              LBS
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <input 
                            type="number"
                            min={30}
                            max={500}
                            value={displayCurrentWeight}
                            onChange={(e) => handleCurrentWeightChange(parseFloat(e.target.value) || 70)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-accent font-mono text-sm"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs uppercase">{weightUnit}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          Target Goal Mass
                        </label>
                        <div className="relative">
                          <input 
                            type="number"
                            min={30}
                            max={500}
                            value={displayTargetWeight}
                            onChange={(e) => handleTargetWeightChange(parseFloat(e.target.value) || 75)}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-accent font-mono text-sm"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs uppercase">{weightUnit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body Fat Tier Estimate */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                        Current Estimated Adiposity (Body Fat Tier)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { id: "shredded", label: "SHREDDED", range: "< 10%", desc: "Veins & striations" },
                          { id: "athletic", label: "ATHLETIC", range: "10-14%", desc: "Visible six-pack" },
                          { id: "defined", label: "DEFINED", range: "15-19%", desc: "Flat & outline" },
                          { id: "building", label: "BUILDING", range: "20-24%", desc: "Bulking frame" },
                          { id: "power", label: "POWER", range: "25%+", desc: "Heavy mass frame" },
                        ].map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => setBodyFatTier(tier.id as any)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              bodyFatTier === tier.id 
                                ? "bg-accent/15 border-accent text-accent shadow-[0_0_12px_rgba(0,212,255,0.25)]" 
                                : "bg-black/40 border-white/10 text-muted-foreground hover:border-white/20"
                            }`}
                          >
                            <div className="font-display font-bold text-xs uppercase tracking-wider text-white">
                              {tier.label}
                            </div>
                            <div className="text-[10px] font-mono font-semibold text-accent/80 mt-0.5">
                              {tier.range}
                            </div>
                            <div className="text-[8px] font-mono text-muted-foreground/60 hidden sm:block truncate mt-0.5">
                              {tier.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: DIRECTIVES & DREAM PHYSIQUE */}
                {currentStep === 3 && (
                  <motion.div 
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent" /> Directives & Training Cadence
                      </h2>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Define training frequency and choose your target physique archetype.
                      </p>
                    </div>

                    {/* Workout Frequency */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">
                          Operational Cadence (Workouts / Week)
                        </label>
                        <span className="text-xs font-mono font-bold text-accent">
                          {workoutFrequency} Days Active / {7 - workoutFrequency} Days Recovery
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[2, 3, 4, 5, 6].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setWorkoutFrequency(days)}
                            className={`py-2 rounded-xl border font-mono font-bold text-xs transition-all ${
                              workoutFrequency === days
                                ? "bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(0,212,255,0.2)]"
                                : "bg-black/50 border-white/10 text-muted-foreground hover:border-white/20"
                            }`}
                          >
                            {days} DAYS
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                        Kinetic Experience Tier
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "recruit", label: "RECRUIT", sub: "< 1 Year" },
                          { id: "operative", label: "OPERATIVE", sub: "1 - 3 Years" },
                          { id: "veteran", label: "VETERAN", sub: "3 - 5 Years" },
                          { id: "elite", label: "CYBER ELITE", sub: "5+ Years" },
                        ].map((exp) => (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() => setExperienceLevel(exp.id as any)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              experienceLevel === exp.id
                                ? "bg-accent/15 border-accent text-accent"
                                : "bg-black/40 border-white/10 text-muted-foreground hover:border-white/20"
                            }`}
                          >
                            <div className="font-display font-bold text-xs text-white uppercase">{exp.label}</div>
                            <div className="text-[9px] font-mono text-muted-foreground">{exp.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Primary Goal Directives */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                        Primary Directive (Main Focus)
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { id: "hypertrophy", label: "Hypertrophy", icon: Flame, desc: "Max muscle cross-section & aesthetic mass" },
                          { id: "strength", label: "Raw Power", icon: Dumbbell, desc: "Heavy 1RM compound strength & density" },
                          { id: "shred", label: "Deficit Shred", icon: Activity, desc: "Rapid fat loss & muscular vascularity" },
                          { id: "athleticism", label: "Kinetic Athletics", icon: Zap, desc: "Explosive torque, speed & functional capacity" },
                        ].map((goal) => {
                          const Icon = goal.icon;
                          const isSelected = primaryGoal === goal.id;
                          return (
                            <button
                              key={goal.id}
                              type="button"
                              onClick={() => setPrimaryGoal(goal.id as any)}
                              className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                                isSelected 
                                  ? "bg-accent/15 border-accent shadow-[0_0_15px_rgba(0,212,255,0.2)]" 
                                  : "bg-black/40 border-white/10 hover:border-white/20"
                              }`}
                            >
                              <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-accent text-black" : "bg-white/5 text-muted-foreground"}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-display font-bold uppercase tracking-wider text-white">
                                  {goal.label}
                                </div>
                                <div className="text-[10px] font-mono text-muted-foreground leading-tight mt-0.5">
                                  {goal.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dream Physique Archetypes */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                        Target Dream Physique Archetype
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { 
                            id: "apollo", 
                            title: "THE APOLLO PROTOCOL", 
                            sub: "Golden Ratio & V-Taper Symmetry", 
                            badge: "Aesthetic Class", 
                            accent: "text-amber-400" 
                          },
                          { 
                            id: "juggernaut", 
                            title: "CYBERNETIC JUGGERNAUT", 
                            sub: "Dense Mass & Bone-Crushing Armor", 
                            badge: "Heavy Power", 
                            accent: "text-red-400" 
                          },
                          { 
                            id: "phantom", 
                            title: "THE NEON PHANTOM", 
                            sub: "Single-Digit Fat & Razor Vascularity", 
                            badge: "Extreme Shred", 
                            accent: "text-accent" 
                          },
                          { 
                            id: "commando", 
                            title: "KINETIC COMMANDO", 
                            sub: "Explosive Hybrid Strength & Stamina", 
                            badge: "Functional Tactical", 
                            accent: "text-primary" 
                          },
                        ].map((arch) => {
                          const isSelected = dreamPhysique === arch.id;
                          return (
                            <button
                              key={arch.id}
                              type="button"
                              onClick={() => setDreamPhysique(arch.id as any)}
                              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                                isSelected 
                                  ? "bg-accent/15 border-accent shadow-[0_0_15px_rgba(0,212,255,0.25)]" 
                                  : "bg-black/40 border-white/10 hover:border-white/20"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${arch.accent}`}>
                                  {arch.badge}
                                </span>
                                {isSelected && (
                                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                                )}
                              </div>
                              <div className="font-display font-black text-sm uppercase tracking-wider text-white">
                                {arch.title}
                              </div>
                              <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                {arch.sub}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: DOSSIER SYNTHESIS & REVIEW */}
                {currentStep === 4 && (
                  <motion.div 
                    key="step-4"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-white/10 pb-3 mb-2">
                      <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-accent" /> Operative Dossier Synthesis
                      </h2>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Neural profile calibrated. Confirm operational directives before final activation.
                      </p>
                    </div>

                    {/* High-Tech Dossier Card */}
                    <div className="bg-black/80 border border-accent/40 rounded-3xl p-5 relative overflow-hidden shadow-[0_0_30px_rgba(0,212,255,0.15)]">
                      {/* Top Corner Ribbon */}
                      <div className="absolute top-0 right-0 bg-accent text-black px-4 py-1 rounded-bl-2xl font-mono text-[9px] font-bold uppercase tracking-widest">
                        LVL 1 // NEURAL INITIATE
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-display font-black text-xl">
                          {name.charAt(0) || "O"}
                        </div>
                        <div>
                          <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                            {name || "Operative Vance"}
                          </h3>
                          <p className="text-accent font-mono text-xs font-semibold">
                            @{username || "nexus_callsign"}
                          </p>
                        </div>
                      </div>

                      {/* Biometric Matrix Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                        <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl">
                          <div className="text-[9px] font-mono text-muted-foreground uppercase">Current Weight</div>
                          <div className="text-sm font-mono font-bold text-white mt-0.5">
                            {currentWeightKg} KG <span className="text-[10px] text-muted-foreground">({Math.round(currentWeightKg * 2.20462)} LBS)</span>
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl">
                          <div className="text-[9px] font-mono text-muted-foreground uppercase">Target Weight</div>
                          <div className="text-sm font-mono font-bold text-accent mt-0.5">
                            {targetWeightKg} KG <span className="text-[10px] text-accent/70">({Math.round(targetWeightKg * 2.20462)} LBS)</span>
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl">
                          <div className="text-[9px] font-mono text-muted-foreground uppercase">Height / BMI</div>
                          <div className="text-sm font-mono font-bold text-white mt-0.5">
                            {heightCm} CM <span className="text-[10px] text-primary">({synthesisMetrics.bmi})</span>
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl">
                          <div className="text-[9px] font-mono text-muted-foreground uppercase">Adiposity Tier</div>
                          <div className="text-sm font-mono font-bold text-white uppercase mt-0.5">
                            {bodyFatTier} <span className="text-[10px] text-muted-foreground">({synthesisMetrics.estimatedBodyFat}%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Caloric & Protocol Recommendations */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                        <div className="p-3 rounded-2xl bg-accent/5 border border-accent/20">
                          <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase tracking-wider mb-1">
                            <Flame className="w-3.5 h-3.5" /> Caloric Target Baseline
                          </div>
                          <div className="text-xl font-display font-black text-white">
                            {synthesisMetrics.targetCalories} <span className="text-xs font-mono text-muted-foreground font-normal">KCAL / DAY</span>
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-1">
                            Target Protein: <span className="text-accent font-bold">{synthesisMetrics.targetProtein}g daily</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold uppercase tracking-wider mb-1">
                            <Dumbbell className="w-3.5 h-3.5" /> Recommended Protocol
                          </div>
                          <div className="text-sm font-display font-black text-white uppercase tracking-wider">
                            {synthesisMetrics.splitName}
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-1">
                            Archetype: <span className="text-primary font-bold uppercase">{dreamPhysique}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Actions (Back / Next / Initialize) */}
              <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-white/10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={loading}
                    className="py-3 px-5 bg-white/5 border border-white/10 hover:border-white/20 text-white font-display font-bold text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> BACK
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="py-3.5 px-8 bg-accent text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,212,255,0.25)] flex items-center gap-2 group ml-auto"
                  >
                    PROCEED TO STAGE 0{currentStep + 1}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-4 px-8 bg-accent text-black font-display font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,212,255,0.4)] flex items-center justify-center gap-3 group ml-auto disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> INITIALIZING TELEMETRY...
                      </>
                    ) : (
                      <>
                        INITIALIZE OPERATIVE IDENTITY
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                Existing Operative?{" "}
                <Link href="/login" className="text-accent font-bold hover:underline transition-all ml-1">
                  Authenticate Uplink →
                </Link>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
