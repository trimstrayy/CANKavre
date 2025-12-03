import { useState } from "react";
import { 
  Users, 
  History, 
  Building2, 
  GraduationCap,
  Phone,
  ChevronDown,
  ChevronUp,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CommitteeMember {
  name: string;
  position: string;
  photo?: string;
  contact: string;
}

const currentCommittee: CommitteeMember[] = [
  { name: "Ram Bahadur Shrestha", position: "President", contact: "+977-98XXXXXXXX" },
  { name: "Sita Kumari Tamang", position: "Vice President", contact: "+977-98XXXXXXXX" },
  { name: "Hari Prasad Gautam", position: "General Secretary", contact: "+977-98XXXXXXXX" },
  { name: "Maya Devi Maharjan", position: "Secretary", contact: "+977-98XXXXXXXX" },
  { name: "Krishna Bahadur Lama", position: "Treasurer", contact: "+977-98XXXXXXXX" },
  { name: "Sunita Karki", position: "Joint Secretary", contact: "+977-98XXXXXXXX" },
];

const pastCommittees = [
  { period: "7th Committee (2077-2079)", members: currentCommittee.slice(0, 4) },
  { period: "6th Committee (2075-2077)", members: currentCommittee.slice(0, 4) },
  { period: "5th Committee (2073-2075)", members: currentCommittee.slice(0, 4) },
];

const subcommittees = [
  { name: "Health IT Subcommittee", focus: "Digital health initiatives", members: 8 },
  { name: "Education IT Subcommittee", focus: "E-learning & digital education", members: 10 },
  { name: "Agriculture IT Subcommittee", focus: "Smart farming technologies", members: 6 },
  { name: "Women IT Subcommittee", focus: "Women empowerment through ICT", members: 12 },
];

const itClubs = [
  { name: "Dhulikhel School IT Club", students: 45, established: 2019 },
  { name: "Panauti Secondary IT Club", students: 38, established: 2020 },
  { name: "Banepa HS IT Club", students: 52, established: 2018 },
  { name: "Kavre Multiple Campus IT Club", students: 65, established: 2017 },
];

const About = () => {
  const [showPastCommittees, setShowPastCommittees] = useState(false);

  const MemberCard = ({ member }: { member: CommitteeMember }) => (
    <Card className="card-hover">
      <CardContent className="p-4 text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
          <User className="w-10 h-10 text-muted-foreground" />
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              About <span className="text-secondary">CAN Federation Kavre</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Computer Association of Nepal (CAN), Kavre Branch, has been at the forefront of 
              promoting ICT development in Kavrepalanchok district since its establishment. We unite 
              IT professionals, enthusiasts, and organizations to build a digitally empowered community.
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
                <h2 className="font-heading text-3xl font-bold text-foreground">Our History</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CAN Kavre was established as a district-level branch of the Computer Association of Nepal 
                to promote ICT development in Kavrepalanchok. Over the years, we have organized numerous 
                training programs, workshops, and awareness campaigns.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our journey has been marked by significant milestones including the establishment of 
                50+ IT clubs in schools and colleges, training thousands of individuals in digital skills, 
                and advocating for ICT policies at the local and provincial levels.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
              {[
                { icon: Users, label: "Members", value: "500+", color: "primary" },
                { icon: Building2, label: "IT Clubs", value: "50+", color: "secondary" },
                { icon: GraduationCap, label: "Trained", value: "5000+", color: "accent" },
                { icon: History, label: "Years", value: "15+", color: "primary" },
              ].map((stat) => (
                <Card key={stat.label} className="text-center card-hover">
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
                {currentCommittee.map((member) => (
                  <MemberCard key={member.name} member={member} />
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
                {subcommittees.map((sub) => (
                  <Card key={sub.name} className="card-hover">
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
                {itClubs.map((club) => (
                  <Card key={club.name} className="card-hover">
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
                {pastCommittees.map((committee, index) => (
                  <Card key={committee.period}>
                    <CardHeader>
                      <CardTitle className="text-lg">{committee.period}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {committee.members.map((member) => (
                          <div key={member.name} className="text-center p-3 bg-muted rounded-lg">
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
    </div>
  );
};

export default About;
