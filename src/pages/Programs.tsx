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
  MapPin
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

const Programs = () => {
  const programs = [
    {
      title: "Digital Literacy Campaign",
      description: "Empowering citizens of all ages with basic computer and internet skills. Our comprehensive training covers essential digital skills needed in today's world.",
      icon: Laptop,
      color: "primary",
      features: ["Basic Computer Training", "Internet Safety", "Email & Social Media", "Online Banking Basics"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"
    },
    {
      title: "IT Club Development",
      description: "Establishing and supporting IT clubs in schools across Kavrepalanchok to nurture the next generation of tech leaders.",
      icon: GraduationCap,
      color: "secondary",
      features: ["School IT Club Setup", "Student Mentorship", "Coding Workshops", "Inter-school Competitions"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
    },
    {
      title: "ICT in Agriculture",
      description: "Introducing modern farming techniques through technology. Helping farmers adopt digital tools for better productivity and market access.",
      icon: Globe,
      color: "accent",
      features: ["Digital Farming Tools", "Market Connectivity", "Weather Information", "E-Commerce Training"],
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80"
    },
    {
      title: "Women in Tech",
      description: "Special programs designed to increase female participation in the ICT sector, providing skills training and career guidance.",
      icon: Users,
      color: "primary",
      features: ["Skills Training", "Career Guidance", "Networking Events", "Entrepreneurship Support"],
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80"
    },
    {
      title: "E-Governance Support",
      description: "Assisting local government bodies in implementing digital solutions for better public service delivery.",
      icon: Building2,
      color: "secondary",
      features: ["Digital Documentation", "Online Services", "Staff Training", "Infrastructure Support"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
    },
    {
      title: "Health & ICT",
      description: "Promoting digital health solutions and telemedicine awareness in remote areas of the district.",
      icon: Heart,
      color: "accent",
      features: ["Telemedicine Awareness", "Health App Training", "Digital Health Records", "Emergency Response Systems"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80"
    },
  ];

  const upcomingPrograms = [
    {
      title: "Web Development Bootcamp",
      date: "2080/04/15 - 2080/04/30",
      location: "Dhulikhel",
      spots: "30 seats available"
    },
    {
      title: "Cybersecurity Awareness Workshop",
      date: "2080/05/10",
      location: "Banepa",
      spots: "50 seats available"
    },
    {
      title: "Mobile App Development Training",
      date: "2080/05/20 - 2080/06/05",
      location: "Kavre",
      spots: "25 seats available"
    },
  ];

  const achievements = [
    { number: "50+", label: "IT Clubs Established" },
    { number: "5000+", label: "Citizens Trained" },
    { number: "100+", label: "Programs Conducted" },
    { number: "15+", label: "Schools Covered" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block bg-can-white/20 text-can-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Our Initiatives
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-can-white mb-6">
              Programs & Initiatives
            </h1>
            <p className="text-lg text-can-white/90 mb-8">
              Driving digital transformation across Kavrepalanchok through comprehensive 
              ICT programs that empower communities and bridge the technology gap.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events">
                <Button size="lg" className="bg-can-white text-primary hover:bg-can-white/90">
                  View Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/membership">
                <Button size="lg" variant="outline" className="border-can-white text-can-white hover:bg-can-white/10 bg-transparent">
                  Get Involved
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Banner */}
      <section className="py-8 bg-[#7a0d0d]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((item, idx) => {
              // make first two buttons green, next two blue
              const bgColor = idx < 2 ? 'bg-green-500' : 'bg-blue-500';
              return (
                <div key={idx} className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${bgColor}`}>
                    <div className="font-heading text-2xl md:text-3xl font-bold text-white">{item.number}</div>
                  </div>
                  <div className="text-white/90 text-sm mt-3">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Programs Carousel */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-2">
                Featured
              </span>
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
              {programs.map((program, index) => (
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
                      <div className={`w-12 h-12 rounded-xl bg-${program.color}/10 flex items-center justify-center mb-3`}>
                        <program.icon className={`w-6 h-6 text-${program.color}`} />
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
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 -translate-x-1/2" />
            <CarouselNext className="right-0 translate-x-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Upcoming Programs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
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
                          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                            Register
                          </Button>
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
          <div className="text-center mb-12">
            <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold mb-2">
              Complete List
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              All Our Programs
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer card-hover bg-card"
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-${program.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <program.icon className={`w-7 h-7 text-${program.color}`} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {program.description}
                  </p>
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-can-white mb-4">
              Want to Partner With Us?
            </h2>
            <p className="text-can-white/80 max-w-xl mx-auto mb-6">
              We collaborate with organizations, educational institutions, and government bodies 
              to expand our reach and impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-can-white text-primary hover:bg-can-white/90">
                  Contact Us
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-can-white text-can-white hover:bg-can-white/10 bg-transparent">
                  Learn About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;