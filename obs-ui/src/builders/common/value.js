export const convertValue = (v, isMultiple) => {
  if (!v) {
    return isMultiple ? [] : "";
  }
  if (Array.isArray(v) && isMultiple) {
    return v.filter((i) => i !== "");
  }
  if (Array.isArray(v) && !isMultiple) {
    return v.find((item) => item !== "") ?? "";
  }
  if (typeof v === "string" && isMultiple) {
    return v ? [v] : [];
  }
  return v;
};
