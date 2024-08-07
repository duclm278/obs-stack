import { Icons } from "@/components/app/icons";
import ProjectSwitcher from "@/components/app/project-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CircleUser, Menu, Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Root({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Icons.Logo className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <ProjectSwitcher className="flex-1" />
          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`
            }
          >
            Logs
          </NavLink>
          <NavLink
            to="/metrics"
            className={({ isActive }) =>
              `transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`
            }
          >
            Metrics
          </NavLink>
          <NavLink
            to="/traces"
            className={({ isActive }) =>
              `transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`
            }
          >
            Traces
          </NavLink>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
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
                <Icons.Logo className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <NavLink
                to="/logs"
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`
                }
              >
                Logs
              </NavLink>
              <NavLink
                to="/metrics"
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`
                }
              >
                Metrics
              </NavLink>
              <NavLink
                to="/traces"
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`
                }
              >
                Traces
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to="/logout">
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
