import { useState } from "react";
import { Bell, Calendar, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "@/components/ui/button";
import { SearchEntry, useRegisterSearchSource } from "@/contexts/SearchContext";

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  type: "announcement" | "deadline" | "info";
}

interface HeroContent {
  title: string;
  highlight: string;
  description: string;
}

interface NoticeSectionSettings {
  heading: string;
  intro: string;
}

const initialHero: HeroContent = {
  title: "Notice",
  highlight: "Board",
  description: "Important announcements, deadlines, and updates from CAN Kavre.",
};

const initialNotices: NoticeItem[] = [
  {
    id: 1,
    title: "Membership Renewal Deadline Extended",
    content: "The deadline for membership renewal has been extended to Ashad 15, 2081. Members are requested to renew their membership before the deadline.",
    date: "2024-05-20",
    priority: "high",
    type: "deadline",
  },
  {
    id: 2,
    title: "ICT Day 2081 Registration Open",
    content: "Registration for ICT Day 2081 celebration is now open. All members and interested individuals can register through our website.",
    date: "2024-05-15",
    priority: "medium",
    type: "announcement",
  },
  {
    id: 3,
    title: "Office Timing Change Notice",
    content: "CAN Kavre office will operate from 10:00 AM to 5:00 PM starting from Jestha 1, 2081.",
    date: "2024-05-10",
    priority: "low",
    type: "info",
  },
  {
    id: 4,
    title: "Call for IT Club Coordinator Applications",
    content: "Applications are invited for the position of District IT Club Coordinator. Interested candidates may submit their applications by Jestha 30, 2081.",
    date: "2024-05-05",
    priority: "medium",
    type: "deadline",
  },
  {
    id: 5,
    title: "Annual General Meeting Announcement",
    content: "The Annual General Meeting will be held on Ashad 5, 2081 at Dhulikhel Municipality Hall. All members are requested to attend.",
    date: "2024-04-28",
    priority: "high",
    type: "announcement",
  },
];

const priorityStyles = {
  high: {
    bg: "bg-primary/10",
    border: "border-l-primary",
    icon: AlertTriangle,
    iconColor: "text-primary",
  },
  medium: {
    bg: "bg-secondary/10",
    border: "border-l-secondary",
    icon: Info,
    iconColor: "text-secondary",
  },
  low: {
    bg: "bg-accent/10",
    border: "border-l-accent",
    icon: CheckCircle,
    iconColor: "text-accent",
  },
} as const;

const typeBadges = {
  announcement: { text: "Announcement", color: "bg-secondary" },
  deadline: { text: "Deadline", color: "bg-primary" },
  info: { text: "Information", color: "bg-accent" },
} as const;

const priorityOptions = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
] as const;

const typeOptions = [
  { value: "announcement", label: "Announcement" },
  { value: "deadline", label: "Deadline" },
  { value: "info", label: "Information" },
] as const;

