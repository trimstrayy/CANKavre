import { Bell, Calendar, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  type: "announcement" | "deadline" | "info";
}

const notices: Notice[] = [
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

const Notice = () => {
  const getPriorityStyles = (priority: Notice["priority"]) => {
    switch (priority) {
      case "high": return { bg: "bg-primary/10", border: "border-l-primary", icon: AlertTriangle, iconColor: "text-primary" };
      case "medium": return { bg: "bg-secondary/10", border: "border-l-secondary", icon: Info, iconColor: "text-secondary" };
      case "low": return { bg: "bg-accent/10", border: "border-l-accent", icon: CheckCircle, iconColor: "text-accent" };
    }
  };

  const getTypeBadge = (type: Notice["type"]) => {
    switch (type) {
      case "announcement": return { text: "Announcement", color: "bg-secondary" };
      case "deadline": return { text: "Deadline", color: "bg-primary" };
      case "info": return { text: "Information", color: "bg-accent" };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="text-secondary">Notice</span> Board
            </h1>
            <p className="text-lg text-muted-foreground">
              Important announcements, deadlines, and updates from CAN Kavre.
            </p>
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="w-6 h-6 text-secondary" />
            <h2 className="font-heading text-2xl font-bold text-foreground">Latest Notices</h2>
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
                      <div className={`w-10 h-10 rounded-full bg-card flex items-center justify-center shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <Badge className={`${badge.color} text-card`}>
                            {badge.text}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(notice.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                          {notice.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {notice.content}
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
