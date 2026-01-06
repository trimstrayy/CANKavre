import { useState } from "react";
import { Bell, Calendar, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

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

const initialNotices: NoticeItem[] = [
  {
    id: 1,
    title: "Membership Renewal Deadline Extended",
    titleNe: "सदस्यता नवीकरण म्याद थप",
    content: "The deadline for membership renewal has been extended to Ashad 15, 2081. Members are requested to renew their membership before the deadline.",
    contentNe: "सदस्यता नवीकरणको म्याद असार १५, २०८१ सम्म थप गरिएको छ। सदस्यहरूलाई म्याद अघि नै सदस्यता नवीकरण गर्न अनुरोध छ।",
    date: "2024-05-20",
    priority: "high",
    type: "deadline",
  },
  {
    id: 2,
    title: "ICT Day 2081 Registration Open",
    titleNe: "आईसीटी दिवस २०८१ दर्ता खुला",
    content: "Registration for ICT Day 2081 celebration is now open. All members and interested individuals can register through our website.",
    contentNe: "आईसीटी दिवस २०८१ समारोहको लागि दर्ता अहिले खुला छ। सबै सदस्य र इच्छुक व्यक्तिहरू हाम्रो वेबसाइट मार्फत दर्ता गर्न सक्नुहुन्छ।",
    date: "2024-05-15",
    priority: "medium",
    type: "announcement",
  },
  {
    id: 3,
    title: "Office Timing Change Notice",
    titleNe: "कार्यालय समय परिवर्तन सूचना",
    content: "CAN Kavre office will operate from 10:00 AM to 5:00 PM starting from Jestha 1, 2081.",
    contentNe: "क्यान काभ्रे कार्यालय जेठ १, २०८१ देखि बिहान १०:०० बजेदेखि साँझ ५:०० बजेसम्म सञ्चालन हुनेछ।",
    date: "2024-05-10",
    priority: "low",
    type: "info",
  },
  {
    id: 4,
    title: "Call for IT Club Coordinator Applications",
    titleNe: "आईटी क्लब संयोजक आवेदन आह्वान",
    content: "Applications are invited for the position of District IT Club Coordinator. Interested candidates may submit their applications by Jestha 30, 2081.",
    contentNe: "जिल्ला आईटी क्लब संयोजक पदको लागि आवेदन आह्वान गरिएको छ। इच्छुक उम्मेदवारहरूले जेठ ३०, २०८१ सम्म आफ्नो आवेदन पेश गर्न सक्नुहुन्छ।",
    date: "2024-05-05",
    priority: "medium",
    type: "deadline",
  },
  {
    id: 5,
    title: "Annual General Meeting Announcement",
    titleNe: "वार्षिक साधारण सभा घोषणा",
    content: "The Annual General Meeting will be held on Ashad 5, 2081 at Dhulikhel Municipality Hall. All members are requested to attend.",
    contentNe: "वार्षिक साधारण सभा असार ५, २०८१ मा धुलिखेल नगरपालिका हलमा हुनेछ। सबै सदस्यहरूलाई उपस्थित हुन अनुरोध छ।",
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

const Notice = () => {
  const { t, isNepali } = useLanguage();
  const [notices] = useState<NoticeItem[]>(initialNotices);

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
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-secondary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {isNepali ? "ताजा सूचनाहरू" : "Latest Notices"}
              </h2>
            </div>
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
                          {isNepali ? notice.titleNe : notice.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {isNepali ? notice.contentNe : notice.content}
                        </p>
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
  );
};

export default Notice;
