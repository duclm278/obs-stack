// Stream
export const streamOperators = [
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

// Line
export const lineOperators = [
  {
    name: "|=",
    label: "contains",
    defaultValue: [[]],
    out: '|= `{{ v0 | join: "` or `" }}`',
  },
  {
    name: "!=",
    label: "doesn't contain",
    defaultValue: [[]],
    out: '!= `{{ v0 | join: "` or `" }}`',
  },
  {
    name: "|~ `(?i)<pattern>`",
    label: "contains case insensitive",
    defaultValue: [[]],
    out: '|= `(?i){{ v0 | join: "` or `(?i)" }}`',
  },
  {
    name: "!~ `(?i)<pattern>`",
    label: "doesn't contain case insensitive",
    defaultValue: [[]],
    out: '!~ `(?i){{ v0 | join: "` or `(?i)" }}`',
  },
  {
    name: "|~",
    label: "matches regex",
    defaultValue: [[]],
    out: '|~ `{{ v0 | join: "` or `" }}`',
  },
  {
    name: "!~",
    label: "doesn't match regex",
    defaultValue: [[]],
    out: '!~ `{{ v0 | join: "` or `" }}`',
  },
  {
    name: "|= ip(`<pattern>`)",
    label: "contains IP pattern",
    defaultValue: [""],
    out: "|= ip(`{{ v0 }}`)",
  },
  {
    name: "!= ip(`<pattern>`)",
    label: "doesn't contain IP pattern",
    defaultValue: [""],
    out: "!= ip(`{{ v0 }}`)",
  },
];

// Label
export const labelOperators = [
  {
    name: "=",
    label: "equals",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} = `{{ v1 }}`",
  },
  {
    name: "!=",
    label: "doesn't equal",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} != `{{ v1 }}`",
  },
  {
    name: "=~",
    label: "matches regex",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} =~ `{{ v1 }}`",
  },
  {
    name: "!~",
    label: "doesn't match regex",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} !~ `{{ v1 }}`",
  },
  {
    name: ">",
    label: ">",
    description: "greater than",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} >{% if v1.size > 0 %} {{ v1 }}{% endif %}",
  },
  {
    name: "<",
    label: "<",
    description: "less then",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} <{% if v1.size > 0 %} {{ v1 }}{% endif %}",
  },
  {
    name: ">=",
    label: ">=",
    description: "greater than or equal to",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} >={% if v1.size > 0 %} {{ v1 }}{% endif %}",
  },
  {
    name: "<=",
    label: "<=",
    description: "less than or equal to",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} <={% if v1.size > 0 %} {{ v1 }}{% endif %}",
  },
  {
    name: "= ip(`$VALUE`)",
    label: "equals IP pattern",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} = ip(`{{ v1 }}`)",
  },
  {
    name: "!= ip(`$VALUE`)",
    label: "doesn't equal IP pattern",
    defaultValue: ["", ""],
    out: "|{% if v0.size > 0 %} {{ v0 }}{% endif %} != ip(`{{ v1 }}`)",
  },
  {
    name: "__error__=``",
    label: "no pipeline errors",
    defaultValue: null,
    out: "| __error__=``",
  },
];

// Format
export const formatOperators = [
  {
    name: "json",
    label: "Json",
    defaultValue: [[]],
    out: '| json{% if v0.size > 0 %} {{ v0 | join: ", " }}{% endif %}',
  },
  {
    name: "logfmt",
    label: "Logfmt",
    defaultValue: [[], []],
    out: '| logfmt{% if v0[0].size > 0 %} {{ v0[0] }}{% endif %}{% if v0[1].size > 0 %} {{ v0[1] }}{% endif %}{% if v1.size > 0 %} {{ v1 | join: ", " }}{% endif %}',
  },
  {
    name: "regexp",
    label: "Regexp",
    defaultValue: [""],
    out: "| regexp `{{ v0 }}`",
  },
  {
    name: "pattern",
    label: "Pattern",
    defaultValue: [""],
    out: "| pattern `{{ v0 }}`",
  },
  {
    name: "unpack",
    label: "Unpack",
    defaultValue: null,
    out: "| unpack",
  },
  {
    name: "line_format",
    label: "Line",
    defaultValue: [""],
    out: "| line_format `{{ v0 }}`",
  },
  {
    name: "label_format",
    label: "Label",
    defaultValue: ["", ""],
    out: "| label_format {{ v1 }}={{ v0 }}",
  },
  {
    name: "unwrap",
    label: "Unwrap",
    defaultValue: ["", ""],
    out: "| unwrap{% if v1.size > 0 %} {{ v1 }}({{ v0 }}){% elsif v0.size > 0 %} {{ v0 }}{% endif %}",
  },
  {
    name: "decolorize",
    label: "Decolorize",
    defaultValue: null,
    out: "| decolorize",
  },
  {
    name: "drop",
    label: "Drop",
    defaultValue: [[]],
    out: '| drop{% if v0.size > 0 %} {{ v0 | join: ", " }}{% endif %}',
  },
  {
    name: "keep",
    label: "Keep",
    defaultValue: [[]],
    out: '| keep{% if v0.size > 0 %} {{ v0 | join: ", " }}{% endif %}',
  },
];

// Fields
export const fields = [
  {
    name: "stream",
    label: "Log",
    operators: streamOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
  {
    name: "line",
    label: "Line",
    operators: lineOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
  {
    name: "label",
    label: "Label",
    operators: labelOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
  {
    name: "format",
    label: "Format",
    operators: formatOperators,
    inputType: "text",
    placeholder: "$VALUE",
  },
];

// Combinators
export const combinators = [
  {
    name: "query",
    label: "QUERY",
    out: '{{ rules | join: " " }}',
  },
  {
    name: "stream",
    label: "STREAM",
    out: '{{ "{" }}{{ rules | join: ", " }}{{ "}" }}',
  },
];
