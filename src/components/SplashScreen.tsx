import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const splashShown = sessionStorage.getItem("canKavreSplashShown");
    
    if (splashShown) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const completeTimer = setTimeout(() => {
      sessionStorage.setItem("canKavreSplashShown", "true");
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Check if already shown (for initial render)
  if (sessionStorage.getItem("canKavreSplashShown")) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Tricolor bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bar" />
      
      {/* Logo animation */}
      <div className="relative animate-scale-in">
        {/* Animated rings */}
        <div className="absolute inset-0 -m-8 rounded-full border-4 border-primary/20 animate-pulse-slow" />
        <div className="absolute inset-0 -m-4 rounded-full border-2 border-secondary/30 animate-pulse-slow delay-200" />
        
        {/* Logo container (use public/CANKavre_Logo.jpeg) */}
        <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-1 shadow-elevated overflow-hidden">
          <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
            <img src="/CANKavre_Logo.jpeg" alt="CAN Kavre logo" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="mt-8 text-center animate-fade-in-up delay-300">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          CAN Federation
        </h1>
        <p className="text-lg text-secondary font-medium mt-1">Kavre</p>
        <p className="text-sm text-muted-foreground mt-2">
          Computer Association of Nepal
        </p>
      </div>

      {/* Loading dots */}
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

      {/* Bottom tricolor bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 gradient-bar" />
    </div>
  );
};

export default SplashScreen;
