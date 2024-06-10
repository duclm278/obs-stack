import { CustomValueSelector } from "@/components/builder/x-query-builder-value";
import { cn } from "@/lib/utils";

export const TraceFieldSelector = ({ className, ...extraProps }) => (
  <CustomValueSelector
    {...extraProps}
    className={cn("min-w-[100px]", className)}
  />
);

TraceFieldSelector.displayName = "TraceFieldSelector";
