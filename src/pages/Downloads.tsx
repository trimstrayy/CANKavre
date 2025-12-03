import { Download, FileText, Image, File, FolderOpen, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DownloadItem {
  id: number;
  title: string;
  description: string;
  type: "pdf" | "image" | "document";
  size: string;
  date: string;
  category: string;
}

const generalDownloads: DownloadItem[] = [
  { id: 1, title: "CAN Kavre Constitution", description: "Official constitution document", type: "pdf", size: "2.4 MB", date: "2024-01-15", category: "Legal" },
  { id: 2, title: "Membership Form", description: "Application form for new members", type: "pdf", size: "156 KB", date: "2024-02-01", category: "Forms" },
  { id: 3, title: "Annual Report 2080", description: "Complete annual report", type: "pdf", size: "5.2 MB", date: "2024-03-15", category: "Reports" },
  { id: 4, title: "IT Club Guidelines", description: "Guidelines for school IT clubs", type: "pdf", size: "890 KB", date: "2024-02-20", category: "Guidelines" },
];

const reports = {
  secretary: [
    { id: 1, title: "Secretary Report - Fiscal Year 2080", author: "Secretary Office", date: "2024-03-01", type: "pdf" as const, size: "1.2 MB" },
    { id: 2, title: "Secretary Report - Fiscal Year 2079", author: "Secretary Office", date: "2023-03-01", type: "pdf" as const, size: "980 KB" },
  ],
  treasurer: [
    { id: 1, title: "Financial Statement 2080", author: "Treasurer Office", date: "2024-03-15", type: "pdf" as const, size: "2.1 MB" },
    { id: 2, title: "Audit Report 2079", author: "External Auditor", date: "2023-04-01", type: "pdf" as const, size: "1.5 MB" },
  ],
  coordinator: [
    { id: 1, title: "Program Coordinator Report 2080", author: "Program Coordinator", date: "2024-02-28", type: "pdf" as const, size: "1.8 MB" },
    { id: 2, title: "IT Club Coordinator Report", author: "IT Club Coordinator", date: "2024-01-15", type: "pdf" as const, size: "750 KB" },
  ],
  itclub: [
    { id: 1, title: "Dhulikhel School IT Club Report", author: "IT Club Coordinator", date: "2024-02-01", type: "pdf" as const, size: "650 KB" },
    { id: 2, title: "Banepa Campus IT Club Report", author: "IT Club Coordinator", date: "2024-02-15", type: "pdf" as const, size: "820 KB" },
  ],
};

const Downloads = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-5 h-5 text-primary" />;
      case "image": return <Image className="w-5 h-5 text-accent" />;
      default: return <File className="w-5 h-5 text-secondary" />;
    }
  };

  const DownloadCard = ({ item }: { item: DownloadItem }) => (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            {getTypeIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{item.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{item.size}</span>
              <span>•</span>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>
          <Button size="sm" className="bg-secondary hover:bg-secondary/90 shrink-0">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ReportCard = ({ item }: { item: typeof reports.secretary[0] }) => (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground">{item.title}</h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              {item.author}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{item.size}</span>
            </div>
          </div>
          <Button size="sm" className="bg-accent hover:bg-accent/90 shrink-0">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="text-primary">Downloads</span> & Resources
            </h1>
            <p className="text-lg text-muted-foreground">
              Access official documents, reports, forms, and other resources from CAN Kavre.
            </p>
          </div>
        </div>
      </section>

      {/* General Downloads */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <FolderOpen className="w-6 h-6 text-secondary" />
            General Downloads
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {generalDownloads.map((item, index) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <DownloadCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            Report Collection
          </h2>

          <Tabs defaultValue="secretary" className="w-full">
            <TabsList className="w-full max-w-2xl mb-8 grid grid-cols-2 md:grid-cols-4 h-auto bg-card shadow-card">
              <TabsTrigger value="secretary" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Secretary
              </TabsTrigger>
              <TabsTrigger value="treasurer" className="py-3 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                Treasurer
              </TabsTrigger>
              <TabsTrigger value="coordinator" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Coordinator
              </TabsTrigger>
              <TabsTrigger value="itclub" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                IT Club
              </TabsTrigger>
            </TabsList>

            <TabsContent value="secretary" className="space-y-4 animate-fade-in">
              {reports.secretary.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))}
            </TabsContent>

            <TabsContent value="treasurer" className="space-y-4 animate-fade-in">
              {reports.treasurer.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))}
            </TabsContent>

            <TabsContent value="coordinator" className="space-y-4 animate-fade-in">
              {reports.coordinator.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))}
            </TabsContent>

            <TabsContent value="itclub" className="space-y-4 animate-fade-in">
              {reports.itclub.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Downloads;
