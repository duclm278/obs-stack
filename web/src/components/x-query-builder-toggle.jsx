import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const ShadcnUiNotToggle = ({
  className,
  handleOnChange,
  label,
  checked,
  title,
  disabled,
}) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <Switch
        id="not-toggle"
        name="not-toggle"
        className={className}
        disabled={disabled}
        checked={checked}
        onCheckedChange={handleOnChange}
      />
      <Label htmlFor="not-toggle" title={title}>
        {label}
      </Label>
    </div>
  );
};

ShadcnUiNotToggle.displayName = "ShadcnUiNotToggle";
