import { convertValue } from "@/builders/common/value";
import { CustomValueEditor } from "@/components/builder/x-query-builder-value";
import { MultiSelectInput } from "@/components/input/x-multi-select-input";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useDeepCompareEffect } from "react-use";

export const FormatValueEditor = ({
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
  const [open0, setOpen0] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  const thisOperator = fieldData.operators.find((o) => o.name === operator);
  const numValues = thisOperator?.defaultValue?.length || 0;
  const isMultiple0 = Array.isArray(thisOperator?.defaultValue?.[0]);
  const isMultiple1 = Array.isArray(thisOperator?.defaultValue?.[1]);
  const v0 = convertValue(value?.[0], isMultiple0);
  const v1 = convertValue(value?.[1], isMultiple1);
  const fieldData0 = structuredClone(fieldData);
  const fieldData1 = structuredClone(fieldData);

  useDeepCompareEffect(() => {
    if (numValues === 0) return;
    if (numValues === 1 && JSON.stringify(value) !== JSON.stringify([v0])) {
      handleOnChange([v0]);
    }
    if (numValues === 2 && JSON.stringify(value) !== JSON.stringify([v0, v1])) {
      handleOnChange([v0, v1]);
    }
  }, [handleOnChange, numValues, v0, v1, value]);

  if (numValues === 0) {
    return null;
  }

  switch (operator) {
    case "logfmt":
      return (
        <>
          <CustomValueEditor
            {...extraProps}
            className={cn("order-1 font-normal", className)}
            context={context}
            disabled={disabled}
            field={field}
            fieldData={fieldData0}
            handleOnChange={(v) => {
              handleOnChange([v, v1]);
            }}
            multiple
            operator={operator}
            values={[
              { name: "--strict", label: "--strict" },
              { name: "--keep-empty", label: "--keep-empty" },
            ]}
            title="Flags"
            type="multiselect"
            value={v0}
          />
          <MultiSelectInput
            buttonPlaceholder="$EXPRESSIONS"
            className={cn("order-1", className)}
            disabled={disabled}
            noOptionsText="Search or create expressions."
            onOpenChange={setOpen1}
            onValueChange={(v) => {
              handleOnChange([v0, v]);
            }}
            open={open1}
            options={[]}
            searchPlaceholder="Type something..."
            title="Expressions"
            value={v1}
          />
        </>
      );
    case "label_format":
      fieldData0.placeholder = "$OLD_LABEL";
      fieldData1.placeholder = "$NEW_LABEL";
      return (
        <>
          <CustomValueEditor
            {...extraProps}
            className={cn("order-1", className)}
            context={context}
            disabled={disabled}
            field={field}
            fieldData={fieldData0}
            handleOnChange={(v) => {
              handleOnChange([v, v1]);
            }}
            operator={operator}
            title="Old label"
            value={v0}
          />
          <span className={cn("order-1 text-sm", className)}>to</span>
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
            title="New label"
            value={v1}
          />
        </>
      );
    case "unwrap":
      fieldData0.placeholder = "$LABEL";
      return (
        <>
          <CustomValueEditor
            {...extraProps}
            className={cn("order-1", className)}
            context={context}
            disabled={disabled}
            field={field}
            fieldData={fieldData0}
            handleOnChange={(v) => {
              handleOnChange([v, v1]);
            }}
            operator={operator}
            title="Label"
            value={v0}
          />
          <span className={cn("order-1 text-sm", className)}>to</span>
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
            values={[
              { name: "duration", label: "duration" },
              { name: "duration_seconds", label: "duration seconds" },
              { name: "bytes", label: "bytes" },
            ]}
            title="Format"
            type="select"
            value={v1}
          />
        </>
      );
  }

  return (
    <>
      {isMultiple0 ? (
        <MultiSelectInput
          buttonPlaceholder="$VALUES"
          className={cn("order-1", className)}
          disabled={disabled}
          noOptionsText="Search or create values."
          onOpenChange={setOpen0}
          onValueChange={(v) => {
            handleOnChange([v]);
          }}
          open={open0}
          options={[]}
          searchPlaceholder="Type something..."
          title="Values"
          value={v0}
        />
      ) : (
        <CustomValueEditor
          {...extraProps}
          className={cn("order-1", className)}
          context={context}
          disabled={disabled}
          field={field}
          fieldData={fieldData}
          handleOnChange={(v) => {
            handleOnChange([v]);
          }}
          operator={operator}
          value={v0}
        />
      )}
    </>
  );
};

FormatValueEditor.displayName = "FormatValueEditor";
