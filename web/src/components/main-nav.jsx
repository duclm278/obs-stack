import { Link } from "react-router-dom";
import { Icons } from "./icons";

export function MainNav() {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link
        to="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Icons.logo className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <Link
        to="/dashboard"
        className="text-foreground transition-colors hover:text-foreground"
      >
        Dashboard
      </Link>
      <Link
        to="/logs"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Logs
      </Link>
      <Link
        to="/metrics"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Metrics
      </Link>
      <Link
        to="/traces"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Traces
      </Link>
      <Link
        to="/workflows"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Workflows
      </Link>
    </nav>
  );
}
