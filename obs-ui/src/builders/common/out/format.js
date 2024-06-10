import { Liquid } from "liquidjs";
import {
  defaultPlaceholderFieldName,
  defaultPlaceholderOperatorName,
  defaultRuleProcessorSQL,
  defaultValueProcessorByRule,
  formatQuery,
  getOption,
  isRuleGroup,
  isRuleGroupType,
  isRuleOrGroupValid,
  toFlatOptionArray,
  toFullOptionList,
} from "react-querybuilder";
import {
  isValueProcessorLegacy,
  numerifyValues,
  quoteFieldNamesWithArray,
} from "./utils";

export function formatCommonQuery(ruleGroup, options = {}) {
  let format = "json";
  let valueProcessorInternal = defaultValueProcessorByRule;
  let ruleProcessorInternal = null;
  let quoteFieldNamesWith = ["", ""];
  let validator = () => true;
  let fields = [];
  let validationMap = {};
  let fallbackExpression = "";
  let parseNumbers = false;
  let placeholderFieldName = defaultPlaceholderFieldName;
  let placeholderOperatorName = defaultPlaceholderOperatorName;
  let quoteValuesWith = "'";

  format = (options.format ?? "json").toLowerCase();
  const { valueProcessor = null, ruleProcessor = null } = options;
  if (typeof ruleProcessor === "function") {
    ruleProcessorInternal = ruleProcessor;
  }
  valueProcessorInternal =
    typeof valueProcessor === "function"
      ? (r, opts) =>
          isValueProcessorLegacy(valueProcessor)
            ? valueProcessor(r.field, r.operator, r.value, r.valueSource)
            : valueProcessor(r, opts)
      : defaultValueProcessorByRule;
  quoteFieldNamesWith = quoteFieldNamesWithArray(options.quoteFieldNamesWith);
  validator = options.validator ?? (() => true);
  fields = toFullOptionList(options.fields ?? []);
  fallbackExpression = options.fallbackExpression ?? "";
  parseNumbers = !!options.parseNumbers;
  placeholderFieldName =
    options.placeholderFieldName ?? defaultPlaceholderFieldName;
  placeholderOperatorName =
    options.placeholderOperatorName ?? defaultPlaceholderOperatorName;
  quoteValuesWith = options.quoteValuesWith ?? "'";

  /**
   * JSON
   */
  if (format === "json" || format === "json_without_ids") {
    const rg = parseNumbers ? numerifyValues(ruleGroup) : ruleGroup;
    if (format === "json") {
      return JSON.stringify(rg, null, 2);
    }
    return JSON.stringify(rg, (key, value) =>
      // Remove `id` and `path` keys; leave everything else unchanged.
      key === "id" || key === "path" ? undefined : value,
    );
  }

  // istanbul ignore else
  if (typeof validator === "function") {
    const validationResult = validator(ruleGroup);
    if (typeof validationResult === "boolean") {
      if (validationResult === false) {
        return fallbackExpression;
      }
    } else {
      validationMap = validationResult;
    }
  }

  const validatorMap = {};
  const uniqueFields = toFlatOptionArray(fields);
  uniqueFields.forEach((f) => {
    // istanbul ignore else
    if (typeof f.validator === "function") {
      validatorMap[f.value ?? /* istanbul ignore next */ f.name] = f.validator;
    }
  });

  const validateRule = (rule) => {
    let validationResult = undefined;
    let fieldValidator = undefined;
    if (rule.id) {
      validationResult = validationMap[rule.id];
    }
    if (uniqueFields.length) {
      const fieldArr = uniqueFields.filter((f) => f.name === rule.field);
      if (fieldArr.length) {
        const field = fieldArr[0];
        // istanbul ignore else
        if (typeof field.validator === "function") {
          fieldValidator = field.validator;
        }
      }
    }
    return [validationResult, fieldValidator];
  };

  /**
   * SQL
   */
  if (format === "sql") {
    const processRuleGroup = (rg, outermostOrLonelyInGroup) => {
      if (
        !isRuleOrGroupValid(
          rg,
          validationMap[rg.id ?? /* istanbul ignore next */ ""],
        )
      ) {
        return outermostOrLonelyInGroup
          ? fallbackExpression
          : /* istanbul ignore next */ "";
      }

      const processedRules = rg.rules.map((rule) => {
        // Independent combinators
        if (typeof rule === "string") {
          return rule;
        }

        // Groups
        if (isRuleGroup(rule)) {
          return processRuleGroup(rule, rg.rules.length === 1);
        }

        // Basic rule validation
        const [validationResult, fieldValidator] = validateRule(rule);
        if (
          !isRuleOrGroupValid(rule, validationResult, fieldValidator) ||
          rule.field === placeholderFieldName ||
          rule.operator === placeholderOperatorName
        ) {
          return "";
        }

        const escapeQuotes = (rule.valueSource ?? "value") === "value";

        const fieldData = getOption(fields, rule.field);

        // Use custom rule processor if provided...
        if (typeof ruleProcessorInternal === "function") {
          return ruleProcessorInternal(rule, {
            parseNumbers,
            escapeQuotes,
            quoteFieldNamesWith,
            fieldData,
            format,
            quoteValuesWith,
          });
        }
        // ...otherwise use default rule processor and pass in the value
        // processor (which may be custom)
        return defaultRuleProcessorSQL(rule, {
          parseNumbers,
          escapeQuotes,
          valueProcessor: valueProcessorInternal,
          quoteFieldNamesWith,
          fieldData,
          format,
          quoteValuesWith,
        });
      });

      if (processedRules.length === 0) {
        return fallbackExpression;
      }

      // Custom combinators
      const c = getOption(options.combinators ?? [], rg.combinator);
      if (c) {
        const context = {
          rules: processedRules.filter(Boolean),
        };
        return new Liquid().parseAndRenderSync(c.out, context);
      }

      return `${rg.not ? "NOT " : ""}(${processedRules
        .filter(Boolean)
        .join(isRuleGroupType(rg) ? ` ${rg.combinator} ` : " ")})`;
    };

    return processRuleGroup(ruleGroup, true);
  }

  return formatQuery(ruleGroup, options);
}
