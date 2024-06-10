import { Text } from "recharts";

export const XTick = ({ x, y, payload }) => (
  <Text
    x={x}
    y={y}
    className="text-xs"
    width={100}
    textAnchor="middle"
    verticalAnchor="start"
  >
    {payload.value}
  </Text>
);

XTick.displayName = "XTick";

export const YTick = ({ x, y, payload }) => (
  <Text
    x={x}
    y={y}
    className="text-xs"
    width={72}
    textAnchor="end"
    verticalAnchor="middle"
    breakAll
    maxLines={2}
  >
    {payload.value}
  </Text>
);

YTick.displayName = "YTick";
