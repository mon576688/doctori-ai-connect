import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, Wifi, WifiOff, Zap, CheckCircle, Share, MoreVertical } from "lucide-react";
import { SEO } from "@/components/SEO";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const benefits = [
    { icon: Zap, title: "Instant Loading", desc: "Opens instantly from your home screen" },
    { icon: WifiOff, title: "Works Offline", desc: "BMI calculator, cached medicines & more" },
    { icon: Smartphone, title: "Full Screen", desc: "No browser bar — feels like a native app" },
    { icon: Wifi, title: "Always Updated", desc: "Auto-updates when you're online" },
  ];

  return (
    <>
      <SEO title="Install Doctori AI" description="Install Doctori AI on your phone for instant access, offline support, and a native app experience." />
      <div className="container max-w-2xl py-8 px-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Install Doctori AI</h1>
          <p className="text-muted-foreground">Get the full app experience on your device</p>
        </div>

        {isInstalled ? (
          <Card className="border-primary/50 bg-primary/10">
            <CardContent className="flex items-center gap-3 pt-6">
              <CheckCircle className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-lg">Already Installed!</p>
                <p className="text-muted-foreground text-sm">Doctori AI is on your home screen. You're all set.</p>
              </div>
            </CardContent>
          </Card>
        ) : deferredPrompt ? (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <Download className="h-12 w-12 mx-auto text-primary" />
              <p className="text-lg font-medium">Ready to install!</p>
              <Button size="lg" onClick={handleInstall} className="w-full">
                <Download className="h-4 w-4 mr-2" /> Install Doctori AI
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isIOS ? "Install on iPhone / iPad" : "Install on Android"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isIOS ? (
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0 mt-0.5">1</Badge>
                    <span>Tap the <Share className="inline h-4 w-4" /> <strong>Share</strong> button in Safari</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0 mt-0.5">2</Badge>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0 mt-0.5">3</Badge>
                    <span>Tap <strong>"Add"</strong> to confirm</span>
                  </li>
                </ol>
              ) : (
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0 mt-0.5">1</Badge>
                    <span>Tap the <MoreVertical className="inline h-4 w-4" /> <strong>menu</strong> button in Chrome</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0 mt-0.5">2</Badge>
                    <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="shrink-0 mt-0.5">3</Badge>
                    <span>Tap <strong>"Install"</strong> to confirm</span>
                  </li>
                </ol>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          {benefits.map((b) => (
            <Card key={b.title}>
              <CardContent className="pt-4 pb-4 text-center space-y-1">
                <b.icon className="h-6 w-6 mx-auto text-primary" />
                <p className="font-medium text-sm">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Install;
