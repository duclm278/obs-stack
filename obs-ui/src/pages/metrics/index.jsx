import metricService from "@/api/metric";
import {
  CommonActionElement,
  CommonActionElementIcon,
} from "@/builders/common/action";
import { CommonFieldSelector } from "@/builders/common/field";
import { CommonOperatorSelector } from "@/builders/common/operator";
import { formatCommonQuery } from "@/builders/common/out/format";
import { commonRuleProcessor } from "@/builders/common/out/processor";
import { combinators, fields } from "@/builders/metric";
import { MetricRule } from "@/builders/metric/rule";
import { MetricValueEditor } from "@/builders/metric/value";
import { QueryBuilderCustom } from "@/components/builder/x-query-builder";
import { HiddenElement } from "@/components/builder/x-query-builder-hidden";
import { Refresh } from "@/components/date/auto-refresh";
import { refreshOptions } from "@/components/date/auto-refresh-presets";
import { DateRangePicker } from "@/components/date/x-date-picker";
import { dateRangePresets } from "@/components/date/x-date-picker-presets";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart } from "@/components/viz/x-line";
import { cn } from "@/lib/utils";
import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import {
  differenceInMilliseconds,
  differenceInSeconds,
  endOfDay,
  format,
  isAfter,
  startOfDay,
  subMilliseconds,
} from "date-fns";
import { ChevronDown, Loader2, Play, Plus } from "lucide-react";
import Prism from "prismjs";
import * as React from "react";
import * as ReactDnD from "react-dnd";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";
import QueryBuilder from "react-querybuilder";
import { toast } from "sonner";
import promqlGrammar from "./prism.js";
import "./prism.scss";

const metricLimit = 7;
const metricDataLimit = 250;
const defaultQuery = {
  combinator: "query",
  rules: [
    {
      field: "metric",
      operator: "=",
      value: [
        "container_memory_rss",
        {
          query: {
            combinator: "filter",
            rules: [{ field: "metric.label", operator: "=", value: ["", ""] }],
          },
        },
      ],
    },
  ],
};

