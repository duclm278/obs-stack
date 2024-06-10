import { DataTableColumnHeader } from "@/components/data/data-table-column-header";
import { format } from "date-fns";
import TraceFlyout from "../trace";
import { formatDuration } from "./date";

export const columns = [
  {
    accessorKey: "traceID",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Trace ID"
        className="max-w-[100px]"
      />
    ),
    cell: ({ row }) => <TraceFlyout traceID={row.getValue("traceID")} />,
  },
  {
    accessorKey: "startTimeUnixNano",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start time" />
    ),
    cell: ({ row }) => (
      <pre className="truncate text-wrap break-all">
        {format(
          new Date(Number(row.getValue("startTimeUnixNano")) / 1e6),
          "yyyy-MM-dd HH:mm:ss.SSS",
        )}
      </pre>
    ),
  },
  {
    accessorKey: "rootServiceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-wrap break-all">
        {row.getValue("rootServiceName")}
      </div>
    ),
  },
  {
    accessorKey: "rootTraceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-wrap break-all">
        {row.getValue("rootTraceName")}
      </div>
    ),
  },
  {
    accessorKey: "durationMs",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Duration"
        className="ml-3.5 max-w-[70px] text-right"
      />
    ),
    cell: ({ row }) => (
      <pre className="max-w-[70px] truncate text-right">
        {row.getValue("durationMs")
          ? row.getValue("durationMs") < 1
            ? "<1ms"
            : formatDuration(row.getValue("durationMs") * 1000)
          : "N/A"}
      </pre>
    ),
  },
];
