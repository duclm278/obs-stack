import { GripVertical } from "lucide-react";
import * as React from "react";

export const CustomDragHandle = React.forwardRef(
  ({ className, title }, dragRef) => (
    <span ref={dragRef} className={className} title={title}>
      <GripVertical className="h-5 w-5 text-input" />
    </span>
  ),
);

CustomDragHandle.displayName = "CustomDragHandle";
