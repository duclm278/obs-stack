import { CustomValueSelector } from "@/components/builder/x-query-builder-value";
import { cn } from "@/lib/utils";

export const CommonFieldSelector = ({ className, ...extraProps }) => (
  <CustomValueSelector
    {...extraProps}
    className={cn("min-w-[88px]", className)}
  />
);

CommonFieldSelector.displayName = "CommonFieldSelector";
