/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CustomActionElement = ({
  className,
  handleOnClick,
  label,
  title,
  disabled,
  disabledTranslation,
  // Props that should not be in extraProps
  testID: _testID,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  ruleOrGroup: _ruleOrGroup,
  schema: _schema,
  ...extraProps
}) => (
  <Button
    variant="outline"
    className={cn(className, "border-2 border-dashed")}
    title={disabledTranslation && disabled ? disabledTranslation.title : title}
    onClick={(e) => handleOnClick(e)}
    disabled={disabled && !disabledTranslation}
    {...extraProps}
  >
    {disabledTranslation && disabled ? disabledTranslation.label : label}
  </Button>
);

CustomActionElement.displayName = "CustomActionElement";

export const CustomActionElementIcon = ({
  className,
  handleOnClick,
  label,
  title,
  disabled,
  disabledTranslation,
  // Props that should not be in extraProps
  testID: _testID,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  ruleOrGroup: _ruleOrGroup,
  schema: _schema,
  ...extraProps
}) => (
  <Button
    size="icon"
    variant="outline"
    className={cn(className, "flex-none border-2 border-dashed")}
    title={disabledTranslation && disabled ? disabledTranslation.title : title}
    onClick={(e) => handleOnClick(e)}
    disabled={disabled && !disabledTranslation}
    {...extraProps}
  >
    {disabledTranslation && disabled ? disabledTranslation.label : label}
  </Button>
);

CustomActionElementIcon.displayName = "CustomActionElementIcon";
