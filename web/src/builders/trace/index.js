// Service
export const serviceOperators = [];

// Span
export const spanOperators = [];

// Status
export const statusOperators = [];

// Duration
export const durationOperators = [];

// Tag
export const tagOperators = [];

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
  },
  {
    name: "tags",
    label: "Tags",
  },
];
