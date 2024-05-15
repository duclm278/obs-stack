// Stream
export const streamOperators = [
  { name: "=", label: "equals" },
  { name: "!=", label: "doesn't equal" },
  { name: "=~", label: "matches regex" },
  { name: "!~", label: "doesn't match regex" },
];

// Math
export const mathOperators = [
  { name: "+", label: "+" },
  { name: "-", label: "-" },
  { name: "*", label: "*" },
  { name: "/", label: "/" },
  { name: "%", label: "%" },
  { name: "^", label: "^" },
  { name: "==", label: "==" },
  { name: "!=", label: "!=" },
  { name: ">", label: ">" },
  { name: "<", label: "<" },
  { name: ">=", label: ">=" },
  { name: "<=", label: "<=" },
];

// Line
export const lineOperators = [
  { name: "|=", label: "contains" },
  { name: "!=", label: "doesn't contain" },
  { name: "|~ `(?i)$VALUE`", label: "contains case insensitive" },
  { name: "!~ `(?i)$VALUE`", label: "doesn't contain case insensitive" },
  { name: "|~", label: "matches regex" },
  { name: "!~", label: "doesn't match regex" },
  { name: "|= ip(`$VALUE`)", label: "contains IP pattern" },
  { name: "!= ip(`$VALUE`)", label: "doesn't contain IP pattern" },
];

// Label
export const labelOperators = [
  { name: "=", label: "equals" },
  { name: "!=", label: "doesn't equal" },
  { name: "=~", label: "matches regex" },
  { name: "!~", label: "doesn't match regex" },
  { name: ">", label: "greater than" },
  { name: "<", label: "less then" },
  { name: ">=", label: "greater than or equal to" },
  { name: "<=", label: "less than or equal to" },
  { name: "= ip(`$VALUE`)", label: "equals IP pattern" },
  { name: "!= ip(`$VALUE`)", label: "doesn't equal IP pattern" },
  { name: "__error__=``", label: "no pipeline errors" },
];

// Fields
export const fields = [
  {
    name: "stream",
    label: "Log",
    inputType: "label",
    operators: streamOperators,
    placeholder: "$VALUE",
  },
  {
    name: "math",
    label: "Math",
    inputType: "text",
    operators: mathOperators,
    placeholder: "$VALUE",
  },
  {
    name: "label",
    label: "Label",
    inputType: "label",
    operators: labelOperators,
    placeholder: "$VALUE",
  },
  {
    name: "line",
    label: "Line",
    inputType: "text",
    operators: lineOperators,
    placeholder: "$VALUE",
  },
];

// Combinators
export const combinators = [{ name: "query", label: "QUERY" }];
