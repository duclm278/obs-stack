import logService from "@/api/log";
import { convertValue } from "@/builders/common/value";
import { MultiSelectInput } from "@/components/input/x-multi-select-input";
import { SelectInput } from "@/components/input/x-select-input";
import { cn } from "@/lib/utils";
import * as React from "react";

export const StreamValueEditor = ({
  className,
  context,
  disabled,
  fieldData,
  handleOnChange,
  operator,
  value,
}) => {
  const [open0, setOpen0] = React.useState(false);
  const [loading0, setLoading0] = React.useState(false);
  const [options0, setOptions0] = React.useState([]);
  const [open1, setOpen1] = React.useState(false);
  const [loading1, setLoading1] = React.useState(false);
  const [options1, setOptions1] = React.useState([]);

  const thisOperator = fieldData.operators.find((o) => o.name === operator);
  const numValues = thisOperator?.defaultValue?.length || 0;
  const isMultiple0 = Array.isArray(thisOperator?.defaultValue?.[0]);
  const isMultiple1 = Array.isArray(thisOperator?.defaultValue?.[1]);
  const v0 = convertValue(value?.[0], isMultiple0);
  const v1 = convertValue(value?.[1], isMultiple1);

  React.useEffect(() => {
    if (numValues === 0) return;
    if (numValues === 1) return;
    if (numValues === 2 && JSON.stringify(value) !== JSON.stringify([v0, v1])) {
      handleOnChange([v0, v1]);
    }
  }, [handleOnChange, numValues, v0, v1, value]);

  if (numValues === 0 || numValues === 1) {
    return null;
  }

  const getLabels = async (params) => {
    setLoading0(true);
    try {
      const resp = await logService.getLabels(params);
      const newKeyOptions = resp.data.map((i) => ({
        value: i,
        label: i,
      }));
      setOptions0(newKeyOptions);
    } catch (error) {
      setOptions0([]);
    } finally {
      setLoading0(false);
    }
  };

  const handleOnLabelOpenChange = (open) => {
    setOpen0(open);
    setOptions0([]);
    if (open) {
      getLabels({
        start: context.dateRange?.from,
        end: context.dateRange?.to,
      });
    }
  };

  const getLabelValues = async (name, params) => {
    if (!name) return;
    setLoading1(true);
    try {
      const resp = await logService.getLabelValues(name, params);
      const newValueOptions = resp.data.map((i) => ({
        value: i,
        label: i,
      }));
      setOptions1(newValueOptions);
    } catch (error) {
      setOptions1([]);
    } finally {
      setLoading1(false);
    }
  };

  const handleOnValueOpenChange = (open) => {
    setOpen1(open);
    setOptions1([]);
    if (open) {
      getLabelValues(v0, {
        start: context.dateRange?.from,
        end: context.dateRange?.to,
      });
    }
  };

  return (
    <>
      <SelectInput
        buttonPlaceholder="$LABEL"
        className={cn("order-0", className)}
        disabled={disabled}
        loading={loading0}
        loadingText="Loading..."
        noOptionsText="No labels found."
        onOpenChange={handleOnLabelOpenChange}
        onValueChange={(v) => {
          handleOnChange([v, v1]);
          handleOnLabelOpenChange(false);
        }}
        open={open0}
        options={options0}
        searchPlaceholder="Search labels..."
        title="Label"
        value={v0}
      />
      {isMultiple1 ? (
        <MultiSelectInput
          buttonPlaceholder="$VALUES"
          className={cn("order-1", className)}
          disabled={disabled}
          loading={loading1}
          loadingText="Loading..."
          noOptionsText="No values found."
          onOpenChange={handleOnValueOpenChange}
          onValueChange={(v) => {
            handleOnChange([v0, v]);
          }}
          open={open1}
          options={options1}
          searchPlaceholder="Search values..."
          title="Values"
          value={v1}
        />
      ) : (
        <SelectInput
          buttonPlaceholder="$VALUE"
          className={cn("order-1", className)}
          disabled={disabled}
          loading={loading1}
          loadingText="Loading..."
          noOptionsText="No values found."
          onOpenChange={handleOnValueOpenChange}
          onValueChange={(v) => {
            handleOnChange([v0, v]);
            handleOnValueOpenChange(false);
          }}
          open={open1}
          options={options1}
          searchPlaceholder="Search values..."
          title="Value"
          value={v1}
        />
      )}
    </>
  );
};

StreamValueEditor.displayName = "StreamValueEditor";
