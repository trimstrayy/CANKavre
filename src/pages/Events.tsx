import { ChangeEvent, useRef, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  ZoomIn,
  X,
  Minus,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditButton from "@/components/EditButton";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventItem {
  id: number;
  title: string;
  titleNe: string;
  date: string;
  time: string;
  location: string;
  locationNe: string;
  description: string;
  descriptionNe: string;
  attendees: number;
  status: "upcoming" | "ongoing" | "completed";
  image?: string;
}

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  titleNe: string;
}

const initialEvents: EventItem[] = [
  {
    id: 1,
    title: "ICT Day 2081 Celebration",
    titleNe: "आईसीटी दिवस २०८१ समारोह",
    date: "2024-05-17",
    time: "10:00 AM",
    location: "Dhulikhel Municipality Hall",
    locationNe: "धुलिखेल नगरपालिका हल",
    description: "Annual celebration of ICT Day with various programs including workshops, exhibitions, and awareness campaigns.",
    descriptionNe: "कार्यशालाहरू, प्रदर्शनीहरू र जागरूकता अभियानहरू सहित विभिन्न कार्यक्रमहरूसँग आईसीटी दिवसको वार्षिक समारोह।",
    attendees: 200,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Digital Literacy Workshop",
    titleNe: "डिजिटल साक्षरता कार्यशाला",
    date: "2024-04-15",
    time: "9:00 AM",
    location: "CAN Kavre Office",
    locationNe: "क्यान काभ्रे कार्यालय",
    description: "Basic computer and internet skills training for senior citizens and women.",
    descriptionNe: "ज्येष्ठ नागरिक र महिलाहरूको लागि आधारभूत कम्प्युटर र इन्टरनेट सीप तालिम।",
    attendees: 50,
    status: "completed",
  },
  {
    id: 3,
    title: "Career Opportunities in ICT 2081",
    titleNe: "आईसीटीमा क्यारियर अवसरहरू २०८१",
    date: "2024-03-20",
    time: "2:00 PM",
    location: "Banepa Campus",
    locationNe: "बनेपा क्याम्पस",
    description: "Seminar on career paths in information technology for students.",
    descriptionNe: "विद्यार्थीहरूको लागि सूचना प्रविधिमा क्यारियर मार्गहरूमा सेमिनार।",
    attendees: 150,
    status: "completed",
  },
  {
    id: 4,
    title: "Web Development Bootcamp",
    titleNe: "वेब डेभलपमेन्ट बुटक्याम्प",
    date: "2024-06-01",
    time: "10:00 AM",
    location: "IT Training Center",
    locationNe: "आईटी तालिम केन्द्र",
    description: "5-day intensive training on modern web development technologies.",
    descriptionNe: "आधुनिक वेब डेभलपमेन्ट प्रविधिहरूमा ५ दिने गहन तालिम।",
    attendees: 30,
    status: "upcoming",
  },
];

