import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCw } from "lucide-react";

export const Refresh = ({ value, onValueChange, options }) => (
  <Tooltip>
    <Select value={value} onValueChange={onValueChange}>
      <TooltipTrigger asChild>
        <SelectTrigger className="h-8 space-x-1 border-none">
          <RefreshCw className="h-4 w-4" />
          <SelectValue placeholder="Select an interval" />
        </SelectTrigger>
      </TooltipTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
      <TooltipContent sideOffset={6}>Auto-refresh controls</TooltipContent>
    </Select>
  </Tooltip>
);

Refresh.displayName = "Refresh";
