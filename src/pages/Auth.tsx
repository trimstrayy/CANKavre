import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Users,
  Building2,
  ArrowLeft,
  ExternalLink,
  Mail,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LanguageProvider } from "@/contexts/LanguageContext";

const AuthContent = () => {
  const { toast } = useToast();
  const { t, isNepali } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginType, setLoginType] = useState<"committee" | "subcommittee">("committee");
  const [credentials, setCredentials] = useState({ 
    email: "", 
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isNepali ? "लगइन प्रयास" : "Login Attempt",
        description: isNepali 
          ? "यो डेमो UI-मात्र लगइन हो। वास्तविक प्रमाणीकरण सक्षम गर्न ब्याकेन्ड जडान गर्नुहोस्।"
          : "This is a demo UI-only login. Connect a backend to enable real authentication.",
      });
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      toast({ 
        title: isNepali ? 'पासवर्ड मेल खाएन' : 'Password Mismatch', 
        description: isNepali ? 'पासवर्डहरू मेल खाँदैनन्। कृपया फेरि प्रयास गर्नुहोस्।' : 'Passwords do not match. Please try again.', 
        variant: 'destructive' 
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({ 
        title: isNepali ? 'दर्ता' : 'Registration', 
        description: isNepali ? 'दर्ता सिमुलेट गरियो। आधिकारिक सदस्यताको लागि, कृपया क्यान नेपाल पोर्टल प्रयोग गर्नुहोस्।' : 'Registration simulated. For official membership, please use the CAN Nepal portal.' 
      });
      window.open('https://canfederation.org/member_registration', '_blank');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-2" />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isNepali ? "गृहपृष्ठमा फर्कनुहोस्" : "Back to Home"}
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Side - Info */}
            <div className="lg:sticky lg:top-8 animate-fade-in-up">
              <div className="bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl p-8 text-can-white mb-6">
                <div className="w-20 h-20 bg-can-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-10 h-10" />
                </div>
                <h1 className="font-heading text-3xl font-bold mb-4">
                  {isNepali ? "क्यान काभ्रे" : "CAN Kavre"}<br />{isNepali ? "सदस्य पोर्टल" : "Member Portal"}
                </h1>
                <p className="text-can-white/80 mb-6">
                  {isNepali 
                    ? "आफ्नो सदस्य ड्यासबोर्ड पहुँच गर्नुहोस्, सामग्री व्यवस्थापन गर्नुहोस्, र काभ्रेपलाञ्चोकको आईसीटी समुदायसँग जोडिनुहोस्।"
                    : "Access your member dashboard, manage content, and connect with the ICT community of Kavrepalanchok."
                  }
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-can-white/20 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t("committeeMember")}</h3>
                      <p className="text-sm text-can-white/70">
                        {isNepali ? "सामग्री व्यवस्थापन र पेशहरू स्वीकृत गर्न पूर्ण एडमिन अधिकार" : "Full admin rights to manage content and approve submissions"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-can-white/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t("subcommitteeMember")}</h3>
                      <p className="text-sm text-can-white/70">
                        {isNepali ? "समिति स्वीकृतिको लागि सामग्री पेश गर्नुहोस् र स्रोतहरू हेर्नुहोस्" : "Submit content for committee approval and view resources"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration CTA */}
              <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-2">
                    {t("notMember")}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {isNepali 
                      ? "कम्प्युटर एसोसिएसन अफ नेपालमा सामेल हुनुहोस् र काभ्रेपलाञ्चोकको सबैभन्दा ठूलो आईसीटी समुदायको हिस्सा बन्नुहोस्।"
                      : "Join the Computer Association of Nepal and be part of the largest ICT community in Kavrepalanchok."
                    }
                  </p>
                  <a 
                    href="https://canfederation.org/member_registration" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button className="bg-primary hover:bg-primary/90 gap-2">
                      <UserPlus className="w-4 h-4" />
                      {t("registerOnCanNepal")}
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Forms */}
            <div className="animate-fade-in-up delay-100">
              <Card className="shadow-elevated border-0">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-heading text-2xl">
                    {activeTab === "login" ? t("memberLogin") : (isNepali ? "द्रुत दर्ता" : "Quick Registration")}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "login" 
                      ? t("signInToContinue")
                      : (isNepali ? "खाता सिर्जना गर्नुहोस् वा क्यान नेपालमा दर्ता गर्नुहोस्" : "Create an account or register at CAN Nepal")
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger 
                        value="login"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        {t("login")}
                      </TabsTrigger>
                      <TabsTrigger 
                        value="register"
                        className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isNepali ? "दर्ता" : "Register"}
                      </TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login" className="space-y-6">
                      {/* Login Type Selection */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setLoginType("committee")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            loginType === "committee" 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Users className={`w-8 h-8 mx-auto mb-2 ${
                            loginType === "committee" ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <span className={`font-medium block ${
                            loginType === "committee" ? "text-primary" : "text-foreground"
                          }`}>{isNepali ? "समिति" : "Committee"}</span>
                          <span className="text-xs text-muted-foreground">
                            {isNepali ? "पूर्ण पहुँच" : "Full Access"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoginType("subcommittee")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            loginType === "subcommittee" 
                              ? "border-secondary bg-secondary/5" 
                              : "border-border hover:border-secondary/50"
                          }`}
                        >
                          <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                            loginType === "subcommittee" ? "text-secondary" : "text-muted-foreground"
                          }`} />
                          <span className={`font-medium block ${
                            loginType === "subcommittee" ? "text-secondary" : "text-foreground"
                          }`}>{isNepali ? "उपसमिति" : "Subcommittee"}</span>
                          <span className="text-xs text-muted-foreground">
                            {isNepali ? "सीमित पहुँच" : "Limited Access"}
                          </span>
                        </button>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">{isNepali ? "इमेल ठेगाना" : "Email Address"}</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder={isNepali ? "तपाईंको@इमेल.com" : "your@email.com"}
                              className="pl-10"
                              value={credentials.email}
                              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">{t("password")}</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={credentials.password}
                              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-border" />
                            <span className="text-muted-foreground">
                              {isNepali ? "मलाई सम्झनुहोस्" : "Remember me"}
                            </span>
                          </label>
                          <a href="#" className="text-primary hover:underline">{t("forgotPassword")}</a>
                        </div>

                        <Button 
                          type="submit" 
                          className={`w-full ${
                            loginType === "committee" 
                              ? "bg-primary hover:bg-primary/90" 
                              : "bg-secondary hover:bg-secondary/90"
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-can-white/30 border-t-can-white rounded-full animate-spin" />
                              {t("loggingIn")}
                            </span>
                          ) : (
                            <>
                              <LogIn className="w-4 h-4 mr-2" />
                              {isNepali 
                                ? `${loginType === "committee" ? "समिति" : "उपसमिति"}को रूपमा साइन इन गर्नुहोस्`
                                : `Sign In as ${loginType === "committee" ? "Committee" : "Subcommittee"}`
                              }
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Register Tab */}
                    <TabsContent value="register" className="space-y-6">
                      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
                        <p className="text-sm text-foreground">
                          <strong>{isNepali ? "नोट:" : "Note:"}</strong> {isNepali 
                            ? "आधिकारिक क्यान सदस्यता दर्ता केन्द्रीय क्यान नेपाल पोर्टल मार्फत गरिन्छ।"
                            : "Official CAN membership registration is done through the central CAN Nepal portal."
                          }
                        </p>
                      </div>

                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">{t("fullName")}</Label>
                          <Input
                            id="fullName"
                            type="text"
                            placeholder={isNepali ? "तपाईंको पूरा नाम प्रविष्ट गर्नुहोस्" : "Enter your full name"}
                            value={credentials.fullName}
                            onChange={(e) => setCredentials({ ...credentials, fullName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email">{isNepali ? "इमेल ठेगाना" : "Email Address"}</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="reg-email"
                              type="email"
                              placeholder={isNepali ? "तपाईंको@इमेल.com" : "your@email.com"}
                              className="pl-10"
                              value={credentials.email}
                              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password">{isNepali ? "पासवर्ड सिर्जना गर्नुहोस्" : "Create Password"}</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="reg-password"
                              type={showPassword ? "text" : "password"}
                              placeholder={isNepali ? "बलियो पासवर्ड सिर्जना गर्नुहोस्" : "Create a strong password"}
                              className="pl-10 pr-10"
                              value={credentials.password}
                              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">{isNepali ? "पासवर्ड पुष्टि गर्नुहोस्" : "Confirm Password"}</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder={isNepali ? "तपाईंको पासवर्ड पुष्टि गर्नुहोस्" : "Confirm your password"}
                            value={credentials.confirmPassword}
                            onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                            required
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-accent hover:bg-accent/90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-can-white/30 border-t-can-white rounded-full animate-spin" />
                              {isNepali ? "प्रशोधन हुँदैछ..." : "Processing..."}
                            </span>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              {isNepali ? "दर्ता जारी राख्नुहोस्" : "Continue Registration"}
                            </>
                          )}
                        </Button>
                      </form>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                            {isNepali ? "वा सिधै दर्ता गर्नुहोस्" : "Or register directly"}
                          </span>
                        </div>
                      </div>

                      <a 
                        href="https://can.org.np/membership" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2">
                          <ExternalLink className="w-4 h-4" />
                          {isNepali ? "क्यान नेपाल आधिकारिक पोर्टलमा दर्ता गर्नुहोस्" : "Register at CAN Nepal Official Portal"}
                        </Button>
                      </a>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Help Text */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                {isNepali ? "सहायता चाहिन्छ? " : "Need help? Contact us at "}
                <a href="mailto:cankavre@gmail.com" className="text-primary hover:underline">
                  cankavre@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Auth = () => {
  return (
    <LanguageProvider>
      <AuthContent />
    </LanguageProvider>
  );
};

export default Auth;
