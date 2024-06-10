import { isRuleGroup, parseNumber } from "react-querybuilder";

export const numerifyValues = (rg) => ({
  ...rg,
  rules: rg.rules.map((r) => {
    if (typeof r === "string") {
      return r;
    }

    if (isRuleGroup(r)) {
      return numerifyValues(r);
    }

    let { value } = r;
    if (typeof value === "string") {
      value = parseNumber(value, { parseNumbers: true });
    }

    return { ...r, value };
  }),
});

export const isValueProcessorLegacy = (vp) => vp.length >= 3;

export const quoteFieldNamesWithArray = (quoteFieldNamesWith = ["", ""]) =>
  Array.isArray(quoteFieldNamesWith)
    ? quoteFieldNamesWith
    : typeof quoteFieldNamesWith === "string"
      ? [quoteFieldNamesWith, quoteFieldNamesWith]
      : quoteFieldNamesWith ?? ["", ""];
