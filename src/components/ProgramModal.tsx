import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

// Matches the DB table — id is omitted for creation
export interface ProgramFormData {
  id?: number;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  deadline: string; // ISO date string (YYYY-MM-DD)
  category: string;
}

const CATEGORIES = [
  "digital-literacy",
  "it-club",
  "agriculture",
  "women-in-tech",
  "e-governance",
  "health-ict",
  "cybersecurity",
  "general",
] as const;

const CATEGORY_LABELS: Record<string, { en: string; ne: string }> = {
  "digital-literacy": { en: "Digital Literacy", ne: "डिजिटल साक्षरता" },
  "it-club": { en: "IT Club Development", ne: "आईटी क्लब विकास" },
  agriculture: { en: "ICT in Agriculture", ne: "कृषिमा आईसीटी" },
  "women-in-tech": { en: "Women in Tech", ne: "प्रविधिमा महिला" },
  "e-governance": { en: "E-Governance", ne: "ई-गभर्नेन्स" },
  "health-ict": { en: "Health & ICT", ne: "स्वास्थ्य र आईसीटी" },
  cybersecurity: { en: "Cybersecurity", ne: "साइबर सुरक्षा" },
  general: { en: "General", ne: "सामान्य" },
};

const emptyForm: ProgramFormData = {
  title: "",
  titleNe: "",
  description: "",
  descriptionNe: "",
  deadline: "",
  category: "general",
};

interface ProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If provided, the modal is in "edit" mode */
  initial?: ProgramFormData;
  /** Called when the user clicks Save */
  onSubmit: (data: ProgramFormData) => void | Promise<void>;
  isSaving?: boolean;
}

const ProgramModal = ({
  open,
  onOpenChange,
  initial,
  onSubmit,
  isSaving = false,
}: ProgramModalProps) => {
  const { isNepali } = useLanguage();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<ProgramFormData>(initial ?? emptyForm);

  useEffect(() => {
    if (open) setForm(initial ?? emptyForm);
  }, [open, initial]);

  const set = <K extends keyof ProgramFormData>(
    key: K,
    value: ProgramFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? isNepali
                ? "कार्यक्रम सम्पादन"
                : "Edit Program"
              : isNepali
              ? "नयाँ कार्यक्रम थप्नुहोस्"
              : "Add New Program"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title EN */}
          <div className="space-y-1.5">
            <Label htmlFor="prog-title">
              Title (EN) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="prog-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Web Development Bootcamp"
              required
            />
          </div>

          {/* Title NE */}
          <div className="space-y-1.5">
            <Label htmlFor="prog-title-ne">
              Title (NE) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="prog-title-ne"
              value={form.titleNe}
              onChange={(e) => set("titleNe", e.target.value)}
              placeholder="e.g. वेब डेभलपमेन्ट बुटक्याम्प"
              required
            />
          </div>

          {/* Description EN */}
          <div className="space-y-1.5">
            <Label htmlFor="prog-desc">Description (EN)</Label>
            <Textarea
              id="prog-desc"
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of the program…"
            />
          </div>

          {/* Description NE */}
          <div className="space-y-1.5">
            <Label htmlFor="prog-desc-ne">Description (NE)</Label>
            <Textarea
              id="prog-desc-ne"
              rows={3}
              value={form.descriptionNe}
              onChange={(e) => set("descriptionNe", e.target.value)}
              placeholder="कार्यक्रमको संक्षिप्त विवरण…"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-1.5">
            <Label htmlFor="prog-deadline">
              {isNepali ? "म्याद" : "Deadline"}
            </Label>
            <Input
              id="prog-deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>{isNepali ? "श्रेणी" : "Category"}</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {isNepali
                      ? CATEGORY_LABELS[cat].ne
                      : CATEGORY_LABELS[cat].en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              {isNepali ? "रद्द गर्नुहोस्" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? isNepali
                  ? "सेभ हुँदैछ…"
                  : "Saving…"
                : isNepali
                ? "सेभ गर्नुहोस्"
                : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CATEGORY_LABELS };
export default ProgramModal;
