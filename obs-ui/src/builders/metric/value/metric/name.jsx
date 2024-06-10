import metricService from "@/api/metric";
import { formatCommonQuery } from "@/builders/common/out/format";
import { SelectInput } from "@/components/input/x-select-input";
import { cn } from "@/lib/utils";
import * as React from "react";

export const MetricNameValueEditor = ({
  className,
  context,
  disabled,
  handleOnChange,
  path,
  value,
}) => {
  const [open0, setOpen0] = React.useState(false);
  const [loading0, setLoading0] = React.useState(false);
  const [options0, setOptions0] = React.useState([]);

  const dataPath = JSON.stringify(path);
  const v0 = value ?? "";

  const getLabelValues = async (name, params) => {
    if (!name) return;
    setLoading0(true);
    try {
      const resp = await metricService.getLabelValues(name, params);
      const newValueOptions = resp.data.map((i) => ({
        value: i,
        label: i,
      }));
      setOptions0(newValueOptions);
    } catch (error) {
      setOptions0([]);
    } finally {
      setLoading0(false);
    }
  };

  const handleOnValueOpenChange = (open) => {
    setOpen0(open);
    setOptions0([]);
    if (!open) return;
    if (!context[dataPath]?.formatOpts) {
      getLabelValues({
        start: context.dateRange?.from,
        end: context.dateRange?.to,
      });
      return;
    }

    const query = context[dataPath]?.query;
    if (!query) {
      getLabelValues("__name__", {
        start: context.dateRange?.from,
        end: context.dateRange?.to,
      });
      return;
    }

    const out = formatCommonQuery(query, context[dataPath]?.formatOpts);
    if (!out) {
      getLabelValues("__name__", {
        start: context.dateRange?.from,
        end: context.dateRange?.to,
      });
      return;
    }

    getLabelValues("__name__", {
      start: context.dateRange?.from,
      end: context.dateRange?.to,
      match: [out],
    });
  };

  return (
    <SelectInput
      buttonPlaceholder="$VALUE"
      className={cn("order-1", className)}
      disabled={disabled}
      loading={loading0}
      loadingText="Loading..."
      noOptionsText="No metrics found."
      onOpenChange={handleOnValueOpenChange}
      onValueChange={(v) => {
        handleOnChange(v);
        handleOnValueOpenChange(false);
      }}
      open={open0}
      options={options0}
      searchPlaceholder="Search values..."
      title="Value"
      value={v0}
    />
  );
};

MetricNameValueEditor.displayName = "MetricNameValueEditor";
