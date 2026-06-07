import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

export const Analytics = () => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0 bg-blue-50">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Sanctioned Posts"
            value={900}
            variant={0 > 0 ? "up" : "down"}
            increaseValue={0}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Working Staff"
            value={750}
            variant={10 > 0 ? "up" : "down"}
            increaseValue={10}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Vacant Posts"
            value={150}
            variant={-1 > 0 ? "up" : "down"}
            increaseValue={-1}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Present Staff"
            value={500}
            variant={10 > 0 ? "up" : "down"}
            increaseValue={10}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Absent Staff"
            value={200}
            variant={-1 > 0 ? "up" : "down"}
            increaseValue={-1}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Staffs on Leave"
            value={50}
            variant={5 > 0 ? "up" : "down"}
            increaseValue={5}
          />
        </div>
      </div>
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Public Servants"
            value={500}
            variant={10 > 0 ? "up" : "down"}
            increaseValue={10}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Civil Servants"
            value={200}
            variant={-1 > 0 ? "up" : "down"}
            increaseValue={-1}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Visiting Faculty"
            value={50}
            variant={5 > 0 ? "up" : "down"}
            increaseValue={5}
          />
        </div>
      </div>
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Teaching Staff"
            value={500}
            variant={0 > 0 ? "up" : "down"}
            increaseValue={0}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Non-Teaching Staff"
            value={250}
            variant={10 > 0 ? "up" : "down"}
            increaseValue={10}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Male Staff"
            value={600}
            variant={-1 > 0 ? "up" : "down"}
            increaseValue={-1}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Female Staff"
            value={150}
            variant={-1 > 0 ? "up" : "down"}
            increaseValue={-1}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