const initialGalleryImages: GalleryImage[] = [
  { id: 1, src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", title: "ICT Day 2080", titleNe: "आईसीटी दिवस २०८०" },
  { id: 2, src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400", title: "Workshop Session", titleNe: "कार्यशाला सत्र" },
  { id: 3, src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400", title: "Training Program", titleNe: "तालिम कार्यक्रम" },
  { id: 4, src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400", title: "Blood Donation", titleNe: "रक्तदान" },
  { id: 5, src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400", title: "Team Meeting", titleNe: "टोली बैठक" },
  { id: 6, src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400", title: "Conference", titleNe: "सम्मेलन" },
];

const Events = () => {
  const { t, isNepali } = useLanguage();
  const [events] = useState<EventItem[]>(initialEvents);
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGalleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryEditMode, setGalleryEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getStatusColor = (status: EventItem["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-secondary text-secondary-foreground";
      case "ongoing":
        return "bg-accent text-accent-foreground";
      case "completed":
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: EventItem["status"]) => {
    if (isNepali) {
      switch (status) {
        case "upcoming": return "आगामी";
        case "ongoing": return "चालु";
        case "completed": return "सम्पन्न";
      }
    }
    return status;
  };

  const formatEventDate = (dateString: string) => {
    const parsed = new Date(dateString);
    if (!dateString || Number.isNaN(parsed.getTime())) {
      return dateString || (isNepali ? "मिति घोषणा हुने" : "Date to be announced");
    }
    return parsed.toLocaleDateString(isNepali ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleGalleryEditMode = () => {
    setGalleryEditMode((prev) => !prev);
  };

  const addGalleryImage = () => {
    fileInputRef.current?.click();
  };

  const handleGalleryFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      event.target.value = "";
      return;
    }

    const src = URL.createObjectURL(file);
    const suggestedTitle = file.name.replace(/\.[^/.]+$/, "");
    const titlePrompt = window.prompt(isNepali ? "छवि शीर्षक प्रविष्ट गर्नुहोस्" : "Enter image title", suggestedTitle) ?? "Untitled";
    const title = titlePrompt.trim() || "Untitled";

    setGallery((prev) => [...prev, { id: Date.now(), src, title, titleNe: title }]);
    event.target.value = "";
  };

  const removeGalleryImage = (id: number) => {
    const imageToRemove = gallery.find((image) => image.id === id);
    if (!imageToRemove) return;

    const confirmed = window.confirm(isNepali 
      ? `"${imageToRemove.titleNe}" ग्यालेरीबाट हटाउने?` 
      : `Remove "${imageToRemove.title}" from the gallery?`);
    if (!confirmed) return;

    if (imageToRemove.src.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.src);
    }

    setGallery((prev) => prev.filter((image) => image.id !== id));
    setSelectedImage((prev) => (prev?.id === id ? null : prev));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("eventsTitle")} & <span className="text-accent">{t("galleryTitle")}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("eventsSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-secondary" />
            {t("eventsTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <Card
                key={event.id}
                className="card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl">{isNepali ? event.titleNe : event.title}</CardTitle>
                    <Badge className={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{isNepali ? event.descriptionNe : event.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-secondary" />
                      {formatEventDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {event.time || (isNepali ? "समय घोषणा हुने" : "TBA")}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-accent" />
                      {isNepali ? event.locationNe : event.location || (isNepali ? "स्थान निश्चित हुने" : "Venue to be confirmed")}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-secondary" />
                      {event.attendees} {isNepali ? "सहभागी" : "attendees"}
                    </div>
                  </div>
                  <Button className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground" variant="outline">
                    {isNepali ? "विवरण हेर्नुहोस्" : "View Details"}
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
          <div className="mb-6 flex justify-end">
            <EditButton
              label={galleryEditMode ? (isNepali ? "सम्पादन समाप्त" : "Done Editing Gallery") : (isNepali ? "ग्यालेरी सम्पादन" : "Edit Gallery")}
              onClick={toggleGalleryEditMode}
            />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ZoomIn className="w-8 h-8 text-accent" />
            {t("galleryTitle")}
          </h2>
          {galleryEditMode ? (
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{isNepali ? "सम्पादन मोड सक्रिय छ। हटाउन माइनस आइकन क्लिक गर्नुहोस्।" : "Edit mode is active. Click the minus icon to remove an image."}</span>
              <Button variant="outline" size="sm" className="gap-2" onClick={addGalleryImage}>
                <PlusCircle className="h-4 w-4" /> {isNepali ? "फोटो थप्नुहोस्" : "Add Photo"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGalleryFileChange}
              />
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.map((image, index) => (
              <div
                key={image.id}
                className="relative group overflow-hidden rounded-xl aspect-video cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  if (galleryEditMode) return;
                  setSelectedImage(image);
                }}
              >
                <img
                  src={image.src}
                  alt={isNepali ? image.titleNe : image.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="font-medium text-background">{isNepali ? image.titleNe : image.title}</span>
                </div>
                {galleryEditMode ? (
                  <button
                    type="button"
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm transition hover:bg-destructive hover:text-destructive-foreground"
                    title={isNepali ? "फोटो हटाउनुहोस्" : "Remove photo"}
                    onClick={(event) => {
                      event.stopPropagation();
                      removeGalleryImage(image.id);
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="w-5 h-5 text-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && !galleryEditMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-background"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selectedImage.src.replace("w=400", "w=1200")}
            alt={isNepali ? selectedImage.titleNe : selectedImage.title}
            className="max-h-[90vh] max-w-full rounded-xl object-contain animate-zoom-in"
            onClick={(event) => event.stopPropagation()}
          />
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-lg font-medium text-background">
            {isNepali ? selectedImage.titleNe : selectedImage.title}
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
