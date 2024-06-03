import metricService from "@/api/metric";
import { formatCommonQuery } from "@/builders/common/out/format";
import { convertValue } from "@/builders/common/value";
import { MultiSelectInput } from "@/components/input/x-multi-select-input";
import { SelectInput } from "@/components/input/x-select-input";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  findPath,
  getParentPath,
  getQuerySelectorById,
  useQueryBuilderSelector,
} from "react-querybuilder";

export const MetricLabelValueEditor = ({
  className,
  context,
  disabled,
  fieldData,
  handleOnChange,
  operator,
  schema,
  path,
  value,
}) => {
  const [open0, setOpen0] = React.useState(false);
  const [loading0, setLoading0] = React.useState(false);
  const [options0, setOptions0] = React.useState([]);
  const [open1, setOpen1] = React.useState(false);
  const [loading1, setLoading1] = React.useState(false);
  const [options1, setOptions1] = React.useState([]);

  const thisOperator = fieldData.operators.find((o) => o.name === operator);
  const isMultiple0 = Array.isArray(thisOperator?.defaultValue?.[0]);
  const isMultiple1 = Array.isArray(thisOperator?.defaultValue?.[1]);
  const v0 = convertValue(value?.[0], isMultiple0);
  const v1 = convertValue(value?.[1], isMultiple1);

  const query = useQueryBuilderSelector(getQuerySelectorById(schema.qbId));
  const parentPath = getParentPath(path);
  const parentGroup = findPath(parentPath, query);

  React.useEffect(() => {
    if (thisOperator?.defaultValue === null) return;
    if (JSON.stringify(value) !== JSON.stringify([v0, v1])) {
      handleOnChange([v0, v1]);
    }
  }, [handleOnChange, v0, thisOperator, v1, value]);

  const getLabels = async (params) => {
    setLoading0(true);
    try {
      const resp = await metricService.getLabels(params);
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
    if (!open) return;
    if (!context.metric?.formatOpts) {
      getLabels({
        start: context.dateRange?.from,
        end: context.dateRange?.to,
      });
      return;
    }

    const newQuery = structuredClone(parentGroup);
    const name = context.metric?.value;
    console.log("name", name);
    if (name) {
      newQuery.rules.unshift({
        field: "metric.label",
        operator: "=",
        value: ["__name__", name],
      });
    }
    const id = findPath(path, query)?.id;
    if (id) {
      newQuery.rules = newQuery.rules.filter((r) => r.id !== id);
    }

    const out = formatCommonQuery(newQuery, context.metric.formatOpts);
    if (!out) {
      getLabels({
        start: context.dateRange?.from,
        end: context.dateRange?.to,
      });
      return;
    }

    getLabels({
      start: context.dateRange?.from,
      end: context.dateRange?.to,
      match: [out],
    });
  };

  const getLabelValues = async (name, params) => {
    if (!name) return;
    setLoading1(true);
    try {
      const resp = await metricService.getLabelValues(name, params);
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
          buttonPlaceholder="$VALUE"
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

MetricLabelValueEditor.displayName = "MetricLabelValueEditor";
