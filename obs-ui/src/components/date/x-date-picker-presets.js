import {
  endOfDay,
  startOfDay,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subYears,
} from "date-fns";

export const dateRangePresets = [
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
