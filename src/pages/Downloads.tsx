import { ChangeEvent, useMemo, useRef, useState } from "react";
import {
  Download,
  FileText,
  Image,
  File,
  FolderOpen,
  Calendar,
  User,
  Edit,
  Upload,
  Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditButton from "@/components/EditButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchEntry, useRegisterSearchSource } from "@/contexts/SearchContext";

interface DownloadItem {
  id: number;
  title: string;
  description: string;
  type: "pdf" | "image" | "document";
  size: string;
  date: string;
  category: string;
  downloadUrl: string;
}

interface ReportItem {
  id: number;
  title: string;
  author: string;
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
    description: "Official constitution document",
    type: "pdf",
    size: "2.4 MB",
    date: "2024-01-15",
    category: "Legal",
    downloadUrl: "https://example.com/can-kavre-constitution.pdf",
  },
  {
    id: 2,
    title: "Membership Form",
    description: "Application form for new members",
    type: "pdf",
    size: "156 KB",
    date: "2024-02-01",
    category: "Forms",
    downloadUrl: "https://example.com/membership-form.pdf",
  },
  {
    id: 3,
    title: "Annual Report 2080",
    description: "Complete annual report",
    type: "pdf",
    size: "5.2 MB",
    date: "2024-03-15",
    category: "Reports",
    downloadUrl: "https://example.com/annual-report-2080.pdf",
  },
  {
    id: 4,
    title: "IT Club Guidelines",
    description: "Guidelines for school IT clubs",
    type: "pdf",
    size: "890 KB",
    date: "2024-02-20",
    category: "Guidelines",
    downloadUrl: "https://example.com/it-club-guidelines.pdf",
  },
];

const initialReports: ReportsState = {
  secretary: [
    {
      id: 1,
      title: "Secretary Report - Fiscal Year 2080",
      author: "Secretary Office",
      date: "2024-03-01",
      type: "pdf",
      size: "1.2 MB",
      downloadUrl: "https://example.com/secretary-report-2080.pdf",
    },
    {
      id: 2,
      title: "Secretary Report - Fiscal Year 2079",
      author: "Secretary Office",
      date: "2023-03-01",
      type: "pdf",
      size: "980 KB",
      downloadUrl: "https://example.com/secretary-report-2079.pdf",
    },
  ],
  treasurer: [
    {
      id: 1,
      title: "Financial Statement 2080",
      author: "Treasurer Office",
      date: "2024-03-15",
      type: "pdf",
      size: "2.1 MB",
      downloadUrl: "https://example.com/financial-statement-2080.pdf",
    },
    {
      id: 2,
      title: "Audit Report 2079",
      author: "External Auditor",
      date: "2023-04-01",
      type: "pdf",
      size: "1.5 MB",
      downloadUrl: "https://example.com/audit-report-2079.pdf",
    },
  ],
  coordinator: [
    {
      id: 1,
      title: "Program Coordinator Report 2080",
      author: "Program Coordinator",
      date: "2024-02-28",
      type: "pdf",
      size: "1.8 MB",
      downloadUrl: "https://example.com/program-coordinator-report-2080.pdf",
    },
    {
      id: 2,
      title: "IT Club Coordinator Report",
      author: "IT Club Coordinator",
      date: "2024-01-15",
      type: "pdf",
      size: "750 KB",
      downloadUrl: "https://example.com/it-club-coordinator-report.pdf",
    },
  ],
  itclub: [
    {
      id: 1,
      title: "Dhulikhel School IT Club Report",
      author: "IT Club Coordinator",
      date: "2024-02-01",
      type: "pdf",
      size: "650 KB",
      downloadUrl: "https://example.com/dhulikhel-it-club-report.pdf",
    },
    {
      id: 2,
      title: "Banepa Campus IT Club Report",
      author: "IT Club Coordinator",
      date: "2024-02-15",
      type: "pdf",
      size: "820 KB",
      downloadUrl: "https://example.com/banepa-it-club-report.pdf",
    },
  ],
};

const reportCategories: ReportCategory[] = ["secretary", "treasurer", "coordinator", "itclub"];
const reportLabels: Record<ReportCategory, string> = {
  secretary: "Secretary",
  treasurer: "Treasurer",
  coordinator: "Coordinator",
  itclub: "IT Club",
};

const typeOptions: Array<{ value: DownloadItem["type"]; label: string }> = [
  { value: "pdf", label: "PDF" },
  { value: "image", label: "Image" },
  { value: "document", label: "Document" },
];

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const formatDisplayDate = (value: string) => {
  if (!value) return "Date not set";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
};

