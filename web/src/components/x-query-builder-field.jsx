/* eslint-disable no-unused-vars */
import { CustomValueSelector } from "./x-query-builder-value";

export const CustomFieldSelector = ({
  className,
  handleOnChange,
  options,
  value,
  title,
  disabled,
  // Props that should not be in extraProps
  testID: _testID,
  rule: _rule,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  operator: _operator,
  schema: _schema,
  ...extraProps
}) => {
  const thisField = options.find((f) => f.name === value);
  console.log("thisField", thisField);
  console.log(extraProps);
  return (
    <>
      <CustomValueSelector
        {...extraProps}
        className={className}
        handleOnChange={handleOnChange}
        options={options}
        value={value}
        title={title}
        disabled={disabled}
      />
      {thisField.inputType === "autocomplete" && (
        <CustomValueSelector
          {...extraProps}
          className={className}
          handleOnChange={handleOnChange}
          options={options}
          value={value}
          title={title}
          disabled={disabled}
        />
      )}
    </>
  );
};

CustomFieldSelector.displayName = "CustomFieldSelector";
