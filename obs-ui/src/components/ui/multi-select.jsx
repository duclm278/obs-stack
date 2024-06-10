import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Check, ChevronsUpDown, X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

const MultiSelectContext = React.createContext(undefined);

const useMultiSelect = () => {
  const context = React.useContext(MultiSelectContext);

  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }

  return context;
};

const MultiSelect = ({
  value: valueProp,
  onValueChange: onValueChangeProp,
  onDeselect: onDeselectProp,
  onSelect: onSelectProp,
  defaultValue,
  open: openProp,
  onOpenChange,
  defaultOpen,
  onSearch,
  filter,
  disabled,
  maxCount,
  ...popoverProps
}) => {
  const itemCache = React.useRef(new Map()).current;

  const handleValueChange = React.useCallback(
    (state) => {
      if (onValueChangeProp) {
        const items = state.map((value) => itemCache.get(value));

        onValueChangeProp(state, items);
      }
    },
    [onValueChangeProp],
  );

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: handleValueChange,
  });

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const handleSelect = React.useCallback(
    (value, item) => {
      setValue((prev) => {
        if (prev?.includes(value)) {
          return prev;
        }

        onSelectProp?.(value, item);

        return prev ? [...prev, value] : [value];
      });
    },
    [onSelectProp, setValue],
  );

  const handleDeselect = React.useCallback(
    (value, item) => {
      setValue((prev) => {
        if (!prev || !prev.includes(value)) {
          return prev;
        }

        onDeselectProp?.(value, item);

        return prev.filter((v) => v !== value);
      });
    },
    [onDeselectProp, setValue],
  );

  const contextValue = React.useMemo(() => {
    return {
      value: value || [],
      open: open || false,
      onSearch,
      filter,
      disabled,
      maxCount,
      onSelect: handleSelect,
      onDeselect: handleDeselect,
      itemCache,
    };
  }, [
    value,
    open,
    onSearch,
    filter,
    disabled,
    maxCount,
    handleSelect,
    handleDeselect,
  ]);

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <PopoverPrimitive.Root
        {...popoverProps}
        open={open}
        onOpenChange={setOpen}
      />
    </MultiSelectContext.Provider>
  );
};

MultiSelect.displayName = "MultiSelect";

const PreventClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const MultiSelectTrigger = React.forwardRef(
  ({ className, children, ...props }, forwardedRef) => {
    const { disabled } = useMultiSelect();

    return (
      <PopoverPrimitive.Trigger ref={forwardedRef} asChild>
        <div
          aria-disabled={disabled}
          data-disabled={disabled}
          {...props}
          className={cn(
            "flex h-full min-h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>span]:line-clamp-1",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-text",
            className,
          )}
          onClick={disabled ? PreventClick : props.onClick}
          onTouchStart={disabled ? PreventClick : props.onTouchStart}
        >
          {children}
          <ChevronsUpDown aria-hidden className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverPrimitive.Trigger>
    );
  },
);

MultiSelectTrigger.displayName = "MultiSelectTrigger";

const MultiSelectValue = React.forwardRef(
  (
    { className, placeholder, maxDisplay, maxItemLength, ...props },
    forwardRef,
  ) => {
    const { value, itemCache, onDeselect } = useMultiSelect();
    const [firstRendered, setFirstRendered] = React.useState(false);

    const renderRemain =
      maxDisplay && value.length > maxDisplay ? value.length - maxDisplay : 0;
    const renderItems = renderRemain ? value.slice(0, maxDisplay) : value;

    React.useLayoutEffect(() => {
      setFirstRendered(true);
    }, []);

    if (!value.length || !firstRendered) {
      return (
        <span className="pointer-events-none text-muted-foreground">
          {placeholder}
        </span>
      );
    }

    return (
      <TooltipProvider delayDuration={300}>
        <div
          className={cn(
            "flex flex-1 flex-wrap items-center gap-1.5 overflow-x-hidden",
            className,
          )}
          {...props}
          ref={forwardRef}
        >
          {renderItems.map((value) => {
            const item = itemCache.get(value);

            const content = item?.label || value;

            const child =
              maxItemLength &&
              typeof content === "string" &&
              content.length > maxItemLength
                ? `${content.slice(0, maxItemLength)}...`
                : content;

            const el = (
              <Badge
                variant="outline"
                key={value}
                className="group/multi-select-badge cursor-pointer rounded-full pr-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeselect(value, item);
                }}
              >
                <span>{child}</span>
                <X className="ml-1 h-3 w-3 text-muted-foreground group-hover/multi-select-badge:text-foreground" />
              </Badge>
            );

            if (child !== content) {
              return (
                <Tooltip key={value}>
                  <TooltipTrigger className="inline-flex rounded-full focus-visible:-outline-offset-1">
                    {el}
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className="z-[51]"
                  >
                    {content}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return el;
          })}
          {renderRemain ? (
            <span className="py-.5 text-xs leading-4 text-muted-foreground">
              +{renderRemain}
            </span>
          ) : null}
        </div>
      </TooltipProvider>
    );
  },
);

MultiSelectValue.displayName = "MultiSelectValue";

const MultiSelectSearch = React.forwardRef((props, ref) => {
  const { onSearch } = useMultiSelect();

  return <CommandInput ref={ref} {...props} onValueChange={onSearch} />;
});

MultiSelectSearch.displayName = "MultiSelectSearch";

const MultiSelectList = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <CommandList
      ref={ref}
      className={cn("max-h-[unset] px-0 py-1", className)}
      {...props}
    />
  );
});

MultiSelectList.displayName = "MultiSelectList";

const MultiSelectContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const context = useMultiSelect();

    const fragmentRef = React.useRef();

    if (!fragmentRef.current && typeof window !== "undefined") {
      fragmentRef.current = document.createDocumentFragment();
    }

    if (!context.open) {
      return fragmentRef.current
        ? createPortal(<Command>{children}</Command>, fragmentRef.current)
        : null;
    }

    return (
      <PopoverPrimitive.Portal forceMount>
        <PopoverPrimitive.Content
          ref={ref}
          align="start"
          sideOffset={4}
          collisionPadding={10}
          className={cn(
            "z-50 w-full rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          {...props}
        >
          {context.onSearch ? (
            <Command
              className={cn(
                "max-h-96 w-full min-w-[var(--radix-select-trigger-width)] px-1",
                className,
              )}
              filter={() => 0}
              loop
              shouldFilter={false}
            >
              {children}
            </Command>
          ) : (
            <Command
              className={cn(
                "max-h-96 w-full min-w-[var(--radix-select-trigger-width)] px-1",
                className,
              )}
              loop
              shouldFilter={true}
            >
              {children}
            </Command>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);

MultiSelectContent.displayName = "MultiSelectContent";

const MultiSelectItem = React.forwardRef(
  (
    {
      value,
      onSelect: onSelectProp,
      onDeselect: onDeselectProp,
      children,
      label,
      disabled: disabledProp,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const {
      value: contextValue,
      maxCount,
      onSelect,
      onDeselect,
      itemCache,
    } = useMultiSelect();

    const item = React.useMemo(() => {
      return value
        ? {
            value,
            label:
              label || (typeof children === "string" ? children : undefined),
          }
        : undefined;
    }, [value, label, children]);

    const selected = Boolean(value && contextValue.includes(value));

    React.useEffect(() => {
      if (value) {
        itemCache.set(value, item);
      }
    }, [selected, value, item]);

    const disabled = Boolean(
      disabledProp ||
        (!selected && maxCount && contextValue.length >= maxCount),
    );

    const handleClick = () => {
      if (selected) {
        onDeselectProp?.(value, item);
        onDeselect(value, item);
      } else {
        itemCache.set(value, item);
        onSelectProp?.(value, item);
        onSelect(value, item);
      }
    };

    return (
      <CommandItem
        {...props}
        value={value}
        className={cn(
          disabled && "cursor-not-allowed text-muted-foreground",
          className,
        )}
        disabled={disabled}
        onSelect={!disabled && value ? handleClick : undefined}
        ref={forwardedRef}
      >
        <span className="mr-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {children || label || value}
        </span>
        {selected ? <Check className="ml-auto h-4 w-4 shrink-0" /> : null}
      </CommandItem>
    );
  },
);

MultiSelectItem.displayName = "MultiSelectItem";

const MultiSelectGroup = React.forwardRef((props, forwardRef) => {
  return <CommandGroup {...props} ref={forwardRef} />;
});

MultiSelectGroup.displayName = "MultiSelectGroup";

const MultiSelectSeparator = React.forwardRef((props, forwardRef) => {
  return <CommandSeparator {...props} ref={forwardRef} />;
});

MultiSelectSeparator.displayName = "MultiSelectSeparator";

const MultiSelectEmpty = React.forwardRef(
  ({ children = "No Content", ...props }, forwardRef) => {
    return (
      <CommandEmpty {...props} ref={forwardRef}>
        {children}
      </CommandEmpty>
    );
  },
);

MultiSelectEmpty.displayName = "MultiSelectEmpty";

const renderMultiSelectOptions = (list) => {
  return list.map((option, index) => {
    if ("type" in option) {
      if (option.type === "separator") {
        return <MultiSelectSeparator key={index} />;
      }

      return null;
    }

    if ("children" in option) {
      return (
        <MultiSelectGroup
          key={option.value || index}
          value={option.value}
          heading={option.heading}
        >
          {renderMultiSelectOptions(option.children)}
        </MultiSelectGroup>
      );
    }

    return (
      <MultiSelectItem key={option.value} {...option}>
        {option.label}
      </MultiSelectItem>
    );
  });
};

export {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
};
