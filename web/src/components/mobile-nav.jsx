import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Icons } from "./icons";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Icons.logo className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link to="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link
            to="/logs"
            className="text-muted-foreground hover:text-foreground"
          >
            Logs
          </Link>
          <Link
            to="/metrics"
            className="text-muted-foreground hover:text-foreground"
          >
            Metrics
          </Link>
          <Link
            to="/traces"
            className="text-muted-foreground hover:text-foreground"
          >
            Traces
          </Link>
          <Link
            to="/workflows"
            className="text-muted-foreground hover:text-foreground"
          >
            Workflows
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