const releaseDownloadUrl = (url?: string) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const cleanupRemovedBlobs = (oldItems: { downloadUrl: string }[], newItems: { downloadUrl: string }[]) => {
  const retained = new Set(newItems.map((item) => item.downloadUrl));
  oldItems.forEach((item) => {
    if (!retained.has(item.downloadUrl)) {
      releaseDownloadUrl(item.downloadUrl);
    }
  });
};

type FileTarget =
  | { section: "general"; index: number }
  | { section: "reports"; category: ReportCategory; index: number };

const Downloads = () => {
  const [heroDialogOpen, setHeroDialogOpen] = useState(false);
  const [generalDialogOpen, setGeneralDialogOpen] = useState(false);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [heroContent, setHeroContent] = useState({
    highlight: "Downloads",
    headingSuffix: "& Resources",
    subtitle: "Access official documents, reports, forms, and other resources from CAN Kavre.",
  });
  const [heroDraft, setHeroDraft] = useState(heroContent);
  const [generalDownloads, setGeneralDownloads] = useState<DownloadItem[]>(initialGeneralDownloads);
  const [reports, setReports] = useState<ReportsState>(initialReports);
  const [generalDraft, setGeneralDraft] = useState<DownloadItem[]>(generalDownloads);
  const [reportsDraft, setReportsDraft] = useState<ReportsState>(reports);
  const [activeReportTab, setActiveReportTab] = useState<ReportCategory>("secretary");
  const [fileTarget, setFileTarget] = useState<FileTarget | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useRegisterSearchSource(
    "downloads",
    () => {
      const entries: SearchEntry[] = [];

      entries.push({
        id: "downloads-hero",
        route: "/downloads",
        title: `${heroContent.highlight} ${heroContent.headingSuffix}`.trim(),
        description: heroContent.subtitle,
        content: heroContent.subtitle,
        tags: ["Downloads", "Hero"],
      });

      generalDownloads.forEach((item, index) => {
        entries.push({
          id: `download-general-${item.id ?? index}`,
          route: "/downloads",
          title: item.title || "Untitled document",
          description: item.description,
          content: `${item.description} ${item.category} ${item.size} ${item.date}`,
          tags: ["Downloads", item.category],
        });
      });

      (Object.entries(reports) as Array<[ReportCategory, ReportItem[]]>).forEach(([category, items]) => {
        items.forEach((item, index) => {
          entries.push({
            id: `download-report-${category}-${item.id ?? index}`,
            route: "/downloads",
            title: item.title,
            description: `${item.author} • ${item.size}`,
            content: `${item.title} ${item.author} ${item.date} ${item.size}`,
            tags: ["Reports", reportLabels[category], item.type],
          });
        });
      });

      return entries;
    },
    [heroContent, generalDownloads, reports]
  );

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

  const triggerFileSelection = (target: FileTarget) => {
    setFileTarget(target);
    fileInputRef.current?.click();
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !fileTarget) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const size = formatBytes(file.size) || `${Math.round(file.size / 1024)} KB`;
    const isPdf = file.type.includes("pdf");
    const guessedType: DownloadItem["type"] = isPdf ? "pdf" : file.type.startsWith("image") ? "image" : "document";
    const suggestedTitle = file.name.replace(/\.[^/.]+$/, "");

    if (fileTarget.section === "general") {
      setGeneralDraft((prev) =>
        prev.map((item, index) => {
          if (index !== fileTarget.index) return item;
          releaseDownloadUrl(item.downloadUrl);
          return {
            ...item,
            title: item.title || suggestedTitle,
            downloadUrl: objectUrl,
            size: size || item.size,
            type: guessedType,
            date: item.date || new Date().toISOString().slice(0, 10),
          };
        })
      );
    } else {
      setReportsDraft((prev) => {
        const categoryItems = prev[fileTarget.category];
        const updated = categoryItems.map((item, index) => {
          if (index !== fileTarget.index) return item;
          releaseDownloadUrl(item.downloadUrl);
          return {
            ...item,
            title: item.title || suggestedTitle,
            downloadUrl: objectUrl,
            size: size || item.size,
            type: guessedType,
            date: item.date || new Date().toISOString().slice(0, 10),
          };
        });
        return { ...prev, [fileTarget.category]: updated };
      });
    }

    setFileTarget(null);
  };

  const addGeneralDownload = () => {
    setGeneralDraft((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        description: "",
        type: "pdf",
        size: "",
        date: "",
        category: "General",
        downloadUrl: "",
      },
    ]);
  };

  const removeGeneralDownload = (index: number) => {
    setGeneralDraft((prev) => {
      const target = prev[index];
      releaseDownloadUrl(target?.downloadUrl);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const addReportItem = (category: ReportCategory) => {
    setReportsDraft((prev) => ({
      ...prev,
      [category]: [
        ...prev[category],
        {
          id: Date.now(),
          title: "",
          author: "",
          date: "",
          type: "pdf",
          size: "",
          downloadUrl: "",
        },
      ],
    }));
  };

  const removeReportItem = (category: ReportCategory, index: number) => {
    setReportsDraft((prev) => {
      const target = prev[category][index];
      releaseDownloadUrl(target?.downloadUrl);
      return {
        ...prev,
        [category]: prev[category].filter((_, idx) => idx !== index),
      };
    });
  };

  const generalCategories = useMemo(() => {
    const distinct = new Set<string>();
    generalDownloads.forEach((item) => {
      if (item.category) distinct.add(item.category);
    });
    generalDraft.forEach((item) => {
      if (item.category) distinct.add(item.category);
    });
    return Array.from(distinct.values());
  }, [generalDownloads, generalDraft]);

  const DownloadCard = ({ item }: { item: DownloadItem }) => (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
            {getTypeIcon(item.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold text-foreground">{item.title || "Untitled file"}</h4>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {item.description || "No description provided."}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              {item.size ? <span>{item.size}</span> : null}
              {item.size ? <span>•</span> : null}
              <span>{formatDisplayDate(item.date)}</span>
            </div>
            {item.category ? (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2 py-1 text-xs text-secondary">
                <FolderOpen className="h-3.5 w-3.5" />
                {item.category}
              </div>
            ) : null}
          </div>
          {item.downloadUrl ? (
            <Button size="sm" className="shrink-0 bg-secondary hover:bg-secondary/90" asChild>
              <a href={item.downloadUrl} download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button size="sm" className="shrink-0 bg-secondary/40" disabled>
              <Download className="h-4 w-4" />
            </Button>
          )}
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
            <h4 className="font-semibold text-foreground">{item.title || "Untitled report"}</h4>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              {item.author || "Author not set"}
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDisplayDate(item.date)}</span>
              <span>•</span>
              <span>{item.size || "Size not set"}</span>
            </div>
          </div>
          {item.downloadUrl ? (
            <Button size="sm" className="shrink-0 bg-accent hover:bg-accent/90" asChild>
              <a href={item.downloadUrl} download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button size="sm" className="shrink-0 bg-accent/40" disabled>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton
              label="Edit Downloads Hero"
              onClick={() => {
                setHeroDraft(heroContent);
                setHeroDialogOpen(true);
              }}
            />
          </div>
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              <span className="text-primary">{heroContent.highlight}</span> {heroContent.headingSuffix}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">{heroContent.subtitle}</p>
          </div>
        </div>
      </section>

      {/* General Downloads */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton
              label="Edit General Downloads"
              onClick={() => {
                setGeneralDraft(generalDownloads.map((item) => ({ ...item })));
                setGeneralDialogOpen(true);
              }}
            />
          </div>
          <div className="mb-6 flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-secondary" />
            <h2 className="font-heading text-2xl font-bold text-foreground">General Downloads</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {generalDownloads.map((item, index) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <DownloadCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton
              label="Edit Reports"
              onClick={() => {
                setReportsDraft({
                  secretary: reports.secretary.map((item) => ({ ...item })),
                  treasurer: reports.treasurer.map((item) => ({ ...item })),
                  coordinator: reports.coordinator.map((item) => ({ ...item })),
                  itclub: reports.itclub.map((item) => ({ ...item })),
                });
                setActiveReportTab("secretary");
                setReportsDialogOpen(true);
              }}
            />
          </div>
          <div className="mb-8 flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-2xl font-bold text-foreground">Report Collection</h2>
          </div>

          <Tabs value={activeReportTab} onValueChange={(value) => setActiveReportTab(value as ReportCategory)} className="w-full">
            <TabsList className="mb-8 grid w-full max-w-2xl grid-cols-2 bg-card shadow-card md:grid-cols-4">
              {reportCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {reportLabels[category]}
                </TabsTrigger>
              ))}
            </TabsList>

            {reportCategories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-4 animate-fade-in">
                {reports[category].map((item) => (
                  <ReportCard key={item.id} item={item} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelection} />

      <Dialog open={heroDialogOpen} onOpenChange={(open) => !open && setHeroDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hero Content</DialogTitle>
            <DialogDescription>Update the title and message displayed on the downloads hero section.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-highlight">Highlighted word</Label>
              <Input
                id="hero-highlight"
                value={heroDraft.highlight}
                onChange={(event) => setHeroDraft((prev) => ({ ...prev, highlight: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-heading">Heading suffix</Label>
              <Input
                id="hero-heading"
                value={heroDraft.headingSuffix}
                onChange={(event) => setHeroDraft((prev) => ({ ...prev, headingSuffix: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                rows={3}
                value={heroDraft.subtitle}
                onChange={(event) => setHeroDraft((prev) => ({ ...prev, subtitle: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHeroDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setHeroContent({
                  highlight: heroDraft.highlight.trim() || "Downloads",
                  headingSuffix: heroDraft.headingSuffix.trim() || "& Resources",
                  subtitle: heroDraft.subtitle.trim() || heroContent.subtitle,
                });
                setHeroDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={generalDialogOpen} onOpenChange={(open) => !open && setGeneralDialogOpen(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit General Downloads</DialogTitle>
            <DialogDescription>Manage the documents, descriptions, and file references listed under general downloads.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-1">
            {generalDraft.map((item, index) => (
              <div key={item.id} className="space-y-4 rounded-lg border border-border p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`download-title-${item.id}`}>Title</Label>
                    <Input
                      id={`download-title-${item.id}`}
                      value={item.title}
                      onChange={(event) =>
                        setGeneralDraft((prev) =>
                          prev.map((entry, idx) => (idx === index ? { ...entry, title: event.target.value } : entry))
                        )
                      }
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => triggerFileSelection({ section: "general", index })}
                  >
                    <Upload className="h-4 w-4" /> Upload File
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`download-description-${item.id}`}>Description</Label>
                  <Textarea
                    id={`download-description-${item.id}`}
                    rows={3}
                    value={item.description}
                    onChange={(event) =>
                      setGeneralDraft((prev) =>
                        prev.map((entry, idx) => (idx === index ? { ...entry, description: event.target.value } : entry))
                      )
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`download-type-${item.id}`}>Type</Label>
                    <Select
                      value={item.type}
                      onValueChange={(value: DownloadItem["type"]) =>
                        setGeneralDraft((prev) =>
                          prev.map((entry, idx) => (idx === index ? { ...entry, type: value } : entry))
                        )
                      }
                    >
                      <SelectTrigger id={`download-type-${item.id}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`download-size-${item.id}`}>File size</Label>
                    <Input
                      id={`download-size-${item.id}`}
                      value={item.size}
                      onChange={(event) =>
                        setGeneralDraft((prev) =>
                          prev.map((entry, idx) => (idx === index ? { ...entry, size: event.target.value } : entry))
                        )
                      }
                      placeholder="e.g. 2.4 MB"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`download-date-${item.id}`}>Publish date</Label>
                    <Input
                      id={`download-date-${item.id}`}
                      type="date"
                      value={item.date}
                      onChange={(event) =>
                        setGeneralDraft((prev) =>
                          prev.map((entry, idx) => (idx === index ? { ...entry, date: event.target.value } : entry))
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`download-category-${item.id}`}>Category</Label>
                    <Input
                      id={`download-category-${item.id}`}
                      value={item.category}
                      onChange={(event) =>
                        setGeneralDraft((prev) =>
                          prev.map((entry, idx) => (idx === index ? { ...entry, category: event.target.value } : entry))
                        )
                      }
                      placeholder={generalCategories[0] ?? "General"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`download-url-${item.id}`}>Download link</Label>
                  <Input
                    id={`download-url-${item.id}`}
                    value={item.downloadUrl}
                    onChange={(event) =>
                      setGeneralDraft((prev) =>
                        prev.map((entry, idx) => (idx === index ? { ...entry, downloadUrl: event.target.value } : entry))
                      )
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive"
                    onClick={() => removeGeneralDownload(index)}
                    disabled={generalDraft.length <= 1}
                  >
                    <Trash className="h-4 w-4" /> Remove document
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addGeneralDownload} className="gap-2">
              <Edit className="h-4 w-4" /> Add Document
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGeneralDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const cleaned = generalDraft
                  .map((item) => ({
                    ...item,
                    title: item.title.trim(),
                    description: item.description.trim(),
                    category: item.category.trim(),
                    size: item.size.trim(),
                    downloadUrl: item.downloadUrl.trim(),
                    date: item.date,
                  }))
                  .filter((item) => item.title || item.downloadUrl);

                cleanupRemovedBlobs(generalDownloads, cleaned);
                setGeneralDownloads(cleaned);
                setGeneralDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reportsDialogOpen} onOpenChange={(open) => !open && setReportsDialogOpen(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Reports</DialogTitle>
            <DialogDescription>Update report details, authors, and file attachments for each committee.</DialogDescription>
          </DialogHeader>
          <Tabs value={activeReportTab} onValueChange={(value) => setActiveReportTab(value as ReportCategory)}>
            <TabsList className="mb-4 grid w-full grid-cols-2 bg-card shadow-card md:grid-cols-4">
              {reportCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {reportLabels[category]}
                </TabsTrigger>
              ))}
            </TabsList>
            {reportCategories.map((category) => (
              <TabsContent key={category} value={category} className="max-h-[55vh] space-y-6 overflow-y-auto pr-1">
                {reportsDraft[category].map((item, index) => (
                  <div key={item.id} className="space-y-4 rounded-lg border border-border p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                      <div className="space-y-2">
                        <Label htmlFor={`report-title-${category}-${item.id}`}>Title</Label>
                        <Input
                          id={`report-title-${category}-${item.id}`}
                          value={item.title}
                          onChange={(event) =>
                            setReportsDraft((prev) => ({
                              ...prev,
                              [category]: prev[category].map((entry, idx) =>
                                idx === index ? { ...entry, title: event.target.value } : entry
                              ),
                            }))
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => triggerFileSelection({ section: "reports", category, index })}
                      >
                        <Upload className="h-4 w-4" /> Upload File
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`report-author-${category}-${item.id}`}>Author</Label>
                        <Input
                          id={`report-author-${category}-${item.id}`}
                          value={item.author}
                          onChange={(event) =>
                            setReportsDraft((prev) => ({
                              ...prev,
                              [category]: prev[category].map((entry, idx) =>
                                idx === index ? { ...entry, author: event.target.value } : entry
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`report-date-${category}-${item.id}`}>Date</Label>
                        <Input
                          id={`report-date-${category}-${item.id}`}
                          type="date"
                          value={item.date}
                          onChange={(event) =>
                            setReportsDraft((prev) => ({
                              ...prev,
                              [category]: prev[category].map((entry, idx) =>
                                idx === index ? { ...entry, date: event.target.value } : entry
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`report-type-${category}-${item.id}`}>Type</Label>
                        <Select
                          value={item.type}
                          onValueChange={(value: ReportItem["type"]) =>
                            setReportsDraft((prev) => ({
                              ...prev,
                              [category]: prev[category].map((entry, idx) =>
                                idx === index ? { ...entry, type: value } : entry
                              ),
                            }))
                          }
                        >
                          <SelectTrigger id={`report-type-${category}-${item.id}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`report-size-${category}-${item.id}`}>File size</Label>
                        <Input
                          id={`report-size-${category}-${item.id}`}
                          value={item.size}
                          onChange={(event) =>
                            setReportsDraft((prev) => ({
                              ...prev,
                              [category]: prev[category].map((entry, idx) =>
                                idx === index ? { ...entry, size: event.target.value } : entry
                              ),
                            }))
                          }
                          placeholder="e.g. 2.1 MB"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`report-url-${category}-${item.id}`}>Download link</Label>
                      <Input
                        id={`report-url-${category}-${item.id}`}
                        value={item.downloadUrl}
                        onChange={(event) =>
                          setReportsDraft((prev) => ({
                            ...prev,
                            [category]: prev[category].map((entry, idx) =>
                              idx === index ? { ...entry, downloadUrl: event.target.value } : entry
                            ),
                          }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive"
                        onClick={() => removeReportItem(category, index)}
                        disabled={reportsDraft[category].length <= 1}
                      >
                        <Trash className="h-4 w-4" /> Remove report
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addReportItem(category)} className="gap-2">
                  <Edit className="h-4 w-4" /> Add Report
                </Button>
              </TabsContent>
            ))}
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const cleaned: ReportsState = reportCategories.reduce((acc, category) => {
                  const cleanedItems = reportsDraft[category]
                    .map((item) => ({
                      ...item,
                      title: item.title.trim(),
                      author: item.author.trim(),
                      size: item.size.trim(),
                      downloadUrl: item.downloadUrl.trim(),
                      date: item.date,
                    }))
                    .filter((item) => item.title || item.downloadUrl);

                  cleanupRemovedBlobs(reports[category], cleanedItems);
                  return { ...acc, [category]: cleanedItems };
                }, {} as ReportsState);

                setReports(cleaned);
                setReportsDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Downloads;
