import { useState, useRef, useEffect, ReactNode } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type EditableVariant = "text" | "textarea" | "date";

interface EditableFieldProps {
  /** Current display value */
  value: string;
  /** Nepali value — shown alongside the English field when present */
  valueNe?: string;
  /** Whether the current user is allowed to edit */
  canEdit: boolean;
  /** Called with the new value(s) when the user clicks Save */
  onSave: (value: string, valueNe?: string) => void | Promise<void>;
  /** Input type: single-line, multiline, or date picker */
  variant?: EditableVariant;
  /** Additional class names for the display wrapper */
  className?: string;
  /** Render prop for customising the display state — receives the value */
  children?: (value: string) => ReactNode;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Label shown above the bilingual fields */
  label?: string;
  /** Show the bilingual (Nepali) input alongside the English one */
  bilingual?: boolean;
}

const EditableField = ({
  value,
  valueNe,
  canEdit,
  onSave,
  variant = "text",
  className,
  children,
  placeholder,
  label,
  bilingual = false,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [draftNe, setDraftNe] = useState(valueNe ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync external value changes
  useEffect(() => {
    if (!isEditing) {
      setDraft(value);
      setDraftNe(valueNe ?? "");
    }
  }, [value, valueNe, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(draft, bilingual ? draftNe : undefined);
      setIsEditing(false);
    } catch {
      // Keep editing open so the user can retry
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setDraftNe(valueNe ?? "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleCancel();
    if (e.key === "Enter" && variant !== "textarea" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  // ── Display mode ──────────────────────────────────────────────
  if (!isEditing) {
    return (
      <span className={cn("group relative inline-flex items-start gap-1", className)}>
        {children ? children(value) : <span>{value || placeholder}</span>}
        {canEdit && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary focus:opacity-100"
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    );
  }

  // ── Edit mode ─────────────────────────────────────────────────
  const fieldProps = {
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(e.target.value),
    onKeyDown: handleKeyDown,
    placeholder: placeholder ?? "Enter value…",
    disabled: isSaving,
    className: "text-sm",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      )}

      {/* English field */}
      <div className="flex items-center gap-2">
        {bilingual && (
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            EN
          </span>
        )}
        {variant === "textarea" ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            rows={3}
            {...fieldProps}
          />
        ) : variant === "date" ? (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="date"
            {...fieldProps}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            {...fieldProps}
          />
        )}
      </div>

      {/* Nepali field (bilingual) */}
      {bilingual && (
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            NE
          </span>
          {variant === "textarea" ? (
            <Textarea
              rows={3}
              value={draftNe}
              onChange={(e) => setDraftNe(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="नेपालीमा लेख्नुहोस्…"
              disabled={isSaving}
              className="text-sm"
            />
          ) : (
            <Input
              type="text"
              value={draftNe}
              onChange={(e) => setDraftNe(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="नेपालीमा लेख्नुहोस्…"
              disabled={isSaving}
              className="text-sm"
            />
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="h-7 gap-1 px-2 text-xs"
        >
          <Check className="h-3.5 w-3.5" />
          {isSaving ? "Saving…" : "Save"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={isSaving}
          className="h-7 gap-1 px-2 text-xs"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditableField;
