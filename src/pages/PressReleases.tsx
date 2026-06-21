import { FileText, Calendar, ArrowRight, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import ContentModal, { FieldDef } from "@/components/ContentModal";
import { pressReleasesApi, PressReleaseRecord } from "@/lib/api";
import { fetchPressReleases } from "@/lib/supabaseContent";

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


const categories = [
  { en: "All", ne: "सबै" },
  { en: "Events", ne: "कार्यक्रमहरू" },
  { en: "IT Club", ne: "आईटी क्लब" },
  { en: "Training", ne: "तालिम" },
  { en: "Partnership", ne: "साझेदारी" },
  { en: "Organization", ne: "संगठन" },
];

const pressReleaseFields: FieldDef[] = [
  { key: "title", label: "Title (EN)", type: "text" },
  { key: "titleNe", label: "Title (NE) - Optional", type: "text", placeholder: "Leave blank for auto-translation" },
  { key: "excerpt", label: "Excerpt (EN)", type: "textarea" },
  { key: "excerptNe", label: "Excerpt (NE) - Optional", type: "textarea", placeholder: "Leave blank for auto-translation" },
  { key: "date", label: "Date", type: "date" },
  { key: "category", label: "Category (EN)", type: "text" },
  { key: "categoryNe", label: "Category (NE) - Optional", type: "text", placeholder: "Leave blank for auto-translation" },
  { key: "link", label: "Link URL", type: "text" },
];

const PressReleases = () => {
  const { t, isNepali } = useLanguage();
  const { isAdmin, token } = useAdmin();
  const { toast } = useToast();

  const [dbItems, setDbItems] = useState<PressReleaseRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PressReleaseRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchPressReleases()
      .then((items) => {
        setDbItems(
          items.map((r) => ({
            id: r.id,
            title: r.title,
            titleNe: r.titleNe,
            excerpt: r.excerpt,
            excerptNe: r.excerptNe,
            date: r.date,
            category: r.category,
            categoryNe: r.categoryNe,
            link: r.link,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const displayItems: PressReleaseItem[] = dbItems.map((r) => ({
    id: r.id,
    title: r.title,
    titleNe: r.titleNe,
    excerpt: r.excerpt,
    excerptNe: r.excerptNe,
    date: r.date,
    category: r.category,
    categoryNe: r.categoryNe,
    link: r.link,
  }));

  const handlePressSubmit = async (data: Record<string, string>) => {
    try {
      if (editingItem) {
        const updated = await pressReleasesApi.update(token!, editingItem.id, data);
        setDbItems((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        toast({ title: "Press release updated" });
      } else {
        const created = await pressReleasesApi.create(token!, data);
        setDbItems((prev) => [...prev, created]);
        toast({ title: "Press release added" });
      }
    } catch {
      toast({ title: "Error saving press release", variant: "destructive" });
    }
  };

  const handlePressDelete = async (id: number) => {
    if (!confirm("Delete this press release?")) return;
    try {
      await pressReleasesApi.remove(token!, id);
      setDbItems((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Press release deleted" });
    } catch {
      toast({ title: "Error deleting press release", variant: "destructive" });
    }
  };

  const filteredReleases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length > 0;
    return displayItems.filter((release) => {
      const title = isNepali ? release.titleNe : release.title;
      const excerpt = isNepali ? release.excerptNe : release.excerpt;
      const matchesSearch = !hasQuery || title.toLowerCase().includes(query) || excerpt.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === "All" || release.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayItems, searchQuery, selectedCategory, isNepali]);

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
          {isAdmin && (
            <div className="flex justify-end mb-6 max-w-4xl mx-auto">
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Press Release
              </Button>
            </div>
          )}
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredReleases.map((release, index) => (
              <Card 
                key={release.id} 
                className="group card-hover animate-fade-in-up"
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
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingItem(release as unknown as PressReleaseRecord);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handlePressDelete(release.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    )}
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

      <ContentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingItem ? "Edit Press Release" : "Add Press Release"}
        fields={pressReleaseFields}
        initial={editingItem ? (editingItem as unknown as Record<string, string>) : undefined}
        onSubmit={handlePressSubmit}
      />
    </div>
  );
};

export default PressReleases;
