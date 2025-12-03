import { useState } from "react";
import { 
  Users, 
  Calendar, 
  FileText, 
  Image, 
  Download, 
  Bell,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface PendingItem {
  id: number;
  title: string;
  type: string;
  author: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const pendingApprovals: PendingItem[] = [
  { id: 1, title: "New Event: Digital Workshop", type: "Event", author: "Health Subcommittee", date: "2024-05-20", status: "pending" },
  { id: 2, title: "Press Release: ICT Day", type: "Press Release", author: "Education Subcommittee", date: "2024-05-18", status: "pending" },
  { id: 3, title: "Notice: Membership Deadline", type: "Notice", author: "Women IT Subcommittee", date: "2024-05-15", status: "pending" },
];

const adminSections = [
  { id: "committees", title: "Committees", icon: Users, color: "primary", count: 8 },
  { id: "subcommittees", title: "Subcommittees", icon: Users, color: "secondary", count: 4 },
  { id: "events", title: "Events", icon: Calendar, color: "accent", count: 12 },
  { id: "news", title: "News/Press", icon: FileText, color: "primary", count: 24 },
  { id: "gallery", title: "Gallery", icon: Image, color: "secondary", count: 86 },
  { id: "downloads", title: "Downloads", icon: Download, color: "accent", count: 15 },
  { id: "notices", title: "Notices", icon: Bell, color: "primary", count: 8 },
];

const Admin = () => {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState(pendingApprovals);

  const handleApprove = (id: number) => {
    setApprovals(approvals.map(item => 
      item.id === id ? { ...item, status: "approved" as const } : item
    ));
    toast({
      title: "Approved",
      description: "The content has been approved and published.",
    });
  };

  const handleReject = (id: number) => {
    setApprovals(approvals.map(item => 
      item.id === id ? { ...item, status: "rejected" as const } : item
    ));
    toast({
      title: "Rejected",
      description: "The content has been rejected.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5">
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Committee Management Portal</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-heading font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Pending Approvals</div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-heading font-bold text-secondary">12</div>
                <div className="text-sm text-muted-foreground">Active Events</div>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-heading font-bold text-accent">500+</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-heading font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">IT Clubs</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="approvals" className="w-full">
            <TabsList className="w-full max-w-xl mb-8 grid grid-cols-3 h-auto bg-card shadow-card">
              <TabsTrigger value="approvals" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="manage" className="py-3 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                Manage Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Pending Approvals */}
            <TabsContent value="approvals" className="animate-fade-in">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                Pending Approvals from Subcommittees
              </h3>
              <div className="space-y-4">
                {approvals.map((item) => (
                  <Card key={item.id} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Badge variant="outline">{item.type}</Badge>
                              <span>by {item.author}</span>
                              <span>• {new Date(item.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {item.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="bg-accent hover:bg-accent/90"
                              onClick={() => handleApprove(item.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                              onClick={() => handleReject(item.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Badge className={item.status === "approved" ? "bg-accent" : "bg-primary"}>
                            {item.status}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Manage Content */}
            <TabsContent value="manage" className="animate-fade-in">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                Content Management
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {adminSections.map((section) => (
                  <Card key={section.id} className="card-hover cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-${section.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <section.icon className={`w-6 h-6 text-${section.color}`} />
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{section.title}</h4>
                      <p className="text-sm text-muted-foreground">{section.count} items</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="animate-fade-in">
              <div className="max-w-2xl">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                  Admin Settings
                </h3>
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your admin account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Backend functionality requires Lovable Cloud connection. 
                        Connect to enable full admin features including:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>• User authentication & roles</li>
                        <li>• Content management database</li>
                        <li>• File storage for downloads</li>
                        <li>• Real-time notifications</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Admin;
