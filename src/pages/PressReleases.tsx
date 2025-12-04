import { FileText, Calendar, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormEvent, useEffect, useMemo, useState } from "react";
import EditButton from "@/components/EditButton";
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
import { SearchEntry, useRegisterSearchSource } from "@/contexts/SearchContext";

type HeroContent = {
  title: string;
  highlight: string;
  description: string;
};

type FilterConfig = {
  searchPlaceholder: string;
  allLabel: string;
  categories: string[];
  defaultCategory: string;
};

type PressReleaseItem = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  link: string;
};

type PressListSettings = {
  readMoreLabel: string;
};

const initialHero: HeroContent = {
  title: "Press",
  highlight: "Releases",
  description: "Stay informed about the latest news and announcements from CAN Kavre.",
};

const initialFilterConfig: FilterConfig = {
  searchPlaceholder: "Search press releases...",
  allLabel: "All",
  categories: ["Events", "IT Club", "Training", "Partnership", "Organization"],
  defaultCategory: "All",
};

const initialPressReleases: PressReleaseItem[] = [
  {
    id: 1,
    title: "CAN Kavre Successfully Conducts ICT Day 2081 Celebration",
    excerpt:
      "Over 200 participants joined the annual ICT Day celebration organized by CAN Kavre at Dhulikhel Municipality Hall.",
    date: "2024-05-17",
    category: "Events",
    link: "#",
  },
  {
    id: 2,
    title: "New IT Club Established at Panauti Secondary School",
    excerpt:
      "CAN Kavre inaugurated a new IT club at Panauti Secondary School with 45 student members.",
    date: "2024-04-20",
    category: "IT Club",
    link: "#",
  },
  {
    id: 3,
    title: "Digital Literacy Workshop for Senior Citizens",
    excerpt:
      "A week-long digital literacy program was conducted for senior citizens in Banepa municipality.",
    date: "2024-03-15",
    category: "Training",
    link: "#",
  },
  {
    id: 4,
    title: "CAN Kavre Signs MoU with Local Government",
    excerpt:
      "Memorandum of Understanding signed with Dhulikhel Municipality for e-governance support.",
    date: "2024-02-28",
    category: "Partnership",
    link: "#",
  },
  {
    id: 5,
    title: "Career Opportunities in ICT Seminar 2081",
    excerpt: "Over 150 students attended the career guidance seminar on opportunities in the ICT sector.",
    date: "2024-02-10",
    category: "Events",
    link: "#",
  },
  {
    id: 6,
    title: "Annual General Meeting 2080 Concluded",
    excerpt: "The AGM was successfully concluded with the presentation of annual reports and future plans.",
    date: "2024-01-25",
    category: "Organization",
    link: "#",
  },
];

const initialPressSettings: PressListSettings = {
  readMoreLabel: "Read full article",
};

