import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { isOptionGroupArray } from "react-querybuilder";

export function MultiSelect({
  className,
  options = [],
  value,
  onValueChange,
  title,
}) {
  const toDropdownOptions = (list) =>
    isOptionGroupArray(list)
      ? list.map((og) => (
          <React.Fragment key={og.label}>
            <DropdownMenuLabel>{og.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {og.options.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.name}
                disabled={!!opt.disabled}
                checked={value.includes(opt.name ?? "")}
                onCheckedChange={(checked) => {
                  onValueChange(
                    checked
                      ? [...value, opt.name ?? ""]
                      : value.filter((v) => v !== opt.name),
                  );
                }}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
          </React.Fragment>
        ))
      : Array.isArray(list)
        ? list.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.name}
              disabled={!!opt.disabled}
              checked={value.includes(opt.name)}
              onCheckedChange={(checked) => {
                onValueChange(
                  checked
                    ? [...value, opt.name]
                    : value.filter((v) => v !== opt.name),
                );
              }}
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))
        : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex h-full min-h-10 justify-between px-3 py-2",
            "hover:bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className,
          )}
          title={title}
        >
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-hidden">
            {[...value].slice(0, 2).map((it) => (
              <div
                key={it}
                className="rounded-full border px-2.5 py-0.5 text-xs font-semibold"
              >
                {it}
              </div>
            ))}
            {value.length > 2 && (
              <div className="rounded-full py-0.5 text-xs font-semibold">
                +{value.length - 2}
              </div>
            )}
            {value.length === 0 && title}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {toDropdownOptions(options)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
