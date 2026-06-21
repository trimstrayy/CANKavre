import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase";
// Database types don't yet include event/program registration tables.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = supabase as any;
import {
  verifyAttendance,
  verifyAttendanceDirect,
  type VerifyResponse,
} from "@/lib/registration";

type ViewState =
  | { status: "loading" }
  | { status: "info"; reg: TicketInfo }
  | { status: "result"; result: VerifyResponse }
  | { status: "error"; message: string };

interface TicketInfo {
  full_name: string;
  email: string;
  organization?: string | null;
  registration_code: string;
  is_attended: boolean;
  checked_in_at?: string | null;
  event_title?: string;
  event_title_ne?: string;
  event_date?: string;
  event_location?: string;
  type: "event" | "program";
}

const VerifyTicket = () => {
  const { code } = useParams<{ code: string }>();
  const { isNepali } = useLanguage();
  const { isAdmin } = useAdmin();
  const [state, setState] = useState<ViewState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!code) {
        setState({ status: "error", message: isNepali ? "अवैध कोड" : "Invalid code" });
        return;
      }

      // Committee user: auto check-in via edge function
      if (isAdmin) {
        try {
          let res: VerifyResponse;
          try {
            res = await verifyAttendance(code);
          } catch {
            res = await verifyAttendanceDirect(code);
          }
          if (!cancelled) setState({ status: "result", result: res });
          return;
        } catch (err) {
          if (!cancelled)
            setState({
              status: "error",
              message: err instanceof Error ? err.message : "Verification failed",
            });
          return;
        }
      }

      // Public view: just show ticket info (read-only)
      if (!supabase) {
        setState({
          status: "error",
          message: isNepali ? "ब्याकेन्ड उपलब्ध छैन" : "Backend unavailable",
        });
        return;
      }

      try {
        const { data: eventReg } = await sb
          .from("event_registrations")
          .select("full_name, email, organization, registration_code, is_attended, checked_in_at, events(title, title_ne, date, location)")
          .eq("registration_code", code)
          .maybeSingle();

        if (eventReg) {
          const ev = (eventReg as { events: { title: string; title_ne: string; date: string; location: string } | null }).events;
          if (!cancelled)
            setState({
              status: "info",
              reg: {
                full_name: eventReg.full_name,
                email: eventReg.email,
                organization: eventReg.organization,
                registration_code: eventReg.registration_code,
                is_attended: eventReg.is_attended,
                checked_in_at: eventReg.checked_in_at,
                event_title: ev?.title,
                event_title_ne: ev?.title_ne,
                event_date: ev?.date,
                event_location: ev?.location,
                type: "event",
              },
            });
          return;
        }

        const { data: progReg } = await sb
          .from("program_registrations")
          .select("full_name, email, organization, registration_code, is_attended, checked_in_at, upcoming_programs(title, title_ne, start_date, location)")
          .eq("registration_code", code)
          .maybeSingle();

        if (progReg) {
          const pr = (progReg as { upcoming_programs: { title: string; title_ne: string; start_date: string; location: string } | null }).upcoming_programs;
          if (!cancelled)
            setState({
              status: "info",
              reg: {
                full_name: progReg.full_name,
                email: progReg.email,
                organization: progReg.organization,
                registration_code: progReg.registration_code,
                is_attended: progReg.is_attended,
                checked_in_at: progReg.checked_in_at,
                event_title: pr?.title,
                event_title_ne: pr?.title_ne,
                event_date: pr?.start_date,
                event_location: pr?.location,
                type: "program",
              },
            });
          return;
        }

        if (!cancelled)
          setState({
            status: "error",
            message: isNepali
              ? "अमान्य टिकट — दर्ता फेला परेन"
              : "Invalid ticket — registration not found",
          });
      } catch (err) {
        if (!cancelled)
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Failed to load ticket",
          });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [code, isAdmin, isNepali]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            {isNepali ? "टिकट प्रमाणीकरण" : "Ticket Verification"}
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? isNepali
                ? "कमिटी मोड — स्वतः चेक-इन"
                : "Committee mode — auto check-in"
              : isNepali
              ? "तपाईंको दर्ता विवरण"
              : "Your registration details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.status === "loading" && (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isNepali ? "जाँच गर्दै..." : "Verifying..."}</span>
            </div>
          )}

          {state.status === "error" && (
            <div className="text-center py-8 space-y-3">
              <XCircle className="w-12 h-12 text-destructive mx-auto" />
              <p className="font-semibold">{state.message}</p>
            </div>
          )}

          {state.status === "result" && <ResultView result={state.result} isNepali={isNepali} />}

          {state.status === "info" && <InfoView reg={state.reg} isNepali={isNepali} />}

          <div className="pt-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isNepali ? "गृहपृष्ठमा फर्कनुहोस्" : "Back to Home"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ResultView = ({ result, isNepali }: { result: VerifyResponse; isNepali: boolean }) => {
  const Icon =
    result.status === "success"
      ? CheckCircle2
      : result.status === "duplicate" || result.status === "cancelled"
      ? AlertTriangle
      : XCircle;
  const color =
    result.status === "success"
      ? "text-green-600"
      : result.status === "duplicate" || result.status === "cancelled"
      ? "text-amber-500"
      : "text-destructive";

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <Icon className={`w-14 h-14 mx-auto ${color}`} />
        <p className="font-semibold text-lg">{result.message}</p>
      </div>
      {result.attendee && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{result.attendee.name}</span>
          </div>
          <div className="text-muted-foreground text-xs">{result.attendee.email}</div>
          <Badge variant="outline" className="font-mono text-xs">
            {result.attendee.registration_code}
          </Badge>
        </div>
      )}
      {result.event && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
          <div className="font-medium">
            {isNepali && result.event.title_ne ? result.event.title_ne : result.event.title}
          </div>
          {result.event.date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" /> {result.event.date}
            </div>
          )}
          {result.event.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" /> {result.event.location}
            </div>
          )}
        </div>
      )}
      {result.stats && (
        <div className="text-xs text-center text-muted-foreground">
          {isNepali ? "उपस्थिति" : "Attendance"}: {result.stats.total_attended} /{" "}
          {result.stats.total_registered} ({result.stats.attendance_rate}%)
        </div>
      )}
    </div>
  );
};

