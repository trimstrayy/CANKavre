import { useState } from "react";
import {
  Users,
  LogIn,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  ExternalLink,
  CreditCard,
  FileCheck,
  BookOpen,
  BadgeCheck,
  Building2,
  User,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface MembershipType {
  type: string;
  typeNe: string;
  fee: string;
  feeNe: string;
  description: string;
  descriptionNe: string;
  color: string;
  icon: React.ElementType;
  benefits: string[];
  benefitsNe: string[];
}

const membershipTypes: MembershipType[] = [
  {
    type: "Life Membership",
    typeNe: "आजीवन सदस्यता",
    fee: "NRS 6,000",
    feeNe: "रु. ६,०००",
    description: "One-time fee for permanent membership with full voting rights and all benefits.",
    descriptionNe: "पूर्ण मतदान अधिकार र सबै सुविधाहरूसहित स्थायी सदस्यताको लागि एकपटकको शुल्क।",
    color: "primary",
    icon: BadgeCheck,
    benefits: [
      "Lifetime access to all CAN Kavre programs",
      "Voting rights in AGM & Convention",
      "Eligibility for committee positions",
      "Priority for training & workshops",
    ],
    benefitsNe: [
      "क्यान काभ्रेका सबै कार्यक्रमहरूमा आजीवन पहुँच",
      "साधारण सभा र अधिवेशनमा मतदान अधिकार",
      "समिति पदहरूको लागि योग्यता",
      "तालिम र कार्यशालाहरूमा प्राथमिकता",
    ],
  },
  {
    type: "Individual Membership",
    typeNe: "व्यक्तिगत सदस्यता",
    fee: "NRS 800 / year",
    feeNe: "रु. ८०० / वर्ष",
    description: "Annual renewable membership for individuals interested in ICT community activities.",
    descriptionNe: "आईसीटी समुदायिक गतिविधिहरूमा रुचि राख्ने व्यक्तिहरूको लागि वार्षिक नवीकरणीय सदस्यता।",
    color: "secondary",
    icon: User,
    benefits: [
      "Access to CAN Kavre events & programs",
      "Networking with ICT professionals",
      "Discounted training fees",
      "Member newsletter & updates",
    ],
    benefitsNe: [
      "क्यान काभ्रे कार्यक्रम र गतिविधिहरूमा पहुँच",
      "आईसीटी पेशेवरहरूसँग नेटवर्किङ",
      "तालिम शुल्कमा छुट",
      "सदस्य न्यूजलेटर र अपडेटहरू",
    ],
  },
  {
    type: "Institutional Membership",
    typeNe: "संस्थागत सदस्यता",
    fee: "NRS 5,000 / year",
    feeNe: "रु. ५,००० / वर्ष",
    description: "For IT companies, educational institutions, and organizations in Kavrepalanchok.",
    descriptionNe: "काभ्रेपलाञ्चोकका आईटी कम्पनी, शैक्षिक संस्था र संगठनहरूको लागि।",
    color: "accent",
    icon: Building2,
    benefits: [
      "Organizational representation in CAN Kavre",
      "Participation in ICT Business Meet",
      "Staff access to training programs",
      "Logo display on CAN Kavre website",
    ],
    benefitsNe: [
      "क्यान काभ्रेमा संगठनात्मक प्रतिनिधित्व",
      "आईसीटी व्यापार भेटमा सहभागिता",
      "कर्मचारीको तालिम कार्यक्रममा पहुँच",
      "क्यान काभ्रे वेबसाइटमा लोगो प्रदर्शन",
    ],
  },
];

const requiredDocuments = [
  {
    name: "Nepali Citizenship Certificate",
    nameNe: "नेपाली नागरिकता प्रमाणपत्र",
    description: "Scanned copy of both sides",
    descriptionNe: "दुवै पट्टिको स्क्यान प्रति",
  },
  {
    name: "Academic Certificates",
    nameNe: "शैक्षिक प्रमाणपत्र",
    description: "Minimum SLC/SEE or equivalent",
    descriptionNe: "न्यूनतम एस.एल.सी./एस.ई.ई. वा सो सरह",
  },
  {
    name: "Passport-size Photo",
    nameNe: "पासपोर्ट साइजको फोटो",
    description: "Recent photograph with white background",
    descriptionNe: "सेतो पृष्ठभूमिको हालसालैको फोटो",
  },
  {
    name: "Professional / IT Related Certificate (if any)",
    nameNe: "व्यावसायिक / आईटी सम्बन्धी प्रमाणपत्र (भएमा)",
    description: "Optional — IT training or work experience proof",
    descriptionNe: "ऐच्छिक — आईटी तालिम वा कार्य अनुभव प्रमाण",
  },
];

const Membership = () => {
  const { t, isNepali } = useLanguage();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"committee" | "subcommittee">("committee");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isNepali ? "लगइन प्रयास" : "Login Attempt",
      description: isNepali
        ? "ब्याकएन्ड प्रमाणीकरण आवश्यक छ। कृपया सर्भर चालु छ भनी सुनिश्चित गर्नुहोस्।"
        : "Backend authentication required. Please ensure the server is running.",
    });
  };

  const colorMap: Record<string, string> = {
    primary: "border-primary bg-primary/5",
    secondary: "border-secondary bg-secondary/5",
    accent: "border-accent bg-accent/5",
  };

  const badgeColorMap: Record<string, string> = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  const iconColorMap: Record<string, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="text-accent">{t("membershipTitle")}</span> {isNepali ? "पोर्टल" : "Portal"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("membershipSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Membership Types & Fee Structure */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CreditCard className="w-7 h-7 text-secondary" />
              <h2 className="font-heading text-3xl font-bold text-foreground">
                {isNepali ? "सदस्यता प्रकार र शुल्क संरचना" : "Membership Types & Fee Structure"}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isNepali
                ? "कम्प्युटर एसोसिएसन अफ नेपाल (क्यान) काभ्रे शाखाको सदस्यता लिन तलको विवरण हेर्नुहोस्।"
                : "Choose the membership category that fits you best to join Computer Association of Nepal (CAN) Kavre Branch."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {membershipTypes.map((membership) => {
              const IconComp = membership.icon;
              return (
                <Card
                  key={membership.type}
                  className={`border-2 ${colorMap[membership.color]} card-hover relative overflow-hidden`}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-${membership.color}/10 flex items-center justify-center`}>
                      <IconComp className={`w-7 h-7 ${iconColorMap[membership.color]}`} />
                    </div>
                    <CardTitle className="text-xl">
                      {isNepali ? membership.typeNe : membership.type}
                    </CardTitle>
                    <Badge className={`${badgeColorMap[membership.color]} text-lg px-4 py-1 mt-2`}>
                      {isNepali ? membership.feeNe : membership.fee}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {isNepali ? membership.descriptionNe : membership.description}
                    </p>
                    <ul className="space-y-2">
                      {(isNepali ? membership.benefitsNe : membership.benefits).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className={`w-4 h-4 ${iconColorMap[membership.color]} shrink-0 mt-0.5`} />
                          <span className="text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full mt-6 bg-${membership.color} hover:bg-${membership.color}/90`} asChild>
                      <a href="https://canfederation.org/member_registration" target="_blank" rel="noopener noreferrer">
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isNepali ? "आवेदन गर्नुहोस्" : "Apply Now"}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {isNepali ? "आवश्यक कागजातहरू" : "Required Documents"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isNepali ? "सदस्यता आवेदनको लागि निम्न कागजातहरू चाहिन्छ" : "The following documents are required for membership application"}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {requiredDocuments.map((doc, index) => (
                <Card key={index} className="card-hover border-l-4 border-l-secondary">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Upload className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {isNepali ? doc.nameNe : doc.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isNepali ? doc.descriptionNe : doc.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {isNepali ? "अपलोड" : "Upload"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <BookOpen className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p>
                  {isNepali
                    ? "नोट: सबै कागजातहरू PDF वा JPG/PNG ढाँचामा अपलोड गर्नुपर्छ। आधिकारिक दर्ताको लागि कागजातहरू क्यान नेपाल केन्द्रीय पोर्टल मार्फत पेश गर्नुहोस्।"
                    : "Note: All documents must be uploaded in PDF or JPG/PNG format. For official registration, submit documents through the CAN Nepal central portal."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section — Localhost-only enhancement */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="mb-6 rounded-lg border border-dashed border-accent/40 bg-accent/5 p-4 text-sm text-muted-foreground text-center">
              {isNepali
                ? "साइट सामग्री सम्पादन सबैका लागि खुला छ। लगइन नगरी द्रुत परिवर्तनहरू गर्न प्रत्येक खण्डमा देखाइएको सम्पादन बटनहरू प्रयोग गर्नुहोस्।"
                : "Site content editing is open to everyone. Use the edit buttons shown on each section to make quick changes without logging in."}
            </div>
            <Card className="shadow-card animate-fade-in-up">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5">
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <Shield className="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{t("memberLogin")}</CardTitle>
                <CardDescription>
                  {t("enterCredentials")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={loginType} onValueChange={(v) => setLoginType(v as typeof loginType)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="committee" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      {t("committeeLogin")}
                    </TabsTrigger>
                    <TabsTrigger value="subcommittee" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                      {t("subcommitteeLogin")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="committee">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-committee">{t("email")}</Label>
                        <Input
                          id="email-committee"
                          type="email"
                          placeholder={isNepali ? "तपाईंको@इमेल.com" : "your@email.com"}
                          value={credentials.email}
                          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-committee">{t("password")}</Label>
                        <div className="relative">
                          <Input
                            id="password-committee"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        <LogIn className="w-4 h-4 mr-2" />
                        {isNepali ? "समिति लगइन" : "Login as Committee"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="subcommittee">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-sub">{t("email")}</Label>
                        <Input
                          id="email-sub"
                          type="email"
                          placeholder={isNepali ? "तपाईंको@इमेल.com" : "your@email.com"}
                          value={credentials.email}
                          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-sub">{t("password")}</Label>
                        <div className="relative">
                          <Input
                            id="password-sub"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                        <LogIn className="w-4 h-4 mr-2" />
                        {isNepali ? "उपसमिति लगइन" : "Login as Subcommittee"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t("notMember")}
                  </p>
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
                    <a href="https://canfederation.org/member_registration" target="_blank" rel="noopener noreferrer">
                      <UserPlus className="w-4 h-4 mr-2" />
                      {t("registerOnCanNepal")}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Member Benefits */}
            <div className="mt-8 grid gap-4">
              <Card className="bg-background">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {isNepali ? "समिति पहुँच" : "Committee Access"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isNepali ? "सामग्री व्यवस्थापन गर्न पूर्ण एडमिन अधिकार" : "Full admin rights to manage content"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {isNepali ? "उपसमिति पहुँच" : "Subcommittee Access"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isNepali ? "समिति स्वीकृतिको लागि सामग्री पेश गर्नुहोस्" : "Submit content for committee approval"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
