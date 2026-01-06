import { FileText, Calendar, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormEvent, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PressReleaseItem {
  id: number;
  title: string;
  titleNe: string;
  excerpt: string;
  excerptNe: string;
  date: string;
  category: string;
  categoryNe: string;
  link: string;
}

const initialPressReleases: PressReleaseItem[] = [
  {
    id: 1,
    title: "CAN Kavre Successfully Conducts ICT Day 2081 Celebration",
    titleNe: "क्यान काभ्रेले सफलतापूर्वक आईसीटी दिवस २०८१ समारोह सम्पन्न गर्यो",
    excerpt: "Over 200 participants joined the annual ICT Day celebration organized by CAN Kavre at Dhulikhel Municipality Hall.",
    excerptNe: "धुलिखेल नगरपालिका हलमा क्यान काभ्रेद्वारा आयोजित वार्षिक आईसीटी दिवस समारोहमा २०० भन्दा बढी सहभागीहरू सामेल भए।",
    date: "2024-05-17",
    category: "Events",
    categoryNe: "कार्यक्रमहरू",
    link: "#",
  },
  {
    id: 2,
    title: "New IT Club Established at Panauti Secondary School",
    titleNe: "पनौती माध्यमिक विद्यालयमा नयाँ आईटी क्लब स्थापना",
    excerpt: "CAN Kavre inaugurated a new IT club at Panauti Secondary School with 45 student members.",
    excerptNe: "क्यान काभ्रेले ४५ विद्यार्थी सदस्यहरूसँग पनौती माध्यमिक विद्यालयमा नयाँ आईटी क्लब उद्घाटन गर्यो।",
    date: "2024-04-20",
    category: "IT Club",
    categoryNe: "आईटी क्लब",
    link: "#",
  },
  {
    id: 3,
    title: "Digital Literacy Workshop for Senior Citizens",
    titleNe: "ज्येष्ठ नागरिकहरूको लागि डिजिटल साक्षरता कार्यशाला",
    excerpt: "A week-long digital literacy program was conducted for senior citizens in Banepa municipality.",
    excerptNe: "बनेपा नगरपालिकामा ज्येष्ठ नागरिकहरूको लागि एक हप्ते डिजिटल साक्षरता कार्यक्रम सञ्चालन गरियो।",
    date: "2024-03-15",
    category: "Training",
    categoryNe: "तालिम",
    link: "#",
  },
  {
    id: 4,
    title: "CAN Kavre Signs MoU with Local Government",
    titleNe: "क्यान काभ्रेले स्थानीय सरकारसँग सम्झौता पत्रमा हस्ताक्षर गर्यो",
    excerpt: "Memorandum of Understanding signed with Dhulikhel Municipality for e-governance support.",
    excerptNe: "ई-गभर्नेन्स समर्थनको लागि धुलिखेल नगरपालिकासँग सम्झौता पत्रमा हस्ताक्षर।",
    date: "2024-02-28",
    category: "Partnership",
    categoryNe: "साझेदारी",
    link: "#",
  },
  {
    id: 5,
    title: "Career Opportunities in ICT Seminar 2081",
    titleNe: "आईसीटीमा क्यारियर अवसरहरू सेमिनार २०८१",
    excerpt: "Over 150 students attended the career guidance seminar on opportunities in the ICT sector.",
    excerptNe: "आईसीटी क्षेत्रमा अवसरहरूमा क्यारियर मार्गदर्शन सेमिनारमा १५० भन्दा बढी विद्यार्थीहरू उपस्थित भए।",
    date: "2024-02-10",
    category: "Events",
    categoryNe: "कार्यक्रमहरू",
    link: "#",
  },
  {
    id: 6,
    title: "Annual General Meeting 2080 Concluded",
    titleNe: "वार्षिक साधारण सभा २०८० सम्पन्न",
    excerpt: "The AGM was successfully concluded with the presentation of annual reports and future plans.",
    excerptNe: "वार्षिक प्रतिवेदन र भविष्यका योजनाहरूको प्रस्तुतीकरणसँगै वार्षिक साधारण सभा सफलतापूर्वक सम्पन्न भयो।",
    date: "2024-01-25",
    category: "Organization",
    categoryNe: "संगठन",
    link: "#",
  },
];

const categories = [
  { en: "All", ne: "सबै" },
  { en: "Events", ne: "कार्यक्रमहरू" },
  { en: "IT Club", ne: "आईटी क्लब" },
  { en: "Training", ne: "तालिम" },
  { en: "Partnership", ne: "साझेदारी" },
  { en: "Organization", ne: "संगठन" },
];

const PressReleases = () => {
  const { t, isNepali } = useLanguage();
  const [pressItems] = useState<PressReleaseItem[]>(initialPressReleases);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredReleases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length > 0;
    return pressItems.filter((release) => {
      const title = isNepali ? release.titleNe : release.title;
      const excerpt = isNepali ? release.excerptNe : release.excerpt;
      const matchesSearch = !hasQuery || title.toLowerCase().includes(query) || excerpt.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === "All" || release.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [pressItems, searchQuery, selectedCategory, isNepali]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const formatDate = (dateString: string) => {
    const parsed = new Date(dateString);
    if (!dateString || Number.isNaN(parsed.getTime())) {
      return dateString || (isNepali ? "मिति घोषणा हुने" : "Date to be announced");
    }
    return parsed.toLocaleDateString(isNepali ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("pressReleasesTitle")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("pressReleasesSubtitle")}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto gap-2">
              <div className="relative w-full md:w-80">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("searchPressReleases")}
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                    setSearchQuery(event.target.value);
                  }}
                  className="pl-10"
                  aria-label={isNepali ? "प्रेस विज्ञप्तिहरू खोज्नुहोस्" : "Search press releases"}
                />
              </div>
              <Button type="submit" className="shrink-0">
                {isNepali ? "खोज्नुहोस्" : "Search"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="shrink-0"
                onClick={handleClearSearch}
                disabled={!searchQuery && !searchInput}
              >
                {isNepali ? "खाली गर्नुहोस्" : "Clear"}
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.en}
                  variant={selectedCategory === category.en ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.en)}
                  className={selectedCategory === category.en ? "bg-secondary" : ""}
                >
                  {isNepali ? category.ne : category.en}
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
                          {isNepali ? release.categoryNe : release.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(release.date)}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                        {isNepali ? release.titleNe : release.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{isNepali ? release.excerptNe : release.excerpt}</p>
                      <Button
                        variant="ghost"
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 px-0"
                        asChild
                      >
                        <a href={release.link || "#"}>
                          {t("readMore")}
                          <ArrowRight className="w-4 h-4 ml-2 inline" />
                        </a>
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
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                {isNepali ? "कुनै नतिजा फेला परेन" : "No Results Found"}
              </h3>
              <p className="text-muted-foreground">
                {isNepali ? "आफ्नो खोज वा फिल्टर मापदण्ड समायोजन गर्ने प्रयास गर्नुहोस्।" : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PressReleases;
