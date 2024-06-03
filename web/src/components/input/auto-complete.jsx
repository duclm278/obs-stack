import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, PlusCircle } from "lucide-react";
import * as React from "react";
import { useMeasure } from "react-use";

export function AutoComplete({
  className,
  loading,
  loadingText,
  noOptionsText,
  onValueChange,
  options,
  placeholder,
  value,
}) {
  const [search, setSearch] = React.useState("");

  const parentRef = React.useRef(null);
  const [maxRef, { width: maxWidth }] = useMeasure();

  let maxIdx = 0;
  let maxLen = 0;
  let showAdd = search.trim() !== "";
  let showExact = false;
  const fo = options.filter((o, i) => {
    if (o.label.length > maxLen) {
      maxIdx = i;
      maxLen = o.label.length;
    }
    if (o.value === search) {
      showAdd = false;
      showExact = true;
      return true;
    }
    return o.value.toLowerCase().includes(search.toLowerCase());
  });
  if (showAdd || showExact) {
    fo.unshift({});
  }

  const virtualizer = useVirtualizer({
    count: fo.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    paddingStart: 4,
    paddingEnd: 4,
  });

  return (
    <Command
      className={cn(
        "max-h-96 w-full min-w-[var(--radix-select-trigger-width)]",
        className,
      )}
      filter={() => 0}
      shouldFilter={false}
    >
      <CommandInput
        search={search}
        onValueChange={setSearch}
        placeholder={placeholder}
      />
      <CommandList ref={parentRef}>
        <CommandEmpty>{loading ? loadingText : noOptionsText}</CommandEmpty>
        <CommandGroup
          className="py-0"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            minWidth: `${maxWidth}px`,
            transition: "minWidth 0.5s",
          }}
        >
          <div ref={maxRef} className="invisible ml-8 mr-4 h-0 text-sm">
            {options[maxIdx]?.label}
          </div>
          {virtualizer.getVirtualItems().map((vi, idx) => {
            if (showAdd && vi.index === 0) {
              return (
                <CommandItem
                  key={vi.index}
                  value={`${search} [+]`}
                  onSelect={() => onValueChange(search)}
                  style={{
                    transform: `translateY(${vi.start - idx * vi.size}px)`,
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4 shrink-0" />
                  <div className="truncate">{search}</div>
                </CommandItem>
              );
            }
            if (showExact && vi.index === 0) {
              return (
                <CommandItem
                  key={vi.index}
                  value={search}
                  onSelect={() => onValueChange(search)}
                  style={{
                    transform: `translateY(${vi.start - idx * vi.size}px)`,
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === search ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {search}
                </CommandItem>
              );
            }
            if (fo[vi.index]?.value === search) {
              return null;
            }
            return (
              <CommandItem
                key={vi.index}
                value={fo[vi.index]?.value}
                onSelect={() => onValueChange(fo[vi.index]?.value)}
                style={{
                  transform: `translateY(${vi.start - idx * vi.size}px)`,
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 shrink-0",
                    value === fo[vi.index]?.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {fo[vi.index]?.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
