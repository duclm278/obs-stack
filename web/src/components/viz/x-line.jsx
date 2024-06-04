// Tremor Raw LineChart [v0.1.0]

import { ScrollBar } from "@/components/ui/scroll-area";
import {
  AvailableChartColors,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
  hasOnlyOneValueForKey,
} from "@/lib/chart-utils";
import { cn } from "@/lib/utils";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import {
  CartesianGrid,
  Dot,
  Label,
  Line,
  Legend as RechartsLegend,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LegendItem = ({ name, color, onClick, activeLegend }) => {
  const hasOnValueChange = !!onClick;
  return (
    <li
      className={cn(
        // base
        "group inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 transition",
        hasOnValueChange
          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          : "cursor-default",
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(name, color);
      }}
    >
      <span
        className={cn(
          "h-[3px] w-3.5 shrink-0 rounded-full",
          getColorClassName(color, "bg"),
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100",
        )}
        aria-hidden={true}
      />
      <p
        className={cn(
          // base
          "truncate whitespace-nowrap text-xs",
          // text color
          "text-gray-700 dark:text-gray-300",
          hasOnValueChange &&
            "group-hover:text-gray-900 dark:group-hover:text-gray-50",
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100",
        )}
      >
        {name}
      </p>
    </li>
  );
};

const ScrollButton = ({ icon, onClick, disabled }) => {
  const Icon = icon;
  const [isPressed, setIsPressed] = React.useState(false);
  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    if (isPressed) {
      intervalRef.current = setInterval(() => {
        onClick?.();
      }, 300);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPressed, onClick]);

  React.useEffect(() => {
    if (disabled) {
      clearInterval(intervalRef.current);
      setIsPressed(false);
    }
  }, [disabled]);

  return (
    <button
      type="button"
      className={cn(
        // base
        "group inline-flex size-5 items-center truncate rounded transition",
        disabled
          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
          : "cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      )}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setIsPressed(true);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        setIsPressed(false);
      }}
    >
      <Icon className="size-full" aria-hidden="true" />
    </button>
  );
};

const Legend = React.forwardRef((props, ref) => {
  const {
    categories,
    colors = AvailableChartColors,
    className,
    onClickLegendItem,
    activeLegend,
    enableLegendSlider = false,
    ...other
  } = props;
  const scrollableRef = React.useRef(null);
  const [hasScroll, setHasScroll] = React.useState(null);
  const [isKeyDowned, setIsKeyDowned] = React.useState(null);
  const intervalRef = React.useRef(null);

  const checkScroll = React.useCallback(() => {
    const scrollable = scrollableRef?.current;
    if (!scrollable) return;

    const hasLeftScroll = scrollable.scrollLeft > 0;
    const hasRightScroll =
      scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft;

    setHasScroll({ left: hasLeftScroll, right: hasRightScroll });
  }, [setHasScroll]);

  const scrollToTest = React.useCallback(
    (direction) => {
      const element = scrollableRef?.current;
      const width = element?.clientWidth ?? 0;

      if (element && enableLegendSlider) {
        element.scrollTo({
          left:
            direction === "left"
              ? element.scrollLeft - width
              : element.scrollLeft + width,
          behavior: "smooth",
        });
        setTimeout(() => {
          checkScroll();
        }, 400);
      }
    },
    [enableLegendSlider, checkScroll],
  );

  React.useEffect(() => {
    const keyDownHandler = (key) => {
      if (key === "ArrowLeft") {
        scrollToTest("left");
      } else if (key === "ArrowRight") {
        scrollToTest("right");
      }
    };
    if (isKeyDowned) {
      keyDownHandler(isKeyDowned);
      intervalRef.current = setInterval(() => {
        keyDownHandler(isKeyDowned);
      }, 300);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isKeyDowned, scrollToTest]);

  const keyDown = (e) => {
    e.stopPropagation();
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setIsKeyDowned(e.key);
    }
  };
  const keyUp = (e) => {
    e.stopPropagation();
    setIsKeyDowned(null);
  };

  React.useEffect(() => {
    const scrollable = scrollableRef?.current;
    if (enableLegendSlider) {
      checkScroll();
      scrollable?.addEventListener("keydown", keyDown);
      scrollable?.addEventListener("keyup", keyUp);
    }

    return () => {
      scrollable?.removeEventListener("keydown", keyDown);
      scrollable?.removeEventListener("keyup", keyUp);
    };
  }, [checkScroll, enableLegendSlider]);

  return (
    <ol
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...other}
    >
      <div
        ref={scrollableRef}
        tabIndex={0}
        className={cn(
          "flex h-full",
          enableLegendSlider
            ? hasScroll?.right || hasScroll?.left
              ? "snap-mandatory items-center overflow-auto pl-4 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : ""
            : "flex-wrap",
        )}
      >
        {categories.map((category, index) => (
          <LegendItem
            key={`item-${index}`}
            name={category}
            color={colors[index]}
            onClick={onClickLegendItem}
            activeLegend={activeLegend}
          />
        ))}
      </div>
      {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
        <>
          <div
            className={cn(
              // base
              "absolute bottom-0 right-0 top-0 flex h-full items-center justify-center pr-1",
              // background color
              "bg-white dark:bg-gray-950",
            )}
          >
            <ScrollButton
              icon={ChevronLeft}
              onClick={() => {
                setIsKeyDowned(null);
                scrollToTest("left");
              }}
              disabled={!hasScroll?.left}
            />
            <ScrollButton
              icon={ChevronRight}
              onClick={() => {
                setIsKeyDowned(null);
                scrollToTest("right");
              }}
              disabled={!hasScroll?.right}
            />
          </div>
        </>
      ) : null}
    </ol>
  );
});

