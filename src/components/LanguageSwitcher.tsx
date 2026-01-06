import { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage, isNepali } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const selectLanguage = (lang: "en" | "ne") => {
    setLanguage(lang);
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleExpand}
        className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
          isNepali 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        } hover:scale-110 shadow-md`}
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
      </button>

      {/* Expanded dropdown */}
      <div
        className={`absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-50 ${
          isExpanded 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <button
          onClick={() => selectLanguage("en")}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors ${
            !isNepali
              ? "bg-secondary text-secondary-foreground"
              : "hover:bg-muted text-foreground"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${!isNepali ? "bg-secondary-foreground" : "bg-secondary"}`} />
          <span>English</span>
          {!isNepali && <span className="ml-auto text-xs opacity-70">✓</span>}
        </button>
        <button
          onClick={() => selectLanguage("ne")}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors ${
            isNepali
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-foreground"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isNepali ? "bg-primary-foreground" : "bg-primary"}`} />
          <span>नेपाली</span>
          {isNepali && <span className="ml-auto text-xs opacity-70">✓</span>}
        </button>
      </div>

      {/* Click outside to close */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;
