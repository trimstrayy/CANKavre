import { useEffect, useMemo, useState } from "react";
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
import EditButton from "@/components/EditButton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPrograms, getRegistrations, Program } from "@/lib/api";
import { useAdmin } from "@/hooks/useAdmin";

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
  const { token, isAdmin } = useAdmin();
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<Array<{
    id: number;
    programId: number;
    name: string;
    email: string;
    location: string;
    registrationCode: string;
    isAttended: number;
    attendanceStatus?: string;
    attendedAt?: string;
    createdAt?: string;
  }>>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setIsLoadingPrograms(true);
    getPrograms()
      .then(({ programs }) => {
        setPrograms(programs);
        if (!selectedProgramId && programs.length > 0) {
          setSelectedProgramId(programs[0].id);
        }
      })
      .catch((err: { error?: string }) => {
        toast({
          title: "Error",
          description: err?.error || "Failed to load programs.",
          variant: "destructive",
        });
      })
      .finally(() => setIsLoadingPrograms(false));
  }, [selectedProgramId, toast]);

  useEffect(() => {
    if (!token || !selectedProgramId) return;
    setIsLoadingRegistrations(true);
    getRegistrations(token, selectedProgramId)
      .then(({ registrations }) => setRegistrations(registrations))
      .catch((err: { error?: string }) => {
        toast({
          title: "Error",
          description: err?.error || "Failed to load registrations.",
          variant: "destructive",
        });
      })
      .finally(() => setIsLoadingRegistrations(false));
  }, [token, selectedProgramId, toast]);

  const filteredRegistrations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = registrations.filter((row) => {
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.registrationCode.toLowerCase().includes(q) ||
        (row.location || "").toLowerCase().includes(q)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "createdAt") {
        const av = new Date(a.createdAt || "").getTime();
        const bv = new Date(b.createdAt || "").getTime();
        return (av - bv) * dir;
      }
      return a[sortBy].localeCompare(b[sortBy]) * dir;
    });

    return sorted;
  }, [registrations, searchTerm, sortBy, sortDir]);

  const attendanceSummary = useMemo(() => {
    const total = registrations.length;
    const present = registrations.filter((row) => row.isAttended).length;
    const absent = total - present;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, attendanceRate };
  }, [registrations]);

  const exportCsv = () => {
    const headers = ["Name", "Email", "Location", "Registration Code", "Status", "Attended At", "Registered At"];
    const rows = filteredRegistrations.map((row) => [
      row.name,
      row.email,
      row.location || "",
      row.registrationCode,
      row.attendanceStatus || (row.isAttended ? "Present" : "Absent"),
      row.attendedAt || "",
      row.createdAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `program-registrations-${selectedProgramId || "all"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Access Required</CardTitle>
              <CardDescription>Sign in with a committee account to view the admin dashboard.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Admin Hero" />
          </div>
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
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Admin Dashboard" />
          </div>
          <Tabs defaultValue="approvals" className="w-full">
            <TabsList className="w-full max-w-3xl mb-8 grid grid-cols-4 h-auto bg-card shadow-card">
              <TabsTrigger value="approvals" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="manage" className="py-3 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                Manage Content
              </TabsTrigger>
              <TabsTrigger value="registrations" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Attendance Report
              </TabsTrigger>
              <TabsTrigger value="settings" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Pending Approvals */}
            <TabsContent value="approvals" className="animate-fade-in">
              <div className="mb-4 flex justify-end">
                <EditButton label="Edit Pending Approvals" />
              </div>
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
              <div className="mb-4 flex justify-end">
                <EditButton label="Edit Content Management" />
              </div>
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
            <TabsContent value="registrations" className="animate-fade-in">
              <div className="mb-4 flex justify-end">
                <Button onClick={exportCsv} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Ledger</CardTitle>
                  <CardDescription>
                      Every registration is stored in the database. Scanned QR codes become Present; unscanned registrations remain Absent.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-primary">{attendanceSummary.total}</div>
                          <div className="text-sm text-muted-foreground">Registered</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-700">{attendanceSummary.present}</div>
                          <div className="text-sm text-muted-foreground">Present</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-amber-700">{attendanceSummary.absent}</div>
                          <div className="text-sm text-muted-foreground">Absent</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-accent/5 border-accent/20">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-accent">{attendanceSummary.attendanceRate}%</div>
                          <div className="text-sm text-muted-foreground">Attendance Rate</div>
                        </CardContent>
                      </Card>
                    </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-sm font-medium">Program</p>
                      <select
                        value={selectedProgramId ?? ""}
                        onChange={(e) => setSelectedProgramId(Number(e.target.value))}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        disabled={isLoadingPrograms || programs.length === 0}
                      >
                        {programs.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">Search</p>
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search name, email, code, location"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">Sort</p>
                      <div className="flex gap-2">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as "name" | "email" | "createdAt")}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="createdAt">Registered Time</option>
                          <option value="name">Name</option>
                          <option value="email">Email</option>
                        </select>
                        <Button type="button" variant="outline" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
                          {sortDir === "asc" ? "Asc" : "Desc"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border bg-background">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Registration Code</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Attended At</TableHead>
                          <TableHead>Registered At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingRegistrations ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">Loading registrations...</TableCell>
                          </TableRow>
                        ) : filteredRegistrations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">No registrations found.</TableCell>
                          </TableRow>
                        ) : (
                          filteredRegistrations.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="font-medium">{row.name}</TableCell>
                              <TableCell>{row.email}</TableCell>
                              <TableCell>{row.location || "-"}</TableCell>
                              <TableCell>{row.registrationCode}</TableCell>
                              <TableCell>
                                <Badge variant={row.isAttended ? "default" : "secondary"} className={row.isAttended ? "bg-green-600" : ""}>
                                  {row.attendanceStatus || (row.isAttended ? "Present" : "Absent")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {row.attendedAt ? new Date(row.attendedAt).toLocaleString() : "-"}
                              </TableCell>
                              <TableCell>
                                {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="animate-fade-in">
              <div className="mb-4 flex justify-end">
                <EditButton label="Edit Admin Settings" />
              </div>
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
