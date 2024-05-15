import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const CustomNotToggle = ({
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

CustomNotToggle.displayName = "CustomNotToggle";
