import traceService from "@/api/trace";
import ThundraTraceChart from "@/components/trace";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { transformBase64ToHex } from "./data/utils";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

const palette = ["#00a2ea", "#01ab7e", "#f75810", "#4c3571"];
const serviceMap = {};

export default function TraceFlyout({ traceID }) {
  const [open, setDataOpen] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataDetails, setDataDetails] = React.useState({});

  const getTrace = async (traceID, params) => {
    setDataLoading(true);
    try {
      const resp = await traceService.getTrace(traceID, params);
      const spans = [];
      const spanDetails = {};
      for (const batch of resp.batches) {
        const serviceName =
          batch.resource.attributes.find((a) => a.key === "service.name")?.value
            ?.stringValue ?? "";
        const color =
          serviceMap[serviceName] ??
          palette[Object.keys(serviceMap).length % palette.length];
        serviceMap[serviceName] = color;

        for (const scopeSpan of batch.scopeSpans) {
          for (const span of scopeSpan.spans) {
            const spanID = span.spanId ? transformBase64ToHex(span.spanId) : "";
            const parentSpanID = span.parentSpanId
              ? transformBase64ToHex(span.parentSpanId)
              : "";

            spans.push({
              id: spanID,
              traceId: traceID,
              parentId: parentSpanID,
              name: span.name,
              timestamp: span.startTimeUnixNano / 1e3,
              duration: (span.endTimeUnixNano - span.startTimeUnixNano) / 1e3,
              kind: span.kind,
              serviceName,
              color,
              icon:
                span.status?.code === "STATUS_CODE_ERROR" ? (
                  <CircleX className="mr-1 h-4 w-4" color="red" />
                ) : null,
            });

            const sm = span.status.message;
            const sa = span.attributes?.reduce((acc, attr) => {
              acc[attr.key] = attr.value[Object.keys(attr.value)[0]];
              return acc;
            }, {});
            const ra = batch.resource?.attributes.reduce((acc, attr) => {
              acc[attr.key] = attr.value[Object.keys(attr.value)[0]];
              return acc;
            }, {});
            spanDetails[spanID] = (
              <div className="w-full space-y-2 text-wrap break-all">
                {sm && (
                  <div>
                    Status Message:{" "}
                    <span className="text-muted-foreground">{sm}</span>
                  </div>
                )}
                {sa && (
                  <div>
                    Span Attributes:{" "}
                    <JsonView src={sa} className="text-sm" collapsed />
                  </div>
                )}
                {ra && (
                  <div>
                    Resource Attributes:{" "}
                    <JsonView src={ra} className="text-sm" collapsed />
                  </div>
                )}
              </div>
            );
          }
        }
      }
      setData(spans);
      setDataDetails(spanDetails);
    } catch (error) {
      const msg = error.response?.data?.message ?? error.message;
      toast.error("Trace", {
        description: msg,
        action: { label: "Hide", onClick: () => {} },
      });
      setData([]);
    } finally {
      setDataLoading(false);
    }
  };

  const handleOnOpenChange = (open) => {
    setDataOpen(open);
    if (!open) return;
    getTrace(traceID);
  };

  return (
    <Sheet open={open} onOpenChange={handleOnOpenChange}>
      <SheetTrigger asChild>
        <Link className="underline">
          <pre className="max-w-[100px] truncate">{traceID}</pre>
        </Link>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "flex h-screen min-w-full flex-col md:min-w-[87.5vw] lg:min-w-[66vw]",
          "focus:outline-none",
        )}
      >
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75}>
            {(data?.length || 0) > 0 ? (
              <ScrollArea className="h-full w-full">
                <ThundraTraceChart
                  traceId={traceID}
                  traceSummary={data}
                  spanDetails={dataDetails}
                  showSpanDetail={true}
                  serviceNameColumnTitle="Service"
                  spanInfoColumnTitle="Operation"
                  disabledCriticalPath
                />
                <ScrollBar orientation="vertical" className="z-10" />
                <ScrollBar orientation="horizontal" className="z-10" />
              </ScrollArea>
            ) : (
              <SheetHeader className="mt-3 [&_h2]:font-medium">
                <SheetTitle>Trace</SheetTitle>
                <SheetDescription>
                  {dataLoading ? "Loading..." : "No trace found for this ID."}
                </SheetDescription>
              </SheetHeader>
            )}
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25}>
            <SheetHeader className="mt-3 [&_h2]:font-medium">
              <SheetTitle>Logs</SheetTitle>
              <SheetDescription>No logs found for this trace.</SheetDescription>
            </SheetHeader>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SheetContent>
    </Sheet>
  );
}
