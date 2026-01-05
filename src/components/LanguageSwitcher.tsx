import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage, isNepali } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(isNepali ? "en" : "ne");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-all duration-300 group"
      aria-label={`Switch to ${isNepali ? "English" : "Nepali"}`}
    >
      <div className="relative flex items-center">
        <span
          className={`text-sm font-semibold transition-all duration-300 ${
            !isNepali
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          EN
        </span>
        <div className="mx-2 w-8 h-5 bg-muted rounded-full relative">
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary shadow-md transition-all duration-300 ${
              isNepali ? "left-3.5" : "left-0.5"
            }`}
          />
        </div>
        <span
          className={`text-sm font-semibold transition-all duration-300 ${
            isNepali
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          ने
        </span>
      </div>
    </button>
  );
};

export default LanguageSwitcher;
