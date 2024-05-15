import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import tasks from "@/data/tasks.json";

export default function PageMetrics() {
  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Metrics</h2>
            <p className="text-muted-foreground">
              Metrics are numerical measurements that offer a high-level view of
              a system&apos;s performance.
            </p>
          </div>
          <div className="flex items-center space-x-2">{/* <UserNav /> */}</div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
