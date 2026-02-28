import { useState, useEffect } from "react";
import { Droplets, Sparkles, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BreathingCard from "@/components/wellness/BreathingCard";
import VisionGuardCard from "@/components/wellness/VisionGuardCard";

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

      <div className="absolute bottom-0 left-0 right-0 h-1.5">
        <div
          className="h-full bg-primary/40 transition-all duration-500"
          style={{ width: `${(glasses / goal) * 100}%` }}
        />
      </div>
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