Legend.displayName = "Legend";

const ChartLegend = (
  { payload },
  categoryColors,
  setLegendHeight,
  activeLegend,
  onClick,
  enableLegendSlider,
  legendPosition,
) => {
  const legendRef = React.useRef(null);

  const filteredPayload = payload.filter((item) => item.type !== "none");

  return (
    <ScrollAreaPrimitive.Root className="relative overflow-hidden">
      <ScrollAreaPrimitive.Viewport className="max-h-60 w-full rounded-[inherit]">
        <div
          ref={legendRef}
          className={cn(
            "flex items-center",
            { "justify-center": legendPosition === "center" },
            { "justify-start": legendPosition === "left" },
            { "justify-end": legendPosition === "right" },
          )}
        >
          <Legend
            categories={filteredPayload.map((entry) => entry.value)}
            colors={filteredPayload.map((entry) =>
              categoryColors.get(entry.value),
            )}
            onClickLegendItem={onClick}
            activeLegend={activeLegend}
            enableLegendSlider={enableLegendSlider}
          />
        </div>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollAreaPrimitive.Root>
  );
};

const ChartTooltipRow = ({ value, name, color }) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        aria-hidden="true"
        className={cn("h-[3px] w-3.5 shrink-0 rounded-full", color)}
      />
      <p
        className={cn(
          // commmon
          "line-clamp-3 max-w-sm overflow-hidden text-ellipsis break-all text-left",
          // text color
          "text-gray-700 dark:text-gray-300",
        )}
      >
        {name}
      </p>
    </div>
    <p
      className={cn(
        // base
        "whitespace-nowrap text-right font-medium tabular-nums",
        // text color
        "text-gray-900 dark:text-gray-50",
      )}
    >
      {value}
    </p>
  </div>
);

