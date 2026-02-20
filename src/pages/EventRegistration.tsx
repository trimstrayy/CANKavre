import { useState, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  registerForEvent,
  registerForEventDirect,
  RegistrationRequest,
} from "@/lib/registration";

// Hardcoded events matching Events.tsx initialEvents for now
// In production, these would be fetched from Supabase
const eventsData: Record<
  string,
  {
    id: number;
    title: string;
    titleNe: string;
    date: string;
    time: string;
    location: string;
    locationNe: string;
    description: string;
    descriptionNe: string;
    status: string;
    attendees: number;
  }
> = {
  "1": {
    id: 1,
    title: "18th AGM & 10th Convention",
    titleNe: "१८ औं साधारण सभा तथा १० औं अधिवेशन",
    date: "2022-12-03",
    time: "10:00 AM",
    location: "Banepa, Kavrepalanchok",
    locationNe: "बनेपा, काभ्रेपलाञ्चोक",
    description:
      "The 18th Annual General Meeting and 10th Convention of CAN Federation Kavre.",
    descriptionNe:
      "कम्प्युटर एशोसियसन अफ नेपाल (क्यान) महासंघ काभ्रेको १८ औं साधारण सभा तथा १० औं अधिवेशन।",
    status: "completed",
    attendees: 152,
  },
  "2": {
    id: 2,
    title: "ICT Day 2080 - Blood Donation Program",
    titleNe: "आईसीटी दिवस २०८० - रक्तदान कार्यक्रम",
    date: "2023-04-29",
    time: "9:00 AM",
    location: "Banepa Chardawato",
    locationNe: "बनेपा चारदोबाटो",
    description:
      "Blood donation program in collaboration with Nepal Red Cross Society.",
    descriptionNe:
      "नेपाल रेडक्रस सोसाईटिको सहकार्यमा रक्तदान कार्यक्रम।",
    status: "completed",
    attendees: 45,
  },
  "3": {
    id: 3,
    title: "Career Opportunities in ICT 2080",
    titleNe: "आईसीटीमा क्यारियर अवसरहरू २०८०",
    date: "2023-06-03",
    time: "2:00 PM",
    location: "Banepa, Kavrepalanchok",
    locationNe: "बनेपा, काभ्रेपलाञ्चोक",
    description: "Grand seminar on career opportunities in ICT.",
    descriptionNe: "आईसीटीमा क्यारियर अवसरहरू विषयमा भव्य सेमिनार।",
    status: "upcoming",
    attendees: 150,
  },
  "4": {
    id: 4,
    title: "ICT Business Meet with Entrepreneurs",
    titleNe: "व्यावसायी सँग आईसीटी बिजनेस मिट",
    date: "2023-06-29",
    time: "10:00 AM",
    location: "Banepa, Kavrepalanchok",
    locationNe: "बनेपा, काभ्रेपलाञ्चोक",
    description: "ICT Business Meet for entrepreneurs and professionals.",
    descriptionNe:
      "उद्यमी र व्यवसायीहरूको लागि आईसीटी बिजनेस मिट।",
    status: "upcoming",
    attendees: 30,
  },
};

