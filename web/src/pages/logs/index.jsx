import logService from "@/api/log";
import {
  CommonActionElement,
  CommonActionElementIcon,
} from "@/builders/common/action";
import { CommonFieldSelector } from "@/builders/common/field";
import { CommonOperatorSelector } from "@/builders/common/operator";
import { formatCommonQuery } from "@/builders/common/out/format";
import { commonRuleProcessor } from "@/builders/common/out/processor";
import { combinators, fields } from "@/builders/log";
import { LogValueEditor } from "@/builders/log/value";
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
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XTick } from "@/components/viz/x-tick";
import MonacoQueryField from "@/editors/log";
import { cn } from "@/lib/utils";
import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import * as d3 from "d3";
import {
  differenceInMilliseconds,
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { columns } from "./data/columns";
import { DataTable } from "./data/data-table";
import { LogLevel, getLogLevel, getLogLevelColors } from "./data/utils";
import logqlGrammar from "./prism";
import "./prism.scss";

// const defaultQuery = {
//   combinator: "query",
//   rules: [
//     {
//       combinator: "stream",
//       rules: [{ field: "stream", operator: "=", value: ["", ""] }],
//     },
//     { field: "line", operator: "|=", value: [[]] },
//   ],
// };
const defaultQuery = {
  combinator: "query",
  rules: [
    {
      combinator: "stream",
      rules: [
        { field: "stream", operator: "=", value: ["cluster", "eu-west-1"] },
      ],
    },
    { field: "line", operator: "|=", value: [[]] },
    { field: "format", operator: "logfmt", value: [[], []] },
    { field: "label", operator: "=~", value: ["caller", ".*go.*"] },
  ],
};

export default function PageLogs() {
  const [queries, setQueries] = React.useState([
    {
      format: "builder",
      builder: defaultQuery,
      out: "",
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
  const [data, setData] = React.useState([]);
  const [dataVolumeLoading, setDataVolumeLoading] = React.useState(false);
  const [dataVolume, setDataVolume] = React.useState([]);

  const formatOpts = {
    combinators,
    fields,
    format: "sql",
    ruleProcessor: commonRuleProcessor,
  };
  const formatTrueLang = { name: "logql", grammar: logqlGrammar };
  const out = formatCommonQuery(queries[0].builder, formatOpts);

  const processVolume = async ({ metric, values }, start, end) => {
    const logs = values.map((v) => ({
      time: v[0] * 1000,
      count: parseInt(v[1], 10),
    }));

    const logCounts = d3
      .bin()
      .value((d) => d.time)
      .domain([start.getTime(), end.getTime()])
      .thresholds(d3.timeTicks(start, end, 30))(logs);

    return logCounts.map((bin) => ({
      time: format(new Date(bin.x0), "yyyy-MM-dd HH:mm:ss.SSS"),
      level: getLogLevel(metric.level),
      count: d3.sum(bin, (d) => d.count),
    }));
  };

  const getDataVolume = async (params) => {
    setDataVolumeLoading(true);
    try {
      const q = `sum by (level) (count_over_time(${params.query}[${params.interval}]))`;
      const resp = await logService.getQueryRange({ ...params, query: q });
      const processed = await Promise.all(
        resp.data.result.map((data) =>
          processVolume(data, params.start, params.end),
        ),
      );
      const merged = processed.reduce((acc, cur) => {
        cur.forEach((v) => {
          const existing = acc.find((a) => a.time === v.time);
          if (existing) {
            existing[v.level] = v.count;
            existing.total += v.count;
          } else {
            acc.push({ time: v.time, total: v.count, [v.level]: v.count });
          }
        });
        return acc;
      }, []);
      setDataVolume(merged);
    } catch (error) {
      const msg = error.response?.data?.message ?? error.message;
      toast.error("Log Volume", {
        description: msg,
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
      setDataVolume([]);
    } finally {
      setDataVolumeLoading(false);
    }
  };

  const getQueryRange = async (params) => {
    setDataLoading(true);
    try {
      const resp = await logService.getQueryRange(params);
      const rows = resp.data.result.reduce((acc, cur) => {
        const stream = structuredClone(cur.stream);
        for (const v of cur.values) {
          acc.push({ time: v[0], line: v[1], stream });
        }
        return acc;
      }, []);
      setData(rows);
    } catch (error) {
      const msg = error.response?.data?.message ?? error.message;
      toast.error("Logs", {
        description: msg,
        action: {
          label: "Hide",
          onClick: () => {},
        },
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
    const limit = 1000;
    const now = new Date();
    let s = start ?? dateRange?.from ?? new Date();
    let e = end ?? dateRange?.to ?? new Date();
    s = isAfter(s, now) ? now : s;
    e = isAfter(e, now) ? now : e;
    const diff = differenceInMilliseconds(e, s);
    getDataVolume({
      query,
      limit,
      start: s,
      end: e,
      interval: `${Math.ceil(diff / limit)}ms`,
    });
    getQueryRange({
      query,
      limit,
      start: s,
      end: e,
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
          <h2 className="text-2xl font-bold tracking-tight">Logs</h2>
          <p className="text-muted-foreground">
            A log provides a descriptive record of the system&apos;s behavior at
            a given time.
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
            <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
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
                  className={cn(
                    "space-y-3",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                  )}
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
                        removeGroupAction: HiddenElement,
                        removeRuleAction: CommonActionElementIcon,
                        valueEditor: LogValueEditor,
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
                            formatTrueLang.grammar,
                            formatTrueLang.name,
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
                      "rounded-lg border bg-background p-1 pb-0 shadow-sm",
                      "![&_.monaco-editor_.cursor]:invisible [&_.monaco-editor]:rounded-lg [&_.monaco-editor_.overflow-guard]:rounded-lg [&_.monaco-editor_.suggest-widget]:min-h-6",
                      "[&_.monaco-placeholder::after]:font-mono",
                      "[&_.monaco-placeholder::after]:text-muted-foreground",
                      "[&_.monaco-placeholder::after]:content-['Enter_a_LogQL_query...']",
                    )}
                  >
                    <MonacoQueryField
                      datasource={{}}
                      initialValue={queries[0].out}
                      onBlur={() => {}}
                      onChange={(v) => {
                        const newQuery = structuredClone(queries[0]);
                        newQuery.out = v;
                        const newQueries = queries.map((q, i) =>
                          i === 0 ? newQuery : q,
                        );
                        setQueries(newQueries);
                      }}
                      onRunQuery={() => {}}
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
            <Label htmlFor="log-volume">Log Volume</Label>
          </div>
          {dataVolumeLoading && dataVolume.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-md border p-4 text-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating volume...
            </div>
          )}
          {!dataVolumeLoading && dataVolume.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-md border p-4 text-sm">
              No logs found.
            </div>
          )}
          {dataVolume.length > 0 && (
            <div className="h-[175px] w-full space-y-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataVolume}>
                  <CartesianGrid strokeDasharray="5" />
                  <XAxis
                    dataKey="time"
                    interval="equidistantPreserveStart"
                    tick={XTick}
                  />
                  <YAxis
                    style={{
                      fontSize: "0.875rem",
                    }}
                  />
                  <Tooltip
                    includeHidden
                    separator=": "
                    wrapperStyle={{ zIndex: 10 }}
                  />
                  <Legend align="right" verticalAlign="top" />
                  <Bar
                    dataKey={LogLevel.unknown}
                    fill={getLogLevelColors(LogLevel.unknown)}
                    stackId="a"
                  />
                  <Bar
                    dataKey={LogLevel.trace}
                    fill={getLogLevelColors(LogLevel.trace)}
                    stackId="a"
                  />
                  <Bar
                    dataKey={LogLevel.debug}
                    fill={getLogLevelColors(LogLevel.debug)}
                    stackId="a"
                  />
                  <Bar
                    dataKey={LogLevel.info}
                    fill={getLogLevelColors(LogLevel.info)}
                    stackId="a"
                  />
                  <Bar
                    dataKey={LogLevel.warning}
                    fill={getLogLevelColors(LogLevel.warning)}
                    stackId="a"
                  />
                  <Bar
                    dataKey={LogLevel.error}
                    fill={getLogLevelColors(LogLevel.error)}
                    stackId="a"
                  />
                  <Bar
                    dataKey={LogLevel.critical}
                    fill={getLogLevelColors(LogLevel.critical)}
                    stackId="a"
                  />
                  <Bar
                    dataKey="total"
                    fill={"#575279"}
                    hide
                    legendType="none"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <DataTable data={data} columns={columns} />
      </div>
    </Collapsible>
  );
}
