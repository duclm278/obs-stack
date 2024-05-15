import {
  ChevronDown,
  ChevronUp,
  Copy,
  Lock,
  Plus,
  Unlock,
  X,
} from "lucide-react";
import { getCompatContextProvider } from "react-querybuilder";
import {
  CustomActionElement,
  CustomActionElementIcon,
} from "./x-query-builder-action";
import { CustomDragHandle } from "./x-query-builder-dnd";
import "./x-query-builder-styles.scss";
import { CustomNotToggle } from "./x-query-builder-toggle";
import {
  CustomValueEditor,
  CustomValueSelector,
} from "./x-query-builder-value";

const customControlClassnames = {
  queryBuilder: "queryBuilder-branches pb-2 [&>.ruleGroup]:border-none",
  body: "px-0 pt-1",
};

const customControlElements = {
  actionElement: CustomActionElement,
  removeGroupAction: CustomActionElementIcon,
  removeRuleAction: CustomActionElementIcon,
  valueSelector: CustomValueSelector,
  valueEditor: CustomValueEditor,
  notToggle: CustomNotToggle,
  dragHandle: CustomDragHandle,
};

const customTranslations = {
  addRule: {
    label: (
      <>
        <Plus className="mr-2 h-4 w-4" /> Rule
      </>
    ),
  },
  addGroup: {
    label: (
      <>
        <Plus className="mr-2 h-4 w-4" /> Group
      </>
    ),
  },
  removeGroup: { label: <X className="h-4 w-4" /> },
  removeRule: { label: <X className="h-4 w-4" /> },
  cloneRuleGroup: { label: <Copy className="h-4 w-4" /> },
  cloneRule: { label: <Copy className="h-4 w-4" /> },
  lockGroup: { label: <Unlock className="h-4 w-4" /> },
  lockRule: { label: <Unlock className="h-4 w-4" /> },
  lockGroupDisabled: { label: <Lock className="h-4 w-4" /> },
  lockRuleDisabled: { label: <Lock className="h-4 w-4" /> },
  shiftActionDown: { label: <ChevronDown className="h-4 w-4" /> },
  shiftActionUp: { label: <ChevronUp className="h-4 w-4" /> },
};

export const QueryBuilderCustom = getCompatContextProvider({
  key: "shadcn/ui",
  controlClassnames: customControlClassnames,
  controlElements: customControlElements,
  translations: customTranslations,
});
