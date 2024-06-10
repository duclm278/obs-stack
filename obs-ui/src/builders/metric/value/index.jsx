import { CustomValueEditor } from "@/components/builder/x-query-builder-value";
import { cn } from "@/lib/utils";
import { MetricLabelValueEditor } from "./metric/label";
import { MetricNameValueEditor } from "./metric/name";

export const MetricValueEditor = ({
  className,
  field,
  fieldData,
  ...extraProps
}) => {
  switch (field) {
    case "metric":
      return (
        <MetricNameValueEditor
          {...extraProps}
          className={className}
          field={field}
          fieldData={fieldData}
        />
      );
    case "metric.label":
      return (
        <MetricLabelValueEditor
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

MetricValueEditor.displayName = "MetricValueEditor";
