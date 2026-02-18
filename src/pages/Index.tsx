import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Download,
  Image,
  Target,
  Eye,
  ListChecks,
  ChevronRight,
  Users,
  Calendar,
  FileText,
  ArrowRight,
  Newspaper,
  Bell,
  Clock,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const { t, isNepali } = useLanguage();

  const headlines = isNepali ? [
    { title: "भविष्यको विकासको लागि क्यान अगुवाई", date: "२०८०/०३/१५" },
    { title: "आईसीटी २०८० मा क्यारियर अवसरहरू", date: "२०८०/०२/२८" },
    { title: "आईसीटी दिवस (मे २, २०२३) - रक्तदान कार्यक्रम", date: "२०८०/०१/१९" },
    { title: "क्यान बागमती प्रदेश कार्यक्रम सहभागिता", date: "२०८०/०१/१०" },
    { title: "क्यालेन्डर विमोचन र नयाँ वर्ष समारोह", date: "२०७९/१०/०१" },
  ] : [
    { title: "Leading CAN for Future Growth", date: "2080/03/15" },
    { title: "Career Opportunities in ICT 2080", date: "2080/02/28" },
    { title: "ICT DAY (MAY 2, 2023) - Blood Donation Program", date: "2080/01/19" },
    { title: "CAN Bagmati Province Program Participation", date: "2080/01/10" },
    { title: "Calendar Launch & New Year Celebration", date: "2079/10/01" },
  ];

  const heroSlides = isNepali ? [
    {
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
      title: "१०औं कार्यसमिति",
      subtitle: "क्यान काभ्रेलाई डिजिटल भविष्यतर्फ अग्रसर गर्दै",
    },
    {
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1920&q=80",
      title: "आईसीटी तालिम कार्यक्रमहरू",
      subtitle: "युवालाई डिजिटल सीपले सशक्त बनाउँदै",
    },
    {
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80",
      title: "सामुदायिक विकास",
      subtitle: "काभ्रेमा डिजिटल खाडल पूर्ति गर्दै",
    },
  ] : [
    {
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
      title: "10th Executive Committee",
      subtitle: "Leading CAN Kavre into the Digital Future",
    },
    {
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1920&q=80",
      title: "ICT Training Programs",
      subtitle: "Empowering Youth with Digital Skills",
    },
    {
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80",
      title: "Community Development",
      subtitle: "Bridging the Digital Divide in Kavre",
    },
  ];

  const latestNews = isNepali ? [
    {
      title: "व्यावसायी सँग आईसीटी बिजनेस मिट कार्यक्रम सम्पन्न",
      date: "२०८०/०३/१५",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80",
    },
    {
      title: "कृषिमा आईसीटी जागरूकता कार्यक्रम",
      date: "२०८०/०२/२०",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
    },
    {
      title: "शिक्षकहरूको लागि डिजिटल साक्षरता कार्यशाला",
      date: "२०८०/०१/२५",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
    },
  ] : [
    {
      title: "ICT Business Meet Program Completed with Entrepreneurs",
      date: "2080/03/15",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80",
    },
    {
      title: "ICT in Agriculture Awareness Program",
      date: "2080/02/20",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
    },
    {
      title: "Digital Literacy Workshop for Teachers",
      date: "2080/01/25",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
    },
  ];

  const upcomingEvents = isNepali ? [
    { title: "आईसीटी क्यारियर परामर्श", date: "२०८०/०४/१५", location: "धुलिखेल" },
    { title: "वेब डेभलपमेन्ट तालिम", date: "२०८०/०४/२०", location: "बनेपा" },
    { title: "वार्षिक साधारण सभा", date: "२०८०/०५/०१", location: "काभ्रे" },
  ] : [
    { title: "ICT Career Counseling", date: "2080/04/15", location: "Dhulikhel" },
    { title: "Web Development Training", date: "2080/04/20", location: "Banepa" },
    { title: "Annual General Meeting", date: "2080/05/01", location: "Kavre" },
  ];

  const stats = [
    { label: t("yearsActive"), value: "१८+", valueEn: "18+" },
    { label: t("itClubs"), value: "१३+", valueEn: "13+" },
    { label: t("members"), value: "१५२+", valueEn: "152+" },
    { label: t("eventsCount"), value: "२००+", valueEn: "200+" },
  ];

  const quickLinks = [
    { title: t("downloads"), path: "/downloads", icon: Download },
    { title: t("noticeBoard"), path: "/notice", icon: Bell },
    { title: t("photoGallery"), path: "/events#gallery", icon: Image },
    { title: t("membership"), path: "/membership", icon: Users },
  ];

  const objectives = isNepali ? [
    "सबै उमेर समूहमा आईसीटी शिक्षा र डिजिटल साक्षरता प्रवर्द्धन गर्ने",
    "जिल्लामा आईटी उद्यमी र स्टार्टअपहरूलाई समर्थन गर्ने",
    "शैक्षिक संस्थाहरूमा आईटी क्लबहरू स्थापना र समन्वय गर्ने",
    "कार्यशाला, सेमिनार र तालिम कार्यक्रमहरू आयोजना गर्ने",
    "डिजिटल पहलहरूको लागि सरकार र निजी क्षेत्रसँग सहकार्य गर्ने"
  ] : [
    "Promote ICT education and digital literacy across all age groups",
    "Support IT entrepreneurs and startups in the district",
    "Establish and coordinate IT clubs in educational institutions",
    "Organize workshops, seminars, and training programs",
    "Collaborate with government and private sector for digital initiatives"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  return (
    <div className="overflow-hidden">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-1" />

      {/* Headline Ticker */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-2">
            <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-r-full font-semibold text-sm shrink-0">
              <Bell className="w-4 h-4" />
              {t("headline")}
            </div>
            <div className="overflow-hidden flex-1">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentHeadline * 100}%)` }}
              >
                {headlines.map((headline, idx) => (
                  <Link
                    key={idx}
                    to="/press-releases"
                    className="min-w-full flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  >
                    <span className="font-medium truncate">{headline.title}</span>
                    <span className="text-muted-foreground text-sm shrink-0">({headline.date})</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              {headlines.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeadline(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === currentHeadline ? 'bg-primary' : 'bg-border'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <section className="relative">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[500px] md:h-[600px] overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
                  <div className="absolute inset-0 flex items-end">
                    <div className="container mx-auto px-4 pb-16 md:pb-24">
                      <div className="max-w-2xl animate-fade-in-up">
                        <div className="inline-block bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold mb-4">
                          {t("canKavre")}
                        </div>
                        <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-can-white mb-4 drop-shadow-lg">
                          {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-can-white/90 mb-6 drop-shadow">
                          {slide.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Link to="/downloads">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-red">
                              <Download className="w-5 h-5 mr-2" />
                              {t("downloads")}
                            </Button>
                          </Link>
                          <a href="https://www.youtube.com/@cankavre" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" variant="outline" className="bg-can-white/10 border-can-white text-can-white hover:bg-can-white hover:text-foreground backdrop-blur-sm">
                              <Play className="w-5 h-5 mr-2" />
                              {t("watchVideo")}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-can-white/80 hover:bg-can-white border-0" />
          <CarouselNext className="right-4 bg-can-white/80 hover:bg-can-white border-0" />
        </Carousel>
      </section>

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-primary via-secondary to-accent py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-can-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-can-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg">{t("computerAssociationNepal")}</p>
                <p className="text-can-white/80 text-sm">{t("kavreBranch")} - {t("established")}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link to="/membership">
                <Button variant="outline" className="border-can-white text-can-white hover:bg-can-white hover:text-primary bg-transparent">
                  {t("joinCanKavre")}
                </Button>
              </Link>
              <Link to="/about">
                <Button className="bg-can-white text-primary hover:bg-can-white/90">
                  {t("learnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Latest News */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-primary" />
                  {t("latestNews")}
                </h2>
                <Link to="/press-releases" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                  {t("viewAll")} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {latestNews.map((news, idx) => (
                  <Link
                    key={idx}
                    to="/press-releases"
                    className="group bg-card rounded-lg overflow-hidden shadow-card card-hover"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <Clock className="w-3 h-3" /> {news.date}
                      </span>
                      <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-card rounded-lg shadow-card overflow-hidden">
                <div className="bg-secondary text-secondary-foreground px-4 py-3 font-heading font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("upcomingEvents")}
                </div>
                <div className="divide-y divide-border">
                  {upcomingEvents.map((event, idx) => (
                    <Link
                      key={idx}
                      to="/events"
                      className="block p-4 hover:bg-muted transition-colors"
                    >
                      <h4 className="font-semibold text-foreground mb-1">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-4 bg-muted/50">
                  <Link to="/events">
                    <Button variant="outline" size="sm" className="w-full">
                      {t("viewAllEvents")}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-card rounded-lg shadow-card overflow-hidden">
                <div className="bg-accent text-accent-foreground px-4 py-3 font-heading font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t("quickLinks")}
                </div>
                <div className="p-2">
                  {quickLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.path}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="w-8 h-8 rounded bg-muted group-hover:bg-primary/10 flex items-center justify-center">
                        <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {link.title}
                      </span>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-[#7a0d0d]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const circleColor = index % 2 === 0 ? 'bg-blue-500' : 'bg-green-500';
              return (
                <div key={stat.label} className="text-center">
                  <div className={`w-20 h-20 ${circleColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl md:text-3xl font-heading font-bold text-white">
                      {isNepali ? stat.value : stat.valueEn}
                    </span>
                  </div>
                  <p className="text-white font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Objectives */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-3">
              {t("ourFoundation")}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {t("missionVisionObjectives")}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="mission" className="border-2 border-primary/20 rounded-xl overflow-hidden bg-card">
                <AccordionTrigger className="hover:no-underline px-6 py-5 bg-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Target className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <span className="font-heading text-xl font-bold text-foreground">{t("ourMission")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-4 text-muted-foreground leading-relaxed text-base">
                  {t("missionText")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="vision" className="border-2 border-secondary/20 rounded-xl overflow-hidden bg-card">
                <AccordionTrigger className="hover:no-underline px-6 py-5 bg-secondary/5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Eye className="w-7 h-7 text-secondary-foreground" />
                    </div>
                    <span className="font-heading text-xl font-bold text-foreground">{t("ourVision")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-4 text-muted-foreground leading-relaxed text-base">
                  {t("visionText")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="objectives" className="border-2 border-accent/20 rounded-xl overflow-hidden bg-card">
                <AccordionTrigger className="hover:no-underline px-6 py-5 bg-accent/5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <ListChecks className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <span className="font-heading text-xl font-bold text-foreground">{t("ourObjectives")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-4 text-muted-foreground leading-relaxed">
                  <ul className="space-y-3">
                    {objectives.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-can-white mb-4">
              {isNepali ? "क्यान काभ्रेमा सामेल हुन चाहनुहुन्छ?" : "Want to Join CAN Kavre?"}
            </h2>
            <p className="text-can-white/80 max-w-xl mx-auto mb-6">
              {isNepali 
                ? "काभ्रेपलाञ्चोकको सबैभन्दा ठूलो आईसीटी समुदायको हिस्सा बन्नुहोस्। साथी पेशेवरहरूसँग जोडिनुहोस्, सिक्नुहोस् र बढ्नुहोस्।"
                : "Become a part of the largest ICT community in Kavrepalanchok. Connect, learn, and grow with fellow professionals."
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-can-white text-primary hover:bg-can-white/90 font-semibold">
                  {t("memberLogin")}
                </Button>
              </Link>
              <a href="https://canfederation.org/member_registration" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-can-white text-can-white hover:bg-can-white/10 bg-transparent">
                  {isNepali ? "अहिले दर्ता गर्नुहोस्" : "Register Now"}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
