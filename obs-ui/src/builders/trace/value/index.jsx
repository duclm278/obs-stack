import { CustomValueEditor } from "@/components/builder/x-query-builder-value";
import { cn } from "@/lib/utils";
import { DurationValueEditor } from "./duration";
import { ServiceValueEditor } from "./service";
import { SpanValueEditor } from "./span";
import { StatusValueEditor } from "./status";

export const TraceValueEditor = ({
  className,
  field,
  fieldData,
  ...extraProps
}) => {
  switch (field) {
    case "service":
      return (
        <ServiceValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );
    case "span":
      return (
        <SpanValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );
    case "status":
      return (
        <StatusValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );
    case "duration":
      return (
        <DurationValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );
    case "tag":
      break;
  }

  return (
    <CustomValueEditor
      {...extraProps}
      className={cn("order-1", className)}
      field={field}
      fieldData={fieldData}
    />
  );
};

TraceValueEditor.displayName = "TraceValueEditor";