export default function PageMetrics() {
  const [queries, setQueries] = React.useState([
    {
      format: "builder",
      builder: defaultQuery,
      code: "",
    },
  ]);
  const [dateRange, setDateRange] = React.useState(() => ({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  }));
  const [refreshInterval, setRefreshInterval] = React.useState(
    refreshOptions[0].value,
  );
  const [dataLoading, setDataLoading] = React.useState(false);
  const [, setData] = React.useState([]);
  const [dataFlatten, setDataFlatten] = React.useState([]);
  const [dataCategories, setDataCategories] = React.useState([]);

  const formatOpts = {
    combinators,
    fields,
    format: "sql",
    ruleProcessor: commonRuleProcessor,
  };
  const formatLang = { name: "promql", grammar: promqlGrammar };
  const out = formatCommonQuery(queries[0].builder, formatOpts);

  const getQueryRange = async (params) => {
    setDataLoading(true);
    try {
      const resp = await metricService.getQueryRange(params);
      const newData = resp.data.result.slice(0, metricLimit);
      setData(newData);
      const newDataFlatten = [];
      const numValues = newData?.[0]?.values?.length ?? 0;
      for (let i = 0; i < numValues; i++) {
        const obj = {
          date: format(
            new Date(newData[0].values[i][0] * 1000),
            "yyyy-MM-dd HH:mm:ss.SSS",
          ),
        };
        for (const d of newData) {
          const metric = JSON.stringify(d.metric);
          obj[metric] = d.values[i][1];
        }
        newDataFlatten.push(obj);
      }
      setDataFlatten(newDataFlatten);
      setDataCategories(newData.map((d) => JSON.stringify(d.metric)));
    } catch (error) {
      const msg = error.response?.data?.message ?? error.message;
      toast.error("Metrics", {
        description: msg,
        action: { label: "Hide", onClick: () => {} },
      });
      setData([]);
    } finally {
      setDataLoading(false);
    }
  };

  const handleOnQuery = (start, end) => {
    const query =
      queries[0].format === "builder"
        ? formatCommonQuery(queries[0].builder, formatOpts)
        : queries[0].out;
    const now = new Date();
    let s = start ?? dateRange?.from ?? new Date();
    let e = end ?? dateRange?.to ?? new Date();
    s = isAfter(s, now) ? now : s;
    e = isAfter(e, now) ? now : e;
    getQueryRange({
      query,
      start: s,
      end: e,
      step: Math.ceil(differenceInSeconds(e, s) / metricDataLimit),
    });
  };

  React.useEffect(() => {
    if (refreshInterval === refreshOptions[0].value) return;

    const now = new Date();
    let s = dateRange?.from ?? new Date();
    let e = dateRange?.to ?? new Date();
    s = isAfter(s, now) ? now : s;
    e = isAfter(e, now) ? now : e;
    const diff = differenceInMilliseconds(e, s);

    // Query once immediately
    handleOnQuery(subMilliseconds(new Date(), diff), new Date());

    // Query next periodically
    const t = setInterval(() => {
      // https://stackoverflow.com/a/66762968
      let currentDataLoading;
      setDataLoading((prev) => {
        currentDataLoading = prev;
        return prev;
      });
      if (currentDataLoading) return;

      handleOnQuery(subMilliseconds(new Date(), diff), new Date());
    }, refreshInterval * 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries, refreshInterval]);

  return (
    <Collapsible
      defaultOpen
      className="flex h-full flex-1 flex-col gap-y-6 p-0"
    >
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-x-8">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight">Metrics</h2>
          <p className="text-muted-foreground">
            Metrics are numerical measurements that offer a high-level view of a
            system&apos;s performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CollapsibleTrigger
            asChild
            className="font-medium transition-all [&[data-state=open]>svg]:rotate-180"
          >
            <Button variant="outline" className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </Button>
          </CollapsibleTrigger>

          <div className="flex items-center rounded-md border border-input">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              presets={dateRangePresets}
              enableYearNavigation
              showTimePicker
              granularity="second"
              className="h-8 w-11 gap-x-0 border-none shadow-none hover:bg-background focus-visible:z-10 focus-visible:ring-offset-1"
            />

            <Separator orientation="vertical" className="h-[20px]" />

            <Refresh
              value={refreshInterval}
              onValueChange={setRefreshInterval}
              options={refreshOptions}
            />
          </div>

          <Button
            disabled={
              dataLoading || refreshInterval !== refreshOptions[0].value
            }
            onClick={() => handleOnQuery()}
            className="h-8 w-20 px-3"
          >
            {dataLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Find
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <CollapsibleContent className="mb-2 grid grid-cols-[repeat(auto-fit,minmax(min(525px,100%),1fr))] gap-x-6 gap-y-4">
          <QueryBuilderCustom>
            <QueryBuilderDnD
              dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}
              controlElements={{ rule: MetricRule }}
            >
              <Tabs
                value={queries[0].format}
                onValueChange={(v) => {
                  const newQuery = structuredClone(queries[0]);
                  newQuery.format = v;
                  const newQueries = queries.map((q, i) =>
                    i === 0 ? newQuery : q,
                  );
                  setQueries(newQueries);
                }}
                className="gap-y-3"
              >
                <div className="flex h-10 items-center justify-between">
                  <Label htmlFor="query-a">Query A</Label>
                  <TabsList>
                    <TabsTrigger value="builder" className="w-20">
                      Builder
                    </TabsTrigger>
                    <TabsTrigger value="code" className="w-20">
                      Code
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent
                  value="builder"
                  tabIndex={-1}
                  className="space-y-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <ScrollArea className="rounded-lg border bg-background shadow-sm">
                    <QueryBuilder
                      combinators={combinators}
                      context={{ dateRange }}
                      controlElements={{
                        actionElement: CommonActionElement,
                        addGroupAction: HiddenElement,
                        fieldSelector: CommonFieldSelector,
                        operatorSelector: CommonOperatorSelector,
                        removeRuleAction: CommonActionElementIcon,
                        valueEditor: MetricValueEditor,
                      }}
                      fields={fields}
                      query={queries[0].builder}
                      onQueryChange={(v) => {
                        const newQuery = structuredClone(queries[0]);
                        newQuery.builder = v;
                        const newQueries = queries.map((q, i) =>
                          i === 0 ? newQuery : q,
                        );
                        setQueries(newQueries);
                      }}
                    />
                    <ScrollBar
                      forceMount
                      orientation="horizontal"
                      className="h-2"
                    />
                  </ScrollArea>

                  {out && (
                    <ScrollArea className="rounded-lg border bg-background shadow-sm">
                      <pre
                        aria-label="selector"
                        className="prism-syntax-highlight break-all px-3 py-1.5 text-sm ligatures-none"
                        dangerouslySetInnerHTML={{
                          __html: Prism.highlight(
                            out,
                            formatLang.grammar,
                            formatLang.name,
                          ),
                        }}
                      />
                      <ScrollBar
                        forceMount
                        orientation="horizontal"
                        className="h-2"
                      />
                    </ScrollArea>
                  )}
                </TabsContent>
                <TabsContent value="code">
                  <div
                    className={cn(
                      "rounded-lg border bg-background p-0 shadow-sm",
                      "![&_.monaco-editor_.cursor]:invisible [&_.monaco-editor]:rounded-lg [&_.monaco-editor_.overflow-guard]:rounded-lg [&_.monaco-editor_.suggest-widget]:min-h-6",
                      "[&_.monaco-placeholder::after]:font-mono",
                      "[&_.monaco-placeholder::after]:text-muted-foreground",
                      "[&_.monaco-placeholder::after]:content-['Enter_a_PromQL_query...']",
                    )}
                  >
                    <Input
                      placeholder="Enter a PromQL query..."
                      className="border-none font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </QueryBuilderDnD>
          </QueryBuilderCustom>

          <div className="flex flex-col gap-y-3">
            <div className="hidden items-center justify-between min-[1157px]:flex min-[1157px]:h-9">
              <Label htmlFor="add-query">Create</Label>
            </div>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full flex-1 items-center justify-center p-0",
                "rounded-md border-2 border-dashed border-border",
                "focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
              )}
            >
              <Plus className="h-8 w-8 text-primary/40" />
            </Button>
          </div>
        </CollapsibleContent>

        {/* DEBUG */}
        {/* <pre className="mb-4 mt-1">
          {JSON.stringify(
            JSON.parse(formatQuery(queries[0], "json_without_ids")),
            null,
            2,
          )}
        </pre> */}

        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between min-[1157px]:h-9">
            <Label htmlFor="metric-graph">Metric Graph</Label>
          </div>
          {dataLoading && dataFlatten.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-md border p-4 text-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding metrics...
            </div>
          )}
          {!dataLoading && dataFlatten.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-md border p-4 text-sm">
              No metrics found.
            </div>
          )}
          {dataFlatten.length > 0 && (
            <LineChart
              data={dataFlatten}
              categories={dataCategories}
              index="date"
              yAxisValueFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
              xAxisHeight={48}
              yAxisWidth={60}
              showAnimation
              curveType="natural"
              className="h-[555px] pb-[125px]"
              onValueChange={(v) => console.log(v)}
              legendPosition="left"
            />
          )}
        </div>
      </div>
    </Collapsible>
  );
}
