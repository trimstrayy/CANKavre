import { useState } from "react";
import { Users, LogIn, UserPlus, Shield, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import EditButton from "@/components/EditButton";

const Membership = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"committee" | "subcommittee">("committee");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Attempt",
      description: "Backend authentication required. Please connect to Lovable Cloud.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Membership Hero" />
          </div>
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="text-accent">Membership</span> Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Login to access member features or register for CAN membership.
            </p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Membership Access" />
          </div>
          <div className="max-w-md mx-auto">
            <div className="mb-6 rounded-lg border border-dashed border-accent/40 bg-accent/5 p-4 text-sm text-muted-foreground text-center">
              Site content editing is open to everyone. Use the edit buttons shown on each section to make quick changes without logging in.
            </div>
            <Card className="shadow-card animate-fade-in-up">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5">
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <Shield className="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Member Login</CardTitle>
                <CardDescription>
                  Access your committee dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={loginType} onValueChange={(v) => setLoginType(v as typeof loginType)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="committee" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Committee
                    </TabsTrigger>
                    <TabsTrigger value="subcommittee" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                      Subcommittee
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="committee">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-committee">Email</Label>
                        <Input
                          id="email-committee"
                          type="email"
                          placeholder="your@email.com"
                          value={credentials.email}
                          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-committee">Password</Label>
                        <div className="relative">
                          <Input
                            id="password-committee"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login as Committee
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="subcommittee">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-sub">Email</Label>
                        <Input
                          id="email-sub"
                          type="email"
                          placeholder="your@email.com"
                          value={credentials.email}
                          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-sub">Password</Label>
                        <div className="relative">
                          <Input
                            id="password-sub"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login as Subcommittee
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Not a member yet?
                  </p>
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
                    <a href="https://canfederation.org/member_registration" target="_blank" rel="noopener noreferrer">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register at CAN Nepal
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Member Benefits */}
            <div className="mt-8 grid gap-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Committee Access</h4>
                    <p className="text-sm text-muted-foreground">Full admin rights to manage content</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Subcommittee Access</h4>
                    <p className="text-sm text-muted-foreground">Submit content for committee approval</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
