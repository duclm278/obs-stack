import { convertValue } from "@/builders/common/value";
import { CustomValueEditor } from "@/components/builder/x-query-builder-value";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useDeepCompareEffect } from "react-use";

export const DurationValueEditor = ({
  className,
  context,
  disabled,
  field,
  fieldData,
  handleOnChange,
  operator,
  value,
  ...extraProps
}) => {
  const thisOperator = fieldData.operators.find((o) => o.name === operator);
  const numValues = thisOperator?.defaultValue?.length || 0;
  const isMultiple0 = Array.isArray(thisOperator?.defaultValue?.[0]);
  const isMultiple1 = Array.isArray(thisOperator?.defaultValue?.[1]);
  const v0 = convertValue(value?.[0], isMultiple0);
  const v1 = convertValue(value?.[1], isMultiple1);
  const fieldData0 = structuredClone(fieldData);
  const fieldData1 = structuredClone(fieldData);
  fieldData1.placeholder = "e.g. 100ms, 1.2s";

  useDeepCompareEffect(() => {
    if (numValues === 0) return;
    if (numValues === 1) return;
    if (numValues === 2 && JSON.stringify(value) !== JSON.stringify([v0, v1])) {
      handleOnChange([v0, v1]);
    }
  }, [handleOnChange, numValues, v0, v1, value]);

  if (numValues === 0 || numValues === 1) {
    return null;
  }

  return (
    <>
      <CustomValueEditor
        {...extraProps}
        className={cn("order-0 min-w-20 font-normal", className)}
        context={context}
        disabled={disabled}
        field={field}
        fieldData={fieldData0}
        handleOnChange={(v) => {
          handleOnChange([v, v1]);
        }}
        operator={operator}
        values={[
          { name: "duration", label: "Span" },
          { name: "traceDuration", label: "Trace" },
        ]}
        title="Type"
        type="select"
        value={v0}
      />
      <CustomValueEditor
        {...extraProps}
        className={cn("order-1", className)}
        context={context}
        disabled={disabled}
        field={field}
        fieldData={fieldData1}
        handleOnChange={(v) => {
          handleOnChange([v0, v]);
        }}
        operator={operator}
        title="Duration"
        value={v1}
      />
    </>
  );
};

DurationValueEditor.displayName = "DurationValueEditor";
