import { useMemo, useState } from "react";
import {
  Download,
  FileText,
  Image,
  File,
  FolderOpen,
  Calendar,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface DownloadItem {
  id: number;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  type: "pdf" | "image" | "document";
  size: string;
  date: string;
  category: string;
  categoryNe: string;
  downloadUrl: string;
}

interface ReportItem {
  id: number;
  title: string;
  titleNe: string;
  author: string;
  authorNe: string;
  date: string;
  type: "pdf" | "image" | "document";
  size: string;
  downloadUrl: string;
}

type ReportCategory = "secretary" | "treasurer" | "coordinator" | "itclub";
type ReportsState = Record<ReportCategory, ReportItem[]>;

const initialGeneralDownloads: DownloadItem[] = [
  {
    id: 1,
    title: "CAN Kavre Constitution",
    titleNe: "क्यान काभ्रे विधान",
    description: "Official constitution document",
    descriptionNe: "आधिकारिक विधान कागजात",
    type: "pdf",
    size: "2.4 MB",
    date: "2024-01-15",
    category: "Legal",
    categoryNe: "कानूनी",
    downloadUrl: "#",
  },
  {
    id: 2,
    title: "Membership Form",
    titleNe: "सदस्यता फारम",
    description: "Application form for new members",
    descriptionNe: "नयाँ सदस्यहरूको लागि आवेदन फारम",
    type: "pdf",
    size: "156 KB",
    date: "2024-02-01",
    category: "Forms",
    categoryNe: "फारमहरू",
    downloadUrl: "#",
  },
  {
    id: 3,
    title: "Annual Report 2080",
    titleNe: "वार्षिक प्रतिवेदन २०८०",
    description: "Complete annual report",
    descriptionNe: "पूर्ण वार्षिक प्रतिवेदन",
    type: "pdf",
    size: "5.2 MB",
    date: "2024-03-15",
    category: "Reports",
    categoryNe: "प्रतिवेदनहरू",
    downloadUrl: "#",
  },
  {
    id: 4,
    title: "IT Club Guidelines",
    titleNe: "आईटी क्लब निर्देशिका",
    description: "Guidelines for school IT clubs",
    descriptionNe: "विद्यालय आईटी क्लबहरूको लागि निर्देशिका",
    type: "pdf",
    size: "890 KB",
    date: "2024-02-20",
    category: "Guidelines",
    categoryNe: "निर्देशिकाहरू",
    downloadUrl: "#",
  },
];

const initialReports: ReportsState = {
  secretary: [
    { id: 1, title: "Secretary Report - Fiscal Year 2080", titleNe: "सचिव प्रतिवेदन - आर्थिक वर्ष २०८०", author: "Secretary Office", authorNe: "सचिव कार्यालय", date: "2024-03-01", type: "pdf", size: "1.2 MB", downloadUrl: "#" },
    { id: 2, title: "Secretary Report - Fiscal Year 2079", titleNe: "सचिव प्रतिवेदन - आर्थिक वर्ष २०७९", author: "Secretary Office", authorNe: "सचिव कार्यालय", date: "2023-03-01", type: "pdf", size: "980 KB", downloadUrl: "#" },
  ],
  treasurer: [
    { id: 1, title: "Financial Statement 2080", titleNe: "वित्तीय विवरण २०८०", author: "Treasurer Office", authorNe: "कोषाध्यक्ष कार्यालय", date: "2024-03-15", type: "pdf", size: "2.1 MB", downloadUrl: "#" },
    { id: 2, title: "Audit Report 2079", titleNe: "लेखा परीक्षण प्रतिवेदन २०७९", author: "External Auditor", authorNe: "बाह्य लेखा परीक्षक", date: "2023-04-01", type: "pdf", size: "1.5 MB", downloadUrl: "#" },
  ],
  coordinator: [
    { id: 1, title: "Program Coordinator Report 2080", titleNe: "कार्यक्रम संयोजक प्रतिवेदन २०८०", author: "Program Coordinator", authorNe: "कार्यक्रम संयोजक", date: "2024-02-28", type: "pdf", size: "1.8 MB", downloadUrl: "#" },
    { id: 2, title: "IT Club Coordinator Report", titleNe: "आईटी क्लब संयोजक प्रतिवेदन", author: "IT Club Coordinator", authorNe: "आईटी क्लब संयोजक", date: "2024-01-15", type: "pdf", size: "750 KB", downloadUrl: "#" },
  ],
  itclub: [
    { id: 1, title: "Dhulikhel School IT Club Report", titleNe: "धुलिखेल विद्यालय आईटी क्लब प्रतिवेदन", author: "IT Club Coordinator", authorNe: "आईटी क्लब संयोजक", date: "2024-02-01", type: "pdf", size: "650 KB", downloadUrl: "#" },
    { id: 2, title: "Banepa Campus IT Club Report", titleNe: "बनेपा क्याम्पस आईटी क्लब प्रतिवेदन", author: "IT Club Coordinator", authorNe: "आईटी क्लब संयोजक", date: "2024-02-15", type: "pdf", size: "820 KB", downloadUrl: "#" },
  ],
};

const Downloads = () => {
  const { t, isNepali } = useLanguage();
  const [generalDownloads] = useState<DownloadItem[]>(initialGeneralDownloads);
  const [reports] = useState<ReportsState>(initialReports);

  const formatDisplayDate = (value: string) => {
    if (!value) return isNepali ? "मिति निर्धारित छैन" : "Date not set";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString(isNepali ? "ne-NP" : "en-US");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-primary" />;
      case "image":
        return <Image className="h-5 w-5 text-accent" />;
      default:
        return <File className="h-5 w-5 text-secondary" />;
    }
  };

  const DownloadCard = ({ item }: { item: DownloadItem }) => (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
            {getTypeIcon(item.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold text-foreground">{isNepali ? item.titleNe : item.title}</h4>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {isNepali ? item.descriptionNe : item.description}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              {item.size ? <span>{item.size}</span> : null}
              {item.size ? <span>•</span> : null}
              <span>{formatDisplayDate(item.date)}</span>
            </div>
            {item.category ? (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2 py-1 text-xs text-secondary">
                <FolderOpen className="h-3.5 w-3.5" />
                {isNepali ? item.categoryNe : item.category}
              </div>
            ) : null}
          </div>
          <Button size="sm" className="shrink-0 bg-secondary hover:bg-secondary/90" asChild>
            <a href={item.downloadUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ReportCard = ({ item }: { item: ReportItem }) => (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-foreground">{isNepali ? item.titleNe : item.title}</h4>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              {isNepali ? item.authorNe : item.author}
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDisplayDate(item.date)}</span>
              <span>•</span>
              <span>{item.size}</span>
            </div>
          </div>
          <Button size="sm" className="shrink-0 bg-accent hover:bg-accent/90" asChild>
            <a href={item.downloadUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="text-secondary">{t("downloadsTitle")}</span> {isNepali ? "र स्रोतहरू" : "& Resources"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("downloadsSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* General Downloads */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <FolderOpen className="w-6 h-6 text-secondary" />
            {t("generalResources")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {generalDownloads.map((item) => (
              <DownloadCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            {t("reportCollection")}
          </h2>
          <Tabs defaultValue="secretary" className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 h-auto bg-card shadow-card">
              <TabsTrigger value="secretary" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("secretaryReports")}
              </TabsTrigger>
              <TabsTrigger value="treasurer" className="py-3 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                {t("treasurerReports")}
              </TabsTrigger>
              <TabsTrigger value="coordinator" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                {t("coordinatorReports")}
              </TabsTrigger>
              <TabsTrigger value="itclub" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("itClubReports")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="secretary" className="space-y-4">
              {reports.secretary.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))}
            </TabsContent>

            <TabsContent value="treasurer" className="space-y-4">
              {reports.treasurer.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))}
            </TabsContent>

            <TabsContent value="coordinator" className="space-y-4">
              {reports.coordinator.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))}
            </TabsContent>

            <TabsContent value="itclub" className="space-y-4">
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
