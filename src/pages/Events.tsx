import { ChangeEvent, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditButton from "@/components/EditButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import ContentModal, { FieldDef } from "@/components/ContentModal";
import { eventsApi, EventRecord } from "@/lib/api";
import { fetchEvents, fetchGalleryImages, type DynamicGalleryImage } from "@/lib/supabaseContent";

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


const eventFields: FieldDef[] = [
  { key: "title", label: "Title (EN)", type: "text" },
  { key: "titleNe", label: "Title (NE) - Optional", type: "text", placeholder: "Leave blank for auto-translation" },
  { key: "date", label: "Date", type: "date" },
  { key: "time", label: "Time", type: "text" },
  { key: "location", label: "Location (EN)", type: "text" },
  { key: "locationNe", label: "Location (NE) - Optional", type: "text", placeholder: "Leave blank for auto-translation" },
  { key: "description", label: "Description (EN)", type: "textarea" },
  { key: "descriptionNe", label: "Description (NE) - Optional", type: "textarea", placeholder: "Leave blank for auto-translation" },
  { key: "attendees", label: "Attendees", type: "number" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "upcoming", label: "Upcoming" },
      { value: "ongoing", label: "Ongoing" },
      { value: "completed", label: "Completed" },
    ],
  },
  { key: "image", label: "Image URL", type: "text" },
];

const Events = () => {
  const { t, isNepali } = useLanguage();
  const { isAdmin, token } = useAdmin();
  const { toast } = useToast();

  const [dbEvents, setDbEvents] = useState<EventRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryEditMode, setGalleryEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    Promise.all([fetchEvents(), fetchGalleryImages()])
      .then(([events, galleryImages]) => {
        setDbEvents(
          events.map((e) => ({
            id: e.id,
            title: e.title,
            titleNe: e.titleNe,
            date: e.date,
            time: e.time,
            location: e.location,
            locationNe: e.locationNe,
            description: e.description,
            descriptionNe: e.descriptionNe,
            attendees: e.attendees,
            status: e.status,
            image: e.image || "",
          }))
        );
        setGallery(
          galleryImages.map((image: DynamicGalleryImage) => ({
            id: image.id,
            src: image.src,
            title: image.title,
            titleNe: image.titleNe,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const displayEvents: EventItem[] = dbEvents.map((e) => ({
    id: e.id,
    title: e.title,
    titleNe: e.titleNe,
    date: e.date,
    time: e.time,
    location: e.location,
    locationNe: e.locationNe,
    description: e.description,
    descriptionNe: e.descriptionNe,
    attendees: e.attendees,
    status: e.status as EventItem["status"],
    image: e.image,
  }));

  const handleEventSubmit = async (data: Record<string, string>) => {
    try {
      if (editingEvent) {
        const updated = await eventsApi.update(token!, editingEvent.id, data);
        setDbEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        toast({ title: "Event updated" });
      } else {
        const created = await eventsApi.create(token!, data);
        setDbEvents((prev) => [...prev, created]);
        toast({ title: "Event added" });
      }
    } catch {
      toast({ title: "Error saving event", variant: "destructive" });
    }
  };

  const handleEventDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      await eventsApi.remove(token!, id);
      setDbEvents((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Event deleted" });
    } catch {
      toast({ title: "Error deleting event", variant: "destructive" });
    }
  };

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
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-8 h-8 text-secondary" />
              {t("eventsTitle")}
            </h2>
            {isAdmin && (
              <Button
                onClick={() => {
                  setEditingEvent(null);
                  setModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Event
              </Button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {displayEvents.map((event, index) => (
              <Card
                key={event.id}
                className="group card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl">{isNepali ? event.titleNe : event.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingEvent(event as unknown as EventRecord);
                              setModalOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEventDelete(event.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
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
                  <div className="flex gap-2">
                    <Button className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground" variant="outline">
                      {isNepali ? "विवरण हेर्नुहोस्" : "View Details"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    {(event.status === "upcoming" || event.status === "ongoing") && (
                      <Button
                        asChild
                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      >
                        <Link to={`/events/${event.id}/register`}>
                          {isNepali ? "दर्ता गर्नुहोस्" : "Register"}
                        </Link>
                      </Button>
                    )}
                  </div>
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

      <ContentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingEvent ? "Edit Event" : "Add Event"}
        fields={eventFields}
        initial={editingEvent ? (editingEvent as unknown as Record<string, string>) : undefined}
        onSubmit={handleEventSubmit}
      />
    </div>
  );
};

export default Events;
