import { FileText, Calendar, ArrowRight, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PressRelease {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

const pressReleases: PressRelease[] = [
  {
    id: 1,
    title: "CAN Kavre Successfully Conducts ICT Day 2081 Celebration",
    excerpt: "Over 200 participants joined the annual ICT Day celebration organized by CAN Kavre at Dhulikhel Municipality Hall.",
    date: "2024-05-17",
    category: "Events",
  },
  {
    id: 2,
    title: "New IT Club Established at Panauti Secondary School",
    excerpt: "CAN Kavre inaugurated a new IT club at Panauti Secondary School with 45 student members.",
    date: "2024-04-20",
    category: "IT Club",
  },
  {
    id: 3,
    title: "Digital Literacy Workshop for Senior Citizens",
    excerpt: "A week-long digital literacy program was conducted for senior citizens in Banepa municipality.",
    date: "2024-03-15",
    category: "Training",
  },
  {
    id: 4,
    title: "CAN Kavre Signs MoU with Local Government",
    excerpt: "Memorandum of Understanding signed with Dhulikhel Municipality for e-governance support.",
    date: "2024-02-28",
    category: "Partnership",
  },
  {
    id: 5,
    title: "Career Opportunities in ICT Seminar 2081",
    excerpt: "Over 150 students attended the career guidance seminar on opportunities in the ICT sector.",
    date: "2024-02-10",
    category: "Events",
  },
  {
    id: 6,
    title: "Annual General Meeting 2080 Concluded",
    excerpt: "The AGM was successfully concluded with the presentation of annual reports and future plans.",
    date: "2024-01-25",
    category: "Organization",
  },
];

const categories = ["All", "Events", "IT Club", "Training", "Partnership", "Organization"];

const PressReleases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredReleases = pressReleases.filter((release) => {
    const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      release.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || release.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Press <span className="text-primary">Releases</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay informed about the latest news and announcements from CAN Kavre.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search press releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-secondary" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredReleases.map((release, index) => (
              <Card 
                key={release.id} 
                className="card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-secondary border-secondary">
                          {release.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(release.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                      <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 px-0">
                        Read full article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReleases.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PressReleases;
