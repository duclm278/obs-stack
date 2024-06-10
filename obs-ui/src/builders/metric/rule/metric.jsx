import { CommonActionElementIcon } from "@/builders/common/action";
import { CommonFieldSelector } from "@/builders/common/field";
import { CommonOperatorSelector } from "@/builders/common/operator";
import { formatCommonQuery } from "@/builders/common/out/format";
import { commonRuleProcessor } from "@/builders/common/out/processor";
import { CustomActionElement } from "@/components/builder/x-query-builder-action";
import { HiddenElement } from "@/components/builder/x-query-builder-hidden";
import QueryBuilder, {
  TestID,
  formatQuery,
  useRule,
  useStopEventPropagation,
} from "react-querybuilder";
import { combinators, fields } from "..";
import { MetricValueEditor } from "../value";

export const SelectorRule = (props) => {
  const r = useRule(props);

  r.cloneRule = useStopEventPropagation(r.cloneRule);
  r.toggleLockRule = useStopEventPropagation(r.toggleLockRule);
  r.removeRule = useStopEventPropagation(r.removeRule);
  r.shiftRuleUp = useStopEventPropagation(r.shiftRuleUp);
  r.shiftRuleDown = useStopEventPropagation(r.shiftRuleDown);

  const {
    schema: {
      controls: {
        shiftActions: ShiftActionsControlElement,
        dragHandle: DragHandleControlElement,
        fieldSelector: FieldSelectorControlElement,
        valueSourceSelector: ValueSourceSelectorControlElement,
        valueEditor: ValueEditorControlElement,
        cloneRuleAction: CloneRuleActionControlElement,
        lockRuleAction: LockRuleActionControlElement,
        removeRuleAction: RemoveRuleActionControlElement,
      },
    },
  } = r;

  const value = r.rule.value?.[0] ?? "";
  const query = r.rule.value?.[1]?.query ?? {
    combinator: "filter",
    rules: [{ field: "metric.label", operator: "=", value: ["", ""] }],
  };
  const subCombinators = r.fieldData?.subCombinators ?? combinators;
  const subFields = r.fieldData?.subFields ?? fields;

  const formatOpts = {
    combinators: subCombinators,
    fields: subFields,
    format: "sql",
    ruleProcessor: commonRuleProcessor,
  };
  const out = formatCommonQuery(query, formatOpts);

  const dataPath = JSON.stringify(r.path);
  const metric = { value, query, formatOpts };
  r.context[dataPath] = metric;

  return (
    <div
      ref={r.dndRef}
      data-testid={TestID.rule}
      data-dragmonitorid={r.dragMonitorId}
      data-dropmonitorid={r.dropMonitorId}
      className={r.outerClassName}
      data-rule-id={r.id}
      data-level={r.path.length}
      data-path={dataPath}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          {r.schema.showShiftActions && (
            <ShiftActionsControlElement
              testID={TestID.shiftActions}
              level={r.path.length}
              path={r.path}
              titles={{
                shiftUp: r.translations.shiftActionUp.title,
                shiftDown: r.translations.shiftActionDown.title,
              }}
              labels={{
                shiftUp: r.translations.shiftActionUp.label,
                shiftDown: r.translations.shiftActionDown.label,
              }}
              className={r.classNames.shiftActions}
              disabled={r.disabled}
              shiftUp={r.shiftRuleUp}
              shiftDown={r.shiftRuleDown}
              shiftUpDisabled={r.shiftUpDisabled}
              shiftDownDisabled={r.shiftDownDisabled}
              context={r.context}
              validation={r.validationResult}
              schema={r.schema}
              ruleOrGroup={r.rule}
            />
          )}
          {r.schema.enableDragAndDrop && (
            <DragHandleControlElement
              testID={TestID.dragHandle}
              ref={r.dragRef}
              level={r.path.length}
              path={r.path}
              title={r.translations.dragHandle.title}
              label={r.translations.dragHandle.label}
              className={r.classNames.dragHandle}
              disabled={r.disabled}
              context={r.context}
              validation={r.validationResult}
              schema={r.schema}
              ruleOrGroup={r.rule}
            />
          )}
          <FieldSelectorControlElement
            testID={TestID.fields}
            options={r.schema.fields}
            title={r.translations.fields.title}
            value={r.rule.field}
            operator={r.rule.operator}
            className={r.classNames.fields}
            handleOnChange={r.generateOnChangeHandler("field")}
            level={r.path.length}
            path={r.path}
            disabled={r.disabled}
            context={r.context}
            validation={r.validationResult}
            schema={r.schema}
            rule={r.rule}
          />
          {(r.schema.autoSelectField ||
            r.rule.field !== r.translations.fields.placeholderName) && (
            <>
              {(r.schema.autoSelectOperator ||
                r.rule.operator !== r.translations.operators.placeholderName) &&
                !r.hideValueControls && (
                  <>
                    {!["null", "notNull"].includes(r.rule.operator) &&
                      r.valueSources.length > 1 && (
                        <ValueSourceSelectorControlElement
                          testID={TestID.valueSourceSelector}
                          field={r.rule.field}
                          fieldData={r.fieldData}
                          title={r.translations.valueSourceSelector.title}
                          options={r.valueSourceOptions}
                          value={r.rule.valueSource ?? "value"}
                          className={r.classNames.valueSource}
                          handleOnChange={r.generateOnChangeHandler(
                            "valueSource",
                          )}
                          level={r.path.length}
                          path={r.path}
                          disabled={r.disabled}
                          context={r.context}
                          validation={r.validationResult}
                          schema={r.schema}
                          rule={r.rule}
                        />
                      )}
                    <ValueEditorControlElement
                      testID={TestID.valueEditor}
                      field={r.rule.field}
                      fieldData={r.fieldData}
                      title={r.translations.value.title}
                      operator={r.rule.operator}
                      value={value}
                      valueSource={r.rule.valueSource ?? "value"}
                      type={r.valueEditorType}
                      inputType={r.inputType}
                      values={r.values}
                      listsAsArrays={r.schema.listsAsArrays}
                      parseNumbers={r.schema.parseNumbers}
                      separator={r.valueEditorSeparator}
                      className={r.classNames.value}
                      handleOnChange={(v) => {
                        r.generateOnChangeHandler("value")([v, { query, out }]);
                      }}
                      level={r.path.length}
                      path={r.path}
                      disabled={r.disabled}
                      context={r.context}
                      validation={r.validationResult}
                      schema={r.schema}
                      rule={r.rule}
                    />
                  </>
                )}
            </>
          )}
          {r.schema.showCloneButtons && (
            <CloneRuleActionControlElement
              testID={TestID.cloneRule}
              label={r.translations.cloneRule.label}
              title={r.translations.cloneRule.title}
              className={r.classNames.cloneRule}
              handleOnClick={r.cloneRule}
              level={r.path.length}
              path={r.path}
              disabled={r.disabled}
              context={r.context}
              validation={r.validationResult}
              ruleOrGroup={r.rule}
              schema={r.schema}
            />
          )}
          {r.schema.showLockButtons && (
            <LockRuleActionControlElement
              testID={TestID.lockRule}
              label={r.translations.lockRule.label}
              title={r.translations.lockRule.title}
              className={r.classNames.lockRule}
              handleOnClick={r.toggleLockRule}
              level={r.path.length}
              path={r.path}
              disabled={r.disabled}
              disabledTranslation={
                r.parentDisabled ? undefined : r.translations.lockRuleDisabled
              }
              context={r.context}
              validation={r.validationResult}
              ruleOrGroup={r.rule}
              schema={r.schema}
            />
          )}

          <RemoveRuleActionControlElement
            testID={TestID.removeRule}
            label={r.translations.removeRule.label}
            title={r.translations.removeRule.title}
            className={r.classNames.removeRule}
            handleOnClick={r.removeRule}
            level={r.path.length}
            path={r.path}
            disabled={r.disabled}
            context={r.context}
            validation={r.validationResult}
            ruleOrGroup={r.rule}
            schema={r.schema}
          />
        </div>

        <div className="-mt-1 ml-5">
          <QueryBuilder
            combinators={subCombinators}
            context={{ dateRange: r.context?.dateRange, parent: metric }}
            controlElements={{
              actionElement: CustomActionElement,
              addGroupAction: HiddenElement,
              fieldSelector: CommonFieldSelector,
              operatorSelector: CommonOperatorSelector,
              removeGroupAction: HiddenElement,
              removeRuleAction: CommonActionElementIcon,
              valueEditor: MetricValueEditor,
            }}
            fields={subFields}
            defaultQuery={
              query === ""
                ? {
                    combinator: "filter",
                    rules: [
                      { field: "metric.label", operator: "=", value: ["", ""] },
                    ],
                  }
                : query
            }
            onQueryChange={(v) => {
              const newQuery = formatQuery(v, "json_without_ids");
              const oldQuery = formatQuery(query, "json_without_ids");
              if (newQuery === oldQuery) return;
              r.generateOnChangeHandler("value")([
                value,
                { query: v, out: formatCommonQuery(v, formatOpts) },
              ]);
            }}
          />
        </div>
      </div>
    </div>
  );
};

SelectorRule.displayName = "SelectorRule";
