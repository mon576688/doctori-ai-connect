import { useState, useEffect, useCallback } from "react";
import { Wind, Droplets, Eye, Sparkles, RotateCcw, Plus, Play, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ─── Guided Breathing Card ─── */
const BreathingCard = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");

  useEffect(() => {
    if (!overlayOpen) return;
    const interval = setInterval(() => {
      setPhase((p) => (p === "inhale" ? "exhale" : "inhale"));
    }, 4000);
    return () => clearInterval(interval);
  }, [overlayOpen]);

  return (
    <>
      <div
        className="wellness-card feature-card backdrop-blur-xl bg-background/70 border border-white/20 rounded-2xl p-6 relative z-10 cursor-pointer"
        onClick={() => setOverlayOpen(true)}
        style={{ animationDelay: "0s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Wind className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Guided Breathing</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-primary/60 hover:text-primary transition-colors" aria-label="AI Insight">
                  <Sparkles className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[220px]">
                <p className="text-xs">AI can analyze your breathing patterns to optimize recovery and focus.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center justify-center py-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 breathing-circle" />
        </div>
        <p className="text-xs text-muted-foreground text-center">Tap to begin box breathing</p>
      </div>

      {/* Full-screen overlay */}
      {overlayOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
          <button
            onClick={() => setOverlayOpen(false)}
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
            aria-label="Close breathing overlay"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="w-40 h-40 rounded-full transition-all duration-[4000ms] ease-in-out"
            style={{
              transform: phase === "inhale" ? "scale(1)" : "scale(0.6)",
              background:
                phase === "inhale"
                  ? "radial-gradient(circle, hsl(217 91% 60% / 0.6), hsl(217 91% 60% / 0.15))"
                  : "radial-gradient(circle, hsl(158 64% 52% / 0.6), hsl(158 64% 52% / 0.15))",
              boxShadow:
                phase === "inhale"
                  ? "0 0 60px hsl(217 91% 60% / 0.3)"
                  : "0 0 60px hsl(158 64% 52% / 0.3)",
            }}
          />
          <p className="mt-8 text-2xl font-semibold text-foreground capitalize">{phase}</p>
          <p className="mt-2 text-muted-foreground text-sm">Breathe slowly and deeply</p>
        </div>
      )}
    </>
  );
};

/* ─── Smart Hydration Tracker ─── */
const HydrationCard = () => {
  const todayKey = `hydration-${new Date().toISOString().slice(0, 10)}`;
  const [glasses, setGlasses] = useState(() => {
    const stored = localStorage.getItem(todayKey);
    return stored ? parseInt(stored, 10) : 0;
  });
  const goal = 8;

  useEffect(() => {
    localStorage.setItem(todayKey, String(glasses));
  }, [glasses, todayKey]);

  return (
    <div
      className="wellness-card feature-card backdrop-blur-xl bg-background/70 border border-white/20 rounded-2xl p-6 relative z-10 overflow-hidden"
      style={{ animationDelay: "0.15s" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Hydration Tracker</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-primary/60 hover:text-primary transition-colors" aria-label="AI Insight">
                <Sparkles className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px]">
              <p className="text-xs">AI can track hydration trends to suggest optimal intake timing.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="text-center py-4">
        <p className="text-3xl font-bold text-foreground">
          {glasses}<span className="text-lg text-muted-foreground">/{goal}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">glasses today</p>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setGlasses(Math.min(glasses + 1, goal))}
          disabled={glasses >= goal}
          aria-label="Add glass of water"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setGlasses(0)}
          aria-label="Reset hydration"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress fill at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5">
        <div
          className="h-full bg-primary/40 transition-all duration-500"
          style={{ width: `${(glasses / goal) * 100}%` }}
        />
      </div>
    </div>
  );
};

/* ─── Vision Guard (20-20-20 Rule) ─── */
const VisionGuardCard = () => {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(1200); // 20 min
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      setAlert(true);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, seconds]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const acknowledge = useCallback(() => {
    setAlert(false);
    setSeconds(1200);
    setRunning(true);
  }, []);

  return (
    <div
      className="wellness-card feature-card backdrop-blur-xl bg-background/70 border border-white/20 rounded-2xl p-6 relative z-10"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-secondary/10 p-2 rounded-lg">
          <Eye className="h-5 w-5 text-secondary" />
        </div>
        <h3 className="font-semibold text-foreground">Vision Guard</h3>
      </div>

      <div className="text-center py-4">
        <p className="text-3xl font-mono font-bold text-foreground">{fmt(seconds)}</p>
        <p className="text-xs text-muted-foreground mt-1">20-20-20 Rule</p>
      </div>

      {alert ? (
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-secondary">Look 20 feet away for 20 seconds</p>
          <Button size="sm" variant="secondary" onClick={acknowledge}>
            Done
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            size="sm"
            variant={running ? "destructive" : "outline"}
            onClick={() => {
              if (running) {
                setRunning(false);
              } else {
                setRunning(true);
              }
            }}
          >
            {running ? <><Square className="h-4 w-4 mr-1" /> Stop</> : <><Play className="h-4 w-4 mr-1" /> Start</>}
          </Button>
        </div>
      )}
    </div>
  );
};

/* ─── Posture Reset ─── */
const PHASES = [
  "Roll shoulders back",
  "Stretch neck left and right",
  "Stand and reach up",
] as const;

const PostureResetCard = () => {
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const total = 30;

  useEffect(() => {
    if (!active) return;
    if (elapsed >= total) {
      setActive(false);
      setElapsed(0);
      return;
    }
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [active, elapsed]);

  const phaseIndex = Math.min(Math.floor(elapsed / 10), 2);

  return (
    <div
      className="wellness-card feature-card backdrop-blur-xl bg-background/70 border border-white/20 rounded-2xl p-6 relative z-10"
      style={{ animationDelay: "0.45s" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-accent/10 p-2 rounded-lg">
          <RotateCcw className="h-5 w-5 text-accent" />
        </div>
        <h3 className="font-semibold text-foreground">Posture Reset</h3>
      </div>

      {active ? (
        <div className="space-y-3 py-2">
          <p className="text-sm font-medium text-center text-foreground">{PHASES[phaseIndex]}</p>
          <Progress value={(elapsed / total) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">{total - elapsed}s remaining</p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground mb-3">Quick 30-second guided stretch</p>
          <Button size="sm" variant="outline" onClick={() => { setElapsed(0); setActive(true); }}>
            Check Posture
          </Button>
        </div>
      )}
    </div>
  );
};

/* ─── Main Section ─── */
const DailyWellnessPractice = () => (
  <section className="py-16 px-4 section-animate">
    <div className="container max-w-6xl mx-auto">
      <div className="section-box section-box-gradient">
        <div className="text-center mb-10">
          <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-4">
            Daily Wellness
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">Daily Wellness Practice</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Small daily habits that make a big difference. Track, breathe, and reset — all in one place.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <BreathingCard />
          <HydrationCard />
          <VisionGuardCard />
          <PostureResetCard />
        </div>
      </div>
    </div>
  </section>
);

export default DailyWellnessPractice;
