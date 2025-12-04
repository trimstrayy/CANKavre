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

interface EventItem {
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

interface GalleryImage {
  id: number;
  src: string;
  title: string;
}

const initialEvents: EventItem[] = [
  {
    id: 1,
    title: "ICT Day 2081 Celebration",
    date: "2024-05-17",
    time: "10:00 AM",
    location: "Dhulikhel Municipality Hall",
    description:
      "Annual celebration of ICT Day with various programs including workshops, exhibitions, and awareness campaigns.",
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

const initialGalleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    title: "ICT Day 2080",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
    title: "Workshop Session",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400",
    title: "Training Program",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400",
    title: "Blood Donation",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
    title: "Team Meeting",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400",
    title: "Conference",
  },
];

const statusOptions: Array<{ value: EventItem["status"]; label: string }> = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGalleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [eventsDialogOpen, setEventsDialogOpen] = useState(false);
  const [eventsDraft, setEventsDraft] = useState<EventItem[]>(events);
  const [galleryEditMode, setGalleryEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useRegisterSearchSource(
    "events",
    () => {
      const entries: SearchEntry[] = [];

      entries.push({
        id: "events-hero",
        route: "/events",
        title: "Events & Gallery",
        description: "Stay updated with our upcoming events and explore memories from past programs.",
        content: "Stay updated with our upcoming events and explore memories from past programs.",
        tags: ["Events", "Hero"],
      });

      events.forEach((event) => {
        entries.push({
          id: `event-${event.id}`,
          route: "/events",
          title: event.title,
          description: event.description,
          content: `${event.description} ${event.date} ${event.time} ${event.location} ${event.status} ${event.attendees}`,
          tags: ["Events", event.status],
        });
      });

      gallery.forEach((image) => {
        entries.push({
          id: `event-gallery-${image.id}`,
          route: "/events#gallery",
          title: image.title,
          description: "Gallery image",
          content: image.title,
          tags: ["Gallery"],
        });
      });

      return entries;
    },
    [events, gallery]
  );

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

  const formatEventDate = (dateString: string) => {
    const parsed = new Date(dateString);
    if (!dateString || Number.isNaN(parsed.getTime())) {
      return dateString || "Date to be announced";
    }
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openEventsDialog = () => {
    setEventsDraft(events.map((event) => ({ ...event })));
    setEventsDialogOpen(true);
  };

  const addEvent = () => {
    setEventsDraft((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        attendees: 0,
        status: "upcoming",
        image: "",
      },
    ]);
  };

  const removeEvent = (index: number) => {
    setEventsDraft((prev) => prev.filter((_, idx) => idx !== index));
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
    const titlePrompt = window.prompt("Enter image title", suggestedTitle) ?? "Untitled";
    const title = titlePrompt.trim() || "Untitled";

    setGallery((prev) => [...prev, { id: Date.now(), src, title }]);
    event.target.value = "";
  };

  const removeGalleryImage = (id: number) => {
    const imageToRemove = gallery.find((image) => image.id === id);
    if (!imageToRemove) return;

    const confirmed = window.confirm(`Remove "${imageToRemove.title}" from the gallery?`);
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
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Events Hero" />
          </div>
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
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Events List" onClick={openEventsDialog} />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-secondary" />
            Events
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
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{event.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-secondary" />
                      {formatEventDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {event.time || "TBA"}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-accent" />
                      {event.location || "Venue to be confirmed"}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-secondary" />
                      {event.attendees} attendees
                    </div>
                  </div>
                  <Button className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground" variant="outline">
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
          <div className="mb-6 flex justify-end">
            <EditButton
              label={galleryEditMode ? "Done Editing Gallery" : "Edit Gallery"}
              onClick={toggleGalleryEditMode}
            />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ZoomIn className="w-8 h-8 text-accent" />
            Photo Gallery
          </h2>
          {galleryEditMode ? (
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>Edit mode is active. Click the minus icon to remove an image.</span>
              <Button variant="outline" size="sm" className="gap-2" onClick={addGalleryImage}>
                <PlusCircle className="h-4 w-4" /> Add Photo
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
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="font-medium text-background">{image.title}</span>
                </div>
                {galleryEditMode ? (
                  <button
                    type="button"
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm transition hover:bg-destructive hover:text-destructive-foreground"
                    title="Remove photo"
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
            alt={selectedImage.title}
            className="max-h-[90vh] max-w-full rounded-xl object-contain animate-zoom-in"
            onClick={(event) => event.stopPropagation()}
          />
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-lg font-medium text-background">
            {selectedImage.title}
          </p>
        </div>
      )}

      <Dialog open={eventsDialogOpen} onOpenChange={(open) => !open && setEventsDialogOpen(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Events</DialogTitle>
            <DialogDescription>Update event details, schedule, and status for the events list.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-1">
            {eventsDraft.map((event, index) => (
              <div key={event.id} className="space-y-4 rounded-lg border border-border p-4">
                <div className="grid gap-2">
                  <Label htmlFor={`event-title-${event.id}`}>Title</Label>
                  <Input
                    id={`event-title-${event.id}`}
                    value={event.title}
                    onChange={(e) =>
                      setEventsDraft((prev) =>
                        prev.map((item, idx) => (idx === index ? { ...item, title: e.target.value } : item))
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`event-description-${event.id}`}>Description</Label>
                  <Textarea
                    id={`event-description-${event.id}`}
                    rows={3}
                    value={event.description}
                    onChange={(e) =>
                      setEventsDraft((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, description: e.target.value } : item
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`event-date-${event.id}`}>Date</Label>
                    <Input
                      id={`event-date-${event.id}`}
                      type="date"
                      value={event.date}
                      onChange={(e) =>
                        setEventsDraft((prev) =>
                          prev.map((item, idx) => (idx === index ? { ...item, date: e.target.value } : item))
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`event-time-${event.id}`}>Time</Label>
                    <Input
                      id={`event-time-${event.id}`}
                      value={event.time}
                      onChange={(e) =>
                        setEventsDraft((prev) =>
                          prev.map((item, idx) => (idx === index ? { ...item, time: e.target.value } : item))
                        )
                      }
                      placeholder="10:00 AM"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`event-location-${event.id}`}>Location</Label>
                    <Input
                      id={`event-location-${event.id}`}
                      value={event.location}
                      onChange={(e) =>
                        setEventsDraft((prev) =>
                          prev.map((item, idx) => (idx === index ? { ...item, location: e.target.value } : item))
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`event-attendees-${event.id}`}>Attendees</Label>
                    <Input
                      id={`event-attendees-${event.id}`}
                      type="number"
                      min={0}
                      value={Number.isNaN(event.attendees) ? "" : event.attendees}
                      onChange={(e) =>
                        setEventsDraft((prev) =>
                          prev.map((item, idx) =>
                            idx === index
                              ? { ...item, attendees: Number(e.target.value) || 0 }
                              : item
                          )
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`event-status-${event.id}`}>Status</Label>
                    <Select
                      value={event.status}
                      onValueChange={(value: EventItem["status"]) =>
                        setEventsDraft((prev) =>
                          prev.map((item, idx) => (idx === index ? { ...item, status: value } : item))
                        )
                      }
                    >
                      <SelectTrigger id={`event-status-${event.id}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`event-image-${event.id}`}>Image URL</Label>
                    <Input
                      id={`event-image-${event.id}`}
                      value={event.image ?? ""}
                      onChange={(e) =>
                        setEventsDraft((prev) =>
                          prev.map((item, idx) => (idx === index ? { ...item, image: e.target.value } : item))
                        )
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEvent(index)}
                    disabled={eventsDraft.length <= 1}
                  >
                    Remove Event
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addEvent}>
              Add Event
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const cleaned = eventsDraft.map((event) => ({
                  ...event,
                  title: event.title.trim(),
                  description: event.description.trim(),
                  location: event.location.trim(),
                  time: event.time.trim(),
                  date: event.date,
                  attendees: Number.isNaN(event.attendees) ? 0 : event.attendees,
                  image: event.image?.trim(),
                }));
                setEvents(cleaned);
                setEventsDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
