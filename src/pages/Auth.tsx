import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Users,
  Building2,
  ArrowLeft,
  ExternalLink,
  Mail,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginType, setLoginType] = useState<"committee" | "subcommittee">("committee");
  const [credentials, setCredentials] = useState({ 
    email: "", 
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login attempt (no backend)
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Attempt",
        description: "This is a demo UI-only login. Connect a backend to enable real authentication.",
      });
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      toast({ title: 'Password Mismatch', description: 'Passwords do not match. Please try again.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    // Simulate registration (UI-only)
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: 'Registration', description: 'Registration simulated. For official membership, please use the CAN Nepal portal.' });
      window.open('https://canfederation.org/member_registration', '_blank');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-2" />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Side - Info */}
            <div className="lg:sticky lg:top-8 animate-fade-in-up">
              <div className="bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl p-8 text-can-white mb-6">
                <div className="w-20 h-20 bg-can-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-10 h-10" />
                </div>
                <h1 className="font-heading text-3xl font-bold mb-4">
                  CAN Kavre<br />Member Portal
                </h1>
                <p className="text-can-white/80 mb-6">
                  Access your member dashboard, manage content, and connect with the ICT community of Kavrepalanchok.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-can-white/20 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Committee Access</h3>
                      <p className="text-sm text-can-white/70">Full admin rights to manage content and approve submissions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-can-white/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Subcommittee Access</h3>
                      <p className="text-sm text-can-white/70">Submit content for committee approval and view resources</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration CTA */}
              <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-2">Not a Member Yet?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Join the Computer Association of Nepal and be part of the largest ICT community in Kavrepalanchok.
                  </p>
                  <a 
                    href="https://canfederation.org/member_registration" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button className="bg-primary hover:bg-primary/90 gap-2">
                      <UserPlus className="w-4 h-4" />
                      Register at CAN Nepal
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Forms */}
            <div className="animate-fade-in-up delay-100">
              <Card className="shadow-elevated border-0">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-heading text-2xl">
                    {activeTab === "login" ? "Member Login" : "Quick Registration"}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "login" 
                      ? "Sign in to access your dashboard" 
                      : "Create an account or register at CAN Nepal"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger 
                        value="login"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </TabsTrigger>
                      <TabsTrigger 
                        value="register"
                        className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register
                      </TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login" className="space-y-6">
                      {/* Login Type Selection */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setLoginType("committee")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            loginType === "committee" 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Users className={`w-8 h-8 mx-auto mb-2 ${
                            loginType === "committee" ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <span className={`font-medium block ${
                            loginType === "committee" ? "text-primary" : "text-foreground"
                          }`}>Committee</span>
                          <span className="text-xs text-muted-foreground">Full Access</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoginType("subcommittee")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            loginType === "subcommittee" 
                              ? "border-secondary bg-secondary/5" 
                              : "border-border hover:border-secondary/50"
                          }`}
                        >
                          <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                            loginType === "subcommittee" ? "text-secondary" : "text-muted-foreground"
                          }`} />
                          <span className={`font-medium block ${
                            loginType === "subcommittee" ? "text-secondary" : "text-foreground"
                          }`}>Subcommittee</span>
                          <span className="text-xs text-muted-foreground">Limited Access</span>
                        </button>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10"
                              value={credentials.email}
                              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={credentials.password}
                              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-border" />
                            <span className="text-muted-foreground">Remember me</span>
                          </label>
                          <a href="#" className="text-primary hover:underline">Forgot password?</a>
                        </div>

                        <Button 
                          type="submit" 
                          className={`w-full ${
                            loginType === "committee" 
                              ? "bg-primary hover:bg-primary/90" 
                              : "bg-secondary hover:bg-secondary/90"
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-can-white/30 border-t-can-white rounded-full animate-spin" />
                              Signing in...
                            </span>
                          ) : (
                            <>
                              <LogIn className="w-4 h-4 mr-2" />
                              Sign In as {loginType === "committee" ? "Committee" : "Subcommittee"}
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Register Tab */}
                    <TabsContent value="register" className="space-y-6">
                      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
                        <p className="text-sm text-foreground">
                          <strong>Note:</strong> Official CAN membership registration is done through the central CAN Nepal portal.
                        </p>
                      </div>

                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={credentials.fullName}
                            onChange={(e) => setCredentials({ ...credentials, fullName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="reg-email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10"
                              value={credentials.email}
                              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password">Create Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="reg-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              className="pl-10 pr-10"
                              value={credentials.password}
                              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            value={credentials.confirmPassword}
                            onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                            required
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-accent hover:bg-accent/90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-can-white/30 border-t-can-white rounded-full animate-spin" />
                              Processing...
                            </span>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Continue Registration
                            </>
                          )}
                        </Button>
                      </form>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Or register directly</span>
                        </div>
                      </div>

                      <a 
                        href="https://can.org.np/membership" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Register at CAN Nepal Official Portal
                        </Button>
                      </a>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Help Text */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Need help? Contact us at{" "}
                <a href="mailto:cankavre@gmail.com" className="text-primary hover:underline">
                  cankavre@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;