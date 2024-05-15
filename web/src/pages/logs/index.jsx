import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRangePicker } from "@/components/x-date-picker";
import { dateRangePresets } from "@/components/x-date-picker-presets";
import { QueryBuilderShadcnUi } from "@/components/x-query-builder";
import tasks from "@/data/tasks.json";
import { cn } from "@/lib/utils";
import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import { endOfDay, startOfDay } from "date-fns";
import { ChevronDown, Play, Plus, RefreshCw } from "lucide-react";
import * as React from "react";
import * as ReactDnD from "react-dnd";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";
import QueryBuilder from "react-querybuilder";
import { combinators, fields } from "./language";

const defaultQuery = {
  combinator: "query",
  rules: [
    { field: "stream", operator: "=", value: "" },
    { field: "line", operator: "|=", value: "" },
  ],
};

export default function PageLogs() {
  const [dateRange, setDateRange] = React.useState(() => ({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  }));
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

            <Tooltip>
              <Select defaultValue="off">
                <TooltipTrigger asChild>
                  <SelectTrigger className="h-8 space-x-2 border-none">
                    <RefreshCw className="h-4 w-4" />
                    <SelectValue placeholder="Select an interval" />
                  </SelectTrigger>
                </TooltipTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="1s">1s</SelectItem>
                    <SelectItem value="2s">2s</SelectItem>
                    <SelectItem value="5s">5s</SelectItem>
                    <SelectItem value="15s">15s</SelectItem>
                    <SelectItem value="30s">30s</SelectItem>
                    <SelectItem value="1m">1m</SelectItem>
                    <SelectItem value="2m">2m</SelectItem>
                    <SelectItem value="5m">5m</SelectItem>
                    <SelectItem value="15m">15m</SelectItem>
                    <SelectItem value="30m">30m</SelectItem>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="2h">2h</SelectItem>
                  </SelectGroup>
                </SelectContent>
                <TooltipContent sideOffset={6}>
                  Auto-refresh controls
                </TooltipContent>
              </Select>
            </Tooltip>
          </div>

          <Button className="h-8 w-20 px-3">
            <Play className="mr-2 h-4 w-4" />
            Find
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <CollapsibleContent className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(min(500px,100%),1fr))] gap-x-6 gap-y-4 px-0.5">
          <QueryBuilderShadcnUi>
            <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="query-a">Query A</Label>
                <ScrollArea className="rounded-lg border bg-background shadow-sm">
                  <QueryBuilder
                    combinators={combinators}
                    defaultQuery={defaultQuery}
                    fields={fields}
                  />
                  <ScrollBar forceMount orientation="horizontal" />
                </ScrollArea>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="add-query">Create</Label>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex h-full w-full items-center justify-center",
                    "rounded-md border-2 border-dashed border-border",
                    "focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
                  )}
                >
                  <Plus className="h-8 w-8 text-primary/50" />
                </Button>
              </div>
            </QueryBuilderDnD>
          </QueryBuilderShadcnUi>
        </CollapsibleContent>

        <DataTable data={tasks} columns={columns} />
      </div>
    </Collapsible>
  );
}
