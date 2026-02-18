import { useState, useEffect } from "react";
import {
  Users,
  History,
  Building2,
  GraduationCap,
  Phone,
  User,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import ContentModal, { FieldDef } from "@/components/ContentModal";
import { committeeMembersApi, CommitteeMemberRecord } from "@/lib/api";

interface CommitteeMember {
  name: string;
  nameNe: string;
  position: string;
  positionNe: string;
  contact: string;
  photo?: string;
}

interface PastCommittee {
  period: string;
  periodNe: string;
  members: CommitteeMember[];
  category?: string;
}

interface Subcommittee {
  name: string;
  nameNe: string;
  focus: string;
  focusNe: string;
  members: number;
  type?: string;
}

interface ItClub {
  name: string;
  nameNe: string;
  students: number;
  established: number;
}

const initialCommitteeMembers: CommitteeMember[] = [
  { name: "Ram Chandra Nyaupane", nameNe: "रामचन्द्र न्यौपाने", position: "President", positionNe: "अध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Shrawan Kumar Acharya", nameNe: "श्रवण कुमार आचार्य", position: "Senior Vice President", positionNe: "बरिष्ठ उपाध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Dipak Sapkota", nameNe: "दिपक सापकोटा", position: "Vice President", positionNe: "उपाध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Devaki Acharya", nameNe: "देवकी आचार्य", position: "Secretary", positionNe: "सचिव", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Kewal Prasad Timalsina", nameNe: "केवल प्रसाद तिमल्सिना", position: "Treasurer", positionNe: "कोषाध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Rukesh Rajbhandari", nameNe: "रुकेश राजभण्डारी", position: "Joint Secretary", positionNe: "सहसचिव", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Rishi Ram Gautam", nameNe: "ऋषिराम गौतम", position: "Member", positionNe: "सदस्य", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Rita Shrestha", nameNe: "रीता श्रेष्ठ", position: "Member", positionNe: "सदस्य", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Vivek Timalsina", nameNe: "विवेक तिमल्सिना", position: "Member", positionNe: "सदस्य", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Shyam Gopal Shrestha", nameNe: "श्याम गोपाल श्रेष्ठ", position: "Member", positionNe: "सदस्य", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Abodh Bhushan Khoju Shrestha", nameNe: "अवोध भुषण खोजु श्रेष्ठ", position: "Member", positionNe: "सदस्य", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Ujwal Thapa Magar", nameNe: "उज्वल थापा मगर", position: "Member", positionNe: "सदस्य", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Prakash Paudel", nameNe: "प्रकाश पौडेल", position: "Member", positionNe: "सदस्य", contact: "+977-98XXXXXXXX", photo: "" },
  { name: "Umesh Adhikari", nameNe: "उमेश अधिकारी", position: "Member", positionNe: "सदस्य", contact: "+977-98XXXXXXXX", photo: "" },
];

const initialPastCommittees: PastCommittee[] = [
  {
    period: "9th Committee (2077-2079)",
    periodNe: "९औं समिति (२०७७-२०७९)",
    members: [
      { name: "Jayram Humagain", nameNe: "जयराम हुमागाईं", position: "President", positionNe: "अध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
      { name: "Nabaraj Bhurtel", nameNe: "नवराज भुर्तेल", position: "Immediate Past President", positionNe: "तत्काल पूर्व अध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
    ],
    category: "9th",
  },
  {
    period: "8th Committee (2075-2077)",
    periodNe: "८औं समिति (२०७५-२०७७)",
    members: [
      { name: "Nabaraj Bhurtel", nameNe: "नवराज भुर्तेल", position: "President", positionNe: "अध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
      { name: "Kailash Palanchoke", nameNe: "कैलाश पलान्चोके", position: "Past President", positionNe: "पूर्व अध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
    ],
    category: "8th",
  },
  {
    period: "7th Committee (2073-2075)",
    periodNe: "७औं समिति (२०७३-२०७५)",
    members: [
      { name: "Kailash Palanchoke", nameNe: "कैलाश पलान्चोके", position: "President", positionNe: "अध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
      { name: "Niranjan Manandhar", nameNe: "निरञ्जन मानन्धर", position: "Past President", positionNe: "पूर्व अध्यक्ष", contact: "+977-98XXXXXXXX", photo: "" },
    ],
    category: "7th",
  },
];

const initialSubcommittees: Subcommittee[] = [
  { name: "Health IT Subcommittee", nameNe: "स्वास्थ्य आईटी उपसमिति", focus: "Digital health initiatives", focusNe: "डिजिटल स्वास्थ्य पहलहरू", members: 8, type: "health" },
  { name: "Education IT Subcommittee", nameNe: "शिक्षा आईटी उपसमिति", focus: "E-learning & digital education", focusNe: "ई-लर्निङ र डिजिटल शिक्षा", members: 10, type: "education" },
  { name: "Agriculture IT Subcommittee", nameNe: "कृषि आईटी उपसमिति", focus: "Smart farming technologies", focusNe: "स्मार्ट कृषि प्रविधिहरू", members: 6, type: "agriculture" },
  { name: "Women IT Subcommittee", nameNe: "महिला आईटी उपसमिति", focus: "Women empowerment through ICT", focusNe: "आईसीटी मार्फत महिला सशक्तिकरण", members: 12, type: "women" },
  { name: "E-Village Subcommittee", nameNe: "ई-गाउँ उपसमिति", focus: "Smart village & e-governance at local level", focusNe: "स्थानीय तहमा स्मार्ट गाउँ र ई-शासन", members: 7, type: "evillage" },
  { name: "Business & ICT Meet Subcommittee", nameNe: "व्यापार र आईसीटी मिट उपसमिति", focus: "Connecting ICT entrepreneurs & business networking", focusNe: "आईसीटी उद्यमी जडान र व्यापार नेटवर्किङ", members: 9, type: "business" },
];

const initialItClubs: ItClub[] = [
  { name: "Dhulikhel School IT Club", nameNe: "धुलिखेल विद्यालय आईटी क्लब", students: 45, established: 2019 },
  { name: "Panauti Secondary IT Club", nameNe: "पनौती माध्यमिक आईटी क्लब", students: 38, established: 2020 },
  { name: "Banepa HS IT Club", nameNe: "बनेपा उमावि आईटी क्लब", students: 52, established: 2018 },
  { name: "Kavre Multiple Campus IT Club", nameNe: "काभ्रे बहुमुखी क्याम्पस आईटी क्लब", students: 65, established: 2017 },
];

const memberFields: FieldDef[] = [
  { key: "name", label: "Name (EN)", type: "text", required: true, placeholder: "Ram Chandra Nyaupane" },
  { key: "nameNe", label: "Name (NE)", type: "text", required: true, placeholder: "रामचन्द्र न्यौपाने" },
  { key: "position", label: "Position (EN)", type: "text", required: true, placeholder: "President" },
  { key: "positionNe", label: "Position (NE)", type: "text", required: true, placeholder: "अध्यक्ष" },
  { key: "contact", label: "Contact", type: "text", placeholder: "+977-98XXXXXXXX" },
  { key: "photo", label: "Photo URL", type: "text", placeholder: "https://..." },
  { key: "sortOrder", label: "Sort Order", type: "number", placeholder: "0" },
];

const About = () => {
  const { t, isNepali } = useLanguage();
  const { isAdmin, token } = useAdmin();
  const { toast } = useToast();

  // DB-driven committee members (falls back to hardcoded if API unreachable)
  const [committeeMembers, setCommitteeMembers] = useState(initialCommitteeMembers);
  const [dbMembers, setDbMembers] = useState<CommitteeMemberRecord[]>([]);
  const [dbLoaded, setDbLoaded] = useState(false);

  // Modal state
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editMember, setEditMember] = useState<Record<string, any> | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const [subcommitteeData] = useState(initialSubcommittees);
  const [itClubData] = useState(initialItClubs);
  const [pastCommitteeData] = useState(initialPastCommittees);
  const [showPastCommittees, setShowPastCommittees] = useState(false);

  // Fetch DB members on mount
  useEffect(() => {
    committeeMembersApi.getAll()
      .then((rows) => {
        if (rows.length > 0) {
          setDbMembers(rows);
          setDbLoaded(true);
        }
      })
      .catch(() => { /* backend offline — use hardcoded */ });
  }, []);

  // Determine which members to show
  const displayMembers = dbLoaded
    ? dbMembers.sort((a, b) => a.sortOrder - b.sortOrder).map(m => ({
        name: m.name,
        nameNe: m.nameNe,
        position: m.position,
        positionNe: m.positionNe,
        contact: m.contact,
        photo: m.photo,
        id: m.id,
      }))
    : committeeMembers.map((m, i) => ({ ...m, id: i }));

  const handleMemberSubmit = async (data: Record<string, unknown>) => {
    if (!token) return;
    setIsSaving(true);
    try {
      if (data.id && dbLoaded) {
        const updated = await committeeMembersApi.update(token, data.id as number, data);
        setDbMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
        toast({ title: isNepali ? "सदस्य अद्यावधिक भयो" : "Member Updated" });
      } else {
        const created = await committeeMembersApi.create(token, data);
        setDbMembers(prev => [...prev, created]);
        if (!dbLoaded) setDbLoaded(true);
        toast({ title: isNepali ? "सदस्य थपियो" : "Member Added" });
      }
      setMemberModalOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMemberDelete = async (id: number) => {
    if (!token || !dbLoaded) return;
    const backup = dbMembers;
    setDbMembers(prev => prev.filter(m => m.id !== id));
    try {
      await committeeMembersApi.remove(token, id);
      toast({ title: isNepali ? "सदस्य हटाइयो" : "Member Removed" });
    } catch {
      setDbMembers(backup);
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const MemberCard = ({ member }: { member: CommitteeMember & { id?: number } }) => (
    <Card className="card-hover relative group">
      {isAdmin && dbLoaded && member.id !== undefined && (
        <div className="absolute right-1 top-1 z-10 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditMember(member); setMemberModalOpen(true); }}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleMemberDelete(member.id!)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      <CardContent className="p-4 text-center">
        <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full bg-muted flex items-center justify-center">
          {member.photo ? (
            <img
              src={member.photo}
              alt={isNepali ? member.nameNe : member.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <h4 className="font-semibold text-foreground">{isNepali ? member.nameNe : member.name}</h4>
        <p className="text-sm text-secondary font-medium">{isNepali ? member.positionNe : member.position}</p>
        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
          <Phone className="w-3 h-3" />
          {member.contact}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("aboutCanKavre")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("historyText")}
            </p>
          </div>
        </div>
      </section>

      {/* History & Introduction */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <History className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground">{t("ourHistory")}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("historyText")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
              <Card className="text-center card-hover">
                <CardContent className="p-6">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-heading font-bold text-primary">152+</div>
                  <div className="text-sm text-muted-foreground">{t("members")}</div>
                </CardContent>
              </Card>
              <Card className="text-center card-hover">
                <CardContent className="p-6">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <div className="text-2xl font-heading font-bold text-secondary">13+</div>
                  <div className="text-sm text-muted-foreground">{t("itClubs")}</div>
                </CardContent>
              </Card>
              <Card className="text-center card-hover">
                <CardContent className="p-6">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-heading font-bold text-accent">2000+</div>
                  <div className="text-sm text-muted-foreground">{t("beneficiaries")}</div>
                </CardContent>
              </Card>
              <Card className="text-center card-hover">
                <CardContent className="p-6">
                  <History className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-heading font-bold text-primary">18+</div>
                  <div className="text-sm text-muted-foreground">{t("yearsActive")}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="committee" className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 h-auto bg-card shadow-card">
              <TabsTrigger value="committee" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("currentCommittee")}
              </TabsTrigger>
              <TabsTrigger value="subcommittees" className="py-3 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                {t("subcommitteesTitle")}
              </TabsTrigger>
              <TabsTrigger value="itclubs" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                {t("itClubsTitle")}
              </TabsTrigger>
              <TabsTrigger value="history" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("pastCommittees")}
              </TabsTrigger>
            </TabsList>

            {/* Current Committee */}
            <TabsContent value="committee" className="animate-fade-in">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground">{t("currentMainCommittee")}</h3>
                <p className="text-muted-foreground">{isNepali ? "१०औं अधिवेशन — कार्यसमिति (२०७९–२०८१)" : "10th Convention — Executive Committee (2079-2081)"}</p>
                {isAdmin && (
                  <Button className="mt-4 gap-2" onClick={() => { setEditMember(undefined); setMemberModalOpen(true); }}>
                    <Plus className="h-4 w-4" />
                    {isNepali ? "सदस्य थप्नुहोस्" : "Add Member"}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {displayMembers.map((member, index) => (
                  <MemberCard key={`${member.name}-${index}`} member={member} />
                ))}
              </div>

              {/* Member Add/Edit Modal */}
              <ContentModal
                open={memberModalOpen}
                onOpenChange={setMemberModalOpen}
                title={editMember?.id ? (isNepali ? "सदस्य सम्पादन" : "Edit Member") : (isNepali ? "नयाँ सदस्य" : "Add Member")}
                fields={memberFields}
                initial={editMember}
                onSubmit={handleMemberSubmit}
                isSaving={isSaving}
              />
            </TabsContent>

            {/* Subcommittees */}
            <TabsContent value="subcommittees" className="animate-fade-in">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground">{t("subcommitteesTitle")}</h3>
                <p className="text-muted-foreground">{isNepali ? "विशेषज्ञ कार्यसमूहहरू" : "Specialized working groups"}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subcommitteeData.map((sub, index) => (
                  <Card key={`${sub.name}-${index}`} className="card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg">{isNepali ? sub.nameNe : sub.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{isNepali ? sub.focusNe : sub.focus}</p>
                      <span className="text-sm font-medium text-secondary">{sub.members} {t("members")}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* IT Clubs */}
            <TabsContent value="itclubs" className="animate-fade-in">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground">{t("itClubsTitle")}</h3>
                <p className="text-muted-foreground">{isNepali ? "शैक्षिक संस्थाहरूमा सम्बद्ध आईसीटी क्लबहरू" : "Affiliated ICT clubs in educational institutions"}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {itClubData.map((club, index) => (
                  <Card key={`${club.name}-${index}`} className="card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg">{isNepali ? club.nameNe : club.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{isNepali ? "भर्ना विद्यार्थी" : "Enrolled Students"}</span>
                        <span className="font-medium text-accent">{club.students}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{isNepali ? "स्थापित" : "Established"}</span>
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
                <h3 className="font-heading text-2xl font-bold text-foreground">{t("pastCommittees")}</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowPastCommittees(!showPastCommittees)}
                  className="mt-4"
                >
                  {showPastCommittees ? t("hidePastCommittees") : t("viewPastCommittees")}
                </Button>
              </div>
              {showPastCommittees && (
                <div className="space-y-8">
                  {pastCommitteeData.map((committee, index) => (
                    <div key={index}>
                      <h4 className="font-heading text-xl font-semibold text-foreground mb-4">
                        {isNepali ? committee.periodNe : committee.period}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {committee.members.map((member, mIndex) => (
                          <MemberCard key={`${member.name}-${mIndex}`} member={member} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default About;
