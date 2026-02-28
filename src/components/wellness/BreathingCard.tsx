import { useState, useEffect, useRef, useCallback } from "react";
import { Wind, Sparkles, X, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

/* ─── Technique Definitions ─── */
type Phase = { label: string; type: "inhale" | "hold-in" | "exhale" | "hold-out"; duration: number };
type Technique = { name: string; short: string; phases: Phase[] };

const TECHNIQUES: Technique[] = [
  {
    name: "Box Breathing",
    short: "Box",
    phases: [
      { label: "Inhale", type: "inhale", duration: 4 },
      { label: "Hold", type: "hold-in", duration: 4 },
      { label: "Exhale", type: "exhale", duration: 4 },
      { label: "Hold", type: "hold-out", duration: 4 },
    ],
  },
  {
    name: "4-7-8 Relaxation",
    short: "4-7-8",
    phases: [
      { label: "Inhale", type: "inhale", duration: 4 },
      { label: "Hold", type: "hold-in", duration: 7 },
      { label: "Exhale", type: "exhale", duration: 8 },
    ],
  },
  {
    name: "Simple Deep Breath",
    short: "Simple",
    phases: [
      { label: "Inhale", type: "inhale", duration: 4 },
      { label: "Exhale", type: "exhale", duration: 4 },
    ],
  },
];

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const BreathingCard = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [techIdx, setTechIdx] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const technique = TECHNIQUES[techIdx];
  const currentPhase = technique.phases[phaseIdx];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start breathing cycle when overlay opens
  useEffect(() => {
    if (!overlayOpen) return;
    setPhaseIdx(0);
    setCycles(0);
    setElapsed(0);
    setCountdown(TECHNIQUES[techIdx].phases[0].duration);

    elapsedRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [overlayOpen, techIdx]);

  // Phase countdown timer
  useEffect(() => {
    if (!overlayOpen) return;
    setCountdown(currentPhase.duration);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          // Move to next phase
          setPhaseIdx((pi) => {
            const next = pi + 1;
            if (next >= technique.phases.length) {
              setCycles((cy) => cy + 1);
              return 0;
            }
            return next;
          });
          return 0; // will be reset by the phaseIdx change
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [overlayOpen, phaseIdx, currentPhase.duration, technique.phases.length]);

  const handleClose = useCallback(() => {
    setOverlayOpen(false);
    if (elapsed > 0) {
      toast({
        title: "Breathing Session Complete",
        description: `${cycles} cycle${cycles !== 1 ? "s" : ""} · ${fmtTime(elapsed)} elapsed`,
      });
    }
  }, [elapsed, cycles]);

  const circleScale = currentPhase.type === "inhale" ? "scale(1)" : currentPhase.type === "exhale" ? "scale(0.6)" : "scale(0.8)";
  const circleColor =
    currentPhase.type === "inhale"
      ? "radial-gradient(circle, hsl(217 91% 60% / 0.6), hsl(217 91% 60% / 0.15))"
      : currentPhase.type === "exhale"
      ? "radial-gradient(circle, hsl(158 64% 52% / 0.6), hsl(158 64% 52% / 0.15))"
      : "radial-gradient(circle, hsl(270 60% 60% / 0.6), hsl(270 60% 60% / 0.15))";
  const circleShadow =
    currentPhase.type === "inhale"
      ? "0 0 60px hsl(217 91% 60% / 0.3)"
      : currentPhase.type === "exhale"
      ? "0 0 60px hsl(158 64% 52% / 0.3)"
      : "0 0 60px hsl(270 60% 60% / 0.3)";

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
        <p className="text-xs text-muted-foreground text-center">Tap to begin breathing exercise</p>
      </div>

      {/* Full-screen overlay */}
      {overlayOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
            aria-label="Close breathing overlay"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Technique selector */}
          <div className="flex gap-2 mb-10">
            {TECHNIQUES.map((t, i) => (
              <Button
                key={t.short}
                size="sm"
                variant={i === techIdx ? "default" : "outline"}
                onClick={() => {
                  setTechIdx(i);
                  setPhaseIdx(0);
                  setCycles(0);
                  setElapsed(0);
                }}
              >
                {t.short}
              </Button>
            ))}
          </div>

          {/* Breathing circle */}
          <div
            className="w-40 h-40 rounded-full transition-all duration-[3000ms] ease-in-out"
            style={{
              transform: circleScale,
              background: circleColor,
              boxShadow: circleShadow,
            }}
          />

          {/* Phase label + countdown */}
          <p className="mt-8 text-2xl font-semibold text-foreground">
            {currentPhase.label}... {countdown}s
          </p>
          <p className="mt-2 text-muted-foreground text-sm">{technique.name}</p>

          {/* Cycle & Timer */}
          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              Cycle: <span className="font-semibold text-foreground">{cycles}</span>
            </span>
            <span className="text-muted-foreground/40">|</span>
            <span className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span className="font-semibold text-foreground">{fmtTime(elapsed)}</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default BreathingCard;
