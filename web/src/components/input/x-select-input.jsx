import { AutoComplete } from "@/components/input/auto-complete";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

export const SelectInput = ({
  buttonPlaceholder = "",
  className,
  disabled,
  loading,
  loadingText = "Loading...",
  noOptionsText = "No results found.",
  onOpenChange,
  onValueChange,
  open,
  options,
  searchPlaceholder = "Search...",
  title,
  value,
}) => (
  <Popover open={disabled ? false : open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        disabled={disabled}
        className={cn(
          "whitespace-normal font-normal",
          "flex w-full items-center justify-between px-3 py-2",
          "[&>span]:line-clamp-1 [&>span]:text-left [&>svg]:flex-shrink-0",
          "placeholder:text-muted-foreground hover:bg-background disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        title={title || ""}
      >
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-muted-foreground">{buttonPlaceholder}</span>
        )}
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" className="w-full p-0">
      <AutoComplete
        loading={loading}
        loadingText={loadingText}
        noOptionsText={noOptionsText}
        onValueChange={onValueChange}
        options={options}
        placeholder={searchPlaceholder}
        value={value}
      />
    </PopoverContent>
  </Popover>
);

SelectInput.displayName = "SelectInput";