const Notice = () => {
  const [heroContent, setHeroContent] = useState(initialHero);
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [sectionSettings, setSectionSettings] = useState<NoticeSectionSettings>({
    heading: "Latest Notices",
    intro: "",
  });

  const [heroDialogOpen, setHeroDialogOpen] = useState(false);
  const [noticesDialogOpen, setNoticesDialogOpen] = useState(false);

  const [heroDraft, setHeroDraft] = useState<HeroContent>(heroContent);
  const [noticesDraft, setNoticesDraft] = useState<NoticeItem[]>(notices);
  const [sectionDraft, setSectionDraft] = useState<NoticeSectionSettings>(sectionSettings);

  useRegisterSearchSource(
    "notice",
    () => {
      const entries: SearchEntry[] = [];

      entries.push({
        id: "notice-hero",
        route: "/notice",
        title: `${heroContent.title} ${heroContent.highlight}`.trim(),
        description: heroContent.description,
        content: heroContent.description,
        tags: ["Notice", "Hero"],
      });

      entries.push({
        id: "notice-section",
        route: "/notice",
        title: sectionSettings.heading,
        description: sectionSettings.intro,
        content: sectionSettings.intro,
        tags: ["Notice", "Section"],
      });

      notices.forEach((notice, index) => {
        entries.push({
          id: `notice-item-${notice.id ?? index}`,
          route: "/notice",
          title: notice.title,
          description: notice.content,
          content: `${notice.content} ${notice.date} ${notice.priority} ${notice.type}`,
          tags: ["Notice", notice.priority, notice.type],
        });
      });

      return entries;
    },
    [heroContent, sectionSettings, notices]
  );

  const getPriorityStyles = (priority: NoticeItem["priority"]) => priorityStyles[priority];
  const getTypeBadge = (type: NoticeItem["type"]) => typeBadges[type];

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (!value || Number.isNaN(parsed.getTime())) {
      return value || "Date to be announced";
    }
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openHeroDialog = () => {
    setHeroDraft({ ...heroContent });
    setHeroDialogOpen(true);
  };

  const openNoticesDialog = () => {
    setNoticesDraft(notices.map((notice) => ({ ...notice })));
    setSectionDraft({ ...sectionSettings });
    setNoticesDialogOpen(true);
  };

  const addNotice = () => {
    setNoticesDraft((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        content: "",
        date: "",
        priority: "medium",
        type: "announcement",
      },
    ]);
  };

  const removeNotice = (index: number) => {
    setNoticesDraft((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex justify-end">
              <EditButton label="Edit Notice Hero" onClick={openHeroDialog} />
            </div>
            <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                {heroContent.title}
                {heroContent.highlight ? <span className="text-secondary"> {heroContent.highlight}</span> : null}
              </h1>
              <p className="text-lg text-muted-foreground">{heroContent.description}</p>
            </div>
          </div>
        </section>

        {/* Notices List */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex justify-end">
              <EditButton label="Edit Notices" onClick={openNoticesDialog} />
            </div>
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-secondary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {sectionSettings.heading}
                </h2>
              </div>
              {sectionSettings.intro ? (
                <p className="text-muted-foreground max-w-2xl">{sectionSettings.intro}</p>
              ) : null}
            </div>

            <div className="space-y-4 max-w-4xl">
              {notices.map((notice, index) => {
                const styles = getPriorityStyles(notice.priority);
                const badge = getTypeBadge(notice.type);
                const IconComponent = styles.icon;

                return (
                  <Card
                    key={notice.id}
                    className={`${styles.bg} border-l-4 ${styles.border} card-hover animate-fade-in-up overflow-hidden`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shrink-0">
                          <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <Badge className={`${badge.color} text-card`}>{badge.text}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(notice.date)}
                            </span>
                          </div>
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                            {notice.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{notice.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Dialog open={heroDialogOpen} onOpenChange={(open) => !open && setHeroDialogOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Notice Hero</DialogTitle>
            <DialogDescription>
              Update the heading and introduction shown at the top of the notice board.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notice-hero-title">Title</Label>
              <Input
                id="notice-hero-title"
                value={heroDraft.title}
                onChange={(event) => setHeroDraft((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notice-hero-highlight">Highlight</Label>
              <Input
                id="notice-hero-highlight"
                value={heroDraft.highlight}
                onChange={(event) => setHeroDraft((prev) => ({ ...prev, highlight: event.target.value }))}
                placeholder="Board"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notice-hero-description">Description</Label>
              <Textarea
                id="notice-hero-description"
                rows={4}
                value={heroDraft.description}
                onChange={(event) => setHeroDraft((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHeroDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setHeroContent({ ...heroDraft });
                setHeroDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={noticesDialogOpen} onOpenChange={(open) => !open && setNoticesDialogOpen(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Notices</DialogTitle>
            <DialogDescription>Manage the notice board section heading and the list of notices.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-1">
            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="grid gap-2">
                <Label htmlFor="notice-section-heading">Section Heading</Label>
                <Input
                  id="notice-section-heading"
                  value={sectionDraft.heading}
                  onChange={(event) => setSectionDraft((prev) => ({ ...prev, heading: event.target.value }))}
                  placeholder="Latest Notices"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notice-section-intro">Supporting Text</Label>
                <Textarea
                  id="notice-section-intro"
                  rows={3}
                  value={sectionDraft.intro}
                  onChange={(event) => setSectionDraft((prev) => ({ ...prev, intro: event.target.value }))}
                  placeholder="Add a short description for this section"
                />
              </div>
            </div>

            {noticesDraft.map((notice, index) => (
              <div key={notice.id} className="space-y-4 rounded-lg border border-border p-4">
                <div className="grid gap-2">
                  <Label htmlFor={`notice-title-${notice.id}`}>Title</Label>
                  <Input
                    id={`notice-title-${notice.id}`}
                    value={notice.title}
                    onChange={(event) =>
                      setNoticesDraft((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, title: event.target.value } : item
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`notice-content-${notice.id}`}>Content</Label>
                  <Textarea
                    id={`notice-content-${notice.id}`}
                    rows={4}
                    value={notice.content}
                    onChange={(event) =>
                      setNoticesDraft((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, content: event.target.value } : item
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor={`notice-date-${notice.id}`}>Date</Label>
                    <Input
                      id={`notice-date-${notice.id}`}
                      type="date"
                      value={notice.date}
                      onChange={(event) =>
                        setNoticesDraft((prev) =>
                          prev.map((item, idx) =>
                            idx === index ? { ...item, date: event.target.value } : item
                          )
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`notice-priority-${notice.id}`}>Priority</Label>
                    <Select
                      value={notice.priority}
                      onValueChange={(value) =>
                        setNoticesDraft((prev) =>
                          prev.map((item, idx) =>
                            idx === index
                              ? { ...item, priority: value as NoticeItem["priority"] }
                              : item
                          )
                        )
                      }
                    >
                      <SelectTrigger id={`notice-priority-${notice.id}`}>
                        <SelectValue placeholder="Choose priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`notice-type-${notice.id}`}>Type</Label>
                    <Select
                      value={notice.type}
                      onValueChange={(value) =>
                        setNoticesDraft((prev) =>
                          prev.map((item, idx) =>
                            idx === index ? { ...item, type: value as NoticeItem["type"] } : item
                          )
                        )
                      }
                    >
                      <SelectTrigger id={`notice-type-${notice.id}`}>
                        <SelectValue placeholder="Choose type" />
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
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotice(index)}
                    disabled={noticesDraft.length <= 1}
                  >
                    Remove Notice
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addNotice}>
              Add Notice
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoticesDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const cleanedNotices = noticesDraft.map((notice) => ({
                  ...notice,
                  title: notice.title.trim(),
                  content: notice.content.trim(),
                  date: notice.date,
                }));
                setNotices(cleanedNotices);
                setSectionSettings({
                  heading: sectionDraft.heading.trim() || "Latest Notices",
                  intro: sectionDraft.intro.trim(),
                });
                setNoticesDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Notice;
