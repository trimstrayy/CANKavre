import { useRef, useCallback } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  MapPin,
  Clock,
  Download,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Share2,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  registrationCode: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  attendeeName: string;
  attendeeEmail: string;
  alreadyRegistered?: boolean;
}

const RegistrationSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { isNepali } = useLanguage();
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);

  const state = location.state as LocationState | null;

  if (!state || !state.registrationCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <Info className="w-12 h-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">
              {isNepali ? "कुनै दर्ता डेटा छैन" : "No Registration Data"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isNepali
                ? "कृपया पहिले कार्यक्रममा दर्ता गर्नुहोस्।"
                : "Please register for an event first."}
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

  const {
    registrationCode,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    attendeeName,
    attendeeEmail,
    alreadyRegistered,
  } = state;

  const verifyUrl = `${window.location.origin}/verify/${registrationCode}`;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(isNepali ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(registrationCode);
    toast({
      title: isNepali ? "कपी भयो!" : "Copied!",
      description: isNepali
        ? "दर्ता कोड क्लिपबोर्डमा कपी भयो।"
        : "Registration code copied to clipboard.",
    });
  }, [registrationCode, isNepali, toast]);

  const downloadQR = useCallback(() => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size + 60; // Extra space for text

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR
      ctx.drawImage(img, 0, 0, size, size);

      // Draw registration code at bottom
      ctx.fillStyle = "#1a365d";
      ctx.font = "bold 16px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(registrationCode, size / 2, size + 25);

      // Draw event title
      ctx.font = "12px Arial, sans-serif";
      ctx.fillStyle = "#666666";
      ctx.fillText(eventTitle, size / 2, size + 48);

      // Download
      const link = document.createElement("a");
      link.download = `QR-${registrationCode}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  }, [registrationCode, eventTitle]);

  const shareRegistration = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CAN Kavre - ${eventTitle}`,
          text: `${isNepali ? "म दर्ता भएको छु" : "I'm registered for"}: ${eventTitle}\n${isNepali ? "कोड" : "Code"}: ${registrationCode}`,
          url: verifyUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(verifyUrl);
      toast({
        title: isNepali ? "लिंक कपी भयो!" : "Link Copied!",
        description: isNepali
          ? "सत्यापन लिंक क्लिपबोर्डमा कपी भयो।"
          : "Verification link copied to clipboard.",
      });
    }
  }, [eventTitle, registrationCode, verifyUrl, isNepali, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-green-50 via-background to-secondary/5 dark:from-green-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {alreadyRegistered
                ? isNepali
                  ? "तपाईं पहिले नै दर्ता हुनुभएको छ!"
                  : "You're Already Registered!"
                : isNepali
                ? "दर्ता सफल भयो!"
                : "Registration Successful!"}
            </h1>
            <p className="text-muted-foreground">
              {isNepali
                ? "तपाईंको QR कोड तयार छ। कृपया यसलाई डाउनलोड गर्नुहोस् वा स्क्रिनसट लिनुहोस्।"
                : "Your QR code is ready. Please download it or take a screenshot."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code Card */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">
                  {isNepali ? "तपाईंको QR कोड" : "Your QR Code"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <div
                  ref={qrRef}
                  className="p-4 bg-white rounded-xl shadow-inner border"
                >
                  <QRCodeSVG
                    value={verifyUrl}
                    size={240}
                    level="M"
                    fgColor="#1a365d"
                    bgColor="#ffffff"
                    includeMargin
                    imageSettings={{
                      src: "/favicon.ico",
                      x: undefined,
                      y: undefined,
                      height: 30,
                      width: 30,
                      excavate: true,
                    }}
                  />
                </div>

                {/* Registration Code */}
                <div className="text-center space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {isNepali ? "दर्ता कोड" : "Registration Code"}
                  </p>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-2 text-lg font-mono font-bold text-foreground hover:text-primary transition-colors"
                    title={isNepali ? "कपी गर्नुहोस्" : "Click to copy"}
                  >
                    {registrationCode}
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <Button
                    onClick={downloadQR}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isNepali ? "डाउनलोड" : "Download"}
                  </Button>
                  <Button
                    onClick={shareRegistration}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {isNepali ? "शेयर" : "Share"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registration Details Card */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isNepali ? "दर्ता विवरण" : "Registration Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {isNepali ? "सहभागी" : "Attendee"}
                    </p>
                    <p className="font-medium">{attendeeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {isNepali ? "इमेल" : "Email"}
                    </p>
                    <p className="text-sm">{attendeeEmail}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {isNepali ? "कार्यक्रम" : "Event"}
                    </p>
                    <p className="font-medium">{eventTitle}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-secondary" />
                      {formatDate(eventDate)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {eventTime}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-accent" />
                      {eventLocation}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Notice */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30">
                <CardContent className="pt-6 flex gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {isNepali ? "इमेल पुष्टि" : "Email Confirmation"}
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      {isNepali
                        ? `पुष्टि इमेल ${attendeeEmail} मा पठाइएको छ। कृपया तपाईंको इनबक्स (र स्प्याम फोल्डर) जाँच गर्नुहोस्।`
                        : `A confirmation email has been sent to ${attendeeEmail}. Please check your inbox (and spam folder).`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    {isNepali ? "महत्त्वपूर्ण जानकारी" : "Important Information"}
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      {isNepali
                        ? "• कार्यक्रमको दिन यो QR कोड देखाउनुहोस्"
                        : "• Present this QR code on the day of the event"}
                    </li>
                    <li>
                      {isNepali
                        ? "• QR कोड डाउनलोड गरेर राख्नुहोस् वा स्क्रिनसट लिनुहोस्"
                        : "• Download the QR code or take a screenshot for your records"}
                    </li>
                    <li>
                      {isNepali
                        ? "• प्रवेशद्वारमा QR कोड स्क्यान गरिनेछ"
                        : "• QR code will be scanned at the entrance for check-in"}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Button asChild variant="outline" className="w-full">
                <Link to="/events">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {isNepali ? "कार्यक्रमहरूमा फर्कनुहोस्" : "Back to Events"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationSuccess;
