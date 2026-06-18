import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Monitor, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Youtube, 
  Send,
  MessageSquare,
  User,
  AtSign,
  CheckCircle,
  RefreshCw,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { toast } = useToast();
  const { t, isNepali } = useLanguage();
  const [email, setEmail] = useState("");
  const createCaptcha = () => {
    const left = Math.floor(Math.random() * 8) + 2;
    const right = Math.floor(Math.random() * 8) + 1;
    const operator = Math.random() > 0.5 ? "+" : "-";
    const answer = operator === "+" ? left + right : Math.max(left, right) - Math.min(left, right);

    return {
      left: operator === "-" ? Math.max(left, right) : left,
      right: operator === "-" ? Math.min(left, right) : right,
      operator,
      answer,
    };
  };
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    captcha: ""
  });
  const [captchaChallenge, setCaptchaChallenge] = useState(createCaptcha);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isNepali ? "सदस्यता लिइयो!" : "Subscribed!",
      description: isNepali ? "हाम्रो न्यूजलेटरमा सदस्यता लिनुभएकोमा धन्यवाद।" : "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(feedback.captcha) !== captchaChallenge.answer) {
      toast({
        title: isNepali ? "गलत क्याप्चा" : "Invalid Captcha",
        description: isNepali ? "कृपया गणित समस्या सही समाधान गर्नुहोस्।" : "Please solve the math problem correctly.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: isNepali ? "प्रतिक्रिया पठाइयो!" : "Feedback Sent!",
      description: isNepali ? "तपाईंको प्रतिक्रियाको लागि धन्यवाद। हामी चाँडै सम्पर्क गर्नेछौं।" : "Thank you for your feedback. We'll get back to you soon.",
    });
    setCaptchaChallenge(createCaptcha());
    setFeedback({ name: "", email: "", phone: "", message: "", captcha: "" });
  };

  const refreshCaptcha = () => {
    setCaptchaChallenge(createCaptcha());
    setFeedback((current) => ({ ...current, captcha: "" }));
  };

  const quickLinks = [
    { name: t("aboutUs"), path: "/about" },
    { name: t("programs"), path: "/programs" },
    { name: t("events"), path: "/events" },
    { name: t("pressReleases"), path: "/press-releases" },
    { name: t("downloads"), path: "/downloads" },
    { name: t("membership"), path: "/membership" },
  ];

  return (
    <footer className="bg-foreground text-background relative">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5">
                <div className="w-full h-full rounded-[10px] bg-foreground flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">
                  {isNepali ? "क्यान फेडरेसन" : "CAN Federation"}
                </h3>
                <p className="text-sm text-background/70">{isNepali ? "काभ्रे" : "Kavre"}</p>
              </div>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              {isNepali 
                ? "क्यान फेडरेसन काभ्रे काभ्रेपलाञ्चोकमा आईसीटी विकास, डिजिटल रूपान्तरण, र पेशागत सहकार्यलाई प्रवर्द्धन गर्ने जिल्ला स्तरीय संगठन हो।"
                : "CAN Federation Kavre is a district-level organization promoting ICT development, digital transformation, and professional collaboration in Kavrepalanchok."
              }
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/cankavre" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary/20 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@cankavre" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold">{t("contactUs")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/80">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>{isNepali ? "सचिवालय कार्यालय, बनेपा-गोदामचोक, काभ्रेपलाञ्चोक, नेपाल" : "Secretariat Office, Banepa-Godamchok, Kavrepalanchok, Nepal"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/80">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span>9841315182 / 9851237483</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/80">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>cankavre@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/80">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{isNepali ? "आधिकारिक इमेल: info@cankavre.org.np (छिट्टै आउँदैछ)" : "Official Email: info@cankavre.org.np (coming soon)"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/80">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{isNepali ? "समर्थन इमेल: support@cankavre.org.np (छिट्टै आउँदैछ)" : "Support Email: support@cankavre.org.np (coming soon)"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/80">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <span>{isNepali ? "आइतबार - शुक्रबार, १०:०० AM - ५:०० PM" : "Sunday - Friday, 10:00 AM - 5:00 PM"}</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="font-semibold text-sm mb-2">{isNepali ? "न्यूजलेटर" : "Newsletter"}</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t("yourEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 text-sm"
                />
                <Button type="submit" size="icon" className="bg-secondary hover:bg-secondary/90 shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold">{t("quickLinksFooter")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-sm text-background/80 hover:text-secondary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback Form */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              {t("sendFeedback")}
            </h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-background/50" />
                <Input
                  placeholder={t("fullName")}
                  value={feedback.name}
                  onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                  required
                  className="pl-10 bg-background/10 border-background/20 text-background placeholder:text-background/50 text-sm"
                />
              </div>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-background/50" />
                <Input
                  type="email"
                  placeholder={t("email")}
                  value={feedback.email}
                  onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                  required
                  className="pl-10 bg-background/10 border-background/20 text-background placeholder:text-background/50 text-sm"
                />
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-background/50" />
                <Input
                  placeholder={t("contactNumber")}
                  value={feedback.phone}
                  onChange={(e) => setFeedback({ ...feedback, phone: e.target.value })}
                  className="pl-10 bg-background/10 border-background/20 text-background placeholder:text-background/50 text-sm"
                />
              </div>
              <Textarea
                placeholder={t("message")}
                value={feedback.message}
                onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                required
                rows={3}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 text-sm resize-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-background/70">
                  {isNepali
                    ? `${captchaChallenge.left} ${captchaChallenge.operator} ${captchaChallenge.right} = ?`
                    : `${captchaChallenge.left} ${captchaChallenge.operator} ${captchaChallenge.right} = ?`}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={refreshCaptcha}
                  className="h-10 w-10 shrink-0 text-background/70 hover:bg-background/10 hover:text-background"
                  aria-label={isNepali ? "क्याप्चा फेरि बनाउनुहोस्" : "Refresh captcha"}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  placeholder="?"
                  value={feedback.captcha}
                  onChange={(e) => setFeedback({ ...feedback, captcha: e.target.value })}
                  required
                  className="w-20 bg-background/10 border-background/20 text-background text-sm text-center"
                />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t("submitFeedback")}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/70 text-center md:text-left">
              © {new Date().getFullYear()} {isNepali ? "क्यान फेडरेसन काभ्रे।" : "CAN Federation Kavre."} {t("allRightsReserved")}
              <br />
              {isNepali ? "पावर्ड बाई आयुष दाहाल" : "Powered By AAYUSH DAHAL"}
            </p>
            <div className="flex items-center gap-4 text-sm text-background/70">
              <Link to="/about" className="hover:text-secondary transition-colors">
                {isNepali ? "गोपनीयता नीति" : "Privacy Policy"}
              </Link>
              <span>•</span>
              <Link to="/about" className="hover:text-secondary transition-colors">
                {isNepali ? "सेवाका सर्तहरू" : "Terms of Service"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom tricolor stripes */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[0px]">
          <span className="h-2 w-full bg-red-600" />
          <span className="h-2 w-full bg-green-600" />
          <span className="h-2 w-full bg-blue-600" />
        </div>
        <div className="absolute bottom-0 z-20 right-0 container mx-auto px-4 flex justify-end">
          <span className="inline-flex items-center bg-green-600 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-md">
            {isNepali ? "Together We Can" : "Together We Can"}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
