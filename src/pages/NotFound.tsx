import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditButton from "@/components/EditButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="absolute top-8 right-8 hidden md:block">
        <EditButton label="Edit 404 Page" />
      </div>
      <div className="text-center px-4 animate-fade-in-up">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-heading font-bold leading-none gradient-text opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5 shadow-elevated">
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <Search className="w-12 h-12 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
