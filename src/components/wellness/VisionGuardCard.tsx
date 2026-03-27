import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Play, Square, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const todayKey = () => `vision-guard-sessions-${new Date().toISOString().slice(0, 10)}`;

const VisionGuardCard = () => {
  const { t } = useTranslation('home');

  const EYE_TIPS = [
    t('wellness.visionTip1'),
    t('wellness.visionTip2'),
    t('wellness.visionTip3'),
    t('wellness.visionTip4'),
    t('wellness.visionTip5'),
    t('wellness.visionTip6'),
    t('wellness.visionTip7'),
  ];

  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(1200);
  const [alert, setAlert] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [sessions, setSessions] = useState(() => {
    const stored = localStorage.getItem(todayKey());
    return stored ? parseInt(stored, 10) : 0;
  });

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

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTipIdx((i) => (i + 1) % EYE_TIPS.length), 8000);
    return () => clearInterval(id);
  }, [running, EYE_TIPS.length]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const acknowledge = useCallback(() => {
    const newSessions = sessions + 1;
    setSessions(newSessions);
    localStorage.setItem(todayKey(), String(newSessions));
    setAlert(false);
    setSeconds(1200);
    setRunning(true);
  }, [sessions]);

  return (
    <div
      className="wellness-card feature-card backdrop-blur-xl bg-background/70 border border-white/20 rounded-2xl p-6 relative z-10"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-secondary/10 p-2 rounded-lg">
            <Eye className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="font-semibold text-foreground">{t('wellness.visionGuard')}</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-secondary/60 hover:text-secondary transition-colors" aria-label="20-20-20 Rule Info">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px]">
              <p className="text-xs">
                <strong>{t('wellness.visionRule')}:</strong> {t('wellness.visionTip5')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="text-center py-2">
        <p className="text-3xl font-mono font-bold text-foreground">{fmt(seconds)}</p>
        <p className="text-xs text-muted-foreground mt-1">{t('wellness.visionRule')}</p>
      </div>

      {alert ? (
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-secondary">{t('wellness.visionLookAway')}</p>
          <Button size="sm" variant="secondary" onClick={acknowledge}>
            ✓
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            size="sm"
            variant={running ? "destructive" : "outline"}
            onClick={() => setRunning(!running)}
          >
            {running ? <><Square className="h-4 w-4 mr-1" /> {t('wellness.visionStop')}</> : <><Play className="h-4 w-4 mr-1" /> {t('wellness.visionStart')}</>}
          </Button>
        </div>
      )}

      <div className="mt-4 min-h-[2.5rem] flex items-center justify-center">
        <p className="text-xs text-muted-foreground text-center italic transition-opacity duration-500">
          💡 {EYE_TIPS[tipIdx]}
        </p>
      </div>

      {sessions > 0 && (
        <p className="text-xs text-center text-primary/70 mt-2">
          {sessions} {t('wellness.visionSessions')} ✓
        </p>
      )}
    </div>
  );
};

export default VisionGuardCard;
