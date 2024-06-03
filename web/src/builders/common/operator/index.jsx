import { CustomValueSelector } from "@/components/builder/x-query-builder-value";
import { cn } from "@/lib/utils";

export const CommonOperatorSelector = ({ className, ...extraProps }) => {
  return (
    <CustomValueSelector {...extraProps} className={cn("order-1", className)} />
  );
};

CommonOperatorSelector.displayName = "CommonOperatorSelector";