const PressReleases = () => {
  const [heroContent, setHeroContent] = useState(initialHero);
  const [filterConfig, setFilterConfig] = useState(initialFilterConfig);
  const [pressItems, setPressItems] = useState<PressReleaseItem[]>(initialPressReleases);
  const [pressSettings, setPressSettings] = useState(initialPressSettings);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(filterConfig.defaultCategory);

  const [heroDialogOpen, setHeroDialogOpen] = useState(false);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [pressDialogOpen, setPressDialogOpen] = useState(false);

  const [heroDraft, setHeroDraft] = useState<HeroContent>(heroContent);
  const [filterDraft, setFilterDraft] = useState<FilterConfig>(filterConfig);
  const [pressDraft, setPressDraft] = useState<PressReleaseItem[]>(pressItems);
  const [pressSettingsDraft, setPressSettingsDraft] = useState(pressSettings);

  useRegisterSearchSource(
    "press-releases",
    () => {
      const entries: SearchEntry[] = [];

      entries.push({
        id: "press-hero",
        route: "/press-releases",
        title: `${heroContent.title} ${heroContent.highlight}`.trim(),
        description: heroContent.description,
        content: heroContent.description,
        tags: ["Press", "Hero"],
      });

      entries.push({
        id: "press-filters",
        route: "/press-releases",
        title: "Press Release Filters",
        description: `Categories: ${filterConfig.categories.join(", ")}`,
        content: [
          filterConfig.searchPlaceholder,
          filterConfig.allLabel,
          filterConfig.categories.join(" "),
          filterConfig.defaultCategory,
        ]
          .filter(Boolean)
          .join(" "),
        tags: ["Press", "Filters"],
      });

      pressItems.forEach((item, index) => {
        entries.push({
          id: `press-item-${item.id ?? index}`,
          route: "/press-releases",
          title: item.title,
          description: item.excerpt,
          content: `${item.excerpt} ${item.category} ${item.date}`,
          tags: ["Press", item.category],
        });
      });

      entries.push({
        id: "press-settings",
        route: "/press-releases",
        title: "Press Release Settings",
        description: `Read more label: ${pressSettings.readMoreLabel}`,
        content: pressSettings.readMoreLabel,
        tags: ["Press", "Settings"],
      });

      return entries;
    },
    [heroContent, filterConfig, pressItems, pressSettings]
  );

  useEffect(() => {
    const options = [filterConfig.allLabel, ...filterConfig.categories];
    if (!options.includes(filterConfig.defaultCategory)) {
      setFilterConfig((prev) => ({
        ...prev,
        defaultCategory: prev.allLabel,
      }));
    }
  }, [filterConfig]);

  useEffect(() => {
    const options = [filterConfig.allLabel, ...filterConfig.categories];
    if (!options.includes(selectedCategory)) {
      setSelectedCategory(filterConfig.defaultCategory);
    }
  }, [filterConfig, selectedCategory]);

  const categoryOptions = useMemo(
    () => [filterConfig.allLabel, ...filterConfig.categories],
    [filterConfig.allLabel, filterConfig.categories]
  );

  const assignableCategories = useMemo(
    () => (filterConfig.categories.length ? filterConfig.categories : [filterConfig.allLabel]),
    [filterConfig.categories, filterConfig.allLabel]
  );

  const filteredReleases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length > 0;
    return pressItems.filter((release) => {
      const matchesSearch =
        !hasQuery ||
        release.title.toLowerCase().includes(query) ||
        release.excerpt.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === filterConfig.allLabel || release.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [pressItems, searchQuery, selectedCategory, filterConfig.allLabel]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchInput.trim();
    setSearchInput(trimmed);
    setSearchQuery(trimmed);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const openHeroDialog = () => {
    setHeroDraft({ ...heroContent });
    setHeroDialogOpen(true);
  };

  const openFiltersDialog = () => {
    setFilterDraft({
      searchPlaceholder: filterConfig.searchPlaceholder,
      allLabel: filterConfig.allLabel,
      categories: [...filterConfig.categories],
      defaultCategory: filterConfig.defaultCategory,
    });
    setFiltersDialogOpen(true);
  };

  const openPressDialog = () => {
    setPressDraft(pressItems.map((item) => ({ ...item })));
    setPressSettingsDraft({ ...pressSettings });
    setPressDialogOpen(true);
  };

  const addCategory = () => {
    setFilterDraft((prev) => ({
      ...prev,
      categories: [...prev.categories, ""],
    }));
  };

  const removeCategory = (index: number) => {
    setFilterDraft((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, idx) => idx !== index),
      defaultCategory:
        prev.defaultCategory === prev.categories[index]
          ? prev.allLabel
          : prev.defaultCategory,
    }));
  };

  const addPressRelease = () => {
    setPressDraft((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        excerpt: "",
        date: "",
        category: assignableCategories[0] ?? filterConfig.allLabel,
        link: "#",
      },
    ]);
  };

  const removePressRelease = (index: number) => {
    setPressDraft((prev) => prev.filter((_, idx) => idx !== index));
  };

  const formatDate = (dateString: string) => {
    const parsed = new Date(dateString);
    if (!dateString || Number.isNaN(parsed.getTime())) {
      return dateString || "Date to be announced";
    }
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Press Hero" onClick={openHeroDialog} />
          </div>
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {heroContent.title}
              {heroContent.highlight ? (
                <span className="text-primary">{' '}{heroContent.highlight}</span>
              ) : null}
            </h1>
            <p className="text-lg text-muted-foreground">{heroContent.description}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex justify-end">
            <EditButton label="Edit Filters" onClick={openFiltersDialog} />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto gap-2">
              <div className="relative w-full md:w-80">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={filterConfig.searchPlaceholder}
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                    setSearchQuery(event.target.value);
                  }}
                  className="pl-10"
                  aria-label="Search press releases"
                />
              </div>
              <Button type="submit" className="shrink-0">
                Search
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="shrink-0"
                onClick={handleClearSearch}
                disabled={!searchQuery && !searchInput}
              >
                Clear
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
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
          <div className="mb-6 flex justify-end">
            <EditButton label="Edit Press List" onClick={openPressDialog} />
          </div>
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
                          {formatDate(release.date)}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                      <Button
                        variant="ghost"
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 px-0"
                        asChild
                      >
                        <a
                          href={release.link || "#"}
                          target={release.link.startsWith("http") ? "_blank" : undefined}
                          rel={release.link.startsWith("http") ? "noreferrer" : undefined}
                        >
                          {pressSettings.readMoreLabel}
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
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
      </div>

      <Dialog open={heroDialogOpen} onOpenChange={(open) => !open && setHeroDialogOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Press Hero</DialogTitle>
            <DialogDescription>Update the headline and description for the press releases page.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={heroDraft.title}
                onChange={(event) => setHeroDraft((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-highlight">Highlight</Label>
              <Input
                id="hero-highlight"
                value={heroDraft.highlight}
                onChange={(event) => setHeroDraft((prev) => ({ ...prev, highlight: event.target.value }))}
                placeholder="Releases"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
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

      <Dialog open={filtersDialogOpen} onOpenChange={(open) => !open && setFiltersDialogOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Filters</DialogTitle>
            <DialogDescription>Configure the search field and available press release categories.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid gap-2">
              <Label htmlFor="filter-search">Search Placeholder</Label>
              <Input
                id="filter-search"
                value={filterDraft.searchPlaceholder}
                onChange={(event) =>
                  setFilterDraft((prev) => ({ ...prev, searchPlaceholder: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-all-label">All Category Label</Label>
              <Input
                id="filter-all-label"
                value={filterDraft.allLabel}
                onChange={(event) =>
                  setFilterDraft((prev) => ({
                    ...prev,
                    allLabel: event.target.value,
                    defaultCategory:
                      prev.defaultCategory === prev.allLabel ? event.target.value : prev.defaultCategory,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Categories</Label>
              {filterDraft.categories.map((category, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={category}
                    onChange={(event) =>
                      setFilterDraft((prev) => {
                        const updated = [...prev.categories];
                        const previousValue = updated[index];
                        updated[index] = event.target.value;
                        return {
                          ...prev,
                          categories: updated,
                          defaultCategory:
                            prev.defaultCategory === previousValue
                              ? event.target.value
                              : prev.defaultCategory,
                        };
                      })
                    }
                    placeholder="Category name"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(index)}
                    disabled={filterDraft.categories.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addCategory}>
                Add Category
              </Button>
            </div>
            <div className="grid gap-2">
              <Label>Default Category</Label>
              <Select
                value={filterDraft.defaultCategory}
                onValueChange={(value) =>
                  setFilterDraft((prev) => ({
                    ...prev,
                    defaultCategory: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default" />
                </SelectTrigger>
                <SelectContent>
                  {[filterDraft.allLabel, ...filterDraft.categories.filter((item) => item.trim() !== "")].map(
                    (option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFiltersDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const cleanedCategories = filterDraft.categories.map((category) => category.trim()).filter(Boolean);
                const allLabel = filterDraft.allLabel.trim() || initialFilterConfig.allLabel;
                const options = [allLabel, ...cleanedCategories];
                const defaultCategory = options.includes(filterDraft.defaultCategory)
                  ? filterDraft.defaultCategory
                  : allLabel;
                setFilterConfig({
                  searchPlaceholder: filterDraft.searchPlaceholder.trim() || initialFilterConfig.searchPlaceholder,
                  allLabel,
                  categories: cleanedCategories,
                  defaultCategory,
                });
                setSelectedCategory(defaultCategory);
                setFiltersDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pressDialogOpen} onOpenChange={(open) => !open && setPressDialogOpen(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Press Releases</DialogTitle>
            <DialogDescription>Manage the list of press releases and the read-more button label.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-1">
            {pressDraft.map((item, index) => (
              <div key={item.id} className="space-y-4 rounded-lg border border-border p-4">
                <div className="grid gap-2">
                  <Label htmlFor={`press-title-${item.id}`}>Title</Label>
                  <Input
                    id={`press-title-${item.id}`}
                    value={item.title}
                    onChange={(event) =>
                      setPressDraft((prev) =>
                        prev.map((release, idx) =>
                          idx === index ? { ...release, title: event.target.value } : release
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`press-excerpt-${item.id}`}>Excerpt</Label>
                  <Textarea
                    id={`press-excerpt-${item.id}`}
                    rows={3}
                    value={item.excerpt}
                    onChange={(event) =>
                      setPressDraft((prev) =>
                        prev.map((release, idx) =>
                          idx === index ? { ...release, excerpt: event.target.value } : release
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`press-date-${item.id}`}>Date</Label>
                    <Input
                      id={`press-date-${item.id}`}
                      type="date"
                      value={item.date}
                      onChange={(event) =>
                        setPressDraft((prev) =>
                          prev.map((release, idx) =>
                            idx === index ? { ...release, date: event.target.value } : release
                          )
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`press-category-${item.id}`}>Category</Label>
                    <Select
                      value={item.category}
                      onValueChange={(value) =>
                        setPressDraft((prev) =>
                          prev.map((release, idx) =>
                            idx === index ? { ...release, category: value } : release
                          )
                        )
                      }
                    >
                      <SelectTrigger id={`press-category-${item.id}`}>
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        {[filterConfig.allLabel, ...filterConfig.categories].map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            disabled={category === filterConfig.allLabel && filterConfig.categories.length > 0}
                          >
                            {category === filterConfig.allLabel && filterConfig.categories.length > 0
                              ? `${category} (All)`
                              : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`press-link-${item.id}`}>Link</Label>
                  <Input
                    id={`press-link-${item.id}`}
                    value={item.link}
                    onChange={(event) =>
                      setPressDraft((prev) =>
                        prev.map((release, idx) =>
                          idx === index ? { ...release, link: event.target.value } : release
                        )
                      )
                    }
                    placeholder="https://example.com/full-article"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePressRelease(index)}
                    disabled={pressDraft.length <= 1}
                  >
                    Remove Press Release
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addPressRelease}>
              Add Press Release
            </Button>
            <div className="grid gap-2">
              <Label htmlFor="press-readmore">Read More Button Label</Label>
              <Input
                id="press-readmore"
                value={pressSettingsDraft.readMoreLabel}
                onChange={(event) =>
                  setPressSettingsDraft((prev) => ({ ...prev, readMoreLabel: event.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPressDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const cleanedPress = pressDraft.map((item) => ({
                  ...item,
                  title: item.title.trim(),
                  excerpt: item.excerpt.trim(),
                  date: item.date,
                  category: item.category.trim() || filterConfig.allLabel,
                  link: item.link.trim() || "#",
                }));
                setPressItems(cleanedPress);
                setPressSettings({
                  readMoreLabel: pressSettingsDraft.readMoreLabel.trim() || initialPressSettings.readMoreLabel,
                });
                setPressDialogOpen(false);
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

export default PressReleases;
