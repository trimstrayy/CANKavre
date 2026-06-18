import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type NoticeRow = Database["public"]["Tables"]["notices"]["Row"];
type PressReleaseRow = Database["public"]["Tables"]["press_releases"]["Row"];
type GalleryImageRow = Database["public"]["Tables"]["gallery_images"]["Row"];
type HeadlineRow = Database["public"]["Tables"]["headlines"]["Row"];
type HeroSlideRow = Database["public"]["Tables"]["hero_slides"]["Row"];

export type DynamicEvent = {
  id: number;
  title: string;
  titleNe: string;
  date: string;
  time: string;
  location: string;
  locationNe: string;
  description: string;
  descriptionNe: string;
  attendees: number;
  status: "upcoming" | "ongoing" | "completed";
  image?: string;
};

export type DynamicNotice = {
  id: number;
  title: string;
  titleNe: string;
  content: string;
  contentNe: string;
  date: string;
  priority: "high" | "medium" | "low";
  type: "announcement" | "deadline" | "info";
};

export type DynamicPressRelease = {
  id: number;
  title: string;
  titleNe: string;
  excerpt: string;
  excerptNe: string;
  date: string;
  category: string;
  categoryNe: string;
  link: string;
  image: string;
};

export type DynamicHeadline = {
  id: number;
  title: string;
  titleNe: string;
  date: string;
  link: string;
};

export type DynamicHeroSlide = {
  id: number;
  image: string;
  title: string;
  titleNe: string;
  subtitle: string;
  subtitleNe: string;
};

export type DynamicGalleryImage = {
  id: number;
  src: string;
  title: string;
  titleNe: string;
};

function normalizeStatus(value: string | null): DynamicEvent["status"] {
  if (value === "upcoming" || value === "ongoing" || value === "completed") {
    return value;
  }
  return "upcoming";
}

function mapEvent(row: EventRow): DynamicEvent {
  return {
    id: row.id,
    title: row.title,
    titleNe: row.title_ne,
    date: row.date || "",
    time: row.time || "",
    location: row.location || "",
    locationNe: row.location_ne || row.location || "",
    description: row.description || "",
    descriptionNe: row.description_ne || row.description || "",
    attendees: row.attendees || 0,
    status: normalizeStatus(row.status),
    image: row.image_url || undefined,
  };
}

function mapNotice(row: NoticeRow): DynamicNotice {
  const rawPriority = row.priority;
  const priority: DynamicNotice["priority"] =
    rawPriority === "high" || rawPriority === "low" ? rawPriority : "medium";

  const rawType = row.type;
  const type: DynamicNotice["type"] =
    rawType === "announcement" || rawType === "deadline" ? rawType : "info";

  return {
    id: row.id,
    title: row.title,
    titleNe: row.title_ne,
    content: row.content || "",
    contentNe: row.content_ne || row.content || "",
    date: row.date || "",
    priority,
    type,
  };
}

function mapPressRelease(row: PressReleaseRow): DynamicPressRelease {
  return {
    id: row.id,
    title: row.title,
    titleNe: row.title_ne,
    excerpt: row.excerpt || "",
    excerptNe: row.excerpt_ne || row.excerpt || "",
    date: row.date || "",
    category: "News",
    categoryNe: "समाचार",
    link: row.link || "#",
    image: row.image_url || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80",
  };
}

function mapHeadline(row: HeadlineRow): DynamicHeadline {
  return {
    id: row.id,
    title: row.title,
    titleNe: row.title_ne,
    date: row.date || "",
    link: row.link || "/press-releases",
  };
}

function mapHeroSlide(row: HeroSlideRow): DynamicHeroSlide {
  return {
    id: row.id,
    image: row.image_url,
    title: row.title,
    titleNe: row.title_ne,
    subtitle: row.subtitle || "",
    subtitleNe: row.subtitle_ne || row.subtitle || "",
  };
}

function mapGalleryImage(row: GalleryImageRow): DynamicGalleryImage {
  return {
    id: row.id,
    src: row.src,
    title: row.title || "Gallery Image",
    titleNe: row.title_ne || row.title || "ग्यालेरी फोटो",
  };
}

export async function fetchEvents(limit?: number): Promise<DynamicEvent[]> {
  if (!supabase) return [];

  let query = supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false, nullsFirst: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapEvent);
}

export async function fetchEventById(id: number): Promise<DynamicEvent | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;
  return mapEvent(data);
}

export async function fetchNotices(limit?: number): Promise<DynamicNotice[]> {
  if (!supabase) return [];

  let query = supabase
    .from("notices")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false, nullsFirst: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapNotice);
}

export async function fetchPressReleases(limit?: number): Promise<DynamicPressRelease[]> {
  if (!supabase) return [];

  let query = supabase
    .from("press_releases")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false, nullsFirst: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapPressRelease);
}

export async function fetchHeadlines(limit = 8): Promise<DynamicHeadline[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("headlines")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapHeadline);
}

export async function fetchHeroSlides(limit = 6): Promise<DynamicHeroSlide[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapHeroSlide);
}

export async function fetchGalleryImages(limit = 12): Promise<DynamicGalleryImage[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapGalleryImage);
}
