import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker, DateRangePicker } from "@/components/x-date-picker";
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

export default function DateRangePickerPresetsExample() {
  const [date, setDate] = React.useState(() => new Date());
  const [dateRange, setDateRange] = React.useState(() => ({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  }));
  const datePresets = [
    {
      label: "Now",
      generate: () => new Date(),
    },
  ];
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
    <div className="flex flex-col items-center gap-y-4">
      <Tabs defaultValue="absolute" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="absolute">Absolute</TabsTrigger>
          <TabsTrigger value="relative">Relative</TabsTrigger>
        </TabsList>
        <TabsContent value="absolute">
          <DatePicker
            value={date}
            onChange={setDate}
            presets={datePresets}
            enableYearNavigation
            showTimePicker
            granularity="second"
            className="mt-1 h-9"
          />
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            presets={dateRangePresets}
            enableYearNavigation
            showTimePicker
            granularity="second"
            className="mt-1 h-9"
          />
        </TabsContent>
        <TabsContent value="relative">
          <div className="flex space-x-2">
            <Select defaultValue="last">
              <SelectTrigger>
                <SelectValue placeholder="Select a time tense" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="last">Last</SelectItem>
                  <SelectItem value="next">Next</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input type="number" defaultValue="30" />
            <Select defaultValue="minutes">
              <SelectTrigger>
                <SelectValue placeholder="Select a time unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      <p className="flex items-center rounded-md bg-gray-100 p-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        Selected Range:{" "}
        {dateRange
          ? `${dateRange.from?.toLocaleDateString()} – ${dateRange.to?.toLocaleDateString() ?? ""}`
          : "None"}
      </p>
    </div>
  );
}
