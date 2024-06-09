import traceService from "@/api/trace";
import { formatCommonQuery } from "@/builders/common/out/format";
import { commonRuleProcessor } from "@/builders/common/out/processor";
import { convertValue } from "@/builders/common/value";
import { MultiSelectInput } from "@/components/input/x-multi-select-input";
import { SelectInput } from "@/components/input/x-select-input";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  findPath,
  getQuerySelectorById,
  useQueryBuilderSelector,
} from "react-querybuilder";
import { combinators, fields } from "..";
import { useDeepCompareEffect } from "react-use";

export const StatusValueEditor = ({
  className,
  disabled,
  fieldData,
  handleOnChange,
  operator,
  path,
  schema,
  value,
}) => {
  const [open0, setOpen0] = React.useState(false);
  const [loading0, setLoading0] = React.useState(false);
  const [options0, setOptions0] = React.useState([]);

  const thisOperator = fieldData.operators.find((o) => o.name === operator);
  const numValues = thisOperator?.defaultValue?.length || 0;
  const isMultiple0 = Array.isArray(thisOperator?.defaultValue?.[0]);
  const v0 = convertValue(value?.[0], isMultiple0);

  const query = useQueryBuilderSelector(getQuerySelectorById(schema.qbId));
  const formatOpts = {
    combinators,
    fields,
    format: "sql",
    ruleProcessor: commonRuleProcessor,
  };

  useDeepCompareEffect(() => {
    if (numValues === 0) return;
    if (numValues === 1 && JSON.stringify(value) !== JSON.stringify([v0])) {
      handleOnChange([v0]);
    }
  }, [handleOnChange, numValues, v0, value]);

  if (numValues === 0) {
    return null;
  }

  const searchTagValues = async (tag, params) => {
    setLoading0(true);
    try {
      const resp = await traceService.getTagValuesV2(tag, params);
      const newOptions = resp.tagValues
        .sort((a, b) => a.value.localeCompare(b.value))
        .map((i) => ({
          value: i.value,
          label: i.value,
        }));
      setOptions0(newOptions);
    } catch (error) {
      setOptions0([]);
    } finally {
      setLoading0(false);
    }
  };

  const handleOnServiceOpenChange = (open) => {
    setOpen0(open);
    setOptions0([]);
    if (!open) return;

    const tag = "status";
    const newQuery = structuredClone(query);

    const id = findPath(path, query)?.id;
    if (id) {
      newQuery.rules = newQuery.rules.filter((r) => r.id !== id);
    }

    const out = formatCommonQuery(newQuery, formatOpts);
    if (!out) {
      searchTagValues(tag);
      return;
    }

    searchTagValues(tag, { q: out });
  };

  return (
    <>
      {isMultiple0 ? (
        <MultiSelectInput
          buttonPlaceholder="$VALUES"
          className={cn("order-1", className)}
          disabled={disabled}
          loading={loading0}
          loadingText="Loading..."
          noOptionsText="No values found."
          onOpenChange={handleOnServiceOpenChange}
          onValueChange={(v) => {
            handleOnChange([v]);
            handleOnServiceOpenChange(false);
          }}
          open={open0}
          options={options0}
          searchPlaceholder="Search values..."
          title="Status"
          value={v0}
        />
      ) : (
        <SelectInput
          buttonPlaceholder="$VALUE"
          className={cn("order-1", className)}
          disabled={disabled}
          loading={loading0}
          loadingText="Loading..."
          noOptionsText="No values found."
          onOpenChange={handleOnServiceOpenChange}
          onValueChange={(v) => {
            handleOnChange([v]);
            handleOnServiceOpenChange(false);
          }}
          open={open0}
          options={options0}
          searchPlaceholder="Search values..."
          title="Status"
          value={v0}
        />
      )}
    </>
  );
};

StatusValueEditor.displayName = "StatusValueEditor";
