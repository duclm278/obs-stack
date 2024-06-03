import { Liquid } from "liquidjs";
import { defaultRuleProcessorSQL, getOption } from "react-querybuilder";

export const commonRuleProcessor = (rule, options) => {
  if (!options.fieldData) {
    return defaultRuleProcessorSQL(rule, options);
  }

  const o = getOption(options.fieldData.operators ?? [], rule.operator) ?? {};
  if (!Object.prototype.hasOwnProperty.call(o, "out")) {
    return defaultRuleProcessorSQL(rule, options);
  }

  const v = typeof rule.value === "string" ? [rule.value] : rule.value ?? [];
  if (!Array.isArray(v)) {
    return defaultRuleProcessorSQL(rule, options);
  }

  const context = v.reduce((acc, cur, idx) => {
    acc[`v${idx}`] = cur;
    return acc;
  }, {});

  return new Liquid().parseAndRenderSync(o.out, context);
};
