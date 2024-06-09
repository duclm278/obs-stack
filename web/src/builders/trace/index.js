// Service
export const serviceOperators = [
  {
    name: "=",
    label: "equals",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}resource.service.name={{ v0 | json }}{% endif %}",
  },
  {
    name: "!=",
    label: "doesn't equal",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}resource.service.name!={{ v0 | json }}{% endif %}",
  },
  {
    name: "=~",
    label: "matches regex",
    defaultValue: [[]],
    out: '{% if v0.size > 0 %}resource.service.name=~"{{ v0 | join: "|" }}"{% endif %}',
  },
  {
    name: "!~",
    label: "doesn't match regex",
    defaultValue: [[]],
    out: '{% if v0.size > 0 %}resource.service.name!~"{{ v0 | join: "|" }}"{% endif %}',
  },
  {
    name: ">",
    label: ">",
    description: "greater than",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}resource.service.name>{{ v0 | json }}{% endif %}",
  },
  {
    name: "<",
    label: "<",
    description: "less then",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}resource.service.name<{{ v0 | json }}{% endif %}",
  },
  {
    name: ">=",
    label: ">=",
    description: "greater than or equal to",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}resource.service.name>={{ v0 | json }}{% endif %}",
  },
  {
    name: "<=",
    label: "<=",
    description: "less than or equal to",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}resource.service.name<={{ v0 | json }}{% endif %}",
  },
];

// Span
export const spanOperators = [
  {
    name: "=",
    label: "equals",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}name={{ v0 | json }}{% endif %}",
  },
  {
    name: "!=",
    label: "doesn't equal",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}name!={{ v0 | json }}{% endif %}",
  },
  {
    name: "=~",
    label: "matches regex",
    defaultValue: [[]],
    out: '{% if v0.size > 0 %}name=~"{{ v0 | join: "|" }}"{% endif %}',
  },
  {
    name: "!~",
    label: "doesn't match regex",
    defaultValue: [[]],
    out: '{% if v0.size > 0 %}name!~"{{ v0 | join: "|" }}"{% endif %}',
  },
  {
    name: ">",
    label: ">",
    description: "greater than",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}name>{{ v0 | json }}{% endif %}",
  },
  {
    name: "<",
    label: "<",
    description: "less then",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}name<{{ v0 | json }}{% endif %}",
  },
  {
    name: ">=",
    label: ">=",
    description: "greater than or equal to",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}name>={{ v0 | json }}{% endif %}",
  },
  {
    name: "<=",
    label: "<=",
    description: "less than or equal to",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}name<={{ v0 | json }}{% endif %}",
  },
];

// Status
export const statusOperators = [
  {
    name: "=",
    label: "equals",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}status={{ v0 }}{% endif %}",
  },
  {
    name: "!=",
    label: "doesn't equal",
    defaultValue: [""],
    out: "{% if v0.size > 0 %}status!={{ v0 }}{% endif %}",
  },
];

// Duration
export const durationOperators = [
  {
    name: ">",
    label: ">",
    description: "greater than",
    defaultValue: ["", ""],
    out: "{% if v0.size > 0 and v1.size > 0 %}{{ v0 }}>{{ v1 }}{% endif %}",
  },
  {
    name: "<",
    label: "<",
    description: "less then",
    defaultValue: ["", ""],
    out: "{% if v0.size > 0 and v1.size > 0 %}{{ v0 }}<{{ v1 }}{% endif %}",
  },
  {
    name: ">=",
    label: ">=",
    description: "greater than or equal to",
    defaultValue: ["", ""],
    out: "{% if v0.size > 0 and v1.size > 0 %}{{ v0 }}>={{ v1 }}{% endif %}",
  },
  {
    name: "<=",
    label: "<=",
    description: "less than or equal to",
    defaultValue: ["", ""],
    out: "{% if v0.size > 0 and v1.size > 0 %}{{ v0 }}<={{ v1 }}{% endif %}",
  },
];

// TODO: Tag
export const tagOperators = [
  {
    name: "=",
    label: "equals",
    defaultValue: ["", ""],
    out: "",
  },
  {
    name: "!=",
    label: "doesn't equal",
    defaultValue: ["", ""],
  },
  {
    name: "=~",
    label: "matches regex",
    defaultValue: ["", []],
  },
  {
    name: "!~",
    label: "doesn't match regex",
    defaultValue: ["", []],
  },
  {
    name: ">",
    label: ">",
    description: "greater than",
    defaultValue: ["", ""],
  },
  {
    name: "<",
    label: "<",
    description: "less then",
    defaultValue: ["", ""],
  },
  {
    name: ">=",
    label: ">=",
    description: "greater than or equal to",
    defaultValue: ["", ""],
  },
  {
    name: "<=",
    label: "<=",
    description: "less than or equal to",
    defaultValue: ["", ""],
  },
];

// Fields
export const fields = [
  {
    name: "service",
    label: "Service",
    operators: serviceOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
  {
    name: "span",
    label: "Span",
    operators: spanOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
  {
    name: "status",
    label: "Status",
    operators: statusOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
  {
    name: "duration",
    label: "Duration",
    operators: durationOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
  {
    name: "tag",
    label: "Tag",
    operators: tagOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
];

// Combinators
export const combinators = [
  {
    name: "query",
    label: "QUERY",
    out: '{{ "{" }}{{ rules | join: " && " }}{{ "}" }}',
  },
];
