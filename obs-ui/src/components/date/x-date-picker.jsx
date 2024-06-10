// Tremor Raw Date Picker [v1.0.1]

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, focusInput, focusRing, hasErrorInput } from "@/lib/utils";
import { Time } from "@internationalized/date";
import { useDateSegment, useTimeField } from "@react-aria/datepicker";
import { useTimeFieldState } from "@react-stately/datepicker";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Clock, Minus } from "lucide-react";
import * as React from "react";
import { tv } from "tailwind-variants";
import { Calendar as CalendarPrimitive } from "./x-calendar";

// #region TimeInput
// ============================================================================

const isBrowserLocaleClockType24h = () => {
  const language =
    typeof window !== "undefined" ? window.navigator.language : "en-US";

  const hr = new Intl.DateTimeFormat(language, {
    hour: "numeric",
  }).format();

  return Number.isInteger(Number(hr));
};

const TimeSegment = ({ segment, state }) => {
  const ref = React.useRef(null);

  const { segmentProps } = useDateSegment(segment, state, ref);

  const isColon = segment.type === "literal" && segment.text === ":";
  const isSpace = segment.type === "literal" && segment.text === " ";

  const isDecorator = isColon || isSpace;

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        // base
        "relative block w-full appearance-none rounded-md border px-2.5 py-1.5 text-left uppercase tabular-nums shadow-sm outline-none transition sm:text-sm",
        // border color
        "border-gray-300 dark:border-gray-800",
        // text color
        "text-gray-900 dark:text-gray-50",
        // background color
        "bg-white dark:bg-gray-950",
        // focus
        focusInput,
        // invalid (optional)
        "invalid:border-red-500 invalid:ring-2 invalid:ring-red-200 group-aria-[invalid=true]/time-input:border-red-500 group-aria-[invalid=true]/time-input:ring-2 group-aria-[invalid=true]/time-input:ring-red-200 group-aria-[invalid=true]/time-input:dark:ring-red-400/20",
        {
          "!w-fit border-none bg-transparent px-0 text-gray-400 shadow-none":
            isDecorator,
          hidden: isSpace,
          "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500":
            state.isDisabled,
          "!bg-transparent !text-gray-400": !segment.isEditable,
        },
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none block w-full text-left text-gray-700 sm:text-sm",
          {
            hidden: !segment.isPlaceholder,
            "h-0": !segment.isPlaceholder,
          },
        )}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? "" : segment.text}
    </div>
  );
};

