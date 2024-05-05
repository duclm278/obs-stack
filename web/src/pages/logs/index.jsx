import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/x-date-picker";
import tasks from "@/data/tasks.json";
import {
  endOfDay,
  startOfDay,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subYears,
} from "date-fns";
import React from "react";

export default function PageTraces() {
  const [dateRange, setDateRange] = React.useState(() => ({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  }));
  const dateRangePresets = [
    {
      label: "Today",
      generate: () => ({
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      }),
    },
    {
      label: "Yesterday",
      generate: () => ({
        from: startOfDay(subDays(new Date(), 1)),
        to: endOfDay(subDays(new Date(), 1)),
      }),
    },
    {
      label: "Last 5 minutes",
      generate: () => ({
        from: subMinutes(new Date(), 5),
        to: new Date(),
      }),
    },
    {
      label: "Last 15 minutes",
      generate: () => ({
        from: subMinutes(new Date(), 15),
        to: new Date(),
      }),
    },
    {
      label: "Last 30 minutes",
      generate: () => ({
        from: subMinutes(new Date(), 30),
        to: new Date(),
      }),
    },
    {
      label: "Last 1 hour",
      generate: () => ({
        from: subHours(new Date(), 1),
        to: new Date(),
      }),
    },
    {
      label: "Last 3 hours",
      generate: () => ({
        from: subHours(new Date(), 3),
        to: new Date(),
      }),
    },
    {
      label: "Last 6 hours",
      generate: () => ({
        from: subHours(new Date(), 6),
        to: new Date(),
      }),
    },
    {
      label: "Last 12 hours",
      generate: () => ({
        from: subHours(new Date(), 12),
        to: new Date(),
      }),
    },
    {
      label: "Last 24 hours",
      generate: () => ({
        from: subHours(new Date(), 24),
        to: new Date(),
      }),
    },
    {
      label: "Last 2 days",
      generate: () => ({
        from: subDays(new Date(), 2),
        to: new Date(),
      }),
    },
    {
      label: "Last 7 days",
      generate: () => ({
        from: subDays(new Date(), 7),
        to: new Date(),
      }),
    },
    {
      label: "Last 30 days",
      generate: () => ({
        from: subDays(new Date(), 30),
        to: new Date(),
      }),
    },
    {
      label: "Last 90 days",
      generate: () => ({
        from: subDays(new Date(), 90),
        to: new Date(),
      }),
    },
    {
      label: "Last 6 months",
      generate: () => ({
        from: subMonths(new Date(), 6),
        to: new Date(),
      }),
    },
    {
      label: "Last 1 year",
      generate: () => ({
        from: subYears(new Date(), 1),
        to: new Date(),
      }),
    },
    {
      label: "Last 2 years",
      generate: () => ({
        from: subYears(new Date(), 2),
        to: new Date(),
      }),
    },
    {
      label: "Last 5 years",
      generate: () => ({
        from: subYears(new Date(), 5),
        to: new Date(),
      }),
    },
  ];
  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8">
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-x-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Logs</h2>
            <p className="text-muted-foreground">
              A log provides a descriptive record of the system&apos;s behavior
              at a given time.
            </p>
          </div>
          <div className="flex w-max items-center space-x-2">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              presets={dateRangePresets}
              enableYearNavigation
              showTimePicker
              granularity="second"
              className="h-9"
            />
            <Button size="sm">Query</Button>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
