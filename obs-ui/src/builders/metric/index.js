// Metric
export const metricLabelOperators = [
  {
    name: "=",
    label: "equals",
    defaultValue: ["", ""],
    out: '{% if v0.size > 0 and v1.size > 0 %}{{ v0 }}="{{ v1 }}"{% endif %}',
  },
  {
    name: "!=",
    label: "doesn't equal",
    defaultValue: ["", ""],
    out: '{% if v0.size > 0 and v1.size > 0 %}{{ v0 }}!="{{ v1 }}"{% endif %}',
  },
  {
    name: "=~",
    label: "matches regex",
    defaultValue: ["", []],
    out: '{% if v0.size > 0 and v1.size > 0 %}{{ v0 }}=~"{{ v1 | join: "|" }}"{% endif %}',
  },
  {
    name: "!~",
    label: "doesn't match regex",
    defaultValue: ["", []],
    out: '{% if v0.size > 0 and v1.size > 0 %}{{ v0 }}!~"{{ v1 | join: "|" }}"{% endif %}',
  },
];

export const metricSubCombinators = [
  {
    name: "filter",
    label: "FILTER",
    out: '{% if rules.size > 0 %}{{ "{" }}{{ rules | join: ", " }}{{ "}" }}{% endif %}',
  },
];

export const metricSubFields = [
  {
    name: "metric.label",
    label: "Label",
    operators: metricLabelOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
];

export const metricOperators = [
  {
    name: "=",
    label: "equals",
    defaultValue: ["", {}],
    out: "{{ v0 }}{{ v1.out }}",
  },
];

// Fields
export const fields = [
  {
    name: "metric",
    label: "Metric",
    operators: metricOperators,
    subCombinators: metricSubCombinators,
    subFields: metricSubFields,
    inputType: "text",
    placeholder: "$VALUE",
  },
];

// Combinators
export const combinators = [
  {
    name: "query",
    label: "QUERY",
    out: '{{ rules | join: "" }}',
  },
];