const TimeInput = React.forwardRef(({ hourCycle, ...props }, ref) => {
  const innerRef = React.useRef(null);

  React.useImperativeHandle(ref, () => innerRef?.current);

  const locale = window !== undefined ? window.navigator.language : "en-US";

  const state = useTimeFieldState({
    hourCycle: hourCycle,
    locale: locale,
    shouldForceLeadingZeros: true,
    autoFocus: true,
    ...props,
  });

  const { fieldProps } = useTimeField(
    {
      ...props,
      hourCycle: hourCycle,
      shouldForceLeadingZeros: true,
    },
    state,
    innerRef,
  );

  return (
    <div
      {...fieldProps}
      ref={innerRef}
      className="group/time-input inline-flex w-full gap-x-2"
    >
      {state.segments.map((segment, i) => (
        <TimeSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
});

TimeInput.displayName = "TimeInput";

// #region Trigger
// ============================================================================

const triggerStyles = tv({
  base: [
    // base
    "peer flex w-full cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none sm:text-sm",
    // background color
    "bg-white dark:bg-gray-950 ",
    // border color
    "border-gray-300 dark:border-gray-800",
    // text color
    "text-gray-900 dark:text-gray-50",
    // placeholder color
    "placeholder-gray-400 dark:placeholder-gray-500",
    // hover
    "hover:bg-gray-50 hover:dark:bg-gray-950/50",
    // disabled
    "disabled:pointer-events-none",
    "disabled:bg-gray-100 disabled:text-gray-400",
    "disabled:dark:border-gray-800 disabled:dark:bg-gray-800 disabled:dark:text-gray-500",
    // focus
    focusInput,
    // invalid (optional)
    // "aria-[invalid=true]:dark:ring-red-400/20 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500"
  ],
  variants: {
    hasError: {
      true: hasErrorInput,
    },
  },
});

const Trigger = React.forwardRef(
  ({ className, children, placeholder, hasError, ...props }, forwardedRef) => {
    return (
      <PopoverTrigger asChild>
        <Button
          ref={forwardedRef}
          className={cn(triggerStyles({ hasError }), className)}
          {...props}
        >
          <Clock className="size-4 shrink-0 text-foreground" />
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-900 dark:text-gray-50">
            {children ? (
              children
            ) : placeholder ? (
              <span className="text-gray-400 dark:text-gray-600">
                {placeholder}
              </span>
            ) : null}
          </span>
        </Button>
      </PopoverTrigger>
    );
  },
);

Trigger.displayName = "DatePicker.Trigger";

// #region Popover
// ============================================================================

const CalendarPopover = React.forwardRef(
  ({ align, className, children, ...props }, forwardedRef) => {
    return (
      <PopoverContent
        ref={forwardedRef}
        sideOffset={5}
        side="bottom"
        align={align}
        avoidCollisions
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          // base
          "relative z-50 w-fit rounded-md border p-0 text-sm shadow-xl shadow-black/[2.5%]",
          // widths
          "min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]",
          // border color
          "border-gray-300 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950",
          // transition
          "will-change-[transform,opacity]",
          "data-[state=closed]:animate-hide",
          "data-[state=open]:data-[side=bottom]:animate-slideDownAndFade data-[state=open]:data-[side=left]:animate-slideLeftAndFade data-[state=open]:data-[side=right]:animate-slideRightAndFade data-[state=open]:data-[side=top]:animate-slideUpAndFade",
          className,
        )}
        {...props}
      >
        {children}
      </PopoverContent>
    );
  },
);

CalendarPopover.displayName = "DatePicker.CalendarPopover";

const PresetContainer = ({
  // Available preset configurations
  presets,

  // Event handler when a preset is selected
  onSelect,

  // Currently selected preset
  currentLabel,
}) => {
  const handleClick = (preset) => {
    if ("generate" in preset) {
      onSelect({ ...preset, value: preset.generate() });
    } else {
      onSelect(preset);
    }
  };

  const matchesCurrent = (preset) => {
    return preset.label === currentLabel;
  };

  return (
    <ul role="list" className="flex items-start gap-x-2 sm:flex-col">
      {presets.map((preset, index) => {
        return (
          <li key={index} className="sm:w-full sm:py-px">
            <button
              title={preset.label}
              className={cn(
                // base
                "relative w-full overflow-hidden text-ellipsis whitespace-nowrap rounded border px-2.5 py-1.5 text-left text-base shadow-sm outline-none transition-all sm:border-none sm:py-2 sm:text-sm sm:shadow-none",
                // text color
                "text-gray-700 dark:text-gray-300",
                // border color
                "border-gray-300 dark:border-gray-800",
                // focus
                focusRing,
                // background color
                "focus-visible:bg-gray-100 focus-visible:dark:bg-gray-900",
                "hover:bg-gray-100 hover:dark:bg-gray-900",
                {
                  "bg-gray-100 dark:bg-gray-900": matchesCurrent(preset),
                },
              )}
              onClick={() => handleClick(preset)}
              aria-label={`Select ${preset.label}`}
            >
              <span>{preset.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

PresetContainer.displayName = "DatePicker.PresetContainer";

// #region Date Picker Shared
// ============================================================================

const formatDate = (date, locale, includeTime, granularity) => {
  const usesAmPm = !isBrowserLocaleClockType24h();

  if (!includeTime) {
    return format(date, "dd MMM, yyyy", { locale });
  }

  if (!granularity) {
    granularity = "minute";
  }

  switch (granularity) {
    case "year":
      return format(date, "yyyy", { locale });
    case "month":
      return format(date, "MMM yyyy", { locale });
    case "day":
      return format(date, "dd MMM, yyyy", { locale });
    case "hour":
      return usesAmPm
        ? format(date, "dd MMM, yyyy h a", { locale })
        : format(date, "dd MMM, yyyy HH", { locale });
    case "minute":
      return usesAmPm
        ? format(date, "dd MMM, yyyy h:mm a", { locale })
        : format(date, "dd MMM, yyyy HH:mm", { locale });
    case "second":
      return usesAmPm
        ? format(date, "dd MMM, yyyy h:mm:ss a", { locale })
        : format(date, "dd MMM, yyyy HH:mm:ss", { locale });
    default:
      return format(date, "dd MMM, yyyy", { locale });
  }
};

const SingleDatePicker = ({
  defaultValue,
  value,
  onChange,
  presets,
  disabled,
  disabledDays,
  disableNavigation,
  className,
  showTimePicker,
  granularity,
  placeholder = "Select date",
  hasError,
  translations,
  enableYearNavigation = false,
  locale = enUS,
  align = "center",
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(value ?? defaultValue ?? undefined);
  const [month, setMonth] = React.useState(date);

  const [time, setTime] = React.useState(
    value
      ? new Time(
          value.getHours(),
          value.getMinutes(),
          value.getSeconds(),
          value.getMilliseconds(),
        )
      : defaultValue
        ? new Time(
            defaultValue.getHours(),
            defaultValue.getMinutes(),
            defaultValue.getSeconds(),
            defaultValue.getMilliseconds(),
          )
        : new Time(0, 0, 0, 0),
  );

  const [labelSelected, setLabelSelected] = React.useState(undefined);

  const initialDate = React.useMemo(() => {
    return date;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  React.useEffect(() => {
    if (date) {
      setMonth(date);
    }
  }, [date]);

  React.useEffect(() => {
    if (!open) {
      setMonth(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onCancel = () => {
    setDate(initialDate);
    setTime(
      initialDate
        ? new Time(
            initialDate.getHours(),
            initialDate.getMinutes(),
            initialDate.getSeconds(),
            initialDate.getMilliseconds(),
          )
        : new Time(0, 0, 0, 0),
    );
    setOpen(false);
    setLabelSelected(undefined);
  };

  const onOpenChange = (open) => {
    if (!open) {
      onCancel();
    }

    setOpen(open);
  };

  const onPresetSelect = (preset) => {
    const newDate = preset.value;
    if (showTimePicker) {
      if (newDate && !time) {
        setTime(new Time(0, 0, 0, 0));
      }
      if (newDate && time) {
        setTime(
          new Time(
            newDate.getHours(),
            newDate.getMinutes(),
            newDate.getSeconds(),
            newDate.getMilliseconds(),
          ),
        );
      }
    }
    setDate(newDate);
    setLabelSelected(preset.label);
  };

  const onDateChange = (newDate) => {
    if (showTimePicker) {
      if (newDate && !time) {
        setTime(new Time(0, 0, 0, 0));
      }
      if (newDate && time) {
        newDate.setHours(time.hour);
        newDate.setMinutes(time.minute);
        newDate.setSeconds(time.second);
        newDate.setMilliseconds(time.millisecond);
      }
    }
    setDate(newDate);
    setLabelSelected(undefined);
  };

  const onTimeChange = (time) => {
    setTime(time);

    if (!date) {
      return;
    }

    const newDate = new Date(date.getTime());

    if (!time) {
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    } else {
      newDate.setHours(time.hour);
      newDate.setMinutes(time.minute);
      newDate.setSeconds(time.second);
      newDate.setMilliseconds(time.millisecond);
    }

    setDate(newDate);
  };

  const formattedDate = React.useMemo(() => {
    if (!date) {
      return null;
    }

    return formatDate(date, locale, showTimePicker, granularity);
  }, [date, locale, showTimePicker, granularity]);

  const onApply = () => {
    setOpen(false);
    setLabelSelected(undefined);
    onChange?.(date);
  };

  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined);
    setTime(
      value
        ? new Time(
            value.getHours(),
            value.getMinutes(),
            value.getSeconds(),
            value.getMilliseconds(),
          )
        : defaultValue
          ? new Time(
              defaultValue.getHours(),
              defaultValue.getMinutes(),
              defaultValue.getSeconds(),
              defaultValue.getMilliseconds(),
            )
          : new Time(0, 0, 0, 0),
    );
  }, [value, defaultValue]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Trigger
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            hasError={hasError}
            aria-required={props.required || props["aria-required"]}
            aria-invalid={props["aria-invalid"]}
            aria-label={props["aria-label"]}
            aria-labelledby={props["aria-labelledby"]}
          >
            {formattedDate}
          </Trigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>Time controls</TooltipContent>
      </Tooltip>
      <CalendarPopover align={align}>
        <div className="flex">
          <div className="flex flex-col sm:flex-row sm:items-start">
            {presets && presets.length > 0 && (
              <div
                className={cn(
                  "relative flex h-14 w-full items-center sm:h-full sm:w-40",
                  "border-b border-gray-300 dark:border-gray-800 sm:border-b-0 sm:border-r",
                  "overflow-auto",
                )}
              >
                <div className="absolute px-2 pr-2 sm:inset-0 sm:left-0 sm:py-2">
                  <PresetContainer
                    currentLabel={labelSelected}
                    presets={presets}
                    onSelect={onPresetSelect}
                  />
                </div>
              </div>
            )}
            <div>
              <CalendarPrimitive
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={onDateChange}
                disabled={disabledDays}
                locale={locale}
                enableYearNavigation={enableYearNavigation}
                disableNavigation={disableNavigation}
                initialFocus
                {...props}
              />
              {showTimePicker && (
                <div className="border-t border-gray-300 p-3 dark:border-gray-800">
                  <TimeInput
                    aria-label="Time"
                    onChange={onTimeChange}
                    isDisabled={!date}
                    value={time}
                    isRequired={props.required}
                    granularity={granularity}
                  />
                </div>
              )}
              <div className="flex items-center gap-x-2 border-t border-gray-300 p-3 dark:border-gray-800">
                <Button
                  variant="secondary"
                  className="h-8 w-full px-3"
                  type="button"
                  onClick={onCancel}
                >
                  {translations?.cancel ?? "Cancel"}
                </Button>
                <Button
                  className="h-8 w-full px-3"
                  type="button"
                  onClick={onApply}
                >
                  {translations?.apply ?? "Apply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </Popover>
  );
};

const RangeDatePicker = ({
  defaultValue,
  value,
  onChange,
  presets,
  disabled,
  disableNavigation,
  disabledDays,
  enableYearNavigation = false,
  locale = enUS,
  showTimePicker,
  granularity,
  placeholder = "Select date range",
  hasError,
  translations,
  align = "center",
  className,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState(value ?? defaultValue ?? undefined);
  const [month, setMonth] = React.useState(range?.from);

  const [startTime, setStartTime] = React.useState(
    value?.from
      ? new Time(
          value.from.getHours(),
          value.from.getMinutes(),
          value.from.getSeconds(),
          value.from.getMilliseconds(),
        )
      : defaultValue?.from
        ? new Time(
            defaultValue.from.getHours(),
            defaultValue.from.getMinutes(),
            defaultValue.from.getSeconds(),
            defaultValue.from.getMilliseconds(),
          )
        : new Time(0, 0, 0, 0),
  );
  const [endTime, setEndTime] = React.useState(
    value?.to
      ? new Time(
          value.to.getHours(),
          value.to.getMinutes(),
          value.to.getSeconds(),
          value.to.getMilliseconds(),
        )
      : defaultValue?.to
        ? new Time(
            defaultValue.to.getHours(),
            defaultValue.to.getMinutes(),
            defaultValue.to.getSeconds(),
            defaultValue.to.getMilliseconds(),
          )
        : new Time(0, 0, 0, 0),
  );

  const [labelSelected, setLabelSelected] = React.useState(undefined);

  const initialRange = React.useMemo(() => {
    return range;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    setRange(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  React.useEffect(() => {
    if (range) {
      setMonth(range.from);
    }
  }, [range]);

  React.useEffect(() => {
    if (!open) {
      setMonth(range?.from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onPresetSelect = (preset) => {
    const newRange = preset.value;
    if (showTimePicker) {
      if (newRange?.from && !startTime) {
        setStartTime(new Time(0, 0, 0, 0));
      }

      if (newRange?.to && !endTime) {
        setEndTime(new Time(0, 0, 0, 0));
      }

      if (newRange?.from && startTime) {
        setStartTime(
          new Time(
            newRange.from.getHours(),
            newRange.from.getMinutes(),
            newRange.from.getSeconds(),
            newRange.from.getMilliseconds(),
          ),
        );
      }

      if (newRange?.to && endTime) {
        setEndTime(
          new Time(
            newRange.to.getHours(),
            newRange.to.getMinutes(),
            newRange.to.getSeconds(),
            newRange.to.getMilliseconds(),
          ),
        );
      }
    }

    setRange(newRange);
    setLabelSelected(preset.label);
  };

  const onRangeChange = (newRange) => {
    if (showTimePicker) {
      if (newRange?.from && !startTime) {
        setStartTime(new Time(0, 0, 0, 0));
      }

      if (newRange?.to && !endTime) {
        setEndTime(new Time(0, 0, 0, 0));
      }

      if (newRange?.from && startTime) {
        newRange.from.setHours(startTime.hour);
        newRange.from.setMinutes(startTime.minute);
        newRange.from.setSeconds(startTime.second);
        newRange.from.setMilliseconds(startTime.millisecond);
      }

      if (newRange?.to && endTime) {
        newRange.from.setHours(endTime.hour);
        newRange.from.setMinutes(endTime.minute);
        newRange.from.setSeconds(endTime.second);
        newRange.from.setMilliseconds(endTime.millisecond);
      }
    }

    setRange(newRange);
    setLabelSelected(undefined);
  };

  const onCancel = () => {
    setRange(initialRange);
    setStartTime(
      initialRange?.from
        ? new Time(
            initialRange.from.getHours(),
            initialRange.from.getMinutes(),
            initialRange.from.getSeconds(),
            initialRange.from.getMilliseconds(),
          )
        : new Time(0, 0, 0, 0),
    );
    setEndTime(
      initialRange?.to
        ? new Time(
            initialRange.to.getHours(),
            initialRange.to.getMinutes(),
            initialRange.to.getSeconds(),
            initialRange.to.getMilliseconds(),
          )
        : new Time(0, 0, 0, 0),
    );
    setOpen(false);
    setLabelSelected(undefined);
  };

  const onOpenChange = (open) => {
    if (!open) {
      onCancel();
    }

    setOpen(open);
  };

  const onTimeChange = (time, pos) => {
    switch (pos) {
      case "start":
        setStartTime(time);
        break;
      case "end":
        setEndTime(time);
        break;
    }

    if (!range) {
      return;
    }

    if (pos === "start") {
      if (!range.from) {
        return;
      }

      const newDate = new Date(range.from.getTime());

      if (!time) {
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
      } else {
        newDate.setHours(time.hour);
        newDate.setMinutes(time.minute);
        newDate.setSeconds(time.second);
        newDate.setMilliseconds(time.millisecond);
      }

      setRange({
        ...range,
        from: newDate,
      });
    }

    if (pos === "end") {
      if (!range.to) {
        return;
      }

      const newDate = new Date(range.to.getTime());

      if (!time) {
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
      } else {
        newDate.setHours(time.hour);
        newDate.setMinutes(time.minute);
        newDate.setSeconds(time.second);
        newDate.setMilliseconds(time.millisecond);
      }

      setRange({
        ...range,
        to: newDate,
      });
    }
  };

  React.useEffect(() => {
    setRange(value ?? defaultValue ?? undefined);

    setStartTime(
      value?.from
        ? new Time(
            value.from.getHours(),
            value.from.getMinutes(),
            value.from.getSeconds(),
            value.from.getMilliseconds(),
          )
        : defaultValue?.from
          ? new Time(
              defaultValue.from.getHours(),
              defaultValue.from.getMinutes(),
              defaultValue.from.getSeconds(),
              defaultValue.from.getMilliseconds(),
            )
          : new Time(0, 0, 0, 0),
    );
    setEndTime(
      value?.to
        ? new Time(
            value.to.getHours(),
            value.to.getMinutes(),
            value.to.getSeconds(),
            value.to.getMilliseconds(),
          )
        : defaultValue?.to
          ? new Time(
              defaultValue.to.getHours(),
              defaultValue.to.getMinutes(),
              defaultValue.to.getSeconds(),
              defaultValue.to.getMilliseconds(),
            )
          : new Time(0, 0, 0, 0),
    );
  }, [value, defaultValue]);

  const displayRange = React.useMemo(() => {
    if (!range) {
      return null;
    }

    return `${
      range.from
        ? formatDate(range.from, locale, showTimePicker, granularity)
        : ""
    } - ${range.to ? formatDate(range.to, locale, showTimePicker, granularity) : ""}`;
  }, [range, locale, showTimePicker, granularity]);

  const onApply = () => {
    setOpen(false);
    setLabelSelected(undefined);
    onChange?.(range);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Trigger
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            hasError={hasError}
            aria-required={props.required || props["aria-required"]}
            aria-invalid={props["aria-invalid"]}
            aria-label={props["aria-label"]}
            aria-labelledby={props["aria-labelledby"]}
          >
            {displayRange}
          </Trigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>Time range controls</TooltipContent>
      </Tooltip>

      <CalendarPopover align={align}>
        <div className="flex">
          <div className="flex flex-col overflow-x-auto sm:flex-row sm:items-start">
            {presets && presets.length > 0 && (
              <div
                className={cn(
                  "relative flex h-16 w-full items-center sm:h-full sm:w-40",
                  "border-b border-gray-300 dark:border-gray-800 sm:border-b-0 sm:border-r",
                  "overflow-auto",
                )}
              >
                <div className="absolute px-3 sm:inset-0 sm:left-0 sm:p-2">
                  <PresetContainer
                    currentLabel={labelSelected}
                    presets={presets}
                    onSelect={onPresetSelect}
                  />
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <CalendarPrimitive
                mode="range"
                selected={range}
                onSelect={onRangeChange}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={2}
                disabled={disabledDays}
                disableNavigation={disableNavigation}
                enableYearNavigation={enableYearNavigation}
                locale={locale}
                initialFocus
                className="overflow-x-auto"
                classNames={{
                  months:
                    "flex flex-row divide-x divide-gray-300 dark:divide-gray-800 overflow-x-auto",
                }}
                {...props}
              />
              {showTimePicker && (
                <div className="flex items-center justify-evenly gap-x-1 overflow-x-auto border-t border-gray-300 p-3 dark:border-gray-800">
                  <div className="flex flex-1 items-center gap-x-2">
                    <span className="dark:text-gray-30 text-gray-700">
                      {translations?.start ?? "Start"}:
                    </span>
                    <TimeInput
                      value={startTime}
                      onChange={(v) => onTimeChange(v, "start")}
                      aria-label="Start date time"
                      isDisabled={!range?.from}
                      isRequired={props.required}
                      granularity={granularity}
                    />
                  </div>
                  <Minus className="size-4 shrink-0 text-gray-400" />
                  <div className="flex flex-1 items-center gap-x-2">
                    <span className="dark:text-gray-30 text-gray-700">
                      {translations?.end ?? "End"}:
                    </span>
                    <TimeInput
                      value={endTime}
                      onChange={(v) => onTimeChange(v, "end")}
                      aria-label="End date time"
                      isDisabled={!range?.to}
                      isRequired={props.required}
                      granularity={granularity}
                    />
                  </div>
                </div>
              )}
              <div className="border-t border-gray-300 p-3 dark:border-gray-800 sm:flex sm:items-center sm:justify-between sm:gap-x-2">
                <div className="flex w-full">
                  <p className="w-0 flex-1 tabular-nums text-gray-900 dark:text-gray-50">
                    <span className="text-gray-700 dark:text-gray-300">
                      {translations?.range ?? "Range"}:
                    </span>{" "}
                    <span className="font-medium">{displayRange}</span>
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-x-2 sm:mt-0">
                  <Button
                    variant="outline"
                    className="h-8 w-full px-3 sm:w-fit"
                    type="button"
                    onClick={onCancel}
                  >
                    {translations?.cancel ?? "Cancel"}
                  </Button>
                  <Button
                    className="h-8 w-full px-3 sm:w-fit"
                    type="button"
                    onClick={onApply}
                  >
                    {translations?.apply ?? "Apply"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </Popover>
  );
};

// #region Preset Validation
// ============================================================================

const generatePresets = (presets) => {
  if (!presets) {
    return presets;
  }
  return presets.map((preset) => {
    if ("generate" in preset) {
      return {
        ...preset,
        value: preset.generate(),
      };
    }
    return preset;
  });
};

const validatePresets = (presets, rules) => {
  const { toYear, fromYear, fromMonth, toMonth, fromDay, toDay } = rules;

  if (presets && presets.length > 0) {
    const fromYearToUse = fromYear;
    const toYearToUse = toYear;

    presets.forEach((preset) => {
      if ("date" in preset) {
        const presetYear = preset.date.getFullYear();

        if (fromYear && presetYear < fromYear) {
          throw new Error(
            `Preset ${preset.label} is before fromYear ${fromYearToUse}.`,
          );
        }

        if (toYear && presetYear > toYear) {
          throw new Error(
            `Preset ${preset.label} is after toYear ${toYearToUse}.`,
          );
        }

        if (fromMonth) {
          const presetMonth = preset.date.getMonth();

          if (presetMonth < fromMonth.getMonth()) {
            throw new Error(
              `Preset ${preset.label} is before fromMonth ${fromMonth}.`,
            );
          }
        }

        if (toMonth) {
          const presetMonth = preset.date.getMonth();

          if (presetMonth > toMonth.getMonth()) {
            throw new Error(
              `Preset ${preset.label} is after toMonth ${toMonth}.`,
            );
          }
        }

        if (fromDay) {
          const presetDay = preset.date.getDate();

          if (presetDay < fromDay.getDate()) {
            throw new Error(
              `Preset ${preset.label} is before fromDay ${fromDay}.`,
            );
          }
        }

        if (toDay) {
          const presetDay = preset.date.getDate();

          if (presetDay > toDay.getDate()) {
            throw new Error(
              `Preset ${preset.label} is after toDay ${format(
                toDay,
                "MMM dd, yyyy",
              )}.`,
            );
          }
        }
      }

      if ("dateRange" in preset) {
        const presetFromYear = preset.dateRange.from?.getFullYear();
        const presetToYear = preset.dateRange.to?.getFullYear();

        if (presetFromYear && fromYear && presetFromYear < fromYear) {
          throw new Error(
            `Preset ${preset.label}'s 'from' is before fromYear ${fromYearToUse}.`,
          );
        }

        if (presetToYear && toYear && presetToYear > toYear) {
          throw new Error(
            `Preset ${preset.label}'s 'to' is after toYear ${toYearToUse}.`,
          );
        }

        if (fromMonth) {
          const presetMonth = preset.dateRange.from?.getMonth();

          if (presetMonth && presetMonth < fromMonth.getMonth()) {
            throw new Error(
              `Preset ${preset.label}'s 'from' is before fromMonth ${format(
                fromMonth,
                "MMM, yyyy",
              )}.`,
            );
          }
        }

        if (toMonth) {
          const presetMonth = preset.dateRange.to?.getMonth();

          if (presetMonth && presetMonth > toMonth.getMonth()) {
            throw new Error(
              `Preset ${preset.label}'s 'to' is after toMonth ${format(
                toMonth,
                "MMM, yyyy",
              )}.`,
            );
          }
        }

        if (fromDay) {
          const presetDay = preset.dateRange.from?.getDate();

          if (presetDay && presetDay < fromDay.getDate()) {
            throw new Error(
              `Preset ${
                preset.dateRange.from
              }'s 'from' is before fromDay ${format(fromDay, "MMM dd, yyyy")}.`,
            );
          }
        }

        if (toDay) {
          const presetDay = preset.dateRange.to?.getDate();

          if (presetDay && presetDay > toDay.getDate()) {
            throw new Error(
              `Preset ${preset.label}'s 'to' is after toDay ${format(
                toDay,
                "MMM dd, yyyy",
              )}.`,
            );
          }
        }
      }
    });
  }
};

const DatePicker = ({ presets, ...props }) => {
  if (presets) {
    presets = generatePresets(presets);
    validatePresets(presets, props);
  }

  return <SingleDatePicker presets={presets} {...props} />;
};

DatePicker.displayName = "DatePicker";

const DateRangePicker = ({ presets, ...props }) => {
  if (presets) {
    presets = generatePresets(presets);
    validatePresets(presets, props);
  }

  return <RangeDatePicker presets={presets} {...props} />;
};

DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker };
