import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
} from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import * as React from "react";

export const MultiSelectInput = ({
  buttonPlaceholder = "",
  className,
  disabled,
  loading,
  loadingText = "Loading...",
  maxDisplay,
  maxItemLength,
  noOptionsText = "No options found.",
  onOpenChange,
  onValueChange,
  open,
  options,
  searchPlaceholder = "Search options...",
  title,
  value,
}) => {
  const [filtered, setFiltered] = React.useState(options);

  React.useEffect(() => {
    setFiltered(options);
  }, [options]);

  const filter = (query) => {
    if (!query) {
      return options;
    }
    return options.reduce((acc, cur) => {
      if (cur.value === query) {
        acc.unshift(cur);
      } else if (cur.value.toLowerCase().includes(query.toLowerCase())) {
        acc.push(cur);
      }
      return acc;
    }, []);
  };

  const idxRef = React.useRef(0);
  const searchRef = React.useRef(null);

  const handleOnSearch = (query) => {
    const idx = ++idxRef.current;
    const filtered = filter(query);
    if (idxRef.current === idx) {
      searchRef.current.value = query;
      setFiltered([...filtered]);
    }
  };

  return (
    <MultiSelect
      value={value}
      onValueChange={onValueChange}
      onSelect={() => {
        searchRef.current.value = "";
      }}
      open={disabled ? false : open}
      onOpenChange={onOpenChange}
      onSearch={handleOnSearch}
    >
      <MultiSelectTrigger
        className={cn("cursor-pointer shadow-none", className)}
        title={title || ""}
      >
        <MultiSelectValue
          placeholder={buttonPlaceholder}
          maxDisplay={maxDisplay}
          maxItemLength={maxItemLength}
        />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectSearch
          ref={searchRef}
          value={searchRef?.current?.value || ""}
          placeholder={searchPlaceholder}
        />
        <MultiSelectList>
          <MultiSelectEmpty>
            {loading ? loadingText : noOptionsText}
          </MultiSelectEmpty>
          {searchRef?.current?.value?.trim() &&
            !filtered
              ?.map((o) => o.value)
              ?.includes(searchRef?.current?.value || "") && (
              <MultiSelectItem
                value={`${searchRef?.current?.value || ""}`}
                className={cn(
                  "order-1",
                  "[&>span]:mr-0 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:justify-between",
                  "[&>span>svg]:has-[>svg]:hidden",
                )}
              >
                <div className="truncate">
                  {searchRef?.current?.value || ""}
                </div>
                <PlusCircle className="h-4 w-4 shrink-0" />
              </MultiSelectItem>
            )}
          {Array.isArray(filtered) && renderMultiSelectOptions(filtered)}
        </MultiSelectList>
      </MultiSelectContent>
    </MultiSelect>
  );
};

MultiSelectInput.displayName = "MultiSelectInput";
