import { useState, useEffect } from "react";
import { Bell, Calendar, AlertTriangle, Info, CheckCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import ContentModal, { FieldDef } from "@/components/ContentModal";
import { noticesApi, NoticeRecord } from "@/lib/api";
import { fetchNotices } from "@/lib/supabaseContent";

interface NoticeItem {
  id: number;
  title: string;
  titleNe: string;
  content: string;
  contentNe: string;
  date: string;
  priority: "high" | "medium" | "low";
  type: "announcement" | "deadline" | "info";
}


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

const noticeFields: FieldDef[] = [
  { key: "title", label: "Title (EN)", type: "text" },
  { key: "titleNe", label: "Title (NE) - Optional", type: "text", placeholder: "Leave blank for auto-translation" },
  { key: "content", label: "Content (EN)", type: "textarea" },
  { key: "contentNe", label: "Content (NE) - Optional", type: "textarea", placeholder: "Leave blank for auto-translation" },
  { key: "date", label: "Date", type: "date" },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
  {
    key: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "announcement", label: "Announcement" },
      { value: "deadline", label: "Deadline" },
      { value: "info", label: "Information" },
    ],
  },
];

const Notice = () => {
  const { t, isNepali } = useLanguage();
  const { isAdmin, token } = useAdmin();
  const { toast } = useToast();

  const [dbNotices, setDbNotices] = useState<NoticeRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeRecord | null>(null);

  useEffect(() => {
    fetchNotices()
      .then((items) => {
        setDbNotices(
          items.map((n) => ({
            id: n.id,
            title: n.title,
            titleNe: n.titleNe,
            content: n.content,
            contentNe: n.contentNe,
            date: n.date,
            priority: n.priority,
            type: n.type,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const displayNotices: NoticeItem[] = dbNotices.map((n) => ({
    id: n.id,
    title: n.title,
    titleNe: n.titleNe,
    content: n.content,
    contentNe: n.contentNe,
    date: n.date,
    priority: n.priority as NoticeItem["priority"],
    type: n.type as NoticeItem["type"],
  }));

  const handleNoticeSubmit = async (data: Record<string, string>) => {
    try {
      if (editingNotice) {
        const updated = await noticesApi.update(token!, editingNotice.id, data);
        setDbNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        toast({ title: "Notice updated" });
      } else {
        const created = await noticesApi.create(token!, data);
        setDbNotices((prev) => [...prev, created]);
        toast({ title: "Notice added" });
      }
    } catch {
      toast({ title: "Error saving notice", variant: "destructive" });
    }
  };

  const handleNoticeDelete = async (id: number) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await noticesApi.remove(token!, id);
      setDbNotices((prev) => prev.filter((n) => n.id !== id));
      toast({ title: "Notice deleted" });
    } catch {
      toast({ title: "Error deleting notice", variant: "destructive" });
    }
  };

  const getPriorityStyles = (priority: NoticeItem["priority"]) => priorityStyles[priority];

  const getTypeBadge = (type: NoticeItem["type"]) => {
    const badges = {
      announcement: { 
        text: isNepali ? "घोषणा" : "Announcement", 
        color: "bg-secondary" 
      },
      deadline: { 
        text: isNepali ? "म्याद" : "Deadline", 
        color: "bg-primary" 
      },
      info: { 
        text: isNepali ? "जानकारी" : "Information", 
        color: "bg-accent" 
      },
    };
    return badges[type];
  };

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (!value || Number.isNaN(parsed.getTime())) {
      return value || (isNepali ? "मिति घोषणा हुने" : "Date to be announced");
    }
    return parsed.toLocaleDateString(isNepali ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("noticeTitle")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("noticeSubtitle")}</p>
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-secondary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {isNepali ? "ताजा सूचनाहरू" : "Latest Notices"}
                </h2>
              </div>
              {isAdmin && (
                <Button
                  onClick={() => {
                    setEditingNotice(null);
                    setModalOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Notice
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4 max-w-4xl">
            {displayNotices.map((notice, index) => {
              const styles = getPriorityStyles(notice.priority);
              const badge = getTypeBadge(notice.type);
              const IconComponent = styles.icon;

              return (
                <Card
                  key={notice.id}
                  className={`group ${styles.bg} border-l-4 ${styles.border} card-hover animate-fade-in-up overflow-hidden`}
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
                          {isNepali ? notice.titleNe : notice.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {isNepali ? notice.contentNe : notice.content}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingNotice(notice as unknown as NoticeRecord);
                              setModalOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleNoticeDelete(notice.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <ContentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingNotice ? "Edit Notice" : "Add Notice"}
        fields={noticeFields}
        initial={editingNotice ? (editingNotice as unknown as Record<string, string>) : undefined}
        onSubmit={handleNoticeSubmit}
      />
    </div>
  );
};

export default Notice;
