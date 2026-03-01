import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Laptop,
  Users,
  Building2,
  Globe,
  Heart,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import EditableField from "@/components/EditableField";
import ProgramModal, { ProgramFormData, CATEGORY_LABELS } from "@/components/ProgramModal";
import {
  Program,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const iconMap = {
  laptop: Laptop,
  graduationCap: GraduationCap,
  globe: Globe,
  users: Users,
  building2: Building2,
  heart: Heart,
} as const;

type ProgramIconKey = keyof typeof iconMap;

type ProgramItem = {
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  icon: ProgramIconKey;
  color: "primary" | "secondary" | "accent";
  features: string[];
  featuresNe: string[];
  image: string;
};

type AchievementItem = {
  number: string;
  label: string;
  labelNe: string;
  bgColor: string;
};


const achievements: AchievementItem[] = [
  { number: "13+", label: "IT Clubs Established", labelNe: "आईटी क्लबहरू स्थापित", bgColor: "bg-green-500" },
  { number: "2000+", label: "Citizens Trained", labelNe: "नागरिकहरू तालिम प्राप्त", bgColor: "bg-green-500" },
  { number: "100+", label: "Programs Conducted", labelNe: "कार्यक्रमहरू सम्पन्न", bgColor: "bg-blue-500" },
  { number: "13+", label: "Municipalities Covered", labelNe: "पालिकाहरू समेटिएको", bgColor: "bg-blue-500" },
];

const programs: ProgramItem[] = [
  {
    title: "Digital Literacy Campaign",
    titleNe: "डिजिटल साक्षरता अभियान",
    description: "Empowering citizens of all ages with basic computer and internet skills. Our comprehensive training covers essential digital skills needed in today's world.",
    descriptionNe: "सबै उमेरका नागरिकहरूलाई आधारभूत कम्प्युटर र इन्टरनेट सीपहरूले सशक्त बनाउँदै। हाम्रो व्यापक तालिमले आजको संसारमा आवश्यक आवश्यक डिजिटल सीपहरू समेट्छ।",
    icon: "laptop",
    color: "primary",
    features: ["Basic Computer Training", "Internet Safety", "Email & Social Media", "Online Banking Basics"],
    featuresNe: ["आधारभूत कम्प्युटर तालिम", "इन्टरनेट सुरक्षा", "इमेल र सोशल मिडिया", "अनलाइन बैंकिङ आधारभूत"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
  },
  {
    title: "IT Club Development",
    titleNe: "आईटी क्लब विकास",
    description: "Establishing and supporting IT clubs in schools across Kavrepalanchok to nurture the next generation of tech leaders.",
    descriptionNe: "अर्को पुस्ताका टेक नेताहरूलाई पोषण गर्न काभ्रेपलाञ्चोकभरका विद्यालयहरूमा आईटी क्लबहरू स्थापना र समर्थन गर्दै।",
    icon: "graduationCap",
    color: "secondary",
    features: ["School IT Club Setup", "Student Mentorship", "Coding Workshops", "Inter-school Competitions"],
    featuresNe: ["विद्यालय आईटी क्लब स्थापना", "विद्यार्थी मेन्टरशिप", "कोडिङ कार्यशालाहरू", "अन्तर-विद्यालय प्रतियोगिताहरू"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
  },
  {
    title: "ICT in Agriculture",
    titleNe: "कृषिमा आईसीटी",
    description: "Introducing modern farming techniques through technology. Helping farmers adopt digital tools for better productivity and market access.",
    descriptionNe: "प्रविधि मार्फत आधुनिक कृषि प्रविधिहरू परिचय गराउँदै। राम्रो उत्पादकत्व र बजार पहुँचको लागि किसानहरूलाई डिजिटल उपकरणहरू अपनाउन मद्दत गर्दै।",
    icon: "globe",
    color: "accent",
    features: ["Digital Farming Tools", "Market Connectivity", "Weather Information", "E-Commerce Training"],
    featuresNe: ["डिजिटल कृषि उपकरणहरू", "बजार जडान", "मौसम जानकारी", "ई-कमर्स तालिम"],
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80",
  },
  {
    title: "Women in Tech",
    titleNe: "प्रविधिमा महिला",
    description: "Special programs designed to increase female participation in the ICT sector, providing skills training and career guidance.",
    descriptionNe: "आईसीटी क्षेत्रमा महिला सहभागिता बढाउन, सीप तालिम र क्यारियर मार्गदर्शन प्रदान गर्न डिजाइन गरिएका विशेष कार्यक्रमहरू।",
    icon: "users",
    color: "primary",
    features: ["Skills Training", "Career Guidance", "Networking Events", "Entrepreneurship Support"],
    featuresNe: ["सीप तालिम", "क्यारियर मार्गदर्शन", "नेटवर्किङ कार्यक्रमहरू", "उद्यमशीलता समर्थन"],
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80",
  },
  {
    title: "E-Governance Support",
    titleNe: "ई-गभर्नेन्स समर्थन",
    description: "Assisting local government bodies in implementing digital solutions for better public service delivery.",
    descriptionNe: "राम्रो सार्वजनिक सेवा प्रदानको लागि डिजिटल समाधानहरू कार्यान्वयन गर्न स्थानीय सरकारी निकायहरूलाई सहयोग गर्दै।",
    icon: "building2",
    color: "secondary",
    features: ["Digital Documentation", "Online Services", "Staff Training", "Infrastructure Support"],
    featuresNe: ["डिजिटल कागजात", "अनलाइन सेवाहरू", "कर्मचारी तालिम", "पूर्वाधार समर्थन"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    title: "Health & ICT",
    titleNe: "स्वास्थ्य र आईसीटी",
    description: "Promoting digital health solutions and telemedicine awareness in remote areas of the district.",
    descriptionNe: "जिल्लाको टाढाका क्षेत्रहरूमा डिजिटल स्वास्थ्य समाधानहरू र टेलिमेडिसिन जागरूकता प्रवर्द्धन गर्दै।",
    icon: "heart",
    color: "accent",
    features: ["Telemedicine Awareness", "Health App Training", "Digital Health Records", "Emergency Response Systems"],
    featuresNe: ["टेलिमेडिसिन जागरूकता", "स्वास्थ्य एप तालिम", "डिजिटल स्वास्थ्य रेकर्डहरू", "आपतकालीन प्रतिक्रिया प्रणालीहरू"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80",
  },
];

const Programs = () => {
  const { t, isNepali } = useLanguage();
  const { isAdmin, token } = useAdmin();
  const { toast } = useToast();

  // ── DB-driven programs (upcoming/managed) ──────────────────────
  const [dbPrograms, setDbPrograms] = useState<Program[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProgramFormData | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  // Fetch DB programs on mount
  useEffect(() => {
    getPrograms()
      .then(({ programs: p }) => setDbPrograms(p))
      .catch(() => {
        // Backend may not be running — fall back silently
      })
      .finally(() => setIsLoadingDb(false));
  }, []);

  // ── Handlers ───────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(undefined);
    setModalOpen(true);
  };

  const openEdit = (prog: Program) => {
    setEditTarget({
      id: prog.id,
      title: prog.title,
      titleNe: prog.titleNe,
      description: prog.description,
      descriptionNe: prog.descriptionNe,
      deadline: prog.deadline ? prog.deadline.slice(0, 10) : "",
      category: prog.category,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (data: ProgramFormData) => {
    if (!token) return;
    setIsSaving(true);
    try {
      if (data.id) {
        // ── Optimistic update ────────────────────────────────────
        setDbPrograms((prev) =>
          prev.map((p) =>
            p.id === data.id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          )
        );
        const { program } = await updateProgram(token, data.id, data);
        // Reconcile with server response
        setDbPrograms((prev) => prev.map((p) => (p.id === program.id ? program : p)));
        toast({
          title: isNepali ? "कार्यक्रम अद्यावधिक भयो" : "Program Updated",
          description: isNepali
            ? "कार्यक्रम सफलतापूर्वक अद्यावधिक गरियो।"
            : "The program has been updated successfully.",
        });
      } else {
        const { program } = await createProgram(token, data);
        setDbPrograms((prev) => [...prev, program]);
        toast({
          title: isNepali ? "कार्यक्रम थपियो" : "Program Added",
          description: isNepali
            ? "नयाँ कार्यक्रम सफलतापूर्वक थपियो।"
            : "The new program has been added successfully.",
        });
      }
      setModalOpen(false);
    } catch {
      toast({
        title: isNepali ? "त्रुटि" : "Error",
        description: isNepali
          ? "सेभ गर्न असफल भयो। पुनः प्रयास गर्नुहोस्।"
          : "Failed to save. Please try again.",
        variant: "destructive",
      });
      // Re-fetch to reconcile on error
      getPrograms()
        .then(({ programs: p }) => setDbPrograms(p))
        .catch(() => {});
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    // Optimistic removal
    const backup = dbPrograms;
    setDbPrograms((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProgram(token, id);
      toast({
        title: isNepali ? "कार्यक्रम हटाइयो" : "Program Deleted",
      });
    } catch {
      setDbPrograms(backup);
      toast({
        title: isNepali ? "त्रुटि" : "Error",
        description: isNepali ? "हटाउन असफल भयो।" : "Failed to delete.",
        variant: "destructive",
      });
    }
  };

  // ── Inline field save for static featured programs (local only) ──
  const [localPrograms, setLocalPrograms] = useState(programs);

  const handleInlineUpdate = (
    index: number,
    field: keyof ProgramItem,
    value: string,
    fieldNe?: keyof ProgramItem,
    valueNe?: string
  ) => {
    setLocalPrograms((prev) => {
      const next = [...prev];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (next[index] as any)[field] = value;
      if (fieldNe && valueNe !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (next[index] as any)[fieldNe] = valueNe;
      }
      return next;
    });
    toast({
      title: isNepali ? "अद्यावधिक भयो" : "Updated",
      description: isNepali
        ? "स्थानीय परिवर्तन सेभ भयो। (नोट: दुवै EN/NE अपडेट गर्नुहोस्)"
        : "Local change saved. (Note: update both EN/NE for bilingual sync)",
    });
  };

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerTarget, setRegisterTarget] = useState<Program | null>(null);
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", location: "" });

  const openRegister = (prog: Program) => {
    setRegisterTarget(prog);
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send registration data to backend
    setRegisterModalOpen(false);
    toast({ title: "Registered!", description: "You have registered for the program." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block bg-can-white/20 text-can-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {isNepali ? "हाम्रा पहलहरू" : "Our Initiatives"}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-can-white mb-6">
              {t("ourPrograms")}
            </h1>
            <p className="text-lg text-can-white/90 mb-8">
              {t("programsSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events">
                <Button size="lg" className="bg-can-white text-primary hover:bg-can-white/90">
                  {t("viewAllEvents")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/membership">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-can-white text-can-white hover:bg-can-white/10 bg-transparent"
                >
                  {t("membership")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Banner */}
      <section className="py-8 bg-[#7a0d0d]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`${achievement.bgColor} rounded-lg p-4 text-center text-can-white animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl font-heading font-bold">{achievement.number}</div>
                <div className="text-sm">{isNepali ? achievement.labelNe : achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs Carousel */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("featuredPrograms")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("programsSubtitle")}
            </p>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {localPrograms.map((program, index) => {
                const IconComponent = iconMap[program.icon];
                return (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                    <Card className="h-full card-hover overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={program.image}
                          alt={isNepali ? program.titleNe : program.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${program.color}/10 flex items-center justify-center`}>
                            <IconComponent className={`w-5 h-5 text-${program.color}`} />
                          </div>
                          <CardTitle className="text-lg">
                            <EditableField
                              value={isNepali ? program.titleNe : program.title}
                              valueNe={program.titleNe}
                              canEdit={isAdmin}
                              bilingual
                              onSave={(v, vNe) =>
                                handleInlineUpdate(
                                  index,
                                  isNepali ? "titleNe" : "title",
                                  v,
                                  isNepali ? "title" : "titleNe",
                                  vNe
                                )
                              }
                            />
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <EditableField
                          value={isNepali ? program.descriptionNe : program.description}
                          valueNe={program.descriptionNe}
                          canEdit={isAdmin}
                          variant="textarea"
                          bilingual
                          className="text-muted-foreground text-sm mb-4"
                          onSave={(v, vNe) =>
                            handleInlineUpdate(
                              index,
                              isNepali ? "descriptionNe" : "description",
                              v,
                              isNepali ? "description" : "descriptionNe",
                              vNe
                            )
                          }
                        />
                        <div className="space-y-2 mt-3">
                          {(isNepali ? program.featuresNe : program.features).slice(0, 3).map((feature, fIndex) => (
                            <div key={fIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className={`w-4 h-4 text-${program.color}`} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Managed Programs (DB-driven) */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="text-center sm:text-left">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                {t("upcomingPrograms")}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isNepali
                  ? "डाटाबेसबाट व्यवस्थापित कार्यक्रमहरू"
                  : "Database-managed programs with deadlines"}
              </p>
            </div>
            {isAdmin && (
              <Button onClick={openAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                {isNepali ? "कार्यक्रम थप्नुहोस्" : "Add Program"}
              </Button>
            )}
          </div>

          {isLoadingDb ? (
            <p className="text-center text-muted-foreground">
              {isNepali ? "लोड हुँदैछ…" : "Loading…"}
            </p>
          ) : dbPrograms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {isNepali
                  ? "अहिले कुनै कार्यक्रम छैन।"
                  : "No programs yet."}
              </p>
              {isAdmin && (
                <Button variant="outline" onClick={openAdd} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {isNepali ? "पहिलो कार्यक्रम थप्नुहोस्" : "Add the first program"}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {dbPrograms.map((prog) => (
                <Card
                  key={prog.id}
                  className="card-hover animate-fade-in-up relative group"
                >
                  {/* Admin action buttons */}
                  {isAdmin && (
                    <div className="absolute right-3 top-3 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => openEdit(prog)}
                        title={isNepali ? "सम्पादन" : "Edit"}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7"
                        onClick={() => handleDelete(prog.id)}
                        title={isNepali ? "हटाउनुहोस्" : "Delete"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {isNepali
                          ? CATEGORY_LABELS[prog.category]?.ne ?? prog.category
                          : CATEGORY_LABELS[prog.category]?.en ?? prog.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      {isNepali ? prog.titleNe || prog.title : prog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {isNepali
                        ? prog.descriptionNe || prog.description
                        : prog.description}
                    </p>

                    {prog.deadline && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-secondary" />
                        <span>
                          {isNepali ? "म्याद:" : "Deadline:"}{" "}
                          {new Date(prog.deadline).toLocaleDateString(
                            isNepali ? "ne-NP" : "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </span>
                      </div>
                    )}
                    <Button className="mt-2 w-full" onClick={() => openRegister(prog)}>
                      {isNepali ? "दर्ता गर्नुहोस्" : "Register"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Program Modal (Add / Edit) */}
      <ProgramModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editTarget}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />

      {/* Register Modal */}
      <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNepali ? "कार्यक्रम दर्ता" : "Program Registration"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{isNepali ? "नाम" : "Name"}</Label>
              <Input id="name" value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">{isNepali ? "इमेल" : "Email"}</Label>
              <Input id="email" type="email" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="location">{isNepali ? "स्थान" : "Location"}</Label>
              <Input id="location" value={registerForm.location} onChange={e => setRegisterForm({ ...registerForm, location: e.target.value })} required />
            </div>
            {/* Dynamic fields for admin can be added here */}
            <DialogFooter>
              <Button type="submit">{isNepali ? "पेश गर्नुहोस्" : "Submit"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-can-white mb-4">
            {isNepali ? "हामीसँग साझेदारी गर्न चाहनुहुन्छ?" : "Want to Partner With Us?"}
          </h2>
          <p className="text-can-white/90 max-w-2xl mx-auto mb-8">
            {isNepali 
              ? "हामी हाम्रो पहुँच र प्रभाव विस्तार गर्न संगठनहरू, शैक्षिक संस्थाहरू, र सरकारी निकायहरूसँग सहकार्य गर्छौं।"
              : "We collaborate with organizations, educational institutions, and government bodies to expand our reach and impact."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-can-white text-primary hover:bg-can-white/90">
                {t("contactUs")}
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-can-white text-can-white hover:bg-can-white/10 bg-transparent">
                {t("learnMore")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
