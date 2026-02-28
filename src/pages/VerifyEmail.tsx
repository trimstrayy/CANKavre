import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { verifyEmail } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isNepali } = useLanguage();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage(isNepali ? "प्रमाणिकरण टोकन फेला परेन।" : "Verification token not found.");
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setStatus("success");
          setMessage(result.message || (isNepali ? "इमेल सफलतापूर्वक प्रमाणित भयो!" : "Email verified successfully!"));
          // Auto redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/auth");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result.message || (isNepali ? "प्रमाणिकरण असफल भयो।" : "Verification failed."));
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || (isNepali ? "केहि गलत भयो।" : "Something went wrong."));
      }
    };

    verify();
  }, [token, isNepali, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
            {status === "loading" && (
              <div className="bg-blue-100 dark:bg-blue-900/30 w-full h-full rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="bg-green-100 dark:bg-green-900/30 w-full h-full rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100 dark:bg-red-900/30 w-full h-full rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <CardTitle>
            {status === "loading" && (isNepali ? "इमेल प्रमाणित गर्दै..." : "Verifying Email...")}
            {status === "success" && (isNepali ? "इमेल प्रमाणित भयो!" : "Email Verified!")}
            {status === "error" && (isNepali ? "प्रमाणिकरण असफल" : "Verification Failed")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">{message}</p>
          
          {status === "success" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isNepali ? "३ सेकेन्डमा लगइन पेजमा जाँदैछ..." : "Redirecting to login in 3 seconds..."}
              </p>
              <Button asChild className="w-full bg-accent hover:bg-accent/90">
                <Link to="/auth">
                  <Mail className="w-4 h-4 mr-2" />
                  {isNepali ? "अहिले लगइन गर्नुहोस्" : "Login Now"}
                </Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth">
                  {isNepali ? "दर्ता पेजमा फर्कनुहोस्" : "Back to Registration"}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
