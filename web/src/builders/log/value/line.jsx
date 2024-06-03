import { convertValue } from "@/builders/common/value";
import { CustomValueEditor } from "@/components/builder/x-query-builder-value";
import { MultiSelectInput } from "@/components/input/x-multi-select-input";
import { cn } from "@/lib/utils";
import * as React from "react";

export const LineValueEditor = ({
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
  const [open0, setOpen1] = React.useState(false);

  const thisOperator = fieldData.operators.find((o) => o.name === operator);
  const numValues = thisOperator?.defaultValue?.length || 0;
  const isMultiple0 = Array.isArray(thisOperator?.defaultValue?.[0]);
  const v0 = convertValue(value?.[0], isMultiple0);

  React.useEffect(() => {
    if (numValues === 0) return;
    if (numValues === 1 && JSON.stringify(value) !== JSON.stringify([v0])) {
      handleOnChange([v0]);
    }
  }, [handleOnChange, numValues, v0, value]);

  if (numValues === 0) {
    return null;
  }

  return (
    <>
      {isMultiple0 ? (
        <MultiSelectInput
          buttonPlaceholder="$VALUES"
          className={cn("order-1", className)}
          disabled={disabled}
          noOptionsText="Search or create values."
          onOpenChange={setOpen1}
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

LineValueEditor.displayName = "LineValueEditor";
