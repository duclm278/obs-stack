// Stream
export const streamOperators = [
  {
    name: "=",
    label: "=",
    description: "equals",
  },
  {
    name: "!=",
    label: "!=",
    description: "doesn't equal",
  },
  {
    name: "=~",
    label: "=~",
    description: "matches regex",
  },
  {
    name: "!~",
    label: "!~",
    description: "doesn't match regex",
  },
];

// Math
export const mathOperators = [
  {
    name: "+",
    label: "+",
    description: "add",
  },
  {
    name: "-",
    label: "-",
    description: "subtract",
  },
  {
    name: "*",
    label: "*",
    description: "multiply by",
  },
  {
    name: "/",
    label: "/",
    description: "divide by",
  },
  {
    name: "%",
    label: "%",
    description: "modulo by",
  },
  {
    name: "^",
    label: "^",
    description: "exponent",
  },
  {
    name: "==",
    label: "==",
    description: "equal to",
  },
  {
    name: "!=",
    label: "!=",
    description: "not equal to",
  },
  {
    name: ">",
    label: ">",
    description: "greater than",
  },
  {
    name: "<",
    label: "<",
    description: "less than",
  },
  {
    name: ">=",
    label: ">=",
    description: "greater than or equal to",
  },
  {
    name: "<=",
    label: "<=",
    description: "less than or equal to",
  },
];

// Line
export const lineOperators = [
  {
    name: "|=",
    label: "|=",
    description: "contains",
  },
  {
    name: "!=",
    label: "!=",
    description: "doesn't contain",
  },
  {
    name: "|~ `(?i)$VALUE`",
    label: "|~ `(?i)$VALUE`",
    description: "contains case insensitive",
  },
  {
    name: "!~ `(?i)$VALUE`",
    label: "!~ `(?i)$VALUE`",
    description: "doesn't contain case insensitive",
  },
  {
    name: "|~",
    label: "|~",
    description: "matches regex",
  },
  {
    name: "!~",
    label: "!~",
    description: "doesn't match regex",
  },
  {
    name: "|= ip(`$VALUE`)",
    label: "|= ip(`$VALUE`)",
    description: "contains IP pattern",
  },
  {
    name: "!= ip(`$VALUE`)",
    label: "!= ip(`$VALUE`)",
    description: "doesn't contain IP pattern",
  },
];

// Label
export const labelOperators = [
  {
    name: "=",
    label: "=",
    description: "equals",
  },
  {
    name: "!=",
    label: "!=",
    description: "doesn't equal",
  },
  {
    name: "=~",
    label: "=~",
    description: "matches regex",
  },
  {
    name: "!~",
    label: "!~",
    description: "doesn't match regex",
  },
  {
    name: ">",
    label: ">",
    description: "greater than",
  },
  {
    name: "<",
    label: "<",
    description: "less then",
  },
  {
    name: ">=",
    label: ">=",
    description: "greater than or equal to",
  },
  {
    name: "<=",
    label: "<=",
    description: "less than or equal to",
  },
  {
    name: "= ip(`$VALUE`)",
    label: "= ip(`$VALUE`)",
    description: "equals IP pattern",
  },
  {
    name: "!= ip(`$VALUE`)",
    label: "!= ip(`$VALUE`)",
    description: "doesn't equal IP pattern",
  },
  {
    name: "__error__=``",
    label: "__error__=``",
    description: "no pipeline errors",
  },
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
    name: "aggregation",
    label: "Aggregation",
    inputType: "text",
    operators: [{ name: "#", label: "#" }],
    placeholder: "$VALUE",
  },
  {
    name: "format",
    label: "Format",
    inputType: "text",
    operators: [{ name: "#", label: "#" }],
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
  {
    name: "range",
    label: "Range",
    inputType: "text",
    operators: [{ name: "#", label: "#" }],
    placeholder: "$VALUE",
  },
];

// Combinators
export const combinators = [{ name: "query", label: "QUERY" }];
