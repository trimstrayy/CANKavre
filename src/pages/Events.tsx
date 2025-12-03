import { useState } from "react";
import { Calendar, MapPin, Clock, Users, ChevronRight, ZoomIn, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  status: "upcoming" | "ongoing" | "completed";
  image?: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "ICT Day 2081 Celebration",
    date: "2024-05-17",
    time: "10:00 AM",
    location: "Dhulikhel Municipality Hall",
    description: "Annual celebration of ICT Day with various programs including workshops, exhibitions, and awareness campaigns.",
    attendees: 200,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Digital Literacy Workshop",
    date: "2024-04-15",
    time: "9:00 AM",
    location: "CAN Kavre Office",
    description: "Basic computer and internet skills training for senior citizens and women.",
    attendees: 50,
    status: "completed",
  },
  {
    id: 3,
    title: "Career Opportunities in ICT 2081",
    date: "2024-03-20",
    time: "2:00 PM",
    location: "Banepa Campus",
    description: "Seminar on career paths in information technology for students.",
    attendees: 150,
    status: "completed",
  },
  {
    id: 4,
    title: "Web Development Bootcamp",
    date: "2024-06-01",
    time: "10:00 AM",
    location: "IT Training Center",
    description: "5-day intensive training on modern web development technologies.",
    attendees: 30,
    status: "upcoming",
  },
];

const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", title: "ICT Day 2080" },
  { id: 2, src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400", title: "Workshop Session" },
  { id: 3, src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400", title: "Training Program" },
  { id: 4, src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400", title: "Blood Donation" },
  { id: 5, src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400", title: "Team Meeting" },
  { id: 6, src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400", title: "Conference" },
];

const Events = () => {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "upcoming": return "bg-secondary text-secondary-foreground";
      case "ongoing": return "bg-accent text-accent-foreground";
      case "completed": return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Events & <span className="text-accent">Gallery</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with our upcoming events and explore memories from past programs.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-secondary" />
            Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <Card key={event.id} className="card-hover animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{event.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-secondary" />
                      {new Date(event.date).toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-accent" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-secondary" />
                      {event.attendees} attendees
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ZoomIn className="w-8 h-8 text-accent" />
            Photo Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group cursor-pointer rounded-xl overflow-hidden aspect-video animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-background font-medium">{image.title}</span>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5 text-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage.src.replace("w=400", "w=1200")}
            alt={selectedImage.title}
            className="max-w-full max-h-[90vh] object-contain rounded-xl animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-background font-medium text-lg">
            {selectedImage.title}
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