const InfoView = ({ reg, isNepali }: { reg: TicketInfo; isNepali: boolean }) => (
  <div className="space-y-4">
    <div className="text-center space-y-2">
      {reg.is_attended ? (
        <>
          <CheckCircle2 className="w-14 h-14 mx-auto text-green-600" />
          <p className="font-semibold">
            {isNepali ? "चेक-इन भइसक्यो" : "Already checked in"}
          </p>
          {reg.checked_in_at && (
            <p className="text-xs text-muted-foreground">
              {new Date(reg.checked_in_at).toLocaleString()}
            </p>
          )}
        </>
      ) : (
        <>
          <Ticket className="w-14 h-14 mx-auto text-primary" />
          <p className="font-semibold">
            {isNepali ? "मान्य टिकट" : "Valid Ticket"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isNepali
              ? "प्रवेशद्वारमा यो QR कोड देखाउनुहोस्"
              : "Show this QR code at the entrance"}
          </p>
        </>
      )}
    </div>
    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">{reg.full_name}</span>
      </div>
      <div className="text-muted-foreground text-xs">{reg.email}</div>
      {reg.organization && (
        <div className="text-muted-foreground text-xs">{reg.organization}</div>
      )}
      <Badge variant="outline" className="font-mono text-xs">
        {reg.registration_code}
      </Badge>
    </div>
    {reg.event_title && (
      <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
        <div className="font-medium">
          {isNepali && reg.event_title_ne ? reg.event_title_ne : reg.event_title}
        </div>
        {reg.event_date && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" /> {reg.event_date}
          </div>
        )}
        {reg.event_location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" /> {reg.event_location}
          </div>
        )}
      </div>
    )}
  </div>
);

export default VerifyTicket;