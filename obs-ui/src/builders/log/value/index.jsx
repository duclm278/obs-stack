import { CustomValueEditor } from "@/components/builder/x-query-builder-value";
import { cn } from "@/lib/utils";
import { FormatValueEditor } from "./format";
import { LabelValueEditor } from "./label";
import { LineValueEditor } from "./line";
import { StreamValueEditor } from "./stream";

export const LogValueEditor = ({
  className,
  field,
  fieldData,
  ...extraProps
}) => {
  switch (field) {
    case "stream":
      return (
        <StreamValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );

    case "line":
      return (
        <LineValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );

    case "label":
      return (
        <LabelValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );

    case "format":
      return (
        <FormatValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );
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

LogValueEditor.displayName = "LogValueEditor";
