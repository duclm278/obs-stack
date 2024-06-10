import { Rule } from "react-querybuilder";
import { SelectorRule } from "./metric";

export const MetricRule = (props) => {
  if (props.field === "metric") {
    return <SelectorRule {...props} />;
  }

  return <Rule {...props} />;
};

MetricRule.displayName = "MetricRule";
