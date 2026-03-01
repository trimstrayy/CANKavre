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
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

interface ProgramFormField {
  label: string;
  type: "text" | "email" | "date";
  required: boolean;
}

const defaultFormFields: ProgramFormField[] = [
  { label: "Name", type: "text", required: true },
  { label: "Email", type: "email", required: true },
  { label: "Location", type: "text", required: true },
];

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
  const [showFormFields, setShowFormFields] = useState(false);
  const [formFields, setFormFields] = useState<ProgramFormField[]>(
    initial?.formFields ?? defaultFormFields
  );
  const [newField, setNewField] = useState<ProgramFormField>({
    label: "",
    type: "text",
    required: false,
  });

  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyForm);
      setFormFields(initial?.formFields ?? defaultFormFields);
    }
  }, [open, initial]);

  const handleAddField = () => {
    if (!newField.label) return;
    setFormFields([...formFields, newField]);
    setNewField({ label: "", type: "text", required: false });
  };

  const handleRemoveField = (idx: number) => {
    setFormFields(formFields.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...form, formFields }); // Save form fields to DB
  };

  const [activeTab, setActiveTab] = useState<'info' | 'form'>('info');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
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
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'info' | 'form')} className="w-full">
          <TabsList className="mb-6 flex gap-2 justify-center">
            <TabsTrigger value="info" className="px-6 py-2 rounded-lg font-semibold text-base">
              {isNepali ? "कार्यक्रम जानकारी" : "Program Information"}
            </TabsTrigger>
            <TabsTrigger value="form" className="px-6 py-2 rounded-lg font-semibold text-base">
              {isNepali ? "दर्ता फारम व्यवस्थापन" : "Manage Registration Form"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <Card className="shadow-none border border-muted bg-background">
              <CardHeader>
                <CardTitle>{isNepali ? "कार्यक्रम जानकारी" : "Program Information"}</CardTitle>
              </CardHeader>
              <CardContent>
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
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="form">
            <Card className="shadow-none border border-muted bg-background">
              <CardHeader>
                <CardTitle>{isNepali ? "दर्ता फारम व्यवस्थापन" : "Manage Registration Form"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{isNepali ? "फारमका फिल्डहरू" : "Form Fields"}</Label>
                    {formFields.length === 0 && (
                      <p className="text-muted-foreground text-sm">{isNepali ? "कुनै फिल्ड छैन।" : "No fields yet."}</p>
                    )}
                    {formFields.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded bg-muted/40">
                        <span className="font-medium">{field.label}</span>
                        <span className="text-xs text-muted-foreground">({field.type}) {field.required ? "*" : ""}</span>
                        <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveField(idx)}>
                          {isNepali ? "हटाउनुहोस्" : "Remove"}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 items-end">
                    <Input
                      placeholder={isNepali ? "फिल्ड नाम" : "Field Label"}
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    />
                    <select value={newField.type} onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}>
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="date">Date</option>
                    </select>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" checked={newField.required} onChange={(e) => setNewField({ ...newField, required: e.target.checked })} />
                      {isNepali ? "आवश्यक" : "Required"}
                    </label>
                    <Button type="button" onClick={handleAddField}>{isNepali ? "थप्नुहोस्" : "Add"}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter className="pt-4 flex gap-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
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
      </DialogContent>
    </Dialog>
  );
};

export { CATEGORY_LABELS };
export default ProgramModal;
