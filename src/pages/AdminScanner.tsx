import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  BarChart3,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import {
  verifyAttendance,
  verifyAttendanceDirect,
  VerifyResponse,
} from "@/lib/registration";

// Audio feedback
const playBeep = (type: "success" | "error" | "warning") => {
  try {
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0.3;

    switch (type) {
      case "success":
        osc.frequency.value = 880;
        osc.type = "sine";
        break;
      case "warning":
        osc.frequency.value = 440;
        osc.type = "triangle";
        break;
      case "error":
        osc.frequency.value = 220;
        osc.type = "square";
        break;
    }

    osc.start();
    setTimeout(() => {
      osc.stop();
      audioCtx.close();
    }, type === "success" ? 200 : 400);
  } catch {
    // Audio not supported
  }
};

type ScanResult = VerifyResponse & { timestamp: Date };

const AdminScanner = () => {
  const { isNepali } = useLanguage();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [processing, setProcessing] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScannedRef = useRef<string>("");
  const cooldownRef = useRef(false);

  const extractRegistrationCode = useCallback((qrData: string): string => {
    // QR data might be a verify URL or the code itself
    const urlMatch = qrData.match(/verify\/([A-Z]{3}-\d{4}-\d{5}-[A-Z0-9]{4})/);
    if (urlMatch) return urlMatch[1];

    const codeMatch = qrData.match(/^[A-Z]{3}-\d{4}-\d{5}-[A-Z0-9]{4}$/);
    if (codeMatch) return codeMatch[0];

    return qrData;
  }, []);

  const handleScan = useCallback(
    async (decodedText: string) => {
      if (cooldownRef.current || processing) return;

      const code = extractRegistrationCode(decodedText);

      // Prevent duplicate rapid scans
      if (code === lastScannedRef.current) return;
      lastScannedRef.current = code;
      cooldownRef.current = true;

      setProcessing(true);

      try {
        let result: VerifyResponse;
        try {
          result = await verifyAttendance(code);
        } catch {
          result = await verifyAttendanceDirect(code);
        }

        const scanResult: ScanResult = { ...result, timestamp: new Date() };
        setLastResult(scanResult);
        setScanHistory((prev) => [scanResult, ...prev].slice(0, 50));

        // Audio + toast feedback
        if (soundEnabled) {
          playBeep(
            result.status === "success"
              ? "success"
              : result.status === "duplicate"
              ? "warning"
              : "error"
          );
        }

        toast({
          title:
            result.status === "success"
              ? isNepali
                ? "✓ चेक-इन सफल!"
                : "✓ Check-in Successful!"
              : result.status === "duplicate"
              ? isNepali
                ? "⚠ पहिले नै चेक-इन भइसक्यो"
                : "⚠ Already Checked In"
              : isNepali
              ? "✗ अमान्य टिकट"
              : "✗ Invalid Ticket",
          description: result.message,
          variant:
            result.status === "success"
              ? "default"
              : result.status === "duplicate"
              ? "default"
              : "destructive",
        });
      } catch (err: unknown) {
        const error = err as Error;
        const scanResult: ScanResult = {
          status: "error",
          message: error.message,
          timestamp: new Date(),
        };
        setLastResult(scanResult);
        if (soundEnabled) playBeep("error");
      } finally {
        setProcessing(false);
        // 3-second cooldown before allowing next scan
        setTimeout(() => {
          cooldownRef.current = false;
          lastScannedRef.current = "";
        }, 3000);
      }
    },
    [processing, soundEnabled, isNepali, toast, extractRegistrationCode]
  );

  const startScanner = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      const scanner = new Html5Qrcode("qr-scanner-container");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        handleScan,
        () => {} // Ignore scan failures (empty frames)
      );

      setScanning(true);
    } catch (err) {
      console.error("Scanner error:", err);
      toast({
        title: isNepali ? "क्यामेरा त्रुटि" : "Camera Error",
        description: isNepali
          ? "क्यामेरा पहुँच गर्न सकिएन। कृपया अनुमति दिनुहोस्।"
          : "Could not access camera. Please grant permission.",
        variant: "destructive",
      });
    }
  }, [handleScan, isNepali, toast]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Scanner already stopped
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "duplicate":
        return "bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "invalid":
      case "error":
        return "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "cancelled":
        return "bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case "duplicate":
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      case "cancelled":
      case "invalid":
      case "error":
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">
              {isNepali ? "पहुँच अस्वीकार" : "Access Denied"}
            </h2>
            <p className="text-muted-foreground">
              {isNepali
                ? "यो पृष्ठ प्रशासकहरूको लागि मात्र हो।"
                : "This page is for administrators only."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <Camera className="w-7 h-7 text-secondary" />
                {isNepali ? "QR स्क्यानर" : "QR Scanner"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isNepali
                  ? "उपस्थिति चेक-इन को लागि QR कोड स्क्यान गर्नुहोस्"
                  : "Scan QR codes for attendance check-in"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Scanner */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    {isNepali ? "क्यामेरा स्क्यानर" : "Camera Scanner"}
                  </CardTitle>
                  <CardDescription>
                    {scanning
                      ? isNepali
                        ? "QR कोडलाई क्यामेरा अगाडि राख्नुहोस्"
                        : "Hold a QR code in front of the camera"
                      : isNepali
                      ? "स्क्यान सुरु गर्न बटन थिच्नुहोस्"
                      : "Press the button to start scanning"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    id="qr-scanner-container"
                    ref={containerRef}
                    className="w-full aspect-square bg-muted rounded-lg overflow-hidden relative"
                  >
                    {!scanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={scanning ? stopScanner : startScanner}
                    className={`w-full ${
                      scanning
                        ? "bg-destructive hover:bg-destructive/90"
                        : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    }`}
                    size="lg"
                  >
                    {scanning ? (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        {isNepali ? "स्क्यान रोक्नुहोस्" : "Stop Scanning"}
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        {isNepali ? "स्क्यान सुरु गर्नुहोस्" : "Start Scanning"}
                      </>
                    )}
                  </Button>

                  {processing && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {isNepali ? "प्रमाणित गर्दै..." : "Verifying..."}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              {/* Last Scan Result */}
              {lastResult && (
                <Card
                  className={`border-2 transition-all duration-300 ${getStatusColor(
                    lastResult.status
                  )}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {getStatusIcon(lastResult.status)}
                      <div className="flex-1 space-y-2">
                        <p className="font-semibold text-lg">
                          {lastResult.status === "success"
                            ? isNepali
                              ? "✓ चेक-इन सफल!"
                              : "✓ Check-in Successful!"
                            : lastResult.status === "duplicate"
                            ? isNepali
                              ? "⚠ पहिले नै चेक-इन"
                              : "⚠ Already Checked In"
                            : isNepali
                            ? "✗ अमान्य"
                            : "✗ Invalid"}
                        </p>
                        <p className="text-sm">{lastResult.message}</p>

                        {lastResult.attendee && (
                          <div className="mt-3 space-y-1 text-sm">
                            <p><strong>{isNepali ? "नाम" : "Name"}:</strong> {lastResult.attendee.name}</p>
                            <p><strong>{isNepali ? "इमेल" : "Email"}:</strong> {lastResult.attendee.email}</p>
                            {lastResult.attendee.organization && (
                              <p><strong>{isNepali ? "संस्था" : "Org"}:</strong> {lastResult.attendee.organization}</p>
                            )}
                            <p className="font-mono text-xs">{lastResult.attendee.registration_code}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              {lastResult?.stats && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      {isNepali ? "उपस्थिति तथ्याङ्क" : "Attendance Stats"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-bold text-secondary">
                          {lastResult.stats.total_registered}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isNepali ? "दर्ता" : "Registered"}
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {lastResult.stats.total_attended}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isNepali ? "उपस्थित" : "Attended"}
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {lastResult.stats.attendance_rate}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isNepali ? "दर" : "Rate"}
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={lastResult.stats.attendance_rate}
                      className="h-2"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Scan History */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {isNepali ? "स्क्यान इतिहास" : "Scan History"}
                      <Badge variant="secondary" className="ml-1">
                        {scanHistory.length}
                      </Badge>
                    </CardTitle>
                    {scanHistory.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setScanHistory([]);
                          setLastResult(null);
                        }}
                        className="text-xs"
                      >
                        {isNepali ? "खाली गर्नुहोस्" : "Clear"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {scanHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {isNepali
                        ? "अहिले सम्म कुनै स्क्यान छैन"
                        : "No scans yet"}
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {scanHistory.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between text-sm py-2">
                            <div className="flex items-center gap-2">
                              {item.status === "success" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : item.status === "duplicate" ? (
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="font-medium truncate max-w-[180px]">
                                {item.attendee?.name || item.message}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {item.timestamp.toLocaleTimeString(
                                isNepali ? "ne-NP" : "en-US",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                          {idx < scanHistory.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
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

export default AdminScanner;
