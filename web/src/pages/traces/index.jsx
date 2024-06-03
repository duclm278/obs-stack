import { columns } from "./data/columns";
import { DataTable } from "./data/data-table";
import tasks from "./data/tasks.json";

export default function PageTraces() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Traces</h2>
        <p className="text-muted-foreground">
          A trace is an interrelated series of discrete events that track the
          progression of a single user request.
        </p>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
}