const EventRegistration = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isNepali } = useLanguage();
  const { toast } = useToast();

  const event = id ? eventsData[id] : null;

  const [form, setForm] = useState({
    full_name: "",
    full_name_ne: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">
              {isNepali ? "कार्यक्रम फेला परेन" : "Event Not Found"}
            </h2>
            <p className="text-muted-foreground">
              {isNepali
                ? "तपाईंले खोज्नुभएको कार्यक्रम उपलब्ध छैन।"
                : "The event you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link to="/events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isNepali ? "कार्यक्रमहरूमा फर्कनुहोस्" : "Back to Events"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isRegistrationOpen = event.status === "upcoming" || event.status === "ongoing";

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(isNepali ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.full_name.trim()) {
      setError(isNepali ? "पूरा नाम आवश्यक छ" : "Full name is required");
      return;
    }
    if (!form.email.trim()) {
      setError(isNepali ? "इमेल आवश्यक छ" : "Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(isNepali ? "मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्" : "Please enter a valid email address");
      return;
    }

    setSubmitting(true);

    const requestData: RegistrationRequest = {
      event_id: event.id,
      full_name: form.full_name.trim(),
      full_name_ne: form.full_name_ne.trim() || undefined,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || undefined,
      organization: form.organization.trim() || undefined,
      designation: form.designation.trim() || undefined,
    };

    try {
      // Try Edge Function first, fall back to direct Supabase
      let regCode: string;
      try {
        const result = await registerForEvent(requestData);
        regCode = result.registration_code;
      } catch {
        // Fallback to direct registration
        const result = await registerForEventDirect(requestData);
        regCode = result.registration_code;
      }

      toast({
        title: isNepali ? "दर्ता सफल!" : "Registration Successful!",
        description: isNepali
          ? "तपाईंको QR कोड तयार भएको छ।"
          : "Your QR code has been generated.",
      });

      navigate(`/events/${id}/register/success`, {
        state: {
          registrationCode: regCode,
          eventTitle: isNepali ? event.titleNe : event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: isNepali ? event.locationNe : event.location,
          attendeeName: form.full_name,
          attendeeEmail: form.email,
        },
      });
    } catch (err: unknown) {
      const error = err as Error & { alreadyRegistered?: boolean; registrationCode?: string };
      if (error.alreadyRegistered && error.registrationCode) {
        toast({
          title: isNepali ? "पहिले नै दर्ता भइसकेको" : "Already Registered",
          description: isNepali
            ? "तपाईं पहिले नै यो कार्यक्रममा दर्ता हुनुभएको छ।"
            : "You are already registered for this event.",
        });
        navigate(`/events/${id}/register/success`, {
          state: {
            registrationCode: error.registrationCode,
            eventTitle: isNepali ? event.titleNe : event.title,
            eventDate: event.date,
            eventTime: event.time,
            eventLocation: isNepali ? event.locationNe : event.location,
            attendeeName: form.full_name,
            attendeeEmail: form.email,
            alreadyRegistered: true,
          },
        });
      } else {
        setError(error.message || (isNepali ? "दर्ता असफल भयो" : "Registration failed"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isNepali ? "कार्यक्रमहरूमा फर्कनुहोस्" : "Back to Events"}
            </Link>
          </Button>
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">
              {isNepali ? "कार्यक्रम दर्ता" : "Event Registration"}
            </Badge>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isNepali ? event.titleNe : event.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Event Details Sidebar */}
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isNepali ? "कार्यक्रम विवरण" : "Event Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>{isNepali ? event.locationNe : event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span>
                      {event.attendees} {isNepali ? "सहभागी" : "attendees"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-2 text-accent">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium text-sm">
                      {isNepali ? "दर्ता पछि" : "After Registration"}
                    </span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-7">
                    <li>
                      {isNepali
                        ? "✓ QR कोड सहित पुष्टि इमेल प्राप्त गर्नुहुनेछ"
                        : "✓ You'll receive a confirmation email with QR code"}
                    </li>
                    <li>
                      {isNepali
                        ? "✓ कार्यक्रमको दिन QR कोड स्क्यान गर्नुहोस्"
                        : "✓ Scan QR code on event day for check-in"}
                    </li>
                    <li>
                      {isNepali
                        ? "✓ तपाईंको QR कोड डाउनलोड गर्न सकिन्छ"
                        : "✓ Your QR code can be downloaded"}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isNepali ? "दर्ता फारम" : "Registration Form"}
                  </CardTitle>
                  <CardDescription>
                    {isNepali
                      ? "कृपया तलको विवरणहरू भर्नुहोस्"
                      : "Please fill in the details below"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isRegistrationOpen ? (
                    <div className="text-center py-8 space-y-4">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">
                        {isNepali
                          ? "यो कार्यक्रमको लागि दर्ता बन्द छ।"
                          : "Registration is closed for this event."}
                      </p>
                      <Button asChild variant="outline">
                        <Link to="/events">
                          {isNepali
                            ? "अन्य कार्यक्रमहरू हेर्नुहोस्"
                            : "View Other Events"}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="full_name">
                          {isNepali ? "पूरा नाम" : "Full Name"}{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="full_name"
                          value={form.full_name}
                          onChange={(e) => handleChange("full_name", e.target.value)}
                          placeholder={
                            isNepali ? "तपाईंको पूरा नाम" : "Your full name"
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="full_name_ne">
                          {isNepali
                            ? "पूरा नाम (देवनागरी)"
                            : "Full Name (Nepali/Devanagari)"}
                        </Label>
                        <Input
                          id="full_name_ne"
                          value={form.full_name_ne}
                          onChange={(e) =>
                            handleChange("full_name_ne", e.target.value)
                          }
                          placeholder="पूरा नाम"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {isNepali ? "इमेल ठेगाना" : "Email Address"}{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {isNepali ? "सम्पर्क नम्बर" : "Phone Number"}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+977-9800000000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organization">
                          {isNepali ? "संस्था/कम्पनी" : "Organization"}
                        </Label>
                        <Input
                          id="organization"
                          value={form.organization}
                          onChange={(e) =>
                            handleChange("organization", e.target.value)
                          }
                          placeholder={
                            isNepali
                              ? "तपाईंको संस्थाको नाम"
                              : "Your organization name"
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="designation">
                          {isNepali ? "पद/पदनाम" : "Designation"}
                        </Label>
                        <Input
                          id="designation"
                          value={form.designation}
                          onChange={(e) =>
                            handleChange("designation", e.target.value)
                          }
                          placeholder={
                            isNepali ? "तपाईंको पद" : "Your designation"
                          }
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                        disabled={submitting}
                        size="lg"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isNepali
                              ? "दर्ता हुँदैछ..."
                              : "Registering..."}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {isNepali
                              ? "दर्ता गर्नुहोस्"
                              : "Register for Event"}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventRegistration;
