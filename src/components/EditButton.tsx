import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

const EditButton = ({ label = "Edit Section", onClick, className }: EditButtonProps) => {
  const handleClick = () => {
    console.info(`Edit requested: ${label}`);
    onClick?.();
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className={cn("gap-2", className)}
      onClick={handleClick}
      title={label}
    >
      <Pencil className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default EditButton;