const ChartTooltip = ({
  active,
  payload,
  label,
  categoryColors,
  valueFormatter,
}) => {
  if (active && payload) {
    const filteredPayload = payload.filter((item) => item.type !== "none");

    return (
      <div
        className={cn(
          // base
          "rounded-md border text-sm shadow-md",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950",
        )}
      >
        <div
          className={cn(
            // base
            "border-b border-inherit px-4 py-2",
          )}
        >
          <p
            className={cn(
              // base
              "font-medium",
              // text color
              "text-gray-900 dark:text-gray-50",
            )}
          >
            {label}
          </p>
        </div>

        <div className={cn("space-y-1 px-4 py-2")}>
          {filteredPayload.map(({ value, name }, index) => (
            <ChartTooltipRow
              key={`id-${index}`}
              value={valueFormatter(value)}
              name={name}
              color={getColorClassName(categoryColors.get(name), "bg")}
            />
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const LineChart = React.forwardRef((props, ref) => {
  const {
    data = [],
    categories = [],
    index,
    colors = AvailableChartColors,
    yAxisValueFormatter = (value) => value.toString(),
    tooltipValueFormatter = (value) => value.toString(),
    startEndOnly = false,
    showXAxis = true,
    showYAxis = true,
    xAxisHeight = 32,
    yAxisWidth = 56,
    intervalType = "equidistantPreserveStart",
    animationDuration = 900,
    showAnimation = false,
    showTooltip = true,
    showLegend = true,
    showGridLines = true,
    autoMinValue = false,
    curveType = "linear",
    minValue,
    maxValue,
    connectNulls = false,
    allowDecimals = true,
    // noDataText
    className,
    onValueChange,
    enableLegendSlider = false,
    // customTooltip
    // rotateLabelX,
    tickGap = 5,
    xAxisLabel,
    yAxisLabel,
    legendPosition = "right",
    ...other
  } = props;
  const paddingValue = !showXAxis && !showYAxis ? 0 : 20;
  const [legendHeight, setLegendHeight] = React.useState(60);
  const [activeDot, setActiveDot] = React.useState(undefined);
  const [activeLegend, setActiveLegend] = React.useState(undefined);
  const categoryColors = constructCategoryColors(categories, colors);

  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
  const hasOnValueChange = !!onValueChange;

  function onDotClick(itemData, event) {
    event.stopPropagation();

    if (!hasOnValueChange) return;
    if (
      (itemData.index === activeDot?.index &&
        itemData.dataKey === activeDot?.dataKey) ||
      (hasOnlyOneValueForKey(data, itemData.dataKey) &&
        activeLegend &&
        activeLegend === itemData.dataKey)
    ) {
      setActiveLegend(undefined);
      setActiveDot(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(itemData.dataKey);
      setActiveDot({
        index: itemData.index,
        dataKey: itemData.dataKey,
      });
      onValueChange?.({
        eventType: "dot",
        categoryClicked: itemData.dataKey,
        ...itemData.payload,
      });
    }
  }

  function onCategoryClick(dataKey) {
    if (!hasOnValueChange) return;
    if (
      (dataKey === activeLegend && !activeDot) ||
      (hasOnlyOneValueForKey(data, dataKey) &&
        activeDot &&
        activeDot.dataKey === dataKey)
    ) {
      setActiveLegend(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dataKey);
      onValueChange?.({
        eventType: "category",
        categoryClicked: dataKey,
      });
    }
    setActiveDot(undefined);
  }

  return (
    <div ref={ref} className={cn("h-80 w-full", className)} {...other}>
      <ResponsiveContainer>
        <RechartsLineChart
          data={data}
          onClick={
            hasOnValueChange && (activeLegend || activeDot)
              ? () => {
                  setActiveDot(undefined);
                  setActiveLegend(undefined);
                  onValueChange?.(null);
                }
              : undefined
          }
          margin={{
            bottom: xAxisLabel ? 30 : undefined,
            left: yAxisLabel ? 20 : undefined,
            right: yAxisLabel ? 5 : undefined,
            top: 5,
          }}
        >
          {showGridLines ? (
            <CartesianGrid
              className={cn("stroke-gray-200 stroke-1 dark:stroke-gray-800")}
              horizontal={true}
              vertical={false}
            />
          ) : null}
          <XAxis
            height={xAxisHeight}
            padding={{ left: paddingValue, right: paddingValue }}
            hide={!showXAxis}
            dataKey={index}
            interval={startEndOnly ? "preserveStartEnd" : intervalType}
            tick={{ transform: "translate(0, 6)" }}
            ticks={
              startEndOnly
                ? [data[0][index], data[data.length - 1][index]]
                : undefined
            }
            fill=""
            stroke=""
            className={cn(
              // base
              "text-xs",
              // text fill
              "fill-gray-500 dark:fill-gray-500",
            )}
            tickLine={false}
            axisLine={false}
            minTickGap={tickGap}
          >
            {xAxisLabel && (
              <Label
                position="insideBottom"
                offset={-20}
                className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
              >
                {xAxisLabel}
              </Label>
            )}
          </XAxis>
          <YAxis
            width={yAxisWidth}
            hide={!showYAxis}
            axisLine={false}
            tickLine={false}
            type="number"
            domain={yAxisDomain}
            tick={{ transform: "translate(-3, 0)" }}
            fill=""
            stroke=""
            className={cn(
              // base
              "text-xs",
              // text fill
              "fill-gray-500 dark:fill-gray-500",
            )}
            tickFormatter={yAxisValueFormatter}
            allowDecimals={allowDecimals}
          >
            {yAxisLabel && (
              <Label
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                angle={-90}
                offset={-15}
                className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
              >
                {yAxisLabel}
              </Label>
            )}
          </YAxis>
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            isAnimationActive={true}
            animationDuration={100}
            cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
            offset={20}
            position={{ y: 0 }}
            content={
              showTooltip ? (
                ({ active, payload, label }) => (
                  <ChartTooltip
                    active={active}
                    payload={payload}
                    label={label}
                    valueFormatter={tooltipValueFormatter}
                    categoryColors={categoryColors}
                  />
                )
              ) : (
                <></>
              )
            }
          />
          {showLegend ? (
            <RechartsLegend
              verticalAlign="bottom"
              height={legendHeight}
              content={({ payload }) =>
                ChartLegend(
                  { payload },
                  categoryColors,
                  setLegendHeight,
                  activeLegend,
                  hasOnValueChange
                    ? (clickedLegendItem) => onCategoryClick(clickedLegendItem)
                    : undefined,
                  enableLegendSlider,
                  legendPosition,
                )
              }
            />
          ) : null}
          {categories.map((category) => (
            <Line
              className={cn(
                getColorClassName(categoryColors.get(category), "stroke"),
              )}
              strokeOpacity={
                activeDot || (activeLegend && activeLegend !== category)
                  ? 0.3
                  : 1
              }
              activeDot={(props) => {
                const {
                  cx: cxCoord,
                  cy: cyCoord,
                  stroke,
                  strokeLinecap,
                  strokeLinejoin,
                  strokeWidth,
                  dataKey,
                } = props;
                return (
                  <Dot
                    className={cn(
                      "stroke-white dark:stroke-gray-950",
                      onValueChange ? "cursor-pointer" : "",
                      getColorClassName(categoryColors.get(dataKey), "fill"),
                    )}
                    cx={cxCoord}
                    cy={cyCoord}
                    r={5}
                    fill=""
                    stroke={stroke}
                    strokeLinecap={strokeLinecap}
                    strokeLinejoin={strokeLinejoin}
                    strokeWidth={strokeWidth}
                    onClick={(_, event) => onDotClick(props, event)}
                  />
                );
              }}
              dot={(props) => {
                const {
                  stroke,
                  strokeLinecap,
                  strokeLinejoin,
                  strokeWidth,
                  cx: cxCoord,
                  cy: cyCoord,
                  dataKey,
                  index,
                } = props;

                if (
                  (hasOnlyOneValueForKey(data, category) &&
                    !(
                      activeDot ||
                      (activeLegend && activeLegend !== category)
                    )) ||
                  (activeDot?.index === index &&
                    activeDot?.dataKey === category)
                ) {
                  return (
                    <Dot
                      key={index}
                      cx={cxCoord}
                      cy={cyCoord}
                      r={5}
                      stroke={stroke}
                      fill=""
                      strokeLinecap={strokeLinecap}
                      strokeLinejoin={strokeLinejoin}
                      strokeWidth={strokeWidth}
                      className={cn(
                        "stroke-white dark:stroke-gray-950",
                        onValueChange ? "cursor-pointer" : "",
                        getColorClassName(categoryColors.get(dataKey), "fill"),
                      )}
                    />
                  );
                }
                return <React.Fragment key={index}></React.Fragment>;
              }}
              key={category}
              name={category}
              type={curveType}
              dataKey={category}
              stroke=""
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              isAnimationActive={showAnimation}
              animationDuration={animationDuration}
              connectNulls={connectNulls}
            />
          ))}
          {/* hidden lines to increase clickable target area */}
          {onValueChange
            ? categories.map((category) => (
                <Line
                  className={cn("cursor-pointer")}
                  strokeOpacity={0}
                  key={category}
                  name={category}
                  type={curveType}
                  dataKey={category}
                  stroke="transparent"
                  fill="transparent"
                  legendType="none"
                  tooltipType="none"
                  strokeWidth={12}
                  connectNulls={connectNulls}
                  onClick={(props, event) => {
                    event.stopPropagation();
                    const { name } = props;
                    onCategoryClick(name);
                  }}
                />
              ))
            : null}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
});

LineChart.displayName = "LineChart";

export { LineChart };
