import {
  CustomActionElement,
  CustomActionElementIcon,
} from "@/components/builder/x-query-builder-action";
import { cn } from "@/lib/utils";

export const CommonActionElement = ({ className, ...extraProps }) => (
  <CustomActionElement {...extraProps} className={cn("order-9", className)} />
);

CommonActionElement.displayName = "CommonActionElement";

export const CommonActionElementIcon = ({ className, ...extraProps }) => (
  <CustomActionElementIcon
    {...extraProps}
    className={cn("order-9", className)}
  />
);

CommonActionElementIcon.displayName = "CommonActionElementIcon";
