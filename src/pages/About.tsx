import { useState } from "react";
import {
  Users,
  History,
  Building2,
  GraduationCap,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditButton from "@/components/EditButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommitteeMember {
  name: string;
  position: string;
  contact: string;
  photo?: string;
}

interface PastCommittee {
  period: string;
  members: CommitteeMember[];
  category?: string;
}

interface Subcommittee {
  name: string;
  focus: string;
  members: number;
  type?: string;
}

interface ItClub {
  name: string;
  students: number;
  established: number;
}

interface StatItem {
  icon: typeof Users;
  label: string;
  value: string;
  color: string;
}

interface HeroContent {
  titlePrefix: string;
  titleHighlight: string;
  description: string;
}

interface HistoryContent {
  heading: string;
  paragraphs: string[];
  stats: StatItem[];
}

interface CommitteeDraftState {
  current: CommitteeMember[];
  subcommittees: Subcommittee[];
  itClubs: ItClub[];
  past: PastCommittee[];
}

const initialCommitteeMembers: CommitteeMember[] = [
  { name: "Ram Bahadur Shrestha", position: "President", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Sita Kumari Tamang", position: "Vice President", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Hari Prasad Gautam", position: "General Secretary", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Maya Devi Maharjan", position: "Secretary", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Krishna Bahadur Lama", position: "Treasurer", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Sunita Karki", position: "Joint Secretary", contact: "+977-98XXXXXXXX", photo: "" },
];

const subcommitteeOptions = [
  { value: "health", name: "Health IT Subcommittee", focus: "Digital health initiatives" },
  { value: "education", name: "Education IT Subcommittee", focus: "E-learning & digital education" },
  { value: "agriculture", name: "Agriculture IT Subcommittee", focus: "Smart farming technologies" },
  { value: "women", name: "Women IT Subcommittee", focus: "Women empowerment through ICT" },
  { value: "custom", name: "Custom", focus: "" },
];

const pastCommitteeOptions = [
  { value: "8th", label: "8th Committee (2081-2083)" },
  { value: "7th", label: "7th Committee (2077-2079)" },
  { value: "6th", label: "6th Committee (2075-2077)" },
  { value: "5th", label: "5th Committee (2073-2075)" },
  { value: "custom", label: "Custom" },
];

const deriveSubcommitteeType = (name: string) => {
  const match = subcommitteeOptions.find((option) => option.name === name);
  return match ? match.value : "custom";
};

const derivePastCommitteeCategory = (period: string) => {
  const match = pastCommitteeOptions.find((option) => option.label === period);
  return match ? match.value : "custom";
};

const initialPastCommittees: PastCommittee[] = [
  {
    period: "7th Committee (2077-2079)",
    members: initialCommitteeMembers.slice(0, 4).map((member) => ({ ...member })),
    category: "7th",
  },
  {
    period: "6th Committee (2075-2077)",
    members: initialCommitteeMembers.slice(0, 4).map((member) => ({ ...member })),
    category: "6th",
  },
  {
    period: "5th Committee (2073-2075)",
    members: initialCommitteeMembers.slice(0, 4).map((member) => ({ ...member })),
    category: "5th",
  },
];

const initialSubcommittees: Subcommittee[] = [
  { name: "Health IT Subcommittee", focus: "Digital health initiatives", members: 8, type: "health" },
  { name: "Education IT Subcommittee", focus: "E-learning & digital education", members: 10, type: "education" },
  { name: "Agriculture IT Subcommittee", focus: "Smart farming technologies", members: 6, type: "agriculture" },
  { name: "Women IT Subcommittee", focus: "Women empowerment through ICT", members: 12, type: "women" },
];

const initialItClubs: ItClub[] = [
  { name: "Dhulikhel School IT Club", students: 45, established: 2019 },
  { name: "Panauti Secondary IT Club", students: 38, established: 2020 },
  { name: "Banepa HS IT Club", students: 52, established: 2018 },
  { name: "Kavre Multiple Campus IT Club", students: 65, established: 2017 },
];

const initialHeroContent: HeroContent = {
  titlePrefix: "About",
  titleHighlight: "CAN Federation Kavre",
  description:
    "The Computer Association of Nepal (CAN), Kavre Branch, has been at the forefront of promoting ICT development in Kavrepalanchok district since its establishment. We unite IT professionals, enthusiasts, and organizations to build a digitally empowered community.",
};

const initialHistoryContent: HistoryContent = {
  heading: "Our History",
  paragraphs: [
    "CAN Kavre was established as a district-level branch of the Computer Association of Nepal to promote ICT development in Kavrepalanchok. Over the years, we have organized numerous training programs, workshops, and awareness campaigns.",
    "Our journey has been marked by significant milestones including the establishment of 50+ IT clubs in schools and colleges, training thousands of individuals in digital skills, and advocating for ICT policies at the local and provincial levels.",
  ],
  stats: [
    { icon: Users, label: "Members", value: "500+", color: "primary" },
    { icon: Building2, label: "IT Clubs", value: "50+", color: "secondary" },
    { icon: GraduationCap, label: "Trained", value: "5000+", color: "accent" },
    { icon: History, label: "Years", value: "15+", color: "primary" },
  ],
};

const About = () => {
  const [heroContent, setHeroContent] = useState(initialHeroContent);
  const [historyContent, setHistoryContent] = useState(initialHistoryContent);
  const [committeeMembers, setCommitteeMembers] = useState(initialCommitteeMembers);
  const [subcommitteeData, setSubcommitteeData] = useState(initialSubcommittees);
  const [itClubData, setItClubData] = useState(initialItClubs);
  const [pastCommitteeData, setPastCommitteeData] = useState(initialPastCommittees);

  const [heroDialogOpen, setHeroDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [committeeDialogOpen, setCommitteeDialogOpen] = useState(false);
  const [committeeTab, setCommitteeTab] = useState("current");

  const [heroDraft, setHeroDraft] = useState<HeroContent>(heroContent);
  const [historyDraft, setHistoryDraft] = useState<HistoryContent>(historyContent);
  const [committeeDraft, setCommitteeDraft] = useState<CommitteeDraftState>({
    current: committeeMembers,
    subcommittees: subcommitteeData,
    itClubs: itClubData,
    past: pastCommitteeData,
  });

  const MemberCard = ({ member }: { member: CommitteeMember }) => (
    <Card className="card-hover">
      <CardContent className="p-4 text-center">
        <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full bg-muted flex items-center justify-center">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <h4 className="font-semibold text-foreground">{member.name}</h4>
        <p className="text-sm text-secondary font-medium">{member.position}</p>
        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
          <Phone className="w-3 h-3" />
          {member.contact}
        </div>
      </CardContent>
    </Card>
  );

  const openHeroDialog = () => {
    setHeroDraft({ ...heroContent });
    setHeroDialogOpen(true);
  };

  const openHistoryDialog = () => {
    setHistoryDraft({
      heading: historyContent.heading,
      paragraphs: [...historyContent.paragraphs],
      stats: historyContent.stats.map((stat) => ({ ...stat })),
    });
    setHistoryDialogOpen(true);
  };

  const openCommitteeDialog = () => {
    setCommitteeDraft({
      current: committeeMembers.map((member) => ({ ...member })),
      subcommittees: subcommitteeData.map((item) => ({
        ...item,
        type: item.type ?? deriveSubcommitteeType(item.name),
      })),
      itClubs: itClubData.map((item) => ({ ...item })),
      past: pastCommitteeData.map((group) => ({
        period: group.period,
        category: group.category ?? derivePastCommitteeCategory(group.period),
        members: group.members.map((member) => ({ ...member })),
      })),
    });
    setCommitteeTab("current");
    setCommitteeDialogOpen(true);
  };

  const handleHeroSave = () => {
    setHeroContent(heroDraft);
    setHeroDialogOpen(false);
  };

  const handleHistorySave = () => {
    setHistoryContent(historyDraft);
    setHistoryDialogOpen(false);
  };

  const handleCommitteeSave = () => {
    setCommitteeMembers(committeeDraft.current);
    setSubcommitteeData(committeeDraft.subcommittees);
    setItClubData(committeeDraft.itClubs);
    setPastCommitteeData(committeeDraft.past);
    setCommitteeDialogOpen(false);
  };

  const addCommitteeMember = () => {
    setCommitteeDraft((prev) => ({
      ...prev,
      current: [...prev.current, { name: "", position: "", contact: "", photo: "" }],
    }));
  };

  const addSubcommittee = () => {
    setCommitteeDraft((prev) => ({
      ...prev,
      subcommittees: [...prev.subcommittees, { name: "", focus: "", members: 0, type: "custom" }],
    }));
  };

  const addItClub = () => {
    setCommitteeDraft((prev) => ({
      ...prev,
      itClubs: [...prev.itClubs, { name: "", students: 0, established: new Date().getFullYear() }],
    }));
  };

  const addPastCommittee = () => {
    setCommitteeDraft((prev) => ({
      ...prev,
      past: [
        ...prev.past,
        {
          period: "New Committee",
          category: "custom",
          members: [{ name: "", position: "", contact: "", photo: "" }],
        },
      ],
    }));
  };

  const addPastMember = (index: number) => {
    setCommitteeDraft((prev) => ({
      ...prev,
      past: prev.past.map((group, idx) =>
        idx === index
          ? {
              ...group,
              members: [...group.members, { name: "", position: "", contact: "", photo: "" }],
            }
          : group
      ),
    }));
  };

  const removeItem = <T,>(items: T[], index: number) => items.filter((_, idx) => idx !== index);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit About Hero" onClick={openHeroDialog} />
          </div>
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {heroContent.titlePrefix} <span className="text-secondary">{heroContent.titleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{heroContent.description}</p>
          </div>
        </div>
      </section>

      {/* History & Introduction */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit History Section" onClick={openHistoryDialog} />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <History className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground">{historyContent.heading}</h2>
              </div>
              {historyContent.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-muted-foreground leading-relaxed ${index === 0 ? "mb-4" : ""}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
              {historyContent.stats.map((stat, index) => (
                <Card key={`${stat.label}-${index}`} className="text-center card-hover">
                  <CardContent className="p-6">
                    <stat.icon className={`w-8 h-8 mx-auto mb-2 text-${stat.color}`} />
                    <div className={`text-2xl font-heading font-bold text-${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Committee Tabs" onClick={openCommitteeDialog} />
          </div>
          <Tabs defaultValue="committee" className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 h-auto bg-card shadow-card">
              <TabsTrigger value="committee" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Committee
              </TabsTrigger>
              <TabsTrigger value="subcommittees" className="py-3 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                Subcommittees
              </TabsTrigger>
              <TabsTrigger value="itclubs" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                IT Clubs
              </TabsTrigger>
              <TabsTrigger value="history" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Past Committees
              </TabsTrigger>
            </TabsList>

            {/* Current Committee */}
            <TabsContent value="committee" className="animate-fade-in">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground">Current Main Committee</h3>
                <p className="text-muted-foreground">8th Executive Committee (2079-2081)</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {committeeMembers.map((member, index) => (
                  <MemberCard key={`${member.name}-${index}`} member={member} />
                ))}
              </div>
            </TabsContent>

            {/* Subcommittees */}
            <TabsContent value="subcommittees" className="animate-fade-in">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground">Subcommittees</h3>
                <p className="text-muted-foreground">Specialized working groups</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subcommitteeData.map((sub, index) => (
                  <Card key={`${sub.name}-${index}`} className="card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg">{sub.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{sub.focus}</p>
                      <span className="text-sm font-medium text-secondary">{sub.members} members</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* IT Clubs */}
            <TabsContent value="itclubs" className="animate-fade-in">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground">School IT Clubs</h3>
                <p className="text-muted-foreground">Affiliated ICT clubs in educational institutions</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {itClubData.map((club, index) => (
                  <Card key={`${club.name}-${index}`} className="card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg">{club.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Enrolled Students</span>
                        <span className="font-medium text-accent">{club.students}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Established</span>
                        <span className="font-medium">{club.established}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Past Committees */}
            <TabsContent value="history" className="animate-fade-in">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground">Past Committees</h3>
                <p className="text-muted-foreground">Previous executive committees</p>
              </div>
              <div className="space-y-6 max-w-4xl mx-auto">
                {pastCommitteeData.map((committee, index) => (
                  <Card key={`${committee.period}-${index}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{committee.period}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {committee.members.map((member, idx) => (
                          <div key={`${member.name}-${idx}`} className="text-center p-3 bg-muted rounded-lg">
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.position}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Hero Dialog */}
      <Dialog open={heroDialogOpen} onOpenChange={setHeroDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit About Hero</DialogTitle>
            <DialogDescription>Update the headline and intro text visible at the top of this page.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="hero-title-prefix">Title Prefix</Label>
              <Input
                id="hero-title-prefix"
                value={heroDraft.titlePrefix}
                onChange={(event) => setHeroDraft({ ...heroDraft, titlePrefix: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-title-highlight">Title Highlight</Label>
              <Input
                id="hero-title-highlight"
                value={heroDraft.titleHighlight}
                onChange={(event) => setHeroDraft({ ...heroDraft, titleHighlight: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={heroDraft.description}
                onChange={(event) => setHeroDraft({ ...heroDraft, description: event.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHeroDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleHeroSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit History Section</DialogTitle>
            <DialogDescription>Modify the background story and quick facts shown in the history panel.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-1">
            <div className="grid gap-2">
              <Label htmlFor="history-heading">Section Heading</Label>
              <Input
                id="history-heading"
                value={historyDraft.heading}
                onChange={(event) =>
                  setHistoryDraft({ ...historyDraft, heading: event.target.value })
                }
              />
            </div>
            {historyDraft.paragraphs.map((paragraph, index) => (
              <div className="grid gap-2" key={index}>
                <Label htmlFor={`history-paragraph-${index}`}>Paragraph {index + 1}</Label>
                <Textarea
                  id={`history-paragraph-${index}`}
                  value={paragraph}
                  onChange={(event) =>
                    setHistoryDraft({
                      ...historyDraft,
                      paragraphs: historyDraft.paragraphs.map((text, idx) =>
                        idx === index ? event.target.value : text
                      ),
                    })
                  }
                  rows={3}
                />
              </div>
            ))}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Quick Stats</h4>
              {historyDraft.stats.map((stat, index) => (
                <div key={index} className="grid gap-3 rounded-lg border border-border p-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`stat-label-${index}`}>Label</Label>
                    <Input
                      id={`stat-label-${index}`}
                      value={stat.label}
                      onChange={(event) =>
                        setHistoryDraft({
                          ...historyDraft,
                          stats: historyDraft.stats.map((item, idx) =>
                            idx === index ? { ...item, label: event.target.value } : item
                          ),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`stat-value-${index}`}>Value</Label>
                    <Input
                      id={`stat-value-${index}`}
                      value={stat.value}
                      onChange={(event) =>
                        setHistoryDraft({
                          ...historyDraft,
                          stats: historyDraft.stats.map((item, idx) =>
                            idx === index ? { ...item, value: event.target.value } : item
                          ),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`stat-color-${index}`}>Tailwind Color Token</Label>
                    <Input
                      id={`stat-color-${index}`}
                      value={stat.color}
                      onChange={(event) =>
                        setHistoryDraft({
                          ...historyDraft,
                          stats: historyDraft.stats.map((item, idx) =>
                            idx === index ? { ...item, color: event.target.value } : item
                          ),
                        })
                      }
                      placeholder="primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleHistorySave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Committee Dialog */}
      <Dialog open={committeeDialogOpen} onOpenChange={setCommitteeDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Committee & Club Data</DialogTitle>
            <DialogDescription>Adjust the rosters and supporting sections displayed inside the tabs.</DialogDescription>
          </DialogHeader>
          <Tabs value={committeeTab} onValueChange={setCommitteeTab}>
            <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="subcommittees">Subcommittees</TabsTrigger>
              <TabsTrigger value="itclubs">IT Clubs</TabsTrigger>
              <TabsTrigger value="past">Past Committees</TabsTrigger>
            </TabsList>
            <div className="mt-4 max-h-[55vh] overflow-y-auto pr-1">
              <TabsContent value="current" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Current Committee</h4>
                  <Button size="sm" variant="outline" onClick={addCommitteeMember}>
                    Add Member
                  </Button>
                </div>
                {committeeDraft.current.map((member, index) => (
                  <div key={index} className="grid gap-3 rounded-lg border border-border p-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`committee-name-${index}`}>Name</Label>
                      <Input
                        id={`committee-name-${index}`}
                        value={member.name}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            current: prev.current.map((item, idx) =>
                              idx === index ? { ...item, name: event.target.value } : item
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`committee-position-${index}`}>Position</Label>
                      <Input
                        id={`committee-position-${index}`}
                        value={member.position}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            current: prev.current.map((item, idx) =>
                              idx === index ? { ...item, position: event.target.value } : item
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`committee-contact-${index}`}>Contact</Label>
                      <Input
                        id={`committee-contact-${index}`}
                        value={member.contact}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            current: prev.current.map((item, idx) =>
                              idx === index ? { ...item, contact: event.target.value } : item
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`committee-photo-${index}`}>Photo URL</Label>
                      <Input
                        id={`committee-photo-${index}`}
                        value={member.photo ?? ""}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            current: prev.current.map((item, idx) =>
                              idx === index ? { ...item, photo: event.target.value } : item
                            ),
                          }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                    {committeeDraft.current.length > 1 && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCommitteeDraft((prev) => ({
                              ...prev,
                              current: removeItem(prev.current, index),
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="subcommittees" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Subcommittees</h4>
                  <Button size="sm" variant="outline" onClick={addSubcommittee}>
                    Add Subcommittee
                  </Button>
                </div>
                {committeeDraft.subcommittees.map((sub, index) => (
                  <div key={index} className="grid gap-3 rounded-lg border border-border p-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`subcommittee-type-${index}`}>Template</Label>
                      <Select
                        value={sub.type ?? deriveSubcommitteeType(sub.name)}
                        onValueChange={(value) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            subcommittees: prev.subcommittees.map((item, idx) => {
                              if (idx !== index) return item;
                              if (value === "custom") {
                                return { ...item, type: value };
                              }
                              const option = subcommitteeOptions.find((opt) => opt.value === value);
                              return option
                                ? {
                                    ...item,
                                    type: value,
                                    name: option.name,
                                    focus: option.focus,
                                  }
                                : { ...item, type: value };
                            }),
                          }))
                        }
                      >
                        <SelectTrigger id={`subcommittee-type-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcommitteeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.value === "custom" ? "Custom" : option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`subcommittee-name-${index}`}>Name</Label>
                      <Input
                        id={`subcommittee-name-${index}`}
                        value={sub.name}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            subcommittees: prev.subcommittees.map((item, idx) =>
                              idx === index ? { ...item, name: event.target.value } : item
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`subcommittee-focus-${index}`}>Focus Area</Label>
                      <Textarea
                        id={`subcommittee-focus-${index}`}
                        value={sub.focus}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            subcommittees: prev.subcommittees.map((item, idx) =>
                              idx === index ? { ...item, focus: event.target.value } : item
                            ),
                          }))
                        }
                        rows={2}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`subcommittee-members-${index}`}>Member Count</Label>
                      <Input
                        id={`subcommittee-members-${index}`}
                        type="number"
                        value={sub.members}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            subcommittees: prev.subcommittees.map((item, idx) =>
                              idx === index
                                ? { ...item, members: Number(event.target.value) || 0 }
                                : item
                            ),
                          }))
                        }
                      />
                    </div>
                    {committeeDraft.subcommittees.length > 1 && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCommitteeDraft((prev) => ({
                              ...prev,
                              subcommittees: removeItem(prev.subcommittees, index),
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="itclubs" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">IT Clubs</h4>
                  <Button size="sm" variant="outline" onClick={addItClub}>
                    Add IT Club
                  </Button>
                </div>
                {committeeDraft.itClubs.map((club, index) => (
                  <div key={index} className="grid gap-3 rounded-lg border border-border p-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`club-name-${index}`}>Name</Label>
                      <Input
                        id={`club-name-${index}`}
                        value={club.name}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            itClubs: prev.itClubs.map((item, idx) =>
                              idx === index ? { ...item, name: event.target.value } : item
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`club-students-${index}`}>Students</Label>
                      <Input
                        id={`club-students-${index}`}
                        type="number"
                        value={club.students}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            itClubs: prev.itClubs.map((item, idx) =>
                              idx === index
                                ? { ...item, students: Number(event.target.value) || 0 }
                                : item
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`club-established-${index}`}>Established Year</Label>
                      <Input
                        id={`club-established-${index}`}
                        type="number"
                        value={club.established}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            itClubs: prev.itClubs.map((item, idx) =>
                              idx === index
                                ? {
                                    ...item,
                                    established: Number(event.target.value) || new Date().getFullYear(),
                                  }
                                : item
                            ),
                          }))
                        }
                      />
                    </div>
                    {committeeDraft.itClubs.length > 1 && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCommitteeDraft((prev) => ({
                              ...prev,
                              itClubs: removeItem(prev.itClubs, index),
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Past Committees</h4>
                  <Button size="sm" variant="outline" onClick={addPastCommittee}>
                    Add Past Committee
                  </Button>
                </div>
                {committeeDraft.past.map((committee, index) => (
                  <div key={index} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`past-category-${index}`}>Committee</Label>
                      <Select
                        value={committee.category ?? derivePastCommitteeCategory(committee.period)}
                        onValueChange={(value) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            past: prev.past.map((item, idx) => {
                              if (idx !== index) return item;
                              if (value === "custom") {
                                return { ...item, category: value };
                              }
                              const option = pastCommitteeOptions.find((opt) => opt.value === value);
                              return option
                                ? {
                                    ...item,
                                    category: value,
                                    period: option.label,
                                  }
                                : { ...item, category: value };
                            }),
                          }))
                        }
                      >
                        <SelectTrigger id={`past-category-${index}`}>
                          <SelectValue placeholder="Select committee" />
                        </SelectTrigger>
                        <SelectContent>
                          {pastCommitteeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`past-period-${index}`}>Committee Period</Label>
                      <Input
                        id={`past-period-${index}`}
                        value={committee.period}
                        onChange={(event) =>
                          setCommitteeDraft((prev) => ({
                            ...prev,
                            past: prev.past.map((item, idx) =>
                              idx === index ? { ...item, period: event.target.value } : item
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      {committee.members.map((member, memberIndex) => (
                        <div
                          key={memberIndex}
                          className="grid gap-3 rounded-md border border-border/60 p-3"
                        >
                          <div className="grid gap-2">
                            <Label htmlFor={`past-member-name-${index}-${memberIndex}`}>
                              Member Name
                            </Label>
                            <Input
                              id={`past-member-name-${index}-${memberIndex}`}
                              value={member.name}
                              onChange={(event) =>
                                setCommitteeDraft((prev) => ({
                                  ...prev,
                                  past: prev.past.map((group, idx) =>
                                    idx === index
                                      ? {
                                          ...group,
                                          members: group.members.map((item, mIdx) =>
                                            mIdx === memberIndex
                                              ? { ...item, name: event.target.value }
                                              : item
                                          ),
                                        }
                                      : group
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`past-member-position-${index}-${memberIndex}`}>
                              Position
                            </Label>
                            <Input
                              id={`past-member-position-${index}-${memberIndex}`}
                              value={member.position}
                              onChange={(event) =>
                                setCommitteeDraft((prev) => ({
                                  ...prev,
                                  past: prev.past.map((group, idx) =>
                                    idx === index
                                      ? {
                                          ...group,
                                          members: group.members.map((item, mIdx) =>
                                            mIdx === memberIndex
                                              ? { ...item, position: event.target.value }
                                              : item
                                          ),
                                        }
                                      : group
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`past-member-photo-${index}-${memberIndex}`}>
                              Photo URL
                            </Label>
                            <Input
                              id={`past-member-photo-${index}-${memberIndex}`}
                              value={member.photo ?? ""}
                              onChange={(event) =>
                                setCommitteeDraft((prev) => ({
                                  ...prev,
                                  past: prev.past.map((group, idx) =>
                                    idx === index
                                      ? {
                                          ...group,
                                          members: group.members.map((item, mIdx) =>
                                            mIdx === memberIndex
                                              ? { ...item, photo: event.target.value }
                                              : item
                                          ),
                                        }
                                      : group
                                  ),
                                }))
                              }
                              placeholder="https://..."
                            />
                          </div>
                          {committee.members.length > 1 && (
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setCommitteeDraft((prev) => ({
                                    ...prev,
                                    past: prev.past.map((group, idx) =>
                                      idx === index
                                        ? {
                                            ...group,
                                            members: removeItem(group.members, memberIndex),
                                          }
                                        : group
                                    ),
                                  }))
                                }
                              >
                                Remove Member
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Button size="sm" variant="outline" onClick={() => addPastMember(index)}>
                        Add Member
                      </Button>
                      {committeeDraft.past.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCommitteeDraft((prev) => ({
                              ...prev,
                              past: removeItem(prev.past, index),
                            }))
                          }
                        >
                          Remove Committee
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </div>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommitteeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCommitteeSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default About;
