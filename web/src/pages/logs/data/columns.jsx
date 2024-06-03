import { DataTableColumnHeader } from "@/components/data/data-table-column-header";
import { format } from "date-fns";
import { getLogLevel, getLogLevelStyles } from "./utils";

export const columns = [
  {
    id: "level",
    header: () => <div />,
    cell: ({ row }) => {
      const level = getLogLevel(row.original.stream?.level);
      return <div className={getLogLevelStyles(level)} />;
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => (
      <pre>
        {format(
          new Date(Number(row.getValue("time")) / 1e6),
          "yyyy-MM-dd HH:mm:ss.SSS",
        )}
      </pre>
    ),
  },
  {
    accessorKey: "line",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Line" />
    ),
    cell: ({ row }) => (
      <pre className="truncate text-wrap break-all">{row.getValue("line")}</pre>
    ),
  },
];
