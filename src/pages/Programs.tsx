import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Laptop,
  Users,
  Building2,
  Globe,
  Heart,
  BookOpen,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
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
import EditButton from "@/components/EditButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchEntry, useRegisterSearchSource } from "@/contexts/SearchContext";

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
  description: string;
  icon: ProgramIconKey;
  color: "primary" | "secondary" | "accent";
  features: string[];
  image: string;
};

type AchievementItem = {
  number: string;
  label: string;
  bgColor: string;
};

type UpcomingProgram = {
  title: string;
  date: string;
  location: string;
  spots: string;
  ctaLabel: string;
  ctaHref: string;
};

type HeroContent = {
  badge: string;
  title: string;
  description: string;
  backgroundImage: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

type CtaContent = {
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

const iconOptions: { value: ProgramIconKey; label: string }[] = [
  { value: "laptop", label: "Laptop" },
  { value: "graduationCap", label: "Graduation Cap" },
  { value: "globe", label: "Globe" },
  { value: "users", label: "Users" },
  { value: "building2", label: "Building" },
  { value: "heart", label: "Heart" },
];

const achievementColorOptions = [
  { value: "bg-green-500", label: "Green" },
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-primary", label: "Primary" },
  { value: "bg-secondary", label: "Secondary" },
  { value: "bg-accent", label: "Accent" },
];

const Programs = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    badge: "Our Initiatives",
    title: "Programs & Initiatives",
    description:
      "Driving digital transformation across Kavrepalanchok through comprehensive ICT programs that empower communities and bridge the technology gap.",
    backgroundImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80",
    primaryCta: { label: "View Events", href: "/events" },
    secondaryCta: { label: "Get Involved", href: "/membership" },
  });

  const [achievements, setAchievements] = useState<AchievementItem[]>([
    { number: "50+", label: "IT Clubs Established", bgColor: "bg-green-500" },
    { number: "5000+", label: "Citizens Trained", bgColor: "bg-green-500" },
    { number: "100+", label: "Programs Conducted", bgColor: "bg-blue-500" },
    { number: "15+", label: "Schools Covered", bgColor: "bg-blue-500" },
  ]);

  const [programs, setPrograms] = useState<ProgramItem[]>([
    {
      title: "Digital Literacy Campaign",
      description:
        "Empowering citizens of all ages with basic computer and internet skills. Our comprehensive training covers essential digital skills needed in today's world.",
      icon: "laptop",
      color: "primary",
      features: [
        "Basic Computer Training",
        "Internet Safety",
        "Email & Social Media",
        "Online Banking Basics",
      ],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
    },
    {
      title: "IT Club Development",
      description:
        "Establishing and supporting IT clubs in schools across Kavrepalanchok to nurture the next generation of tech leaders.",
      icon: "graduationCap",
      color: "secondary",
      features: [
        "School IT Club Setup",
        "Student Mentorship",
        "Coding Workshops",
        "Inter-school Competitions",
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    },
    {
      title: "ICT in Agriculture",
      description:
        "Introducing modern farming techniques through technology. Helping farmers adopt digital tools for better productivity and market access.",
      icon: "globe",
      color: "accent",
      features: [
        "Digital Farming Tools",
        "Market Connectivity",
        "Weather Information",
        "E-Commerce Training",
      ],
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80",
    },
    {
      title: "Women in Tech",
      description:
        "Special programs designed to increase female participation in the ICT sector, providing skills training and career guidance.",
      icon: "users",
      color: "primary",
      features: [
        "Skills Training",
        "Career Guidance",
        "Networking Events",
        "Entrepreneurship Support",
      ],
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80",
    },
    {
      title: "E-Governance Support",
      description:
        "Assisting local government bodies in implementing digital solutions for better public service delivery.",
      icon: "building2",
      color: "secondary",
      features: [
        "Digital Documentation",
        "Online Services",
        "Staff Training",
        "Infrastructure Support",
      ],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    },
    {
      title: "Health & ICT",
      description:
        "Promoting digital health solutions and telemedicine awareness in remote areas of the district.",
      icon: "heart",
      color: "accent",
      features: [
        "Telemedicine Awareness",
        "Health App Training",
        "Digital Health Records",
        "Emergency Response Systems",
      ],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80",
    },
  ]);

  const [upcomingPrograms, setUpcomingPrograms] = useState<UpcomingProgram[]>([
    {
      title: "Web Development Bootcamp",
      date: "2080/04/15 - 2080/04/30",
      location: "Dhulikhel",
      spots: "30 seats available",
      ctaLabel: "Register",
      ctaHref: "/auth",
    },
    {
      title: "Cybersecurity Awareness Workshop",
      date: "2080/05/10",
      location: "Banepa",
      spots: "50 seats available",
      ctaLabel: "Register",
      ctaHref: "/auth",
    },
    {
      title: "Mobile App Development Training",
      date: "2080/05/20 - 2080/06/05",
      location: "Kavre",
      spots: "25 seats available",
      ctaLabel: "Register",
      ctaHref: "/auth",
    },
  ]);

  const [heroDialogOpen, setHeroDialogOpen] = useState(false);
  const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);
  const [ctaDialogOpen, setCtaDialogOpen] = useState(false);

  const [heroDraft, setHeroDraft] = useState<HeroContent>(heroContent);
  const [achievementsDraft, setAchievementsDraft] = useState<AchievementItem[]>(achievements);
  const [programsDraft, setProgramsDraft] = useState<ProgramItem[]>(programs);
  const [upcomingDraft, setUpcomingDraft] = useState<UpcomingProgram[]>(upcomingPrograms);
  const [ctaContent, setCtaContent] = useState<CtaContent>({
    title: "Want to Partner With Us?",
    description:
      "We collaborate with organizations, educational institutions, and government bodies to expand our reach and impact.",
    primaryCta: { label: "Contact Us", href: "/auth" },
    secondaryCta: { label: "Learn About Us", href: "/about" },
  });
  const [ctaDraft, setCtaDraft] = useState<CtaContent>(ctaContent);

  useRegisterSearchSource(
    "programs",
    () => {
      const entries: SearchEntry[] = [];

      entries.push({
        id: "programs-hero",
        route: "/programs",
        title: heroContent.title,
        description: heroContent.description,
        content: [
          heroContent.badge,
          heroContent.primaryCta?.label,
          heroContent.secondaryCta?.label,
        ]
          .filter(Boolean)
          .join(" "),
        tags: ["Programs", "Hero"],
      });

      achievements.forEach((achievement, index) => {
        entries.push({
          id: `programs-achievement-${index}`,
          route: "/programs",
          title: `Achievement: ${achievement.label}`,
          description: achievement.number,
          content: `${achievement.label} ${achievement.number}`,
          tags: ["Programs", "Achievements"],
        });
      });

      programs.forEach((program, index) => {
        entries.push({
          id: `programs-program-${index}`,
          route: "/programs",
          title: program.title,
          description: program.description,
          content: [program.description, program.features?.join(" ") ?? ""].join(" "),
          tags: ["Programs", "Initiatives", program.icon],
        });
      });

      upcomingPrograms.forEach((upcoming, index) => {
        entries.push({
          id: `programs-upcoming-${index}`,
          route: "/programs",
          title: `Upcoming: ${upcoming.title}`,
          description: `${upcoming.date} • ${upcoming.location}`,
          content: `${upcoming.title} ${upcoming.date} ${upcoming.location} ${upcoming.spots} ${upcoming.ctaLabel} ${upcoming.ctaHref}`,
          tags: ["Programs", "Schedule"],
        });
      });

      entries.push({
        id: "programs-cta",
        route: "/programs",
        title: ctaContent.title,
        description: ctaContent.description,
        content: [
          ctaContent.description,
          ctaContent.primaryCta?.label,
          ctaContent.secondaryCta?.label,
        ]
          .filter(Boolean)
          .join(" "),
        tags: ["Programs", "Call to Action"],
      });

      return entries;
    },
    [heroContent, achievements, programs, upcomingPrograms, ctaContent]
  );

  const openHeroDialog = () => {
    setHeroDraft({
      ...heroContent,
      primaryCta: { ...heroContent.primaryCta },
      secondaryCta: { ...heroContent.secondaryCta },
    });
    setHeroDialogOpen(true);
  };

  const openAchievementsDialog = () => {
    setAchievementsDraft(achievements.map((item) => ({ ...item })));
    setAchievementsDialogOpen(true);
  };

  const openProgramsDialog = () => {
    setProgramsDraft(
      programs.map((program) => ({
        ...program,
        features: [...program.features],
      }))
    );
    setProgramDialogOpen(true);
  };

  const openUpcomingDialog = () => {
    setUpcomingDraft(upcomingPrograms.map((item) => ({ ...item })));
    setUpcomingDialogOpen(true);
  };

  const openCtaDialog = () => {
    setCtaDraft({
      ...ctaContent,
      primaryCta: { ...ctaContent.primaryCta },
      secondaryCta: { ...ctaContent.secondaryCta },
    });
    setCtaDialogOpen(true);
  };

  const addAchievement = () => {
    setAchievementsDraft((prev) => [
      ...prev,
      { number: "", label: "", bgColor: "bg-primary" },
    ]);
  };

  const removeAchievement = (index: number) => {
    setAchievementsDraft((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addProgram = () => {
    setProgramsDraft((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        icon: "laptop",
        color: "primary",
        features: [""],
        image: "",
      },
    ]);
  };

  const removeProgram = (index: number) => {
    setProgramsDraft((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addProgramFeature = (programIndex: number) => {
    setProgramsDraft((prev) =>
      prev.map((program, idx) =>
        idx === programIndex
          ? { ...program, features: [...program.features, ""] }
          : program
      )
    );
  };

  const removeProgramFeature = (programIndex: number, featureIndex: number) => {
    setProgramsDraft((prev) =>
      prev.map((program, idx) =>
        idx === programIndex
          ? {
              ...program,
              features: program.features.filter((_, fIdx) => fIdx !== featureIndex),
            }
          : program
      )
    );
  };

  const addUpcomingProgram = () => {
    setUpcomingDraft((prev) => [
      ...prev,
      {
        title: "",
        date: "",
        location: "",
        spots: "",
        ctaLabel: "Register",
        ctaHref: "/auth",
      },
    ]);
  };

  const removeUpcomingProgram = (index: number) => {
    setUpcomingDraft((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
      <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${heroContent.backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Programs Hero" onClick={openHeroDialog} />
          </div>
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block bg-can-white/20 text-can-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {heroContent.badge}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-can-white mb-6">
              {heroContent.title}
            </h1>
            <p className="text-lg text-can-white/90 mb-8">
              {heroContent.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {heroContent.primaryCta.label && (
                <Link to={heroContent.primaryCta.href || "#"}>
                  <Button size="lg" className="bg-can-white text-primary hover:bg-can-white/90">
                    {heroContent.primaryCta.label}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              {heroContent.secondaryCta.label && (
                <Link to={heroContent.secondaryCta.href || "#"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-can-white text-can-white hover:bg-can-white/10 bg-transparent"
                  >
                    {heroContent.secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Banner */}
      <section className="py-8 bg-[#7a0d0d]">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex justify-end">
            <EditButton label="Edit Achievements" onClick={openAchievementsDialog} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((item, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${item.bgColor}`}
                >
                  <div className="font-heading text-2xl md:text-3xl font-bold text-white">
                    {item.number}
                  </div>
                </div>
                <div className="text-white/90 text-sm mt-3">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs Carousel */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Featured Programs" onClick={openProgramsDialog} />
          </div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Our Key Programs
              </h2>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4">
              {programs.map((program, index) => {
                const Icon = iconMap[program.icon] ?? Laptop;
                return (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full overflow-hidden group">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={program.image} 
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div
                        className={`w-12 h-12 rounded-xl bg-${program.color}/10 flex items-center justify-center mb-3`}
                      >
                        <Icon className={`w-6 h-6 text-${program.color}`} />
                      </div>
                      <CardTitle className="font-heading text-xl">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {program.description}
                      </p>
                      <div className="space-y-2">
                        {program.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className={`w-4 h-4 text-${program.color}`} />
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-0 -translate-x-1/2" />
            <CarouselNext className="right-0 translate-x-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Upcoming Programs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Upcoming Programs" onClick={openUpcomingDialog} />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-semibold mb-2">
                Upcoming
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                Upcoming Programs
              </h2>
              <div className="space-y-4">
                {upcomingPrograms.map((program, idx) => (
                  <Card key={idx} className="group hover:shadow-elevated transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {program.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {program.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {program.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-accent font-medium">{program.spots}</span>
                          {(() => {
                            const trimmedHref = program.ctaHref?.trim();
                            const buttonLabel = program.ctaLabel || "Register";
                            const buttonClassName =
                              "border-primary text-primary hover:bg-primary hover:text-primary-foreground";
                            if (!trimmedHref) {
                              return (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={buttonClassName}
                                  disabled
                                >
                                  {buttonLabel}
                                </Button>
                              );
                            }

                            const externalPattern = /^(https?:\/\/|mailto:|tel:)/i;
                            if (externalPattern.test(trimmedHref)) {
                              const isHttpLink = /^https?:\/\//i.test(trimmedHref);
                              return (
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className={buttonClassName}
                                >
                                  <a
                                    href={trimmedHref}
                                    target={isHttpLink ? "_blank" : undefined}
                                    rel={isHttpLink ? "noopener noreferrer" : undefined}
                                  >
                                    {buttonLabel}
                                  </a>
                                </Button>
                              );
                            }

                            return (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className={buttonClassName}
                              >
                                <Link to={trimmedHref}>{buttonLabel}</Link>
                              </Button>
                            );
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="bg-gradient-to-br from-primary via-secondary to-accent text-can-white overflow-hidden">
                <CardContent className="p-6">
                  <Lightbulb className="w-12 h-12 mb-4 text-can-white/80" />
                  <h3 className="font-heading font-bold text-xl mb-3">Have a Program Idea?</h3>
                  <p className="text-can-white/80 text-sm mb-4">
                    We're always looking for innovative ideas to serve our community better. 
                    Share your suggestions with us!
                  </p>
                  <Link to="/membership">
                    <Button className="w-full bg-can-white text-primary hover:bg-can-white/90">
                      Contact Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <BookOpen className="w-10 h-10 text-accent mb-4" />
                  <h3 className="font-heading font-bold text-lg mb-2">Resources</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Access training materials, guides, and resources from our programs.
                  </p>
                  <Link to="/downloads">
                    <Button variant="outline" className="w-full">
                      View Downloads
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* All Programs Grid */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Programs Grid" onClick={openProgramsDialog} />
          </div>
          <div className="text-center mb-12">
            <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold mb-2">
              Complete List
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              All Our Programs
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => {
              const Icon = iconMap[program.icon] ?? Laptop;
              return (
                <Card key={index} className="group cursor-pointer card-hover bg-card">
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-xl bg-${program.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-7 h-7 text-${program.color}`} />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{program.description}</p>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className={`w-4 h-4 text-${program.color} shrink-0`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Programs CTA" onClick={openCtaDialog} />
          </div>
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-can-white mb-4">
              {ctaContent.title}
            </h2>
            <p className="text-can-white/80 max-w-xl mx-auto mb-6">{ctaContent.description}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {ctaContent.primaryCta.label && (
                <Link to={ctaContent.primaryCta.href || "#"}>
                  <Button size="lg" className="bg-can-white text-primary hover:bg-can-white/90">
                    {ctaContent.primaryCta.label}
                  </Button>
                </Link>
              )}
              {ctaContent.secondaryCta.label && (
                <Link to={ctaContent.secondaryCta.href || "#"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-can-white text-can-white hover:bg-can-white/10 bg-transparent"
                  >
                    {ctaContent.secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      </div>

      <Dialog open={heroDialogOpen} onOpenChange={(open) => !open && setHeroDialogOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Programs Hero</DialogTitle>
            <DialogDescription>Update the hero banner content and calls to action.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hero-badge">Badge Text</Label>
              <Input
                id="hero-badge"
                value={heroDraft.badge}
                onChange={(event) =>
                  setHeroDraft((prev) => ({ ...prev, badge: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={heroDraft.title}
                onChange={(event) =>
                  setHeroDraft((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                rows={4}
                value={heroDraft.description}
                onChange={(event) =>
                  setHeroDraft((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-background">Background Image URL</Label>
              <Input
                id="hero-background"
                value={heroDraft.backgroundImage}
                onChange={(event) =>
                  setHeroDraft((prev) => ({ ...prev, backgroundImage: event.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Primary Button</Label>
                <Input
                  value={heroDraft.primaryCta.label}
                  onChange={(event) =>
                    setHeroDraft((prev) => ({
                      ...prev,
                      primaryCta: { ...prev.primaryCta, label: event.target.value },
                    }))
                  }
                  placeholder="Label"
                />
                <Input
                  value={heroDraft.primaryCta.href}
                  onChange={(event) =>
                    setHeroDraft((prev) => ({
                      ...prev,
                      primaryCta: { ...prev.primaryCta, href: event.target.value },
                    }))
                  }
                  placeholder="/events"
                />
              </div>
              <div className="space-y-3">
                <Label>Secondary Button</Label>
                <Input
                  value={heroDraft.secondaryCta.label}
                  onChange={(event) =>
                    setHeroDraft((prev) => ({
                      ...prev,
                      secondaryCta: { ...prev.secondaryCta, label: event.target.value },
                    }))
                  }
                  placeholder="Label"
                />
                <Input
                  value={heroDraft.secondaryCta.href}
                  onChange={(event) =>
                    setHeroDraft((prev) => ({
                      ...prev,
                      secondaryCta: { ...prev.secondaryCta, href: event.target.value },
                    }))
                  }
                  placeholder="/membership"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHeroDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setHeroContent({
                  ...heroDraft,
                  primaryCta: { ...heroDraft.primaryCta },
                  secondaryCta: { ...heroDraft.secondaryCta },
                });
                setHeroDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={achievementsDialogOpen}
        onOpenChange={(open) => !open && setAchievementsDialogOpen(false)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Achievements</DialogTitle>
            <DialogDescription>Adjust the milestone counters displayed on the banner.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            {achievementsDraft.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-border p-4">
                <div className="grid gap-2">
                  <Label htmlFor={`achievement-number-${index}`}>Statistic</Label>
                  <Input
                    id={`achievement-number-${index}`}
                    value={item.number}
                    onChange={(event) =>
                      setAchievementsDraft((prev) =>
                        prev.map((achievement, idx) =>
                          idx === index
                            ? { ...achievement, number: event.target.value }
                            : achievement
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`achievement-label-${index}`}>Label</Label>
                  <Input
                    id={`achievement-label-${index}`}
                    value={item.label}
                    onChange={(event) =>
                      setAchievementsDraft((prev) =>
                        prev.map((achievement, idx) =>
                          idx === index
                            ? { ...achievement, label: event.target.value }
                            : achievement
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`achievement-color-${index}`}>Badge Color</Label>
                  <Select
                    value={item.bgColor}
                    onValueChange={(value) =>
                      setAchievementsDraft((prev) =>
                        prev.map((achievement, idx) =>
                          idx === index ? { ...achievement, bgColor: value } : achievement
                        )
                      )
                    }
                  >
                    <SelectTrigger id={`achievement-color-${index}`}>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {achievementColorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    disabled={achievementsDraft.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addAchievement}>
              Add Achievement
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAchievementsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAchievements(achievementsDraft.map((item) => ({ ...item })));
                setAchievementsDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={programDialogOpen} onOpenChange={(open) => !open && setProgramDialogOpen(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Programs</DialogTitle>
            <DialogDescription>
              Manage the list of programs shown in the carousel and the full program grid.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-1">
            {programsDraft.map((program, index) => (
              <div key={index} className="space-y-4 rounded-lg border border-border p-4">
                <div className="grid gap-2">
                  <Label htmlFor={`program-title-${index}`}>Program Title</Label>
                  <Input
                    id={`program-title-${index}`}
                    value={program.title}
                    onChange={(event) =>
                      setProgramsDraft((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, title: event.target.value } : item
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`program-description-${index}`}>Description</Label>
                  <Textarea
                    id={`program-description-${index}`}
                    rows={3}
                    value={program.description}
                    onChange={(event) =>
                      setProgramsDraft((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, description: event.target.value } : item
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`program-icon-${index}`}>Icon</Label>
                    <Select
                      value={program.icon}
                      onValueChange={(value: ProgramIconKey) =>
                        setProgramsDraft((prev) =>
                          prev.map((item, idx) =>
                            idx === index ? { ...item, icon: value } : item
                          )
                        )
                      }
                    >
                      <SelectTrigger id={`program-icon-${index}`}>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`program-color-${index}`}>Accent Color</Label>
                    <Select
                      value={program.color}
                      onValueChange={(value: ProgramItem["color"]) =>
                        setProgramsDraft((prev) =>
                          prev.map((item, idx) =>
                            idx === index ? { ...item, color: value } : item
                          )
                        )
                      }
                    >
                      <SelectTrigger id={`program-color-${index}`}>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="accent">Accent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`program-image-${index}`}>Image URL</Label>
                  <Input
                    id={`program-image-${index}`}
                    value={program.image}
                    onChange={(event) =>
                      setProgramsDraft((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, image: event.target.value } : item
                        )
                      )
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-3">
                  <Label>Key Features</Label>
                  <div className="space-y-2">
                    {program.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(event) =>
                            setProgramsDraft((prev) =>
                              prev.map((item, idx) =>
                                idx === index
                                  ? {
                                      ...item,
                                      features: item.features.map((featureItem, fIdx) =>
                                        fIdx === featureIndex ? event.target.value : featureItem
                                      ),
                                    }
                                  : item
                              )
                            )
                          }
                          placeholder="Add program highlight"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProgramFeature(index, featureIndex)}
                          disabled={program.features.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addProgramFeature(index)}>
                      Add Feature
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProgram(index)}
                    disabled={programsDraft.length === 1}
                  >
                    Remove Program
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addProgram}>
              Add Program
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgramDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPrograms(
                  programsDraft.map((program) => ({
                    ...program,
                    features: [...program.features],
                  }))
                );
                setProgramDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={upcomingDialogOpen} onOpenChange={(open) => !open && setUpcomingDialogOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Upcoming Programs</DialogTitle>
            <DialogDescription>
              Update schedule details for upcoming programs featured on this page.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            {upcomingDraft.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-border p-4">
                <div className="grid gap-2">
                  <Label htmlFor={`upcoming-title-${index}`}>Title</Label>
                  <Input
                    id={`upcoming-title-${index}`}
                    value={item.title}
                    onChange={(event) =>
                      setUpcomingDraft((prev) =>
                        prev.map((program, idx) =>
                          idx === index ? { ...program, title: event.target.value } : program
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`upcoming-date-${index}`}>Date</Label>
                  <Input
                    id={`upcoming-date-${index}`}
                    value={item.date}
                    onChange={(event) =>
                      setUpcomingDraft((prev) =>
                        prev.map((program, idx) =>
                          idx === index ? { ...program, date: event.target.value } : program
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`upcoming-location-${index}`}>Location</Label>
                  <Input
                    id={`upcoming-location-${index}`}
                    value={item.location}
                    onChange={(event) =>
                      setUpcomingDraft((prev) =>
                        prev.map((program, idx) =>
                          idx === index ? { ...program, location: event.target.value } : program
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`upcoming-spots-${index}`}>Availability</Label>
                  <Input
                    id={`upcoming-spots-${index}`}
                    value={item.spots}
                    onChange={(event) =>
                      setUpcomingDraft((prev) =>
                        prev.map((program, idx) =>
                          idx === index ? { ...program, spots: event.target.value } : program
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`upcoming-cta-${index}`}>Button Label</Label>
                  <Input
                    id={`upcoming-cta-${index}`}
                    value={item.ctaLabel}
                    onChange={(event) =>
                      setUpcomingDraft((prev) =>
                        prev.map((program, idx) =>
                          idx === index ? { ...program, ctaLabel: event.target.value } : program
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`upcoming-cta-href-${index}`}>Button Link</Label>
                  <Input
                    id={`upcoming-cta-href-${index}`}
                    value={item.ctaHref}
                    onChange={(event) =>
                      setUpcomingDraft((prev) =>
                        prev.map((program, idx) =>
                          idx === index
                            ? { ...program, ctaHref: event.target.value }
                            : program
                        )
                      )
                    }
                    placeholder="/auth or https://example.com/form"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUpcomingProgram(index)}
                    disabled={upcomingDraft.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addUpcomingProgram}>
              Add Upcoming Program
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpcomingDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setUpcomingPrograms(
                  upcomingDraft.map((item) => ({
                    ...item,
                    ctaHref: item.ctaHref?.trim() ?? "",
                  }))
                );
                setUpcomingDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ctaDialogOpen} onOpenChange={(open) => !open && setCtaDialogOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Programs CTA</DialogTitle>
            <DialogDescription>Customize the closing call-to-action for the Programs page.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cta-title">Title</Label>
              <Input
                id="cta-title"
                value={ctaDraft.title}
                onChange={(event) =>
                  setCtaDraft((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cta-description">Description</Label>
              <Textarea
                id="cta-description"
                rows={4}
                value={ctaDraft.description}
                onChange={(event) =>
                  setCtaDraft((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Primary Button</Label>
                <Input
                  value={ctaDraft.primaryCta.label}
                  onChange={(event) =>
                    setCtaDraft((prev) => ({
                      ...prev,
                      primaryCta: { ...prev.primaryCta, label: event.target.value },
                    }))
                  }
                  placeholder="Contact Us"
                />
                <Input
                  value={ctaDraft.primaryCta.href}
                  onChange={(event) =>
                    setCtaDraft((prev) => ({
                      ...prev,
                      primaryCta: { ...prev.primaryCta, href: event.target.value },
                    }))
                  }
                  placeholder="/auth"
                />
              </div>
              <div className="space-y-3">
                <Label>Secondary Button</Label>
                <Input
                  value={ctaDraft.secondaryCta.label}
                  onChange={(event) =>
                    setCtaDraft((prev) => ({
                      ...prev,
                      secondaryCta: { ...prev.secondaryCta, label: event.target.value },
                    }))
                  }
                  placeholder="Learn About Us"
                />
                <Input
                  value={ctaDraft.secondaryCta.href}
                  onChange={(event) =>
                    setCtaDraft((prev) => ({
                      ...prev,
                      secondaryCta: { ...prev.secondaryCta, href: event.target.value },
                    }))
                  }
                  placeholder="/about"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCtaDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setCtaContent({
                  ...ctaDraft,
                  primaryCta: { ...ctaDraft.primaryCta },
                  secondaryCta: { ...ctaDraft.secondaryCta },
                });
                setCtaDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Programs;